/* ============================================
   BSS Shared — DOM Utilities
   ใช้ร่วมกัน: Verify, Revoke, Reconcile

   Functions:
   - BssDom.setText(id, text)         → set textContent
   - BssDom.setHtml(id, html)        → set innerHTML
   - BssDom.show(id)                 → display: ''
   - BssDom.hide(id)                 → display: 'none'
   - BssDom.toggleFilter(sectionId)  → toggle filter section
   - BssDom.escapeHtml(str)          → escape HTML entities
   ============================================ */

var BssDom = (function () {
    'use strict';

    /**
     * Set text content of element by ID
     * @param {string} id - Element ID
     * @param {string} text - Text content
     */
    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    /**
     * Set innerHTML of element by ID
     * @param {string} id - Element ID
     * @param {string} html - HTML content
     */
    function setHtml(id, html) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    /**
     * Show element by ID (remove display:none)
     * @param {string} id - Element ID
     */
    function show(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = '';
    }

    /**
     * Hide element by ID (set display:none)
     * @param {string} id - Element ID
     */
    function hide(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    /**
     * Toggle filter section visibility
     * @param {string} [sectionId='filterSection'] - Filter section element ID
     */
    function toggleFilter(sectionId) {
        var section = document.getElementById(sectionId || 'filterSection');
        if (!section) return;
        section.style.display = section.style.display === 'none' ? 'flex' : 'none';
    }

    /**
     * Escape HTML entities to prevent XSS
     * @param {string} str - Raw string
     * @returns {string} Escaped string
     */
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    return {
        setText: setText,
        setHtml: setHtml,
        show: show,
        hide: hide,
        toggleFilter: toggleFilter,
        escapeHtml: escapeHtml
    };
})();
