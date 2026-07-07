import { initDB, getLang, saveLang, getTheme, saveTheme } from './services/db.js';
import { getTranslation } from './services/translate.js';

// Component renders
import { renderDashboard } from './components/dashboard.js';
import { renderCompanion } from './components/companion.js';
import { renderServices } from './components/services.js';
import { renderReport } from './components/report.js';
import { renderTracker } from './components/tracker.js';

// Global state
let currentView = 'dashboard';
let currentLang = 'en';
let currentTheme = 'dark';

// Init Storage
initDB();
currentLang = getLang();
currentTheme = getTheme();

// View Mount Selector
const viewContainer = document.getElementById('view-content-target');

// Initialize DOM options
document.addEventListener('DOMContentLoaded', () => {
  // Apply theme
  applyTheme(currentTheme);

  // Apply language dropdown value
  const langSelect = document.getElementById('select-lang-switch');
  langSelect.value = currentLang;

  // Initial translation check
  translateUI();

  // Navigation Links listeners
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Clear all active classes
      navItems.forEach(n => n.classList.remove('active'));

      const target = e.currentTarget;
      target.classList.add('active');

      const view = target.getAttribute('data-view');
      navigate(view);

      // Close mobile drawer if open
      const sidebar = document.getElementById('app-sidebar-element');
      sidebar.classList.remove('open');
    });
  });

  // Mobile sidebar burger toggle
  const burgerToggle = document.getElementById('btn-mobile-sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar-element');
  burgerToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Language switch listener
  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    saveLang(currentLang);
    translateUI();
    navigate(currentView); // Refresh current view in new language
  });

  // Theme switch listener
  const themeBtn = document.getElementById('btn-theme-toggle');
  themeBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    currentTheme = newTheme;
    saveTheme(currentTheme);
    applyTheme(currentTheme);
  });

  // Load and apply accessibility settings
  const contrastSwitch = document.getElementById('switch-a11y-contrast');
  const sizeSelect = document.getElementById('select-a11y-size');
  const voiceSwitch = document.getElementById('switch-a11y-voice');

  const contrastVal = localStorage.getItem('sb_a11y_contrast') || 'normal';
  const sizeVal = localStorage.getItem('sb_a11y_size') || 'normal';
  const voiceVal = localStorage.getItem('sb_a11y_voice') || 'false';

  if (contrastSwitch) contrastSwitch.checked = contrastVal === 'high';
  if (sizeSelect) sizeSelect.value = sizeVal;
  if (voiceSwitch) voiceSwitch.checked = voiceVal === 'true';

  applyA11ySettings(contrastVal, sizeVal);

  // Toggle dropdown
  const a11yBtn = document.getElementById('btn-a11y-toggle');
  const a11yPanel = document.getElementById('panel-a11y-settings');
  if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = a11yPanel.style.display === 'flex';
      a11yPanel.style.display = isVisible ? 'none' : 'flex';
      a11yBtn.setAttribute('aria-expanded', !isVisible);
    });

    // Close panel on outside click
    document.addEventListener('click', () => {
      a11yPanel.style.display = 'none';
      a11yBtn.setAttribute('aria-expanded', 'false');
    });
    a11yPanel.addEventListener('click', (e) => e.stopPropagation());
  }

  // Listeners for adjustments
  if (contrastSwitch) {
    contrastSwitch.addEventListener('change', (e) => {
      const val = e.target.checked ? 'high' : 'normal';
      localStorage.setItem('sb_a11y_contrast', val);
      applyA11ySettings(val, sizeSelect ? sizeSelect.value : 'normal');
    });
  }

  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      localStorage.setItem('sb_a11y_size', val);
      applyA11ySettings(contrastSwitch && contrastSwitch.checked ? 'high' : 'normal', val);
    });
  }

  if (voiceSwitch) {
    voiceSwitch.addEventListener('change', (e) => {
      localStorage.setItem('sb_a11y_voice', e.target.checked ? 'true' : 'false');
      if (!e.target.checked && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }

  // Text-To-Speech Speech Synthesis engine
  let activeUtterance = null;
  function speakText(text) {
    if (localStorage.getItem("sb_a11y_voice") !== "true") return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop current speech
      if (!text) return;
      activeUtterance = new SpeechSynthesisUtterance(text);
      
      const lang = localStorage.getItem("sb_lang") || "en";
      if (lang === "hi") activeUtterance.lang = "hi-IN";
      else if (lang === "ta") activeUtterance.lang = "ta-IN";
      else activeUtterance.lang = "en-US";
      
      window.speechSynthesis.speak(activeUtterance);
    }
  }

  // Voice hover/focus screen reader assist listeners
  document.addEventListener('mouseover', (e) => {
    if (localStorage.getItem("sb_a11y_voice") !== "true") return;
    const target = e.target;
    if (target.matches('button, input, select, textarea, a, p, h1, h2, h3, h4, span, label, img, li')) {
      const readText = target.getAttribute('aria-label') || target.alt || target.textContent || target.placeholder || '';
      if (readText && readText.trim().length < 200) {
        speakText(readText.trim());
      }
    }
  }, { passive: true });

  function applyA11ySettings(contrast, size) {
    const root = document.documentElement;
    if (contrast === 'high') {
      root.setAttribute('data-a11y-contrast', 'high');
    } else {
      root.removeAttribute('data-a11y-contrast');
    }

    if (size === 'normal') {
      root.removeAttribute('data-a11y-size');
    } else {
      root.setAttribute('data-a11y-size', size);
    }
  }

  // Initial Route
  navigate('dashboard');
});

// Navigation Router
function navigate(viewName, params = '') {
  currentView = viewName;

  // De-activate all and set active on the correct sidebar button
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    }
  });

  // Render view
  switch (viewName) {
    case 'dashboard':
      updateHeader(getTranslation(currentLang, 'nav_dashboard'), getTranslation(currentLang, 'dash_subtitle'));
      renderDashboard(viewContainer, currentLang, navigate);
      break;
    case 'companion':
      updateHeader(getTranslation(currentLang, 'nav_companion'), getTranslation(currentLang, 'chat_subtitle'));
      renderCompanion(viewContainer, currentLang);
      break;
    case 'services':
      updateHeader(getTranslation(currentLang, 'nav_services'), getTranslation(currentLang, 'serv_subtitle'));
      renderServices(viewContainer, currentLang);
      break;
    case 'report':
      updateHeader(getTranslation(currentLang, 'nav_report'), getTranslation(currentLang, 'rep_subtitle'));
      renderReport(viewContainer, currentLang, navigate);
      break;
    case 'tracker':
      updateHeader(getTranslation(currentLang, 'nav_tracker'), getTranslation(currentLang, 'track_subtitle'));
      renderTracker(viewContainer, currentLang, params);
      break;
    default:
      updateHeader('Not Found', 'The requested component was not found.');
      viewContainer.innerHTML = '<h3>Page Not Found</h3>';
  }
}

// Utility to change headers
function updateHeader(title, subtitle) {
  document.getElementById('lbl-page-title').textContent = title;
  document.getElementById('lbl-page-subtitle').textContent = subtitle;
}

// Translate permanent shell items
function translateUI() {
  document.getElementById('lbl-brand-subtitle').textContent = getTranslation(currentLang, 'brand_sub');
  document.getElementById('lbl-nav-dashboard').textContent = getTranslation(currentLang, 'nav_dashboard');
  document.getElementById('lbl-nav-companion').textContent = getTranslation(currentLang, 'nav_companion');
  document.getElementById('lbl-nav-services').textContent = getTranslation(currentLang, 'nav_services');
  document.getElementById('lbl-nav-report').textContent = getTranslation(currentLang, 'nav_report');
  document.getElementById('lbl-nav-tracker').textContent = getTranslation(currentLang, 'nav_tracker');
}

// Theme applier
function applyTheme(theme) {
  const root = document.documentElement;
  const themeBtn = document.getElementById('btn-theme-toggle');
  
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="icon-theme-light"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    `;
  } else {
    root.removeAttribute('data-theme');
    themeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="icon-theme-dark"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    `;
  }
}
