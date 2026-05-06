/* ============================================
   Reconciliation Transaction — Main JS
   ============================================ */

// ============ State ============
let reconcileTableData = [];
let prepTableItems = [];
let machineTableItems = [];
let machineHcTableItems = [];
let selectedReconcileTranId = null;
let reconcileCountdown = 300;
let reconcileTimerInterval = null;
let currentShiftFilter = 'all'; // 'all', 'morning', 'afternoon'
<<<<<<< HEAD
const USE_MOCK_DATA = true; // Set to false when backend API is available
=======
const USE_MOCK_DATA = false; // Set to false when backend API is available
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// Sort state per table
let sortStates = {
    prep: { field: null, direction: 'asc' },
    machine: { field: null, direction: 'asc' },
    hc: { field: null, direction: 'asc' }
};

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || '';
<<<<<<< HEAD
=======
const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;
const MAIL_TYPE = window.APP?.CONST?.MAIL_TYPE || {};

// Edit HC state
let supervisors = [];
let editOtpRefCode = '';
let editOtpCountdown = 300;
let editOtpTimerInterval = null;

// Delete OTP state (mock)
let deleteOtpRefCode = '';
let deleteOtpCountdown = 300;
let deleteOtpTimerInterval = null;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// ============ Init ============
document.addEventListener("DOMContentLoaded", () => {
    setupSortHandlers();
    setupScannerListener();
    showCurrentDateTime();
    setInterval(showCurrentDateTime, 1000);
<<<<<<< HEAD
=======
    document.getElementById('filterHeaderCard').addEventListener('change', applyFilters);
    document.getElementById('filterDenomination').addEventListener('change', applyFilters);
    document.getElementById('filterBank')?.addEventListener('change', applyFilters);
    document.getElementById('filterCashCenter')?.addEventListener('change', applyFilters);
    populateMockFilterDropdowns();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    initReconcilePage();
});

async function initReconcilePage() {
    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }
    $.enablePageLoader();
    try {
<<<<<<< HEAD
        await loadReconcileTransactions(1, 100, '');
        await loadReconcileCount();
=======
        await Promise.all([
            loadPrepareHeaderCards(),
            loadReconcileTransactions(1, -1, ''),
            loadMachineHeaderCards(),
            loadReconcileCount(),
            loadSupervisors()
        ]);
        populateFilterDropdowns();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    } finally {
        $.disablePageLoader();
    }
}

// ============ Mock Data (varied denominations + enough rows to overflow for scrollbar) ============
function getMockPrepData() {
    const denoms = [20, 50, 100, 500, 1000];
    const rows = [];
    for (let i = 1; i <= 25; i++) {
        rows.push({
            ReconcileTranId: i,
            HeaderCardCode: `005494${String(1100 + i).padStart(4, '0')}`,
            PrepareDate: `2025-07-${String(15 + (i % 10)).padStart(2, '0')}T${8 + (i % 8)}:${String(i * 3 % 60).padStart(2, '0')}:00`,
            DenominationPrice: denoms[i % denoms.length],
            IsWarning: i % 7 === 0,
            MachineHdId: 0,
            StatusCode: 'RECONCILIATION'
        });
    }
    return rows;
}

function getMockMachineData() {
    const denoms = [20, 50, 100, 500, 1000];
    const alertMessages = [
        'มีข้อผิดพลาดในข้อมูล Quality และ Output ของ Header Card นี้: มี Output ที่ระบบไม่รู้จัก [SHREDDED] หากมีข้อผิดพลาดจริงให้ลบข้อมูล Header Card นี้ ออกจากระบบ แล้ว Manual Key-in เข้าระบบแทน',
        'Header Card นี้ มีข้อมูลมากกว่า 1 มัด',
        'HeaderCard นี้ มีการ Reconcilation เกิน 3 ครั้ง กรุณาแจ้ง Supervisor เพื่อปลด Lock'
    ];
    let alertIdx = 0;
    const rows = [];
    for (let i = 1; i <= 20; i++) {
        // IsWarning = pink bg (ไม่มี icon ตกใจ), HasAlert = icon ตกใจ (ไม่มี pink bg) — ไม่อยู่ร่วมกัน
        const isWarn = i % 7 === 0;
        const hasAlert = !isWarn && i % 4 === 0;
        rows.push({
            ReconcileTranId: 100 + i,
            HeaderCardCode: `005494${String(1200 + i).padStart(4, '0')}`,
            PrepareDate: `2025-07-${String(15 + (i % 10)).padStart(2, '0')}T${9 + (i % 7)}:${String(i * 5 % 60).padStart(2, '0')}:00`,
            CreatedDate: `2025-07-${String(15 + (i % 10)).padStart(2, '0')}T${10 + (i % 6)}:${String(i * 7 % 60).padStart(2, '0')}:00`,
            DenominationPrice: denoms[(i + 1) % denoms.length],
            IsWarning: isWarn,
            HasAlert: hasAlert,
            AlertMessage: hasAlert ? alertMessages[alertIdx++ % alertMessages.length] : '',
            MachineHdId: 1,
            StatusCode: isWarn ? 'WARNING' : 'RECONCILED'
        });
    }
    return rows;
}

function getMockMachineHcData() {
    const denoms = [20, 50, 100, 500, 1000];
    const alertMessages = [
        'Header Card นี้ มีข้อมูลมากกว่า 1 มัด',
        'HeaderCard นี้ มีการ Reconcilation เกิน 3 ครั้ง กรุณาแจ้ง Supervisor เพื่อปลด Lock',
        'มีข้อผิดพลาดในข้อมูล Quality และ Output ของ Header Card นี้: มี Output ที่ระบบไม่รู้จัก [SHREDDED] หากมีข้อผิดพลาดจริงให้ลบข้อมูล Header Card นี้ ออกจากระบบ แล้ว Manual Key-in เข้าระบบแทน'
    ];
    let alertIdx = 0;
    const rows = [];
    for (let i = 1; i <= 30; i++) {
        const isWarn = i % 8 === 0;
        const hasAlert = !isWarn && i % 5 === 0;
        rows.push({
            ReconcileTranId: 200 + i,
            HeaderCardCode: `005494${String(1300 + i).padStart(4, '0')}`,
            CreatedDate: `2025-07-${String(15 + (i % 10)).padStart(2, '0')}T${8 + (i % 9)}:${String(i * 4 % 60).padStart(2, '0')}:00`,
            DenominationPrice: denoms[(i + 2) % denoms.length],
            IsWarning: isWarn,
            HasAlert: hasAlert,
            AlertMessage: hasAlert ? alertMessages[alertIdx++ % alertMessages.length] : '',
            MachineHdId: 1
        });
    }
    return rows;
}

function loadMockData() {
    prepTableItems = getMockPrepData();
    machineTableItems = getMockMachineData();
    machineHcTableItems = getMockMachineHcData();
    reconcileTableData = prepTableItems;

    renderPrepTable(prepTableItems);
    renderMachineTable(machineTableItems);
    renderMachineHcTable(machineHcTableItems);

    // Update reconciled count badge
    const el = document.getElementById('totalReconciledCount');
    if (el) el.textContent = '100';
}

// ============ Date/Time Display ============
function showCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear() + 543;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    const el = document.getElementById("info-current-datetime");
    if (el) el.textContent = formatted;
}

// ============ Scanner ============
function setupScannerListener() {
    const scanInput = document.getElementById('scanHeaderCardInput');
    if (!scanInput) return;

    scanInput.addEventListener('keypress', async function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const headerCard = scanInput.value.trim();
            if (!headerCard) return;

            await scanHeaderCard(headerCard);
            scanInput.value = '';
            scanInput.focus();
        }
    });

    scanInput.focus();
}

async function scanHeaderCard(headerCardCode) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Reconcilation/ScanHeaderCard',
            type: 'POST',
            parameter: { headerCardCode: headerCardCode },
            enableLoader: true,
            onSuccess: function (response) {
                if (response && response.is_success) {
                    refreshData();
                } else {
                    showReconcileError(response?.msg_desc || 'สแกนไม่สำเร็จ');
                }
                resolve(response);
            },
            onError: function (err) {
                showReconcileError('เกิดข้อผิดพลาดในการสแกน');
                reject(err);
            }
        });
    });
}

// ============ Load Transactions ============
function getReconcileTransactionsAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Reconcilation/GetReconcileTransactionsDetailAsync',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

async function loadReconcileTransactions(page, pageSize, search) {
    try {
        const requestData = {
            PageNumber: page || 1,
<<<<<<< HEAD
            PageSize: pageSize || 100,
=======
            PageSize: pageSize,
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            Search: search || ''
        };

        const response = await getReconcileTransactionsAsync(requestData);

<<<<<<< HEAD
        if (response && response.is_success && response.Data) {
            reconcileTableData = response.Data.Items || [];
            prepTableItems = reconcileTableData.filter(x => !x.MachineHdId || x.MachineHdId === 0);
            machineTableItems = reconcileTableData;
            machineHcTableItems = reconcileTableData;
            renderPrepTable(prepTableItems);
            renderMachineTable(machineTableItems);
            renderMachineHcTable(machineHcTableItems);
        } else {
            reconcileTableData = [];
            prepTableItems = [];
            machineTableItems = [];
            machineHcTableItems = [];
            renderPrepTable([]);
            renderMachineTable([]);
            renderMachineHcTable([]);
=======
        if (response && response.is_success && response.data) {
            reconcileTableData = response.data.items || [];
            machineTableItems = reconcileTableData;
            renderMachineTable(machineTableItems);
        } else {
            reconcileTableData = [];
            machineTableItems = [];
            renderMachineTable([]);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        }
    } catch (err) {
        console.error('loadReconcileTransactions error:', err);
        reconcileTableData = [];
<<<<<<< HEAD
        prepTableItems = [];
        machineTableItems = [];
        machineHcTableItems = [];
        renderPrepTable([]);
        renderMachineTable([]);
=======
        machineTableItems = [];
        renderMachineTable([]);
    }
}

// ============ Load Machine Header Cards (from GET API) ============
async function loadMachineHeaderCards() {
    try {
        const response = await new Promise(function (resolve, reject) {
            $.requestAjax({
                service: 'Reconcilation/GetMachineHeaderCards',
                type: 'GET',
                enableLoader: false,
                onSuccess: function (res) { resolve(res); },
                onError: function (err) { reject(err); }
            });
        });

        if (response && response.is_success && response.data) {
            machineHcTableItems = response.data;
        } else {
            machineHcTableItems = [];
        }
        renderMachineHcTable(machineHcTableItems);
    } catch (err) {
        console.error('loadMachineHeaderCards error:', err);
        machineHcTableItems = [];
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        renderMachineHcTable([]);
    }
}

<<<<<<< HEAD
=======
// ============ Load Prepare Header Cards (from GET API) ============
async function loadPrepareHeaderCards() {
    try {
        const response = await new Promise(function (resolve, reject) {
            $.requestAjax({
                service: 'Reconcilation/GetPrepareHeaderCards',
                type: 'GET',
                enableLoader: false,
                onSuccess: function (res) { resolve(res); },
                onError: function (err) { reject(err); }
            });
        });

        if (response && response.is_success && response.data) {
            prepTableItems = response.data.map(function (item) {
                return {
                    PrepareId: item.prepareId,
                    HeaderCardCode: item.headerCardCode,
                    PrepareDate: item.prepareDate,
                    DenominationPrice: item.denominationPrice,
                    IsWarning: false
                };
            });
        } else {
            prepTableItems = [];
        }
        renderPrepTable(prepTableItems);
    } catch (err) {
        console.error('loadPrepareHeaderCards error:', err);
        prepTableItems = [];
        renderPrepTable([]);
    }
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Octagon Warning Icon (Figma node 32:25853 — 8-sided, #DC3545) ============
const ALERT_ICON_SVG = `<img src="data:image/svg+xml,%3Csvg viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.72 0a.44.44 0 0 1 .31.128l3.845 3.845a.44.44 0 0 1 .128.308v5.438a.44.44 0 0 1-.128.308l-3.845 3.845a.44.44 0 0 1-.31.128H4.283a.44.44 0 0 1-.308-.128L.13 10.027A.44.44 0 0 1 .002 9.72V4.28a.44.44 0 0 1 .128-.308L3.975.128A.44.44 0 0 1 4.283 0h5.437ZM7.003 8.75a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75Zm-.001-5.25c-.468 0-.835.405-.788.871l.307 3.068a.483.483 0 0 0 .481.436.483.483 0 0 0 .482-.436l.306-3.068c.047-.466-.32-.871-.788-.871Z' fill='%23DC3545'/%3E%3C/svg%3E" width="14" height="14" style="vertical-align:middle;flex-shrink:0" alt="">`;

// ============ Denomination Badge Helper ============
// Reuse qty-badge from all.css (includes pattern background-image)
// + qty-{price} color class (already defined in all.css)
function getDenomBadgeClass(price) {
    const p = parseInt(price);
    if ([20, 50, 100, 500, 1000].includes(p)) return `qty-badge qty-${p}`;
    return 'qty-badge';
}

// ============ Render Tables ============
function renderPrepTable(data) {
    const tbody = document.getElementById('prepTableBody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td class="col-spacer"></td><td colspan="4">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = data.map((item, idx) => {
<<<<<<< HEAD
        const rowClass = item.IsWarning ? 'row-warning' : '';
        const denomClass = getDenomBadgeClass(item.DenominationPrice);
        const actionBtns = item.IsWarning
            ? `<button class="btn-action btn-action-danger" onclick="event.stopPropagation(); openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`
            : `<button class="btn-action" onclick="event.stopPropagation(); openEditModal(${item.ReconcileTranId})" title="แก้ไข">
                   <i class="bi bi-pencil-fill"></i>
               </button>
               <button class="btn-action" onclick="event.stopPropagation(); openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`;
        return `<tr class="${rowClass}" data-id="${item.ReconcileTranId}" onclick="selectRow(${item.ReconcileTranId})">
=======
        const rowId = item.PrepareId || item.ReconcileTranId;
        const rowClass = item.IsWarning ? 'row-warning' : '';
        const denomClass = getDenomBadgeClass(item.DenominationPrice);
        const lockBtn = item.IsWarning
            ? `<button class="btn-action btn-action-warning" onclick="event.stopPropagation(); openUnlockModal(${rowId}, 'prepare')" title="ปลดล็อค">
                   <i class="bi bi-lock-fill"></i>
               </button>`
            : '';
        const actionBtns = item.IsWarning
            ? `${lockBtn}
               <button class="btn-action btn-action-danger" onclick="event.stopPropagation(); openDeleteModal(${rowId}, 'prepare')" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`
            : `<button class="btn-action" onclick="event.stopPropagation(); openEditModal(${rowId}, 'prepare')" title="แก้ไข">
                   <i class="bi bi-pencil-fill"></i>
               </button>
               <button class="btn-action" onclick="event.stopPropagation(); openDeleteModal(${rowId}, 'prepare')" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`;
        return `<tr class="${rowClass}" data-id="${rowId}" onclick="selectRow(${rowId})">
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td class="col-spacer"></td>
            <td>${item.HeaderCardCode || '-'}</td>
            <td class="td-datetime">${formatDateTime(item.PrepareDate)}</td>
            <td><span class="${denomClass}">${item.DenominationPrice || '-'}</span></td>
            <td>
                <div class="action-btns">${actionBtns}</div>
            </td>
        </tr>`;
    }).join('');
}

function renderMachineTable(data) {
    const tbody = document.getElementById('machineTableBody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td class="col-spacer"></td><td colspan="5">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = data.map((item, idx) => {
        // IsWarning = pink bg ทั้ง row (locked), HasAlert = แค่ Header Card ID สีแดง + icon (ไม่อยู่ร่วมกัน)
<<<<<<< HEAD
        const rowClass = item.IsWarning ? 'row-warning' : '';
        const alertIcon = item.HasAlert ? ` ${ALERT_ICON_SVG}` : '';
        const hcClass = item.HasAlert ? 'td-hc-alert' : '';
        const denomClass = getDenomBadgeClass(item.DenominationPrice);
        const actionBtns = item.IsWarning
            ? `<button class="btn-action btn-action-danger" onclick="openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`
            : `<button class="btn-action" onclick="openEditModal(${item.ReconcileTranId})" title="แก้ไข">
                   <i class="bi bi-pencil-fill"></i>
               </button>
               <button class="btn-action" onclick="openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`;
        const alertAttr = item.HasAlert && item.AlertMessage ? ` data-alert-msg="${item.AlertMessage.replace(/"/g, '&quot;')}"` : '';
        return `<tr class="${rowClass}" data-id="${item.ReconcileTranId}">
            <td class="col-spacer"></td>
            <td class="${hcClass}"${alertAttr}><div class="td-hc-wrap"><span class="td-hc-text">${item.HeaderCardCode || '-'}</span>${alertIcon}</div></td>
            <td class="td-datetime">${formatDateTime(item.PrepareDate)}</td>
            <td class="td-datetime">${formatDateTime(item.CreatedDate)}</td>
            <td><span class="${denomClass}">${item.DenominationPrice || '-'}</span></td>
=======
        const rowClass = item.isWarning ? 'row-warning' : '';
        const alertIcon = item.hasAlert ? ` ${ALERT_ICON_SVG}` : '';
        const hcClass = item.hasAlert ? 'td-hc-alert' : '';
        const denomClass = getDenomBadgeClass(item.denominationPrice);
        const lockBtn = item.isWarning
            ? `<button class="btn-action btn-action-warning" onclick="openUnlockModal(${item.reconcileTranId}, 'matching')" title="ปลดล็อค">
                   <i class="bi bi-lock-fill"></i>
               </button>`
            : '';
        const actionBtns = item.isWarning
            ? `${lockBtn}
               <button class="btn-action btn-action-danger" onclick="openDeleteModal(${item.reconcileTranId}, 'matching')" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`
            : `<button class="btn-action" onclick="openEditModal(${item.reconcileTranId}, 'matching')" title="แก้ไข">
                   <i class="bi bi-pencil-fill"></i>
               </button>
               <button class="btn-action" onclick="openDeleteModal(${item.reconcileTranId}, 'matching')" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`;
        const alertAttr = item.hasAlert && item.alertRemark ? ` data-alert-msg="${item.alertRemark.replace(/"/g, '&quot;')}"` : '';
        return `<tr class="${rowClass}" data-id="${item.reconcileTranId}">
            <td class="col-spacer"></td>
            <td class="${hcClass}"${alertAttr}><div class="td-hc-wrap"><span class="td-hc-text">${item.headerCardCode || '-'}</span>${alertIcon}</div></td>
            <td class="td-datetime">${formatDateTime(item.prepareDate)}</td>
            <td class="td-datetime">${formatDateTime(item.createdDate)}</td>
            <td><span class="${denomClass}">${item.denominationPrice || '-'}</span></td>
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td>
                <div class="action-btns">${actionBtns}</div>
            </td>
        </tr>`;
    }).join('');

    bindAlertTooltips(tbody);
}

function renderMachineHcTable(data) {
    const tbody = document.getElementById('machineHcTableBody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td class="col-spacer col-spacer-sm"></td><td colspan="4">ไม่มีข้อมูล</td></tr>';
        return;
    }

<<<<<<< HEAD
    // Show unique machine header cards
    const machineItems = data.filter(x => x.MachineHdId > 0);
=======
    // Show items — from GET API (camelCase keys from JSON)
    const machineItems = data.filter(x => x.machineHdId > 0);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    if (machineItems.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td class="col-spacer col-spacer-sm"></td><td colspan="4">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = machineItems.map((item, idx) => {
<<<<<<< HEAD
        const rowClass = item.IsWarning ? 'row-warning' : '';
        const alertIcon = item.HasAlert ? ` ${ALERT_ICON_SVG}` : '';
        const hcClass = item.HasAlert ? 'td-hc-alert' : '';
        const denomClass = getDenomBadgeClass(item.DenominationPrice);
        const actionBtns = item.IsWarning
            ? `<button class="btn-action btn-action-danger" onclick="openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`
            : `<button class="btn-action" onclick="openEditModal(${item.ReconcileTranId})" title="แก้ไข">
                   <i class="bi bi-pencil-fill"></i>
               </button>
               <button class="btn-action" onclick="openDeleteModal(${item.ReconcileTranId})" title="ลบ">
                   <i class="bi bi-trash-fill"></i>
               </button>`;
        const alertAttr = item.HasAlert && item.AlertMessage ? ` data-alert-msg="${item.AlertMessage.replace(/"/g, '&quot;')}"` : '';
        return `<tr class="${rowClass}" data-id="${item.ReconcileTranId}">
            <td class="col-spacer col-spacer-sm"></td>
            <td class="${hcClass}"${alertAttr}><div class="td-hc-wrap"><span class="td-hc-text">${item.HeaderCardCode || '-'}</span>${alertIcon}</div></td>
            <td class="td-datetime">${formatDateTime(item.CreatedDate)}</td>
            <td><span class="${denomClass}">${item.DenominationPrice || '-'}</span></td>
=======
        const rowClass = item.isWarning ? 'row-warning' : '';
        const alertIcon = item.hasAlert ? ` ${ALERT_ICON_SVG}` : '';
        const hcClass = item.hasAlert ? 'td-hc-alert' : '';
        const denomClass = getDenomBadgeClass(item.denominationPrice);
        const rowId = item.machineHdId;

        const lockBtn = item.isWarning
            ? `<button class="btn-action btn-action-warning" onclick="openUnlockModal(${rowId}, 'machine')" title="ปลดล็อค">
                   <i class="bi bi-lock-fill"></i>
               </button>`
            : '';
        const actionBtns = item.isMatchPrepare
            ? ''
            : item.isWarning
                ? `${lockBtn}
                   <button class="btn-action btn-action-danger" onclick="openDeleteModal(${rowId}, 'machine')" title="ลบ">
                       <i class="bi bi-trash-fill"></i>
                   </button>`
                : `<button class="btn-action" onclick="openEditModal(${rowId}, 'machine')" title="แก้ไข">
                       <i class="bi bi-pencil-fill"></i>
                   </button>
                   <button class="btn-action" onclick="openDeleteModal(${rowId}, 'machine')" title="ลบ">
                       <i class="bi bi-trash-fill"></i>
                   </button>`;
        const alertAttr = item.hasAlert && item.alertMessage ? ` data-alert-msg="${item.alertMessage.replace(/"/g, '&quot;')}"` : '';
        return `<tr class="${rowClass}" data-id="${rowId}">
            <td class="col-spacer col-spacer-sm"></td>
            <td class="${hcClass}"${alertAttr}><div class="td-hc-wrap"><span class="td-hc-text">${item.headerCardCode || '-'}</span>${alertIcon}</div></td>
            <td class="td-datetime">${formatDateTime(item.createdDate)}</td>
            <td><span class="${denomClass}">${item.denominationPrice || '-'}</span></td>
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td>
                <div class="action-btns">${actionBtns}</div>
            </td>
        </tr>`;
    }).join('');

    bindAlertTooltips(tbody);
}

// ============ Row Selection ============
function selectRow(reconcileTranId) {
    selectedReconcileTranId = reconcileTranId;

    // Highlight selected row
    document.querySelectorAll('.reconcile-table-left tr').forEach(tr => tr.classList.remove('row-selected'));
    const selectedTr = document.querySelector(`.reconcile-table-left tr[data-id="${reconcileTranId}"]`);
    if (selectedTr) selectedTr.classList.add('row-selected');

    // Load header card detail
    loadHeaderCardDetail(reconcileTranId);
}

function loadHeaderCardDetail(reconcileTranId) {
    $.requestAjax({
        service: `Reconcilation/GetHeaderCardDetail?reconcileTranId=${reconcileTranId}`,
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {
            if (response && response.is_success && response.data) {
                // Update right panel info if needed
            }
        },
        onError: function (err) {
            console.error('loadHeaderCardDetail error:', err);
        }
    });
}

// ============ Reconcile Count ============
async function loadReconcileCount() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Reconcilation/GetReconcileCount',
            type: 'POST',
            parameter: {},
            enableLoader: false,
            onSuccess: function (response) {
                if (response && response.is_success && response.data) {
                    const el = document.getElementById('totalReconciledCount');
                    if (el) el.textContent = response.data.TotalReconciled || 0;
                }
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

// ============ Filter ============
function toggleFilter() {
    const section = document.getElementById('filterSection');
    if (section) {
        const isHidden = section.style.display === 'none';
        section.style.display = isHidden ? 'flex' : 'none';
    }
}

<<<<<<< HEAD
function clearFilter() {
    document.getElementById('filterHeaderCard').value = '';
    document.getElementById('filterDenomination').value = '';
    refreshData();
=======
function populateFilterDropdowns() {
    // Collect unique HeaderCardCodes from all 3 tables
    var headerCards = new Set();
    prepTableItems.forEach(function (item) { if (item.HeaderCardCode) headerCards.add(item.HeaderCardCode); });
    machineHcTableItems.forEach(function (item) { if (item.headerCardCode) headerCards.add(item.headerCardCode); });
    machineTableItems.forEach(function (item) { if (item.headerCardCode) headerCards.add(item.headerCardCode); });

    var hcSelect = document.getElementById('filterHeaderCard');
    var prevHC = hcSelect.value;
    hcSelect.innerHTML = '<option value="">Please select</option>';
    headerCards.forEach(function (code) {
        hcSelect.innerHTML += '<option value="' + code + '">' + code + '</option>';
    });
    if (prevHC) hcSelect.value = prevHC;
}

function applyFilters() {
    var selectedHC = document.getElementById('filterHeaderCard').value;
    var selectedDeno = document.getElementById('filterDenomination').value;
    var denoNum = selectedDeno ? parseInt(selectedDeno) : null;

    // Filter prep table (left panel) — PascalCase properties
    var filteredPrep = prepTableItems.filter(function (item) {
        if (selectedHC && item.HeaderCardCode !== selectedHC) return false;
        if (denoNum && item.DenominationPrice !== denoNum) return false;
        return true;
    });
    renderPrepTable(filteredPrep);

    // Filter machine HC table (right panel) — camelCase properties
    var filteredMachineHc = machineHcTableItems.filter(function (item) {
        if (selectedHC && item.headerCardCode !== selectedHC) return false;
        if (denoNum && item.denominationPrice !== denoNum) return false;
        return true;
    });
    renderMachineHcTable(filteredMachineHc);

    // Filter center table (prep+machine matched) — camelCase properties
    var filteredMachine = machineTableItems.filter(function (item) {
        if (selectedHC && item.headerCardCode !== selectedHC) return false;
        if (denoNum && item.denominationPrice !== denoNum) return false;
        return true;
    });
    renderMachineTable(filteredMachine);
}

function clearFilter() {
    document.getElementById('filterHeaderCard').value = '';
    document.getElementById('filterDenomination').value = '';
    if (document.getElementById('filterBank')) document.getElementById('filterBank').value = '';
    if (document.getElementById('filterCashCenter')) document.getElementById('filterCashCenter').value = '';
    renderPrepTable(prepTableItems);
    renderMachineHcTable(machineHcTableItems);
    renderMachineTable(machineTableItems);
}

// MOCK: populate ธนาคาร/ศูนย์เงินสด dropdowns
function populateMockFilterDropdowns() {
    const bankSelect = document.getElementById('filterBank');
    if (bankSelect) {
        const banks = [
            { value: 'BBL', text: 'ธนาคารกรุงเทพ' },
            { value: 'KBANK', text: 'ธนาคารกสิกรไทย' },
            { value: 'KTB', text: 'ธนาคารกรุงไทย' },
            { value: 'SCB', text: 'ธนาคารไทยพาณิชย์' }
        ];
        banks.forEach(b => {
            bankSelect.innerHTML += `<option value="${b.value}">${b.text}</option>`;
        });
    }
    const ccSelect = document.getElementById('filterCashCenter');
    if (ccSelect) {
        const centers = [
            { value: 'CC01', text: 'ศูนย์เงินสด สำนักงานใหญ่' },
            { value: 'CC02', text: 'ศูนย์เงินสด สาขาเหนือ' },
            { value: 'CC03', text: 'ศูนย์เงินสด สาขาใต้' }
        ];
        centers.forEach(c => {
            ccSelect.innerHTML += `<option value="${c.value}">${c.text}</option>`;
        });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============ Refresh ============
async function refreshData() {
<<<<<<< HEAD
    await loadReconcileTransactions(1, 100, '');
    await loadReconcileCount();
}

// ============ Edit (Original — kept for non-mock mode) ============
function openEditModal_original(reconcileTranId) {
    const item = reconcileTableData.find(x => x.ReconcileTranId === reconcileTranId);
    if (!item) return;

    document.getElementById('editReconcileTranId').value = reconcileTranId;
    document.getElementById('editOldHeaderCard').value = item.HeaderCardCode || '';
    document.getElementById('editNewHeaderCard').value = item.HeaderCardCode || '';
    document.getElementById('editRemark').value = '';

    const modal = new bootstrap.Modal(document.getElementById('editReconcileModal'));
    modal.show();
}

function submitEditReconcileTran() {
    const reconcileTranId = parseInt(document.getElementById('editReconcileTranId').value);
    const headerCardCode = document.getElementById('editNewHeaderCard').value.trim();
    const remark = document.getElementById('editRemark').value.trim();

    if (!headerCardCode) {
        showReconcileError('กรุณาระบุ Header Card');
        return;
    }
    if (!remark) {
        showReconcileError('กรุณาระบุเหตุผล');
        return;
    }

    $.requestAjax({
        service: 'Reconcilation/EditReconcileTran',
        type: 'POST',
        parameter: {
            ReconcileTranId: reconcileTranId,
            HeaderCardCode: headerCardCode,
            Remark: remark
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                bootstrap.Modal.getInstance(document.getElementById('editReconcileModal'))?.hide();
                showSuccessModal('แก้ไขข้อมูลสำเร็จ');
                refreshData();
            } else {
                showReconcileError(response?.msg_desc || 'แก้ไขไม่สำเร็จ');
            }
        },
        onError: function (err) {
            showReconcileError('เกิดข้อผิดพลาดในการแก้ไข');
        }
    });
}

// ============ Edit Flow — Mock Popup (Figma Section 2:41247) ============
// Flow: Edit Form → Review Table → OTP Supervisor → OTP Manager → Success
let editFlowData = null; // stores current edit flow context

function openEditModal(reconcileTranId) {
    // Find item across all table data
    const item = findItemById(reconcileTranId);
    if (!item) return;

    editFlowData = {
        reconcileTranId: reconcileTranId,
        item: item,
        isAlert: item.HasAlert || false
    };

    if (item.HasAlert) {
        // Alert case: 2 header cards in bundle → show 6-field form
        openEditAlertForm(item);
    } else {
        // Normal case: simple 2-field form
        openEditSimpleForm(item);
    }
}

function findItemById(id) {
    return machineTableItems.find(x => x.ReconcileTranId === id)
        || prepTableItems.find(x => x.ReconcileTranId === id)
        || machineHcTableItems.find(x => x.ReconcileTranId === id);
}

function openEditSimpleForm(item) {
    document.getElementById('editFormReconcileTranId').value = item.ReconcileTranId;
    document.getElementById('editFormIsAlert').value = '0';
    document.getElementById('editFormOldHc').value = item.HeaderCardCode || '';
    document.getElementById('editFormNewHc').value = '';
=======
    if (!USE_MOCK_DATA) {
        // Step 1: Import machine data from FTP
        try {
            await refreshFromMachine();
        } catch (e) {
            console.warn('refreshFromMachine error:', e);
        }
        // Step 2: Reload prep (left panel) + combined tables + right panel + count
        await Promise.all([
            loadPrepareHeaderCards(),
            loadReconcileTransactions(1, -1, ''),
            loadMachineHeaderCards(),
            loadReconcileCount()
        ]);
        populateFilterDropdowns();
        applyFilters();
    } else {
        await loadReconcileTransactions(1, -1, '');
        await loadReconcileCount();
    }
}

async function refreshFromMachine() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Reconcilation/Refresh',
            type: 'POST',
            parameter: {},
            enableLoader: true,
            onSuccess: function (response) {
                if (response && response.is_success && response.data) {
                    const d = response.data;
                    console.log(`Refresh: ${d.totalFilesImported} imported, ${d.totalFilesSkipped} skipped, ${d.totalFilesError} errors`);
                    if (d.totalFilesFound === 0) {
                        showReconcileWarning('ไม่มีข้อมูลจากเครื่องจักร');
                    } else if (d.errors && d.errors.length > 0) {
                        showRefreshErrors(d.errors);
                    }
                }
                resolve(response);
            },
            onError: function (err) {
                console.error('Refresh from machine failed:', err);
                reject(err);
            }
        });
    });
}

// ============ Edit Flow — Real OTP (Supervisor only) ============
let editFlowData = null;

function openEditModal(id, source) {
    const item = findItemById(id, source);
    if (!item) return;

    editFlowData = { id, source, item };

    // Get HC code — camelCase for machine/matching, PascalCase for prepare
    const oldHc = item.HeaderCardCode || item.headerCardCode || '';

    document.getElementById('editFormOldHc').value = oldHc;
    document.getElementById('editFormNewHc').value = '';
    hideInlineError('editFormError');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    const modal = new bootstrap.Modal(document.getElementById('editFormModal'));
    modal.show();
}

<<<<<<< HEAD
function openEditAlertForm(item) {
    document.getElementById('editAlertReconcileTranId').value = item.ReconcileTranId;

    // Mock: alert case has 2 header cards in bundle
    const mockHc2 = String(parseInt(item.HeaderCardCode) + 1).padStart(10, '0');
    document.getElementById('editAlertOldHc1').value = item.HeaderCardCode || '';
    document.getElementById('editAlertDenom1').value = item.DenominationPrice || '';
    document.getElementById('editAlertOldHc2').value = mockHc2;
    document.getElementById('editAlertDenom2').value = item.DenominationPrice || '';
    document.getElementById('editAlertNewHc1').value = '';
    document.getElementById('editAlertNewHc2').value = '';

    const modal = new bootstrap.Modal(document.getElementById('editAlertFormModal'));
    modal.show();
}

function submitEditForm() {
    const newHc = document.getElementById('editFormNewHc').value;
=======
function findItemById(id, source) {
    if (source === 'prepare') return prepTableItems.find(x => x.PrepareId == id);
    if (source === 'machine') return machineHcTableItems.find(x => x.machineHdId == id);
    if (source === 'matching') return machineTableItems.find(x => x.reconcileTranId == id);
    return null;
}

function submitEditForm() {
    const newHc = document.getElementById('editFormNewHc').value.trim();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    if (!newHc) {
        showInlineError('editFormError');
        return;
    }
    hideInlineError('editFormError');

<<<<<<< HEAD
    // Build review data (single item)
    editFlowData.reviewItems = getMockEditReviewData(editFlowData.item, newHc, false);

    // Close edit form → wait for hidden → open review modal
    chainModal('editFormModal', () => showEditReviewModal());
}

function submitEditAlertForm() {
    const newHc1 = document.getElementById('editAlertNewHc1').value;
    const newHc2 = document.getElementById('editAlertNewHc2').value;
    if (!newHc1 || !newHc2) {
        showInlineError('editAlertFormError');
        return;
    }
    hideInlineError('editAlertFormError');

    // Build review data (2 items — alert case)
    editFlowData.reviewItems = getMockEditReviewData(editFlowData.item, newHc1, true, newHc2);

    // Close alert form → wait for hidden → open review modal
    chainModal('editAlertFormModal', () => showEditReviewModal());
}

function showEditReviewModal() {
    const items = editFlowData.reviewItems;
    const count = items.length;

    // Reset to step A
    setModalStep('editReviewModal', 'editReviewStepA');

    // Update subtitle
    document.getElementById('editReviewSubtitle').textContent = `เตรียมแก้ไขข้อมูล ${count} รายการ`;

    // Populate review table
    const tbody = document.getElementById('editReviewTableBody');
    tbody.innerHTML = items.map((row, idx) => {
        const denomClass = getDenomBadgeClass(row.denomPrice);
        const warningIcon = row.hasWarning ? ALERT_ICON_SVG : '';
        return `<tr>
            <td>${idx + 1}</td>
            <td class="td-warning-icon">${warningIcon}</td>
            <td>${row.oldHc}</td>
            <td>${row.newHc}</td>
            <td><span class="${denomClass}">${row.denomPrice}</span></td>
            <td>${row.containerBarcode}</td>
            <td>${row.preparer}</td>
            <td>${row.source}</td>
        </tr>`;
    }).join('');

    // Clear remark
    document.getElementById('editReviewRemark').value = '';
=======
    editFlowData.newHc = newHc;
    editFlowData.oldHc = document.getElementById('editFormOldHc').value;

    // Close edit form → open review modal
    chainModal('editFormModal', () => showEditReviewModal());
}

function showEditReviewModal() {
    // Reset to step A
    setModalStep('editReviewModal', 'editReviewStepA');

    // Show old/new HC in review
    document.getElementById('editReviewOldHc').value = editFlowData.oldHc || '';
    document.getElementById('editReviewNewHc').value = editFlowData.newHc || '';

    // Clear remark
    document.getElementById('editReviewRemark').value = '';
    hideInlineError('editReviewRemarkError');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    const modal = new bootstrap.Modal(document.getElementById('editReviewModal'));
    modal.show();
}

function confirmEditReview() {
    const remark = document.getElementById('editReviewRemark').value.trim();
    if (!remark) {
        showInlineError('editReviewRemarkError');
        return;
    }
    hideInlineError('editReviewRemarkError');
    editFlowData.remark = remark;
<<<<<<< HEAD
    // Move to OTP Supervisor step
    setModalStep('editReviewModal', 'editReviewStepB');
}

function confirmEditSupervisorOtp() {
    // Mock: skip real OTP → move to Manager step
    setModalStep('editReviewModal', 'editReviewStepC');
}

function confirmEditManagerOtp() {
    // Mock: skip real OTP → close review → wait for hidden → show success
    chainModal('editReviewModal', () => {
        showSuccessModal('แก้ไขข้อมูล Header Card สำเร็จ');
=======

    // Move to Supervisor OTP step
    resetEditOtpUI();
    renderSupervisorDropdown();
    setModalStep('editReviewModal', 'editReviewStepB');
}

// ============ Supervisor OTP ============

function resetEditOtpUI() {
    editOtpRefCode = '';
    clearInterval(editOtpTimerInterval);
    document.getElementById('editOtpRefCode').innerText = '-';
    document.getElementById('editOtpInput').value = '';
    document.getElementById('editOtpInput').disabled = true;
    document.getElementById('btnEditSendOtp').disabled = false;
    document.getElementById('btnEditConfirmOtp').disabled = true;
    document.getElementById('editOtpTimer').innerText = '';
    document.getElementById('editOtpError').innerText = '';
    document.getElementById('editOtpError').classList.remove('show');
    hideInlineError('editSupervisorError');
}

function renderSupervisorDropdown() {
    const select = document.getElementById('editHcSupervisorSelect');
    select.innerHTML = '<option value="">-- เลือกผู้อนุมัติ --</option>';
    supervisors.forEach(function (sv) {
        const name = sv.text || sv.label || sv.fullName || (sv.firstName + ' ' + sv.lastName);
        const id = sv.value || sv.id || sv.userId;
        select.innerHTML += '<option value="' + id + '">' + name + '</option>';
    });
}

function sendEditOtp() {
    const supervisorId = document.getElementById('editHcSupervisorSelect').value;
    if (!supervisorId) {
        showInlineError('editSupervisorError');
        return;
    }
    hideInlineError('editSupervisorError');

    const source = editFlowData.source;
    const mailTypeCode = (source === 'machine')
        ? MAIL_TYPE.RECONCILIATION_MACHINE_EDIT
        : MAIL_TYPE.RECONCILIATION_PREPARE_EDIT;

    document.getElementById('btnEditSendOtp').disabled = true;

    otp.send({
        userSendId: Number(currentUserId),
        userSendDepartmentId: Number(currentDepartmentId),
        userReceiveId: Number(supervisorId),
        bssMailSystemTypeCode: mailTypeCode
    })
    .done(function (data) {
        editOtpRefCode = data.refCode;
        editFlowData.supervisorId = Number(supervisorId);
        editFlowData.mailTypeCode = mailTypeCode;

        document.getElementById('editOtpRefCode').innerText = editOtpRefCode;
        document.getElementById('editOtpInput').disabled = false;
        document.getElementById('editOtpInput').focus();
        document.getElementById('btnEditConfirmOtp').disabled = false;

        // Start timer
        clearInterval(editOtpTimerInterval);
        editOtpCountdown = 300;
        runEditOtpTimer();
    })
    .fail(function () {
        document.getElementById('btnEditSendOtp').disabled = false;
        toastr.error('ส่ง OTP ไม่สำเร็จ');
    });
}

function runEditOtpTimer() {
    editOtpTimerInterval = setInterval(function () {
        editOtpCountdown--;
        var m = Math.floor(editOtpCountdown / 60);
        var s = editOtpCountdown % 60;
        if (s < 10) s = '0' + s;
        document.getElementById('editOtpTimer').innerText = 'ส่งอีกครั้งได้ใน ' + m + ':' + s;

        if (editOtpCountdown <= 0) {
            clearInterval(editOtpTimerInterval);
            document.getElementById('btnEditSendOtp').disabled = false;
            document.getElementById('editOtpTimer').innerText = '';
            document.getElementById('editOtpInput').value = '';
            document.getElementById('editOtpInput').disabled = true;
            document.getElementById('btnEditConfirmOtp').disabled = true;
            document.getElementById('editOtpRefCode').innerText = '-';
            document.getElementById('editOtpError').innerText = 'รหัส OTP หมดอายุแล้ว กรุณาส่งรหัสใหม่';
        }
    }, 1000);
}

function submitEditOtp() {
    const otpInput = document.getElementById('editOtpInput').value.trim();
    const errorEl = document.getElementById('editOtpError');
    errorEl.innerText = '';

    if (!otpInput) { errorEl.innerText = 'กรุณากรอกรหัส OTP'; return; }
    if (otpInput.length !== 6) { errorEl.innerText = 'รหัส OTP ต้องมี 6 หลัก'; return; }

    otp.verify({
        userSendId: Number(currentUserId),
        userSendDepartmentId: Number(currentDepartmentId),
        bssMailSystemTypeCode: editFlowData.mailTypeCode,
        bssMailRefCode: editOtpRefCode,
        bssMailOtpCode: otpInput
    })
    .done(function () {
        submitEditHc();
    })
    .fail(function (err) {
        var msg = (err && err.message) ? err.message : 'ยืนยัน OTP ไม่สำเร็จ';
        errorEl.innerText = msg;
        errorEl.classList.add('show');
    });
}

function submitEditHc() {
    const source = editFlowData.source;
    const service = (source === 'machine')
        ? 'Reconcilation/EditMachineHc'
        : 'Reconcilation/EditPrepareHc';

    var idField;
    if (source === 'machine') {
        idField = { machineHdId: editFlowData.id };
    } else if (source === 'prepare') {
        idField = { prepareId: editFlowData.id };
    } else {
        // matching — edit the prepare side
        idField = { prepareId: editFlowData.item.prepareId || editFlowData.id };
    }

    $.requestAjax({
        service: service,
        type: 'PUT',
        parameter: Object.assign({}, idField, {
            headerCardCode: editFlowData.newHc,
            remark: editFlowData.remark
        }),
        enableLoader: true,
        onSuccess: function (res) {
            clearInterval(editOtpTimerInterval);
            if (res && res.data && res.data.isSuccess) {
                chainModal('editReviewModal', function () {
                    showSuccessModal('แก้ไข Header Card สำเร็จ');
                    // Refresh tables after success modal is closed
                    var successEl = document.getElementById('reconcileSuccessModal');
                    if (successEl) {
                        successEl.addEventListener('hidden.bs.modal', function onHidden() {
                            successEl.removeEventListener('hidden.bs.modal', onHidden);
                            refreshData();
                        });
                    }
                });
            } else {
                var msg = (res && res.data && res.data.message) ? res.data.message : 'แก้ไขไม่สำเร็จ';
                toastr.error(msg);
            }
        },
        onError: function () {
            toastr.error('แก้ไขไม่สำเร็จ');
        }
    });
}

// ============ Load Supervisors (RG02 Role Group) ============
async function loadSupervisors() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'MasterDropdown/GetMasterDropdownData',
            type: 'POST',
            parameter: {
                tableName: 'MasterUserSuperVisor',
                operator: 'AND',
                searchCondition: [{
                    columnName: 'MasterRoleGroup.RoleGroupCode',
                    filterOperator: 'EQUAL',
                    filterValue: 'RG02'
                }],
                pageNumber: 0,
                pageSize: 0,
                selectItemCount: 100
            },
            enableLoader: false,
            onSuccess: function (response) {
                if (response && response.is_success && response.data) {
                    supervisors = response.data || [];
                }
                resolve(response);
            },
            onError: function (err) {
                console.error('loadSupervisors error:', err);
                supervisors = [];
                resolve(); // don't block init
            }
        });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    });
}

// ============ Delete (Original — kept for non-mock mode) ============
function openDeleteModal_original(reconcileTranId) {
    selectedReconcileTranId = reconcileTranId;
    document.getElementById('deleteRemark').value = '';
    const modal = new bootstrap.Modal(document.getElementById('deleteReconcileModal'));
    modal.show();
}

function confirmDeleteReconcileTran() {
    const remark = document.getElementById('deleteRemark').value.trim();
    if (!remark) {
        showReconcileError('กรุณาระบุเหตุผล');
        return;
    }

    $.requestAjax({
        service: 'Reconcilation/DeleteReconcileTran',
        type: 'POST',
        parameter: {
            ReconcileTranId: selectedReconcileTranId,
            Remark: remark
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                bootstrap.Modal.getInstance(document.getElementById('deleteReconcileModal'))?.hide();
                showSuccessModal('ลบข้อมูลสำเร็จ');
                refreshData();
            } else {
                showReconcileError(response?.msg_desc || 'ลบไม่สำเร็จ');
            }
        },
        onError: function (err) {
            showReconcileError('เกิดข้อผิดพลาดในการลบ');
        }
    });
}

// ============ Delete Flow — Mock Popup (Figma nodes 2:42573→2:42697→OTP→Success→Print) ============
// Flow: Delete Confirm Table → Reconfirm → OTP Supervisor → OTP Manager → Success → Print Report
let deleteFlowData = null;

<<<<<<< HEAD
function openDeleteModal(reconcileTranId) {
    const item = findItemById(reconcileTranId);
    if (!item) return;

    selectedReconcileTranId = reconcileTranId;
    const isAlert = item.HasAlert || false;

    deleteFlowData = {
        reconcileTranId: reconcileTranId,
=======
function openDeleteModal(id, source) {
    const item = findItemById(id, source);
    if (!item) return;

    selectedReconcileTranId = id;
    const isAlert = item.HasAlert || item.hasAlert || false;

    deleteFlowData = {
        id: id,
        source: source,
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        item: item,
        isAlert: isAlert,
        deleteItems: getMockDeleteConfirmData(item, isAlert)
    };

    showDeleteConfirmTable();
}

function showDeleteConfirmTable() {
    const items = deleteFlowData.deleteItems;

    // Reset to step A
    setModalStep('deleteConfirmTableModal', 'deleteStepA');

<<<<<<< HEAD
    // Populate confirm table
=======
    // Reset checkbox state
    const checkAll = document.getElementById('deleteCheckAll');
    if (checkAll) checkAll.checked = false;
    hideInlineError('deleteCheckboxError');

    // Populate confirm table with checkboxes
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    const tbody = document.getElementById('deleteConfirmTableBody');
    tbody.innerHTML = items.map((row, idx) => {
        const denomClass = getDenomBadgeClass(row.denomPrice);
        return `<tr>
<<<<<<< HEAD
            <td>${idx + 1}</td>
=======
            <td><input type="checkbox" class="delete-row-check" data-idx="${idx}"></td>
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td>${row.headerCard}</td>
            <td><span class="${denomClass}">${row.denomPrice}</span></td>
            <td>${row.countingDate}</td>
            <td>${row.source}</td>
        </tr>`;
    }).join('');

<<<<<<< HEAD
    // Clear remark
    document.getElementById('deleteConfirmRemark').value = '';

=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmTableModal'));
    modal.show();
}

<<<<<<< HEAD
function confirmDeleteTable() {
    const remark = document.getElementById('deleteConfirmRemark').value.trim();
    if (!remark) {
        showInlineError('deleteConfirmRemarkError');
        return;
    }
    hideInlineError('deleteConfirmRemarkError');
    deleteFlowData.remark = remark;

    // Populate reconfirm table (same data, read-only)
    const items = deleteFlowData.deleteItems;
    const tbody = document.getElementById('deleteReconfirmTableBody');
    tbody.innerHTML = items.map((row, idx) => {
=======
function toggleDeleteCheckAll(el) {
    const checks = document.querySelectorAll('#deleteConfirmTableBody .delete-row-check');
    checks.forEach(cb => cb.checked = el.checked);
}

function confirmDeleteTable() {
    // Validate: at least one checkbox selected
    const checks = document.querySelectorAll('#deleteConfirmTableBody .delete-row-check:checked');
    if (checks.length === 0) {
        showInlineError('deleteCheckboxError');
        return;
    }
    hideInlineError('deleteCheckboxError');

    // Store selected indices
    deleteFlowData.selectedIndices = Array.from(checks).map(cb => Number(cb.dataset.idx));

    // Populate reconfirm table (only selected items, read-only)
    const items = deleteFlowData.deleteItems;
    const selected = deleteFlowData.selectedIndices.map(i => items[i]);
    const tbody = document.getElementById('deleteReconfirmTableBody');
    tbody.innerHTML = selected.map((row, idx) => {
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        const denomClass = getDenomBadgeClass(row.denomPrice);
        return `<tr>
            <td>${idx + 1}</td>
            <td>${row.headerCard}</td>
            <td><span class="${denomClass}">${row.denomPrice}</span></td>
            <td>${row.countingDate}</td>
            <td>${row.source}</td>
        </tr>`;
    }).join('');

<<<<<<< HEAD
=======
    // Populate supervisor dropdown (reuse loaded supervisors)
    const supervisorSelect = document.getElementById('deleteSupervisorSelect');
    supervisorSelect.innerHTML = '<option value="">-- เลือกผู้อนุมัติ --</option>';
    supervisors.forEach(s => {
        supervisorSelect.innerHTML += `<option value="${s.value}">${s.text}</option>`;
    });

    // Clear remark + errors
    document.getElementById('deleteConfirmRemark').value = '';
    hideInlineError('deleteSupervisorError');
    hideInlineError('deleteConfirmRemarkError');

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    // Move to reconfirm step
    setModalStep('deleteConfirmTableModal', 'deleteStepB');
}

function confirmDeleteReconfirm() {
<<<<<<< HEAD
    // Move to OTP Supervisor
    setModalStep('deleteConfirmTableModal', 'deleteStepC');
}

function confirmDeleteSupervisor() {
    // Mock: skip real OTP → move to Manager
    setModalStep('deleteConfirmTableModal', 'deleteStepD');
}

function confirmDeleteManager() {
    // Mock: close delete modal → wait for hidden → show success
=======
    // Validate supervisor
    const supervisorId = document.getElementById('deleteSupervisorSelect').value;
    if (!supervisorId) {
        showInlineError('deleteSupervisorError');
        return;
    }
    hideInlineError('deleteSupervisorError');

    // Validate remark
    const remark = document.getElementById('deleteConfirmRemark').value.trim();
    if (!remark) {
        showInlineError('deleteConfirmRemarkError');
        return;
    }
    hideInlineError('deleteConfirmRemarkError');

    deleteFlowData.supervisorId = Number(supervisorId);
    deleteFlowData.remark = remark;

    // Send mock OTP and move to Step C
    sendDeleteOtp();
}

function sendDeleteOtp() {
    // MOCK: generate fake refCode + start timer
    deleteOtpRefCode = 'DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('deleteOtpRefCode').innerText = deleteOtpRefCode;
    document.getElementById('deleteOtpInput').value = '';
    document.getElementById('deleteOtpInput').disabled = false;
    document.getElementById('deleteOtpError').innerText = '';
    document.getElementById('btnDeleteConfirmOtp').disabled = false;
    document.getElementById('btnDeleteResendOtp').style.display = 'none';

    // Start timer
    clearInterval(deleteOtpTimerInterval);
    deleteOtpCountdown = 300;
    runDeleteOtpTimer();

    setModalStep('deleteConfirmTableModal', 'deleteStepC');
    document.getElementById('deleteOtpInput').focus();
}

function runDeleteOtpTimer() {
    deleteOtpTimerInterval = setInterval(function () {
        deleteOtpCountdown--;
        var m = Math.floor(deleteOtpCountdown / 60);
        var s = deleteOtpCountdown % 60;
        if (s < 10) s = '0' + s;
        document.getElementById('deleteOtpTimer').innerText = 'ส่งอีกครั้งได้ใน ' + m + ':' + s;

        if (deleteOtpCountdown <= 0) {
            clearInterval(deleteOtpTimerInterval);
            document.getElementById('btnDeleteResendOtp').style.display = '';
            document.getElementById('deleteOtpTimer').innerText = '';
            document.getElementById('deleteOtpInput').value = '';
            document.getElementById('deleteOtpInput').disabled = true;
            document.getElementById('btnDeleteConfirmOtp').disabled = true;
            document.getElementById('deleteOtpRefCode').innerText = '-';
            document.getElementById('deleteOtpError').innerText = 'รหัส OTP หมดอายุแล้ว กรุณาส่งรหัสใหม่';
        }
    }, 1000);
}

function submitDeleteOtp() {
    const otpInput = document.getElementById('deleteOtpInput').value.trim();
    const errorEl = document.getElementById('deleteOtpError');
    errorEl.innerText = '';

    if (!otpInput) { errorEl.innerText = 'กรุณากรอกรหัส OTP'; return; }
    if (otpInput.length !== 6) { errorEl.innerText = 'รหัส OTP ต้องมี 6 หลัก'; return; }

    // MOCK: accept any 6-digit code → show success
    clearInterval(deleteOtpTimerInterval);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    chainModal('deleteConfirmTableModal', () => {
        showDeleteSuccessAndPrint();
    });
}

function showDeleteSuccessAndPrint() {
    document.getElementById('successMessage').textContent = 'ลบข้อมูลสำเร็จ';
    deleteFlowData.showPrintAfterSuccess = true;
    const successModal = new bootstrap.Modal(document.getElementById('reconcileSuccessModal'));
    successModal.show();
}

function showPrintReportModal() {
    const content = document.getElementById('reportPreviewContent');
    content.innerHTML = getMockPrintReportHtml();
    const modal = new bootstrap.Modal(document.getElementById('printReportModal'));
    modal.show();
}

<<<<<<< HEAD
=======
function closePrintAndGoBack() {
    bootstrap.Modal.getInstance(document.getElementById('printReportModal'))?.hide();
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function printReport() {
    window.print();
}

<<<<<<< HEAD
=======
// ============ Unlock Flow — Mock (Supervisor + OTP) ============
let unlockFlowData = null;
let unlockOtpRefCode = '';
let unlockOtpCountdown = 300;
let unlockOtpTimerInterval = null;

function openUnlockModal(id, source) {
    const item = findItemById(id, source);
    if (!item) return;

    unlockFlowData = { id: id, source: source, item: item };

    // Reset to step A
    setModalStep('unlockModal', 'unlockStepA');
    hideInlineError('unlockSupervisorError');

    // Populate supervisor dropdown
    const sel = document.getElementById('unlockSupervisorSelect');
    sel.innerHTML = '<option value="">-- เลือกผู้อนุมัติ --</option>';
    supervisors.forEach(s => {
        sel.innerHTML += `<option value="${s.value}">${s.text}</option>`;
    });

    const modal = new bootstrap.Modal(document.getElementById('unlockModal'));
    modal.show();
}

function sendUnlockOtp() {
    const supervisorId = document.getElementById('unlockSupervisorSelect').value;
    if (!supervisorId) {
        showInlineError('unlockSupervisorError');
        return;
    }
    hideInlineError('unlockSupervisorError');
    unlockFlowData.supervisorId = Number(supervisorId);

    // MOCK: generate fake refCode + start timer
    unlockOtpRefCode = 'UNL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('unlockOtpRefCode').innerText = unlockOtpRefCode;
    document.getElementById('unlockOtpInput').value = '';
    document.getElementById('unlockOtpInput').disabled = false;
    document.getElementById('unlockOtpError').innerText = '';
    document.getElementById('btnUnlockConfirmOtp').disabled = false;
    document.getElementById('btnUnlockResendOtp').style.display = 'none';

    clearInterval(unlockOtpTimerInterval);
    unlockOtpCountdown = 300;
    runUnlockOtpTimer();

    setModalStep('unlockModal', 'unlockStepB');
    document.getElementById('unlockOtpInput').focus();
}

function runUnlockOtpTimer() {
    unlockOtpTimerInterval = setInterval(function () {
        unlockOtpCountdown--;
        var m = Math.floor(unlockOtpCountdown / 60);
        var s = unlockOtpCountdown % 60;
        if (s < 10) s = '0' + s;
        document.getElementById('unlockOtpTimer').innerText = 'ส่งอีกครั้งได้ใน ' + m + ':' + s;

        if (unlockOtpCountdown <= 0) {
            clearInterval(unlockOtpTimerInterval);
            document.getElementById('btnUnlockResendOtp').style.display = '';
            document.getElementById('unlockOtpTimer').innerText = '';
            document.getElementById('unlockOtpInput').value = '';
            document.getElementById('unlockOtpInput').disabled = true;
            document.getElementById('btnUnlockConfirmOtp').disabled = true;
            document.getElementById('unlockOtpRefCode').innerText = '-';
            document.getElementById('unlockOtpError').innerText = 'รหัส OTP หมดอายุแล้ว กรุณาส่งรหัสใหม่';
        }
    }, 1000);
}

function submitUnlockOtp() {
    const otpInput = document.getElementById('unlockOtpInput').value.trim();
    const errorEl = document.getElementById('unlockOtpError');
    errorEl.innerText = '';

    if (!otpInput) { errorEl.innerText = 'กรุณากรอกรหัส OTP'; return; }
    if (otpInput.length !== 6) { errorEl.innerText = 'รหัส OTP ต้องมี 6 หลัก'; return; }

    // MOCK: accept any 6-digit code → show success
    clearInterval(unlockOtpTimerInterval);
    chainModal('unlockModal', () => {
        showSuccessModal('ปลดล็อคสำเร็จ');
    });
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Reconcile Detail ============
function showReconcileDetail(reconcileTranId) {
    $.requestAjax({
        service: `Reconcilation/GetReconcileDetail?reconcileTranId=${reconcileTranId}`,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success && response.data) {
                const data = response.data;
                document.getElementById('detailHeaderCard').textContent = data.HeaderCardCode || '-';

                const tbody = document.getElementById('detailTableBody');
                if (data.Denominations && data.Denominations.length > 0) {
                    tbody.innerHTML = data.Denominations.map((d, i) => `<tr>
                        <td>${i + 1}</td>
                        <td>${d.BnType || '-'}</td>
                        <td>${d.DenomSeries || '-'}</td>
                        <td>${d.Qty}</td>
                        <td>${numberWithCommas(d.TotalValue)}</td>
                        <td>${d.IsNormal ? '<i class="bi bi-check-lg text-success"></i>' : ''}</td>
                        <td>${d.IsAddOn ? '<i class="bi bi-check-lg text-primary"></i>' : ''}</td>
                        <td>${d.IsEndJam ? '<i class="bi bi-check-lg text-danger"></i>' : ''}</td>
                    </tr>`).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">ไม่มีข้อมูล</td></tr>';
                }

                document.getElementById('detailTotalQty').textContent = data.TotalQty || 0;
                document.getElementById('detailTotalValue').textContent = numberWithCommas(data.TotalValue || 0);

                const modal = new bootstrap.Modal(document.getElementById('reconcileDetailModal'));
                modal.show();
            } else {
                showReconcileError('ไม่สามารถโหลดรายละเอียดได้');
            }
        },
        onError: function (err) {
            showReconcileError('เกิดข้อผิดพลาดในการโหลดรายละเอียด');
        }
    });
}

<<<<<<< HEAD
// ============ Perform Reconcile ============
function performReconcile(reconcileTranId) {
    selectedReconcileTranId = reconcileTranId;
    // TODO: Implement reconcile action with OTP flow
    // For now, call the reconcile endpoint directly
    $.requestAjax({
        service: 'Reconcilation/Reconcile',
        type: 'POST',
        parameter: {
            ReconcileTranId: reconcileTranId
        },
=======
// ============ Perform Reconcile — Happy Case Modal Chain ============
let reconcileFlowData = null;
let reconcileOtpInterval = null;

function performReconcile(reconcileTranId) {
    selectedReconcileTranId = reconcileTranId;

    // Mock: always enter WARNING flow to demo the modal chain
    if (USE_MOCK_DATA) {
        reconcileFlowData = {
            reconcileTranId: reconcileTranId,
            rejectQty: 4, rejectValue: 4000,
            fakeQty: 1, fakeValue: 1000,
            replaceQty: 1, replaceValue: 1000,
            supervisorId: null,
            otpCode: null
        };
        // Show warning modal (Step 07)
        const modal = new bootstrap.Modal(document.getElementById('reconcileWarningModal'));
        modal.show();
        return;
    }

    // Real API path
    $.requestAjax({
        service: 'Reconcilation/Reconcile',
        type: 'POST',
        parameter: { ReconcileTranId: reconcileTranId },
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                showSuccessModal('กระทบยอดสำเร็จ');
                refreshData();
            } else if (response && response.msg_code === 'WARNING') {
<<<<<<< HEAD
                // Show warning modal
                document.getElementById('warningAlertMessage').textContent = response.msg_desc || 'พบความไม่ตรงกันของข้อมูล';
                const modal = new bootstrap.Modal(document.getElementById('warningAlertModal'));
=======
                reconcileFlowData = {
                    reconcileTranId: reconcileTranId,
                    rejectQty: response.data?.rejectQty || 0,
                    rejectValue: response.data?.rejectValue || 0,
                    fakeQty: response.data?.fakeQty || 0,
                    fakeValue: response.data?.fakeValue || 0,
                    replaceQty: response.data?.replaceQty || 0,
                    replaceValue: response.data?.replaceValue || 0,
                    supervisorId: null, otpCode: null
                };
                const modal = new bootstrap.Modal(document.getElementById('reconcileWarningModal'));
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                modal.show();
            } else {
                showReconcileError(response?.msg_desc || 'กระทบยอดไม่สำเร็จ');
            }
        },
        onError: function (err) {
            showReconcileError('เกิดข้อผิดพลาดในการกระทบยอด');
        }
    });
}

<<<<<<< HEAD
=======
// ============ Reconcile Flow — Warning OK → Reconfirm (Step 07 → 09) ============
document.addEventListener('DOMContentLoaded', function () {
    // Warning modal → OK → open Reconfirm
    const btnWarningOk = document.getElementById('btnWarningOk');
    if (btnWarningOk) {
        btnWarningOk.addEventListener('click', function () {
            chainModal('reconcileWarningModal', openReconfirmModal);
        });
    }

    // Reconfirm Step A → submit → Step B
    const btnSubmitReconfirm = document.getElementById('btnSubmitReconfirm');
    if (btnSubmitReconfirm) {
        btnSubmitReconfirm.addEventListener('click', submitReconfirmReconcile);
    }

    // Reconfirm Step B → confirm OTP → success
    const btnConfirmOtp = document.getElementById('btnConfirmOtp');
    if (btnConfirmOtp) {
        btnConfirmOtp.addEventListener('click', confirmReconcileOtp);
    }

    // Resend OTP button
    const btnResendOtp = document.getElementById('btnResendOtp');
    if (btnResendOtp) {
        btnResendOtp.addEventListener('click', resendReconcileOtp);
    }

    // Cleanup on modal close
    const reconfirmModal = document.getElementById('reconcileReconfirmModal');
    if (reconfirmModal) {
        reconfirmModal.addEventListener('hidden.bs.modal', clearReconcileFlow);
    }
});

function openReconfirmModal() {
    if (!reconcileFlowData) return;
    const d = reconcileFlowData;

    // Populate Step A data
    setText('reconfirmRejectQty', d.rejectQty);
    setText('reconfirmRejectValue', Number(d.rejectValue).toLocaleString());
    setText('reconfirmFakeQty', d.fakeQty);
    setText('reconfirmFakeValue', Number(d.fakeValue).toLocaleString());
    setText('reconfirmReplaceQty', d.replaceQty);
    setText('reconfirmReplaceValue', Number(d.replaceValue).toLocaleString());

    // Populate Step B data (same values)
    setText('reconfirmRejectQty2', d.rejectQty);
    setText('reconfirmRejectValue2', Number(d.rejectValue).toLocaleString());
    setText('reconfirmFakeQty2', d.fakeQty);
    setText('reconfirmFakeValue2', Number(d.fakeValue).toLocaleString());
    setText('reconfirmReplaceQty2', d.replaceQty);
    setText('reconfirmReplaceValue2', Number(d.replaceValue).toLocaleString());

    // Reset state
    document.getElementById('reconcileSupervisorSelect').value = '';
    hideInlineError('supervisorError');
    setModalStep('reconcileReconfirmModal', 'reconfirmStepA');

    const modal = new bootstrap.Modal(document.getElementById('reconcileReconfirmModal'));
    modal.show();
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Step A → Step B
function submitReconfirmReconcile() {
    const supervisorId = document.getElementById('reconcileSupervisorSelect').value;
    if (!supervisorId) {
        showInlineError('supervisorError');
        return;
    }
    hideInlineError('supervisorError');
    reconcileFlowData.supervisorId = supervisorId;

    // Switch to OTP step
    setModalStep('reconcileReconfirmModal', 'reconfirmStepB');
    document.getElementById('reconcileOtpInput').value = '';
    hideInlineError('otpError');
    startReconcileOtpCountdown();
}

// OTP Countdown (4:59)
function startReconcileOtpCountdown() {
    clearInterval(reconcileOtpInterval);
    let seconds = 299; // 4:59
    const btn = document.getElementById('btnResendOtp');
    const countdownEl = document.getElementById('otpCountdown');
    const timerText = document.getElementById('otpTimerText');

    btn.disabled = true;
    btn.style.opacity = '0.3';
    timerText.style.display = '';

    reconcileOtpInterval = setInterval(function () {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        countdownEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        seconds--;
        if (seconds < 0) {
            clearInterval(reconcileOtpInterval);
            btn.disabled = false;
            btn.style.opacity = '1';
            timerText.style.display = 'none';
        }
    }, 1000);
}

function resendReconcileOtp() {
    startReconcileOtpCountdown();
}

// Confirm OTP → Success
function confirmReconcileOtp() {
    const otp = document.getElementById('reconcileOtpInput').value.trim();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        showInlineError('otpError');
        return;
    }
    hideInlineError('otpError');
    reconcileFlowData.otpCode = otp;

    if (USE_MOCK_DATA) {
        // Mock: close reconfirm → show success → redirect
        chainModal('reconcileReconfirmModal', function () {
            showSuccessModal('กระทบยอดสำเร็จ');
            // After success modal closes → redirect to p01
            const successEl = document.getElementById('reconcileSuccessModal');
            if (successEl) {
                successEl.addEventListener('hidden.bs.modal', function onSuccessHidden() {
                    successEl.removeEventListener('hidden.bs.modal', onSuccessHidden);
                    window.location.href = '/BSS_WEB/Reconcilation/ReconcileTransaction';
                });
            }
        });
        return;
    }

    // Real API call
    $.requestAjax({
        service: 'Reconcilation/ReconsileAction',
        type: 'POST',
        parameter: {
            ReconcileTranId: reconcileFlowData.reconcileTranId,
            SupervisorId: reconcileFlowData.supervisorId,
            OtpCode: otp
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                chainModal('reconcileReconfirmModal', function () {
                    showSuccessModal('กระทบยอดสำเร็จ');
                });
            } else {
                showInlineError('otpError');
            }
        },
        onError: function () {
            showInlineError('otpError');
        }
    });
}

function clearReconcileFlow() {
    clearInterval(reconcileOtpInterval);
    reconcileOtpInterval = null;
    reconcileFlowData = null;
    setModalStep('reconcileReconfirmModal', 'reconfirmStepA');
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Cancel Reconcile ============
function cancelReconcile(reconcileTranId) {
    selectedReconcileTranId = reconcileTranId;
    // TODO: Implement cancel with OTP flow
}

<<<<<<< HEAD
// ============ OTP Flow (placeholder) ============
function sendReconcileOtp() {
    // TODO: Implement OTP sending
}

function submitReconcileOtp() {
    // TODO: Implement OTP verification
}

=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Manual Key-in ============
function proceedManualKeyIn() {
    bootstrap.Modal.getInstance(document.getElementById('warningAlertModal'))?.hide();
    // TODO: Implement manual key-in flow
}

// ============ Navigation ============
function openSecondScreen() {
<<<<<<< HEAD
    // TODO: Implement second screen
=======
    // MOCK: open current page in new window as "second screen"
    window.open(window.location.href, '_blank', 'width=1920,height=1080');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function openHoldingPage() {
    window.location.href = '/Reconcilation/Holding';
}

function openHoldingDetailPage() {
    window.location.href = '/Holding/Detail';
    closeNavDropdown();
}

function openDefaultSettings() {
    // TODO: Navigate to default settings page
    closeNavDropdown();
}

// ============ Nav Dropdown ============
function toggleNavDropdown(e) {
    e.stopPropagation();
    const wrap = document.querySelector('.nav-dropdown-wrap');
    if (!wrap) return;
    wrap.classList.toggle('open');

    // Position the fixed dropdown below the trigger button
    if (wrap.classList.contains('open')) {
        const btn = document.getElementById('btnNavDropdown');
        const menu = document.getElementById('navDropdownMenu');
        if (btn && menu) {
            const rect = btn.getBoundingClientRect();
            menu.style.top = (rect.bottom + 4) + 'px';
            menu.style.right = (window.innerWidth - rect.right) + 'px';
            menu.style.left = 'auto';
        }
    }
}

function closeNavDropdown() {
    const wrap = document.querySelector('.nav-dropdown-wrap');
    if (wrap) wrap.classList.remove('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    const wrap = document.querySelector('.nav-dropdown-wrap');
    if (wrap && !wrap.contains(e.target)) {
        wrap.classList.remove('open');
    }
});

// ============ Modals ============
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message || 'ดำเนินการสำเร็จ';
    const modal = new bootstrap.Modal(document.getElementById('reconcileSuccessModal'));
    modal.show();
}

function showReconcileError(message) {
<<<<<<< HEAD
    document.getElementById('reconcileErrorMessage').textContent = message || 'เกิดข้อผิดพลาด';
    const modal = new bootstrap.Modal(document.getElementById('reconcileErrorModal'));
=======
    var icon = document.getElementById('reconcileErrorIcon');
    icon.className = 'bi bi-exclamation-circle';
    icon.style.color = '#dc3545';
    document.getElementById('reconcileErrorTitle').textContent = 'การแจ้งเตือน';
    document.getElementById('reconcileErrorMessage').textContent = message || 'เกิดข้อผิดพลาด';
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconcileErrorModal'));
    modal.show();
}

function showReconcileWarning(message) {
    var icon = document.getElementById('reconcileErrorIcon');
    icon.className = 'bi bi-exclamation-diamond-fill';
    icon.style.color = '';
    document.getElementById('reconcileErrorTitle').textContent = 'การแจ้งเตือน';
    document.getElementById('reconcileErrorMessage').textContent = message || 'เกิดข้อผิดพลาด';
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reconcileErrorModal'));
    modal.show();
}

// Show refresh file errors one-by-one using the same error modal
var refreshErrorQueue = [];

function showRefreshErrors(errors) {
    refreshErrorQueue = errors.slice();
    showNextRefreshError();
}

function showNextRefreshError() {
    if (refreshErrorQueue.length === 0) return;
    var err = refreshErrorQueue.shift();
    var icon = document.getElementById('reconcileErrorIcon');
    icon.className = 'bi bi-exclamation-circle';
    icon.style.color = '#dc3545';
    document.getElementById('reconcileErrorTitle').textContent = 'ไฟล์ ' + err.fileName;
    document.getElementById('reconcileErrorMessage').textContent = 'พบปัญหาในข้อมูลจากเครื่องจักร กรุณาแจ้งผู้ดูแลระบบ';
    var modalEl = document.getElementById('reconcileErrorModal');
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalEl.addEventListener('hidden.bs.modal', function handler() {
        modalEl.removeEventListener('hidden.bs.modal', handler);
        showNextRefreshError();
    });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    modal.show();
}

function closeAllReconcileModals() {
    // Check if we need print report BEFORE closing
    const needPrint = deleteFlowData && deleteFlowData.showPrintAfterSuccess;
    if (needPrint) deleteFlowData.showPrintAfterSuccess = false;

    // Close all modals
    const allModalIds = [
        'editReconcileModal', 'reconcileDetailModal', 'otpReconcileModal', 'reconcileSuccessModal',
        'deleteReconcileModal', 'warningAlertModal', 'reconcileErrorModal',
        'editFormModal', 'editAlertFormModal', 'editReviewModal',
<<<<<<< HEAD
        'deleteConfirmTableModal', 'printReportModal'
=======
        'deleteConfirmTableModal', 'printReportModal', 'unlockModal',
        'reconcileWarningModal', 'reconcileReconfirmModal'
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    ];
    allModalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) bootstrap.Modal.getInstance(el)?.hide();
    });

    // Chain: after success modal fully hidden → show print report
    if (needPrint) {
        const successEl = document.getElementById('reconcileSuccessModal');
        if (successEl) {
            successEl.addEventListener('hidden.bs.modal', function onHidden() {
                successEl.removeEventListener('hidden.bs.modal', onHidden);
                showPrintReportModal();
            });
        }
    }
}

// ============ Utilities ============
function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear() + 543;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hh}:${mm}`;
}

function numberWithCommas(x) {
    if (x == null) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============ Sort ============
function setupSortHandlers() {
    // Use event delegation on document — catches clicks on th.th-sort or any child (like <i> icon)
    document.addEventListener('click', function (e) {
        const th = e.target.closest('.th-sort');
        if (!th) return;

        const field = th.dataset.sort;
        if (!field) return;

        // Determine which table this th belongs to
        const table = th.closest('table');
        if (!table) return;

        let tableName;
        if (table.classList.contains('reconcile-table-left')) tableName = 'prep';
        else if (table.classList.contains('reconcile-table-center')) tableName = 'machine';
        else if (table.classList.contains('reconcile-table-right')) tableName = 'hc';
        else return;

        toggleSort(tableName, field);
        applySortAndRender(tableName);
    });
}

function toggleSort(table, field) {
    const state = sortStates[table];
    if (state.field === field) {
        state.direction = state.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.field = field;
        state.direction = 'asc';
    }
    updateSortIcons(table);
}

function updateSortIcons(table) {
    const tableClass = table === 'prep' ? '.reconcile-table-left'
        : table === 'machine' ? '.reconcile-table-center'
        : '.reconcile-table-right';

    // Reset all icons in this table
    document.querySelectorAll(`${tableClass} .th-sort .sort-icon`).forEach(icon => {
        icon.className = 'bi bi-chevron-expand sort-icon';
    });

    // Set active icon
    const state = sortStates[table];
    if (state.field) {
        const activeTh = document.querySelector(`${tableClass} .th-sort[data-sort="${state.field}"]`);
        if (activeTh) {
            const icon = activeTh.querySelector('.sort-icon');
            if (icon) {
                icon.className = state.direction === 'asc'
                    ? 'bi bi-chevron-up sort-icon'
                    : 'bi bi-chevron-down sort-icon';
            }
        }
    }
}

function applySortAndRender(table) {
    const state = sortStates[table];
    if (!state.field) return;

    const sortFn = getSortFunction(state.field, state.direction);

    if (table === 'prep') {
        prepTableItems.sort(sortFn);
        renderPrepTable(prepTableItems);
    } else if (table === 'machine') {
        machineTableItems.sort(sortFn);
        renderMachineTable(machineTableItems);
    } else if (table === 'hc') {
        machineHcTableItems.sort(sortFn);
        renderMachineHcTable(machineHcTableItems);
    }
}

function getSortFunction(field, direction) {
    return (a, b) => {
        let valA, valB;
        switch (field) {
            case 'headerCard':
                valA = a.HeaderCardCode || '';
                valB = b.HeaderCardCode || '';
                break;
            case 'datetime':
            case 'prepDate':
                valA = a.PrepareDate || '';
                valB = b.PrepareDate || '';
                break;
            case 'createdDate':
                valA = a.CreatedDate || '';
                valB = b.CreatedDate || '';
                break;
            case 'denom':
                valA = parseInt(a.DenominationPrice) || 0;
                valB = parseInt(b.DenominationPrice) || 0;
                return direction === 'asc' ? valA - valB : valB - valA;
            default:
                return 0;
        }
        const cmp = valA.localeCompare(valB);
        return direction === 'asc' ? cmp : -cmp;
    };
}

// ============ Alert Tooltip ============
function bindAlertTooltips(container) {
    const tooltip = document.getElementById('alertTooltip');
    if (!tooltip || !container) return;

    const cells = container.querySelectorAll('td.td-hc-alert[data-alert-msg]');
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', function (e) {
            const msg = this.getAttribute('data-alert-msg');
            if (!msg) return;

            const msgEl = document.getElementById('alertTooltipMessage');
            if (msgEl) msgEl.textContent = msg;

            // Position tooltip ABOVE the cell
            const rect = this.getBoundingClientRect();
            const tooltipWidth = 285;
            tooltip.style.visibility = 'hidden';
            tooltip.style.display = 'block';
            const tooltipHeight = tooltip.offsetHeight;
            tooltip.style.display = '';
            tooltip.style.visibility = '';

            let left = rect.left;
            let top = rect.top - tooltipHeight - 4;

            // If not enough space above, show below
            if (top < 8) {
                top = rect.bottom + 4;
            }

            // Keep tooltip within viewport horizontally
            if (left + tooltipWidth > window.innerWidth) {
                left = window.innerWidth - tooltipWidth - 8;
            }
            if (left < 8) left = 8;

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.position = 'fixed';
            tooltip.classList.add('show');
        });

        cell.addEventListener('mouseleave', function () {
            tooltip.classList.remove('show');
        });
    });
}

// ============ Modal Step Management ============
function setModalStep(modalId, stepId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.querySelectorAll('.modal-step').forEach(step => step.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
}

// Chain: close current modal, wait for fully hidden, then run callback (open next modal)
// This avoids Bootstrap 5 stacked modal z-index issues
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

// Inline validation: show/hide error messages inside popups (no 2nd modal stacking)
function showInlineError(errorId) {
    const el = document.getElementById(errorId);
    if (el) el.classList.add('show');
}

function hideInlineError(errorId) {
    const el = document.getElementById(errorId);
    if (el) el.classList.remove('show');
}

<<<<<<< HEAD
// ============ Mock Data Generators — Edit Flow ============
function getMockEditReviewData(item, newHc, isAlert, newHc2) {
    const rows = [];
    rows.push({
        oldHc: item.HeaderCardCode || '0054941206',
        newHc: newHc || '0054941209',
        denomPrice: item.DenominationPrice || 100,
        containerBarcode: 'BK' + String(12345 + item.ReconcileTranId).slice(-5),
        preparer: currentUserFullName || 'นายทดสอบ ระบบ',
        source: item.MachineHdId > 0 ? 'Machine' : 'Prepare',
        hasWarning: item.HasAlert || false
    });

    if (isAlert && newHc2) {
        // Alert case: 2 header cards in bundle
        const mockHc2 = String(parseInt(item.HeaderCardCode) + 1).padStart(10, '0');
        rows.push({
            oldHc: mockHc2,
            newHc: newHc2,
            denomPrice: item.DenominationPrice || 100,
            containerBarcode: 'BK' + String(12346 + item.ReconcileTranId).slice(-5),
            preparer: currentUserFullName || 'นายทดสอบ ระบบ',
            source: 'Machine',
            hasWarning: true
        });
    }

    return rows;
}
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// ============ Mock Data Generators — Delete Flow ============
function getMockDeleteConfirmData(item, isAlert) {
    const rows = [];
    rows.push({
        headerCard: item.HeaderCardCode || '0054941230',
        denomPrice: item.DenominationPrice || 100,
        countingDate: formatDateTime(item.CreatedDate || item.PrepareDate),
        source: item.MachineHdId > 0 ? 'Machine' : 'Prepare'
    });

    if (isAlert) {
        // Alert case: 2 header cards in bundle
        const mockHc2 = String(parseInt(item.HeaderCardCode) + 1).padStart(10, '0');
        rows.push({
            headerCard: mockHc2,
            denomPrice: item.DenominationPrice || 100,
            countingDate: formatDateTime(item.CreatedDate || item.PrepareDate),
            source: 'Machine'
        });
    }

    return rows;
}

// ============ Mock Data — Print Report ============
function getMockPrintReportHtml() {
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear() + 543}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const item = deleteFlowData?.item;
    const hc = item?.HeaderCardCode || '0054941230';
    const denom = item?.DenominationPrice || 100;

    return `
        <table class="report-mock-table">
            <tr><td colspan="8" class="report-header-text">Cancel Reconcile Report</td></tr>
            <tr><td colspan="8" class="report-subheader-text">
                <strong>Branch:</strong> กรุงเทพฯ &nbsp;&nbsp;
                <strong>Machine:</strong> M7-1 &nbsp;&nbsp;
                <strong>Date:</strong> ${dateStr} ${timeStr} &nbsp;&nbsp;
                <strong>Header Card:</strong> ${hc}
            </td></tr>
            <tr>
                <th>รายการ</th>
                <th>Header Card</th>
                <th>ชนิดราคา</th>
                <th>จำนวน (มัด)</th>
                <th>จำนวน (ฉบับ)</th>
                <th>มูลค่า</th>
                <th>ผู้ดำเนินการ</th>
                <th>เหตุผล</th>
            </tr>
            <tr>
                <td>1</td>
                <td style="text-align:center">${hc}</td>
                <td style="text-align:center">${denom}</td>
                <td>1</td>
                <td>${numberWithCommas(997)}</td>
                <td>${numberWithCommas(997 * denom)}</td>
                <td style="text-align:left">${currentUserFullName || 'นายทดสอบ ระบบ'}</td>
                <td style="text-align:left">${deleteFlowData?.remark || 'ลบข้อมูลเนื่องจากข้อมูลผิดพลาด'}</td>
            </tr>
            <tr style="font-weight:500; background:#e9ecef">
                <td colspan="3" style="text-align:left"><strong>รวม</strong></td>
                <td><strong>1</strong></td>
                <td><strong>${numberWithCommas(997)}</strong></td>
                <td><strong>${numberWithCommas(997 * denom)}</strong></td>
                <td colspan="2"></td>
            </tr>
        </table>
        <div style="margin-top:24px; text-align:center; color:#6c757d; font-size:12px">
            <p style="margin:0">Printed: ${dateStr} ${timeStr}</p>
            <p style="margin:4px 0 0 0">Supervisor: Mock Supervisor &nbsp; | &nbsp; Manager: Mock Manager</p>
        </div>
    `;
}

// ============ Shift Filter (reserved for future use) ============
