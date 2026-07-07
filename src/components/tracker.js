import { getTranslation } from '../services/translate.js';
import { getComplaints, getComplaintById } from '../services/db.js';

export function renderTracker(container, lang, initialSearchId = '') {
  let activeSearchId = initialSearchId;

  function drawUI() {
    const complaints = getComplaints();
    
    // Default to the first complaint in list if no initial ID provided
    if (!activeSearchId && complaints.length > 0) {
      activeSearchId = complaints[0].id;
    }

    const activeTicket = activeSearchId ? getComplaintById(activeSearchId) : null;

    container.innerHTML = `
      <div class="animate-fade">
        <div class="dashboard-grid">
          <!-- Search Panel -->
          <div class="glass-card col-12">
            <h3 style="font-family: var(--font-secondary); font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">
              ${getTranslation(lang, 'track_header')}
            </h3>
            <div class="tracker-search">
              <input type="text" class="search-input" id="input-tracker-id" placeholder="${getTranslation(lang, 'track_placeholder')}" value="${activeSearchId}">
              <button class="btn btn-primary" id="btn-tracker-search">${getTranslation(lang, 'track_btn_search')}</button>
            </div>
          </div>

          <!-- Stepper Timeline Panel -->
          <div class="glass-card col-8" id="tracker-stepper-panel">
            <!-- Populated dynamically -->
          </div>

          <!-- Submitted Tickets List -->
          <div class="glass-card col-4">
            <h4 style="font-family: var(--font-secondary); margin-bottom: 1rem; font-weight: 700; font-size: 1rem;">Recent Tickets</h4>
            <div style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;" id="recent-tickets-list">
              ${complaints.map(c => `
                <div class="glass-card picker-card ${c.id === activeSearchId ? 'selected' : ''}" data-ticket-id="${c.id}" style="padding: 0.85rem 1rem; text-align: left; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${c.id}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 180px;">${c.title}</div>
                  </div>
                  <span style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; background: ${
                    c.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 
                    c.status === 'assigned' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(249, 115, 22, 0.15)'
                  }; color: ${
                    c.status === 'resolved' ? 'hsl(var(--secondary-hsl))' : 
                    c.status === 'assigned' ? 'hsl(var(--primary-hsl))' : 'hsl(var(--accent-hsl))'
                  };">
                    ${c.status.toUpperCase()}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook listeners
    const searchBtn = document.getElementById('btn-tracker-search');
    const searchInput = document.getElementById('input-tracker-id');

    searchBtn.addEventListener('click', () => {
      activeSearchId = searchInput.value.trim();
      drawUI();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        activeSearchId = searchInput.value.trim();
        drawUI();
      }
    });

    document.querySelectorAll('#recent-tickets-list .picker-card').forEach(card => {
      card.addEventListener('click', (e) => {
        activeSearchId = e.currentTarget.getAttribute('data-ticket-id');
        drawUI();
      });
    });

    renderStepper(activeTicket);
  }

  function renderStepper(ticket) {
    const stepperPanel = document.getElementById('tracker-stepper-panel');
    
    if (!ticket) {
      stepperPanel.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary);">Please enter a valid Ticket ID or select a ticket from the sidebar to view status.</p>
        </div>
      `;
      return;
    }

    // Determine status index
    // submitted = 0, review = 1, assigned = 2, resolved = 3
    const statuses = ['submitted', 'review', 'assigned', 'resolved'];
    const activeIdx = statuses.indexOf(ticket.status);
    const linePercent = activeIdx === 0 ? 0 : activeIdx === 1 ? 33 : activeIdx === 2 ? 66 : 100;

    stepperPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4 style="font-family: var(--font-secondary); font-size: 1.1rem; font-weight: 700;">
          ${getTranslation(lang, 'track_info_title')}
        </h4>
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${getTranslation(lang, 'track_info_date')}: ${ticket.date}</span>
      </div>

      <!-- Stepper Stepper Stepper -->
      <div class="stepper-container">
        <div class="stepper-line"></div>
        <div class="stepper-line-fill" style="width: ${linePercent}%;"></div>

        <!-- Node 1 -->
        <div class="step-node ${activeIdx >= 0 ? 'completed' : ''} ${activeIdx === 0 ? 'active' : ''}">
          <div class="step-circle">
            ${activeIdx > 0 ? '✓' : '1'}
          </div>
          <div class="step-label">${getTranslation(lang, 'track_step_submitted')}</div>
        </div>

        <!-- Node 2 -->
        <div class="step-node ${activeIdx >= 1 ? 'completed' : ''} ${activeIdx === 1 ? 'active' : ''}">
          <div class="step-circle">
            ${activeIdx > 1 ? '✓' : '2'}
          </div>
          <div class="step-label">${getTranslation(lang, 'track_step_review')}</div>
        </div>

        <!-- Node 3 -->
        <div class="step-node ${activeIdx >= 2 ? 'completed' : ''} ${activeIdx === 2 ? 'active' : ''}">
          <div class="step-circle">
            ${activeIdx > 2 ? '✓' : '3'}
          </div>
          <div class="step-label">${getTranslation(lang, 'track_step_assigned')}</div>
        </div>

        <!-- Node 4 -->
        <div class="step-node ${activeIdx >= 3 ? 'completed' : ''} ${activeIdx === 3 ? 'active' : ''}">
          <div class="step-circle">
            ${activeIdx > 3 ? '✓' : '4'}
          </div>
          <div class="step-label">${getTranslation(lang, 'track_step_resolved')}</div>
        </div>
      </div>

      <!-- Details List Info -->
      <div style="border-top: 1px solid var(--glass-border); padding-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Ticket ID</div>
          <div style="font-size: 1rem; font-weight: 700; color: hsl(var(--primary-hsl));">${ticket.id}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Issue Summary</div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${ticket.title}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Detailed Description</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; white-space: pre-wrap;">${ticket.description}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Location Pin</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.25rem;">
            📍 <span>${ticket.location}</span>
          </div>
        </div>
        
        ${ticket.photo ? `
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">Attachment</div>
            <img src="${ticket.photo}" alt="Complaint Attachment Photo" style="max-width: 250px; border-radius: var(--border-radius-md); border: 1px solid var(--glass-border); display: block;">
          </div>
        ` : ''}
      </div>
    `;
  }

  // Draw UI
  drawUI();
}
