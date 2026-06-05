/**
 * core/highlight.js — Highlight search keyword after navigation
 * =============================================================
 * When a user clicks a search result, the router navigates to
 *   #/section/3/3.7?highlight=tỉ%20số%20truyền
 * and this module then:
 *   1. Reads the `highlight` query parameter
 *   2. Walks all text nodes inside #page-root
 *   3. Wraps matches with <mark class="search-highlight">
 *   4. Scrolls the first match into view + flashes it
 *
 * Matching is diacritics-insensitive ("ti so truyen" matches "tỉ số truyền").
 */

const HIGHLIGHT_CLASS = "search-highlight";
const HIGHLIGHT_ACTIVE_CLASS = "search-highlight-active";

/**
 * Strip Vietnamese diacritics from a string for case/dấu-insensitive matching.
 */
function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Walk all text nodes inside a container, wrapping matches of `query`
 * with <mark>. Skips nodes inside <script>, <style>, and existing <mark>.
 */
function highlightTextNodes(container, query) {
  const normalizedQuery = removeDiacritics(query);
  if (!normalizedQuery) return 0;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // Skip empty / whitespace-only nodes
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip text inside script/style/mark
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip text in buttons / form controls (avoid breaking UI)
        if (parent.closest("button, input, select, textarea")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const matches = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    const normalizedText = removeDiacritics(text);
    if (normalizedText.includes(normalizedQuery)) {
      matches.push(node);
    }
  }

  let count = 0;
  for (const textNode of matches) {
    count += wrapMatches(textNode, normalizedQuery);
  }
  return count;
}

/**
 * Replace a single text node with a sequence of text nodes + <mark> elements
 * surrounding each match. Uses the diacritics-stripped string for position
 * but preserves the original text (with diacritics) inside <mark>.
 */
function wrapMatches(textNode, normalizedQuery) {
  const original = textNode.nodeValue;
  const normalized = removeDiacritics(original);
  const fragment = document.createDocumentFragment();

  let lastIdx = 0;
  let pos;
  let count = 0;
  while ((pos = normalized.indexOf(normalizedQuery, lastIdx)) !== -1) {
    // Append text before match
    if (pos > lastIdx) {
      fragment.appendChild(
        document.createTextNode(original.slice(lastIdx, pos))
      );
    }
    // Append <mark> with matched substring (original with diacritics)
    const mark = document.createElement("mark");
    mark.className = HIGHLIGHT_CLASS;
    mark.textContent = original.slice(pos, pos + normalizedQuery.length);
    fragment.appendChild(mark);

    lastIdx = pos + normalizedQuery.length;
    count++;
  }

  // Append remaining text after last match
  if (lastIdx < original.length) {
    fragment.appendChild(document.createTextNode(original.slice(lastIdx)));
  }

  textNode.parentNode.replaceChild(fragment, textNode);
  return count;
}

/**
 * Remove all existing highlights from the page.
 * Useful when navigating between pages to reset state.
 */
export function clearHighlights() {
  document.querySelectorAll("mark." + HIGHLIGHT_CLASS).forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    // Replace <mark> with its text content (collapsing back to plain text)
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    // Normalize adjacent text nodes
    parent.normalize();
  });
}

/**
 * Main entry: apply highlights based on the `highlight` query param in URL.
 * Should be called after the page content is rendered.
 *
 * @param {string} [query] - Optional override; defaults to ?highlight= param
 */
export function applyHighlight(query) {
  // Read query parameter from URL hash
  if (query === undefined) {
    const hash = window.location.hash;
    const qIdx = hash.indexOf("?");
    if (qIdx === -1) {
      clearHighlights();
      return;
    }
    const params = new URLSearchParams(hash.slice(qIdx + 1));
    query = params.get("highlight");
  }

  // Clear any existing highlights first
  clearHighlights();

  if (!query) return;

  const root = document.getElementById("page-root");
  if (!root) return;

  // Delay slightly to ensure all dynamic content is rendered
  requestAnimationFrame(() => {
    const count = highlightTextNodes(root, query);
    if (count === 0) return;

    // Scroll the first match into view + flash it
    const firstMark = root.querySelector("mark." + HIGHLIGHT_CLASS);
    if (firstMark) {
      firstMark.classList.add(HIGHLIGHT_ACTIVE_CLASS);
      // Smooth scroll, center the match in viewport
      firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
      // Remove the active flash after the animation finishes
      setTimeout(() => {
        firstMark.classList.remove(HIGHLIGHT_ACTIVE_CLASS);
      }, 2400);
    }
  });
}
