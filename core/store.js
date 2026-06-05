/**
 * store.js — Application State (Simple Reactive Store)
 * ======================================================
 * Central place for all shared app data.
 * Components read from the store; mutations go through
 * store methods so subscribers get notified.
 *
 * Usage:
 *   import { store } from './core/store.js';
 *   store.subscribe('sections', (data) => { ... });
 *   store.set('sections', data);
 *   const sections = store.get('sections');
 */

class Store {
  constructor() {
    // ── State ──────────────────────────────────────────────────
    this._state = {
      // Master data (loaded once)
      sections: null, // Array from sections.json
      dtcList: null, // Array from dtc.json
      sectionCache: {}, // section-N.json cache { "1": {...}, ... }

      // UI state
      activeSectionId: null, // currently open section (number)
      activeSubId: null, // currently open sub-section ("1.2")
      activeDtcCode: null, // currently open DTC code ("P0715")
      sidebarOpen: false,
      searchOpen: false,
    };

    // ── Subscribers ────────────────────────────────────────────
    this._subscribers = {}; // { key: [callback, ...] }
  }

  // ─── Public API ─────────────────────────────────────────────

  /** Read state value */
  get(key) {
    return this._state[key];
  }

  /**
   * Write state value and notify subscribers.
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this._state[key] = value;
    this._notify(key, value);
  }

  /**
   * Subscribe to state changes for a specific key.
   * Returns unsubscribe function.
   * @param {string} key
   * @param {Function} callback
   */
  subscribe(key, callback) {
    if (!this._subscribers[key]) {
      this._subscribers[key] = [];
    }
    this._subscribers[key].push(callback);

    // Return unsubscribe
    return () => {
      this._subscribers[key] = this._subscribers[key].filter(
        (cb) => cb !== callback,
      );
    };
  }

  // ─── Data Loading Helpers ───────────────────────────────────

  /**
   * Load sections.json (master catalog).
   * Caches result; returns cached value on subsequent calls.
   */
  async loadSections() {
    if (this._state.sections) return this._state.sections;

    const data = await this._fetchJson("data/sections.json");
    this.set("sections", data.sections);
    return data.sections;
  }

  /**
   * Load section-N.json.
   * Caches result by section id.
   * @param {number|string} id
   */
  async loadSection(id) {
    const key = String(id);
    if (this._state.sectionCache[key]) {
      return this._state.sectionCache[key];
    }

    const data = await this._fetchJson(`data/section-${key}.json`);
    const cache = { ...this._state.sectionCache, [key]: data };
    this.set("sectionCache", cache);
    return data;
  }

  /**
   * Load dtc.json.
   * Caches result.
   */
  async loadDtc() {
    if (this._state.dtcList) return this._state.dtcList;

    const data = await this._fetchJson("data/dtc.json");
    this.set("dtcList", data);
    return data;
  }

  /**
   * Get a single DTC by code string (e.g. "P0715").
   * Loads dtc.json if not already loaded.
   * @param {string} code
   */
  async getDtcByCode(code) {
    const data = await this.loadDtc();
    return data.codes.find((c) => c.code === code.toUpperCase()) || null;
  }

  // ─── Private ────────────────────────────────────────────────

  async _fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `[Store] Failed to load ${url}: ${res.status} ${res.statusText}`,
      );
    }
    return res.json();
  }

  _notify(key, value) {
    const callbacks = this._subscribers[key] || [];
    callbacks.forEach((cb) => {
      try {
        cb(value);
      } catch (err) {
        console.error(`[Store] Subscriber error for key "${key}":`, err);
      }
    });
  }
}

// Export singleton
export const store = new Store();
