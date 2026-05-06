/* ============================================
   BSS Shared — Sort State & Icon Management
   ใช้ร่วมกัน: Verify, Revoke, Reconcile
   Uses Bootstrap Icons: bi-chevron-expand, bi-chevron-up, bi-chevron-down

   Functions:
   - BssSort.createState()            → { column: null, direction: 'asc' }
   - BssSort.toggle(state, column)    → toggles sort direction
   - BssSort.updateIcons(tableId, column, direction)
   - BssSort.compare(a, b, column, direction, formatters)
   ============================================ */

var BssSort = (function () {
    'use strict';

    /**
     * Create a new sort state object
     * @returns {{ column: null, direction: string }}
     */
    function createState() {
        return { column: null, direction: 'asc' };
    }

    /**
     * Toggle sort state for a column
     * If same column, flip direction. If new column, set ascending.
     * @param {object} state - Sort state { column, direction }
     * @param {string} column - Column key to sort by
     * @returns {object} Updated state (same reference)
     */
    function toggle(state, column) {
        if (state.column === column) {
            state.direction = state.direction === 'asc' ? 'desc' : 'asc';
        } else {
            state.column = column;
            state.direction = 'asc';
        }
        return state;
    }

    /**
     * Update sort icons in a table's header
     * Resets all icons to bi-chevron-expand, sets active column icon
     * @param {string} tableId - Table element ID
     * @param {string|null} activeColumn - Active sort column (data-sort attribute)
     * @param {string} direction - 'asc' or 'desc'
     */
    function updateIcons(tableId, activeColumn, direction) {
        var table = document.getElementById(tableId);
        if (!table) return;
        // Reset all icons to default
        table.querySelectorAll('.th-sort .sort-icon').forEach(function (icon) {
            icon.className = 'bi bi-chevron-expand sort-icon';
        });
        // Set active icon
        if (!activeColumn) return;
        var activeTh = table.querySelector('.th-sort[data-sort="' + activeColumn + '"]');
        if (activeTh) {
            var icon = activeTh.querySelector('.sort-icon');
            if (icon) {
                icon.className = direction === 'asc'
                    ? 'bi bi-chevron-up sort-icon'
                    : 'bi bi-chevron-down sort-icon';
            }
        }
    }

    /**
     * Generic compare function for sorting arrays
     * @param {*} a - First value
     * @param {*} b - Second value
     * @param {string} column - Column key
     * @param {string} direction - 'asc' or 'desc'
     * @param {object} [formatters] - Optional { column: function(val) => comparable }
     * @returns {number} Sort comparison result
     */
    function compare(a, b, column, direction, formatters) {
        var valA = a[column];
        var valB = b[column];

        // Apply formatter if provided
        if (formatters && formatters[column]) {
            valA = formatters[column](valA);
            valB = formatters[column](valB);
        }

        // Handle null/undefined
        if (valA == null) valA = '';
        if (valB == null) valB = '';

        // Numeric comparison
        var numA = parseFloat(valA);
        var numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
            return direction === 'asc' ? numA - numB : numB - numA;
        }

        // String comparison
        var strA = String(valA).toLowerCase();
        var strB = String(valB).toLowerCase();
        if (strA < strB) return direction === 'asc' ? -1 : 1;
        if (strA > strB) return direction === 'asc' ? 1 : -1;
        return 0;
    }

    return {
        createState: createState,
        toggle: toggle,
        updateIcons: updateIcons,
        compare: compare
    };
})();
