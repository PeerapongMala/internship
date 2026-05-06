/* ============================================
   BSS Shared — Modal Utilities
   ใช้ร่วมกัน: Verify, Revoke, Reconcile

   Functions:
   - BssModal.setStep(modalId, stepId)
   - BssModal.chain(closeModalId, openCallback)
   - BssModal.showInlineError(errorId)
   - BssModal.hideInlineError(errorId)
   - BssModal.showSuccess(modalId, messageId, message)
   - BssModal.showError(modalId, messageId, message)
   ============================================ */

var BssModal = (function () {
    'use strict';

    /**
     * Switch to a specific step inside a multi-step modal
     * @param {string} modalId - Modal container element ID
     * @param {string} stepId - Target step element ID
     */
    function setStep(modalId, stepId) {
        var modal = document.getElementById(modalId);
        if (!modal) return;
        modal.querySelectorAll('.modal-step').forEach(function (step) {
            step.classList.remove('active');
        });
        var target = document.getElementById(stepId);
        if (target) target.classList.add('active');
    }

    /**
     * Chain modals: close one, then open another via callback
     * Waits for Bootstrap hidden.bs.modal event before calling callback
     * @param {string} closeModalId - Modal to close first
     * @param {function} openCallback - Called after modal is fully hidden
     */
    function chain(closeModalId, openCallback) {
        var el = document.getElementById(closeModalId);
        if (!el) { openCallback(); return; }
        var instance = bootstrap.Modal.getInstance(el);
        if (!instance) { openCallback(); return; }
        el.addEventListener('hidden.bs.modal', function onHidden() {
            el.removeEventListener('hidden.bs.modal', onHidden);
            openCallback();
        });
        instance.hide();
    }

    /**
     * Show inline error element (adds .show class)
     * @param {string} errorId - Error element ID
     */
    function showInlineError(errorId) {
        var el = document.getElementById(errorId);
        if (el) el.classList.add('show');
    }

    /**
     * Hide inline error element (removes .show class)
     * @param {string} errorId - Error element ID
     */
    function hideInlineError(errorId) {
        var el = document.getElementById(errorId);
        if (el) el.classList.remove('show');
    }

    /**
     * Show a success modal with custom message
     * @param {string} modalId - Modal element ID
     * @param {string} messageId - Message text element ID
     * @param {string} [message] - Custom message (default: "ดำเนินการสำเร็จ")
     */
    function showSuccess(modalId, messageId, message) {
        var msgEl = document.getElementById(messageId);
        if (msgEl) msgEl.textContent = message || 'ดำเนินการสำเร็จ';
        var modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    /**
     * Show an error modal with custom message
     * @param {string} modalId - Modal element ID
     * @param {string} messageId - Message text element ID
     * @param {string} [message] - Custom message (default: "เกิดข้อผิดพลาด")
     */
    function showError(modalId, messageId, message) {
        var msgEl = document.getElementById(messageId);
        if (msgEl) msgEl.textContent = message || 'เกิดข้อผิดพลาด';
        var modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    return {
        setStep: setStep,
        chain: chain,
        showInlineError: showInlineError,
        hideInlineError: hideInlineError,
        showSuccess: showSuccess,
        showError: showError
    };
})();
