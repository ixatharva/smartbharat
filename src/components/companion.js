import { getTranslation } from '../services/translate.js';
import { getChatHistory, saveChatHistory, getApiKey, saveApiKey } from '../services/db.js';
import { askAI } from '../services/ai.js';

export function renderCompanion(container, lang) {
  let history = getChatHistory();
  
  // Seed greeting if empty
  if (history.length === 0) {
    let greeting = "";
    if (lang === 'hi') {
      greeting = "नमस्ते! मैं आपका सहायता AI नागरिक साथी हूँ। मैं सरकारी योजनाओं, प्रमाण पत्रों (आधार, पैन, पासपोर्ट) और स्थानीय शिकायत पंजीकरण के बारे में आपकी सहायता कर सकता हूँ। आज आप मुझसे क्या पूछना चाहते हैं?";
    } else if (lang === 'ta') {
      greeting = "வணக்கம்! நான் உங்கள் சஹாய்தா AI குடிமகன் துணைவன். அரசு திட்டங்கள், சான்றிதழ்கள் (ஆதார், பான், பாஸ்போர்ட்) மற்றும் உங்கள் பகுதி புகாரை எவ்வாறு பதிவு செய்வது போன்றவற்றில் நான் உங்களுக்கு உதவ முடியும். இன்று உங்களுக்கு எவ்வாறு உதவட்டும்?";
    } else {
      greeting = "Hello! I am your Sahayta AI companion. I can guide you through welfare schemes, document updates (Aadhaar, PAN, Passport, Voter ID), or help you file local civic complaints. What would you like to ask today?";
    }
    history.push({ sender: 'bot', text: greeting, timestamp: new Date().toLocaleTimeString() });
    saveChatHistory(history);
  }

  const isLiveMode = !!getApiKey();

  container.innerHTML = `
    <div class="glass-card animate-fade" style="display: flex; flex-direction: column; height: 75vh; padding: 1.5rem 1.75rem;">
      
      <!-- Top controls bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${isLiveMode ? 'hsl(var(--secondary-hsl))' : 'hsl(var(--primary-hsl))'}; box-shadow: ${isLiveMode ? 'var(--glow-secondary)' : 'var(--glow-primary)'};"></div>
          <div>
            <h3 style="font-family: var(--font-secondary); font-size: 1.15rem; font-weight: 700;">${getTranslation(lang, 'chat_header')}</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="companion-engine-status">
              ${isLiveMode ? getTranslation(lang, 'chat_mode_live') : getTranslation(lang, 'chat_mode_local')}
            </span>
          </div>
        </div>
        
        <button class="icon-btn" id="btn-api-settings" title="${getTranslation(lang, 'chat_api_setting')}" aria-label="${getTranslation(lang, 'chat_api_setting')}" aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.1a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      <!-- Chat area history -->
      <div class="chat-history" id="chat-history-box" aria-live="polite" aria-relevant="additions" role="log">
        <!-- Message Bubbles Rendered Dynamically -->
      </div>

      <!-- Suggestion chips wrapper -->
      <div style="margin-top: 1rem; flex-shrink: 0;">
        <div class="chip-container" role="group" aria-label="Suggested quick questions">
          <button class="chip-suggestion" aria-label="${getTranslation(lang, 'chat_suggest_1')}">${getTranslation(lang, 'chat_suggest_1')}</button>
          <button class="chip-suggestion" aria-label="${getTranslation(lang, 'chat_suggest_2')}">${getTranslation(lang, 'chat_suggest_2')}</button>
          <button class="chip-suggestion" aria-label="${getTranslation(lang, 'chat_suggest_3')}">${getTranslation(lang, 'chat_suggest_3')}</button>
          <button class="chip-suggestion" aria-label="${getTranslation(lang, 'chat_suggest_4')}">${getTranslation(lang, 'chat_suggest_4')}</button>
        </div>
      </div>

      <!-- Bottom entry panel -->
      <div class="chat-controls-bar" style="flex-shrink: 0;">
        <button class="icon-btn" id="btn-companion-mic" title="Voice Input" style="border-radius: 50%;" aria-label="Enter question using speech recognition voice input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
        
        <input type="text" class="chat-input" id="companion-chat-input" placeholder="${getTranslation(lang, 'chat_placeholder')}" autocomplete="off" aria-label="Enter your civic question or complaint ticket ID here">
        
        <button class="btn btn-primary" id="btn-companion-send" aria-label="Send Message">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>

    </div>

    <!-- API Settings Modal Overlay -->
    <div class="modal-overlay" id="api-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
      <div class="glass-card modal-content" style="padding: 2rem;">
        <div class="modal-header">
          <h3 id="api-modal-title" style="font-family: var(--font-secondary); font-size: 1.25rem; font-weight: 800;">${getTranslation(lang, 'chat_api_setting')}</h3>
          <button class="drawer-close" id="btn-close-api-modal" aria-label="Close API Modal">&times;</button>
        </div>
        
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">
          ${getTranslation(lang, 'chat_api_desc')}
        </p>

        <div class="form-group">
          <label class="form-label" for="input-api-key">${getTranslation(lang, 'chat_api_label')}</label>
          <input type="password" class="form-control" id="input-api-key" placeholder="AIzaSy..." value="${getApiKey()}">
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end;">
          <button class="btn btn-secondary" id="btn-clear-api-key">${getTranslation(lang, 'chat_api_clear')}</button>
          <button class="btn btn-primary" id="btn-save-api-key">${getTranslation(lang, 'chat_api_save')}</button>
        </div>
      </div>
    </div>
  `;

  const historyBox = document.getElementById('chat-history-box');
  const chatInput = document.getElementById('companion-chat-input');
  const sendBtn = document.getElementById('btn-companion-send');
  const micBtn = document.getElementById('btn-companion-mic');

  // Load message bubbles
  function renderMessages() {
    history = getChatHistory();
    historyBox.innerHTML = history.map((msg, index) => {
      const isUser = msg.sender === 'user';
      return `
        <div class="chat-bubble ${isUser ? 'user' : 'bot'}">
          <div class="chat-avatar-label">${isUser ? 'Citizen' : 'Sahayta AI'}</div>
          <div>${msg.text.replace(/\n/g, '<br>')}</div>
          
          ${!isUser ? `
            <button class="icon-btn btn-tts-read" data-index="${index}" style="position: absolute; right: 0.5rem; bottom: -1.75rem; width: 24px; height: 24px; border-radius: 50%; opacity: 0.7; padding: 0;" title="${getTranslation(lang, 'chat_tts_play')}">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Auto scroll to bottom
    historyBox.scrollTop = historyBox.scrollHeight;

    // Attach TTS listeners
    document.querySelectorAll('.btn-tts-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        const text = history[idx].text;
        speakText(text);
      });
    });
  }

  // Handle messages submit
  async function sendMessage(text) {
    if (!text.trim()) return;

    // Save user message
    history.push({ sender: 'user', text: text, timestamp: new Date().toLocaleTimeString() });
    saveChatHistory(history);
    renderMessages();
    chatInput.value = '';

    // Render typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot';
    typingBubble.id = 'bot-typing-indicator';
    typingBubble.innerHTML = `
      <div class="chat-avatar-label">Sahayta AI</div>
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    historyBox.appendChild(typingBubble);
    historyBox.scrollTop = historyBox.scrollHeight;

    // Request AI response
    try {
      const response = await askAI(text, lang);
      // Remove typing bubble
      const indicator = document.getElementById('bot-typing-indicator');
      if (indicator) indicator.remove();

      history.push({ sender: 'bot', text: response, timestamp: new Date().toLocaleTimeString() });
      saveChatHistory(history);
      renderMessages();
    } catch (e) {
      console.error(e);
      const indicator = document.getElementById('bot-typing-indicator');
      if (indicator) indicator.remove();

      history.push({ sender: 'bot', text: `Sorry, something went wrong. Let's try again.`, timestamp: new Date().toLocaleTimeString() });
      saveChatHistory(history);
      renderMessages();
    }
  }

  // Voice recognition configuration
  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    // Auto set language code
    if (lang === 'hi') recognition.lang = 'hi-IN';
    else if (lang === 'ta') recognition.lang = 'ta-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => {
      micBtn.style.background = 'rgba(239, 68, 68, 0.2)';
      micBtn.style.borderColor = 'rgb(239, 68, 68)';
      micBtn.style.color = 'rgb(239, 68, 68)';
      showToast(getTranslation(lang, 'chat_listen_toast'));
    };

    recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      chatInput.value = resultText;
    };

    recognition.onend = () => {
      micBtn.style.background = '';
      micBtn.style.borderColor = '';
      micBtn.style.color = '';
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      showToast(`Voice input error: ${event.error}`, 'error');
    };
  }

  // Text-To-Speech (Speech Synthesis)
  function speakText(text) {
    if ('speechSynthesis' in window) {
      // Cancel ongoing speeches
      window.speechSynthesis.cancel();
      
      // Clean up markdown markers for speech readability
      const speechString = text.replace(/[*#`_\-]/g, '').trim();
      const utterance = new SpeechUtterance(speechString);
      
      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (lang === 'ta') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("Speech output not supported on this browser", "error");
    }
  }

  // Toast alert system shortcut
  function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Event bindings
  sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(chatInput.value);
  });

  micBtn.addEventListener('click', () => {
    if (!recognition) {
      showToast("Speech recognition is not supported in this browser. Please try Google Chrome.", "error");
      return;
    }
    try {
      recognition.start();
    } catch (e) {
      recognition.stop();
    }
  });

  // Suggestion chip bindings
  document.querySelectorAll('.chip-suggestion').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const text = e.target.textContent;
      sendMessage(text);
    });
  });

  // Modal events
  const apiModal = document.getElementById('api-modal-overlay');
  const btnApiSettings = document.getElementById('btn-api-settings');
  const btnCloseApiModal = document.getElementById('btn-close-api-modal');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const btnClearApiKey = document.getElementById('btn-clear-api-key');
  const inputApiKey = document.getElementById('input-api-key');

  btnApiSettings.addEventListener('click', () => apiModal.classList.add('open'));
  btnCloseApiModal.addEventListener('click', () => apiModal.classList.remove('open'));
  apiModal.addEventListener('click', (e) => {
    if (e.target === apiModal) apiModal.classList.remove('open');
  });

  btnSaveApiKey.addEventListener('click', () => {
    const key = inputApiKey.value.trim();
    if (key) {
      saveApiKey(key);
      apiModal.classList.remove('open');
      showToast(getTranslation(lang, 'chat_api_success'));
      
      // Update engine labels dynamically
      document.getElementById('companion-engine-status').textContent = getTranslation(lang, 'chat_mode_live');
      const dot = document.querySelector('#companion-engine-status').parentNode.previousElementSibling;
      dot.style.backgroundColor = 'hsl(var(--secondary-hsl))';
      dot.style.boxShadow = 'var(--glow-secondary)';
    } else {
      showToast("Please enter a valid key", "error");
    }
  });

  btnClearApiKey.addEventListener('click', () => {
    saveApiKey('');
    inputApiKey.value = '';
    apiModal.classList.remove('open');
    showToast(getTranslation(lang, 'chat_api_removed'));
    
    // Update engine labels dynamically
    document.getElementById('companion-engine-status').textContent = getTranslation(lang, 'chat_mode_local');
    const dot = document.querySelector('#companion-engine-status').parentNode.previousElementSibling;
    dot.style.backgroundColor = 'hsl(var(--primary-hsl))';
    dot.style.boxShadow = 'var(--glow-primary)';
  });

  // Initial draw
  renderMessages();
}
