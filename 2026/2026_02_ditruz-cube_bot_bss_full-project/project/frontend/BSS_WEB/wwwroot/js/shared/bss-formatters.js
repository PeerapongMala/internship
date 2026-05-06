/* ============================================
   BSS Shared — Number & Badge Formatters
   ใช้ร่วมกัน: Verify, Revoke, Reconcile

   Functions:
   - BssFormat.numberWithCommas(x)    → "1,000,000"
   - BssFormat.getDenomBadgeClass(price) → "qty-badge qty-1000"
   - BssFormat.denomBadgeHtml(price)  → '<span class="qty-badge qty-1000">1000</span>'
   ============================================ */

var BssFormat = (function () {
    'use strict';

    /**
     * Format number with comma separators
     * @param {number|string|null} x
     * @returns {string} Formatted number or "0"
     */
    function numberWithCommas(x) {
        if (x == null) return '0';
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Get denomination badge CSS class
     * @param {number|string} price - Denomination value (20, 50, 100, 500, 1000)
     * @returns {string} CSS class string "qty-badge qty-{price}" or "qty-badge"
     */
    function getDenomBadgeClass(price) {
        var p = parseInt(price);
        if ([20, 50, 100, 500, 1000].indexOf(p) !== -1) return 'qty-badge qty-' + p;
        return 'qty-badge';
    }

    /**
     * Generate denomination badge HTML
     * @param {number|string} price - Denomination value
     * @returns {string} HTML span element with badge class and formatted value
     */
    function denomBadgeHtml(price) {
        var cls = getDenomBadgeClass(price);
        return '<span class="' + cls + '">' + parseInt(price) + '</span>';
    }

    return {
        numberWithCommas: numberWithCommas,
        getDenomBadgeClass: getDenomBadgeClass,
        denomBadgeHtml: denomBadgeHtml
    };
})();
