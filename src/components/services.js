import { getTranslation } from '../services/translate.js';
import { SERVICES_DB } from '../services/ai.js';

export function renderServices(container, lang) {
  let activeCategory = 'all';
  let searchQuery = '';

  function drawUI() {
    container.innerHTML = `
      <div class="animate-fade">
        <!-- Search bar -->
        <div class="services-search-bar">
          <input type="text" class="search-input" id="services-search-input" placeholder="${getTranslation(lang, 'serv_search')}" value="${searchQuery}">
        </div>

        <!-- Categories tabs -->
        <div class="category-tabs">
          <div class="category-tab ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">${getTranslation(lang, 'serv_cat_all')}</div>
          <div class="category-tab ${activeCategory === 'id' ? 'active' : ''}" data-cat="id">${getTranslation(lang, 'serv_cat_id')}</div>
          <div class="category-tab ${activeCategory === 'welfare' ? 'active' : ''}" data-cat="welfare">${getTranslation(lang, 'serv_cat_welfare')}</div>
          <div class="category-tab ${activeCategory === 'utilities' ? 'active' : ''}" data-cat="utilities">${getTranslation(lang, 'serv_cat_utilities')}</div>
          <div class="category-tab ${activeCategory === 'education' ? 'active' : ''}" data-cat="education">${getTranslation(lang, 'serv_cat_education')}</div>
        </div>

        <!-- Services cards grid -->
        <div class="dashboard-grid" id="services-cards-grid">
          <!-- Populated dynamically -->
        </div>

        <!-- Document guide drawer -->
        <div class="document-drawer" id="services-document-drawer">
          <!-- Populated dynamically when service is selected -->
        </div>
      </div>
    `;

    // Hook listeners
    const searchInput = document.getElementById('services-search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderCards();
    });

    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        activeCategory = e.target.getAttribute('data-cat');
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderCards();
      });
    });

    renderCards();
  }

  function renderCards() {
    const cardsGrid = document.getElementById('services-cards-grid');
    
    // Filter database
    const filtered = SERVICES_DB.filter(s => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory;
      const matchSearch = s.name.toLowerCase().includes(searchQuery) || 
                          s.desc.toLowerCase().includes(searchQuery) ||
                          s.poi.some(d => d.toLowerCase().includes(searchQuery)) ||
                          s.poa.some(d => d.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div class="glass-card col-12" style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary);">No services matched your query. Try adjusting filters or search terms.</p>
        </div>
      `;
      return;
    }

    cardsGrid.innerHTML = filtered.map(s => `
      <div class="glass-card col-4 service-card">
        <div>
          <div class="service-icon">
            ${s.category === 'id' ? '👤' : s.category === 'welfare' ? '🌾' : '⚡'}
          </div>
          <h4 class="service-title">${s.name}</h4>
          <p class="service-desc">${s.desc}</p>
        </div>
        <button class="btn btn-secondary btn-view-doc" data-id="${s.id}" style="width: 100%; justify-content: center;">
          ${getTranslation(lang, 'serv_btn_view')}
        </button>
      </div>
    `).join('');

    // Click cards button to open drawer
    document.querySelectorAll('.btn-view-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openDrawer(id);
      });
    });
  }

  function openDrawer(serviceId) {
    const service = SERVICES_DB.find(s => s.id === serviceId);
    if (!service) return;

    const drawer = document.getElementById('services-document-drawer');
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3 class="drawer-title">${service.name}</h3>
        <button class="drawer-close" id="btn-close-drawer">&times;</button>
      </div>
      
      <div style="flex: 1; overflow-y: auto; padding-right: 0.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="doc-list-group">
          <h4 class="doc-list-title">${getTranslation(lang, 'serv_drawer_poi')}</h4>
          <ul class="doc-list">
            ${service.poi.map(doc => `
              <li class="doc-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${doc}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="doc-list-group">
          <h4 class="doc-list-title">${getTranslation(lang, 'serv_drawer_poa')}</h4>
          <ul class="doc-list">
            ${service.poa.map(doc => `
              <li class="doc-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${doc}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${service.other && service.other.length > 0 ? `
          <div class="doc-list-group">
            <h4 class="doc-list-title">${getTranslation(lang, 'serv_drawer_other')}</h4>
            <ul class="doc-list">
              ${service.other.map(doc => `
                <li class="doc-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: hsl(var(--primary-hsl));"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${doc}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="doc-list-group">
          <h4 class="doc-list-title">${getTranslation(lang, 'serv_drawer_apply')}</h4>
          <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">
            ${service.procedure}
          </div>
        </div>

      </div>
    `;

    // Slide in
    drawer.classList.add('open');

    // Drawer close events
    document.getElementById('btn-close-drawer').addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  // Draw initial HTML structures
  drawUI();
}
