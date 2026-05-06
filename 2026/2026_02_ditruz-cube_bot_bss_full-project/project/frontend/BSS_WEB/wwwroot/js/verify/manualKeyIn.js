/* ============================================
   Manual Key-in — Edit & Manual Key-in JS
   Built from Figma screens 1.0–1.7
   ============================================ */

// ============ State ============
let resultsData = [];
let editingIndex = -1;
let selectedIndex = -1;
let sortColumn = '';
let sortDirection = ''; // 'asc' | 'desc' | ''
let otpTimer = null;
let pendingEditQty = 0;
let isLoadingHC = false;

const USE_MOCK_DATA = false;

// API state — populated from GetHeaderCardInfo response
let currentPrepareId = 0;
let currentHeaderCardCode = '';
let currentDepartmentId = 0;
let currentMachineHdId = 0;
let currentShiftId = 0;
let currentSorterId = null;
let currentTranId = 0; // populated after Save

const currentUserId = parseInt(document.getElementById('currentUserId')?.value) || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || '';

// ============ Init ============
document.addEventListener("DOMContentLoaded", () => {
    initPage();
});

function initPage() {
    if (USE_MOCK_DATA) {
        loadMockData();
    } else {
        loadSupervisorListFromAPI();
        loadSeriesListFromAPI();

        // Attach HC input listener once
        const hcInput = document.getElementById('headerCardInput');
        if (hcInput) {
            hcInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const code = hcInput.value.trim();
                    if (!code) { showError('กรุณากรอกรหัส Header Card'); return; }
                    loadHeaderCardFromAPI(code);
                }
            });
        }

        const params = new URLSearchParams(window.location.search);
        const hcCode = params.get('headerCardCode') || params.get('hc') || '';
        if (hcCode) {
            loadHeaderCardFromAPI(hcCode);
        } else {
            showHeaderCardInput();
            renderResultsTable();
        }
    }
    // Block invalid keys on qty inputs (e, E, +, -, .)
    document.querySelectorAll('#inputQty, #editQty').forEach(function (el) {
        el.addEventListener('keydown', function (e) {
            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
            }
        });
        el.addEventListener('paste', function (e) {
            var text = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(text)) e.preventDefault();
        });
    });

    fixProfileSection();
    startRealtimeClock();
}

function loadHeaderCardFromAPI(code) {
    if (isLoadingHC) return;
    isLoadingHC = true;
    currentTranId = 0; // Reset stale transaction

    $.enablePageLoader();
    $.ajax({
        url: rootPath + 'Verify/ManualKeyInGetHeaderCardInfo',
        type: 'GET',
        data: { headerCardCode: code },
        dataType: 'json',
        success: function (response) {
            $.disablePageLoader();
            isLoadingHC = false;
            if (!response || !response.is_success) {
                showError(response?.msg_desc || 'ไม่พบข้อมูล Header Card');
                return;
            }
            const d = response.data;
            if (!d) {
                showError('ไม่พบข้อมูล Header Card');
                return;
            }

            // Clear old data before populating new
            resultsData = [];
            selectedIndex = -1;

            // Store state (API returns camelCase via System.Text.Json)
            currentPrepareId = d.prepareId || 0;
            currentHeaderCardCode = d.headerCardCode || code;
            currentDepartmentId = d.departmentId || 0;
            currentMachineHdId = d.machineHdId || 0;
            currentShiftId = d.shiftId || 0;
            currentSorterId = d.sorterId || null;

            // Update UI — switch from input to badge
            hideHeaderCardInput();
            const badgeEl = document.getElementById('headerCardCode');
            if (badgeEl) {
                badgeEl.textContent = currentHeaderCardCode;
            }

            setTextById('infoBarcodePack', d.barcodePack || '-');
            setTextById('infoBarcodeBundle', d.barcodeBundle || '-');
            setTextById('infoBank', d.bankName || '-');
            setTextById('infoCashpoint', d.cashpointName || '-');
            setTextById('infoPrepareDate', formatDateTime(d.prepareDate));
            setTextById('infoCountDate', formatDateTime(d.countDate));
            setTextById('infoPrepare', d.prepareName || '-');
            setTextById('infoSorter', d.sorterName || '-');
            setTextById('infoReconcile', d.reconcileName || '-');
            setTextById('infoSupervisor', d.supervisorName || '-');

            // Load existing denominations
            if (currentPrepareId > 0) {
                loadDenominationsFromAPI(currentPrepareId);
            }
        },
        error: function () {
            $.disablePageLoader();
            isLoadingHC = false;
            showError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    });
}

// ============ Header Card Input Mode ============

function showHeaderCardInput() {
    const inputEl = document.getElementById('headerCardInput');
    const badgeEl = document.getElementById('headerCardCode');
    if (inputEl) { inputEl.style.display = ''; inputEl.focus(); }
    if (badgeEl) badgeEl.style.display = 'none';
}

function hideHeaderCardInput() {
    const inputEl = document.getElementById('headerCardInput');
    const badgeEl = document.getElementById('headerCardCode');
    if (inputEl) inputEl.style.display = 'none';
    if (badgeEl) badgeEl.style.display = '';
}

function loadDenominationsFromAPI(prepareId) {
    $.ajax({
        url: rootPath + 'Verify/ManualKeyInGetDenominations',
        type: 'GET',
        data: { prepareId: prepareId },
        dataType: 'json',
        success: function (response) {
            if (response && response.is_success && response.data) {
                const items = response.data.items || [];
                resultsData = items.map(function (item) {
                    return {
                        Denom: item.denom || 0,
                        Type: item.type || '',
                        Series: item.series || '',
                        BeforeQty: item.beforeQty || 0,
                        AfterQty: item.afterQty || 0,
                        IsChanged: false
                    };
                });
            } else {
                resultsData = [];
            }
            renderResultsTable();
        },
        error: function () {
            resultsData = [];
            renderResultsTable();
        }
    });
}

// ============ Load Supervisor (Manager) Dropdown ============

async function loadSupervisorListFromAPI() {
    const items = await loadMasterDropdown({
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
    });
    renderDropdown({
        selectId: 'reviewManager',
        items,
        includeEmpty: true,
        emptyText: '-- เลือก --'
    });
}

// ============ Load Series Dropdown ============

function loadSeriesListFromAPI() {
    $.ajax({
        url: rootPath + 'Verify/ManualKeyInGetSeriesList',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response && response.is_success && response.data) {
                const selectEl = document.getElementById('selectSeries');
                if (!selectEl) return;
                // Keep the placeholder option
                selectEl.innerHTML = '<option value="">-- เลือก --</option>';
                const items = response.data.filter(function (item) {
                    return item.isActive !== false;
                });
                items.forEach(function (item) {
                    const opt = document.createElement('option');
                    opt.value = item.seriesDenomId || item.seriesCode || '';
                    opt.textContent = item.seriesCode || item.serieDescrpt || '';
                    selectEl.appendChild(opt);
                });
            }
        },
        error: function () {
            // silently fail — dropdown keeps placeholder
        }
    });
}

// ============ Realtime Clock (Figma node 2:47495) ============

function startRealtimeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear() + 543; // Buddhist Era
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setTextById('headerCardDate', `${day}/${month}/${year} ${hh}:${mm}:${ss}`);
}

// ============ Fix Profile Section (Figma nodes 2:47433 + 2:47437) ============

function fixProfileSection() {
    // Fix avatar: replace bi-person-circle with peach circle + bi-person-fill
    const avatarIcon = document.querySelector('#dropdownUser #linkUser i.bi-person-circle');
    if (avatarIcon) {
        const avatarWrapper = document.createElement('span');
        avatarWrapper.className = 'mk-avatar-circle';
        avatarWrapper.innerHTML = '<i class="bi bi-person-fill"></i>';
        avatarIcon.replaceWith(avatarWrapper);
    }

    // Fix profile text: add mk-profile-text class for CSS targeting
    const profileDiv = document.querySelector('.bot-navbar .d-flex.align-items-center > div:first-child');
    if (profileDiv) {
        profileDiv.classList.add('mk-profile-text');
    }
}

// ============ Mock Data (kept for development) ============

function loadMockData() {
    const hcInfo = {
        HeaderCardCode: '0054941520', Date: '21/7/2568 16:26',
        BarcodePack: '-', BarcodeBundle: '-', Bank: 'BBL',
        Cashpoint: 'ธ.กรุงเทพ สีลม', PrepareDate: '21/7/2568 14:00',
        CountDate: '21/7/2568 14:00', Prepare: 'วิไล บัวงาม',
        Sorter: 'ประภาส ช่างงาม', Reconcile: 'อาภา เรืองรอง',
        Supervisor: 'ใช้ลป คงทองดี'
    };
    setTextById('headerCardCode', hcInfo.HeaderCardCode);
    document.getElementById('headerCardCode').style.display = '';
    setTextById('infoBarcodePack', hcInfo.BarcodePack);
    setTextById('infoBarcodeBundle', hcInfo.BarcodeBundle);
    setTextById('infoBank', hcInfo.Bank);
    setTextById('infoCashpoint', hcInfo.Cashpoint);
    setTextById('infoPrepareDate', hcInfo.PrepareDate);
    setTextById('infoCountDate', hcInfo.CountDate);
    setTextById('infoPrepare', hcInfo.Prepare);
    setTextById('infoSorter', hcInfo.Sorter);
    setTextById('infoReconcile', hcInfo.Reconcile);
    setTextById('infoSupervisor', hcInfo.Supervisor);

    resultsData = [
        { Denom: 1000, Type: 'ดี', Series: '17', BeforeQty: 5, AfterQty: 0, IsChanged: false },
        { Denom: 1000, Type: 'เสีย', Series: '17', BeforeQty: 993, AfterQty: 0, IsChanged: false },
        { Denom: 1000, Type: 'Reject', Series: '17', BeforeQty: 1, AfterQty: 0, IsChanged: false }
    ];
    renderResultsTable();
}

// ============ Radio Selection ============

function selectRadio(el) {
    const group = el.closest('.mk-radio-options');
    group.querySelectorAll('.mk-radio-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    renderResultsTable();
}

function selectDenom(el) {
    const group = el.closest('.mk-denom-options');
    group.querySelectorAll('.mk-denom-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    renderResultsTable();
}

function getActiveRadioValue(groupId) {
    const group = document.getElementById(groupId);
    const active = group?.querySelector('.active');
    return active?.dataset.value || '';
}

// ============ Add Counting Result ============

function addCountingResult() {
    const bnType = getActiveRadioValue('radiobnType');
    const denom = parseInt(getActiveRadioValue('radioDenom')) || 0;
    const series = document.getElementById('selectSeries')?.value || '';
    const qtyEl = document.getElementById('inputQty');
    const qty = parseInt(qtyEl?.value) || 0;

    if (!bnType || !denom || !series) {
        showError('กรุณาเลือกประเภทธนบัตร ชนิดราคา และแบบ');
        return;
    }
    if (qty <= 0 || !Number.isInteger(qty)) {
        showError('กรุณากรอกจำนวนเป็นตัวเลขจำนวนเต็ม');
        return;
    }
    if (qty > 1000) {
        showError('จำนวนต้องไม่เกิน 1,000');
        return;
    }

    // Clear input immediately to prevent double-click adding qty twice
    if (qtyEl) qtyEl.value = '';

    // Check if row already exists
    const existingIdx = resultsData.findIndex(r =>
        r.Denom === denom && r.Type === bnType && r.Series === series
    );

    if (existingIdx >= 0) {
        resultsData[existingIdx].AfterQty += qty;
        resultsData[existingIdx].IsChanged = true;
    } else {
        resultsData.push({
            Denom: denom,
            Type: bnType,
            Series: series,
            BeforeQty: 0,
            AfterQty: qty,
            IsChanged: true
        });
    }

    renderResultsTable();
}

// ============ Render Results Table ============

function renderResultsTable() {
    const body = document.getElementById('resultsTableBody');
    if (!body) return;

    let html = resultsData.map((row, idx) => {
        const denomSafe = parseInt(row.Denom) || 0;
        return `
        <div class="mk-table-row${selectedIndex === idx ? ' selected' : ''}" onclick="selectRow(${idx})">
            <div class="mk-cell">
                <span class="qty-badge qty-${denomSafe}">${denomSafe}</span>
            </div>
            <div class="mk-cell">${escapeHtml(row.Type)}</div>
            <div class="mk-cell">${escapeHtml(row.Series)}</div>
            <div class="mk-cell cell-number">${numberWithCommas(row.BeforeQty)}</div>
            <div class="mk-cell cell-number ${row.IsChanged ? 'mk-cell-changed' : ''}">${row.IsChanged ? numberWithCommas(row.AfterQty) : ''}</div>
            <div class="mk-cell cell-center">
                <div class="mk-action-buttons">
                    <button class="mk-btn-action" onclick="event.stopPropagation(); openEditItem(${idx})" title="แก้ไข">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="mk-btn-action" onclick="event.stopPropagation(); deleteItem(${idx})" title="ลบ">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    // Fill remaining space with empty rows to maintain table stripe pattern
    const MIN_ROWS = 9;
    if (resultsData.length < MIN_ROWS) {
        html += emptyRows(MIN_ROWS - resultsData.length);
    }

    body.innerHTML = html;
    updateCounts();
}

function emptyRows(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += '<div class="mk-table-row mk-empty-row"></div>';
    }
    return html;
}

function updateCounts() {
    const totalBefore = resultsData.reduce((sum, r) => sum + r.BeforeQty, 0);
    // จำนวนหลัง = ก่อนปรับทั้งหมด + ส่วนต่างที่เพิ่มจากหลังปรับ
    const totalAfter = resultsData.reduce((sum, r) => {
        if (r.IsChanged) {
            return sum + (r.AfterQty - r.BeforeQty);
        }
        return sum;
    }, 0);
    setTextById('countBefore', numberWithCommas(totalBefore));
    setTextById('countAfter', numberWithCommas(totalBefore + totalAfter));
}

// ============ Row Selection ============
function selectRow(idx) {
    selectedIndex = (selectedIndex === idx) ? -1 : idx;
    // Update DOM directly without full re-render
    document.querySelectorAll('#resultsTableBody .mk-table-row').forEach((row, i) => {
        row.classList.toggle('selected', i === selectedIndex);
    });
}

// ============ Edit Item (Modal 1.1) ============

function openEditItem(index) {
    if (index < 0 || index >= resultsData.length) return;
    editingIndex = index;
    const row = resultsData[index];
    const hcCode = document.getElementById('headerCardCode')?.textContent || '-';

    setTextById('editHc', hcCode);
    const denomEl = document.getElementById('editDenom');
    if (denomEl) {
        const cls = getDenomBadgeClass(row.Denom);
        denomEl.innerHTML = `<span class="${cls}">${row.Denom}</span>`;
    }
    setTextById('editType', row.Type);
    setTextById('editSeries', row.Series);
    document.getElementById('editQty').value = row.IsChanged ? row.AfterQty : row.BeforeQty;

    const modal = new bootstrap.Modal(document.getElementById('editItemModal'));
    modal.show();
}

function cancelEditItem() {
    editingIndex = -1;
    bootstrap.Modal.getInstance(document.getElementById('editItemModal'))?.hide();
}

function submitEditItem() {
    pendingEditQty = parseInt(document.getElementById('editQty')?.value) || 0;
    if (pendingEditQty < 0 || !Number.isInteger(pendingEditQty)) {
        showError('กรุณากรอกจำนวนเป็นตัวเลขจำนวนเต็ม');
        return;
    }
    if (pendingEditQty > 1000) {
        showError('จำนวนต้องไม่เกิน 1,000');
        return;
    }

    // Hide edit modal, then show confirm alert
    const editEl = document.getElementById('editItemModal');
    editEl.addEventListener('hidden.bs.modal', function onHidden() {
        editEl.removeEventListener('hidden.bs.modal', onHidden);
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmEditModal'));
        confirmModal.show();
    });
    bootstrap.Modal.getInstance(editEl)?.hide();
}

function confirmEditSave() {
    // Apply the edit using stored value (not re-read from hidden modal)
    if (editingIndex >= 0 && editingIndex < resultsData.length) {
        resultsData[editingIndex].AfterQty = pendingEditQty;
        resultsData[editingIndex].IsChanged = true;
    }
    editingIndex = -1;
    renderResultsTable();

    // Hide confirm modal, then show success
    const confirmEl = document.getElementById('confirmEditModal');
    confirmEl.addEventListener('hidden.bs.modal', function onHidden() {
        confirmEl.removeEventListener('hidden.bs.modal', onHidden);
        showSuccess('บันทึกข้อมูลสำเร็จ');
    });
    bootstrap.Modal.getInstance(confirmEl)?.hide();
}

function cancelConfirmEdit() {
    bootstrap.Modal.getInstance(document.getElementById('confirmEditModal'))?.hide();
}

// ============ Delete Item ============

function deleteItem(index) {
    if (index < 0 || index >= resultsData.length) return;
    const targetRow = resultsData[index];

    function doDelete() {
        const actualIdx = resultsData.indexOf(targetRow);
        if (actualIdx < 0) return;
        resultsData.splice(actualIdx, 1);
        if (selectedIndex === actualIdx) selectedIndex = -1;
        else if (selectedIndex > actualIdx) selectedIndex--;
        renderResultsTable();
    }

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'warning',
            title: 'ต้องการลบรายการนี้หรือไม่?',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        }).then(function (result) {
            if (result.isConfirmed) doDelete();
        });
    } else {
        if (confirm('ต้องการลบรายการนี้หรือไม่?')) doDelete();
    }
}

// ============ Sort Table ============

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? '' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    if (sortDirection) {
        const numericCols = ['Denom', 'BeforeQty', 'AfterQty'];
        const isNumeric = numericCols.includes(column);

        resultsData.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];
            if (isNumeric) {
                valA = Number(valA) || 0;
                valB = Number(valB) || 0;
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            } else {
                valA = String(valA);
                valB = String(valB);
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
        });
    }

    selectedIndex = -1;
    updateSortIcons();
    renderResultsTable();
}

function updateSortIcons() {
    const cols = ['Denom', 'Type', 'Series', 'BeforeQty', 'AfterQty'];
    cols.forEach(col => {
        const icon = document.getElementById('sortIcon-' + col);
        if (!icon) return;
        icon.className = 'bi mk-sort-icon';
        if (col === sortColumn && sortDirection === 'asc') {
            icon.classList.add('bi-chevron-up');
        } else if (col === sortColumn && sortDirection === 'desc') {
            icon.classList.add('bi-chevron-down');
        } else {
            icon.classList.add('bi-chevron-expand');
        }
    });
}

// ============ Save All → Open Review Modal ============

function saveAll() {
    if (resultsData.length === 0) {
        showError('ไม่มีข้อมูลที่จะบันทึก');
        return;
    }
    openReviewModal();
}

function callSaveAPI(onDone, onFail) {
    if (!currentPrepareId) {
        showError('กรุณาสแกน Header Card ก่อน');
        if (typeof onFail === 'function') onFail();
        return;
    }

    const deptId = currentDepartmentId || parseInt(document.getElementById('currentDepartmentId')?.value) || 0;

    $.requestAjax({
        service: 'Verify/ManualKeyInSave',
        type: 'POST',
        parameter: {
            PrepareId: currentPrepareId,
            HeaderCardCode: currentHeaderCardCode,
            DepartmentId: deptId,
            MachineHdId: currentMachineHdId,
            ShiftId: currentShiftId,
            SorterId: currentSorterId,
            Items: resultsData
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success && response.data) {
                currentTranId = response.data.reconcileTranId || 0;
                if (typeof onDone === 'function') onDone();
            } else {
                showError(response?.msg_desc || 'เกิดข้อผิดพลาดในการบันทึก');
                if (typeof onFail === 'function') onFail();
            }
        },
        onError: function () {
            showError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            if (typeof onFail === 'function') onFail();
        }
    });
}

// ============ Review & Approval (Modal 1.5 → 1.6 → 1.7) ============

function openReviewModal() {
    const changedItems = resultsData.filter(r => r.IsChanged);
    if (changedItems.length === 0) {
        showError('ไม่มีรายการที่แก้ไข');
        return;
    }

    const hcCode = document.getElementById('headerCardCode')?.textContent || '-';

    setTextById('reviewSubtitle', `เตรียมแก้ไขข้อมูล ${changedItems.length} รายการ`);
    setTextById('reviewHc', hcCode);
    setTextById('reviewSubtitleB', `เตรียมแก้ไขข้อมูล ${changedItems.length} รายการ`);
    setTextById('reviewHcB', hcCode);

    const totalBefore = resultsData.reduce((sum, r) => sum + r.BeforeQty, 0);
    const totalAfterDelta = resultsData.reduce((sum, r) => {
        if (r.IsChanged) return sum + (r.AfterQty - r.BeforeQty);
        return sum;
    }, 0);
    const totalAfter = totalBefore + totalAfterDelta;
    setTextById('reviewCountBefore', numberWithCommas(totalBefore));
    setTextById('reviewCountAfter', numberWithCommas(totalAfter));
    setTextById('reviewCountBeforeB', numberWithCommas(totalBefore));
    setTextById('reviewCountAfterB', numberWithCommas(totalAfter));

    let tableHtml = resultsData.map(row => {
        const denomSafe = parseInt(row.Denom) || 0;
        return `
        <div class="mk-table-row">
            <div class="mk-cell cell-center">${row.IsChanged ? '<i class="bi bi-exclamation-diamond-fill mk-edited-icon"></i>' : ''}</div>
            <div class="mk-cell">
                <span class="qty-badge qty-${denomSafe}">${denomSafe}</span>
            </div>
            <div class="mk-cell">${escapeHtml(row.Type)}</div>
            <div class="mk-cell">${escapeHtml(row.Series)}</div>
            <div class="mk-cell cell-number">${numberWithCommas(row.BeforeQty)}</div>
            <div class="mk-cell cell-number mk-cell-after ${row.IsChanged ? 'mk-cell-changed' : ''}">${row.IsChanged ? numberWithCommas(row.AfterQty) : ''}</div>
        </div>
    `;}).join('');

    // Fill remaining space with empty rows to maintain table stripe pattern
    const REVIEW_MIN_ROWS = 3;
    if (resultsData.length < REVIEW_MIN_ROWS) {
        tableHtml += emptyRows(REVIEW_MIN_ROWS - resultsData.length);
    }

    document.getElementById('reviewTableBody').innerHTML = tableHtml;
    document.getElementById('reviewTableBodyB').innerHTML = tableHtml;

    document.getElementById('reviewManager').value = '';
    document.getElementById('reviewReason').value = '';
    document.getElementById('reviewOtp').value = '';

    setModalStep('reviewStepA');
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

function submitApprovalRequest() {
    const btn = document.getElementById('btnSubmitApproval');
    if (btn?.disabled) return;

    const managerId = document.getElementById('reviewManager')?.value;
    if (!managerId) {
        showError('กรุณาเลือก Manager');
        return;
    }

    // Disable button to prevent double-click
    if (btn) btn.disabled = true;

    // Step 1: Save data first
    callSaveAPI(function () {
        // Step 2: Send OTP to selected manager
        sendOtpToManager(parseInt(managerId));
    }, function () {
        // Save failed — re-enable button
        if (btn) btn.disabled = false;
    });
}

function sendOtpToManager(managerId) {
    const deptId = currentDepartmentId || parseInt(document.getElementById('currentDepartmentId')?.value) || 0;

    window.otp.send({
        userSendId: currentUserId,
        userSendDepartmentId: deptId,
        userReceiveId: managerId,
        bssMailSystemTypeCode: window.APP.CONST.MAIL_TYPE.MANUAL_KEY_IN_EDIT
    }).done(function () {
        // OTP sent — go to Step B
        setModalStep('reviewStepB');
        startOtpCountdown();
    }).fail(function () {
        // otp.send already shows error alert
    }).always(function () {
        // Re-enable submit button
        const btn = document.getElementById('btnSubmitApproval');
        if (btn) btn.disabled = false;
    });
}

function goBackToStepA() {
    stopOtpCountdown();
    setModalStep('reviewStepA');
    const btn = document.getElementById('btnSubmitApproval');
    if (btn) btn.disabled = false;
}

function closeReviewModal() {
    stopOtpCountdown();
    bootstrap.Modal.getInstance(document.getElementById('reviewModal'))?.hide();
}

function confirmOtp() {
    const btnOtp = document.getElementById('btnConfirmOtp');
    if (btnOtp?.disabled) return;

    const otpCode = document.getElementById('reviewOtp')?.value || '';
    if (otpCode.length !== 6) {
        showError('กรุณากรอกรหัส OTP 6 หลัก');
        return;
    }

    // Disable button to prevent double-click
    if (btnOtp) btnOtp.disabled = true;

    const deptId = currentDepartmentId || parseInt(document.getElementById('currentDepartmentId')?.value) || 0;
    const refCode = window.otp.getRefCode(window.APP.CONST.MAIL_TYPE.MANUAL_KEY_IN_EDIT);

    // Step 1: Verify OTP
    window.otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: deptId,
        bssMailSystemTypeCode: window.APP.CONST.MAIL_TYPE.MANUAL_KEY_IN_EDIT,
        bssMailOtpCode: otpCode,
        bssMailRefCode: refCode
    }).done(function () {
        // Step 2: Submit for approval
        const managerId = parseInt(document.getElementById('reviewManager')?.value) || 0;
        const reason = document.getElementById('reviewReason')?.value || '';

        $.requestAjax({
            service: 'Verify/ManualKeyInSubmitForApproval',
            type: 'POST',
            parameter: {
                ReconcileTranId: currentTranId,
                SupervisorId: managerId,
                OtpCode: otpCode,
                Remark: reason
            },
            enableLoader: true,
            onSuccess: function (response) {
                stopOtpCountdown();
                bootstrap.Modal.getInstance(document.getElementById('reviewModal'))?.hide();
                if (btnOtp) btnOtp.disabled = false;
                if (response && response.is_success) {
                    showSuccess('ส่งอนุมัติสำเร็จ');
                } else {
                    showError(response?.msg_desc || 'เกิดข้อผิดพลาด');
                }
            },
            onError: function () {
                if (btnOtp) btnOtp.disabled = false;
                showError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            }
        });
    }).fail(function () {
        if (btnOtp) btnOtp.disabled = false;
        showError('OTP ไม่ถูกต้อง');
    });
}

// ============ Modal Step Management ============

function setModalStep(stepId) {
    const modal = document.getElementById('reviewModal');
    modal.querySelectorAll('.modal-step').forEach(step => step.classList.remove('active'));
    document.getElementById(stepId)?.classList.add('active');
}

// ============ OTP Countdown ============

function startOtpCountdown() {
    stopOtpCountdown();
    let seconds = 299; // 4:59
    updateOtpDisplay(seconds);

    otpTimer = setInterval(() => {
        seconds--;
        updateOtpDisplay(seconds);
        if (seconds <= 0) {
            stopOtpCountdown();
            setTextById('otpCountdown', 'สามารถส่ง OTP อีกครั้งได้');
            return;
        }
    }, 1000);
}

function stopOtpCountdown() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

function updateOtpDisplay(totalSeconds) {
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    setTextById('otpCountdown', `ส่งอีกครั้งได้ภายใน ${min}:${sec} นาที`);
}

function resendOtp() {
    // Block resend while countdown is active
    if (otpTimer) return;

    const managerId = parseInt(document.getElementById('reviewManager')?.value) || 0;
    if (!managerId) return;
    sendOtpToManager(managerId);
}

// ============ Success / Error Modals ============

function showSuccess(message) {
    setTextById('successMessage', message);
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function closeSuccessModal() {
    bootstrap.Modal.getInstance(document.getElementById('successModal'))?.hide();
}

function showError(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'warning',
            title: message,
            confirmButtonText: 'ตกลง'
        });
    } else {
        alert(message);
    }
}

// ============ Utility Functions ============

function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

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
    if (x === null || x === undefined) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getDenomBadgeClass(price) {
    const p = parseInt(price);
    if ([20, 50, 100, 500, 1000].includes(p)) return `qty-badge qty-${p}`;
    return 'qty-badge';
}
