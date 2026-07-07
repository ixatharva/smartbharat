import { getTranslation } from '../services/translate.js';
import { saveComplaint } from '../services/db.js';
import { analyzeGrievance } from '../services/ai.js';

export function renderReport(container, lang, onNavigate) {
  let selectedCategory = 'roads'; // Default
  let uploadedPhotoData = null;

  container.innerHTML = `
    <div class="glass-card animate-fade" style="max-width: 800px; margin: 0 auto;">
      <h3 style="font-family: var(--font-secondary); font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">
        ${getTranslation(lang, 'rep_header')}
      </h3>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">
        ${getTranslation(lang, 'rep_subtitle')}
      </p>

      <form id="grievance-form" onsubmit="return false;">
        <!-- Category Selector -->
        <div class="form-group" style="margin-bottom: 1.75rem;">
          <label class="form-label">${getTranslation(lang, 'rep_lbl_category')}</label>
          <div class="category-picker" role="radiogroup" aria-label="${getTranslation(lang, 'rep_lbl_category')}">
            <div class="picker-card selected" data-cat="roads" tabindex="0" role="radio" aria-checked="true" aria-label="${getTranslation(lang, 'rep_cat_roads')}">
              <div class="picker-icon" aria-hidden="true">🚧</div>
              <div class="picker-label">${getTranslation(lang, 'rep_cat_roads')}</div>
            </div>
            <div class="picker-card" data-cat="lights" tabindex="0" role="radio" aria-checked="false" aria-label="${getTranslation(lang, 'rep_cat_lights')}">
              <div class="picker-icon" aria-hidden="true">💡</div>
              <div class="picker-label">${getTranslation(lang, 'rep_cat_lights')}</div>
            </div>
            <div class="picker-card" data-cat="waste" tabindex="0" role="radio" aria-checked="false" aria-label="${getTranslation(lang, 'rep_cat_waste')}">
              <div class="picker-icon" aria-hidden="true">🗑</div>
              <div class="picker-label">${getTranslation(lang, 'rep_cat_waste')}</div>
            </div>
            <div class="picker-card" data-cat="water" tabindex="0" role="radio" aria-checked="false" aria-label="${getTranslation(lang, 'rep_cat_water')}">
              <div class="picker-icon" aria-hidden="true">💧</div>
              <div class="picker-label">${getTranslation(lang, 'rep_cat_water')}</div>
            </div>
          </div>
        </div>

        <!-- Issue Title -->
        <div class="form-group">
          <label class="form-label" for="report-title">${getTranslation(lang, 'rep_lbl_title')} *</label>
          <input type="text" class="form-control" id="report-title" placeholder="e.g. Broken streetlight pole causing darkness..." required>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label" for="report-desc">${getTranslation(lang, 'rep_lbl_desc')} *</label>
          <textarea class="form-control" id="report-desc" rows="4" placeholder="Give brief details about when this issue started, severity, or landmarks..." required></textarea>
        </div>

        <!-- Location -->
        <div class="form-group">
          <label class="form-label" for="report-loc">${getTranslation(lang, 'rep_lbl_loc')} *</label>
          <input type="text" class="form-control" id="report-loc" placeholder="Street Address, Block Name, Sector, City..." required>
        </div>

        <!-- Image Upload Simulated -->
        <div class="form-group" style="margin-bottom: 2rem;">
          <label class="form-label" for="report-file-input">${getTranslation(lang, 'rep_lbl_photo')}</label>
          <div class="upload-zone" id="report-upload-zone" tabindex="0" role="button" aria-label="Upload supporting image files">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <div class="upload-text">${getTranslation(lang, 'rep_upload_placeholder')}</div>
            <input type="file" id="report-file-input" accept="image/*" style="display: none;">
            
            <div class="upload-preview" id="report-upload-preview" style="display: none;">
              <!-- Thumbnail loaded dynamically -->
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button type="submit" class="btn btn-primary" id="btn-submit-grievance" style="width: 100%; justify-content: center; padding: 0.95rem;">
          ${getTranslation(lang, 'rep_btn_submit')}
        </button>
      </form>
    </div>
  `;

  // Hook category selectors
  const pickerCards = document.querySelectorAll('.picker-card');
  function selectCategory(target) {
    pickerCards.forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
    selectedCategory = target.getAttribute('data-cat');
  }

  pickerCards.forEach(card => {
    card.addEventListener('click', (e) => {
      selectCategory(e.currentTarget);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCategory(e.currentTarget);
      }
    });
  });

  // Hook upload zones
  const uploadZone = document.getElementById('report-upload-zone');
  const fileInput = document.getElementById('report-file-input');
  const uploadPreview = document.getElementById('report-upload-preview');

  uploadZone.addEventListener('click', () => fileInput.click());

  // Prevent default drag events to allow drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadZone.addEventListener(eventName, (e) => e.preventDefault(), false);
  });

  uploadZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      fileInput.files = files;
      handleFile(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast("Only image files are allowed", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedPhotoData = e.target.result;
      uploadPreview.innerHTML = `<img src="${uploadedPhotoData}" alt="Uploaded photo preview">`;
      uploadPreview.style.display = 'flex';
      // Hide prompt icons
      uploadZone.querySelector('svg').style.display = 'none';
      uploadZone.querySelector('.upload-text').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Handle Form Submission
  const form = document.getElementById('grievance-form');
  const submitBtn = document.getElementById('btn-submit-grievance');

  form.addEventListener('submit', async () => {
    const title = document.getElementById('report-title').value.trim();
    const desc = document.getElementById('report-desc').value.trim();
    const loc = document.getElementById('report-loc').value.trim();

    if (!title || !desc || !loc) {
      showToast(getTranslation(lang, 'rep_err_title'), 'error');
      return;
    }

    // Toggle loading state on button
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <div class="typing-indicator" style="height: 10px; width: 30px; margin: 0 auto;">
        <span class="typing-dot" style="background-color: #fff;"></span>
        <span class="typing-dot" style="background-color: #fff;"></span>
        <span class="typing-dot" style="background-color: #fff;"></span>
      </div>
    `;

    // Simulate async API upload call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate random ticket ID (e.g. SB-89234)
    const ticketNum = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `SB-${ticketNum}`;

    // Call AI analyzer backend
    const analysis = await analyzeGrievance(title, desc, selectedCategory);

    const newComplaint = {
      id: ticketId,
      title: title,
      description: desc,
      category: analysis.refined_category || selectedCategory,
      urgency: analysis.urgency || "low",
      simplified_summary: analysis.simplified_summary || title,
      location: loc,
      date: new Date().toISOString().split('T')[0],
      status: 'submitted',
      photo: uploadedPhotoData
    };

    // Save database
    saveComplaint(newComplaint);

    // Toast alert
    showToast(`${getTranslation(lang, 'rep_success')} ID: ${ticketId}`);

    // Route to tracker immediately and set search term
    onNavigate('tracker', ticketId);
  });

  function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
