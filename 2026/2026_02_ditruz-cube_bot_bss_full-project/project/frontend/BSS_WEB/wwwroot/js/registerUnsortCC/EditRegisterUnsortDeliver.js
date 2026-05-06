// Global Variables
let currentWaybill = null;
let selectedContainerIndex = null;
let editingBanknoteId = null;
let deletingBanknoteId = null;
let editingContainerId = null;
let allSendUnsortData = []; // เก็บข้อมูลทั้งหมดสำหรับ filter barcode ฝั่ง client

const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;

window.editPageState = window.editPageState || {
    bankCollection: [],
    denoCollection: [],
    sendUnsortData: []
};

// Initialize Component
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initComponent, 100);
});

async function initComponent() {
    setupEventListeners();

    const statusId = getStatusId();
    if (statusId === BSSStatusEnum.DeliveredNote) {
        document.getElementById('filterBarcodeCol').style.display = '';
        document.getElementById('filterDateCol').style.display = '';
        await Promise.all([
            loadMasterDropdownBank(),
            loadMasterDropdownDenomination()
        ]);
        // initDatePickerForEdit จะ trigger loadEditSendUnsortDelivery พร้อม date range
        initDatePickerForEdit();
    } else {
        await Promise.all([
            loadMasterDropdownBank(),
            loadMasterDropdownDenomination(),
            loadEditSendUnsortDelivery()
        ]);
    }
}

// ==================== Master Dropdown ====================

function getDropdownData(path, method, requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Master' + path,
            type: method,
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

async function loadMasterDropdownBank() {
    try {
        const departmentId = currentDepartmentId || 0;
        const request = {
            tableName: "MasterInstitutionWithCompany",
            operator: "OR",
            searchCondition: [],
            selectItemCount: 200,
            includeData: false,
            departmentId: departmentId
        };
        const response = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);
        if (response && response.data) {
            editPageState.bankCollection = response.data.map(x => ({ id: x.key, name: x.text, code: x.value }));
        }
    } catch (err) {
        console.error('Load bank dropdown failed:', err);
    }
}

async function loadMasterDropdownDenomination() {
    try {
        const departmentId = currentDepartmentId || 0;
        const request = {
            tableName: "MasterDenomination",
            operator: "OR",
            searchCondition: [],
            selectItemCount: 200,
            includeData: false,
            departmentId: departmentId
        };
        const response = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);
        if (response && response.data) {
            editPageState.denoCollection = response.data;
        }
    } catch (err) {
        console.error('Load denomination dropdown failed:', err);
    }
}

// ==================== Load Edit Data ====================

function getSendUnsortId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("sendUnsortId");
}

function getStatusId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("statusId")) || 0;
}

async function loadEditSendUnsortDelivery(startDate, endDate) {
    const sendUnsortId = getSendUnsortId();
    if (!sendUnsortId) {
        document.getElementById('lblWaybillCode').textContent = "ไม่พบข้อมูล sendUnsortId";
        return;
    }

    try {
        const response = await getEditSendUnsortDelivery(sendUnsortId, startDate, endDate);
        if (response && response.is_success && response.data) {
            currentWaybill = response.data;
            editPageState.sendUnsortData = response.data.sendUnsortData || [];
            allSendUnsortData = [...editPageState.sendUnsortData];

            displayHeaderInfo(response.data);

            if (getStatusId() === BSSStatusEnum.DeliveredNote) {
                populateBarcodeDropdown(allSendUnsortData);
            }

            renderContainerTable(editPageState.sendUnsortData);
            showEmptyBanknoteTable();
        } else {
            console.warn('GetEditSendUnsortDelivery:', response?.msg_desc);
            document.getElementById('lblWaybillCode').textContent = 'ไม่พบข้อมูลใบนำส่ง';
        }
    } catch (err) {
        console.error('Load edit data failed:', err);
        document.getElementById('lblWaybillCode').textContent = 'ไม่พบข้อมูลใบนำส่ง';
    }
}

function getEditSendUnsortDelivery(sendUnsortId, startDate, endDate) {
    const parameter = { sendUnsortId: parseInt(sendUnsortId) };
    if (startDate) parameter.startDate = startDate;
    if (endDate) parameter.endDate = endDate;

    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'TransactionSendUnsortCC/GetEditSendUnsortDelivery',
            type: 'POST',
            parameter: parameter,
            enableLoader: true,
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

// ==================== Display ====================

function displayHeaderInfo(data) {
    document.getElementById('lblWaybillCode').textContent = data.sendUnsortCode || '';
}

function setupEventListeners() {
    // Check All checkbox
    const checkAllEl = document.getElementById('checkAll');
    if (checkAllEl) {
        checkAllEl.addEventListener('change', function () {
            const checkboxes = document.querySelectorAll('.container-cb');
            checkboxes.forEach(cb => { cb.checked = this.checked; });
            updateSelectionState();
            checkSelection();
        });
    }

    // Bundle input validation
    const bundleInput = document.getElementById('editoldCountBundle');
    if (bundleInput) {
        bundleInput.addEventListener('input', validateBundleInput);
    }

    // Barcode filter dropdown
    const ddlContainerFilter = document.getElementById('ddlContainerFilter');
    if (ddlContainerFilter) {
        ddlContainerFilter.addEventListener('change', executeContainerFilter);
    }
}

function checkSelection() {
    if (getStatusId() !== BSSStatusEnum.NotAccepted && getStatusId() !== BSSStatusEnum.Returned) return;

    const btnConfirm = document.getElementById('btnConfirm');
    if (!btnConfirm) return;

    const hasChecked = Array.from(document.querySelectorAll('.container-cb')).some(cb => cb.checked);
    btnConfirm.disabled = !hasChecked;
}

function updateSelectionState() {
    const checkboxes = document.querySelectorAll('.container-cb');
    checkboxes.forEach((cb, index) => {
        if (editPageState.sendUnsortData[index]) {
            editPageState.sendUnsortData[index].isSelected = cb.checked;
        }
    });
}

// ==================== Container Table ====================

function renderContainerTable(containers) {
    const tbody = document.getElementById('containerTableBody');
    const theadAction = document.querySelector('.data-table thead th:last-child');
    tbody.innerHTML = '';

    if (!containers || containers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">ไม่พบข้อมูลภาชนะ</td></tr>';
        return;
    }

    const hasEditableStatus = containers.some(item => item.canEdit);
    if (theadAction) theadAction.style.display = hasEditableStatus ? '' : 'none';

    containers.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => selectContainerRow(tr, item, index);

        const regisDate = formatDateThai(item.createdDate);

        let rowHtml = `
            <td class="text-center" onclick="event.stopPropagation()">
                <input type="checkbox" class="container-cb" data-index="${index}" onchange="onContainerCheckChange(this, ${index})">
            </td>
            <td class="text-center">${item.containerCode || ''}</td>
            <td class="text-center">${regisDate}</td>
            <td class="text-center">${renderStatusBadge(item.statusName)}</td>
        `;

        if (hasEditableStatus) {
            rowHtml += item.canEdit
                ? `<td class="text-center">
                   <button class="btn-action btn-warning" onclick="editContainer(${index}); event.stopPropagation();">
                        <i class="bi bi-pencil"></i>
                    </button>
                   </td>`
                : `<td class="text-center"></td>`;
        }

        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);

        // Default select if isOldData and isSelected are both true
        if (item.isOldData && item.isSelected) {
            const cb = tr.querySelector('.container-cb');
            if (cb) cb.checked = true;
        }
    });

    checkSelection();
}

function onContainerCheckChange(checkbox, index) {
    if (editPageState.sendUnsortData[index]) {
        editPageState.sendUnsortData[index].isSelected = checkbox.checked;
    }

    // Update checkAll state
    const allCheckboxes = document.querySelectorAll('.container-cb');
    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.checked = Array.from(allCheckboxes).every(cb => cb.checked);
    }

    checkSelection();
}

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

// ==================== Banknote Table ====================

function showEmptyBanknoteTable() {
    const section = document.getElementById('banknoteSection');
    const tbody = document.getElementById('banknoteTableBody');

    section.style.display = 'block';
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center text-muted py-4">
                กรุณาเลือกภาชนะเพื่อแสดงข้อมูล
            </td>
        </tr>
    `;

    const lblTotal = document.getElementById('lblTotalBundle');
    if (lblTotal) lblTotal.textContent = '0';
}

function selectContainerRow(rowElement, containerData, index) {
    selectedContainerIndex = index;

    const allRows = document.querySelectorAll('#containerTableBody tr');
    allRows.forEach(r => r.classList.remove('active-row'));
    rowElement.classList.add('active-row');

    renderBanknoteTable(containerData.unsortCC);
}

function renderBanknoteTable(banknotes) {
    const tbody = document.getElementById('banknoteTableBody');
    const lblTotal = document.getElementById('lblTotalBundle');
    tbody.innerHTML = '';

    if (!banknotes || banknotes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">ไม่พบข้อมูลรายการธนบัตร</td></tr>`;
        if (lblTotal) lblTotal.textContent = '0';
        return;
    }

    const activeBanknotes = banknotes.filter(n => n.isActive !== false);

    if (activeBanknotes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">ไม่พบข้อมูลรายการธนบัตร</td></tr>`;
        if (lblTotal) lblTotal.textContent = '0';
        return;
    }

    const totalBundle = activeBanknotes.reduce((sum, note) => sum + (note.bankNoteQty || 0), 0);
    if (lblTotal) lblTotal.textContent = totalBundle.toLocaleString();

    activeBanknotes.forEach(note => {
        const tr = document.createElement('tr');
        const regisDate = formatDateThai(note.createdDate);
        tr.innerHTML = `
            <td class="text-start ps-3">${note.instNameTh || ''}</td>
            <td class="text-center">${renderDenominationBadge(note.denoPrice)}</td>
            <td class="text-center"><strong>${(note.bankNoteQty || 0).toLocaleString()}</strong></td>
            <td class="text-center">${regisDate}</td>
            <td class="text-center">
                ${note.canEdit ? `<button class="btn-action btn-warning" onclick="editBanknote(${note.unsortCCId})">
                    <i class="bi bi-pencil"></i>
                </button>` : ''}
                ${note.canDelete ? `<button class="btn-action btn-danger" onclick="confirmDeleteBanknote(${note.unsortCCId})">
                    <i class="bi bi-trash"></i>
                </button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDenominationBadge(value) {
    if (!value) return '';
    const numVal = parseInt(value);
    const cssClass = getDenominationClass(numVal);
    const label = numVal.toLocaleString();
    return `<span class="${cssClass}">${label}</span>`;
}

function getDenominationClass(value) {
    switch (value) {
        case 1000: return 'qty-1000';
        case 500: return 'qty-500';
        case 100: return 'qty-100';
        case 50: return 'qty-50';
        case 20: return 'qty-20';
        default: return 'qty-badge';
    }
}


// ==================== Edit Banknote ====================

function editBanknote(unsortCCId) {
    editingBanknoteId = unsortCCId;

    if (selectedContainerIndex === null) return;
    const container = editPageState.sendUnsortData[selectedContainerIndex];
    if (!container) return;

    const banknote = container.unsortCC.find(b => b.unsortCCId === unsortCCId);
    if (!banknote) return;

    document.getElementById('editId').value = banknote.unsortCCId;
    document.getElementById('oldContainerBankNote').value = container.containerCode || '';

    // Show edit sections (old + edit side by side)
    document.getElementById('sectionViewBank').style.display = 'none';
    document.getElementById('sectionViewPrice').style.display = 'none';
    document.getElementById('sectionOldBank').style.display = 'block';
    document.getElementById('sectionEditBank').style.display = 'block';
    document.getElementById('sectionOldPrice').style.display = 'block';
    document.getElementById('sectionEditPrice').style.display = 'block';

    document.getElementById('oldBankNoteHalf').value = banknote.instNameTh || '';
    document.getElementById('oldPriceHalf').value = banknote.denoPrice || '';
    document.getElementById('oldCountBundle').value = banknote.bankNoteQty || 0;

    // Render bank dropdown from master data
    const bankSelect = document.getElementById('editBankNote');
    bankSelect.innerHTML = '<option value="">-- เลือกธนาคาร --</option>';
    editPageState.bankCollection.forEach(bank => {
        const selected = parseInt(bank.id) === banknote.instId ? 'selected' : '';
        bankSelect.innerHTML += `<option value="${bank.id}" ${selected}>${bank.name}</option>`;
    });

    // Render denomination dropdown from master data
    const priceSelect = document.getElementById('editPriceType');
    priceSelect.innerHTML = '<option value="">-- เลือกชนิดราคา --</option>';
    editPageState.denoCollection.forEach(denom => {
        const selected = parseInt(denom.key) === banknote.denoId ? 'selected' : '';
        priceSelect.innerHTML += `<option value="${denom.key}" data-text="${denom.text}" ${selected}>${denom.text}</option>`;
    });

    updatePriceTypeBadge(banknote.denoId);

    document.getElementById('editoldCountBundle').value = banknote.bankNoteQty || 0;
    document.getElementById('editoldCountBundle').classList.remove('is-invalid');
    document.getElementById('bundleError').style.display = 'none';

    const modal = new bootstrap.Modal(document.getElementById('editBankNoteModal'));
    modal.show();
}

function updatePriceTypeBadge(value) {
    const badge = document.getElementById('priceTypeBadge');
    if (!badge) return;

    if (!value || value === '') {
        badge.textContent = '-';
        badge.className = 'qty-badge';
        return;
    }

    const deno = editPageState.denoCollection?.find(f => f.key == value);
    const displayText = deno ? deno.text : value;

    badge.textContent = displayText;
    badge.className = `qty-badge qty-${displayText}`;
}

function validateBundleInput() {
    const input = document.getElementById('editoldCountBundle');
    const errorDiv = document.getElementById('bundleError');
    const value = parseFloat(input.value);

    if (!input.value || value < 0 || value > 999 || isNaN(value)) {
        input.classList.add('is-invalid');
        errorDiv.style.display = 'block';
        return false;
    } else {
        input.classList.remove('is-invalid');
        errorDiv.style.display = 'none';
        return true;
    }
}

function handleInputSelect(name) {
    $('#barcodeErrorModal').on('hidden.bs.modal', function () {
        $(name).focus().select();
    });
}

function updateBankNote() {
    if (!validateBundleInput()) {
        return;
    }

    const bankCode = document.getElementById('editBankNote').value;
    const denomination = document.getElementById('editPriceType').value;
    const bundle = document.getElementById('editoldCountBundle').value;

    if (!bankCode || !denomination || !bundle) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    // Validate duplicate bank + denomination in the same container
    if (selectedContainerIndex === null) return;
    const container = editPageState.sendUnsortData[selectedContainerIndex];
    if (!container) return;

    const newInstId = parseInt(bankCode);
    const newDenoId = parseInt(denomination);

    const duplicate = (container.unsortCC || []).some(item =>
        item.unsortCCId !== editingBanknoteId &&
        item.instId === newInstId &&
        item.denoId === newDenoId &&
        item.isActive !== false
    );
    if (duplicate) {
        showErrorModal('มีธนาคาร และ ชนิดราคา นี้ในภาชนะแล้ว');
        return;
    }

    // Update object directly
    const banknote = container.unsortCC.find(b => b.unsortCCId === editingBanknoteId);
    if (!banknote) return;

    // Validate new bundle ต้องไม่มากกว่าจำนวนมัดเดิม
    if (parseInt(bundle) > banknote.bankNoteQty) {
        handleInputSelect('#editoldCountBundle');
        showErrorModal('จำนวนมัดต้องไม่มากกว่า จำนวนมัดเดิม');
        return;
    }

    const selectedBank = editPageState.bankCollection.find(b => parseInt(b.id) === newInstId);
    const selectedDeno = editPageState.denoCollection.find(d => parseInt(d.key) === newDenoId);

    banknote.instId = newInstId;
    banknote.instNameTh = selectedBank ? selectedBank.name : banknote.instNameTh;
    banknote.denoId = newDenoId;
    banknote.denoPrice = selectedDeno ? selectedDeno.text : banknote.denoPrice;
    banknote.bankNoteQty = parseInt(bundle);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editBankNoteModal'));
    editModal.hide();

    // Re-render banknote table
    renderBanknoteTable(container.unsortCC);

    editingBanknoteId = null;
}

// ==================== Delete Banknote ====================

function confirmDeleteBanknote(unsortCCId) {
    deletingBanknoteId = unsortCCId;

    const confirmModal = new bootstrap.Modal(document.getElementById('ConfirmDeleteModal'));
    confirmModal.show();
}

function executeDeleteBanknote() {
    if (selectedContainerIndex === null) return;
    const container = editPageState.sendUnsortData[selectedContainerIndex];
    if (!container) return;

    const note = container.unsortCC.find(b => b.unsortCCId === deletingBanknoteId);
    if (note) {
        note.isActive = false;

        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('ConfirmDeleteModal'));
        confirmModal.hide();

        // Re-render banknote table (isActive=false items will be filtered out)
        renderBanknoteTable(container.unsortCC);
    }

    deletingBanknoteId = null;
}

// ==================== Edit Container (Barcode) ====================

function editContainer(index) {
    const item = editPageState.sendUnsortData[index];
    if (!item) return;

    editingContainerId = index;

    document.getElementById("oldContainer").value = item.containerCode || '';
    document.getElementById("editContainer").value = item.containerCode || '';

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

async function updateContainer() {
    const newBarcode = document.getElementById("editContainer").value.trim();

    if (newBarcode === "") {
        alert("กรุณาระบุบาร์โค้ด");
        return;
    }

    if (editingContainerId === null) return;
    const containerItem = editPageState.sendUnsortData[editingContainerId];
    if (!containerItem) return;

    const requestBody = {
        sendUnsortData: {
            sendDataId: containerItem.sendDataId || 0,
            sendUnsortId: containerItem.sendUnsortId || 0,
            registerUnsortId: containerItem.registerUnsortId || 0,
            containerCode: newBarcode,
            createdDate: containerItem.createdDate || null,
            statusId: containerItem.statusId || 0,
            statusName: containerItem.statusName || '',
            canEdit: containerItem.canEdit || false,
            isOldData: containerItem.isOldData || false,
            isSelected: containerItem.isSelected || false,
            unsortCC: (containerItem.unsortCC || []).map(note => ({
                unsortCCId: note.unsortCCId || 0,
                instId: note.instId || 0,
                instNameTh: note.instNameTh || '',
                denoId: note.denoId || 0,
                denoPrice: note.denoPrice || '',
                bankNoteQty: note.bankNoteQty || 0,
                createdDate: note.createdDate || null,
                isActive: note.isActive !== undefined ? note.isActive : true,
                canEdit: note.canEdit || false,
                canDelete: note.canDelete || false
            }))
        }
    };

    try {
        const response = await editBarcodeContainerSendUnsortData(requestBody);
        if (response && response.is_success) {
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();

            await loadEditSendUnsortDelivery();
        } else {
            showErrorModal(response?.msg_desc || 'เกิดข้อผิดพลาดในการแก้ไขบาร์โค้ดภาชนะ');
        }
    } catch (err) {
        console.error('EditBarcodeContainerSendUnsortData failed:', err);
        showErrorModal('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    }
}

function editBarcodeContainerSendUnsortData(requestBody) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'TransactionSendUnsortCC/EditBarcodeContainerSendUnsortData',
            type: 'POST',
            parameter: requestBody,
            enableLoader: true,
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

// ==================== Confirm / Save ====================

function confirmCreateDelivery() {
    const confirmModal = new bootstrap.Modal(document.getElementById('ConfirmSaveModal'));
    confirmModal.show();
}

async function executeSaveDelivery() {
    const confirmModalElement = document.getElementById('ConfirmSaveModal');
    const confirmModal = bootstrap.Modal.getInstance(confirmModalElement);
    confirmModal.hide();

    // Check if any SELECTED container has no ACTIVE banknotes
    const containersWithoutBanknotes = [];
    
    for (const item of editPageState.sendUnsortData) {
        // Only check containers that are selected (isSelected === true)
        const isSelected = item.isSelected === true || item.isSelected === 'true';
        
        // Count active banknotes (isActive !== false)
        const activeBanknotes = (item.unsortCC || []).filter(note => note.isActive !== false);
        const hasNoBanknotes = activeBanknotes.length === 0;
        
        if (isSelected && hasNoBanknotes) {
            containersWithoutBanknotes.push(item.containerCode);
        }
    }

    // If there are containers without banknotes, show warning
    if (containersWithoutBanknotes.length > 0) {
        const barcodeList = containersWithoutBanknotes.join(', ');
        const warningMessage = `ไม่มีธนบัตรอยู่ในภาชนะ ${barcodeList} แล้ว`;
        
        // Show warning modal (reuse barcodeErrorModal)
        document.getElementById('barcodeErrorMessageText').innerText = warningMessage;
        
        // Change button to just "ตกลง" - user can only close, cannot proceed
        const modalFooter = document.querySelector('#barcodeErrorModal .modal-footer');
        modalFooter.innerHTML = `
            <button type="button" class="btn btn-blue" data-bs-dismiss="modal">ตกลง</button>
        `;
        
        const warningModal = new bootstrap.Modal(document.getElementById('barcodeErrorModal'));
        warningModal.show();
        return; // Stop here - cannot proceed
    }

    // If no empty containers, proceed directly
    await proceedSaveDelivery();
}

async function proceedSaveDelivery() {
    // Sync isSelected state from checkboxes before sending
    updateSelectionState();

    // Build request body with all fields
    const requestBody = {
        sendUnsortId: currentWaybill.sendUnsortId || 0,
        sendUnsortCode: currentWaybill.sendUnsortCode || '',
        statusId: currentWaybill.statusId || 0,
        departmentId: currentWaybill.departmentId || parseInt(currentDepartmentId) || 0,
        userId: currentWaybill.userId || 0,
        sendUnsortData: editPageState.sendUnsortData.map(item => ({
            sendDataId: item.sendDataId || 0,
            sendUnsortId: item.sendUnsortId || 0,
            registerUnsortId: item.registerUnsortId || 0,
            containerCode: item.containerCode || '',
            createdDate: item.createdDate || null,
            statusId: item.statusId || 0,
            statusName: item.statusName || '',
            canEdit: item.canEdit || false,
            isOldData: item.isOldData || false,
            isSelected: item.isSelected || false,
            unsortCC: (item.unsortCC || []).map(note => ({
                unsortCCId: note.unsortCCId || 0,
                instId: note.instId || 0,
                instNameTh: note.instNameTh || '',
                denoId: note.denoId || 0,
                denoPrice: note.denoPrice || '',
                bankNoteQty: note.bankNoteQty || 0,
                createdDate: note.createdDate || null,
                isActive: note.isActive !== undefined ? note.isActive : true,
                canEdit: note.canEdit || false,
                canDelete: note.canDelete || false
            }))
        }))
    };

    try {
        const response = await confirmEditSendUnsortDelivery(requestBody);
        if (response && response.is_success) {
            document.getElementById('successModalMessage').innerText = 'แก้ไขใบนำส่งสำเร็จแล้ว';
            const successModal = new bootstrap.Modal(document.getElementById('editSuccessModal'));
            successModal.show();
        } else {
            showErrorModal(response?.msg_desc || 'เกิดข้อผิดพลาดในการแก้ไขใบนำส่ง');
        }
    } catch (err) {
        console.error('ConfirmEditSendUnsortDelivery failed:', err);
        showErrorModal('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    }
}

function confirmEditSendUnsortDelivery(requestBody) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'TransactionSendUnsortCC/ConfirmEditSendUnsortDelivery',
            type: 'POST',
            parameter: requestBody,
            enableLoader: true,
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

// ==================== Close Modals ====================

function closeAllModals() {
    const successModalElement = document.getElementById('editSuccessModal');
    const successModal = bootstrap.Modal.getInstance(successModalElement);
    if (successModal) successModal.hide();

    // Redirect to RegisterUnsortDeliver page after successful edit
    window.location.href = '/PrePreparationUnsort/RegisterUnsortDeliver';
}

function goBack() {
    window.location.href = '/PrePreparationUnsort/RegisterUnsortDeliver';
}

// ==================== Error Modal ====================

function showErrorModal(message) {
    const errorSpan = document.getElementById("barcodeErrorMessageText");
    if (errorSpan) {
        errorSpan.innerText = message || "เกิดข้อผิดพลาด";
    }

    const modalElement = document.getElementById("barcodeErrorModal");
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// ==================== Date Picker (Filter Section) ====================

function toLocalISOString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}

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

function getEditDateRangeISO() {
    const startDate = parseThaiDate(document.getElementById('editFilterDateStart')?.value);
    const endDate = parseThaiDate(document.getElementById('editFilterDateEnd')?.value);

    const now = new Date();
    const startDt = startDate || now;
    const endDt = endDate || now;

    startDt.setHours(0, 0, 0, 0);
    endDt.setHours(23, 59, 59, 0);

    return {
        startDate: toLocalISOString(startDt),
        endDate: toLocalISOString(endDt)
    };
}

function initDatePickerForEdit() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const startEl = document.getElementById('editFilterDateStart');
    const endEl = document.getElementById('editFilterDateEnd');
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
                const oneMonthLater = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
                const currentEnd = parseThaiDate(endEl.value);
                let newEnd = (currentEnd && selectedDate <= currentEnd) ? currentEnd : new Date(selectedDate);
                if (newEnd > oneMonthLater) newEnd = oneMonthLater;
                endEl.value = formatThaiDate(newEnd);
            }
            loadEditDataWithDates();
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
                const oneMonthBefore = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate());
                const currentStart = parseThaiDate(startEl.value);
                let newStart = (currentStart && selectedDate >= currentStart) ? currentStart : new Date(selectedDate);
                if (newStart < oneMonthBefore) newStart = oneMonthBefore;
                startEl.value = formatThaiDate(newStart);
            }
            loadEditDataWithDates();
        }
    });

    // โหลดข้อมูลครั้งแรก
    loadEditDataWithDates();
}

function loadEditDataWithDates() {
    const dates = getEditDateRangeISO();
    loadEditSendUnsortDelivery(dates.startDate, dates.endDate);
}

function resetEditDateToNow() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const startEl = document.getElementById('editFilterDateStart');
    const endEl = document.getElementById('editFilterDateEnd');
    if (startEl) startEl.value = formatThaiDate(oneMonthAgo);
    if (endEl) endEl.value = formatThaiDate(now);
    loadEditDataWithDates();
}

// ==================== Barcode Filter ====================

function populateBarcodeDropdown(containers) {
    const ddl = document.getElementById('ddlContainerFilter');
    if (!ddl) return;
    ddl.innerHTML = '<option value="">-- ทั้งหมด --</option>';
    const uniqueCodes = [...new Set(containers.map(c => c.containerCode).filter(Boolean))];
    uniqueCodes.forEach(code => {
        ddl.innerHTML += `<option value="${code}">${code}</option>`;
    });
    ddl.disabled = false;
}

function executeContainerFilter() {
    const filterValue = document.getElementById('ddlContainerFilter')?.value || '';
    const filtered = filterValue === ''
        ? allSendUnsortData
        : allSendUnsortData.filter(c => c.containerCode === filterValue);

    editPageState.sendUnsortData = filtered;
    renderContainerTable(filtered);
    showEmptyBanknoteTable();
}

// ==================== Utility ====================

function formatDateThai(dateValue) {
    if (!dateValue) return '';

    const d = new Date(dateValue);
    if (isNaN(d)) return dateValue;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543;
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}`;
}
