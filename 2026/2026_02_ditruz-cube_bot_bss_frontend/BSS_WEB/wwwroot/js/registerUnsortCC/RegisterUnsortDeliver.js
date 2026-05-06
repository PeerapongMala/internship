document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initComponent, 100);
});

function initComponent() {
    setupEventListeners();
    initDateRangePicker();
    updateSubmitButtonState();
}

let selectedWaybillId = null;
let selectedWaybillIds = [];
let idToDelete = null;

// ข้อมูลจาก API
let apiData = null;
let allWaybillData = [];       // ข้อมูลทั้งหมดจาก API (registerSendUnsortCC)
let filteredWaybillData = [];  // ข้อมูลหลัง filter
let isCurrentHistory = false;  // flag ว่าตอนนี้เป็น history mode หรือไม่

// สถานะที่อนุญาตให้ select checkbox ได้
// const SELECTABLE_STATUSES = ['สร้างใบนำส่ง', 'แก้ใขใบนำส่ง'];
const SELECTABLE_STATUSES = [BSSStatusEnum.DeliveredNote, BSSStatusEnum.CorrectReturn];

// ========== API ==========

function toLocalISOString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}

function getDateRangeISO() {
    const startDate = parseThaiDate(document.getElementById('filterDateStart')?.value);
    const endDate = parseThaiDate(document.getElementById('filterDateEnd')?.value);

    const now = new Date();
    const startDt = startDate || now;
    const endDt = endDate || now;

    // start = 00:00:00, end = 23:59:59
    startDt.setHours(0, 0, 0, 0);
    endDt.setHours(23, 59, 59, 0);

    return {
        startDate: toLocalISOString(startDt),
        endDate: toLocalISOString(endDt)
    };
}

function fetchData(isSelectHistory) {
    const dates = getDateRangeISO();
    isCurrentHistory = isSelectHistory;

    $.requestAjax({
        service: 'TransactionSendUnsortCC/GetRegisterUnsortDeliver',
        type: 'POST',
        enableLoader: true,
        parameter: {
            isSelectHistory: isSelectHistory,
            startDate: dates.startDate,
            endDate: dates.endDate
        },
        onSuccess: function (response) {

            if (response && response.is_success && response.data) {
                apiData = response.data;
            } else {
                // API สำเร็จแต่ไม่มี data ให้ clear ข้อมูลเดิม
                apiData = { sendUnsortCode: [], masterInstitution: [], masterStatus: [], registerSendUnsortCC: [] };
            }

            allWaybillData = apiData.registerSendUnsortCC || [];
            filteredWaybillData = [...allWaybillData];

            // อัพเดท dropdown: ถ้ามี data ให้ใส่, ถ้าไม่มีให้ clear เป็น empty (ยกเว้น calendar และ สถานะ)
            loadWaybillDropdown();
            loadBankDropdown();
            loadStatusDropdown();

            selectedWaybillId = null;
            selectedWaybillIds = [];

            applyLocalFilter();
        }
    });
}

// ========== Date Picker ==========

function formatThaiDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
}

function parseThaiDate(str) {
    if (!str) return null;
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10) - 543;
    return new Date(y, m, d);
}

function initDateRangePicker() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const startEl = document.getElementById('filterDateStart');
    const endEl = document.getElementById('filterDateEnd');
    if (!startEl || !endEl) return;

    startEl.value = formatThaiDate(oneMonthAgo);
    endEl.value = formatThaiDate(now);

    $.datetimepicker.setLocale('th');

    $(startEl).datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        lang: 'th',
        yearOffset: 543,
        validateOnBlur: false,
        onChangeDateTime: function (selectedDate) {
            if (selectedDate) {
                const maxMs = 30 * 24 * 60 * 60 * 1000;
                const currentEnd = parseThaiDate(endEl.value);
                let newEnd = (currentEnd && selectedDate <= currentEnd) ? currentEnd : new Date(selectedDate);
                if (newEnd - selectedDate > maxMs) {
                    newEnd = new Date(selectedDate.getTime() + maxMs);
                }
                endEl.value = formatThaiDate(newEnd);
            }
            fetchData(isCurrentHistory);
        }
    });

    $(endEl).datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        lang: 'th',
        yearOffset: 543,
        validateOnBlur: false,
        onChangeDateTime: function (selectedDate) {
            if (selectedDate) {
                const maxMs = 30 * 24 * 60 * 60 * 1000;
                const currentStart = parseThaiDate(startEl.value);
                let newStart = (currentStart && selectedDate >= currentStart) ? currentStart : new Date(selectedDate);
                if (selectedDate - newStart > maxMs) {
                    newStart = new Date(selectedDate.getTime() - maxMs);
                }
                startEl.value = formatThaiDate(newStart);
            }
            fetchData(isCurrentHistory);
        }
    });

    // เรียก API ครั้งแรก
    fetchData(false);
}

function resetDateToNow() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const startEl = document.getElementById('filterDateStart');
    const endEl = document.getElementById('filterDateEnd');
    if (startEl) startEl.value = formatThaiDate(oneMonthAgo);
    if (endEl) endEl.value = formatThaiDate(now);
    fetchData(isCurrentHistory);
}

// ========== Format Helpers ==========

function formatDateDisplay(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${hh}:${mm}`;
}

// ========== Dropdowns ==========

function loadWaybillDropdown() {
    const selectEl = document.getElementById('filterDeliveryCode');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">-- ทั้งหมด --</option>';

    const codes = apiData?.sendUnsortCode || [];
    codes.forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = code;
        selectEl.appendChild(option);
    });
}

function loadBankDropdown() {
    const selectEl = document.getElementById('filterBank');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">-- ทั้งหมด --</option>';

    const banks = apiData?.masterInstitution || [];
    banks.forEach(item => {
        const option = document.createElement('option');
        option.value = item.institutionNameTh;
        option.textContent = item.institutionNameTh;
        selectEl.appendChild(option);
    });
}

function loadStatusDropdown() {
    const selectEl = document.getElementById('filterStatus');
    if (!selectEl) return;

    const statuses = apiData?.masterStatus || [];
    // ถ้า API ไม่มี masterStatus กลับมา ให้คง dropdown เดิมไว้
    if (statuses.length === 0) return;

    const prevValue = selectEl.value;
    selectEl.innerHTML = '<option value="">-- ทั้งหมด --</option>';

    statuses.forEach(item => {
        const option = document.createElement('option');
        option.value = item.statusNameTh;
        option.textContent = item.statusNameTh;
        selectEl.appendChild(option);
    });

    // restore ค่าเดิมถ้ายังมีอยู่
    if (prevValue) {
        selectEl.value = prevValue;
    }
}

// ========== Filter ==========

function applyFilter() {
    const filterStatus = document.getElementById('filterStatus')?.value;
    const needHistory = (filterStatus === 'ส่งมอบ');

    if (needHistory !== isCurrentHistory) {
        // clear dropdown ทันทีก่อน call API (ยกเว้น calendar และ สถานะ)
        clearDropdowns();
        // clear ตารางทันที
        allWaybillData = [];
        filteredWaybillData = [];
        selectedWaybillId = null;
        selectedWaybillIds = [];
        renderWaybillTable();
        renderUnsortTable();
        updateSubmitButtonState();

        fetchData(needHistory);
        return;
    }

    applyLocalFilter();
}

function clearDropdowns() {
    const waybillEl = document.getElementById('filterDeliveryCode');
    if (waybillEl) waybillEl.innerHTML = '<option value="">-- ทั้งหมด --</option>';

    const bankEl = document.getElementById('filterBank');
    if (bankEl) bankEl.innerHTML = '<option value="">-- ทั้งหมด --</option>';
}

function applyLocalFilter() {
    const filterCode = document.getElementById('filterDeliveryCode')?.value;
    const filterBank = document.getElementById('filterBank')?.value;
    const filterStatus = document.getElementById('filterStatus')?.value;

    // clear selected items เมื่อ filter เปลี่ยน
    selectedWaybillId = null;
    selectedWaybillIds = [];

    filteredWaybillData = allWaybillData.filter(item => {
        const matchCode = !filterCode || item.sendUnsortCode === filterCode;

        // match bank: เช็คว่า item มี institution ตรงกับที่เลือกไหม
        let matchBank = true;
        if (filterBank) {
            const itemBanks = (item.registerUnsortWithSumBankNoteQty || []).flatMap(r => r.masterInstitution || []);
            matchBank = itemBanks.some(b => b.institutionNameTh === filterBank);
        }

        const matchStatus = !filterStatus || (item.masterStatus?.statusNameTh === filterStatus);

        return matchCode && matchBank && matchStatus;
    });

    renderWaybillTable();
    renderUnsortTable();
    updateSubmitButtonState();
}

function onSelectWaybill() {
    applyLocalFilter();
}

// ========== Table: รายการภาชนะ ==========

function renderWaybillTable() {
    const tbody = document.getElementById('tableContainer');
    if (!tbody) return;

    tbody.innerHTML = filteredWaybillData.map(item => {
        // const canSelect = SELECTABLE_STATUSES.includes(statusName);
        const statusName = item.masterStatus?.statusNameTh || '-';
        const statusId = item.statusId;
        const canSelect = SELECTABLE_STATUSES.includes(statusId);
        
        const isChecked = selectedWaybillIds.includes(item.sendUnsortId);
        const sendDateDisplay = formatDateDisplay(item.sendDate);
        const remarkDisplay = item.remark || '-';

        return `
            <tr onclick="onSelectWaybillRow(${item.sendUnsortId})" class="${item.sendUnsortId === selectedWaybillId ? 'active-row' : ''}" style="cursor:pointer;">
                <td onclick="event.stopPropagation();">
                    ${canSelect
                ? `<input type="checkbox" class="row-checkbox"
                               ${isChecked ? 'checked' : ''}
                               onchange="onCheckItem(${item.sendUnsortId}, this.checked)">`
                : ''}
                </td>
                <td>${item.sendUnsortCode || '-'}</td>
                <td>${sendDateDisplay}</td>
                <td>${remarkDisplay}</td>
                <td>${renderStatusBadge(statusName)}</td>
                <td>
                    <div class="action-btns">
                        ${item.canEdit ? `<button class="btn-action btn-warning" onclick="editWaybill(${item.sendUnsortId}, ${item.statusId}); event.stopPropagation();">
                            <i class="bi bi-pencil"></i>
                        </button>` : ''}
                        ${item.canPrint ? `<button class="btn-action" onclick="printWaybill(${item.isHistory ? item.historySendUnsortId : item.sendUnsortId}, ${item.isHistory}); event.stopPropagation();">
                            <i class="bi bi-printer"></i>
                        </button>` : ''}
                        ${item.canDelete ? `<button class="btn-action btn-danger" onclick="deleteWaybill(${item.sendUnsortId}); event.stopPropagation();">
                            <i class="bi bi-trash"></i>
                        </button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    updateSelectAllCheckbox();
}

function onSelectWaybillRow(id) {
    selectedWaybillId = id;
    renderWaybillTable();
    renderUnsortTable();
}

// ========== Table: รายการบาร์โค้ดภาชนะ ==========

function renderUnsortTable() {
    const tbody = document.getElementById('tableBody');
    const bundleDisplay = document.getElementById('selectedBundleCount');
    if (!tbody) return;

    const waybill = allWaybillData.find(w => w.sendUnsortId === selectedWaybillId);
    const containers = waybill ? (waybill.registerUnsortWithSumBankNoteQty || []) : [];

    const total = containers.reduce((sum, c) => sum + (c.totalBanknoteQty || 0), 0);
    if (bundleDisplay) {
        bundleDisplay.textContent = total;
    }

    tbody.innerHTML = '';

    if (containers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-5">
            ${selectedWaybillId ? 'ไม่พบข้อมูลบาร์โค้ดในระบบ' : 'กรุณาเลือกรายการภาชนะจากตารางด้านบน'}
        </td></tr>`;
        return;
    }

    tbody.innerHTML = containers.map(item => `
        <tr>
            <td>${item.containerCode || '-'}</td>
            <td>${formatDateDisplay(item.createdDate)}</td>
            <td>${item.totalBanknoteQty || 0}</td>
        </tr>
    `).join('');
}

// ========== Checkbox & Select All ==========

function onCheckItem(id, isChecked) {
    if (isChecked) {
        if (!selectedWaybillIds.includes(id)) {
            selectedWaybillIds.push(id);
        }
    } else {
        selectedWaybillIds = selectedWaybillIds.filter(item => item !== id);
    }
    updateSelectAllCheckbox();
    updateSubmitButtonState();
}

function toggleSelectAll(masterCheckbox) {
    const isChecked = masterCheckbox.checked;
    if (isChecked) {
        // select เฉพาะ item ที่มีสถานะอนุญาต
        selectedWaybillIds = filteredWaybillData
            .filter(item => SELECTABLE_STATUSES.includes(item.statusId))
            .map(item => item.sendUnsortId);
    } else {
        selectedWaybillIds = [];
    }
    renderWaybillTable();
    updateSubmitButtonState();
}

function updateSelectAllCheckbox() {
    const selectAllBtn = document.getElementById('selectAll');
    if (!selectAllBtn) return;

    const selectableItems = filteredWaybillData.filter(item =>
        SELECTABLE_STATUSES.includes(item.statusId)
    );

    if (selectableItems.length > 0 && selectedWaybillIds.length === selectableItems.length) {
        selectAllBtn.checked = true;
    } else {
        selectAllBtn.checked = false;
    }
}

function updateSubmitButtonState() {
    const btnSubmit = document.getElementById('btnConfirmSubmit');
    if (!btnSubmit) return;

    if (selectedWaybillIds.length > 0) {
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = "1";
        btnSubmit.style.cursor = "pointer";
    } else {
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = "0.6";
        btnSubmit.style.cursor = "not-allowed";
    }
}

// ========== Status Badge ==========

function renderStatusBadge(status) {
    switch (status) {
        case 'รับมอบ':
            return `
                <span class="status-badge status-received">
                    <i class="bi bi-check-circle-fill"></i>
                    รับมอบ
                </span>
            `;
        case 'ลงทะเบียน':
            return `
                <span class="status-badge status-register">
                    <i class="bi bi-file-earmark-text-fill"></i>
                    ลงทะเบียน
                </span>
            `;
        case 'ส่งมอบ':
            return `
                <span class="status-badge status-delivery">
                    <i class="bi bi-clock-fill"></i>
                    ส่งมอบ
                </span>
            `;
        case 'ส่งคืน':
            return `
                <span class="status-badge status-return">
                    <i class="bi bi-x-circle-fill"></i>
                    ส่งคืน
                </span>
            `;
        case 'ไม่รับมอบ':
            return `
                <span class="status-badge status-return">
                    <i class="bi bi-x-circle-fill"></i>
                    ไม่รับมอบ
                </span>
            `;
        case 'สร้างใบนำส่ง':
            return `
                <span class="status-badge status-register">
                    <i class="bi bi-file-earmark-text-fill"></i>
                    สร้างใบนำส่ง
                </span>
            `;
        case 'แก้ไขรายการส่งกลับ':
            return `
                <span class="status-badge status-register">
                    <i class="bi bi-file-earmark-text-fill"></i>
                    แก้ไขรายการส่งกลับ
                </span>
            `;
        default:
            return status;
    }
}

// ========== Actions ==========

function deleteWaybill(id) {
    idToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('DeleteModal'));
    deleteModal.show();
}

function confirmDelete() {
    if (idToDelete === null) return;

    const deleteItem = allWaybillData.find(w => w.sendUnsortId === idToDelete);
    if (!deleteItem) return;

    // ปิด modal ก่อน
    const deleteModalEl = document.getElementById('DeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(deleteModalEl);
    if (modalInstance) {
        modalInstance.hide();
    }

    $.requestAjax({
        service: 'TransactionSendUnsortCC/DeleteRegisterUnsortDeliver',
        type: 'DELETE',
        enableLoader: true,
        parameter: {
            registerSendUnsortCC: [deleteItem]
        },
        onSuccess: function (response) {
            if (response && response.is_success) {
                allWaybillData = allWaybillData.filter(w => w.sendUnsortId !== idToDelete);
                filteredWaybillData = filteredWaybillData.filter(w => w.sendUnsortId !== idToDelete);
                selectedWaybillIds = selectedWaybillIds.filter(item => item !== idToDelete);

                if (selectedWaybillId === idToDelete) {
                    selectedWaybillId = null;
                }

                renderWaybillTable();
                renderUnsortTable();
                updateSubmitButtonState();

                showSuccess("ลบข้อมูลสำเร็จ");

                idToDelete = null;
            }
        }
    });
}

function editWaybill(id, statusId) {
    window.location.href = `/PrePreparationUnsort/EditRegisterUnsortDeliver?sendUnsortId=${id}&statusId=${statusId}`;
}

function createDeliveryBill() {
    window.location.href = '/PrePreparationUnsort/CreateRegisterUnsortDeliver';
}

function showSuccess(message) {
    const msgElement = document.getElementById('successModalMessage');
    if (msgElement) {
        msgElement.textContent = message;
    }
    const successModal = new bootstrap.Modal(document.getElementById('commonSuccessModal'));
    successModal.show();
}

function onSuccessDone() {
    selectedWaybillIds = [];
    renderWaybillTable();
    updateSubmitButtonState();
}

function setupEventListeners() {
    const toggleBtn = document.getElementById('filterSectionTrigger');
    if (toggleBtn) {
        toggleBtn.onclick = () => $("#filterSection").slideToggle();
    }
}

function toggleFilter() {
    $('#filterCard').slideToggle(300);
}

function Save() {
    if (selectedWaybillIds.length === 0) return;

    const selectedItems = allWaybillData
        .filter(item => selectedWaybillIds.includes(item.sendUnsortId));

    $.requestAjax({
        service: 'TransactionSendUnsortCC/ConfirmRegisterUnsortDeliver',
        type: 'POST',
        enableLoader: true,
        parameter: {
            registerSendUnsortCC: selectedItems
        },
        onSuccess: function (response) {
            if (response && response.is_success) {
                showSuccess("ยืนยันส่งมอบรายการที่เลือกสำเร็จแล้ว");
                // reload data ใหม่หลังยืนยันสำเร็จ
                fetchData(isCurrentHistory);
            } else {

                var msgCode = response.msg_code || response.msgCode || "";
                var msgDesc = response.msg_desc || response.msgDesc || "";

                /*$.sweetError({
                    text: msgCode + " : " + msgDesc
                });*/

                showBarcodeErrorModal(msgDesc);
                return;
            }
        }
    });
}

function showBarcodeErrorModal(message) {
    const modalElement = document.getElementById("ErrorModal");
    if (!modalElement) return;

    const errorSpan = document.getElementById("errorMessage");
    if (errorSpan) {
        errorSpan.innerText = message || "เกิดข้อผิดพลาด";
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // ป้องกันการ show ซ้อน
    if (!modalElement.classList.contains("show")) {
        playErrorAlarm();
        modal.show();
    }
}

function printWaybill(printId, isHistory) {
    const params = new URLSearchParams();
    params.append("printId", printId);
    params.append("isHistory", isHistory);

    const url = `/Report/SendUnsortDelivery?${params.toString()}`;
    const title = 'PrintWindow';

    // กำหนดขนาดหน้าต่างที่ต้องการ
    const w = 1200;
    const h = 850;

    // คำนวณหาจุดกึ่งกลางโดยอ้างอิงจากตำแหน่งหน้าจอที่ใช้งานอยู่ปัจจุบัน
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const windowFeatures = `
        scrollbars=yes,
        width=${w / systemZoom}, 
        height=${h / systemZoom}, 
        top=${top}, 
        left=${left},
        resizable=yes,
        status=no,
        toolbar=no,
        menubar=no,
        location=no
    `;

    const newWindow = window.open(url, title, windowFeatures);

    if (window.focus && newWindow) {
        newWindow.focus();
    }
}
