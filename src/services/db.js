// Local Storage DB Manager

const SEEDED_COMPLAINTS = [
  {
    id: "SB-10294",
    title: "Deep Potholes on Ring Road Crossing",
    description: "Multiple critical potholes are causing severe traffic jams and dangerous accidents during rainy nights. Requires immediate re-tarring.",
    category: "roads",
    location: "Ring Road, Near Sector 3 Flyover, New Delhi",
    date: "2026-07-01",
    status: "assigned", // submitted, review, assigned, resolved
    photo: null
  },
  {
    id: "SB-10112",
    title: "Broken Streetlights on Main Commercial Avenue",
    description: "The entire stretch of streetlights from plot 24 to 50 is non-functional. It makes walking extremely unsafe for women and children after sunset.",
    category: "lights",
    location: "Main Market Road, Block B, New Delhi",
    date: "2026-06-28",
    status: "resolved",
    photo: null
  },
  {
    id: "SB-10499",
    title: "Overflowing Garbage Container",
    description: "The municipal waste dump container in Block C market is overflowing and has not been cleared for the last four days. Foul smell is spreading.",
    category: "waste",
    location: "Block C Market Circle, New Delhi",
    date: "2026-07-06",
    status: "submitted",
    photo: null
  }
];

export function initDB() {
  if (!localStorage.getItem("sb_complaints")) {
    localStorage.setItem("sb_complaints", JSON.stringify(SEEDED_COMPLAINTS));
  }
  if (!localStorage.getItem("sb_lang")) {
    localStorage.setItem("sb_lang", "en");
  }
  if (!localStorage.getItem("sb_theme")) {
    localStorage.setItem("sb_theme", "dark");
  }
  if (!localStorage.getItem("sb_chat_history")) {
    localStorage.setItem("sb_chat_history", JSON.stringify([]));
  }
}

// Complaints
export function getComplaints() {
  initDB();
  return JSON.parse(localStorage.getItem("sb_complaints"));
}

export function saveComplaint(complaint) {
  const complaints = getComplaints();
  complaints.unshift(complaint); // Add new on top
  localStorage.setItem("sb_complaints", JSON.stringify(complaints));
  return complaints;
}

export function getComplaintById(id) {
  const complaints = getComplaints();
  return complaints.find(c => c.id.toUpperCase() === id.trim().toUpperCase());
}

// API Key Settings
export function getApiKey() {
  return localStorage.getItem("sb_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
}

export function saveApiKey(key) {
  if (key) {
    localStorage.setItem("sb_gemini_key", key.trim());
  } else {
    localStorage.removeItem("sb_gemini_key");
  }
}

// Preferences
export function getLang() {
  initDB();
  return localStorage.getItem("sb_lang");
}

export function saveLang(lang) {
  localStorage.setItem("sb_lang", lang);
}

export function getTheme() {
  initDB();
  return localStorage.getItem("sb_theme");
}

export function saveTheme(theme) {
  localStorage.setItem("sb_theme", theme);
}

// Chat history
export function getChatHistory() {
  initDB();
  return JSON.parse(localStorage.getItem("sb_chat_history"));
}

export function saveChatHistory(history) {
  localStorage.setItem("sb_chat_history", JSON.stringify(history));
}
