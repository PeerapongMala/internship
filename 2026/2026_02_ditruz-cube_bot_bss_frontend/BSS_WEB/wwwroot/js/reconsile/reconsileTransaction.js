/**
 * Reconsile Transaction — JavaScript
 * Built from Figma node 1:18004 (Reconcile - Unfit)
 *
 * Layout: 2-section vertical
 *   Top: Info Card + 2-column (Denom Table | Input Form)
 *   Bottom: Summary Table + Action Buttons
 */

'use strict';

// ============================================================
// Configuration
// ============================================================
<<<<<<< HEAD
const USE_MOCK_DATA = true;
// Mock data mode: 'minimal' = few rows (no scroll), 'full' = many rows (with scroll)
// Press 'M' key (while not typing in input) to toggle
let MOCK_DATA_MODE = 'minimal';
=======
const USE_MOCK_DATA = false;
// Mock data mode: 'minimal' = few rows (no scroll), 'full' = many rows (with scroll)
// Press 'M' key (while not typing in input) to toggle
let MOCK_DATA_MODE = 'minimal';
let savingInProgress = false;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// ============================================================
// State
// ============================================================
let denomTableData = [];
let summaryTableData = [];
let denomSortField = 'headerCard';
let denomSortDir = 'asc';
let summarySortField = 'localId';
let summarySortDir = 'desc';
let currentHeaderCard = null;
let nextLocalId = 1;
<<<<<<< HEAD
=======
let reconsileAttemptCount = {};      // UC02: { hc: number } — นับจำนวนครั้งที่ cancel
let lockedHeaderCards = new Set();   // UC02: HC ที่ถูกล็อก (attempt >= 3)
let reconsileFlowCompleted = false;  // UC02: flag แยก cancel vs complete
let unlockFlowData = null;           // UC03: { hc, supervisorId, otpCode }
let unlockOtpInterval = null;        // UC03: OTP countdown timer
let currentReconsileTranId = 0;      // API: active reconsile_tran_id from scan response
let summaryDirty = false;            // track unsaved changes in summary table
let totalBundles = 0;                // UC06: จำนวนมัดทั้งหมดจาก API
let multiBundleMode = false;         // UC06: อยู่ใน multi-bundle flow หรือไม่
let parentHeaderCard = null;         // UC06: HC ตัวแรกที่มี >1 มัด (parent)

// OTP: User context (populated from hidden inputs on DOMContentLoaded)
let currentUserId = 0;
let currentDepartmentId = 0;

// OTP: Cancel flow state (UC02)
let cancelFlowData = null;
let cancelOtpInterval = null;

// ============================================================
// Display 2 (p01 จะเปิดหน้าจอ 2 — p02 แค่ส่ง data ไปแสดง)
// ============================================================
let pageTwoWindow = null;

function openDisplay2() {
    pageTwoWindow = window.open('/Reconcilation/SecondScreenReconsile', '_blank',
        'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
}

function updateDisplay2(data) {
    // Always persist to localStorage — D2 reads from this key
    // Merge กับ data เดิม เพื่อให้ error/success ยังมี bankCode, denom, headerCard ฯลฯ
    try {
        if (data.state === 'initial') {
            localStorage.setItem('bss-d2-reconsile', JSON.stringify({ state: 'initial' }));
        } else {
            var prev = {};
            try { prev = JSON.parse(localStorage.getItem('bss-d2-reconsile')) || {}; } catch (e2) { }
            var merged = Object.assign({}, prev, data);
            localStorage.setItem('bss-d2-reconsile', JSON.stringify(merged));
        }
    } catch (e) { }

    // Direct DOM manipulation (bonus — works when D2 was opened from D1 and reference is alive)
    if (!pageTwoWindow || pageTwoWindow.closed) return;
    try {
        var doc = pageTwoWindow.document;
        if (!doc || !doc.getElementById('d2State')) return;
        var $doc = $(doc);
        $doc.find('#d2State').val(data.state || 'initial');
        if (data.state === 'initial') {
            $doc.find('#d2MachineName').text('');
            $doc.find('#d2BankCode').text('');
            $doc.find('#d2BranchName').text('');
            $doc.find('#d2Denom').text('').attr('class', 'd2-denom');
            $doc.find('#d2HeaderCard').text('');
            $doc.find('#d2RejectCount').text('');
            $doc.find('#d2RejectRow').hide();
            $doc.find('#d2BadgeArea').empty();
        } else if (data.state === 'inprogress') {
            // Inprogress: populate info card + table + form mirror
            if (data.headerCard !== undefined) $doc.find('#d2IpHeaderCard').text(data.headerCard);
            if (data.bundleCount !== undefined) $doc.find('#d2IpBundleCount').text(data.bundleCount);
            // Date/Time — current timestamp
            var now = new Date();
            var buddhistYear = now.getFullYear() + 543;
            var dtStr = String(now.getDate()).padStart(2, '0') + '/' +
                String(now.getMonth() + 1).padStart(2, '0') + '/' +
                buddhistYear + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0');
            $doc.find('#d2IpDateTime').text(dtStr);

            // Render table rows
            if (data.tableRows && data.tableRows.length > 0) {
                var tbody = doc.getElementById('d2IpTableBody');
                if (tbody) {
                    var html = '';
                    data.tableRows.forEach(function (r) {
                        html += '<tr>' +
                            '<td>' + escapeHtml(r.headerCard) + '</td>' +
                            '<td>' + escapeHtml(r.denom) + '</td>' +
                            '<td>' + escapeHtml(r.bank) + '</td>' +
                            '<td>' + escapeHtml(r.cashpoint) + '</td>' +
                            '<td>' + escapeHtml(r.bundle) + '</td>' +
                            '</tr>';
                    });
                    tbody.innerHTML = html;
                }
            }

            // Form mirror initial state
            if (data.formState) {
                updateDisplay2FormInternal(doc, data.formState);
            }

            // Also set post-process fields for when state changes later
            if (data.bankCode !== undefined) $doc.find('#d2BankCode').text(data.bankCode);
            if (data.machineName !== undefined) $doc.find('#d2MachineName').text(data.machineName);
            if (data.branchName !== undefined) $doc.find('#d2BranchName').text(data.branchName);
            if (data.denom !== undefined) {
                var denomEl = doc.getElementById('d2Denom');
                if (denomEl) {
                    denomEl.textContent = data.denom ? ('\u0E3F' + data.denom) : '';
                    denomEl.className = 'd2-denom' + (data.denom ? ' d2-denom-' + data.denom : '');
                }
            }
            if (data.headerCard !== undefined) $doc.find('#d2HeaderCard').text(data.headerCard);
        } else {
            // error / success — post-process layout
            if (data.machineName !== undefined) $doc.find('#d2MachineName').text(data.machineName);
            if (data.bankCode !== undefined) $doc.find('#d2BankCode').text(data.bankCode);
            if (data.branchName !== undefined) $doc.find('#d2BranchName').text(data.branchName);
            if (data.denom !== undefined) {
                var denomEl = doc.getElementById('d2Denom');
                if (denomEl) {
                    denomEl.textContent = data.denom ? ('\u0E3F' + data.denom) : '';
                    denomEl.className = 'd2-denom' + (data.denom ? ' d2-denom-' + data.denom : '');
                }
            }
            if (data.headerCard !== undefined) $doc.find('#d2HeaderCard').text(data.headerCard);
            if (data.rejectCount !== undefined && data.rejectCount !== null && data.rejectCount !== '') {
                $doc.find('#d2RejectCount').text(data.rejectCount);
                $doc.find('#d2RejectRow').show();
            }
            updateDisplay2Badges(data.badges || []);
        }
        $doc.find('#btnRefreshSecondScreen').click();
    } catch (e) { }
}

// Lightweight form-only sync for Display 2 inprogress state
function updateDisplay2Form(formState) {
    // Merge form state into localStorage so D2 can restore on reload
    try {
        var stored = localStorage.getItem('bss-d2-reconsile');
        if (stored) {
            var d = JSON.parse(stored);
            if (d.state === 'inprogress') {
                d.formState = Object.assign(d.formState || {}, formState);
                localStorage.setItem('bss-d2-reconsile', JSON.stringify(d));
            }
        }
    } catch (e) { }

    // Direct DOM (when window reference is alive)
    if (!pageTwoWindow || pageTwoWindow.closed) return;
    try {
        var doc = pageTwoWindow.document;
        if (!doc || !doc.getElementById('d2State')) return;
        var currentState = doc.getElementById('d2State').value;
        if (currentState !== 'inprogress') return;
        updateDisplay2FormInternal(doc, formState);
    } catch (e) { }
}

function updateDisplay2FormInternal(doc, formState) {
    if (!formState) return;
    // Banknote type radio
    if (formState.banknoteType !== undefined) {
        var items = doc.querySelectorAll('#d2IpBanknoteType .d2-ip-radio-item');
        items.forEach(function (el) {
            if (el.getAttribute('data-value') === formState.banknoteType) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }
    // Denom chip
    if (formState.denomValue !== undefined) {
        var chips = doc.querySelectorAll('#d2IpDenomChips .d2-ip-denom-chip');
        chips.forEach(function (el) {
            if (el.getAttribute('data-value') === String(formState.denomValue)) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }
    // Series
    if (formState.series !== undefined) {
        var seriesEl = doc.getElementById('d2IpSeries');
        if (seriesEl) seriesEl.textContent = formState.series;
    }
}

function updateDisplay2Badges(badges) {
    if (!pageTwoWindow || pageTwoWindow.closed) return;
    try {
        var area = pageTwoWindow.document.getElementById('d2BadgeArea');
        if (!area) return;
        area.innerHTML = '';
        if (!badges || badges.length === 0) return;
        var bar = pageTwoWindow.document.createElement('div');
        var isSuccess = badges[0].type === 'success';
        bar.className = 'd2-badge-bar ' + (isSuccess ? 'd2-badge-bar-success' : 'd2-badge-bar-error');
        if (badges.length === 1 && !badges[0].desc) {
            var title = pageTwoWindow.document.createElement('div');
            title.className = 'd2-badge-title';
            title.textContent = badges[0].text;
            bar.appendChild(title);
        } else if (badges.length === 1 && badges[0].desc) {
            var title = pageTwoWindow.document.createElement('div');
            title.className = 'd2-badge-title';
            title.textContent = badges[0].text;
            bar.appendChild(title);
            var desc = pageTwoWindow.document.createElement('div');
            desc.className = 'd2-badge-desc';
            desc.textContent = badges[0].desc;
            bar.appendChild(desc);
        } else {
            var tagsDiv = pageTwoWindow.document.createElement('div');
            tagsDiv.className = 'd2-badge-tags';
            badges.forEach(function (b) {
                var tag = pageTwoWindow.document.createElement('span');
                tag.className = 'd2-badge-tag';
                tag.textContent = b.text;
                tagsDiv.appendChild(tag);
            });
            bar.appendChild(tagsDiv);
        }
        area.appendChild(bar);
    } catch (e) { }
}

function buildDisplay2Badges() {
    var badges = [];
    if (reconsileFlowData) {
        // "ขาด-เกิน" เป็นตัวแรกเสมอเมื่อมี warning
        badges.push({ type: 'error', text: 'ขาด-เกิน' });
        if (reconsileFlowData.fakeQty > 0) badges.push({ type: 'error', text: 'ปลอม: ' + reconsileFlowData.fakeQty });
        if (reconsileFlowData.damagedQty > 0) badges.push({ type: 'error', text: 'ชำรุด: ' + reconsileFlowData.damagedQty });
    }
    if (badges.length === 0) badges.push({ type: 'success', text: 'ครบจำนวน ครบมูลค่า' });
    return badges;
}

// ============================================================
// Clear page after reconciliation (browser back from p01)
// ============================================================
function clearAfterReconciliation() {
    currentReconsileTranId = 0;
    currentHeaderCard = null;
    denomTableData = [];
    summaryTableData = [];
    nextLocalId = 1;
    summaryDirty = false;
    totalBundles = 0;
    multiBundleMode = false;
    parentHeaderCard = null;

    document.getElementById('infoHeaderCard').textContent = '-';
    document.getElementById('infoBundleCount').textContent = '0';
    setHeaderCardEnabled(true); // เปิด HC กลับมาเมื่อ reset
    renderDenomTable();
    renderSummaryTable();

    // D2: clear localStorage → D2 refresh จะกลับ initial
    updateDisplay2({ state: 'initial' });

    // ลบ reconsileTranId ออกจาก URL เพื่อไม่ให้ refresh แล้วโหลดข้อมูลกลับมา
    if (window.location.search.indexOf('reconsileTranId') !== -1) {
        var url = new URL(window.location);
        url.searchParams.delete('reconsileTranId');
        history.replaceState(null, '', url.pathname + url.search);
    }
}

window.addEventListener('beforeunload', function (e) {
    if (summaryDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});

window.addEventListener('pageshow', function () {
    if (sessionStorage.getItem('reconciled')) {
        sessionStorage.removeItem('reconciled');
        clearAfterReconciliation();
    }
});
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// ============================================================
// DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
<<<<<<< HEAD
=======
    // OTP: Read user context from hidden inputs
    currentUserId = Number(document.getElementById('currentUserId')?.value) || 0;
    currentDepartmentId = Number(document.getElementById('currentDepartmentId')?.value) || 0;

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    setupRadioGroups();
    setupDenomChips();
    setupSortHandlers();
    setupButtonHandlers();
    updateDateTime();
    setInterval(updateDateTime, 1000);
<<<<<<< HEAD
=======
    loadSupervisorList();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    if (USE_MOCK_DATA) {
        loadMockData();
        setupMockToggle();
    } else {
<<<<<<< HEAD
        // TODO: Load real data from API
    }
=======
        // Real mode: page will receive data via p01 navigation (reconsileTranId)
        // Child HC input for multi-bundle real mode
        var childHcInput = document.getElementById('childHcInput');
        if (childHcInput) {
            childHcInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleChildHcScan();
                }
            });
        }

        // ถ้ากระทบยอดเสร็จแล้ว → ไม่โหลดข้อมูลซ้ำ (กดย้อนกลับจาก p01)
        if (sessionStorage.getItem('reconciled')) {
            sessionStorage.removeItem('reconciled');
        } else {
            var urlParams = new URLSearchParams(window.location.search);
            var tranId = urlParams.get('reconsileTranId');
            if (tranId) {
                currentReconsileTranId = parseInt(tranId);
                loadReconsileDetail(currentReconsileTranId);
            }
        }
    }

    // Ensure tables always sync with JS state on load
    // (prevents stale DOM rows when browser restores page from cache)
    renderDenomTable();
    renderSummaryTable();

    // Always focus quantity input on page load
    var inputQty = document.getElementById('inputQuantity');
    if (inputQty) inputQty.focus();

    // DEV TOOLS — toggle panel
    var btnToggle = document.getElementById('btnToggleDevTools');
    var devPanel = document.getElementById('mockDevTools');
    if (btnToggle && devPanel) {
        btnToggle.addEventListener('click', function () {
            var isOpen = devPanel.style.display === 'flex';
            devPanel.style.display = isOpen ? 'none' : 'flex';
            btnToggle.textContent = isOpen ? 'Dev Mode' : '✕';
            btnToggle.style.background = isOpen ? '#555' : '#d32f2f';
        });
    }
    var btnScan = document.getElementById('btnScanHeaderCard');
    var scanInput = document.getElementById('scanHeaderCardInput');
    if (btnScan && scanInput) {
        btnScan.addEventListener('click', function () {
            var hcCode = scanInput.value.trim();
            if (!hcCode) return;
            $.requestAjax({
                service: 'Reconcilation/ReconciliationScanHeaderCard',
                type: 'POST',
                parameter: { HeaderCardCode: hcCode },
                onSuccess: function (res) {
                    if (res && res.is_success && res.data && res.data.isSuccess) {
                        currentReconsileTranId = res.data.reconciliationTranId;
                        loadReconsileDetail(currentReconsileTranId);
                    } else {
                        alert('Scan failed: ' + (res?.data?.message || res?.msg_desc || 'Unknown error'));
                    }
                },
                onError: function () { alert('Scan API error'); }
            });
        });
        scanInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); btnScan.click(); }
        });
    }
    var btnClear = document.getElementById('btnClearHc');
    if (btnClear) btnClear.addEventListener('click', function () { clearAfterReconciliation(); });
    var btnD2 = document.getElementById('btnOpenDisplay2');
    if (btnD2) btnD2.addEventListener('click', function () { openDisplay2(); });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
});

// ============================================================
// Mock Data
// ============================================================
function loadMockData() {
    nextLocalId = 1;
    if (MOCK_DATA_MODE === 'full') {
        loadMockDataFull();
    } else {
        loadMockDataMinimal();
    }
    renderDenomTable();
    renderSummaryTable();
}

function loadMockDataMinimal() {
    denomTableData = [
<<<<<<< HEAD
        { headerCard: '0054941201', denom: 100, bundle: 1 },
=======
        { headerCard: '0054941201', denom: 100, bank: 'SCB', cashpoint: 'CP001', bundle: 1 },
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    ];
    summaryTableData = [
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:00', denom: 100, type: 17, category: 'Reject', qty: 7, value: 700, remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:00', denom: 100, type: 16, category: 'Reject', qty: 1, value: 100, remark: '' },
    ];
    currentHeaderCard = '0054941201';
    document.getElementById('infoHeaderCard').textContent = currentHeaderCard;
    document.getElementById('infoBundleCount').textContent = '1';
}

function loadMockDataFull() {
    denomTableData = [
<<<<<<< HEAD
        { headerCard: '0054941201', denom: 1000, bundle: 3 },
        { headerCard: '0054941201', denom: 500,  bundle: 2 },
        { headerCard: '0054941201', denom: 100,  bundle: 5 },
        { headerCard: '0054941201', denom: 50,   bundle: 1 },
        { headerCard: '0054941201', denom: 20,   bundle: 4 },
        { headerCard: '0054941202', denom: 1000, bundle: 2 },
        { headerCard: '0054941202', denom: 500,  bundle: 1 },
        { headerCard: '0054941202', denom: 100,  bundle: 3 },
        { headerCard: '0054941203', denom: 100,  bundle: 2 },
        { headerCard: '0054941203', denom: 50,   bundle: 6 },
        { headerCard: '0054941204', denom: 1000, bundle: 1 },
        { headerCard: '0054941204', denom: 20,   bundle: 8 },
=======
        { headerCard: '0054941201', denom: 1000, bank: 'SCB', cashpoint: 'CP001', bundle: 3 },
        { headerCard: '0054941201', denom: 500,  bank: 'SCB', cashpoint: 'CP001', bundle: 2 },
        { headerCard: '0054941201', denom: 100,  bank: 'SCB', cashpoint: 'CP001', bundle: 5 },
        { headerCard: '0054941201', denom: 50,   bank: 'SCB', cashpoint: 'CP001', bundle: 1 },
        { headerCard: '0054941201', denom: 20,   bank: 'SCB', cashpoint: 'CP001', bundle: 4 },
        { headerCard: '0054941202', denom: 1000, bank: 'KTB', cashpoint: 'CP002', bundle: 2 },
        { headerCard: '0054941202', denom: 500,  bank: 'KTB', cashpoint: 'CP002', bundle: 1 },
        { headerCard: '0054941202', denom: 100,  bank: 'KTB', cashpoint: 'CP002', bundle: 3 },
        { headerCard: '0054941203', denom: 100,  bank: 'BBL', cashpoint: 'CP003', bundle: 2, swapped: true },
        { headerCard: '0054941203', denom: 50,   bank: 'BBL', cashpoint: 'CP003', bundle: 6, swapped: true },
        { headerCard: '0054941204', denom: 1000, bank: 'KBANK', cashpoint: 'CP004', bundle: 1, swapped: true },
        { headerCard: '0054941204', denom: 20,   bank: 'KBANK', cashpoint: 'CP004', bundle: 8, swapped: true },
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    ];
    summaryTableData = [
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:00', denom: 1000, type: 17, category: 'Reject',  qty: 5,  value: 5000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:00', denom: 1000, type: 16, category: 'Reject',  qty: 3,  value: 3000,  remark: '' },
<<<<<<< HEAD
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:05', denom: 500,  type: 17, category: 'ปลอม',    qty: 2,  value: 1000,  remark: 'ตรวจซ้ำ' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:05', denom: 100,  type: 15, category: 'Reject',  qty: 10, value: 1000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:10', denom: 100,  type: 16, category: 'ชำรุด',    qty: 7,  value: 700,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:10', denom: 50,   type: 17, category: 'Reject',  qty: 12, value: 600,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:15', denom: 20,   type: 15, category: 'Reject',  qty: 20, value: 400,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:20', denom: 1000, type: 17, category: 'Reject',  qty: 4,  value: 4000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:20', denom: 500,  type: 16, category: 'ปลอม',    qty: 1,  value: 500,   remark: 'ส่งตรวจ' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:25', denom: 100,  type: 17, category: 'Reject',  qty: 8,  value: 800,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941203', time: '21/7/2568 14:30', denom: 100,  type: 15, category: 'ชำรุด',    qty: 6,  value: 600,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941203', time: '21/7/2568 14:30', denom: 50,   type: 16, category: 'Reject',  qty: 15, value: 750,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:35', denom: 1000, type: 17, category: 'Reject',  qty: 2,  value: 2000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:35', denom: 20,   type: 15, category: 'Reject',  qty: 30, value: 600,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:40', denom: 20,   type: 16, category: 'ชำรุด',    qty: 25, value: 500,   remark: 'สภาพแย่' },
=======
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:05', denom: 500,  type: 99, category: 'ปลอม',    qty: 2,  value: 0,     remark: 'ตรวจซ้ำ' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:05', denom: 100,  type: 15, category: 'Reject',  qty: 10, value: 1000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:10', denom: 100,  type: 16, category: 'ชำรุด',    qty: 7,  value: 0,     remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:10', denom: 50,   type: 17, category: 'Reject',  qty: 12, value: 600,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941201', time: '21/7/2568 14:15', denom: 20,   type: 15, category: 'Reject',  qty: 20, value: 400,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:20', denom: 1000, type: 17, category: 'Reject',  qty: 4,  value: 4000,  remark: '' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:20', denom: 500,  type: 99, category: 'ปลอม',    qty: 1,  value: 0,     remark: 'ส่งตรวจ' },
        { localId: nextLocalId++, headerCard: '0054941202', time: '21/7/2568 14:25', denom: 100,  type: 17, category: 'Reject',  qty: 8,  value: 800,   remark: '' },
        { localId: nextLocalId++, headerCard: '0054941203', time: '21/7/2568 14:30', denom: 100,  type: 15, category: 'ชำรุด',    qty: 6,  value: 0,     remark: '', swapped: true },
        { localId: nextLocalId++, headerCard: '0054941203', time: '21/7/2568 14:30', denom: 50,   type: 16, category: 'Reject',  qty: 15, value: 750,   remark: '', swapped: true },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:35', denom: 1000, type: 17, category: 'Reject',  qty: 2,  value: 2000,  remark: '', swapped: true },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:35', denom: 20,   type: 15, category: 'Reject',  qty: 30, value: 600,   remark: '', swapped: true },
        { localId: nextLocalId++, headerCard: '0054941204', time: '21/7/2568 14:40', denom: 20,   type: 16, category: 'ชำรุด',    qty: 25, value: 0,     remark: 'สภาพแย่', swapped: true },
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    ];
    currentHeaderCard = '0054941201';
    document.getElementById('infoHeaderCard').textContent = currentHeaderCard;
    document.getElementById('infoBundleCount').textContent = '3';
}

// Toggle mock data mode with 'M' key
function setupMockToggle() {
    document.addEventListener('keydown', function (e) {
        // Ignore if typing in input/select/textarea
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
        if (e.key === 'm' || e.key === 'M') {
            MOCK_DATA_MODE = MOCK_DATA_MODE === 'minimal' ? 'full' : 'minimal';
            loadMockData();
            showMockModeIndicator();
        }
    });
}

function showMockModeIndicator() {
    let indicator = document.getElementById('mockModeIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'mockModeIndicator';
        indicator.style.cssText = 'position:fixed;top:12px;right:12px;padding:6px 16px;border-radius:8px;font-family:bss-pridi;font-size:14px;color:#fff;z-index:9999;transition:opacity 0.5s;pointer-events:none;';
        document.body.appendChild(indicator);
    }
    indicator.textContent = MOCK_DATA_MODE === 'full' ? 'Mock: Full (scrollable)' : 'Mock: Minimal';
    indicator.style.background = MOCK_DATA_MODE === 'full' ? '#003366' : '#6C757D';
    indicator.style.opacity = '1';
    clearTimeout(indicator._timer);
    indicator._timer = setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
}

// ============================================================
<<<<<<< HEAD
=======
// Supervisor List: Load from API
// ============================================================
function loadSupervisorList() {
    loadMasterDropdown({
        cacheKey: 'MasterUserSuperVisor|RG02',
        request: {
            tableName: 'MasterUserSuperVisor',
            operator: 'AND',
            searchCondition: [
                {
                    columnName: 'MasterRoleGroup.RoleGroupCode',
                    filterOperator: 'EQUAL',
                    filterValue: 'RG02'
                }
            ],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        }
    }).then(function (items) {
        var selectIds = ['reconsileSupervisorSelect', 'uc06SupervisorSelect', 'unlockSupervisorSelect', 'cancelSupervisorSelect'];
        selectIds.forEach(function (selId) {
            renderDropdown({ selectId: selId, items: items, includeEmpty: true, emptyText: '-- กรุณาเลือก --' });
        });
    }).catch(function () { });
}

// P01 ↔ P02: redirect กลับ p01 พร้อม query string บอกสถานะ
// status: 'reconciled' | 'swapped' | 'cancelled' | 'locked'
function redirectToP01(status) {
    var hc = parentHeaderCard || currentHeaderCard;
    var url = '/BSS_WEB/Reconcilation/ReconcileTransaction';
    var params = [];
    if (hc) params.push('hc=' + encodeURIComponent(hc));
    if (status) params.push('status=' + encodeURIComponent(status));
    if (currentReconsileTranId) params.push('tranId=' + currentReconsileTranId);
    if (params.length > 0) url += '?' + params.join('&');

    summaryDirty = false;
    sessionStorage.setItem('reconciled', '1');
    // D2: reset to initial ก่อน navigate ออก (ใช้ setItem แทน removeItem เพื่อให้ storage event fire ด้วย truthy newValue)
    try { localStorage.setItem('bss-d2-reconsile', JSON.stringify({ state: 'initial' })); } catch (e) { }
    window.location.replace(url);
}

// UC06: เปิด/ปิด Header Card info bar (ตาม Figma: ปิดหลังสแกน, เปิดเมื่อพบ > 1 มัด)
// ใน production ตรงนี้จะรับค่า HC จาก p01 — mock scanner bar ไม่เกี่ยว
var headerCardScanEnabled = true;
function setHeaderCardEnabled(enabled) {
    headerCardScanEnabled = enabled;
    var badge = document.getElementById('infoHeaderCard');
    var childInput = document.getElementById('childHcInput');
    if (enabled && multiBundleMode) {
        // Multi-bundle: ซ่อน badge → แสดง input ให้ cursor กะพริบ
        if (badge) badge.style.display = 'none';
        if (childInput) { childInput.style.display = ''; childInput.value = ''; childInput.focus(); }
    } else {
        // ปกติ: แสดง badge → ซ่อน input
        if (badge) { badge.style.display = ''; badge.style.opacity = enabled ? '1' : '0.6'; badge.style.pointerEvents = enabled ? 'auto' : 'none'; }
        if (childInput) childInput.style.display = 'none';
    }
}

// UC06: helper — เพิ่ม child HC เข้า denom table
function addChildHcToDenom(headerCardCode, scanInput) {
    console.log('[addChildHcToDenom] setting currentHeaderCard =', headerCardCode, '(was:', currentHeaderCard, ')');
    currentHeaderCard = headerCardCode;
    document.getElementById('infoHeaderCard').textContent = parentHeaderCard || headerCardCode;
    var parentRow = denomTableData[0];
    denomTableData.push({
        headerCard: headerCardCode,
        denom: parentRow ? parentRow.denom : 1000,
        bank: parentRow ? parentRow.bank : '',
        cashpoint: parentRow ? parentRow.cashpoint : '',
        bundle: 0
    });
    renderDenomTable();
    document.getElementById('infoBundleCount').textContent = denomTableData.length;
    scanInput.value = '';
    if (denomTableData.length >= totalBundles) {
        setHeaderCardEnabled(false);
    }
    var inputQty = document.getElementById('inputQuantity');
    if (inputQty) inputQty.focus();
}

// UC06: child HC scan handler for real mode (childHcInput in info bar)
function handleChildHcScan() {
    var input = document.getElementById('childHcInput');
    if (!input) return;
    var headerCardCode = input.value.trim();
    if (!headerCardCode) return;

    if (!headerCardScanEnabled) {
        input.value = '';
        showErrorModal('สแกนครบทุกมัดแล้ว กรุณากรอกข้อมูลแล้วกด "กระทบยอด"');
        return;
    }
    if (headerCardCode === parentHeaderCard) {
        input.value = '';
        showErrorModal('ไม่สามารถสแกน Header Card เดียวกับ Parent ได้');
        return;
    }
    var existsInDenom = denomTableData.some(function(r) { return r.headerCard === headerCardCode; });
    if (existsInDenom) {
        input.value = '';
        showErrorModal('Header Card นี้ถูกสแกนไปแล้ว');
        return;
    }

    // UC05: เช็ค child HC ว่ามียอดเครื่องจักรหรือไม่ (ไม่สร้าง reconcile_tran)
    var checkUrl = (document.body.getAttribute('data-root-path') || '/') + 'Reconcilation/CheckChildHeaderCard?headerCardCode=' + encodeURIComponent(headerCardCode);
    $.enablePageLoader();
    $.ajax({ url: checkUrl, type: 'GET', dataType: 'json' }).done(function (res) {
        if (res && res.is_success && res.data) {
            if (!res.data.exists) {
                input.value = '';
                showErrorModal('ไม่พบ Header Card นี้ในระบบ');
                return;
            }
            if (res.data.totalQty > 0) {
                input.value = '';
                showSwappedWarningAndRedirect(headerCardCode);
                return;
            }
        }
        addChildHcToDenom(headerCardCode, input);
    }).fail(function () {
        console.warn('[handleChildHcScan] CheckChildHeaderCard failed — adding child HC anyway');
        addChildHcToDenom(headerCardCode, input);
    }).always(function () {
        $.disablePageLoader();
    });
}

// ============================================================
// API: Load existing reconsile detail
// ============================================================
function loadReconsileDetail(reconsileTranId) {
    $.requestAjax({
        service: 'Reconcilation/GetReconciliationHeaderCardDetail?reconsileTranId=' + reconsileTranId,
        type: 'GET',
        onSuccess: function (res) {
            if (res && res.is_success && res.data) {
                var d = res.data;
                currentHeaderCard = d.headerCardCode;
                document.getElementById('infoHeaderCard').textContent = d.headerCardCode || '-';
                document.getElementById('infoBundleCount').textContent = d.bundleNumber || '-';

                // Populate left denom table from preparation bundles (grouped by denom)
                // UC06: ถ้าอยู่ใน multi-bundle mode แล้ว → ไม่ overwrite denomTableData
                if (multiBundleMode && denomTableData.length > 0) {
                    // skip — keep existing denom data from parent + child HCs
                } else if (d.bundles && d.bundles.length > 0) {
                    // Group bundles by denomination → count bundles per denom
                    var grouped = {};
                    d.bundles.forEach(function (b) {
                        var key = b.denomPrice;
                        if (!grouped[key]) {
                            grouped[key] = {
                                headerCard: b.headerCardCode || d.headerCardCode,
                                denom: b.denomPrice,
                                bank: b.bankName || '',
                                bankCode: b.bankCode || '',
                                cashpoint: b.cashpointName || '',
                                bundle: 0
                            };
                        }
                        grouped[key].bundle += 1; // count bundles
                    });
                    denomTableData = Object.values(grouped);
                    renderDenomTable();

                    // Set denom chip to match first bundle's denomination
                    var firstDenom = d.bundles[0].denomPrice;
                    selectDenomChip(firstDenom);
                }

                // UC06: เก็บ totalBundles จาก API (alert จะแสดงตอนกดกระทบยอดแทน)
                totalBundles = parseInt(d.bundleNumber) || 1;

                // UC06: มัดรวม / มัดสลับมือ → เข้า multiBundleMode ทั้งคู่
                multiBundleMode = totalBundles > 1;
                if (multiBundleMode) {
                    parentHeaderCard = currentHeaderCard;
                    // ยังไม่เปิด childHcInput ตอน scan — รอกดกระทบยอดแล้วเจอ alert ก่อน
                }

                // Focus quantity input after scan
                var inputQty = document.getElementById('inputQuantity');
                if (inputQty) inputQty.focus();

                // D2: ยังไม่ส่ง inprogress ตอน scan — รอ saveToSummary() ค่อยส่ง
            }
        },
        onError: function () { }
    });

    // Load denomination detail
    $.requestAjax({
        service: 'Reconcilation/GetReconciliationDetail?id=' + reconsileTranId,
        type: 'GET',
        onSuccess: function (res) {
            if (res && res.is_success && res.data && res.data.denominations) {
                summaryTableData = [];
                nextLocalId = 1;
                summaryDirty = false;
                var categoryFromBnType = { 'G': 'Reject', 'C': 'ปลอม', 'B': 'ชำรุด' };
                res.data.denominations.forEach(function (d) {
                    var timeStr = '';
                    var isoStr = null;
                    if (d.createdDate) {
                        var dt = new Date(d.createdDate);
                        var by = dt.getFullYear() + 543;
                        timeStr = String(dt.getDate()).padStart(2, '0') + '/' + String(dt.getMonth() + 1).padStart(2, '0') + '/' + by + ' ' +
                            String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
                        isoStr = dt.toISOString();
                    }
                    summaryTableData.push({
                        localId: nextLocalId++,
                        headerCard: d.headerCardCode || res.data.headerCardCode || currentHeaderCard,
                        time: timeStr,
                        countedAt: isoStr,
                        denom: d.denoPrice || 0,
                        type: parseInt(d.denomSeries) || 0,
                        category: categoryFromBnType[d.bnType] || 'Reject',
                        qty: d.qty,
                        value: d.totalValue,
                        remark: ''
                    });
                });
                renderSummaryTable();

                // Restore child HCs to denomTableData (0-bundle HCs added via addChildHcToDenom are lost on refresh)
                var denomHcSet = new Set(denomTableData.map(function (r) { return r.headerCard; }));
                var childHcsToAdd = [];
                summaryTableData.forEach(function (r) {
                    if (r.headerCard && !denomHcSet.has(r.headerCard)) {
                        childHcsToAdd.push({ headerCard: r.headerCard, denom: r.denom });
                        denomHcSet.add(r.headerCard);
                    }
                });
                if (childHcsToAdd.length > 0) {
                    childHcsToAdd.forEach(function (c) {
                        denomTableData.push({
                            headerCard: c.headerCard,
                            denom: c.denom,
                            bank: '',
                            cashpoint: '',
                            bundle: 0
                        });
                    });
                    // Re-enter multi-bundle mode
                    if (!multiBundleMode && denomTableData.length > 1) {
                        multiBundleMode = true;
                        parentHeaderCard = denomTableData[0].headerCard;
                    }
                    renderDenomTable();
                }
            }
        },
        onError: function () { }
    });
}

// ============================================================
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// Render: Left Denom Table
// ============================================================
function renderDenomTable() {
    const tbody = document.getElementById('denomTableBody');
    if (!tbody) return;

    let sorted = [...denomTableData];
<<<<<<< HEAD
    if (denomSortField) {
=======
    // UC06: ใน multi-bundle mode เรียงตามลำดับ scan (parent บน, child ล่าง)
    // ไม่ sort ตาม headerCard เพราะจะทำให้ child ขึ้นไปอยู่บน parent
    if (denomSortField && !multiBundleMode) {
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        sorted.sort((a, b) => {
            let va = a[denomSortField];
            let vb = b[denomSortField];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return denomSortDir === 'asc' ? -1 : 1;
            if (va > vb) return denomSortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }

<<<<<<< HEAD
    let html = '';
    sorted.forEach((row, idx) => {
        const isActive = row.headerCard === currentHeaderCard;
        html += `<tr class="${isActive ? 'active-row' : ''}" data-hc="${escapeHtml(row.headerCard)}" onclick="selectDenomRow(this)">
            <td class="col-hc">${escapeHtml(row.headerCard)}</td>
            <td class="col-denom"><span class="qty-badge qty-${row.denom}">${row.denom}</span></td>
=======
    // UC06: ตรวจสอบ HC ที่มีข้อมูลในตารางสรุปแล้ว
    var hcsInSummarySet = new Set(summaryTableData.map(function (r) { return r.headerCard; }));

    let html = '';
    sorted.forEach((row, idx) => {
        const isActive = row.headerCard === currentHeaderCard;
        const isLocked = lockedHeaderCards.has(row.headerCard);
        let rowClass = isActive ? 'active-row' : '';
        if (isLocked) rowClass += ' locked-row';
        let hcIcon = '';
        if (isLocked) hcIcon = ' <i class="bi bi-lock-fill" style="color: #991B1B; font-size: 13px;"></i>';
        html += `<tr class="${rowClass.trim()}" data-hc="${escapeHtml(row.headerCard)}" onclick="selectDenomRow(this)">
            <td class="col-hc">${escapeHtml(row.headerCard)}${hcIcon}</td>
            <td class="col-denom"><span class="qty-badge qty-${row.denom}">${Number(row.denom).toLocaleString()}</span></td>
            <td class="col-bank">${escapeHtml(row.bank || '')}</td>
            <td class="col-cashpoint">${escapeHtml(row.cashpoint || '')}</td>
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td class="col-bundle" style="text-align:center !important;">${row.bundle}</td>
        </tr>`;
    });

    // Fill empty rows
    const emptyCount = Math.max(0, 8 - sorted.length);
    for (let i = 0; i < emptyCount; i++) {
<<<<<<< HEAD
        html += `<tr><td>&nbsp;</td><td></td><td></td></tr>`;
=======
        html += `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>`;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }

    tbody.innerHTML = html;
}

function selectDenomRow(tr) {
    const hc = tr.getAttribute('data-hc');
    if (!hc) return;
<<<<<<< HEAD
    currentHeaderCard = hc;
    document.getElementById('infoHeaderCard').textContent = hc;

    const match = denomTableData.find(r => r.headerCard === hc);
    if (match) {
        document.getElementById('infoBundleCount').textContent = match.bundle;
    }

    renderDenomTable();
=======
    if (lockedHeaderCards.has(hc)) { openUnlockModal(hc); return; } // UC03: เปิด unlock flow

    // UC06: ใน multi-bundle mode ป้องกันเปลี่ยนไปเลือก HC ที่มีข้อมูลในตารางสรุปแล้ว
    // ถ้ายังมี HC อื่นที่ยังไม่มีข้อมูล → บังคับให้ใส่ HC ที่ยังไม่มีก่อน
    if (multiBundleMode) {
        var hcsInSummary = new Set(summaryTableData.map(function (r) { return r.headerCard; }));
        var hasDataAlready = hcsInSummary.has(hc);
        var hcsNeedingData = denomTableData.filter(function (r) { return !hcsInSummary.has(r.headerCard); });
        if (hasDataAlready && hcsNeedingData.length > 0 && hc !== currentHeaderCard) {
            console.log('[selectDenomRow] blocked: HC', hc, 'already has summary data, pending HCs:', hcsNeedingData.map(function (r) { return r.headerCard; }));
            return;
        }
    }

    currentHeaderCard = hc;
    console.log('[selectDenomRow] currentHeaderCard =', currentHeaderCard);
    // UC06: แสดง parent HC ค้างไว้บน info bar (ไม่เปลี่ยนเป็น child HC)
    document.getElementById('infoHeaderCard').textContent = (multiBundleMode && parentHeaderCard) ? parentHeaderCard : hc;

    // Update bundle count = number of distinct preparations for this HC
    const hcRows = denomTableData.filter(r => r.headerCard === hc);
    if (hcRows.length > 0) {
        document.getElementById('infoBundleCount').textContent = hcRows.length;
    }

    renderDenomTable();

    // UC05: swapped warning จะแสดงหลังกระทบยอดใน performReconsile() แทน
}

function showMultiBundleAlert(hc) {
    setTextById('multiBundleAlertMessage', 'Header Card ' + hc + ' นี้ข้อมูลมากกว่า 1 มัด');
    var el = document.getElementById('multiBundleAlertModal');
    var modal = bootstrap.Modal.getOrCreateInstance(el);
    // UC06: เปิด HC กลับมาหลังกด ตกลง เพื่อให้สแกน child HC ได้
    el.addEventListener('hidden.bs.modal', function onHidden() {
        el.removeEventListener('hidden.bs.modal', onHidden);
        setHeaderCardEnabled(true);
    });
    modal.show();
}

// UC02: แสดง modal ล็อก HC
function showHcLockedModal(hc) {
    setTextById('hcLockedTitle', 'Header Card ล็อก');
    setTextById('hcLockedMessage',
        'Header Card นี้มีการกระทบยอดเกิน 3 ครั้ง กรุณาแจ้ง Supervisor เพื่อปลด Lock');
    updateDisplay2({ state: 'error', badges: [{ type: 'error', text: 'Header Card Lock', desc: 'HC ' + hc + ' ถูกล็อก' }] });
    var el = document.getElementById('hcLockedModal');
    var modal = bootstrap.Modal.getOrCreateInstance(el);
    el.addEventListener('hidden.bs.modal', function onLock() {
        el.removeEventListener('hidden.bs.modal', onLock);
        redirectToP01('locked');
    });
    modal.show();
    renderDenomTable();
}

// UC03: เปิด Unlock modal
function openUnlockModal(hc) {
    unlockFlowData = { hc: hc, supervisorId: null, otpCode: null };
    setTextById('unlockHcTitle', 'Header Card ' + hc + ' ถูกล็อก กรุณาเลือก Supervisor เพื่อปลด Lock');
    setTextById('unlockHcTitle2', 'Header Card ' + hc + ' ถูกล็อก กรุณาเลือก Supervisor เพื่อปลด Lock');
    var sel = document.getElementById('unlockSupervisorSelect');
    if (sel) sel.value = '';
    hideInlineErrorById('unlockSupervisorError');
    setModalStep('unlockHcModal', 'unlockStepA');
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('unlockHcModal'));
    modal.show();
}

// UC05: swapped warning → กด ตกลง → cancel reconcile_tran → redirect p01
function showSwappedWarningAndRedirect(hc) {
    var msgEl = document.getElementById('swappedWarningMessage');
    if (msgEl) msgEl.innerHTML = 'HeaderCard ' + hc + ' นี้ไม่ถูกต้อง<br>เนื่องจากมีการวิ่งผ่านเครื่องจักร';
    var el = document.getElementById('swappedWarningModal');
    var modal = bootstrap.Modal.getOrCreateInstance(el);
    el.addEventListener('hidden.bs.modal', function onHidden() {
        el.removeEventListener('hidden.bs.modal', onHidden);
        // Cancel reconcile_tran ก่อน redirect เพื่อไม่ให้สแกนซ้ำได้
        if (!USE_MOCK_DATA && currentReconsileTranId) {
            $.requestAjax({
                service: 'Reconcilation/CancelReconciliation',
                type: 'POST',
                parameter: {
                    ReconciliationTranId: currentReconsileTranId,
                    Remark: 'UC05: มัดสลับมือ — ส่ง manual key-in'
                },
                onSuccess: function () { redirectToP01('swapped'); },
                onError: function () { redirectToP01('swapped'); }
            });
        } else {
            redirectToP01('swapped');
        }
    });
    modal.show();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============================================================
// Render: Summary Table
// ============================================================
function renderSummaryTable() {
    const tbody = document.getElementById('summaryTableBody');
    if (!tbody) return;

    let sorted = [...summaryTableData];
<<<<<<< HEAD
    if (summarySortField) {
        sorted.sort((a, b) => {
            let va = a[summarySortField];
            let vb = b[summarySortField];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return summarySortDir === 'asc' ? -1 : 1;
            if (va > vb) return summarySortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }

    let html = '';
    sorted.forEach(row => {
        html += `<tr>
            <td class="col-hc">${escapeHtml(row.headerCard)}</td>
            <td class="col-time td-datetime">${escapeHtml(row.time)}</td>
            <td class="col-denom"><span class="qty-badge qty-${row.denom}">${row.denom}</span></td>
            <td class="col-type" style="text-align:center !important;">${row.type}</td>
            <td class="col-category" style="text-align:center !important;">${escapeHtml(row.category)}</td>
            <td class="col-qty" style="text-align:center !important;">${numberWithCommas(row.qty)}</td>
            <td class="col-value" style="text-align:right !important;">${numberWithCommas(row.value)}</td>
            <td class="col-remark" style="text-align:center !important;">${escapeHtml(row.remark || '')}</td>
            <td class="col-action" style="text-align:center !important;">
                <button class="btn-action" onclick="openEditModal(${row.localId})" title="แก้ไข">
=======
    // Sort by localId asc (เรียงตามลำดับที่เพิ่มเข้ามา)
    sorted.sort((a, b) => a.localId - b.localId);

    let html = '';
    sorted.forEach(row => {
        const actionHtml = `<button class="btn-action" onclick="openEditModal(${row.localId})" title="แก้ไข">
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn-action btn-danger" onclick="openDeleteModal(${row.localId})" title="ลบ">
                    <i class="bi bi-trash3-fill"></i>
<<<<<<< HEAD
                </button>
=======
                </button>`;
        html += `<tr>
            <td class="col-hc">${escapeHtml(row.headerCard)}</td>
            <td class="col-time td-datetime">${escapeHtml(row.time)}</td>
            <td class="col-denom"><span class="qty-badge qty-${row.denom}">${Number(row.denom).toLocaleString()}</span></td>
            <td class="col-type" style="text-align:center !important;">${row.type}</td>
            <td class="col-category" style="text-align:center !important;">${escapeHtml(row.category)}</td>
            <td class="col-qty" style="text-align:center !important;">${numberWithCommas(row.qty)}</td>
            <td class="col-value" style="text-align:right !important;">${numberWithCommas(row.value)}</td>
            <td class="col-remark td-remark" style="text-align:center !important;">${escapeHtml(row.remark || '')}</td>
            <td class="col-action" style="text-align:center !important;">
                ${actionHtml}
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            </td>
        </tr>`;
    });

    // Fill empty rows
    const emptyCount = Math.max(0, 6 - summaryTableData.length);
    for (let i = 0; i < emptyCount; i++) {
        html += `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    tbody.innerHTML = html;
}

// ============================================================
// Radio Groups & Denom Chips
// ============================================================
function setupRadioGroups() {
    const group = document.getElementById('banknoteTypeGroup');
    if (!group) return;

    group.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            group.querySelectorAll('.reconsile-radio-item').forEach(item => item.classList.remove('selected'));
            this.closest('.reconsile-radio-item').classList.add('selected');
<<<<<<< HEAD
=======

            // Show/hide remark field (inline in same row)
            const remarkGroup = document.getElementById('remarkGroup');
            if (remarkGroup) {
                const needsRemark = (this.value === 'counterfeit' || this.value === 'damaged');
                remarkGroup.style.display = needsRemark ? 'flex' : 'none';
                if (!needsRemark) {
                    document.getElementById('inputRemark').value = '';
                }
            }

            // Auto-switch แบบ dropdown for ปลอม (type 99)
            const selectType = document.getElementById('selectType');
            if (selectType) {
                if (this.value === 'counterfeit') {
                    selectType.value = '99';
                    selectType.disabled = true;
                } else {
                    selectType.disabled = false;
                    if (selectType.value === '99') selectType.value = '17';
                }
            }

            // Sync to Display 2
            var seriesVal = selectType ? selectType.value : '17';
            updateDisplay2Form({ banknoteType: this.value, series: seriesVal });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        });
    });
}

<<<<<<< HEAD
=======
// Select a denom chip programmatically by value (e.g. 1000, 500, 100)
function selectDenomChip(denomValue) {
    var group = document.getElementById('denomChipsGroup');
    if (!group) return;
    var radio = group.querySelector('input[type="radio"][value="' + denomValue + '"]');
    if (radio) {
        radio.checked = true;
        group.querySelectorAll('.reconsile-denom-chip').forEach(function (chip) { chip.classList.remove('selected'); });
        radio.closest('.reconsile-denom-chip').classList.add('selected');
    }
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function setupDenomChips() {
    const group = document.getElementById('denomChipsGroup');
    if (!group) return;

    group.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            group.querySelectorAll('.reconsile-denom-chip').forEach(chip => chip.classList.remove('selected'));
            this.closest('.reconsile-denom-chip').classList.add('selected');
<<<<<<< HEAD
        });
    });
=======

            // Sync to Display 2
            updateDisplay2Form({ denomValue: this.value });
        });
    });

    // Also hook selectType dropdown for series sync
    var selectType = document.getElementById('selectType');
    if (selectType) {
        selectType.addEventListener('change', function () {
            updateDisplay2Form({ series: this.value });
        });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============================================================
// Sort Icon Helper
// ============================================================
function updateSortIcons(tableSelector, field, dir) {
    document.querySelectorAll(tableSelector + ' .th-sort .sort-icon').forEach(icon => {
        icon.className = 'bi bi-chevron-expand sort-icon';
    });
    if (field) {
        const th = document.querySelector(tableSelector + ' .th-sort[data-sort="' + field + '"]');
        if (th) {
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                icon.className = dir === 'asc'
                    ? 'bi bi-chevron-up sort-icon'
                    : 'bi bi-chevron-down sort-icon';
            }
        }
    }
}

// ============================================================
// Sort Handlers — single delegated handler on document
// ============================================================
function setupSortHandlers() {
    // Set initial sort icons
    updateSortIcons('.reconsile-denom-table', denomSortField, denomSortDir);
    updateSortIcons('.reconsile-summary-table', summarySortField, summarySortDir);

    // Single event delegation — determine table from closest('table')
    document.addEventListener('click', function (e) {
        const th = e.target.closest('.th-sort');
        if (!th) return;

        const table = th.closest('table');
        if (!table) return;

        const field = th.getAttribute('data-sort');
        if (!field) return;

        e.stopPropagation();

        if (table.classList.contains('reconsile-denom-table')) {
            if (denomSortField === field) {
                denomSortDir = denomSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                denomSortField = field;
                denomSortDir = 'asc';
            }
            updateSortIcons('.reconsile-denom-table', denomSortField, denomSortDir);
            renderDenomTable();
        } else if (table.classList.contains('reconsile-summary-table')) {
            if (summarySortField === field) {
                summarySortDir = summarySortDir === 'asc' ? 'desc' : 'asc';
            } else {
                summarySortField = field;
                summarySortDir = 'asc';
            }
            updateSortIcons('.reconsile-summary-table', summarySortField, summarySortDir);
            renderSummaryTable();
        }
        // else: not our table — ignore
    });
}

// ============================================================
// Button Handlers
// ============================================================
function setupButtonHandlers() {
    // Save to Summary
    const btnSave = document.getElementById('btnSaveToSummary');
    if (btnSave) {
        btnSave.addEventListener('click', saveToSummary);
    }

    // Cancel Reconcile
<<<<<<< HEAD
    const btnCancel = document.getElementById('btnCancelReconsile');
    if (btnCancel) {
        btnCancel.addEventListener('click', function () {
            const modal = new bootstrap.Modal(document.getElementById('cancelReconsileModal'));
=======
    const btnCancel = document.getElementById('btnCancelReconciliation');
    if (btnCancel) {
        btnCancel.addEventListener('click', function () {
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('cancelReconciliationModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            modal.show();
        });
    }

    // Reconcile
<<<<<<< HEAD
    const btnReconsile = document.getElementById('btnReconsile');
=======
    const btnReconsile = document.getElementById('btnReconciliation');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    if (btnReconsile) {
        btnReconsile.addEventListener('click', performReconsile);
    }

    // Edit confirm — show confirmation dialog first
    const btnEdit = document.getElementById('btnConfirmEdit');
    if (btnEdit) {
        btnEdit.addEventListener('click', showEditConfirmation);
    }

    // Edit action — actual save after confirmation
    const btnEditAction = document.getElementById('btnConfirmEditAction');
    if (btnEditAction) {
        btnEditAction.addEventListener('click', submitEdit);
    }

    // Delete confirm
    const btnDelete = document.getElementById('btnConfirmDelete');
    if (btnDelete) {
        btnDelete.addEventListener('click', submitDelete);
    }

<<<<<<< HEAD
    // Cancel reconcile confirm
    const btnCancelConfirm = document.getElementById('btnConfirmCancelReconsile');
    if (btnCancelConfirm) {
        btnCancelConfirm.addEventListener('click', submitCancelReconsile);
    }
=======
    // Quantity input — allow only digits (block negative, decimal, letters, special chars)
    const inputQty = document.getElementById('inputQuantity');
    if (inputQty) {
        inputQty.addEventListener('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter, arrows
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                (e.keyCode >= 35 && e.keyCode <= 40) ||
                (e.ctrlKey && [65, 67, 86, 88].indexOf(e.keyCode) !== -1)) {
                return;
            }
            // Block if not a digit
            if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        inputQty.addEventListener('input', function () {
            // Strip non-digits on paste/input
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 4) this.value = this.value.slice(0, 4);
        });
    }

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============================================================
// Save to Summary Table
// ============================================================
function saveToSummary() {
<<<<<<< HEAD
=======
    console.log('[saveToSummary] CALLED');
    if (!currentReconsileTranId) {
        showErrorModal('กรุณาแสกน Header Card ก่อนบันทึกยอด');
        return;
    }
    if (savingInProgress) { console.log('[saveToSummary] blocked by debounce'); return; }
    savingInProgress = true;
    setTimeout(function () { savingInProgress = false; }, 300);

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    const banknoteType = document.querySelector('input[name="banknoteType"]:checked');
    const denomValue = document.querySelector('input[name="denomValue"]:checked');
    const selectType = document.getElementById('selectType');
    const inputQty = document.getElementById('inputQuantity');

<<<<<<< HEAD
    if (!banknoteType || !denomValue || !selectType || !inputQty) return;

    const qty = parseInt(inputQty.value) || 0;
    if (qty <= 0) {
        inputQty.focus();
        return;
    }

    const denom = parseInt(denomValue.value);
    const categoryMap = { reject: 'Reject', counterfeit: 'ปลอม', damaged: 'ชำรุด' };

    const now = new Date();
    const buddhistYear = now.getFullYear() + 543;
    const timeStr = `${now.getDate()}/${now.getMonth() + 1}/${buddhistYear} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
=======
    console.log('[saveToSummary]', {
        banknoteType: banknoteType?.value,
        denomValue: denomValue?.value,
        selectType: selectType?.value,
        inputQtyValue: inputQty?.value
    });

    if (!banknoteType || !denomValue || !selectType || !inputQty) {
        console.warn('[saveToSummary] MISSING element');
        return;
    }

    var rawVal = (inputQty.value || '').trim();
    if (rawVal === '' || isNaN(Number(rawVal))) {
        showErrorModal('กรุณากรอกจำนวนที่ถูกต้อง');
        inputQty.focus();
        return;
    }
    if (String(Number(rawVal)) !== String(parseInt(rawVal))) {
        showErrorModal('กรุณากรอกจำนวนเต็มเท่านั้น');
        inputQty.focus();
        return;
    }
    const qty = parseInt(rawVal);
    if (qty < 0) {
        showErrorModal('กรุณากรอกจำนวนที่ถูกต้อง');
        inputQty.focus();
        return;
    }
    if (qty > 1000) {
        showErrorModal('1 Header Card มีธนบัตรมากสุดได้แค่ 1,000 ใบ');
        inputQty.focus();
        return;
    }
    const denom = parseInt(denomValue.value);

    // Validate: denom ที่ติ๊กต้องตรงกับ denom ของ HC ที่แสกนมา
    var activeRow = denomTableData.find(function (r) { return r.headerCard === currentHeaderCard; });
    if (activeRow && activeRow.denom && denom !== activeRow.denom) {
        showErrorModal('ชนิดราคาธนบัตรไม่ตรงกับ Header Card ที่แสกน (HC: ' + activeRow.denom + ')');
        return;
    }

    const categoryMap = { reject: 'Reject', counterfeit: 'ปลอม', damaged: 'ชำรุด' };
    const category = categoryMap[banknoteType.value] || banknoteType.value;

    // Validate: ปลอม/ชำรุด ต้องกรอกหมายเหตุ
    if (category === 'ปลอม' || category === 'ชำรุด') {
        var remark = (document.getElementById('inputRemark')?.value || '').trim();
        if (!remark) {
            showErrorModal('กรุณากรอกหมายเหตุ');
            return;
        }
    }

    const now = new Date();
    const buddhistYear = now.getFullYear() + 543;
    const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${buddhistYear} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    console.log('[saveToSummary] currentHeaderCard =', currentHeaderCard, 'multiBundleMode =', multiBundleMode, 'parentHeaderCard =', parentHeaderCard);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    const newRow = {
        localId: nextLocalId++,
        headerCard: currentHeaderCard || '-',
        time: timeStr,
<<<<<<< HEAD
        denom: denom,
        type: parseInt(selectType.value),
        category: categoryMap[banknoteType.value] || banknoteType.value,
        qty: qty,
        value: qty * denom,
        remark: '',
    };

    summaryTableData.push(newRow);
    renderSummaryTable();

    // Reset quantity
    inputQty.value = '';
=======
        countedAt: now.toISOString(),
        denom: denom,
        type: parseInt(selectType.value),
        category: category,
        qty: qty,
        value: (category === 'ปลอม' || category === 'ชำรุด') ? 0 : qty * denom,
        remark: (document.getElementById('inputRemark')?.value || '').trim(),
    };

    if (summaryTableData.length >= 5) {
        showErrorModal('เพิ่มข้อมูลได้สูงสุด 5 รายการ');
        return;
    }

    summaryTableData.push(newRow);
    summaryDirty = true;
    renderSummaryTable();

    // UC06: อัปเดต denom table เพื่อแสดง checkmark ที่ HC ที่มีข้อมูลแล้ว
    if (multiBundleMode) {
        renderDenomTable();
    }

    // Display 2: ส่ง inprogress ทุกครั้งที่บันทึกยอด (ข้อมูลล่าสุด)
    var firstRow = denomTableData[0] || {};
    var selectedSeries = document.getElementById('selectType') ? document.getElementById('selectType').value : '';
    updateDisplay2({
        state: 'inprogress',
        bankCode: firstRow.bankCode || '',
        machineName: (firstRow.cashpoint || ''),
        branchName: firstRow.bank || '',
        denom: denom,
        headerCard: parentHeaderCard || currentHeaderCard || '',
        bundleCount: denomTableData.length || '-',
        tableRows: denomTableData,
        formState: {
            banknoteType: banknoteType.value,
            denomValue: denom,
            series: selectedSeries
        }
    });

    // Reset quantity + remark
    inputQty.value = '';
    const remarkInput = document.getElementById('inputRemark');
    if (remarkInput) remarkInput.value = '';
    const remarkGroup = document.getElementById('remarkGroup');
    if (remarkGroup) remarkGroup.style.display = 'none';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    inputQty.focus();
}

// ============================================================
// Edit / Delete / Reconcile / Cancel
// ============================================================
function openEditModal(localId) {
    const row = summaryTableData.find(r => r.localId === localId);
    if (!row) return;

<<<<<<< HEAD
    document.getElementById('editReconsileTranId').value = localId;
=======
    document.getElementById('editReconciliationTranId').value = localId;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    document.getElementById('editDisplayHeaderCard').textContent = row.headerCard;
    document.getElementById('editDisplayTime').textContent = row.time;
    document.getElementById('editDisplayDenom').textContent = row.denom;
    document.getElementById('editDisplayType').textContent = row.type;
    document.getElementById('editDisplayCategory').textContent = row.category;
    document.getElementById('editQuantity').value = row.qty;
    document.getElementById('editDisplayValue').textContent = numberWithCommas(row.value);
    hideInlineError('editFormError');

<<<<<<< HEAD
    const modal = new bootstrap.Modal(document.getElementById('editReconsileModal'));
=======
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editReconciliationModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    modal.show();
}

function showEditConfirmation() {
<<<<<<< HEAD
    const newQty = parseInt(document.getElementById('editQuantity').value);

    if (!newQty || newQty < 1) {
        showInlineError('editFormError', 'กรุณากรอกจำนวนที่ถูกต้อง');
        return;
    }

    // Hide edit form modal, show confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('editReconsileModal')).hide();
    const confirmModal = new bootstrap.Modal(document.getElementById('editConfirmReconsileModal'));
=======
    var editRaw = (document.getElementById('editQuantity').value || '').trim();
    if (editRaw === '' || isNaN(Number(editRaw))) {
        showInlineError('editFormError', 'กรุณากรอกจำนวนที่ถูกต้อง');
        return;
    }
    if (String(Number(editRaw)) !== String(parseInt(editRaw))) {
        showInlineError('editFormError', 'กรุณากรอกจำนวนเต็มเท่านั้น');
        return;
    }
    const newQty = parseInt(editRaw);

    if (newQty === null || newQty === undefined || isNaN(newQty) || newQty < 0) {
        showInlineError('editFormError', 'กรุณากรอกจำนวนที่ถูกต้อง');
        return;
    }
    if (newQty > 1000) {
        showInlineError('editFormError', '1 Header Card มีธนบัตรมากสุดได้แค่ 1,000 ใบ');
        return;
    }
    // Hide edit form modal, show confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('editReconciliationModal')).hide();
    const confirmModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editConfirmReconciliationModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    confirmModal.show();
}

function submitEdit() {
<<<<<<< HEAD
    const localId = parseInt(document.getElementById('editReconsileTranId').value);
    const newQty = parseInt(document.getElementById('editQuantity').value);

    // Hide confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('editConfirmReconsileModal')).hide();

    if (USE_MOCK_DATA) {
        const row = summaryTableData.find(r => r.localId === localId);
        if (row) {
            row.qty = newQty;
            row.value = newQty * row.denom;
        }
        renderSummaryTable();
        showSuccessModal('แก้ไขข้อมูลสำเร็จ');
    } else {
        // TODO: Call API
        $.requestAjax({
            url: 'Reconcilation/EditReconsileTran',
            type: 'POST',
            data: JSON.stringify({
                ReconsileTranId: localId,
                Quantity: newQty
            }),
            onSuccess: function (res) {
                showSuccessModal('แก้ไขข้อมูลสำเร็จ');
                // TODO: Refresh data
            },
            onError: function () {
                showErrorModal('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        });
    }
}

function openDeleteModal(localId) {
    document.getElementById('deleteReconsileTranId').value = localId;


    const modal = new bootstrap.Modal(document.getElementById('deleteReconsileModal'));
=======
    const localId = parseInt(document.getElementById('editReconciliationTranId').value);
    const newQty = parseInt(document.getElementById('editQuantity').value);

    // Hide confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('editConfirmReconciliationModal')).hide();

    // Edit is always a local operation — denominations are saved in batch via ReconsileAsync
    const row = summaryTableData.find(r => r.localId === localId);
    if (row) {
        row.qty = newQty;
        row.value = (row.category === 'ปลอม' || row.category === 'ชำรุด') ? 0 : newQty * row.denom;
        summaryDirty = true;
    }
    renderSummaryTable();

    // D2: อัพเดท denom ของแถวที่แก้ไข
    if (row) {
        updateDisplay2({ state: 'inprogress', denom: row.denom, headerCard: parentHeaderCard || currentHeaderCard || '' });
    }

    showSuccessModal('แก้ไขข้อมูลสำเร็จ');
}

function openDeleteModal(localId) {
    const delRow = summaryTableData.find(r => r.localId === localId);
    document.getElementById('deleteReconciliationTranId').value = localId;


    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteReconciliationModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    modal.show();
}

function submitDelete() {
<<<<<<< HEAD
    const localId = parseInt(document.getElementById('deleteReconsileTranId').value);


    if (USE_MOCK_DATA) {
        summaryTableData = summaryTableData.filter(r => r.localId !== localId);
        renderSummaryTable();
        bootstrap.Modal.getInstance(document.getElementById('deleteReconsileModal')).hide();
        showSuccessModal('ลบข้อมูลสำเร็จ');
    } else {
        // TODO: Call API
        $.requestAjax({
            url: 'Reconcilation/DeleteReconsileTran',
            type: 'POST',
            data: JSON.stringify({
                ReconsileTranId: localId,
                Remark: ''
            }),
            onSuccess: function (res) {
                bootstrap.Modal.getInstance(document.getElementById('deleteReconsileModal')).hide();
                showSuccessModal('ลบข้อมูลสำเร็จ');
                // TODO: Refresh data
            },
            onError: function () {
            }
        });
    }
=======
    const localId = parseInt(document.getElementById('deleteReconciliationTranId').value);


    // Delete is always a local operation — denominations are saved in batch via ReconsileAsync
    summaryTableData = summaryTableData.filter(r => r.localId !== localId);
    summaryDirty = true;
    renderSummaryTable();
    bootstrap.Modal.getInstance(document.getElementById('deleteReconciliationModal')).hide();

    // D2: ถ้าไม่มีข้อมูลเหลือ → initial, ถ้ายังมี → แสดง denom ของแถวสุดท้าย
    if (summaryTableData.length === 0) {
        updateDisplay2({ state: 'initial' });
    } else {
        var lastRow = summaryTableData[summaryTableData.length - 1];
        updateDisplay2({ state: 'inprogress', denom: lastRow.denom, headerCard: parentHeaderCard || currentHeaderCard || '' });
    }

    showSuccessModal('ลบข้อมูลสำเร็จ');
}

// ============================================================
// Reconsile Happy Case — Modal Chain (Steps 07-13)
// ============================================================
let reconsileFlowData = null;
let reconsileOtpInterval = null;

// UC04/06/07: สร้างข้อความเตือน — เพิ่ม "ปลอม" / "ชำรุด" ตามข้อมูลในตาราง
function buildWarningMessage() {
    var msg = 'มียอดขาด - เกิน';
    var hasFake = summaryTableData.some(function (r) { return r.category === 'ปลอม'; });
    var hasDamaged = summaryTableData.some(function (r) { return r.category === 'ชำรุด'; });
    if (hasFake) msg += ' ปลอม';
    if (hasDamaged) msg += ' ชำรุด';
    return msg;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function performReconsile() {
    if (summaryTableData.length === 0) {
        showErrorModal('ไม่มีข้อมูลในตารางสรุปยอด');
        return;
    }

<<<<<<< HEAD
    if (USE_MOCK_DATA) {
        showSuccessModal('กระทบยอดสำเร็จ');
    } else {
        // TODO: Call API
        const denominations = summaryTableData.map(r => ({
            BnType: r.category,
            DenomSeries: String(r.denom),
            Qty: r.qty,
            TotalValue: r.value
        }));

        $.requestAjax({
            url: 'Reconcilation/ReconsileAction',
            type: 'POST',
            data: JSON.stringify({
                ReconsileTranId: 0, // TODO: real ID
                Denominations: denominations
            }),
            onSuccess: function (res) {
                showSuccessModal('กระทบยอดสำเร็จ');
                // TODO: Refresh data
            },
            onError: function () {
                showErrorModal('เกิดข้อผิดพลาดในการกระทบยอด');
            }
        });
    }
}

function submitCancelReconsile() {
    const remark = document.getElementById('cancelRemark').value.trim();

    if (USE_MOCK_DATA) {
        bootstrap.Modal.getInstance(document.getElementById('cancelReconsileModal')).hide();
        summaryTableData = [];
        renderSummaryTable();
        showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
    } else {
        // TODO: Call API
        $.requestAjax({
            url: 'Reconcilation/CancelReconsile',
            type: 'POST',
            data: JSON.stringify({
                ReconsileTranId: 0, // TODO: real ID
                Remark: ''
            }),
            onSuccess: function (res) {
                bootstrap.Modal.getInstance(document.getElementById('cancelReconsileModal')).hide();
                showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
                // TODO: Refresh data
=======
    // UC06: ต้องมี Reject อย่างน้อย 1 row ถึงจะกระทบยอดได้
    var hasReject = summaryTableData.some(function (r) { return r.category === 'Reject'; });
    if (!hasReject) {
        showErrorModal('กรุณากรอกธนบัตร Reject');
        return;
    }

    // UC06: ถ้า HC มี > 1 มัด → เช็คว่าใส่ข้อมูลครบทุก HC หรือยัง
    if (totalBundles > 1) {
        var hcsWithData = new Set(summaryTableData.map(function (r) { return r.headerCard; }));
        if (hcsWithData.size < totalBundles) {
            showMultiBundleAlert(parentHeaderCard || currentHeaderCard);
            return;
        }
    }

    // UC02: block ถ้า HC ถูกล็อก
    if (lockedHeaderCards.has(currentHeaderCard)) {
        showHcLockedModal(currentHeaderCard);
        return;
    }

    // Mock: always enter WARNING flow to demo the modal chain
    if (USE_MOCK_DATA) {
        // Gather summary from table
        let rejectQty = 0, rejectValue = 0;
        let fakeQty = 0;
        let replaceQty = 0, replaceValue = 0;
        let damagedQty = 0;
        let damagedReplaceQty = 0, damagedReplaceValue = 0;
        summaryTableData.forEach(r => {
            if (r.category === 'Reject') {
                rejectQty += r.qty;
                rejectValue += r.value;
            } else if (r.category === 'ปลอม') {
                fakeQty += r.qty;
                replaceQty += r.qty;
                replaceValue += r.qty * r.denom;
            } else if (r.category === 'ชำรุด') {
                damagedQty += r.qty;
                damagedReplaceQty += r.qty;
                damagedReplaceValue += r.qty * r.denom;
            }
        });
        reconsileFlowData = {
            rejectQty, rejectValue,
            fakeQty, fakeValue: 0,
            replaceQty, replaceValue,
            damagedQty, damagedValue: 0,
            damagedReplaceQty, damagedReplaceValue,
            supervisorId: null, otpCode: null
        };
        // UC04: warning message — เพิ่ม "ปลอม" / "ชำรุด" ตามข้อมูลจริง
        var warningMsg = buildWarningMessage();
        setTextById('reconsileWarningMessage', warningMsg);

        // Display 2: Error badges — "ขาด-เกิน" เสมอ + ปลอม/ชำรุด ถ้ามี
        var d2Badges = [{ type: 'error', text: 'ขาด-เกิน' }];
        if (reconsileFlowData.fakeQty > 0) d2Badges.push({ type: 'error', text: 'ปลอม: ' + reconsileFlowData.fakeQty });
        if (reconsileFlowData.damagedQty > 0) d2Badges.push({ type: 'error', text: 'ชำรุด: ' + reconsileFlowData.damagedQty });
        updateDisplay2({ state: 'error', rejectCount: rejectQty, badges: d2Badges });

        // Show warning modal (Step 07)
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconsileWarningModal'));
        modal.show();
        return;
    }

    // Real API path
    var bnTypeMap = { 'Reject': 'G', 'ปลอม': 'C', 'ชำรุด': 'B' };
    const denominations = summaryTableData.map(r => ({
        BnType: bnTypeMap[r.category] || 'G',
        DenomSeries: String(r.type || ''),
        DenoPrice: r.denom || 0,
        AdjustType: 'ADD',
        HeaderCardCode: r.headerCard,
        CountedDate: r.countedAt || null,
        Qty: r.qty,
        TotalValue: r.value,
        IsReplaceT: r.category === 'ชำรุด',
        IsReplaceC: r.category === 'ปลอม'
    }));

    // Pre-calculate warning data from client-side table (same logic as mock path)
    var clientRejectQty = 0, clientRejectValue = 0;
    var clientFakeQty = 0;
    var clientReplaceQty = 0, clientReplaceValue = 0;
    var clientDamagedQty = 0;
    var clientDamagedReplaceQty = 0, clientDamagedReplaceValue = 0;
    summaryTableData.forEach(function (r) {
        if (r.category === 'Reject') {
            clientRejectQty += r.qty;
            clientRejectValue += r.value;
        } else if (r.category === 'ปลอม') {
            clientFakeQty += r.qty;
            clientReplaceQty += r.qty;
            clientReplaceValue += r.qty * r.denom;
        } else if (r.category === 'ชำรุด') {
            clientDamagedQty += r.qty;
            clientDamagedReplaceQty += r.qty;
            clientDamagedReplaceValue += r.qty * r.denom;
        }
    });

    $.requestAjax({
        service: 'Reconcilation/ReconciliationAction',
        type: 'POST',
        parameter: {
            ReconciliationTranId: currentReconsileTranId,
            Denominations: denominations
        },
        onSuccess: function (res) {
            if (res && res.msg_code === 'WARNING') {
                reconsileFlowData = {
                    rejectQty: clientRejectQty, rejectValue: clientRejectValue,
                    fakeQty: clientFakeQty, fakeValue: 0,
                    replaceQty: clientReplaceQty, replaceValue: clientReplaceValue,
                    damagedQty: clientDamagedQty, damagedValue: 0,
                    damagedReplaceQty: clientDamagedReplaceQty, damagedReplaceValue: clientDamagedReplaceValue,
                    supervisorId: null, otpCode: null
                };
                // Display 2: Error badges — "ขาด-เกิน" เสมอ + ปลอม/ชำรุด ถ้ามี
                var d2WarnBadges = [{ type: 'error', text: 'ขาด-เกิน' }];
                if (clientFakeQty > 0) d2WarnBadges.push({ type: 'error', text: 'ปลอม: ' + clientFakeQty });
                if (clientDamagedQty > 0) d2WarnBadges.push({ type: 'error', text: 'ชำรุด: ' + clientDamagedQty });
                updateDisplay2({ state: 'error', rejectCount: clientRejectQty, badges: d2WarnBadges });
                // UC04: warning message — เพิ่ม "ปลอม" / "ชำรุด" ตามข้อมูลจริง
                setTextById('reconsileWarningMessage', buildWarningMessage());
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconsileWarningModal'));
                modal.show();
            } else if (res && res.is_success) {
                // Display 2: Success
                var d2TotalReject = 0;
                summaryTableData.forEach(function (r) { if (r.category === 'Reject') d2TotalReject += r.qty; });
                updateDisplay2({ state: 'success', rejectCount: d2TotalReject, badges: [{ type: 'success', text: 'ครบจำนวน ครบมูลค่า' }] });

                // UC01: multi-bundle + Reject only → "ครบจำนวน ครบมูลค่า" confirmation
                if (multiBundleMode) {
                    var hasFakeOrDamaged = summaryTableData.some(function (r) {
                        return r.category === 'ปลอม' || r.category === 'ชำรุด';
                    });
                    if (!hasFakeOrDamaged) {
                        var confirmModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('uc01ConfirmModal'));
                        confirmModal.show();
                        return;
                    }
                }
                showSuccessModal('กระทบยอดสำเร็จ', true);
                var successEl = document.getElementById('reconsileSuccessModal');
                if (successEl) {
                    successEl.addEventListener('hidden.bs.modal', function onDone() {
                        successEl.removeEventListener('hidden.bs.modal', onDone);
                        if (successCancelClicked) { successCancelClicked = false; return; }
                        redirectToP01('reconciled');
                    });
                }
            } else {
                showErrorModal(res?.msg_desc || 'กระทบยอดไม่สำเร็จ');
            }
        },
        onError: function () {
            showErrorModal('เกิดข้อผิดพลาดในการกระทบยอด');
        }
    });
}

// ── Modal Chain Helpers ──
function chainModal(closeModalId, openCallback) {
    const el = document.getElementById(closeModalId);
    if (!el) { openCallback(); return; }
    const instance = bootstrap.Modal.getInstance(el);
    if (!instance) { openCallback(); return; }
    el.addEventListener('hidden.bs.modal', function onHidden() {
        el.removeEventListener('hidden.bs.modal', onHidden);
        openCallback();
    });
    instance.hide();
}

function setModalStep(modalId, stepId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
}

function showInlineErrorById(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.dataset.defaultText) el.dataset.defaultText = el.textContent;
    el.textContent = message || el.dataset.defaultText;
    el.classList.add('show');
}

function hideInlineErrorById(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('show');
    // restore default text from HTML (set by data attribute if overridden)
    if (el.dataset.defaultText) el.textContent = el.dataset.defaultText;
}

// ── Warning OK → Reconfirm (Step 07 → 09) ──
function onWarningOk() {
    if (multiBundleMode) {
        chainModal('reconsileWarningModal', openUc06ReconfirmModal);
    } else {
        chainModal('reconsileWarningModal', openReconfirmModal);
    }
}

function openReconfirmModal() {
    if (!reconsileFlowData) return;
    const d = reconsileFlowData;

    // Populate Step A — Reject
    setTextById('reconfirmRejectQty', d.rejectQty);
    setTextById('reconfirmRejectValue', Number(d.rejectValue).toLocaleString());

    // Step A — ปลอม
    setTextById('reconfirmFakeQty', d.fakeQty);
    setTextById('reconfirmFakeValue', Number(d.fakeValue).toLocaleString());
    var fakeSections1 = document.getElementById('reconfirmFakeSections');
    if (fakeSections1) fakeSections1.style.display = d.fakeQty > 0 ? '' : 'none';

    // Step A — ชำรุด
    setTextById('reconfirmDamagedQty', d.damagedQty || 0);
    setTextById('reconfirmDamagedValue', Number(d.damagedValue || 0).toLocaleString());
    var damagedSections1 = document.getElementById('reconfirmDamagedSections');
    if (damagedSections1) damagedSections1.style.display = (d.damagedQty || 0) > 0 ? '' : 'none';

    // Step A — ธนบัตรทดแทน (รวม)
    var combinedReplaceQty = (d.replaceQty || 0) + (d.damagedReplaceQty || 0);
    var combinedReplaceValue = (d.replaceValue || 0) + (d.damagedReplaceValue || 0);
    setTextById('reconfirmReplaceQty', combinedReplaceQty);
    setTextById('reconfirmReplaceValue', Number(combinedReplaceValue).toLocaleString());
    setTextById('reconfirmReplaceMessageQty', combinedReplaceQty);
    var replaceSections1 = document.getElementById('reconfirmReplaceSections');
    if (replaceSections1) replaceSections1.style.display = combinedReplaceQty > 0 ? '' : 'none';

    // Populate Step B — Reject
    setTextById('reconfirmRejectQty2', d.rejectQty);
    setTextById('reconfirmRejectValue2', Number(d.rejectValue).toLocaleString());

    // Step B — ปลอม
    setTextById('reconfirmFakeQty2', d.fakeQty);
    setTextById('reconfirmFakeValue2', Number(d.fakeValue).toLocaleString());
    var fakeSections2 = document.getElementById('reconfirmFakeSections2');
    if (fakeSections2) fakeSections2.style.display = d.fakeQty > 0 ? '' : 'none';

    // Step B — ชำรุด
    setTextById('reconfirmDamagedQty2', d.damagedQty || 0);
    setTextById('reconfirmDamagedValue2', Number(d.damagedValue || 0).toLocaleString());
    var damagedSections2 = document.getElementById('reconfirmDamagedSections2');
    if (damagedSections2) damagedSections2.style.display = (d.damagedQty || 0) > 0 ? '' : 'none';

    // Step B — ธนบัตรทดแทน (รวม)
    setTextById('reconfirmReplaceQty2', combinedReplaceQty);
    setTextById('reconfirmReplaceValue2', Number(combinedReplaceValue).toLocaleString());
    setTextById('reconfirmReplaceMessageQty2', combinedReplaceQty);
    var replaceSections2 = document.getElementById('reconfirmReplaceSections2');
    if (replaceSections2) replaceSections2.style.display = combinedReplaceQty > 0 ? '' : 'none';

    // Dynamic Reject label — both Step A & Step B
    var hasReplacement = d.fakeQty > 0 || (d.damagedQty || 0) > 0;
    var rejectLabel = hasReplacement ? 'จำนวนขาด-เกิน (ฉบับ)' : 'จำนวน (ฉบับ)';
    setTextById('reconfirmRejectLabel', rejectLabel);
    setTextById('reconfirmRejectLabel2', rejectLabel);

    // Reset
    const sel = document.getElementById('reconsileSupervisorSelect');
    if (sel) sel.value = '';
    hideInlineErrorById('supervisorError');
    setModalStep('reconsileReconfirmModal', 'reconfirmStepA');

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconsileReconfirmModal'));
    modal.show();
}

function setTextById(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ── Step A → Step B ──
function submitReconfirmReconsile() {
    const supervisorId = document.getElementById('reconsileSupervisorSelect').value;
    if (!supervisorId) {
        showInlineErrorById('supervisorError');
        return;
    }
    hideInlineErrorById('supervisorError');
    reconsileFlowData.supervisorId = supervisorId;

    // Send OTP via real API
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM
    }).done(function (data) {
        reconsileFlowData.refCode = data.refCode;
        setTextById('otpRefCodeLabel', '(Ref Code : ' + data.refCode + ')');
        setModalStep('reconsileReconfirmModal', 'reconfirmStepB');
        var otpInput = document.getElementById('reconsileOtpInput');
        if (otpInput) otpInput.value = '';
        hideInlineErrorById('otpError');
        startReconsileOtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

// ── OTP Countdown ──
function startReconsileOtpCountdown(totalSeconds) {
    clearInterval(reconsileOtpInterval);
    let seconds = (totalSeconds || 300) - 1;
    const btn = document.getElementById('btnResendOtp');
    const countdownEl = document.getElementById('otpCountdown');
    const timerText = document.getElementById('otpTimerText');

    if (btn) { btn.disabled = true; btn.style.opacity = '0.3'; }
    if (timerText) timerText.style.display = '';

    reconsileOtpInterval = setInterval(function () {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        if (countdownEl) countdownEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        seconds--;
        if (seconds < 0) {
            clearInterval(reconsileOtpInterval);
            if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
            if (timerText) timerText.style.display = 'none';
            showInlineErrorById('otpError', 'OTP หมดอายุ กรุณากดส่งรหัส OTP อีกครั้ง');
        }
    }, 1000);
}

function resendReconsileOtp() {
    if (!reconsileFlowData || !reconsileFlowData.supervisorId) return;
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(reconsileFlowData.supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM
    }).done(function (data) {
        reconsileFlowData.refCode = data.refCode;
        setTextById('otpRefCodeLabel', '(Ref Code : ' + data.refCode + ')');
        startReconsileOtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

// ── Confirm OTP → Success ──
function confirmReconsileOtp() {
    const otpInput = (document.getElementById('reconsileOtpInput').value || '').trim();
    if (!otpInput || otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) {
        showInlineErrorById('otpError');
        return;
    }
    hideInlineErrorById('otpError');
    reconsileFlowData.otpCode = otpInput;

    // Verify OTP via real API
    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM,
        bssMailRefCode: reconsileFlowData.refCode,
        bssMailOtpCode: otpInput
    }).done(function () {
        otp.clearRefCode(APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM);
        // UC02: mark flow as completed (not a cancel)
        reconsileFlowCompleted = true;

        // Mock: close reconfirm → show actual badges → redirect p01
        if (USE_MOCK_DATA) {
            var d2bMock = buildDisplay2Badges();
            var d2StateMock = d2bMock[0].type === 'success' ? 'success' : 'error';
            chainModal('reconsileReconfirmModal', function () {
                updateDisplay2({ state: d2StateMock, badges: d2bMock });
                showSuccessModal('กระทบยอดสำเร็จ', true);
                var successEl = document.getElementById('reconsileSuccessModal');
                if (successEl) {
                    successEl.addEventListener('hidden.bs.modal', function onDone() {
                        successEl.removeEventListener('hidden.bs.modal', onDone);
                        if (successCancelClicked) { successCancelClicked = false; return; }
                        redirectToP01('reconciled');
                    });
                }
            });
            return;
        }

        // Real API — submit reconciliation with supervisor + OTP
        $.requestAjax({
            service: 'Reconcilation/ReconciliationAction',
            type: 'POST',
            parameter: {
                ReconciliationTranId: currentReconsileTranId,
                SupervisorId: reconsileFlowData.supervisorId,
                OtpCode: otpInput
            },
            onSuccess: function (res) {
                if (res && res.is_success) {
                    // สร้าง badges ก่อน chainModal เพราะ hidden.bs.modal จะ clearReconsileFlow() → reconsileFlowData = null
                    var d2b = buildDisplay2Badges();
                    var d2State = d2b[0].type === 'success' ? 'success' : 'error';
                    chainModal('reconsileReconfirmModal', function () {
                        updateDisplay2({ state: d2State, badges: d2b });
                        showSuccessModal('กระทบยอดสำเร็จ', true);
                        var successEl = document.getElementById('reconsileSuccessModal');
                        if (successEl) {
                            successEl.addEventListener('hidden.bs.modal', function onDone() {
                                successEl.removeEventListener('hidden.bs.modal', onDone);
                                if (successCancelClicked) { successCancelClicked = false; return; }
                                redirectToP01('reconciled');
                            });
                        }
                    });
                } else {
                    showInlineErrorById('otpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ');
                }
            },
            onError: function () { showInlineErrorById('otpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ'); }
        });
    }).fail(function () {
        showInlineErrorById('otpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ');
    });
}

function clearReconsileFlow() {
    clearInterval(reconsileOtpInterval);
    reconsileOtpInterval = null;

    // UC02: ถ้าไม่ได้ complete (= cancel) → call backend CancelReconciliation
    // เพื่อ increment CountReconcile + clear staging + lock ถ้าครบ 3 ครั้ง
    if (reconsileFlowData && !reconsileFlowCompleted) {
        if (!USE_MOCK_DATA && currentReconsileTranId) {
            $.requestAjax({
                service: 'Reconcilation/CancelReconciliation',
                type: 'POST',
                parameter: {
                    ReconciliationTranId: currentReconsileTranId,
                    Remark: ''
                },
                onSuccess: function (res) {
                    if (res && res.data && res.data.message && res.data.message.indexOf('ล็อก') !== -1) {
                        var hc = parentHeaderCard || currentHeaderCard;
                        lockedHeaderCards.add(hc);
                        showHcLockedModal(hc);
                    }
                },
                onError: function () { /* silent */ }
            });
        } else {
            // Mock mode: client-side tracking
            var hc = parentHeaderCard || currentHeaderCard;
            if (hc) {
                reconsileAttemptCount[hc] = (reconsileAttemptCount[hc] || 0) + 1;
                if (reconsileAttemptCount[hc] >= 3 && !lockedHeaderCards.has(hc)) {
                    lockedHeaderCards.add(hc);
                    setTimeout(function () { showHcLockedModal(hc); }, 300);
                }
            }
        }
    }

    reconsileFlowData = null;
    reconsileFlowCompleted = false;
    setModalStep('reconsileReconfirmModal', 'reconfirmStepA');
}

// ============================================================
// UC01: Multi-Bundle Reject-Only Confirm (ครบจำนวน ครบมูลค่า)
// ============================================================
function onUc01ConfirmOk() {
    updateDisplay2({ state: 'success', badges: [{ type: 'success', text: 'ครบจำนวน ครบมูลค่า' }] });
    var el = document.getElementById('uc01ConfirmModal');
    bootstrap.Modal.getInstance(el).hide();
    el.addEventListener('hidden.bs.modal', function onDone() {
        el.removeEventListener('hidden.bs.modal', onDone);
        redirectToP01('reconciled');
    });
}

// Flag: ยกเลิกจาก success modal → ไม่ redirect กลับ p01
var successCancelClicked = false;

// UC01: ยกเลิกจาก success modal — เรียก CancelReconciliation แล้วอยู่หน้าเดิม
function onSuccessCancelClick() {
    successCancelClicked = true;
    if (USE_MOCK_DATA) return;
    $.requestAjax({
        service: 'Reconcilation/CancelReconciliation',
        type: 'POST',
        parameter: {
            ReconciliationTranId: currentReconsileTranId,
            Remark: ''
        },
        onSuccess: function (res) {
            if (res && res.data && res.data.message && res.data.message.indexOf('ล็อก') !== -1) {
                var hc = currentHeaderCard;
                lockedHeaderCards.add(hc);
                showHcLockedModal(hc);
                return;
            }
        },
        onError: function () {
            showErrorModal('เกิดข้อผิดพลาด');
        }
    });
}

function onUc01ConfirmCancel() {
    var el = document.getElementById('uc01ConfirmModal');
    bootstrap.Modal.getInstance(el).hide();

    if (USE_MOCK_DATA) return;

    // Call CancelReconciliation เพื่อ revert สถานะ backend
    // ข้อมูลในตาราง summary ยังคงอยู่ → user แก้ qty แล้วกดกระทบยอดใหม่ได้
    $.requestAjax({
        service: 'Reconcilation/CancelReconciliation',
        type: 'POST',
        parameter: {
            ReconciliationTranId: currentReconsileTranId,
            Remark: ''
        },
        onSuccess: function (res) {
            // UC02: เช็คว่า HC ถูกล็อกหรือยัง
            if (res && res.data && res.data.message && res.data.message.indexOf('ล็อก') !== -1) {
                var hc = parentHeaderCard || currentHeaderCard;
                lockedHeaderCards.add(hc);
                showHcLockedModal(hc);
                return;
            }
            // ไม่ lock → ไม่ต้องทำอะไร ข้อมูลยังอยู่ให้แก้ได้
        },
        onError: function () {
            showErrorModal('เกิดข้อผิดพลาด');
        }
    });
}

// ============================================================
// UC06: Multi-Bundle Reconfirm Flow (Steps 18-22)
// ============================================================
let uc06OtpInterval = null;

function openUc06ReconfirmModal() {
    // Calculate totals from summaryTableData
    var rejectQty = 0, rejectValue = 0;
    var fakeQty = 0, fakeValue = 0;
    var replaceQty = 0, replaceValue = 0;
    var damagedQty = 0, damagedValue = 0;
    var damagedReplaceQty = 0, damagedReplaceValue = 0;

    summaryTableData.forEach(function (r) {
        if (r.category === 'Reject') { rejectQty += r.qty; rejectValue += r.value; }
        else if (r.category === 'ปลอม') {
            fakeQty += r.qty; fakeValue += 0;
            replaceQty += r.qty; replaceValue += r.qty * r.denom;
        }
        else if (r.category === 'ชำรุด') {
            damagedQty += r.qty; damagedValue += 0;
            damagedReplaceQty += r.qty; damagedReplaceValue += r.qty * r.denom;
        }
    });

    // Combined replacement totals
    var uc06CombinedReplaceQty = replaceQty + damagedReplaceQty;
    var uc06CombinedReplaceValue = replaceValue + damagedReplaceValue;

    // Populate Step A — Reject
    setTextById('uc06RejectQty', rejectQty);
    setTextById('uc06RejectValue', Number(rejectValue).toLocaleString());

    // UC06 Reconfirm: แสดงเฉพาะ Reject — ซ่อน ปลอม/ชำรุด/ทดแทน
    var uc06Fake1 = document.getElementById('uc06FakeSections');
    if (uc06Fake1) uc06Fake1.style.display = 'none';
    var uc06Damaged1 = document.getElementById('uc06DamagedSections');
    if (uc06Damaged1) uc06Damaged1.style.display = 'none';
    var uc06Replace1 = document.getElementById('uc06ReplaceSections');
    if (uc06Replace1) uc06Replace1.style.display = 'none';

    // Populate Step B — Reject only
    setTextById('uc06RejectQty2', rejectQty);
    setTextById('uc06RejectValue2', Number(rejectValue).toLocaleString());

    var uc06Fake2 = document.getElementById('uc06FakeSections2');
    if (uc06Fake2) uc06Fake2.style.display = 'none';
    var uc06Damaged2 = document.getElementById('uc06DamagedSections2');
    if (uc06Damaged2) uc06Damaged2.style.display = 'none';
    var uc06Replace2 = document.getElementById('uc06ReplaceSections2');
    if (uc06Replace2) uc06Replace2.style.display = 'none';

    // Reject label — always "จำนวน (ฉบับ)" for UC06
    setTextById('uc06RejectLabel', 'จำนวน (ฉบับ)');
    setTextById('uc06RejectLabel2', 'จำนวน (ฉบับ)');

    // Reset supervisor + OTP
    var sel = document.getElementById('uc06SupervisorSelect');
    if (sel) sel.value = '';
    hideInlineErrorById('uc06SupervisorError');
    setModalStep('uc06ReconfirmModal', 'uc06StepA');

    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('uc06ReconfirmModal'));
    modal.show();
}

function submitUc06Reconfirm() {
    var supervisorId = document.getElementById('uc06SupervisorSelect').value;
    if (!supervisorId) {
        showInlineErrorById('uc06SupervisorError');
        return;
    }
    hideInlineErrorById('uc06SupervisorError');
    reconsileFlowData.supervisorId = supervisorId;

    // Send OTP via real API
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM
    }).done(function (data) {
        reconsileFlowData.refCode = data.refCode;
        setTextById('uc06OtpRefCodeLabel', '(Ref Code : ' + data.refCode + ')');
        setModalStep('uc06ReconfirmModal', 'uc06StepB');
        var otpInput = document.getElementById('uc06OtpInput');
        if (otpInput) otpInput.value = '';
        hideInlineErrorById('uc06OtpError');
        startUc06OtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

function startUc06OtpCountdown(totalSeconds) {
    clearInterval(uc06OtpInterval);
    var seconds = (totalSeconds || 300) - 1;
    var btn = document.getElementById('btnUc06ResendOtp');
    var countdownEl = document.getElementById('uc06OtpCountdown');
    var timerText = document.getElementById('uc06OtpTimerText');

    if (btn) { btn.disabled = true; btn.style.opacity = '0.3'; }
    if (timerText) timerText.style.display = '';

    uc06OtpInterval = setInterval(function () {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        if (countdownEl) countdownEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        seconds--;
        if (seconds < 0) {
            clearInterval(uc06OtpInterval);
            if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
            if (timerText) timerText.style.display = 'none';
            showInlineErrorById('uc06OtpError', 'OTP หมดอายุ กรุณากดส่งรหัส OTP อีกครั้ง');
        }
    }, 1000);
}

function resendUc06Otp() {
    if (!reconsileFlowData || !reconsileFlowData.supervisorId) return;
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(reconsileFlowData.supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM
    }).done(function (data) {
        reconsileFlowData.refCode = data.refCode;
        startUc06OtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

function confirmUc06Otp() {
    var otpInput = (document.getElementById('uc06OtpInput').value || '').trim();
    if (!otpInput || otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) {
        showInlineErrorById('uc06OtpError');
        return;
    }
    hideInlineErrorById('uc06OtpError');
    reconsileFlowData.otpCode = otpInput;

    // Verify OTP via real API
    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM,
        bssMailRefCode: reconsileFlowData.refCode,
        bssMailOtpCode: otpInput
    }).done(function () {
        otp.clearRefCode(APP.CONST.MAIL_TYPE.RECONCILIATION_RECONFIRM);
        reconsileFlowCompleted = true;

        if (USE_MOCK_DATA) {
            var d2bUc06Mock = buildDisplay2Badges();
            var d2StateUc06Mock = d2bUc06Mock[0].type === 'success' ? 'success' : 'error';
            chainModal('uc06ReconfirmModal', function () {
                updateDisplay2({ state: d2StateUc06Mock, badges: d2bUc06Mock });
                showSuccessModal('กระทบยอดสำเร็จ', true);
                var successEl = document.getElementById('reconsileSuccessModal');
                if (successEl) {
                    successEl.addEventListener('hidden.bs.modal', function onDone() {
                        successEl.removeEventListener('hidden.bs.modal', onDone);
                        if (successCancelClicked) { successCancelClicked = false; return; }
                        redirectToP01('reconciled');
                    });
                }
            });
            return;
        }

        // Real API — submit reconciliation with supervisor + OTP
        var d2bUc06 = buildDisplay2Badges();
        var d2StateUc06 = d2bUc06[0].type === 'success' ? 'success' : 'error';
        $.requestAjax({
            service: 'Reconcilation/ReconciliationAction',
            type: 'POST',
            parameter: {
                ReconciliationTranId: currentReconsileTranId,
                SupervisorId: reconsileFlowData.supervisorId,
                OtpCode: otpInput
            },
            onSuccess: function (res) {
                if (res && res.is_success) {
                    chainModal('uc06ReconfirmModal', function () {
                        updateDisplay2({ state: d2StateUc06, badges: d2bUc06 });
                        showSuccessModal('กระทบยอดสำเร็จ', true);
                        var successEl = document.getElementById('reconsileSuccessModal');
                        if (successEl) {
                            successEl.addEventListener('hidden.bs.modal', function onDone() {
                                successEl.removeEventListener('hidden.bs.modal', onDone);
                                if (successCancelClicked) { successCancelClicked = false; return; }
                                redirectToP01('reconciled');
                            });
                        }
                    });
                } else {
                    showInlineErrorById('uc06OtpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ');
                }
            },
            onError: function () { showInlineErrorById('uc06OtpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ'); }
        });
    }).fail(function () {
        showInlineErrorById('uc06OtpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ');
    });
}

function clearUc06Flow() {
    clearInterval(uc06OtpInterval);
    uc06OtpInterval = null;

    // UC02: ถ้าไม่ได้ complete (= cancel) → call backend CancelReconciliation
    // เพื่อ increment CountReconcile + clear staging + lock ถ้าครบ 3 ครั้ง
    if (reconsileFlowData && !reconsileFlowCompleted) {
        if (!USE_MOCK_DATA && currentReconsileTranId) {
            $.requestAjax({
                service: 'Reconcilation/CancelReconciliation',
                type: 'POST',
                parameter: {
                    ReconciliationTranId: currentReconsileTranId,
                    Remark: ''
                },
                onSuccess: function (res) {
                    if (res && res.data && res.data.message && res.data.message.indexOf('ล็อก') !== -1) {
                        var hc = parentHeaderCard || currentHeaderCard;
                        lockedHeaderCards.add(hc);
                        showHcLockedModal(hc);
                    }
                },
                onError: function () { /* silent */ }
            });
        } else {
            // Mock mode: client-side tracking
            var hc = parentHeaderCard || currentHeaderCard;
            if (hc) {
                reconsileAttemptCount[hc] = (reconsileAttemptCount[hc] || 0) + 1;
                if (reconsileAttemptCount[hc] >= 3 && !lockedHeaderCards.has(hc)) {
                    lockedHeaderCards.add(hc);
                    setTimeout(function () { showHcLockedModal(hc); }, 300);
                }
            }
        }
    }

    reconsileFlowData = null;
    reconsileFlowCompleted = false;
    setModalStep('uc06ReconfirmModal', 'uc06StepA');
}

// ============================================================
// UC03: Unlock HC Flow (Supervisor + OTP)
// ============================================================
function submitUnlock() {
    var supervisorId = document.getElementById('unlockSupervisorSelect').value;
    if (!supervisorId) {
        showInlineErrorById('unlockSupervisorError');
        return;
    }
    hideInlineErrorById('unlockSupervisorError');
    unlockFlowData.supervisorId = supervisorId;

    setModalStep('unlockHcModal', 'unlockStepB');
    var otpInput = document.getElementById('unlockOtpInput');
    if (otpInput) otpInput.value = '';
    hideInlineErrorById('unlockOtpError');
    startUnlockOtpCountdown();
}

function startUnlockOtpCountdown() {
    clearInterval(unlockOtpInterval);
    var seconds = 299; // 4:59
    var btn = document.getElementById('btnUnlockResendOtp');
    var countdownEl = document.getElementById('unlockOtpCountdown');
    var timerText = document.getElementById('unlockOtpTimerText');

    if (btn) { btn.disabled = true; btn.style.opacity = '0.3'; }
    if (timerText) timerText.style.display = '';

    unlockOtpInterval = setInterval(function () {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        if (countdownEl) countdownEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        seconds--;
        if (seconds < 0) {
            clearInterval(unlockOtpInterval);
            if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
            if (timerText) timerText.style.display = 'none';
            showInlineErrorById('unlockOtpError', 'OTP หมดอายุ กรุณากดส่งรหัส OTP อีกครั้ง');
        }
    }, 1000);
}

function resendUnlockOtp() {
    startUnlockOtpCountdown();
}

function confirmUnlockOtp() {
    var otp = (document.getElementById('unlockOtpInput').value || '').trim();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        showInlineErrorById('unlockOtpError');
        return;
    }
    hideInlineErrorById('unlockOtpError');
    unlockFlowData.otpCode = otp;

    // Unlock is client-side for now (OTP verification TODO — backend endpoint pending)
    var hc = unlockFlowData.hc;
    lockedHeaderCards.delete(hc);
    delete reconsileAttemptCount[hc];
    chainModal('unlockHcModal', function () {
        showSuccessModal('Header Card ' + hc + ' ปลดล็อกเรียบร้อยแล้ว');
    });
    renderDenomTable();
}

function clearUnlockFlow() {
    clearInterval(unlockOtpInterval);
    unlockOtpInterval = null;
    unlockFlowData = null;
    setModalStep('unlockHcModal', 'unlockStepA');
}

// ── Bind Reconcile Flow Events ──
document.addEventListener('DOMContentLoaded', function () {
    const btnWarningOk = document.getElementById('btnWarningOk');
    if (btnWarningOk) btnWarningOk.addEventListener('click', onWarningOk);

    // UC01: multi-bundle Reject-only confirm
    const btnUc01ConfirmOk = document.getElementById('btnUc01ConfirmOk');
    if (btnUc01ConfirmOk) btnUc01ConfirmOk.addEventListener('click', onUc01ConfirmOk);

    const btnUc01ConfirmCancel = document.getElementById('btnUc01ConfirmCancel');
    if (btnUc01ConfirmCancel) btnUc01ConfirmCancel.addEventListener('click', onUc01ConfirmCancel);

    const btnSubmitReconfirm = document.getElementById('btnSubmitReconfirm');
    if (btnSubmitReconfirm) btnSubmitReconfirm.addEventListener('click', submitReconfirmReconsile);

    const btnConfirmOtp = document.getElementById('btnConfirmOtp');
    if (btnConfirmOtp) btnConfirmOtp.addEventListener('click', confirmReconsileOtp);

    const btnResendOtp = document.getElementById('btnResendOtp');
    if (btnResendOtp) btnResendOtp.addEventListener('click', resendReconsileOtp);

    const btnClearOtp = document.getElementById('btnClearOtp');
    if (btnClearOtp) btnClearOtp.addEventListener('click', function () {
        var inp = document.getElementById('reconsileOtpInput');
        if (inp) { inp.value = ''; inp.focus(); }
        btnClearOtp.classList.remove('show');
    });
    var otpInp = document.getElementById('reconsileOtpInput');
    if (otpInp) otpInp.addEventListener('input', function () {
        var clearBtn = document.getElementById('btnClearOtp');
        if (clearBtn) clearBtn.classList.toggle('show', otpInp.value.length > 0);
    });

    const reconfirmModal = document.getElementById('reconsileReconfirmModal');
    if (reconfirmModal) reconfirmModal.addEventListener('hidden.bs.modal', clearReconsileFlow);

    // UC06: Multi-bundle reconfirm bindings
    const btnUc06Submit = document.getElementById('btnUc06SubmitReconfirm');
    if (btnUc06Submit) btnUc06Submit.addEventListener('click', submitUc06Reconfirm);

    const btnUc06ConfirmOtp = document.getElementById('btnUc06ConfirmOtp');
    if (btnUc06ConfirmOtp) btnUc06ConfirmOtp.addEventListener('click', confirmUc06Otp);

    const btnUc06ResendOtp = document.getElementById('btnUc06ResendOtp');
    if (btnUc06ResendOtp) btnUc06ResendOtp.addEventListener('click', resendUc06Otp);

    const btnUc06ClearOtp = document.getElementById('btnUc06ClearOtp');
    if (btnUc06ClearOtp) btnUc06ClearOtp.addEventListener('click', function () {
        var inp = document.getElementById('uc06OtpInput');
        if (inp) { inp.value = ''; inp.focus(); }
        btnUc06ClearOtp.classList.remove('show');
    });
    var uc06OtpInp = document.getElementById('uc06OtpInput');
    if (uc06OtpInp) uc06OtpInp.addEventListener('input', function () {
        var clearBtn = document.getElementById('btnUc06ClearOtp');
        if (clearBtn) clearBtn.classList.toggle('show', uc06OtpInp.value.length > 0);
    });

    const uc06Modal = document.getElementById('uc06ReconfirmModal');
    if (uc06Modal) uc06Modal.addEventListener('hidden.bs.modal', clearUc06Flow);

    // UC03: Unlock flow bindings
    const btnSubmitUnlock = document.getElementById('btnSubmitUnlock');
    if (btnSubmitUnlock) btnSubmitUnlock.addEventListener('click', submitUnlock);

    const btnConfirmUnlockOtp = document.getElementById('btnConfirmUnlockOtp');
    if (btnConfirmUnlockOtp) btnConfirmUnlockOtp.addEventListener('click', confirmUnlockOtp);

    const btnUnlockResendOtp = document.getElementById('btnUnlockResendOtp');
    if (btnUnlockResendOtp) btnUnlockResendOtp.addEventListener('click', resendUnlockOtp);

    const unlockModal = document.getElementById('unlockHcModal');
    if (unlockModal) unlockModal.addEventListener('hidden.bs.modal', clearUnlockFlow);

    // UC02: Cancel flow bindings
    var btnSubmitCancelReconfirm = document.getElementById('btnSubmitCancelReconfirm');
    if (btnSubmitCancelReconfirm) btnSubmitCancelReconfirm.addEventListener('click', submitCancelReconfirm);

    var btnConfirmCancelOtp = document.getElementById('btnConfirmCancelOtp');
    if (btnConfirmCancelOtp) btnConfirmCancelOtp.addEventListener('click', confirmCancelOtp);

    var btnCancelResendOtp = document.getElementById('btnCancelResendOtp');
    if (btnCancelResendOtp) btnCancelResendOtp.addEventListener('click', resendCancelOtp);

    var cancelModal = document.getElementById('cancelReconciliationModal');
    if (cancelModal) cancelModal.addEventListener('hidden.bs.modal', clearCancelFlow);

    // Cancel Reconciliation — simple confirm (gray button)
    var btnConfirmCancel = document.getElementById('btnConfirmCancelReconciliation');
    if (btnConfirmCancel) btnConfirmCancel.addEventListener('click', confirmCancelReconciliation);
})

// ============================================================
// Cancel Reconciliation — gray button (simple confirm → API → redirect)
// ============================================================
function confirmCancelReconciliation() {
    var cancelModal = bootstrap.Modal.getInstance(document.getElementById('cancelReconciliationModal'));
    if (cancelModal) cancelModal.hide();

    if (USE_MOCK_DATA) {
        summaryTableData = [];
        renderSummaryTable();
        updateDisplay2({ state: 'initial' });
        showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
        return;
    }

    if (!currentReconsileTranId) {
        showErrorModal('ไม่พบรายการกระทบยอด');
        return;
    }

    $.requestAjax({
        service: 'Reconcilation/CancelReconciliation',
        type: 'POST',
        parameter: {
            ReconciliationTranId: currentReconsileTranId,
            Remark: 'ยกเลิกกระทบยอด'
        },
        onSuccess: function () {
            summaryTableData = [];
            renderSummaryTable();
            updateDisplay2({ state: 'initial' });
            showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
            var successEl = document.getElementById('reconsileSuccessModal');
            if (successEl) {
                successEl.addEventListener('hidden.bs.modal', function onDone() {
                    successEl.removeEventListener('hidden.bs.modal', onDone);
                    redirectToP01('cancelled');
                });
            }
        },
        onError: function () {
            showErrorModal('ยกเลิกกระทบยอดไม่สำเร็จ');
        }
    });
}

// ============================================================
// UC02: Cancel Reconciliation Flow (Supervisor + OTP)
// ============================================================
function submitCancelReconfirm() {
    var supervisorId = document.getElementById('cancelSupervisorSelect').value;
    if (!supervisorId) {
        showInlineErrorById('cancelSupervisorError');
        return;
    }
    hideInlineErrorById('cancelSupervisorError');

    var remark = (document.getElementById('cancelRemark').value || '').trim();
    cancelFlowData = { supervisorId: supervisorId, remark: remark, refCode: null };

    // Send OTP via real API
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_CANCEL
    }).done(function (data) {
        cancelFlowData.refCode = data.refCode;
        setTextById('cancelOtpRefCodeLabel', '(Ref Code : ' + data.refCode + ')');
        setModalStep('cancelReconciliationModal', 'cancelStepB');
        var otpInput = document.getElementById('cancelOtpInput');
        if (otpInput) otpInput.value = '';
        hideInlineErrorById('cancelOtpError');
        startCancelOtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

function startCancelOtpCountdown(totalSeconds) {
    clearInterval(cancelOtpInterval);
    var seconds = (totalSeconds || 300) - 1;
    var btn = document.getElementById('btnCancelResendOtp');
    var countdownEl = document.getElementById('cancelOtpCountdown');
    var timerText = document.getElementById('cancelOtpTimerText');

    if (btn) { btn.disabled = true; btn.style.opacity = '0.3'; }
    if (timerText) timerText.style.display = '';

    cancelOtpInterval = setInterval(function () {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        if (countdownEl) countdownEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        seconds--;
        if (seconds < 0) {
            clearInterval(cancelOtpInterval);
            if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
            if (timerText) timerText.style.display = 'none';
            showInlineErrorById('cancelOtpError', 'OTP หมดอายุ กรุณากดส่งรหัส OTP อีกครั้ง');
        }
    }, 1000);
}

function resendCancelOtp() {
    if (!cancelFlowData || !cancelFlowData.supervisorId) return;
    otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: Number(cancelFlowData.supervisorId),
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_CANCEL
    }).done(function (data) {
        cancelFlowData.refCode = data.refCode;
        setTextById('cancelOtpRefCodeLabel', '(Ref Code : ' + data.refCode + ')');
        startCancelOtpCountdown((data.otpExpireIn || 5) * 60);
    }).fail(function () {
        showErrorModal('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
    });
}

function confirmCancelOtp() {
    var otpInput = (document.getElementById('cancelOtpInput').value || '').trim();
    if (!otpInput || otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) {
        showInlineErrorById('cancelOtpError');
        return;
    }
    hideInlineErrorById('cancelOtpError');

    // Verify OTP via real API
    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: APP.CONST.MAIL_TYPE.RECONCILIATION_CANCEL,
        bssMailRefCode: cancelFlowData.refCode,
        bssMailOtpCode: otpInput
    }).done(function () {
        otp.clearRefCode(APP.CONST.MAIL_TYPE.RECONCILIATION_CANCEL);

        if (USE_MOCK_DATA) {
            chainModal('cancelReconciliationModal', function () {
                summaryTableData = [];
                renderSummaryTable();
                updateDisplay2({ state: 'initial' });
                showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
            });
            return;
        }

        // Real API — cancel reconciliation with supervisor + OTP
        $.requestAjax({
            service: 'Reconcilation/CancelReconciliation',
            type: 'POST',
            parameter: {
                ReconciliationTranId: currentReconsileTranId,
                Remark: cancelFlowData.remark,
                SupervisorId: cancelFlowData.supervisorId,
                OtpCode: otpInput
            },
            onSuccess: function (res) {
                chainModal('cancelReconciliationModal', function () {
                    // UC02: เช็คว่า HC ถูกล็อกหรือยัง
                    if (res && res.data && res.data.message && res.data.message.indexOf('ล็อก') !== -1) {
                        var hc = parentHeaderCard || currentHeaderCard;
                        lockedHeaderCards.add(hc);
                        showHcLockedModal(hc);
                        return;
                    }

                    summaryTableData = [];
                    renderSummaryTable();
                    updateDisplay2({ state: 'initial' });
                    showSuccessModal('ยกเลิกกระทบยอดสำเร็จ');
                    var successEl = document.getElementById('reconsileSuccessModal');
                    if (successEl) {
                        successEl.addEventListener('hidden.bs.modal', function onDone() {
                            successEl.removeEventListener('hidden.bs.modal', onDone);
                            redirectToP01('cancelled');
                        });
                    }
                });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            },
            onError: function () {
                showErrorModal('เกิดข้อผิดพลาด');
            }
        });
<<<<<<< HEAD
    }
=======
    }).fail(function () {
        showInlineErrorById('cancelOtpError', 'OTP ไม่ถูกต้อง หรือหมดอายุ');
    });
}

function clearCancelFlow() {
    clearInterval(cancelOtpInterval);
    cancelOtpInterval = null;
    cancelFlowData = null;
    setModalStep('cancelReconciliationModal', 'cancelStepA');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============================================================
// Modal Helpers
// ============================================================
<<<<<<< HEAD
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('reconsileSuccessModal'));
=======
function showSuccessModal(message, showCancel) {
    document.getElementById('successMessage').textContent = message;
    var cancelBtn = document.getElementById('btnSuccessCancel');
    if (cancelBtn) cancelBtn.style.display = showCancel ? '' : 'none';
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconsileSuccessModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    modal.show();
}

function showErrorModal(message) {
<<<<<<< HEAD
    document.getElementById('reconsileErrorMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('reconsileErrorModal'));
    modal.show();
=======
    // Close any open modals first to prevent backdrop stacking
    document.querySelectorAll('.modal.show').forEach(function (m) {
        var instance = bootstrap.Modal.getInstance(m);
        if (instance) instance.hide();
    });
    setTimeout(function () {
        document.getElementById('reconsileErrorMessage').textContent = message;
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconsileErrorModal'));
        modal.show();
    }, 300);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function showInlineError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.add('show');
    }
}

function hideInlineError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.classList.remove('show');
    }
}

// ============================================================
// Utility
// ============================================================
function updateDateTime() {
    const el = document.getElementById('infoDateTime');
    if (!el) return;
    const now = new Date();
    const buddhistYear = now.getFullYear() + 543;
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${dd}/${mm}/${buddhistYear} ${hh}:${mi}:${ss}`;
}

function numberWithCommas(x) {
    if (x == null) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
