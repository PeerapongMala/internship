/* ============================================
   BSS Shared — Date/Time Utilities
   ใช้ร่วมกัน: Verify, Revoke, Reconcile

   Functions:
   - BssDateTime.format(dateStr)       → "21/7/2568 14:00"
   - BssDateTime.formatDateOnly(dateStr) → "21/7/2568"
   - BssDateTime.showCurrent(elementId) → updates element text
   - BssDateTime.startClock(elementId, interval) → auto-update
   ============================================ */

var BssDateTime = (function () {
    'use strict';

    /**
     * Format ISO date string to Thai Buddhist date+time
     * @param {string} dateStr - ISO date string or any parseable date
     * @returns {string} "d/m/yyyy hh:mm" (Buddhist Era) or "-"
     */
    function format(dateStr) {
        if (!dateStr) return '-';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear() + 543;
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        return day + '/' + month + '/' + year + ' ' + hh + ':' + mm;
    }

    /**
     * Format ISO date string to Thai Buddhist date only
     * @param {string} dateStr - ISO date string
     * @returns {string} "d/m/yyyy" (Buddhist Era) or "-"
     */
    function formatDateOnly(dateStr) {
        if (!dateStr) return '-';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear() + 543;
        return day + '/' + month + '/' + year;
    }

    /**
     * Show current date+time in an element (Thai Buddhist Era)
     * @param {string} elementId - DOM element ID to update
     * @param {boolean} [includeSeconds=false] - Include seconds in output
     */
    function showCurrent(elementId, includeSeconds) {
        var now = new Date();
        var day = now.getDate();
        var month = now.getMonth() + 1;
        var year = now.getFullYear() + 543;
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var formatted = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
        if (includeSeconds) {
            var seconds = String(now.getSeconds()).padStart(2, '0');
            formatted += ':' + seconds;
        }
        var el = document.getElementById(elementId);
        if (el) el.textContent = formatted;
    }

    /**
     * Start auto-updating clock on an element
     * @param {string} elementId - DOM element ID
     * @param {number} [intervalMs=60000] - Update interval in ms
     * @param {boolean} [includeSeconds=false] - Include seconds
     * @returns {number} intervalId for clearInterval
     */
    function startClock(elementId, intervalMs, includeSeconds) {
        showCurrent(elementId, includeSeconds);
        return setInterval(function () {
            showCurrent(elementId, includeSeconds);
        }, intervalMs || 60000);
    }

    return {
        format: format,
        formatDateOnly: formatDateOnly,
        showCurrent: showCurrent,
        startClock: startClock
    };
})();
