import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock browser localStorage API globally
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
vi.stubGlobal('localStorage', mockLocalStorage);

// Import the database module under test
import { initDB, getComplaints, saveComplaint, getComplaintById, getApiKey, saveApiKey } from '../src/services/db.js';

describe('db service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize database with seeded complaints and default settings', () => {
    initDB();
    const complaints = JSON.parse(localStorage.getItem('sb_complaints'));
    expect(complaints.length).toBe(3);
    expect(localStorage.getItem('sb_lang')).toBe('en');
    expect(localStorage.getItem('sb_theme')).toBe('dark');
  });

  it('should retrieve complaints list', () => {
    initDB();
    const complaints = getComplaints();
    expect(complaints.length).toBe(3);
  });

  it('should save a new complaint to local storage', () => {
    initDB();
    const newComplaint = {
      id: 'SB-99999',
      title: 'Water Leakage',
      description: 'Pipeline broken',
      category: 'water',
      location: 'Sector 5',
      date: '2026-07-07',
      status: 'submitted'
    };
    saveComplaint(newComplaint);
    const list = getComplaints();
    expect(list.length).toBe(4);
    expect(list[0].id).toBe('SB-99999');
  });

  it('should retrieve a specific complaint by ticket ID case-insensitively', () => {
    initDB();
    const ticket = getComplaintById('sb-10294');
    expect(ticket).toBeDefined();
    expect(ticket.title).toBe('Deep Potholes on Ring Road Crossing');
  });

  it('should save and get API key configuration', () => {
    saveApiKey('test-api-key');
    expect(getApiKey()).toBe('test-api-key');
  });
});
