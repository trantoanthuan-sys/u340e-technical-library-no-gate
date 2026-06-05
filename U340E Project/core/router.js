/**
 * router.js — Hash-Based SPA Router
 * ===================================
 * Listens to URL hash changes and dispatches
 * the correct module to render.
 *
 * Route patterns:
 *   #/            → home
 *   #/section/:id → section overview
 *   #/section/:id/:subId → subsection detail
 *   #/dtc         → DTC list
 *   #/dtc/:code   → DTC detail
 */

export class Router {
  /**
   * @param {Object} routes - Map of route handlers { pattern: handlerFn }
   */
  constructor(routes) {
    this.routes = routes; // registered route handlers
    this.currentRoute = null; // last matched route object

    // Bind the handler so we can remove the listener if needed
    this._onHashChange = this._onHashChange.bind(this);
  }

  /**
   * Start listening for hash changes.
   * Called once from app.js after all modules are ready.
   */
  init() {
    window.addEventListener("hashchange", this._onHashChange);

    // Handle initial page load
    this._onHashChange();
  }

  /** Programmatically navigate to a hash URL */
  navigate(hash) {
    window.location.hash = hash;
  }

  /** Replace current history entry (no back-button entry) */
  replace(hash) {
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(null, "", url);
    this._onHashChange();
  }

  // ─── Private ───────────────────────────────────────────────────

  _onHashChange() {
    // Normalize: remove leading '#', default to '/'
    const raw = window.location.hash.replace(/^#/, "") || "/";
    const path = raw.startsWith("/") ? raw : `/${raw}`;

    const matched = this._match(path);

    if (matched) {
      this.currentRoute = matched;
      matched.handler(matched.params, matched.query);
    } else {
      // Fallback to home if no route matched
      this._notFound(path);
    }
  }

  /**
   * Try each registered route pattern against the current path.
   * Returns { handler, params, query } or null.
   */
  _match(path) {
    // Split path and query string
    const [pathPart, queryPart] = path.split("?");
    const query = this._parseQuery(queryPart);

    for (const [pattern, handler] of Object.entries(this.routes)) {
      const params = this._matchPattern(pattern, pathPart);
      if (params !== null) {
        return { pattern, handler, params, query };
      }
    }
    return null;
  }

  /**
   * Match a route pattern against a path.
   * Pattern syntax: `/section/:id/:subId`
   * Returns params object or null if no match.
   */
  _matchPattern(pattern, path) {
    // Convert pattern to regex
    //   :param → named capture group
    //   *      → wildcard
    const patternParts = pattern.split("/");
    const pathParts = path.split("/");

    if (patternParts.length !== pathParts.length) return null;

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const pp = patternParts[i];
      const vp = pathParts[i];

      if (pp.startsWith(":")) {
        // Named param — capture value
        params[pp.slice(1)] = decodeURIComponent(vp);
      } else if (pp !== vp) {
        // Literal segment mismatch
        return null;
      }
    }

    return params;
  }

  _parseQuery(queryStr) {
    if (!queryStr) return {};
    return Object.fromEntries(new URLSearchParams(queryStr));
  }

  _notFound(path) {
    console.warn(`[Router] No route matched for: ${path}`);
    // Navigate to home as fallback
    this.replace("#/");
  }
}
