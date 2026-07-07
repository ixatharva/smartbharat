// AI Companion Router Layer
// Extracts intent (Grievance Tracking vs. General Scheme Query) and handles Multilingual keyword matching

// Hindi translation keyword map for search query expansion
const HINDI_NLP_MAP = {
  "आधार": "Aadhaar",
  "पैन": "PAN",
  "पासपोर्ट": "Passport",
  "किसान": "Kisan",
  "आयुष्मान": "Ayushman PM-JAY",
  "गोल्डन": "Golden Card",
  "अस्पताल": "Hospital benefits",
  "वोटर": "Voter ID Form",
  "पता": "Address update online",
  "मोबाइल": "Mobile number linking rules",
  "बच्चे": "Kids Baal Aadhaar MBU",
  "नाबालिग": "Minor parent sign",
  "पुलिस": "Police Verification guidelines",
  "तत्काल": "Tatkaal booking fees",
  "फॉर्म": "Registration Form 6 8",
  "शिकायत": "complaint status ticket"
};

// Tamil translation keyword map for search query expansion
const TAMIL_NLP_MAP = {
  "ஆதார்": "Aadhaar",
  "பான்": "PAN",
  "பாஸ்போர்ட்": "Passport",
  "கிசான்": "Kisan",
  "ஆயுஷ்மான்": "Ayushman PM-JAY",
  "கோல்டன்": "Golden Card",
  "மருத்துவமனை": "Hospital benefits",
  "வாக்காளர்": "Voter ID Form",
  "முகவரி": "Address update online",
  "கைபேசி": "Mobile number linking rules",
  "குழந்தை": "Kids Baal Aadhaar MBU",
  "காவல்துறை": "Police Verification guidelines",
  "தட்கல்": "Tatkaal booking fees",
  "படிவம்": "Registration Form 6 8",
  "புகார்": "complaint status ticket"
};

/**
 * Router Gateway Layer.
 * Classifies citizen query intent (Grievance Tracking vs. General Scheme Inquiry)
 * and expands multilingual search keys (Hindi and Tamil) to optimize matching.
 * 
 * @param {string} query - Raw text query from the user interface.
 * @returns {Object} Router outcome containing intent, extractedId, and expandedQuery.
 */
export function routeQuery(query) {
  const q = query.trim();
  const qLower = q.toLowerCase();
  
  // 1. Detect Ticket ID pattern (e.g. SB-10294 or sb-54219)
  const ticketMatch = q.match(/SB-\d{5}/i);
  
  // 2. Detect Grievance tracking intent keywords
  const trackingKeywords = [
    'status', 'complaint', 'ticket', 'track', 'progress', 'grievance', 'sb-',
    'शिकायत', 'स्थिति', 'ट्रैक',
    'புகார்', 'நிலை', 'டிராக்'
  ];
  
  const hasTrackingKeywords = trackingKeywords.some(kw => qLower.includes(kw));
  
  if (ticketMatch || hasTrackingKeywords) {
    return {
      intent: "tracking",
      extractedId: ticketMatch ? ticketMatch[0].toUpperCase() : null,
      expandedQuery: q
    };
  }

  // 3. Multilingual NLP query expansion
  let expandedQuery = q;
  
  // Hindi characters range: \u0900 to \u097F
  const isHindi = /[\u0900-\u097F]/.test(q);
  if (isHindi) {
    for (const [hindiWord, engWord] of Object.entries(HINDI_NLP_MAP)) {
      if (qLower.includes(hindiWord)) {
        expandedQuery += " " + engWord;
      }
    }
  }

  // Tamil characters range: \u0B80 to \u0BFF
  const isTamil = /[\u0B80-\u0BFF]/.test(q);
  if (isTamil) {
    for (const [tamilWord, engWord] of Object.entries(TAMIL_NLP_MAP)) {
      if (qLower.includes(tamilWord)) {
        expandedQuery += " " + engWord;
      }
    }
  }

  return {
    intent: "schemes",
    extractedId: null,
    expandedQuery: expandedQuery
  };
}
