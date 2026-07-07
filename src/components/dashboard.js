import { getTranslation } from '../services/translate.js';
import { getComplaints } from '../services/db.js';

export function renderDashboard(container, lang, onNavigate) {
  const complaints = getComplaints();
  const activeCount = complaints.filter(c => c.status !== 'resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  container.innerHTML = `
    <div class="dashboard-grid animate-fade">
      <!-- Welcome Header Card -->
      <div class="glass-card col-12" style="background: linear-gradient(135deg, hsla(var(--primary-hsl) / 0.15) 0%, hsla(var(--secondary-hsl) / 0.05) 100%);">
        <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem; font-family: var(--font-secondary);">${getTranslation(lang, 'dash_welcome')}</h2>
        <p style="color: var(--text-secondary); max-width: 600px; font-size: 0.95rem;">${getTranslation(lang, 'dash_subtitle')}</p>
      </div>

      <!-- Statistics cards -->
      <div class="glass-card col-4 stat-card">
        <div class="stat-header">
          <span>${getTranslation(lang, 'dash_stat_active')}</span>
          <div class="stat-icon primary">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
        <div>
          <div class="stat-value">${activeCount}</div>
          <div class="stat-change up">● Online Tracker</div>
        </div>
      </div>

      <div class="glass-card col-4 stat-card">
        <div class="stat-header">
          <span>${getTranslation(lang, 'dash_stat_resolved')}</span>
          <div class="stat-icon secondary">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          </div>
        </div>
        <div>
          <div class="stat-value">${resolvedCount}</div>
          <div class="stat-change up">94.8% Success Rate</div>
        </div>
      </div>

      <div class="glass-card col-4 stat-card">
        <div class="stat-header">
          <span>${getTranslation(lang, 'dash_stat_time')}</span>
          <div class="stat-icon accent">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
        </div>
        <div>
          <div class="stat-value">2.4 Days</div>
          <div class="stat-change up" style="color: hsl(var(--secondary-hsl));">-14.2% Faster Resolution</div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="glass-card col-8">
        <h3 style="margin-bottom: 1.25rem; font-family: var(--font-secondary); font-size: 1.15rem;">${getTranslation(lang, 'dash_quick_actions')}</h3>
        <div class="dashboard-grid" style="grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 0;">
          <div class="glass-card picker-card" style="padding: 1.25rem;" id="qa-companion">
            <div class="picker-icon" style="color: hsl(var(--primary-hsl));">💬</div>
            <div class="picker-label">${getTranslation(lang, 'dash_qa_chat')}</div>
          </div>
          <div class="glass-card picker-card" style="padding: 1.25rem;" id="qa-report">
            <div class="picker-icon" style="color: hsl(var(--accent-hsl));">⚠</div>
            <div class="picker-label">${getTranslation(lang, 'dash_qa_pothole')}</div>
          </div>
          <div class="glass-card picker-card" style="padding: 1.25rem;" id="qa-services">
            <div class="picker-icon" style="color: hsl(var(--secondary-hsl));">📁</div>
            <div class="picker-label">${getTranslation(lang, 'dash_qa_schemes')}</div>
          </div>
          <div class="glass-card picker-card" style="padding: 1.25rem;" id="qa-tracker">
            <div class="picker-icon" style="color: hsl(var(--info-hsl));">🔍</div>
            <div class="picker-label">${getTranslation(lang, 'dash_qa_track')}</div>
          </div>
        </div>
      </div>

      <!-- Recent Alerts and Bulletins -->
      <div class="glass-card col-4">
        <h3 style="margin-bottom: 1.25rem; font-family: var(--font-secondary); font-size: 1.15rem;">${getTranslation(lang, 'dash_recent_alerts')}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
          <li style="border-left: 3px solid hsl(var(--primary-hsl)); padding-left: 0.75rem;">
            <p style="font-size: 0.85rem; line-height: 1.4;">${getTranslation(lang, 'dash_alert_1')}</p>
            <span style="font-size: 0.7rem; color: var(--text-muted);">Delhi MC • 2 hours ago</span>
          </li>
          <li style="border-left: 3px solid hsl(var(--secondary-hsl)); padding-left: 0.75rem;">
            <p style="font-size: 0.85rem; line-height: 1.4;">${getTranslation(lang, 'dash_alert_2')}</p>
            <span style="font-size: 0.7rem; color: var(--text-muted);">ECI Secretariat • 1 day ago</span>
          </li>
          <li style="border-left: 3px solid hsl(var(--accent-hsl)); padding-left: 0.75rem;">
            <p style="font-size: 0.85rem; line-height: 1.4;">${getTranslation(lang, 'dash_alert_3')}</p>
            <span style="font-size: 0.7rem; color: var(--text-muted);">Jal Board Delhi • 2 days ago</span>
          </li>
        </ul>
      </div>
    </div>
  `;

  // Attach quick action listeners
  document.getElementById('qa-companion').addEventListener('click', () => onNavigate('companion'));
  document.getElementById('qa-report').addEventListener('click', () => onNavigate('report'));
  document.getElementById('qa-services').addEventListener('click', () => onNavigate('services'));
  document.getElementById('qa-tracker').addEventListener('click', () => onNavigate('tracker'));
}
