import { getApiKey, getComplaints, getComplaintById } from './db.js';
import { routeQuery } from './router.js';
import { retrieveContext } from './rag.js';
import { getTranslation } from './translate.js';

export { SERVICES_DB } from './kb.js';

// Live Gemini API Connector
async function callGeminiRAG(query, chunks, apiKey, lang) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  // Format context block from matching chunks
  const contextBlock = chunks.length > 0 
    ? chunks.map(c => `[Source: ${c.title}]\n${c.text}`).join('\n\n')
    : "No direct official document passages were found in the local knowledge base.";

  const prompt = `
You are "Sahayta AI", the official intelligent civic companion for the "Smart Bharat" portal.
Your goal is to simplify complex government information, answer citizen queries, recommend public services, and assist with document guidelines.

Here is the retrieved official government documentation context related to the query:
------------------
${contextBlock}
------------------

Citizen query: "${query}"

Instructions:
1. Simplify the retrieved government information and answer the query clearly and directly.
2. If the retrieved context contains the answer, prioritize using it.
3. Keep the layout neat using clean bullet points and markdown.
4. The citizen has selected the language code: "${lang}". You MUST reply strictly in the requested language (e.g. Hindi if "hi", Tamil if "ta", English if "en").
`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini RAG API Error:", error);
    return `**Gemini API Error:** ${error.message}\n\n*Falling back to Offline RAG Mode response...*\n\n` + formatOfflineRAGResponse(query, chunks, lang);
  }
}

// Formats response for offline RAG mode (when no API key is set)
function formatOfflineRAGResponse(query, chunks, lang) {
  const isHindi = lang === 'hi';
  const isTamil = lang === 'ta';

  if (chunks.length === 0) {
    if (isHindi) {
      return `नमस्ते! मैं आपका सहायता AI नागरिक साथी हूँ। मुझे आपके प्रश्न से संबंधित कोई आधिकारिक सरकारी दस्तावेज़ नहीं मिला।\n\nकृपया इन विषयों के बारे में पूछें: **आधार**, **पैन कार्ड**, **पासपोर्ट**, **पीएम किसान योजना**, या **आयुष्मान भारत**।\n\n*ऑफ़लाइन RAG मोड: कोई आधिकारिक जानकारी मैच नहीं हुई।*`;
    }
    if (isTamil) {
      return `வணக்கம்! நான் உங்கள் சஹாய்தா AI குடிமகன் துணைவன். உங்கள் கேள்விக்கு தொடர்புடைய அதிகாரப்பூர்வ அரசு ஆவணங்கள் எதுவும் கிடைக்கவில்லை.\n\nதயவுசெய்து **ஆதார்**, **பான் கார்டு**, **பாஸ்போர்ட்**, **பிஎம்-கிசான்** அல்லது **ஆயுஷ்மான் பாரத்** பற்றி கேளுங்கள்.\n\n*ஆஃப்லைன் RAG பயன்முறை: பொருத்தமான தகவல் கிடைக்கவில்லை.*`;
    }
    return `Hello! I am your Sahayta AI companion. I couldn't retrieve any matching government documentation passages for your query.\n\nTry asking about: **Aadhaar updates**, **minor PAN card rules**, **passport Tatkaal fees**, **PM-Kisan land verification**, or **Ayushman Golden Card**.\n\n*Offline RAG Mode: No document matching.*`;
  }

  // Build local answer from top chunk
  const topDoc = chunks[0];
  
  if (isHindi) {
    return `### 📋 आधिकारिक दिशानिर्देश: ${topDoc.title}\n\n${topDoc.text}\n\n---\n*💡 ऑफ़लाइन RAG मोड: स्थानीय ज्ञान आधार से जानकारी प्राप्त की गई है। लाइव एआई उत्तरों के लिए सेटिंग्स में जेमिनी कुंजी दर्ज करें।*`;
  }
  if (isTamil) {
    return `### 📋 அதிகாரப்பூர்வ வழிகாட்டுதல்: ${topDoc.title}\n\n${topDoc.text}\n\n---\n*💡 ஆஃப்லைன் RAG பயன்முறை: உள்ளூர் அறிவுத்தளத்திலிருந்து தகவல் பெறப்பட்டது. நேரடி பதில்களுக்கு அமைப்புகளில் ஜெமினி கீயை உள்ளிடவும்।*`;
  }
  
  return `### 📋 Official Guideline: ${topDoc.title}\n\n${topDoc.text}\n\n---\n*💡 Offline RAG Mode: Retrieved information from local PDF manual chunks. Set your Gemini API key in Settings for live reasoning.*`;
}

// Router and RAG Gateway
export async function askAI(query, lang = "en") {
  const routingResult = routeQuery(query);
  const isHindi = lang === 'hi';
  const isTamil = lang === 'ta';

  // 1. Grievance Tracking intent route
  if (routingResult.intent === "tracking") {
    const id = routingResult.extractedId;
    if (id) {
      const ticket = getComplaintById(id);
      if (ticket) {
        // Localized output formatting
        if (isHindi) {
          return `### 🔍 शिकायत ट्रैकर विवरण:\n\n* **टिकट आईडी:** \`${ticket.id}\`\n* **समस्या:** **${ticket.title}**\n* **वर्तमान स्थिति:** **${ticket.status.toUpperCase()}**\n* **दिनांक:** ${ticket.date}\n* **पता:** ${ticket.location}\n* **विवरण:** ${ticket.description}\n\nआप इस टिकट की विस्तृत प्रगति 'शिकायत ट्रैकर' टैब में भी देख सकते हैं।`;
        }
        if (isTamil) {
          return `### 🔍 புகார் டிராக்கர் விவரங்கள்:\n\n* **புகார் எண்:** \`${ticket.id}\`\n* **தலைப்பு:** **${ticket.title}**\n* **தற்போதைய நிலை:** **${ticket.status.toUpperCase()}**\n* **தேதி:** ${ticket.date}\n* **இடம்:** ${ticket.location}\n* **விளக்கம்:** ${ticket.description}\n\nஇதன் முழு விவரங்களையும் 'புகார் டிராக்கர்' பக்கத்தில் நீங்கள் பார்க்கலாம்.`;
        }
        return `### 🔍 Ticket Tracker Status:\n\n* **Ticket ID:** \`${ticket.id}\`\n* **Issue Title:** **${ticket.title}**\n* **Current Status:** **${ticket.status.toUpperCase()}**\n* **Date Filed:** ${ticket.date}\n* **Location Pin:** ${ticket.location}\n* **Details:** ${ticket.description}\n\n*Note: You can view the live progress stepper for this ticket directly in the 'Track Complaint' tab.*`;
      } else {
        if (isHindi) {
          return `मुझे टिकट आईडी \`${id}\` से संबंधित कोई शिकायत नहीं मिली। कृपया सही आईडी दर्ज करें।`;
        }
        if (isTamil) {
          return `புகார் எண் \`${id}\` காணப்படவில்லை. தயவுசெய்து சரியான எண்ணை உள்ளிடவும்.`;
        }
        return `I couldn't find a complaint ticket with ID \`${id}\`. Please double check the ID or select a ticket from your recent list.`;
      }
    } else {
      // General tracking request (list all tickets)
      const list = getComplaints();
      if (list.length === 0) {
        if (isHindi) return `आपके नाम पर अभी कोई शिकायत दर्ज नहीं है। नया टिकट दर्ज करने के लिए 'शिकायत दर्ज करें' टैब पर जाएं।`;
        if (isTamil) return `உங்களிடம் எந்த புகாரும் இல்லை. புதிய புகாரை பதிவு செய்ய 'புகார் பதிவு' பக்கத்திற்குச் செல்லவும்.`;
        return `You have not registered any grievances yet. Head over to the 'Report Grievance' tab to file a ticket.`;
      }

      let summaryList = list.map(c => `* \`${c.id}\` - **${c.title}** [Status: **${c.status.toUpperCase()}**]`).join('\n');
      
      if (isHindi) {
        return `### 📋 आपकी पंजीकृत शिकायतें:\n\n${summaryList}\n\nउनकी स्थिति देखने के लिए किसी भी आईडी को ऊपर दर्ज करें या सूची से चुनें।`;
      }
      if (isTamil) {
        return `### 📋 உங்கள் புகார்களின் பட்டியல்:\n\n${summaryList}\n\nமேலும் விவரங்களுக்கு புகார் எண்ணை டிராக்கரில் உள்ளிடவும்.`;
      }
      return `### 📋 Your Registered Grievances:\n\n${summaryList}\n\n*To view full progress timelines, type the ticket ID above or click it in the sidebar.*`;
    }
  }

  // 2. Information/Scheme intent route (Retrieve from RAG & query Gemini API)
  const matchingChunks = retrieveContext(routingResult.expandedQuery, 2);
  const apiKey = getApiKey();

  if (apiKey) {
    return await callGeminiRAG(query, matchingChunks, apiKey, lang);
  } else {
    // Local processing simulated delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(formatOfflineRAGResponse(query, matchingChunks, lang));
      }, 600);
    });
  }
}

// Analyze Grievance Backend classification, urgency assessment, and text cleanup
export async function analyzeGrievance(title, description, defaultCategory) {
  const apiKey = getApiKey();

  if (apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}`;
    const prompt = `
You are the processing backend for the Smart Bharat platform. Your job is to analyze citizen-reported grievances, classify them accurately, evaluate risk urgency, and clean up the text for civic administrators.

Input variables:
- title: "\${title}"
- description: "\${description}"
- default_category: "\${defaultCategory}"

You must reply with a structured JSON object containing exactly these fields (do not wrap in markdown blocks, output raw JSON):
{
  "refined_category": "Re-evaluate if the category fits better under ('roads', 'lights', 'waste', 'water')",
  "urgency": "Rate the issue ('low', 'medium', 'critical'). Assign 'critical' ONLY if there is an immediate safety threat (e.g., exposed high-voltage wires, open deep drainage manholes, broken main water pipeline flooding a street)",
  "simplified_summary": "Re-write the user's input into a concise, professional summary for municipal engineers. Strip out emotional language while preserving actionable details (landmarks, times, metrics)."
}
`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
      }
    } catch (error) {
      console.error("Grievance analysis call failed:", error);
    }
  }

  // Local Offline Rule-Based Classifier Fallback
  const text = (title + " " + description).toLowerCase();
  
  // 1. Refined Category
  let refined = defaultCategory;
  if (text.includes("water") || text.includes("sewage") || text.includes("leak") || text.includes("drain") || text.includes("overflow")) {
    refined = "water";
  } else if (text.includes("light") || text.includes("lamp") || text.includes("wire") || text.includes("dark") || text.includes("pole")) {
    refined = "lights";
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("bin") || text.includes("trash") || text.includes("dump")) {
    refined = "waste";
  } else if (text.includes("road") || text.includes("pothole") || text.includes("tar") || text.includes("street")) {
    refined = "roads";
  }

  // 2. Urgency classification rules
  let urgency = "low";
  if (
    text.includes("high voltage") || 
    text.includes("exposed wire") || 
    text.includes("open manhole") || 
    text.includes("broken main") || 
    text.includes("flood") || 
    text.includes("shock") || 
    text.includes("danger") ||
    text.includes("accident")
  ) {
    urgency = "critical";
  } else if (
    text.includes("dark") || 
    text.includes("overflow") || 
    text.includes("smell") || 
    text.includes("block") ||
    text.includes("traffic")
  ) {
    urgency = "medium";
  }

  // 3. Simplified, non-emotional summary
  let cleanSummary = `Reported ${refined} issue. ${title}: ${description.substring(0, 90)}${description.length > 90 ? '...' : ''}`;
  
  return {
    refined_category: refined,
    urgency: urgency,
    simplified_summary: cleanSummary
  };
}
