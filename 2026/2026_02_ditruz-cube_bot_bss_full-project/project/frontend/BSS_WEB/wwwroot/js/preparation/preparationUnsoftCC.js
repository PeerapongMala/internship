let remainQty = 0;
let responseBranchState = false;
let stepCount = 1;
let bankobject = {};
let cbmsSelected = {};
let unsoftCCBarcodeCheck = {};
let isResettingSelect = false;
const barcodeSteps = [
    { stepIndex: 1, inputId: "barcodeContainerInput" },
    //{ stepIndex: 2, inputId: "bankAmountInput", inputClass: 'bankInfo' },
    { stepIndex: 2, inputId: "bankInput", inputClass: 'bankInfo' },
    { stepIndex: 3, inputId: "barcodeHeaderCardInput" }
];
let tableData = [];
let totalQtyByContainer = 0;

// FirstScan tracking
let isFirstScan = true;
let targetBundleCount = 0;
let currentScanCount = 0;
let bundleCountByPackage = 0;

let isSyncingCashBranch = false;
let packageBarcode = '';

// store created transactionPreparations for later comparison when deleting
let createdTransactionPreparations = [];

// guard to prevent re-entrant handling when bundle counts overflow
let isProcessingBundleOverflow = false;

// bankAmountInput track less or more than input
let isLessOrMoreThanBankAmount = false;

window.pageState = window.pageState || {
    unsortCCCollection: [],
    currentUnsortCC: null,
    computed: { instIds: [], denomIds: [] },
    cashCollectionByZone: [],
    cashCollectionByBank: [],
    bankCollection: [],
    currentBank: null,
    denoCollection: [],
    currentDeno: null,
    zoneCollectionMaster: [],
    zoneCollection: [],
    currentZone: null,
    cashCollection: [],
    currentCash: null,
    cashCenterCollection: [],
    currentCashCenter: null,
    selected: { bankId: 0, denominationId: 0, zoneId: 0, cashpointId: 0, cashCenterId: 0, },
    header: { registerUnsortId: 0, containerCode: "", departmentId: 0, statusId: 0, receivedDate: null },
    isScannedContainerConflict: false,
    scannedContainerId: '',
    scannedContainerConflictText: '',
    denoByBankCollection: []
};

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || 0;
const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;
const { MAIL_TYPE } = window.APP.CONST;

const tempDeleteData = {
    prepareIds: [],
    remark: "",
    updatedBy: 0,
    refCode: ""
};

const deleteSelection = { supervisorId: "", supervisorName: "" };

const tableState = {
    pageNumber: 1,
    pageSize: 0,
    search: '',
    sorts: [{ field: "createdDate", dir: "desc" }]
};
async function reloadTable() {
    await loadPreparationUnsortCCs(
        tableState.pageNumber,
        tableState.pageSize,
        tableState.search
    );
}

window.addEventListener('load', async () => {
    $.enablePageLoader();

    try {
    await Promise.all([
        initComponent(),
        loadPreparators(),
        loadSupervisors()
    ]);

    document.getElementById('selectAll').addEventListener('change', function () {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
        updateSelectedCount();
    });

    initBarcodeFocusWorkflow();

    initSelect2InModal('#editModal', '#editCreatedBy', '-- กรุณาเลือก --', (val) => {
        const prep = (preparator ?? []).find(x => String(x.id) === String(val));
        console.log(prep);

        tempEditData.newCreatedBy = prep ? prep.id : 0;
        tempEditData.newCreatedByName = prep ? prep.name : '';
    }, { dropdownParent: 'body' });

    initSelect2InModal('#editMultipleModal', '#multiEditCreatedBy', '-- กรุณาเลือก --', (val) => {
        const prep = (preparator ?? []).find(x => String(x.id) === String(val));
        tempEditData.newCreatedBy = prep ? prep.id : 0;
        tempEditData.newCreatedByName = prep ? prep.name : '';
    }, { dropdownParent: 'body' });

    initSelect2InModal('#confirmModal', '#supervisorName', '-- กรุณาเลือก --', (val) => {
        const sup = (supervisors ?? []).find(x => String(x.id) === String(val));
        tempEditData.supervisorId = sup ? sup.id : 0;
        tempEditData.supervisorName = sup ? sup.name : '';
    }, { dropdownParent: 'body' });

    initSelect2InModal('#deleteConfirmModal', '#deleteSupervisorSelect', '-- กรุณาเลือก --', (val) => {
        const sup = (supervisors ?? []).find(x => String(x.id) === String(val));
        deleteSelection.supervisorId = sup ? sup.id : 0;
        deleteSelection.supervisorName = sup ? sup.name : '';
    }, { dropdownParent: 'body' });

    }
    catch (err) {
        console.error(err);
    }
    finally {
        $.disablePageLoader();
    }
});
function clearAllTempData() {
    clearTempDeleteData();
    clearTempEditData();
}
function showCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // เดือนเริ่มที่ 0
    const year = now.getFullYear() + 543; // แปลงเป็น พ.ศ.

    const hours = String(now.getHours()).padStart(2, '0'); // เวลาแบบ 24 ชม.
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    //Date/Time: 15/11/2568 15:45:00
    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    document.getElementById("info-current-datetime").textContent = formatted;
}

// อัปเดตทุก 1 วินาที
setInterval(showCurrentDateTime, 1000);
showCurrentDateTime();

async function initComponent() {
    $.enablePageLoader();
    await reloadTable();

    $.disablePageLoader();
}

function clearTempDeleteData() {
    tempDeleteData.prepareIds = [];
    tempDeleteData.remark = "";
    tempDeleteData.updatedBy = 0;
    tempDeleteData.refCode = "";
}

function clearTempEditData() {
    tempEditData.id = null;
    tempEditData.selectedIds = [];
    tempEditData.isMultiEdit = false;
    tempEditData.isDelete = false;
    tempEditData.deleteIds = [];
    tempEditData.oldHeader = "";
    tempEditData.oldCreatedBy = 0;
    tempEditData.oldCreatedByName = "";
    tempEditData.newHeader = "";
    tempEditData.newCreatedBy = 0;
    tempEditData.newCreatedByName = "";
    tempEditData.remark = "";
    tempEditData.supervisorName = "";
}

function clearSelectionState() {
    document.querySelectorAll('.row-checkbox').forEach(x => x.checked = false);

    updateSelectedCount?.();
}

let tempEditData = {
    id: null,
    selectedIds: [],
    isMultiEdit: false,
    isDelete: false,
    deleteIds: [],
    oldHeader: '',
    oldCreatedBy: 0,
    oldCreatedByName: '',
    newHeader: '',
    newCreatedBy: 0,
    newCreatedByName: '',
    remark: '',
    supervisorName: '',
    barcode: '',
    wrapCode: '',
    bundleCode: ''
};

let tempCbmsData = {
    receiveId: 0,
    departmentId: 0,
    departmentName: '',
    bnTypeInput: '',
    containerId: '',
    institutionShortName: '',
    denominationPrice: '',
    qty: 0,
    remainingQty: 0,
    unfitQty: 0,
    bankCode: '',
    cashCenterName: '',
    zoneName: ''
};

function clearTempCbms() {
    tempCbmsData = {
        receiveId: 0,
        departmentId: 0,
        departmentName: '',
        bnTypeInput: '',
        containerId: '',
        institutionShortName: '',
        denominationPrice: '',
        qty: 0,
        remainingQty: 0,
        unfitQty: 0,
        bankCode: '',
        cashCenterName: '',
        zoneName: ''
    };
}



let countdown = 300;
let timerInterval = null;
let deleteCountdown = 300;
let deleteTimerInterval = null;

function getPreparationUnsortCCsAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PreparationUnsortCC/GetPreparationUnsortCCsDetailAsync',
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
async function loadPreparationUnsortCCs(pageNumber = 1, pageSize = 0, search = '') {
    try {
        const requestData = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search,
            sorts: [
                { field: "createdDate", dir: "desc" }
            ]
        };

        const response = await getPreparationUnsortCCsAsync(requestData);

        const items = response?.items || response?.data?.items || response?.data || [];
        const totalCount = response?.totalCount || response?.data?.totalCount || items.length;

        tableData = mapApiToData(items);

        renderTable();

        setupDropdownforSecondScreen();

    } catch (err) {
        console.error(err);
        showBarcodeErrorModal("โหลดข้อมูลไม่สำเร็จ");
    }
}

function renderSupervisorDropdown() {
    const select = document.getElementById("supervisorName");
    if (!select) return;
    select.innerHTML = '<option value="" style="color:#999;">Please select</option>';
    mocdataSupervisor.forEach(sup => {
        const option = document.createElement("option");
        option.value = sup.name;
        option.textContent = sup.name;
        select.appendChild(option);
    });
}

function formatDateThai(dateValue) {
    if (!dateValue) return '';

    const d = new Date(dateValue);
    if (isNaN(d)) return dateValue;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543; // ปี พ.ศ.
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}.${minute}`;
}

function mapApiToData(items) {

    return (items || []).map(x => ({
        id: x.prepareId ?? x.id ?? 0,
        unsortCCId: x.unsortCCId ?? 0,
        header: x.headerCardCode ?? '',
        bank: x.bank ?? x.bankCode ?? '',
        cashpoint: x.cashpointName ?? x.cashPointName ?? '',
        qty: x.qty ?? x.denominationPrice ?? 0,
        barcode: x.barcode ?? x.containerCode ?? '',
        date: formatDateThai(x.createdDate),
        createdBy: x.createdBy ?? '',
        createdByName: x.createdByName ?? '',
        zoneId: x.zoneId ?? 0,
        zoneName: x.zoneName ?? 0,
        updateBy: x.updatedBy ?? '',
        isFlag: x.isFlag ?? true
    }));
}
function renderTable() {

    let html = '';
    const scannedId = String(pageState.scannedContainerId || '').trim();
    const hasConflict = pageState.isScannedContainerConflict === true;

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    tableData.forEach(item => {
        const dangerClass = item.isFlag === false ? 'row-danger' : '';
        const qtyClass = `qty-${item.qty}`;

        const rowContainer = String(item.barcode || '').trim();
        const isLocked = hasConflict && scannedId && rowContainer === scannedId;
        const tooltipMsg = (pageState.scannedContainerConflictText || '').replace(/"/g, '&quot;'); // กัน quote พัง

        const disabledAttr = isLocked ? 'disabled aria-disabled="true"' : '';

        const hideCheckboxAttr = isLocked ? '' : `<input type="checkbox" class="row-checkbox" data-id="${item.id}" onchange="updateSelectedCount()">`;


        html += `
                    <tr class="${dangerClass}">
                         <td>
                         ${hideCheckboxAttr}
                        </td>
                        <td>${item.header} ${isLocked ? `<i class="bi bi-exclamation-triangle-fill text-warning ms-2" title="${tooltipMsg || 'พบการ prepare จากเครื่องอื่น'}"></i>` : ''}
                        </td>
                        <td>${item.bank}</td>
                        <td>${item.zoneName}</td>
                        <td>${item.cashpoint}</td>
                         <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                        <td>${item.date}</td>
                        <td>${item.barcode}</td>
                        <td>
                            <div class="action-btns">
                                <button class="btn-action" onclick="editRow(${item.id})" ${disabledAttr}><i class="bi bi-pencil"></i></button>
                                <button class="btn-action btn-danger" onclick="deleteRow(${item.id})" ${disabledAttr}><i class="bi bi-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
    });

    tbody.innerHTML = html;
    // updateCounts();
}

function renderBarcodeCard() {
    const tbody = document.getElementById('barcodeListBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const unsort = pageState.currentUnsortCC;
    if (!unsort) return;

    // 1️⃣ หา denomination จาก denoCollection
    const denoId = unsort.denoId ?? unsort.denominationId;
    const deno = (pageState.denoCollection || [])
        .find(d => d.key === denoId);

    const denoPrice = Number(deno?.text || 0);


    const totalQty = Number(unsort.banknoteQty || 0);
    const remainingQty = Number(unsort.remainingQty || 0);
    const usedQty = Math.max(totalQty - remainingQty, 0);


    const bundle = usedQty > 0
        ? usedQty
        : 0;

    const bankCode = pageState.currentBank.code ?? '-';
    const qtyDisplay = `${denoPrice}`;
    const qtyClass = `qty-${denoPrice}`;

    document.getElementById('containerSideCard').innerHTML = pageState.unsortCCHeader.containerCode;
    tbody.innerHTML = `
        <tr>
            <td style="text-align: left;">${bankCode}</td>
            <td style="text-align: right;">
                <span class="qty-badge ${qtyClass}">
                    ${qtyDisplay}
                </span>
            </td>
            <td style="text-align: right;">${remainingQty}</td>
        </tr>
    `;
}

async function updateStateBarcodeListTableAsync(containerBarcode) {
    const req = { departmentId: 1, companyId: 1, containerId: containerBarcode };
    const res = await checkUnsoftCCBarcode(req);

    const ok = res?.is_success === true || res?.isSuccess === true;
    const errorMessage = res?.msg_desc ? res?.msg_desc : 'รูปแบบบาร์โค้ดไม่ถูกต้อง'
    const dataArray = ok && Array.isArray(res.data) ? res.data : [];

    if (dataArray.length === 0) { showBarcodeErrorModal(errorMessage); return false; }

    const { rows } = extractUnsortCCIdsFromResponse(dataArray);
    pageState.unsortCCCollection = rows;
}

async function updateBarcodeListTableAsync() {

    const barcodeContainer = document.getElementById("barcodeContainerInput").value.trim();
    const tbody = document.getElementById("barcodeListBody");


    let sortUnsortCCData = pageState.unsortCCCollection.sort((a, b) => {
        // 1. institutionId ASC
        r = a.instId - b.instId;
        if (r !== 0) return r;

        // 2. denominationId ASC
        return a.denoId - b.denoId;
    });


    tbody.innerHTML = '';

    if (sortUnsortCCData != null && sortUnsortCCData.length > 0) {
        sortUnsortCCData
            .filter(item => item?.remainingQty !== 0)
            .forEach(item => {

            const denoId = item.denoId ?? item.denominationId;
            const deno = (pageState.denoCollection || []).find(d => d.key === denoId);
            const denoPrice = Number(deno?.text || 0);

            const bankId = item.instId;
            const bankData = (pageState.bankCollection || []).find(d => d.id === bankId);
            const bankCode = bankData.code ?? '-';

            const remainingQty = Number(item.remainingQty || 0);
            const qtyDisplay = `${denoPrice}`;

            const qtyClass = `qty-${denoPrice}`;

            tbody.innerHTML += `

        <tr>
            <td style="text-align: left;">${bankCode}</td>
            <td style="text-align: right;">
                <span class="qty-badge ${qtyClass}">
                    ${qtyDisplay}
                </span>
            </td>
            <td style="text-align: right;">${remainingQty}</td>
        </tr>
        `;
        });
    }

    // อัพเดตชื่อภาชนะใน sidebar
    const sidebarContainerName = document.getElementById('containerSideCard');
    if (sidebarContainerName) {
        sidebarContainerName.textContent = barcodeContainer || '-';
    }

}

function updateCounts() {
    document.getElementById('prepareCount').textContent = `${tableData.length} / 10`;
    // document.getElementById('bundleCount').textContent = mockData.length;
}

async function refreshData() {
    $.enablePageLoader();
    await reloadTable();
    $.disablePageLoader();

    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
}

function deleteAll() {
    if (confirm('ต้องการลบทั้งหมด?')) {
        mockData = [];
        renderTable();
    }
}

function closeAllDeleteModals() {
    const modals = ['deleteSuccessModal', 'deleteOtpModal', 'deleteConfirmModal', 'confirmDeleteModal', 'DeleteModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    });

    document.getElementById("otpErrorMsg").innerText = "";

    clearTempData();
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 300);
}

function backToConfirmDelete() {
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }, 300);
}

function backToDeleteConfirm() {
    clearInterval(deleteTimerInterval);
    document.getElementById('deleteOtpTimer').innerText = '';
    document.getElementById('deleteOtpInput').disabled = true;
    document.getElementById('deleteOtpErrorMsg').innerText = '';

    bootstrap.Modal.getInstance(document.getElementById('deleteOtpModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }, 300);
}

function renderPreparatorDropdownForEdit(isMultiEdit = false) {
    const selectSingle = document.getElementById("editCreateBy");
    const selectMulti = document.getElementById("multiEditCreateBy");

    if (selectSingle) {
        selectSingle.innerHTML = ''; // ไม่มี please select
        preparator.forEach(prep => {
            const option = document.createElement("option");
            option.value = prep.name;
            option.textContent = prep.name;
            selectSingle.appendChild(option);
        });
    }

    if (selectMulti) {
        // ถ้าเป็น multi edit ให้มี please select
        if (isMultiEdit) {
            selectMulti.innerHTML = '<option value="">-- please select --</option>';
        } else {
            selectMulti.innerHTML = '';
        }
        preparator.forEach(prep => {
            const option = document.createElement("option");
            option.value = prep.name;
            option.textContent = prep.name;
            selectMulti.appendChild(option);
        });
    }
}


function sendOtp() {
    document.getElementById("btnSendOtp").disabled = true;
    document.getElementById("otpInput").disabled = false;
    document.getElementById("otpInput").focus();
    document.getElementById("btnConfirmOtp").disabled = false;

    document.getElementById("otpErrorMsg").innerText = "";

    clearInterval(timerInterval);
    countdown = 300;
    runOtpTimer();

    onClickSendOtp();

}

function runOtpTimer() {
    timerInterval = setInterval(() => {
        countdown--;
        let m = Math.floor(countdown / 60);
        let s = countdown % 60;
        if (s < 10) s = "0" + s;
        document.getElementById("otpTimer").innerText = `ส่งอีกครั้งได้ใน ${m}:${s}`;
        if (countdown <= 0) {
            clearInterval(timerInterval);
            // ⭐ เปิดปุ่มส่ง OTP ใหม่
            document.getElementById("btnSendOtp").disabled = false;
            document.getElementById("otpTimer").innerText = "";
            document.getElementById("otpInput").value = ""; // ล้างค่า OTP
            document.getElementById("otpInput").disabled = true; // ปิดช่องกรอก
            document.getElementById("btnConfirmOtp").disabled = true; // ปิดปุ่มยืนยัน
            document.getElementById("otp-refcode").innerText = "";

            document.getElementById("otpErrorMsg").innerText = "รหัส OTP หมดอายุแล้ว กรุณาส่งรหัสใหม่";

        }
    }, 1000);
}

function submitOtp() {
    const otpInput = document.getElementById("otpInput").value.trim();
    const errorMsg = document.getElementById("otpErrorMsg");

    errorMsg.innerText = "";

    if (!otpInput) {
        errorMsg.innerText = "กรุณากรอกรหัส OTP";
        return;
    }
    if (otpInput.length !== 6) {
        errorMsg.innerText = "รหัส OTP ต้องมี 6 หลัก";
        return;
    }

    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNSORT_CC_EDIT,
        bssMailRefCode: tempEditData.refcode,
        bssMailOtpCode: otpInput
    })
        .done(function () {
            submitEdit();
        })
        .fail(function () {
            showBarcodeErrorModal("รหัส OTP ไม่ถูกต้อง");
            return;
        });

    renderTable();
    document.getElementById('selectAll').checked = false;
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    updateSelectedCount();

    //clearInterval(timerInterval);
}

function closeAllModals() {
    const modals = ['successModal', 'otpModal', 'confirmModal', 'editModal', 'editMultipleModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    });

    document.getElementById("otpErrorMsg").innerText = "";

    clearTempData();
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 300);
}

function backToEditModal() {
    getModal('#confirmModal')?.hide();
    if (tempEditData.isMultiEdit) {

        onceModalShown('#editMultipleModal', function () {
            $('#multiEditCreatedBy')
                .val(Number(currentUserId))
                .trigger('change');
        });

        showModal('#editMultipleModal');
        return;
    }


    showModal('#editModal');
}
function backToConfirmModal() {
    clearInterval(timerInterval);
    document.getElementById("otpTimer").innerText = "";
    document.getElementById("otpInput").disabled = true;
    document.getElementById("otpErrorMsg").innerText = "";
    document.getElementById("otpErrorMsg").innerText = "";

    bootstrap.Modal.getInstance(document.getElementById('otpModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    }, 300);
}

function confirmDeleteMultiple() {
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        if (id) selectedIds.push(id);
    });
    if (selectedIds.length === 0) {
        showBarcodeErrorModal("กรุณาเลือกรายการที่ต้องการลบ");
        return;
    }

    //if (selectedIds.length === 1) {
    //    showBarcodeErrorModal("กรุณาเลือกมากกว่า 1 รายการ สำหรับการลบหลายรายการ");
    //    return;
    //}

    tempDeleteData.prepareIds = selectedIds;

    document.getElementById('deleteCountMsg').textContent = selectedIds.length;

    getModal('#DeleteModal')?.hide();
    showModal('#confirmDeleteModal');

}

function confirmDeleteAll() {

    // ดึง id ทุก record จาก tableData
    const allIds = tableData.map(x => x.id);

    if (allIds.length === 0) {
        alert('ไม่มีรายการให้ลบ');
        return;
    }

    tempDeleteData.prepareIds = allIds;
    document.getElementById('deleteCountMsg').textContent = allIds.length;

    getModal('#DeleteModal')?.hide();
    showModal('#confirmDeleteModal');
}

function confirmSingleDelete() {

    getModal('#DeleteModal')?.hide();
    showDeleteConfirmModal();
}

function showDeleteConfirmModal() {
    document.getElementById('deleteReasonText').value = "";
    const count = tempDeleteData.prepareIds.length;
    console.log(count);
    document.getElementById('deleteListCount').textContent = count;
    console.log(tempDeleteData);

    const tbody = document.getElementById('deleteConfirmTableBody');
    tbody.innerHTML = '';

    tempDeleteData.prepareIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        const qtyClass = `qty-${item.qty}`;
        if (!item) return;
        tbody.innerHTML += `
            <tr>
               <td>
                   <div class="trash-icon-box">
                       <i class="bi bi-trash-fill"></i>
                   </div>
               </td>
                <td>${index + 1}</td>
                <td>${item.header}</td>
                <td>${item.bank}</td>
                <td>${item.cashpoint}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });

    document.getElementById('deleteReasonText').value = '';
    document.getElementById('deleteSupervisorSelect').value = '';

    // ⭐ ปิด Modal ก่อนหน้า
    const prevModal1 = bootstrap.Modal.getInstance(document.getElementById('DeleteModal'));
    const prevModal2 = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));

    if (prevModal1) prevModal1.hide();
    if (prevModal2) prevModal2.hide();

    // ⭐ รอให้ Modal ปิดก่อน แล้วค่อยเปิด Modal ใหม่
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }, 300);
}

function submitDeleteApproval() {
    const remark = document.getElementById('deleteReasonText').value.trim();
    const supervisorName = document.getElementById('deleteSupervisorSelect').value;

    if (!remark) {
        showBarcodeErrorModal("กรุณาระบุเหตุผลในการลบ");
        return;
    }
    if (!supervisorName) {
        showBarcodeErrorModal("กรุณาเลือก Supervisor");
        return;
    }

    tempDeleteData.remark = remark;

    const count = tempDeleteData.prepareIds.length;
    document.getElementById('deleteOtpListCount').textContent = count;

    const tbody = document.getElementById('deleteOtpTableBody');
    tbody.innerHTML = '';

    tempDeleteData.refCode = remark;
    tempDeleteData.prepareIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        const qtyClass = `qty-${item.qty}`;
        if (!item) return;
        tbody.innerHTML += `
            <tr>
                <td>
                   <div class="trash-icon-box">
                       <i class="bi bi-trash-fill"></i>
                   </div>
                </td>
                <td>${index + 1}</td>
                <td>${item.header}</td>
                <td>${item.bank}</td>
                <td>${item.cashpoint}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });

    document.getElementById('deleteDisplayReason').value = remark;
    document.getElementById('deleteOtpInput').value = '';
    document.getElementById('deleteOtpInput').disabled = true;
    document.getElementById('btnDeleteSendOtp').disabled = false;
    document.getElementById('btnDeleteConfirmOtp').disabled = true;
    document.getElementById('deleteOtpTimer').innerText = '';
    document.getElementById('deleteOtpErrorMsg').innerText = '';
    document.getElementById("deleteOtpRefcode").innerText = "";

    clearInterval(deleteTimerInterval);

    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('deleteOtpModal'));
        modal.show();
    }, 300);

}

function sendDeleteOtp() {
    document.getElementById('btnDeleteSendOtp').disabled = true;
    document.getElementById('deleteOtpInput').disabled = false;
    document.getElementById('deleteOtpInput').focus();
    document.getElementById('btnDeleteConfirmOtp').disabled = false;

    document.getElementById('deleteOtpErrorMsg').innerText = "";

    onClickDeleteSendOtp();
    clearInterval(deleteTimerInterval);
    deleteCountdown = 300;
    runDeleteOtpTimer();

}

function runDeleteOtpTimer() {
    deleteTimerInterval = setInterval(() => {
        deleteCountdown--;
        let m = Math.floor(deleteCountdown / 60);
        let s = deleteCountdown % 60;
        if (s < 10) s = '0' + s;

        document.getElementById('deleteOtpTimer').innerText = `ส่งอีกครั้งได้ใน ${m}:${s}`;

        if (deleteCountdown <= 0) {
            clearInterval(deleteTimerInterval);

            // ⭐ เปิดปุ่มส่ง OTP ใหม่
            document.getElementById('btnDeleteSendOtp').disabled = false;
            document.getElementById('deleteOtpTimer').innerText = '';

            // ปิดช่อง OTP และปุ่มยืนยัน
            document.getElementById('deleteOtpInput').value = ''; // ล้างค่า OTP
            document.getElementById('deleteOtpInput').disabled = true; // ปิดช่องกรอก
            document.getElementById('btnDeleteConfirmOtp').disabled = true; // ปิดปุ่มยืนยัน
            document.getElementById("deleteOtpRefcode").innerText = "";

            document.getElementById('deleteOtpErrorMsg').innerText = "รหัส OTP หมดอายุแล้ว กรุณาส่งรหัส OTP ใหม่";
        }
    }, 1000);
}

function submitDeleteOtp() {
    const otpInput = document.getElementById('deleteOtpInput').value.trim();
    const errorMsg = document.getElementById('deleteOtpErrorMsg');

    errorMsg.innerText = "";

    if (!otpInput) {
        errorMsg.innerText = "กรุณากรอกรหัส OTP";
        return;
    }
    if (otpInput.length !== 6) {
        errorMsg.innerText = "รหัส OTP ต้องมี 6 หลัก";
        return;
    }

    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_MEMBER_DELETE,
        bssMailRefCode: tempDeleteData.refCode,
        bssMailOtpCode: otpInput
    })
        .done(function () {
            submitDelete();
        })
        .fail(function () {
            showBarcodeErrorModal("รหัส OTP ไม่ถูกต้อง");
            return;
        });

}

function deleteRow(id) {
    tempDeleteData.prepareIds = [id];
    console.log(tempDeleteData.prepareIds);
    onceModalShown('#DeleteModal', function () {
        $('#multiEditCreatedBy')
            .val(Number(currentUserId))
            .trigger('change');
    });

    showModal('#DeleteModal');
}

document.getElementById('selectAll').addEventListener('change', function () {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
    updateSelectedCount();
});

function updateSelectedCount() {
    const count = document.querySelectorAll('.row-checkbox:checked').length;
    const totalDatacount = tableData.length;

    selectedCount.textContent = count;

    selectedCountText.style.display = 'inline';

    if (count === 1) {
        btnEditSelected.style.display = 'inline-block';
    } else {
        btnEditSelected.style.display = 'none';
    }

    btnDeleteMoreSelected.style.display = count >= 1 ? 'inline-block' : 'none';

    $('#selectAll').prop('checked', count === totalDatacount && totalDatacount > 0);
}

function clearTempData() {
    tempEditData = {
        id: null,
        selectedIds: [],
        isMultiEdit: false,
        isDelete: false,
        deleteIds: [],
        oldHeader: '',
        oldCreateBy: '',
        newHeader: '',
        newCreateBy: '',
        reason: '',
        supervisorName: ''
    };
}


let arrDropdownDisplayTwo = [];

function mapDropdownDisplayTwoToData(items) {

    return (items || []).map(x => ({
        code: x.cashpoint.trim() + '|' + x.bank + '|' + x.barcode + '|' + x.qty + '|' + x.zoneName.trim() ?? '',
        text: `ภาชนะ: ${x.barcode}, ธนาคาร: ${x.bank}, ศูนย์เงินสด: ${x.cashpoint.trim()} , ชนิดราคา: ${x.qty} , โซน: ${x.zoneName.trim()}` ?? '',
    }));
}

function setupDropdownforSecondScreen() {
    const select = document.getElementById("dropdownDisplayTwo");
    if (!select) return;

    select.innerHTML = '<option value="">-- กรุณาเลือก --</option>';

    //const activeTableData = tableData.filter(c => c.isFlag === true);
    const activeTableData = tableData;

    arrDropdownDisplayTwo = mapDropdownDisplayTwoToData(activeTableData);
    if (arrDropdownDisplayTwo != null && arrDropdownDisplayTwo.length > 0) {

        const distinctTableData = arrDropdownDisplayTwo.filter((value, index, self) => index === self.findIndex(v => v.code.trim() === value.code.trim()));

        distinctTableData.forEach(item => {

            const option = document.createElement("option");
            option.value = tempCbmsData.cashCenterName + '|' + tempCbmsData.bankCode + '|' + tempCbmsData.containerId + '|' + tempCbmsData.denominationPrice + '|' + tempCbmsData.zoneName;
            option.textContent = `ภาชนะ: ${tempCbmsData.containerId}, ธนาคาร: ${tempCbmsData.bankCode}, ชนิดราคา: ${tempCbmsData.denominationPrice}`;
            option.value = item.code;
            option.textContent = item.text;
            select.appendChild(option);
        });

        arrDropdownDisplayTwo = distinctTableData;
    }
}


function renderSecondScreenDropdown() {
    const select = document.getElementById("dropdownDisplayTwo");
    if (!select) return;

    const currBankCode = window.pageState.currentBank.code.trim() ?? '';
    const currContainerId = window.pageState.unsortCCHeader.containerCode.trim() ?? '';
    const currDenominationPrice = window.pageState.currentDeno.text.trim() ?? '';
    let currCashCenterName = window.pageState.currentCashCenter.name ?? '';
    let currZoneName = window.pageState.currentZone.name.trim() ?? '';

    tempCbmsData.containerId = currContainerId ?? '';
    tempCbmsData.denominationPrice = currDenominationPrice ?? 0;
    tempCbmsData.bankCode = currBankCode ?? '';
    tempCbmsData.cashCenterName = currCashCenterName ?? '';
    tempCbmsData.zoneName = currZoneName ?? '';

    const currCode = currCashCenterName + '|' + currBankCode + '|' + currContainerId + '|' + currDenominationPrice + '|' + currZoneName ?? '';
    const currText = `ภาชนะ: ${currContainerId}, ธนาคาร: ${currBankCode}, ศูนย์เงินสด: ${currCashCenterName} , ชนิดราคา: ${currDenominationPrice} , โซน: ${currZoneName}` ?? '';

    const resultDropdownDisplayTwo = arrDropdownDisplayTwo.filter(c => c.code.trim() == currCode.trim());
    if (resultDropdownDisplayTwo.length > 0) {
        $('#dropdownDisplayTwo').val(currCode).trigger('change');

    } else {
        arrDropdownDisplayTwo.push({
            code: currCode.trim(),
            text: currText
        });

        const option = document.createElement("option");
        option.value = currCode.trim();
        option.textContent = currText;
        select.appendChild(option);
        $('#dropdownDisplayTwo').val(option.value).trigger('change');
    }
}

let displayTwoCashpoint = '';
let displayTwoBankName = '';
let displayTwoDeno = '';
let displayTwoContainerId = '';
let displayTwoZone = '';
let pageTwoWindow = null;

$('#btnShowSecondScreenPreparation').click(function () {

    let screenWidth = 1440;
    let screenHeight = 900;

    let LeftPosition = (screen.width) ? (screen.width - screenWidth) / 2 : 100;
    let TopPosition = (screen.height) ? (screen.height - screenHeight) / 2 : 100;

    const rootPath = document.body.getAttribute("data-root-path");
    const pageUrl = rootPath + "Preparation/SecondScreenPreparationUnsortCC";
    let pageName = "DisplayTwoPreparationUnsortCCWindow";

    let screenSettings =
        'width=' + screenWidth +
        ',height=' + screenHeight +
        ',top=' + TopPosition +
        ',left=' + LeftPosition +
        ',scrollbars=no,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no';

    // ถ้า popup ยังเปิดอยู่
    if (pageTwoWindow && !pageTwoWindow.closed) {

        pageTwoWindow.focus();

        const doc = pageTwoWindow.document;

        if (doc && doc.getElementById('displayCashpoint')) {

            $(doc).find('#denoType').val(displayTwoDeno);
            $(doc).find('#displayCashpoint').text(displayTwoCashpoint);
            $(doc).find('#displayBankName').text(displayTwoBankName);
            $(doc).find('#displayZone').text("Z." + displayTwoZone);
            $(doc).find('#displayDeno').text("฿" + displayTwoDeno);
            $(doc).find('#displayContainerId').text(displayTwoContainerId);

            $(doc).find('#btnRefreshSecondScreen').trigger('click');
        }

        return;
    }

    // เปิด popup ใหม่
    pageTwoWindow = window.open(pageUrl, pageName, screenSettings);

    if (!pageTwoWindow) return;

    pageTwoWindow.onload = function () {

        setTimeout(function () {
            refreshSecondScreen();
        }, 200);

    };

});


$('#dropdownDisplayTwo').on('change', function () {

    let selectedValue = $(this).val();

    if (!selectedValue || selectedValue.trim() === '') {
        return;
    }

    const parts = selectedValue.split('|');

    displayTwoCashpoint = parts[0] ?? '';
    displayTwoBankName = parts[1] ?? '';
    displayTwoContainerId = parts[2] ?? '';
    displayTwoDeno = parts[3] ?? '';

    var zoneName = parts[4] ?? '';
    displayTwoZone = getZoneCode(zoneName);

    refreshSecondScreenColor(displayTwoDeno);

    $('#displaySmallCashpoint').text(displayTwoCashpoint);
    $('#displaySmallBankName').text(displayTwoBankName);
    $('#displaySmallZone').text("Z." + displayTwoZone);
    $('#displaySmallDeno').text("฿" + displayTwoDeno);
    $('#displaySmallContainerId').text(displayTwoContainerId);

    if (!pageTwoWindow || pageTwoWindow.closed) {
        return;
    }

    const doc = pageTwoWindow.document;

    // ป้องกัน DOM popup ยังไม่โหลด
    if (!doc || !doc.getElementById('displayCashpoint')) {
        return;
    }

    $(doc).find('#denoType').val(displayTwoDeno);
    $(doc).find('#displayCashpoint').text(displayTwoCashpoint);
    $(doc).find('#displayBankName').text(displayTwoBankName);
    $(doc).find('#displayZone').text("Z." + displayTwoZone);
    $(doc).find('#displayDeno').text("฿" + displayTwoDeno);
    $(doc).find('#displayContainerId').text(displayTwoContainerId);

    $(doc).find('#btnRefreshSecondScreen').trigger('click');

});

function refreshSecondScreen() {

    if (!pageTwoWindow || pageTwoWindow.closed) {

        return;
    }

    const selectedDisplayValue = $('#dropdownDisplayTwo').val();

    if (selectedDisplayValue != '') {

        const parts = selectedDisplayValue.split('|');
        displayTwoCashpoint = parts[0] ?? '';
        displayTwoBankName = parts[1] ?? '';
        displayTwoContainerId = parts[2] ?? '';
        displayTwoDeno = parts[3] ?? '';

        var zoneName = parts[4] ?? '';
        displayTwoZone = getZoneCode(zoneName);
    }
    else {
        if (tempCbmsData != null && tempCbmsData.containerId !== '') {

            displayTwoCashpoint = tempCbmsData.cashCenterName ?? '';
            displayTwoBankName = tempCbmsData.bankCode ?? '';
            displayTwoContainerId = tempCbmsData.containerId ?? '';
            displayTwoDeno = tempCbmsData.denominationPrice ?? '';

            var zoneName = tempCbmsData.zoneName ?? '';
            displayTwoZone = getZoneCode(zoneName);
        }
    }

    $(pageTwoWindow.document).find('#denoType').val(displayTwoDeno);
    $(pageTwoWindow.document).find('#displayCashpoint').text(displayTwoCashpoint);
    $(pageTwoWindow.document).find('#displayBankName').text(displayTwoBankName);
    $(pageTwoWindow.document).find('#displayZone').text("Z." + displayTwoZone);
    $(pageTwoWindow.document).find('#displayDeno').text("฿" + displayTwoDeno);
    $(pageTwoWindow.document).find('#displayContainerId').text(displayTwoContainerId);
    $(pageTwoWindow.document).find('#btnRefreshSecondScreen').click();
}

function getZoneCode(zone) {
    var zoneCode = '';

    if (window.pageState.zoneCollectionMaster != null && window.pageState.zoneCollectionMaster.length > 0) {
        var resultZone = window.pageState.zoneCollectionMaster.filter(c => c.name == zone);

        if (resultZone.length > 0) {
            zoneCode = resultZone[0].code.trim() ?? '';
        }
    }
    else {
        zoneCode = zone;
    }

    return zoneCode;
}

function refreshSecondScreenColor(deno) {

    const el = document.querySelector('.display-two-small-card-inner');
    switch (deno.trim()) {
        case "20":
            el.style.setProperty("background-color", "#F1F9F1", "important");
            el.style.setProperty("color", "#336C32", "important");
            el.style.setProperty('border', '3px solid #336C32');
            break;
        case "50":
            el.style.setProperty("background-color", "#F0F8FF", "important");
            el.style.setProperty("color", "#013665", "important");
            el.style.setProperty('border', '3px solid #013665');
            break;
        case "100":
            el.style.setProperty("background-color", "#FFE8E8", "important");
            el.style.setProperty("color", "#732E2E", "important");
            el.style.setProperty('border', '3px solid #732E2E');
            break;
        case "500":
            el.style.setProperty("background-color", "#F8F5FF", "important");
            el.style.setProperty("color", "#3D2E5B", "important");
            el.style.setProperty('border', '3px solid #3D2E5B');
            break;
        case "1000":
            el.style.setProperty("background-color", "#FBF8F4", "important");
            el.style.setProperty("color", "#4F3E2B", "important");
            el.style.setProperty('border', '3px solid #4F3E2B');
            break;
        default:
            el.style.setProperty("background-color", "#f8f9fa", "important");
            el.style.setProperty("color", "#003865", "important");
            el.style.setProperty('border', '3px solid #003865');
    }
}

function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function initBarcodeFocusWorkflow() {

    barcodeSteps.forEach((step, index) => {
        const input = document.getElementById(step.inputId);
        if (!input) return;

        input.disabled = index !== 0;


        const previewHandler = debounce(() => {

        }, 300);

        input.addEventListener('input', previewHandler);


        input.addEventListener('keydown', async (e) => {
            if (e.key !== 'Enter' && e.key !== 'Tab') return;
            e.preventDefault();
            if (input.disabled) return;

            const value = (input.value || '').trim();
            if (!value) return;

            playScannerAlarm();
            await onBarcodeInputChanged(step.stepIndex);
        });
    });

    focusStep(1);
}

function focusStep(stepIndex) {

    const amountInput = document.getElementById('bankAmountInput');

    if (amountInput && !amountInput.dataset.bound) {
        amountInput.addEventListener('input', function () {
            this.value = (this.value || '').replace(/\D/g, '');
        });
        amountInput.dataset.bound = "true";
    }

    const allFields = [
        'barcodeContainerInput',
        'bankInput',
        'cashInput',
        'branchInput',
        'zoneInput',
        'bankNoteInput',
        'notesample',
        'bankAmountInput',
        'barcodeHeaderCardInput'
    ];

    allFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });

    function enable(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });
    }

    switch (stepIndex) {

        // Step 1
        case 1:
            enable(['barcodeContainerInput']);
            document.getElementById('barcodeContainerInput')?.focus();
            document.getElementById('barcodeContainerInput')?.select();
            break;

        // Step 2
        case 2:
            enable([
                'barcodeContainerInput',
                'bankInput'
            ]);
            $('#bankInput').focus();
            break;


        // Step 3
        case 3:
            enable([
                'barcodeContainerInput',
                'bankInput',
                'cashInput',
                'branchInput',
                'zoneInput',
                'bankNoteInput',
                'notesample',
                'bankAmountInput',
                'barcodeHeaderCardInput'
            ]);
            document.getElementById('barcodeHeaderCardInput')?.focus();
            document.getElementById('barcodeHeaderCardInput')?.select();
            break;
    }
}

function progressStep2(triggerId) {
    function enable(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });
    }

    const s = pageState?.selected || {};

    switch (triggerId) {
        case 'bankInput':
            if (!s.bankId) return;
            enable(['zoneInput', 'cashInput', 'branchInput']);
            focusSelect2(zoneInput);
            break;

        case 'zoneInput':
            if (!s.zoneId) return;
            enable(['cashInput', 'branchInput']);
            focusSelect2(cashInput);
            break;

        case 'cashInput':
        case 'branchInput':
            if (!s.cashpointId) return;
            enable(['bankNoteInput', 'notesample']);
            document.getElementById('bankNoteInput')?.focus();
            focusSelect2(bankNoteInput);
            break;

        case 'bankNoteInput':
            if (!s.denominationId) return;
            enable(['bankAmountInput']);
            document.getElementById('barcodeHeaderCardInput')?.focus();
            focusSelect2(barcodeHeaderCardInput);
            break;

        case 'bankAmountInput':
            const amount = Number(document.getElementById('bankAmountInput').value);
            if (amount <= 0) return;
            checkPointsteptwo();
            break;
    }
}

function validateBarcodeStepAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/ValidateBarcodeStep',
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
function getReCdmsDataTransaction(containerId) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'ReceiveCbms/ReceiveCbmsDataTransaction?containerId=' + containerId,
            type: 'GET',
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
function getBarcodeStepAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/GetBankfromBarcode',
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
function getCountCountPrepareByContainer(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/GetCountPrepareByContainer',
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

function checkUnsoftCCBarcode(barcode) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/CheckValidateTransactionUnSortCc',
            type: 'POST',
            parameter: barcode,
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

function getPreviewGenerateBarcode(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PreparationUnsortCC/PreviewUnsortCCGenerateBarcode',
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

function createPreparationUnsortCCContainer(requestData) {
    $.enablePageLoader();
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PreparationUnsortCC/CreateContainer',
            type: 'POST',
            parameter: requestData,
            enableLoader: true,
            onSuccess: function (response) {

                handleCreatedSuccess();

                $.disablePageLoader();
                resolve(response);

            },
            onError: function (err) {
                $.disablePageLoader();
                reject(err);
            }
        });
    });
}

function confirmChangeContainerModal() {
    getModal('#ChangeContainerModal')?.hide();
    $("#prepareCount").text('0 / 0')
    onBarcodeInputChanged(1);
}

function cancelChangeContainerModal() {
    $("#barcodeContainerInput").val($('#headerContainerCode').text());
} 

function showConfirmChangeContainerModal() {
    const modalElement = document.getElementById("ChangeContainerModal");
    if (!modalElement) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (!modalElement.classList.contains("show")) {
        modal.show();
    }
}

async function checkPointsteptwo() {

    const clearAllValid = () => $('.bankInfo').removeClass('border-danger');
    clearAllValid();

    const s = window.pageState?.selected || {};
    const bankId = Number(s.bankId || 0);
    const zoneId = Number(s.zoneId || 0);
    const cashpointId = Number(s.cashpointId || 0);
    const cashCenterId = Number(s.cashCenterId || 0);
    const denomId = Number(s.denominationId || 0);

    if (bankId > 0) {
        if (zoneId <= 0) {
            $('#zoneInput').addClass('border-danger');
            return;
        }
        if (cashpointId <= 0 || cashCenterId <= 0) {
            $('#cashInput, #branchInput').addClass('border-danger');
            return;
        }
        if (denomId <= 0) {
            $('#bankNoteInput').addClass('border-danger');
            return;
        }
    }

    updateReceiveCbmsCountsAsync();

    const nextStep = stepCount + 1;
    const hasNext = barcodeSteps.some(s => s.stepIndex === nextStep);
    setPrepareCountFromUnsort();
    //renderBarcodeCard();
    if (hasNext) {
        if (nextStep == 3) {
            // renderSecondScreenDropdown();
        }
        focusStep(nextStep);
    }
}

async function onBarcodeInputChanged(stepIndex) {
    const containerBarcode = (document.getElementById("barcodeContainerInput")?.value || "").trim();
    const headerBarcode = (document.getElementById("barcodeHeaderCardInput")?.value || "").trim();
    let currentValue = "";

    // reset stored created transaction preparations on each barcode input change
    createdTransactionPreparations = [];

    //เปลี่ยนภาชนะ
    if (stepIndex === 1) {
        try {
            if ($("#barcodeContainerInput").val() != $('#headerContainerCode').text()) {
                var prepareCount = $("#prepareCount").text().trim();
                var prepareCountLeft = 0;
                var prepareCountRight = 0;

                if (prepareCount && prepareCount.includes("/")) {

                    var numbers = prepareCount.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        prepareCountLeft = parseInt(numbers[0], 10);
                        prepareCountRight = parseInt(numbers[1], 10);
                    }
                }

                if (prepareCountLeft != prepareCountRight) {
                    showConfirmChangeContainerModal();
                    return;
                }
            }
        } catch (err) {
            console.error(err);
            showBarcodeErrorModal("เกิดข้อผิดพลาดในการเปลี่ยนภาชนะ");
        }
    }

    //Normal Process
    switch (stepIndex) {
        case 1:
            currentValue = containerBarcode;
            clearStateOnContainerInput();
            break;
        case 2: {
            checkPointsteptwo();
            return;
        }
        case 3: currentValue = headerBarcode; break;
    }

    if (!currentValue) {
        return;
    }

    if (stepIndex === 1) {
        if (containerBarcode.length !== 7) {
            handleFocusStep(stepIndex);
            showBarcodeErrorModal(`บาร์โค้ดภาชนะต้องมีความยาว 7 ตัวอักษร (ปัจจุบัน: ${containerBarcode.length} ตัวอักษร)`);
            return;
        }
    }

    const requestData = {
        stepIndex: stepIndex === 3 ? stepIndex + 1 : stepIndex,
        containerBarcode: containerBarcode || null,
        wrapBarcode: null,
        bundleBarcode: null,
        headerCardBarcode: headerBarcode || null,
        bssBNTypeCode: 'UC',
        unSortCcId: pageState.currentUnsortCC?.unsortCCId || null
    };

    try {
        $.enablePageLoader();
        const response = await validateBarcodeStepAsync(requestData);

        if (!response || typeof response !== 'object') {
            showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
            return;
        }

        if (response.is_success === true || response.isSuccess === true) {

            //Validation
            if (stepIndex === 1) {
                // Validate: a-z, A-Z หรือ 0-9 เท่านั้น
                if (!/^[A-Za-z0-9]+$/.test(containerBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("บาร์โค้ดภาชนะ ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น");
                    return;
                }
            }
            else if (stepIndex === 3) {
                // Validate: ต้องเป็นตัวเลขเท่านั้น
                if (!/^\d+$/.test(headerBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("Header Card ต้องเป็นตัวเลขเท่านั้น");
                    return;
                }
            }

            //Normal Process
            var data = response.data || {};
            var isValid = data.isValid ?? data.IsValid;
            var isAllRemainingZero = data.isAllRemainingZero ?? data.IsAllRemainingZero;
            var isRemainingZero = data.isRemainingZero ?? data.IsRemainingZero;
            var errorMessage = data.errorMessage || data.ErrorMessage || "";

            if (stepIndex == 1) {
                pageState.isScannedContainerConflict = false;
                pageState.scannedContainerConflictText = "";
                pageState.scannedContainerId = containerBarcode;

                if (data.data.length > 0) {
                    var errorMachineConflictMessage = data.machineConflictMessage ?? "";
                    pageState.isScannedContainerConflict = data.machineConflictMessage != null || data.machineConflictMessage != '' ? true : false;
                    pageState.scannedContainerConflictText = errorMachineConflictMessage;

                    const items = data.data;
                    var tableDataConflict = mapApiToData(items);

                    if (tableData.length > 0) {

                        tableDataConflict.forEach((rowItem) => {
                            const existingData = tableData.filter(x => x.id === rowItem.id);
                            if (existingData.length === 0) {
                                tableData.push(rowItem);
                            }
                        });
                    }
                    else {
                        tableData = tableDataConflict;
                    }

                    renderTable();
                    showBarcodeErrorModal(errorMachineConflictMessage);
                    $("#barcodeContainerInput").focus();
                    return;
                }
            }

            if (isValid === true) {
                if (stepIndex < 3) {
                    if (stepIndex == 1) {
                        setupDropdownsFromUnsortCC(containerBarcode);
                    } else {
                        var nextStep = stepIndex + 1;
                        stepCount = nextStep;
                        var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
                        if (hasNext) {
                            focusStep(nextStep);
                        }
                    }
                } else {

                    const currBankAmountInput = (document.getElementById("bankAmountInput").value || "").trim();
                    let currAmount = parseInt(currBankAmountInput);

                    // capture current header/package code so preview uses correct packageBarcode
                    try {
                        const headerEl = document.getElementById('headerCardCodeText');
                        if (headerEl) packageBarcode = (headerEl.textContent || headerEl.innerText || '').trim();
                        else if (window.jQuery) packageBarcode = ($('#headerCardCodeText').text() || '').trim();

                        if (packageBarcode === '000000000000000000') packageBarcode = '';
                    } catch (e) {
                        console.error('failed to read headerCardCodeText for packageBarcode', e);
                    }

                    const containerPrepareRequest = {
                        unSortCcId: pageState.currentUnsortCC.unsortCCId,
                        containerCode: containerBarcode,
                        packageCode: packageBarcode,
                        headerCardCode: headerBarcode,
                        institutionId: Number(pageState.selected.bankId),
                        cashCenterId: Number(pageState.selected.cashCenterId),
                        cashpointId: Number(pageState.selected.cashpointId),
                        denominationId: Number(pageState.selected.denominationId),
                        zoneId: Number(pageState.selected.zoneId),
                        isFirstScan: isFirstScan
                    };

                    if (stepCount == 3) {
                        // Ready to insert
                        await updateReceiveCbmsCountsAsync();
                        await updateBarcodeListTableAsync();
                        return;
                    }

                    if (currAmount <= 0) {

                        showBarcodeErrorModal("เตรียมธนบัตรครบตามจำนวนมัดที่ระบุแล้ว");
                        focusStep(stepIndex);
                        return;
                    }

                    const responseCreatePreparation = await createPreparationUnsortCCContainer(containerPrepareRequest);

                    if (!responseCreatePreparation) {
                        showBarcodeErrorModal(errorMessage);
                        return;
                    }

                    clearHeaderBarcodeInput();
                    //$.enablePageLoader();

                    await loadPreparationUnsortCCs(1, 0, '');

                    // เรียก unsortCC
                    const unsortRes = await getUnsortCCDataById();

                    await updateStateBarcodeListTableAsync(containerBarcode);
                    await updateBarcodeListTableAsync();

                    //$.disablePageLoader();

                    // เอา unsortCC ใส่ pageState + set remain / usable
                    if (unsortRes?.data) {
                        pageState.currentUnsortCC = {
                            ...pageState.currentUnsortCC,
                            ...unsortRes.data
                        };

                        // usable = banknoteQty - remainingQty → prepareCount
                        let sortUnsortCCData = pageState.unsortCCCollection.sort((a, b) => {
                            // 1. institutionId ASC
                            r = a.instId - b.instId;
                            if (r !== 0) return r;

                            // 2. denominationId ASC
                            return a.denoId - b.denoId;
                        });

                        if (responseCreatePreparation.is_success === true || responseCreatePreparation.isSuccess === true) {
                            const data = responseCreatePreparation.data;
                            packageBarcode = '';
                            if (Array.isArray(data.transactionPreparation) && data.transactionPreparation.length > 0) {

                                // store created transactionPreparation items for later delete comparison
                                try {
                                    createdTransactionPreparations.push(...data.transactionPreparation);
                                } catch (e) {
                                    console.error('failed to store transactionPreparation', e);
                                }

                                // Update scan count and check if complete
                                currentScanCount++;

                                // Set isFirstScan to false after first successful scan
                                if (isFirstScan) {
                                    isFirstScan = false;
                                }

                                // update package and bundle after create preparation
                                await updateBarcodeWrapAndPackageCodeAsync();

                                if (sortUnsortCCData.length > 0) {
                                    const allRemainingZero = sortUnsortCCData.every(item => {
                                        return (item.remainingQty) === 0;
                                    });

                                    if (allRemainingZero) {
                                        clearStateAfterCheckRemaining(1);
                                        focusStep(1);
                                    }
                                    else {
                                        // If all bundles scanned, clear Step 2 inputs
                                        if (currentScanCount >= targetBundleCount) {
                                            clearStateAfterCheckRemaining(2);
                                            focusStep(2);
                                        }
                                    }
                                }
                            }
                            else {
                                bundleCountByPackage = 0;
                            }
                        }
                        // update count after create preparation
                        await updateReceiveCbmsCountsAsync();
                        await updatePrepareCount();
                    }
                    return;
                }
            } else {

                // Handle remaining zero cases
                if (isAllRemainingZero === true || isRemainingZero === true) {
                    const targetStep = isAllRemainingZero ? 1 : 2;

                    showBarcodeErrorModal(errorMessage);
                    handleClearAndFocusAfterModal(async () => {
                        // Clear inputs based on case
                        if (isAllRemainingZero) {
                            clearStateAfterCheckRemaining(1);
                        }

                        // Clear additional step 2 inputs (only for isRemainingZero)
                        if (isRemainingZero) {
                            clearStateAfterCheckRemaining(2);
                        }

                        // Update data
                        await updateStateBarcodeListTableAsync(containerBarcode);
                        await updateReceiveCbmsCountsAsync();
                        await updatePrepareCount();
                        await updateBarcodeListTableAsync();

                        // Focus to target step
                        focusStep(targetStep);
                    });
                    return;
                }

                // Normal Flow Error Message
                showBarcodeErrorModal(errorMessage);
                handleFocusStep(stepIndex);
            }
        } else {
            var msgCode = response.msg_code || response.msgCode || "";
            var msgDesc = response.msg_desc || response.msgDesc || "";

            $.sweetError({
                text: msgCode + " : " + msgDesc
            });
        }
    } catch (err) {
        console.error(err);
        showBarcodeErrorModal("เกิดข้อผิดพลาดในการตรวจสอบบาร์โค้ด");
    }
    finally {
        $.disablePageLoader();
    }
}

function showBarcodeErrorModal(message) {
    const modalElement = document.getElementById("barcodeErrorModal");
    if (!modalElement) return;

    const errorSpan = document.getElementById("barcodeErrorMessageText");
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

function getUserDepartmentId() {
    return window.currentUserDepartmentId || 0;
}
function extractUnsortCCIdsFromResponse(dataArray) {
    const list = Array.isArray(dataArray) ? dataArray : [];

    // รวมทุก transactionUnsortCCs จากทุก register
    const rows = list.flatMap(x => Array.isArray(x.transactionUnsortCCs) ? x.transactionUnsortCCs : []);

    return {
        bankIds: [...new Set(rows.map(r => Number(r.instId)).filter(Boolean))],
        denomIds: [...new Set(rows.map(r => Number(r.denoId)).filter(Boolean))],
        rows
    };
}
function getDropdownData(path, method = 'GET', requestData) {
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

async function setupDropdownsFromUnsortCC(containerBarcode) {

    const req = { departmentId: 1, companyId: 1, containerId: containerBarcode };
    const res = await checkUnsoftCCBarcode(req);

    const ok = res?.is_success === true || res?.isSuccess === true;
    const errorMessage = res?.msg_desc ? res?.msg_desc : 'รูปแบบบาร์โค้ดไม่ถูกต้อง'
    const dataArray = ok && Array.isArray(res.data) ? res.data : [];

    if (dataArray.length === 0) { showBarcodeErrorModal(errorMessage); return false; }

    const header = dataArray[0];
    const departmentId = currentDepartmentId || Number(header.departmentId || 0);

    pageState.unsortCCHeader = {
        registerUnsortId: Number(header.registerUnsortId || 0),
        containerCode: header.containerCode || "",
        departmentId: Number(header.departmentId || 0),
        statusId: Number(header.statusId || 0),
        receivedDate: header.receivedDate || null
    };

    // 3) extract ids จากทุก row (ไม่ใช่แค่ [0])
    const { bankIds, denomIds, rows } = extractUnsortCCIdsFromResponse(dataArray);
    pageState.unsortCCCollection = rows;
    pageState.computed.instIds = bankIds;
    pageState.computed.denomIds = denomIds;

    // 4) โหลดธนาคาร + denomination จาก master ด้วย id list
    const request = { tableName: "MasterInstitution", operator: "OR", searchCondition: [], selectItemCount: 200, includeData: false, departmentId };
    bankIds.forEach(id => request.searchCondition.push({ columnName: "InstitutionId", filterOperator: "EQUAL", filterValue: id }));

    const requestDeno = { tableName: "MasterDenomination", operator: "OR", searchCondition: [], selectItemCount: 200, includeData: false, departmentId };
    denomIds.forEach(id => requestDeno.searchCondition.push({ columnName: "DenominationId", filterOperator: "EQUAL", filterValue: id }));

    const responseBank = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);
    const responseDeno = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', requestDeno); // ถ้าของคุณใช้ endpoint เดิมจริง ๆ ค่อยเปลี่ยน


    pageState.bankCollection = responseBank.data.map(x => ({ id: x.key, name: x.text, code: x.value }));
    pageState.denoCollection = responseDeno.data;
    renderDropdown({
        selectId: 'bankInput',
        items: pageState.bankCollection,
        includeEmpty: true
    });

    initSelect2NormalWithSearch('#bankInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            pageState.selected.bankId = Number(val || 0);
            pageState.currentBank = (pageState.bankCollection || [])
                .find(x => Number(x.id) === pageState.selected.bankId) || null;

            clearStateFieldInput(1);

            if (pageState.currentBank) {
                await onBankSelectedLoadZoneCashpointBranch(pageState.currentBank.id, currentDepartmentId);
            }

            //await onBankSelectedSetDenoByBank();
            updateCurrentUnsortCCAndBundle();
            refreshStep3Lock();
            progressStep2('bankInput');
        } finally {
                $.disablePageLoader();
        }
    });

    // auto select
    if (responseBank?.length) $('#bankInput').val(responseBank[0].value).trigger('change');
    //if (denomItems.length === 1) $('#bankNoteInput').val(denomItems[0].id).trigger('change');


    refreshStep3Lock();

    await updateBarcodeListTableAsync();
    await updatePrepareCount();

    var nextStep = stepCount + 1;
    stepCount = nextStep;
    var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
    if (hasNext) {
        focusStep(nextStep);
    }

    return true;
}
function refreshStep3Lock() {

    const ok =
        !!pageState.selected.bankId &&
        !!pageState.selected.denominationId &&
        !!pageState.selected.zoneId &&
        !!pageState.selected.cashpointId;

    lockStep3(!ok);

    if (ok) focusStep(3);
}
function lockStep3(isLocked) {
    // 1) disable input สแกน header
    const headerInput = document.getElementById("barcodeHeaderCardInput");
    if (headerInput) headerInput.disabled = isLocked;

    // 2) ใส่/ถอด class disabled ที่ step3 (ตาม UI ของคุณ)
    document.querySelector('#step3')?.classList.toggle('disabled', isLocked);

    // 3) (optional) disable กลุ่ม element ของ step3 ทั้งหมด ถ้ามี
    document.querySelectorAll('.step3-field').forEach(el => {
        el.disabled = isLocked;
    });
}

function buildDenomItemsFromCbms(denomIds) {
    const rows = pageState.cbmsCollection || [];
    return denomIds.map(id => {
        const r = rows.find(x => Number(x.denominationId) === Number(id));
        return {
            id: id,
            text: r ? String(r.denominationPrice) : String(id),
            value: id
        };
    });
}
function updateCurrentUnsortCCAndBundle() {
    const bankId = Number(pageState.selected.bankId || 0);
    const denomId = Number(pageState.selected.denominationId || 0);

    // currentUnsortCC = match inst+deno
    pageState.currentUnsortCC =
        (pageState.unsortCCCollection || []).find(x =>
            Number(x.instId) === bankId &&
            Number(x.denoId) === denomId
        ) || null;

    // qty ของ UnsortCC: ใช้ remainingQty ก่อน (ถ้าหน่วยเป็น "พัน" ก็จะเป็น bundleCount ตรงๆ)
    // ถ้า remainingQty เป็น "จำนวนใบ" ค่อยปรับสูตรทีหลังได้ แต่ตอนนี้ยึดตามข้อมูลที่คุณมี
    const qty = Number(pageState.currentUnsortCC?.remainingQty || 0);

    targetBundleCount = qty;

    if (remainQty <= 0) {
        lockHeaderCard(true);
        lockBankAmount(true);
    }

    // Set isFirstScan to true after load default bank amount
    if (!isFirstScan) {
        isFirstScan = true;
    }

    setRemainQty(qty);
    // สำหรับ UnsortCC ให้ตีความ bundleCount = qty (เพราะ API ส่ง remainingQty = 5 ในตัวอย่าง)
    // ถ้าภายหลังพบว่า qty เป็นจำนวนใบจริง ค่อยเปลี่ยนเป็น Math.floor(qty/1000)
    const bundleCount = Math.max(0, Math.floor(qty));

    pageState.computed.bundleCount = bundleCount;

    const el = document.querySelector('#bundleCountInput');
    if (el) {
        el.value = bundleCount;
        el.max = bundleCount;

        el.oninput = function () {
            const v = parseInt(this.value || "0", 10);
            if (v > bundleCount) this.value = bundleCount;
        };
    }

    checkPointsteptwo();
    refreshStep3Lock();
}

const bankInput = document.getElementById('bankAmountInput');

function setRemainQty(remainQty) {
    const display = Number(remainQty) || 0;
    bankInput.value = String(display);
}

bankInput.addEventListener('input', () => {
    //const max = Number(bankInput.dataset.max ?? bankInput.max);
    let v = Number(bankInput.value);

    if (Number.isNaN(v)) return;

    if (v < 0) bankInput.value = '0';
});

async function loadDenoByBankId() {
    const items = await loadMasterDropdownNotMap({
        cacheKey: 'MasterDenomination',
        request: {
            tableName: 'MasterDenoUnsortCc',
            operator: 'AND',
            searchCondition: [{
                columnName: 'InstId',
                filterOperator: 'EQUAL',
                filterValue: String(pageState.selected.bankId)
            }, {
                columnName: 'UnsortCcId',
                filterOperator: 'EQUAL',
                filterValue: pageState.unsortCCHeader.registerUnsortId
            }],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        },
        forceReload: true
    });
    pageState.denoCollectionByBank = mapDeno(items);
    return Array.isArray(pageState.denoCollectionByBank) ? pageState.denoCollectionByBank : [];
}

async function loadZoneByBankId() {
    const items = await loadMasterDropdownNotMap({
        cacheKey: 'MasterZone',
        request: {
            tableName: 'MasterZoneUnsortCc',
            operator: 'AND',
            searchCondition: [{
                columnName: 'InstId',
                filterOperator: 'EQUAL',
                filterValue: String(pageState.selected.bankId)
            }],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        },
        forceReload: true
    });
    pageState.zoneCollection = mapZone(items);
    return Array.isArray(pageState.zoneCollection) ? pageState.zoneCollection : [];
}

async function loadCashByZone() {
    const zid = Number(pageState.selected.zoneId || 0);

    const items = await loadMasterDropdownNotMap({
        cacheKey: `MasterCashPointWithZone:ZoneId=${zid}`,
        request: {
            tableName: 'MasterCashPointWithZone',
            operator: 'AND',
            searchCondition: [{
                columnName: 'ZoneId',
                filterOperator: 'EQUAL',
                filterValue: String(zid)
            }],
            selectItemCount: 100,
            includeData: false
        },
        forceReload: true
    });

    pageState.cashCollection = mapCashPoint(items);
    return pageState.cashCollection;
}

async function loadCashPointByBank() {
    const items = await loadMasterDropdownNotMap({
        cacheKey: 'MasterCashPoint',
        request: {
            tableName: 'MasterCashPointUnsortCc',
            operator: 'AND',
            searchCondition: [{
                columnName: 'InstId',
                filterOperator: 'EQUAL',
                filterValue: String(pageState.selected.bankId)
            }],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        },
        forceReload: true
    });
    pageState.cashCollection = mapCashPoint(items);
    return Array.isArray(pageState.cashCollection) ? pageState.cashCollection : [];
}

// MasterCashCenter
async function loadCashCenterByBank() {
    const items = await loadMasterDropdownNotMap({
        cacheKey: 'MasterCashPoint',
        request: {
            tableName: 'MasterCashCenter',
            operator: 'AND',
            searchCondition: [{
                columnName: 'DepartmentId',
                filterOperator: 'EQUAL',
                filterValue: currentDepartmentId
            }, {
                columnName: 'InstitutionId',
                filterOperator: 'EQUAL',
                filterValue: String(pageState.selected.bankId)
            }],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        },
        forceReload: true
    });
    pageState.cashCenterCollection = mapCashCenter(items);
    return Array.isArray(pageState.cashCenterCollection) ? pageState.cashCenterCollection : [];
}
function mapDeno(rows) {

    return (rows || []).map(x => ({
        id: x.key,
        name: x.text,
        value: x.value
    }));
}
function mapZone(rows) {

    return (rows || []).map(x => ({
        id: x.key,
        name: x.text,
        value: x.value
    }));
}
function mapCashCenter(rows) {

    return (rows || []).map(x => ({
        id: x.key,
        name: x.text,
        code: x.value
    }));
}
function mapCashPoint(rows) {

    return (rows || []).map(x => ({
        id: x.key,
        name: x.text,
        code: x.code,
        value: x.value
    }));
}
async function onBankSelectedLoadZoneCashpointBranch(bankId, departmentId) {
    bankId = Number(bankId || 0);
    departmentId = Number(currentDepartmentId || 0);

    const [zones, cashByBank, cashCenters, denoByBank] = await Promise.all([
        loadZoneByBankId(bankId, departmentId),
        loadCashPointByBank(bankId, departmentId),
        loadCashCenterByBank(bankId, departmentId),
        loadDenoByBankId()
    ]);

    pageState.zoneCollection = Array.isArray(zones) ? zones : [];
    pageState.cashCollectionByBank = Array.isArray(cashByBank) ? cashByBank : [];
    pageState.cashCollectionByZone = [];
    pageState.cashCenterCollection = Array.isArray(cashCenters) ? cashCenters : [];
    pageState.denoCollectionByBank = Array.isArray(denoByBank) ? denoByBank : [];

    pageState.selected.zoneId = 0;
    pageState.selected.cashpointId = 0;
    pageState.selected.cashCenterId = 0;
    pageState.currentZone = null;
    pageState.currentCash = null;
    pageState.currentCashCenter = null;

    renderDropdown({ selectId: 'zoneInput', items: pageState.zoneCollection, includeEmpty: true });
    applyCashCollection(); // render cashInput + branchInput ด้วย cashCollectionByBank เป็น default

    // Zone DDL
    initSelect2NormalWithSearch('#zoneInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            pageState.selected.zoneId = Number(val || 0);
            pageState.currentZone =
                (pageState.zoneCollection || []).find(x => Number(x.id) === pageState.selected.zoneId) || null;

            pageState.selected.cashpointId = 0;
            pageState.currentCash = null;
            clearStateFieldInput(2);

            if (pageState.currentZone) {
                // filter cashCollection ที่ value ตรงกับ zone.value
                const zoneValue = pageState.currentZone.value;
                pageState.cashCollectionByZone = (pageState.cashCollectionByBank || [])
                    .filter(c => c.value === zoneValue);
            } else {
                pageState.cashCollectionByZone = [];
            }

            applyCashCollection(); // re-render cashInput + branchInput ตาม zone ที่เลือก

            checkPointsteptwo();
            refreshStep3Lock?.();
            progressStep2('zoneInput');
        }
        finally {
            $.disablePageLoader();
        }
    });

    // Deno DDL
    renderDropdown({ selectId: 'bankNoteInput', items: pageState.denoCollectionByBank, includeEmpty: true });
    initSelect2NormalWithSearch('#bankNoteInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (!val) {
                clearStateFieldInput(5);

                pageState.selected.denominationId = 0;
                pageState.currentDeno = null;
                return;
            }

            const denominationId = Number(val);
            const currentDeno = (pageState.denoCollection || [])
                .find(x => Number(x.value) === denominationId);

            if (!currentDeno) return;

            clearStateFieldInput(5);

            const el = document.getElementById('notesample');
            el.className = 'qty-badge';
            el.classList.add('qty-' + currentDeno.text);
            el.textContent = currentDeno.text;

            pageState.selected.denominationId = denominationId;
            pageState.currentDeno = currentDeno;

            updateCurrentUnsortCCAndBundle();
            await updateBarcodeWrapAndPackageCodeAsync();
            await updateReceiveCbmsCountsAsync();
            refreshStep3Lock();
            progressStep2('bankNoteInput');
        }
        finally {
            $.disablePageLoader();
        }
    });
}

async function onBankSelectedSetDenoByBank() {

    pageState.denoByBankCollection = [];

    const bankId = pageState.selected.bankId;
    const bankObject = pageState.unsortCCCollection.filter(x => x.instId === bankId);
    if (bankObject != null) {
        bankObject.forEach((item) => {
            const denoFilter = pageState.denoCollection.find(x => Number(x.key) === item.denoId);
            if (denoFilter != null) {
                pageState.denoByBankCollectio.push(denoFilter);
            }
        });
    }
}

function applyCashCollection() {
    const cashs = (pageState.cashCollectionByZone?.length > 0)
        ? pageState.cashCollectionByZone
        : (pageState.cashCollectionByBank || []);

    pageState.cashCollection = cashs;

    renderDropdown({ selectId: 'cashInput', items: cashs, includeEmpty: true });
    renderDropdown({ selectId: 'branchInput', items: cashs, includeEmpty: true });

    // Cash DDL
    initSelect2NormalWithSearch('#cashInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (isSyncingCashBranch) return;
            isSyncingCashBranch = true;

            pageState.selected.cashpointId = Number(val || 0);
            pageState.currentCash =
                (pageState.cashCollection || []).find(x => Number(x.id) === pageState.selected.cashpointId) || null;

            // เมื่อเลือก cashpoint → sync zone ที่ value ตรงกัน
            if (pageState.currentCash) {
                const matchedZone = (pageState.zoneCollection || [])
                    .find(z => z.value === pageState.currentCash.value) || null;
                if (matchedZone) {
                    pageState.selected.zoneId = matchedZone.id;
                    pageState.currentZone = matchedZone;
                    $('#zoneInput').val(matchedZone.id).trigger('change.select2');
                }
            }

            // sync branchInput ให้ตรงกัน
            if (val) {
                $('#branchInput').val(val).trigger('change.select2');
            }

            clearStateFieldInput(4);
            refreshStep3Lock?.();
            progressStep2('cashInput');
            isSyncingCashBranch = false;
        }
        finally {
            $.disablePageLoader();
        }
    });

    // Branch DDL
    initSelect2NormalWithSearch('#branchInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (isSyncingCashBranch) return;
            isSyncingCashBranch = true;

            //pageState.selected.cashCenterId = Number(val || 0);
            //pageState.currentCashCenter =
            //    (pageState.cashCenterCollection || []).find(x => Number(x.id) === pageState.selected.cashCenterId) || null;

            pageState.selected.cashpointId = Number(val || 0);
            pageState.currentCash =
                (pageState.cashCollection || []).find(x => Number(x.id) === pageState.selected.cashpointId) || null;

            // เมื่อเลือก branch → sync zone ที่ value ตรงกัน
            if (pageState.currentCash) {
                const matchedZone = (pageState.zoneCollection || [])
                    .find(z => z.value === pageState.currentCash.value) || null;
                if (matchedZone) {
                    pageState.selected.zoneId = matchedZone.id;
                    pageState.currentZone = matchedZone;
                    $('#zoneInput').val(matchedZone.id).trigger('change.select2');
                }
            }

            // sync cashInput ให้ตรงกัน
            if (val) {
                $('#cashInput').val(val).trigger('change.select2');
            }

            clearStateFieldInput(4);
            refreshStep3Lock?.();
            progressStep2('branchInput');
            isSyncingCashBranch = false;
        }
        finally {
            $.disablePageLoader();
        }
    });
}

function setRemainQtyFromUnsort() {
    // remainingQty มาจาก transactionUnsortCCs (currentUnsortCC)
    const remainQty = Number(pageState.currentUnsortCC?.remainingQty || 0);

    // ถ้าคุณมี function setRemainQty อยู่แล้ว ใช้อันนั้น
    if (typeof setRemainQty === "function") {
        setRemainQty(remainQty);
        return;
    }

    // fallback: ถ้าไม่มี setRemainQty ให้ set ลง input/label เอง
    const el = document.querySelector('#bankAmountInput');
    if (el) {
        if ('value' in el) el.value = remainQty;
        else el.textContent = String(remainQty);
    }
}

const formatBranchIdWithOptionalQty = (state) => {
    if (!state.id) return state.text || '';

    const code = String(parseInt(state.id, 10)).padStart(5, '0');
    const hasQty = state.qty !== undefined && state.qty !== null && state.qty !== '';

    return hasQty
        ? $(`<span>${code} <small class="text-muted">(${state.qty})</small></span>`)
        : $(`<span>${code}</span>`);
};

function getUnsortCCDataById() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PreparationUnsortCC/GetById/' + pageState.currentUnsortCC.unsortCCId,
            type: 'GET',
            parameter: null,   // ⭐ สำคัญมาก
            enableLoader: false,
            onSuccess: resolve,
            onError: reject
        });
    });
}
function setPrepareCountFromUnsort() {
    const totalQty = Number(pageState.currentUnsortCC?.banknoteQty || 0);
    const remainingQty = Number(pageState.currentUnsortCC?.remainingQty || 0);

    const usedQty = Math.max(totalQty - remainingQty, 0);

    const displayText = `${usedQty} / ${totalQty}`;
    const headCode = document.querySelector('#headerContainerCode');
    headCode.textContent = pageState.unsortCCHeader.containerCode;
    const el = document.querySelector('#prepareCount');
    if (!el) return;

    if ('value' in el) el.value = displayText;
    else el.textContent = displayText;
}
function afterCreateSuccess(response) {

    console.log(afterCreateSuccess, response);
    const prep = response?.data?.transactionPreparations?.[0];
    if (!prep) return;

    // set text
    setText('#headerCardCodeText', prep.headerCardCode);
    setText('#packageCodeText', prep.packageCode);
}

function setText(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;

    if ('value' in el) el.value = value ?? '';
    else el.textContent = value ?? '';
}


function getModal(elOrSelector) {
    const el = typeof elOrSelector === 'string'
        ? document.querySelector(elOrSelector)
        : elOrSelector;

    if (!el) return null;
    return bootstrap.Modal.getOrCreateInstance(el);
}

function showModal(elOrSelector, { hideSelector = null, delay = 0 } = {}) {
    if (hideSelector) {
        const hideModal = getModal(hideSelector);
        hideModal?.hide();
    }

    const modal = getModal(elOrSelector);
    if (!modal) return;

    if (delay > 0) setTimeout(() => modal.show(), delay);
    else modal.show();
}
function onceModalShown(modalElOrSelector, callback) {
    const el = typeof modalElOrSelector === 'string'
        ? document.querySelector(modalElOrSelector)
        : modalElOrSelector;

    if (!el) return;

    el.addEventListener(
        'shown.bs.modal',
        function (event) {
            callback.call(this, event); // 👈 preserve this + event
        },
        { once: true }
    );
}
function onceModalHidden(modalElOrSelector, callback) {
    const el = typeof modalElOrSelector === 'string'
        ? document.querySelector(modalElOrSelector)
        : modalElOrSelector;

    if (!el) return;
    el.addEventListener('hidden.bs.modal', callback, { once: true });
}

function submitEdit() {
    const prepareIds = tempEditData.isMultiEdit
        ? (tempEditData.selectedIds ?? [])
        : [tempEditData.id];

    const headerCardCode = String(tempEditData.newHeader ?? '').trim();
    const updatedBy = currentUserId;
    const createdBy = Number(tempEditData.newCreatedBy) || 0;
    const remark = tempEditData.remark;

    if (createdBy <= 0 || updatedBy <= 0)
        return alert('createdBy / updatedBy must be > 0.');

    if (prepareIds.length === 0)
        return alert('At least 1 prepareId is required.');

    if (!remark)
        return toastr.error('กรุณากรอกเหตุผล (remark)');

    const requests = prepareIds.map(id => ({
        prepareId: id,
        headerCardCode,
        remark,
        updatedBy,
        createdBy
    }));

    $.requestAjax({
        service: 'PreparationUnsortCC/Edit',
        type: 'PUT',
        parameter: requests,
        enableLoader: true,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        onSuccess: function (response) {
            if (response?.is_success) {
                handleEditActionSuccess();
            } else {
                toastr.error(response?.msg_desc ?? "บันทึกไม่สำเร็จ", "Error");
            }
        }
    });
}

function submitDelete() {
    const prepareIds = [...new Set((tempDeleteData?.prepareIds ?? [])
        .map(Number)
        .filter(x => x > 0)
    )];
    if (prepareIds.length === 0) return alert('At least 1 prepareId is required.');

    const remark = String(tempDeleteData?.remark ?? '').trim();
    if (!remark) return toastr.error('กรุณากรอกเหตุผล (remark)');

    const requests = prepareIds.map(id => ({
        prepareId: id,
        remark,
        updatedBy: Number(currentUserId)
    }));

    $.requestAjax({
        service: 'PreparationUnsortCC/Delete',
        type: 'DELETE',
        parameter: requests,
        enableLoader: true,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        onSuccess: function (response) {
            try {
                if (response?.is_success) {
                    // normalize deleted items array from response
                    let deletedItems = [];
                    if (Array.isArray(response.data)) deletedItems = response.data;
                    else if (Array.isArray(response)) deletedItems = response;
                    else if (Array.isArray(response.data?.items)) deletedItems = response.data.items;

                    // compare deleted items with previously created transactionPreparation entries
                    let matchedCount = 0;
                    if (Array.isArray(deletedItems) && deletedItems.length > 0 && Array.isArray(createdTransactionPreparations)) {
                        // for each deleted item, try to remove a matching stored transactionPreparation
                        deletedItems.forEach(di => {
                            const idx = createdTransactionPreparations.findIndex(tp => Number(tp.prepareId) === Number(di.prepareId) && Number(tp.containerPrepareId) === Number(di.containerPrepareId));
                            if (idx >= 0) {
                                // remove matched prepared item so future deletes won't double-count
                                createdTransactionPreparations.splice(idx, 1);
                                matchedCount++;
                            }
                        });
                    }

                    // decrement currentScanCount by matchedCount but not below 0
                    if (matchedCount > 0) {
                        currentScanCount = Math.max(0, Number(currentScanCount || 0) - matchedCount);
                    }

                    handleDeleteActionSuccess();
                } else {
                    toastr.error(response?.msg_desc ?? "บันทึกไม่สำเร็จ", "Error");
                }
            } catch (e) {
                console.error('submitDelete onSuccess error', e);
                toastr.error(response?.msg_desc ?? "บันทึกไม่สำเร็จ", "Error");
            }
        }
    });
}

// ====================================================== Start Edit ============================================================= //

function editRow(id) {
    tempEditData.isMultiEdit = false;

    const item = tableData.find(x => x.id === id);
    console.log(item);
    if (!item) return;

    tempEditData.id = item.id;
    tempEditData.barcode = item.barcode;
    tempEditData.wrapCode = item.package;
    tempEditData.bundleCode = item.bundle;
    tempEditData.isMultiEdit = false;
    tempEditData.oldHeader = item.header;
    tempEditData.oldCreatedBy = item.createdBy;
    tempEditData.oldCreatedByName = item.createdByName;

    document.getElementById("editId").value = item.id;
    document.getElementById("oldHeaderCard").value = item.header;
    document.getElementById("oldCreatedBy").value = item.createdByName;
    document.getElementById("editHeaderCard").value = item.header;

    // ส่ง false เพราะไม่ใช่ multi edit
    onceModalShown('#editModal', function () {
        $('#editCreatedBy')
            .val(Number(currentUserId))
            .trigger('change');
    });

    showModal('#editModal');
}

function handleInputSelect(name) {
    $('#barcodeErrorModal').on('hidden.bs.modal', function () {
        $(name).focus().select();
    });
}

async function showConfirmModal() {

    const id = parseInt(document.getElementById("editId").value);
    const item = tableData.find(x => x.id === id);

    if (!item) return;

    tempEditData.newHeader = document.getElementById("editHeaderCard").value;
    tempEditData.newCreatedBy = document.getElementById("editCreatedBy").value;

    if (!tempEditData.newHeader.trim() || !tempEditData.newCreatedBy.trim()) {
        showBarcodeErrorModal("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    if (tempEditData.newHeader.length !== 10) {
        handleInputSelect('#editHeaderCard');
        showBarcodeErrorModal(`Header Card ต้องมีความยาว 10 ตัวอักษร (ปัจจุบัน: ${tempEditData.newHeader.length} ตัวอักษร)`);
        return;
    }

    // ✅ Validate: ต้องเป็นตัวเลขเท่านั้น
    if (!/^\d+$/.test(tempEditData.newHeader)) {
        handleInputSelect('#editHeaderCard');
        showBarcodeErrorModal("Header Card ต้องเป็นตัวเลขเท่านั้น");
        return;
    }

    // validate มีการเปลี่ยนแปลงหรือไม่
    if (
        tempEditData.newHeader === tempEditData.oldHeader.trim() &&
        Number(tempEditData.newCreatedBy) === Number(tempEditData.oldCreatedBy)
    ) {
        showBarcodeErrorModal("ไม่มีการเปลี่ยนแปลงข้อมูล กรุณากรอกข้อมูล");
        return;
    }

    var requestData = {
        stepIndex: 4,
        containerBarcode: tempEditData.barcode || null,
        wrapBarcode: tempEditData.wrapCode || null,
        bundleBarcode: tempEditData.bundleCode || null,
        headerCardBarcode: tempEditData.newHeader || null,
        bssBNTypeCode: 'UC',
        ReceiveId: null
    };

    try {
        // Hide edit modal first and wait until it's fully hidden so the page loader
        // will be rendered above the modal/backdrop.
        const editModalEl = document.getElementById('editModal');
        if (editModalEl && editModalEl.classList.contains('show')) {
            const waitHidden = new Promise(resolve => onceModalHidden('#editModal', resolve));
            getModal('#editModal')?.hide();
            await waitHidden;
        }

        $.enablePageLoader();
        const response = await validateBarcodeStepAsync(requestData);

        if (!response || typeof response !== 'object') {
            showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
            return;
        }

        if (response.is_success === true || response.isSuccess === true) {
            var data = response.data || {};
            var isValid = data.isValid ?? data.IsValid;
            var errorMessage = data.errorMessage || data.ErrorMessage || "";

            if (isValid === true) {
                const tbody = document.getElementById("confirmTableBody");

                // Conditionally add classes only when values differ
                const oldHeader = String(tempEditData.oldHeader ?? '').trim();
                const newHeader = String(tempEditData.newHeader ?? '').trim();
                const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
                const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

                const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
                const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
                const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
                const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';
                const qtyClass = `qty-${item.qty}`;

                tbody.innerHTML = `
                    <tr>
                        <td>
                            <div class="edit-icon-box">
                                <i class="bi bi-pencil-fill"></i>
                            </div>
                        </td>
                        <td>1</td>
                        <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                        <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                        <td>${item.bank}</td>
                        <td>${item.zoneName}</td>
                        <td>${item.cashpoint}</td>
                        <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                        <td>${item.date}</td>
                        <td>${item.barcode}</td>
                        <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                        <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
                    </tr>
                `;
                document.getElementById("reasonText").value = "";
                document.getElementById("supervisorName").value = "";

                getModal('#editModal')?.hide();
                showModal('#confirmModal');
            } else {
                showBarcodeErrorModal(errorMessage);
                // เมื่อมี error ให้กลับมาเปิด editModal เหมือนเดิมหลังปิด modal แสดงข้อผิดพลาด
                onceModalHidden('#barcodeErrorModal', function () {
                    showModal('#editModal');
                });
                return;
            }
        } else {
            var msgCode = response.msg_code || response.msgCode || "";
            var msgDesc = response.msg_desc || response.msgDesc || "";

            $.sweetError({
                text: msgCode + " : " + msgDesc
            });
        }
    } catch (err) {
        showBarcodeErrorModal("เกิดข้อผิดพลาดในการตรวจสอบบาร์โค้ด");
    } finally {
        $.disablePageLoader();
    }
}


function submitApprovalRequest() {
    const remark = document.getElementById("reasonText").value.trim();
    const supervisorName = document.getElementById("supervisorName").value;

    if (!remark) {
        showBarcodeErrorModal("กรุณาระบุเหตุผลในการแก้ไข");
        return;
    }

    if (!supervisorName) {
        showBarcodeErrorModal("กรุณาเลือก Supervisor");
        return;
    }

    tempEditData.remark = remark;
    tempEditData.supervisorName = supervisorName;
    const otpTableBody = document.getElementById("otpTableBody");

    const count = tempEditData.selectedIds.length;
    //document.getElementById('editOtpListCount').textContent = count;

    otpTableBody.innerHTML = '';

    if (tempEditData.isMultiEdit) {
        tempEditData.selectedIds.forEach((id, index) => {
            const item = tableData.find(x => x.id === id);
            if (!item) return;

            // Conditionally add classes only when values differ
            const oldHeader = String(tempEditData.oldHeader ?? '').trim();
            const newHeader = String(tempEditData.newHeader ?? '').trim();
            const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
            const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

            const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
            const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
            const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
            const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';
            const qtyClass = `qty-${item.qty}`;

            otpTableBody.innerHTML += `
                <tr>
                   <td>
                        <div class="edit-icon-box">
                            <i class="bi bi-pencil-fill"></i>
                        </div>
                   </td>
                   <td>1</td>
                   <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                   <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                   <td>${item.bank}</td>
                   <td>${item.zoneName}</td>
                   <td>${item.cashpoint}</td>
                   <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                   <td>${item.date}</td>
                   <td>${item.barcode}</td>
                   <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                   <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
                </tr>
            `;
        });
    } else {
        const item = tableData.find(x => x.id === tempEditData.id);
        if (!item) return;

        // Conditionally add classes only when values differ
        const oldHeader = String(tempEditData.oldHeader ?? '').trim();
        const newHeader = String(tempEditData.newHeader ?? '').trim();
        const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
        const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

        const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
        const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
        const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
        const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';
        const qtyClass = `qty-${item.qty}`;

        otpTableBody.innerHTML = `
           <tr>
                   <td>
                        <div class="edit-icon-box">
                            <i class="bi bi-pencil-fill"></i>
                        </div>
                   </td>
                   <td>1</td>
                   <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                   <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                   <td>${item.bank}</td>
                   <td>${item.zoneName}</td>
                   <td>${item.cashpoint}</td>
                   <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                   <td>${item.date}</td>
                   <td>${item.barcode}</td>
                   <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                   <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
                </tr>
        `;
    }
    document.getElementById("displayReason").value = remark;
    document.getElementById("otpInput").value = "";
    document.getElementById("otpInput").disabled = true;
    document.getElementById("btnSendOtp").disabled = false;
    document.getElementById("btnConfirmOtp").disabled = true;
    document.getElementById("otpTimer").innerText = "";
    document.getElementById("otpErrorMsg").innerText = "";
    document.getElementById("otpErrorMsg").innerText = "";
    document.getElementById("otp-refcode").innerText = "";
    clearInterval(timerInterval);

    getModal('#confirmModal')?.hide();
    showModal('#otpModal');
}

// Modal 1B: แก้ไขหลายรายการ //
function editMultipleRows() {
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        if (id) selectedIds.push(id);
    });

    if (selectedIds.length === 0) {
        showBarcodeErrorModal("กรุณาเลือกรายการที่ต้องการแก้ไข'");
        return;
    }
    //if (selectedIds.length === 1) {
    //    showBarcodeErrorModal("กรุณาเลือกมากกว่า 1 รายการ สำหรับการแก้ไขหลายรายการ");
    //    return;
    //}
    if (selectedIds.length === 1) {
        editRow(selectedIds[0]);
        return;
    }

    tempEditData.selectedIds = selectedIds;
    tempEditData.isMultiEdit = true;
    document.getElementById('multiEditCount').textContent = selectedIds.length;

    // เอาค่าจาก Row แรกที่เลือก
    const firstItem = tableData.find(x => x.id === selectedIds[0]);
    const defaultValue = firstItem ? firstItem.createBy : '';

    onceModalShown('#editMultipleModal', function () {
        $('#multiEditCreatedBy')
            .val(Number(currentUserId))
            .trigger('change');
    });

    showModal('#editMultipleModal');


}

//  Modal 2: ตรวจสอบการแก้ไข //
function showMultiConfirmModal() {
    const newCreateBy = tempEditData.newCreatedBy;
    if (!newCreateBy) {
        showBarcodeErrorModal("กรุณากรอก Preparation ใหม่");
        return;
    }
    const count = tempEditData.selectedIds.length;
    //document.getElementById('editListCount').textContent = count;

    const tbody = document.getElementById('confirmTableBody');
    tbody.innerHTML = '';
    tempEditData.selectedIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        if (!item) return;

        // Conditionally add classes only when values differ
        const oldHeader = String(tempEditData.oldHeader ?? '').trim();
        const newHeader = String(tempEditData.newHeader ?? '').trim();
        const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
        const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

        const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
        const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
        const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
        const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';
        const qtyClass = `qty-${item.qty}`;

        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="edit-icon-box">
                        <i class="bi bi-pencil-fill"></i>
                    </div>
                </td>
                <td>${index + 1}</td>
                <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                <td>${item.bank}</td>
                <td>${item.zoneName}</td>
                <td>${item.cashpoint}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
            }</td >
            </tr>
        `;
    });
    document.getElementById('reasonText').value = '';
    document.getElementById('supervisorName').value = '';

    getModal('#editMultipleModal')?.hide();
    showModal('#confirmModal');

}

async function updateReceiveCbmsCountsAsync() {
    // Prevent re-entrant handling which can cause infinite recursion
    if (bundleCountByPackage > targetBundleCount && !isLessOrMoreThanBankAmount) {
        if (isProcessingBundleOverflow) return;
        isProcessingBundleOverflow = true;

        // perform clear and move focus on next tick to avoid synchronous re-entry
        clearStateAfterCheckRemaining(2);
        setTimeout(() => {
            try {
                focusStep(2);
            } finally {
                isProcessingBundleOverflow = false;
            }
        }, 0);
        return;
    }

    $("#bundleCount").text(`${bundleCountByPackage} / ${targetBundleCount}`);
}

async function updateUnsortBundleCountsAsync(response) {
    const qty = response.data?.banknoteQty ?? 0;
    const remain = response.data?.remainingQty ?? 0;

    const preparedLeaves = qty - remain;

    const currentBundleNumber = Math.min(preparedLeaves, qty);

    const bundleCountEl = document.getElementById('bundleCount');
    if (bundleCountEl) {
        bundleCountEl.textContent = currentBundleNumber;
    }
}

// ====================================================== End Edit ============================================================= //

document.getElementById('selectAll').addEventListener('change', function () {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
    updateSelectedCount(); 

});

// ==================================================== Load Data Dropdown ===========================================================//
async function loadPreparators() {
    const items = await loadMasterDropdown({
        cacheKey: 'MasterUserPreparator|RG01',
        request: {
            tableName: 'MasterUserPreparator',
            operator: 'AND',
            searchCondition: [{
                columnName: 'MasterRoleGroup.RoleGroupCode',
                filterOperator: 'EQUAL',
                filterValue: 'RG01'
            }],
            pageNumber: 0,
            pageSize: 0,
            selectItemCount: 100,
            includeData: false
        }
    });
    window.preparator = items;
    renderDropdown({ selectId: 'editCreatedBy', items, includeEmpty: true });
    renderDropdown({ selectId: 'multiEditCreatedBy', items, includeEmpty: true });
}

async function loadSupervisors() {
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
    window.supervisors = items;

    renderDropdown({ selectId: 'supervisorName', items, includeEmpty: true, emptyText: '-- กรุณาเลือก --' });
    renderDropdown({ selectId: 'deleteSupervisorSelect', items, includeEmpty: true, emptyText: '-- กรุณาเลือก --' });
}
// =============================================ชชช===== EndLoad Data Dropdown ===============================================ช==========//



function onClickSendOtp() {
    const payload = {
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: tempEditData.supervisorId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNSORT_CC_EDIT
    };
    console.log(payload);
    otp.send(payload)
        .done(function (data) {

            const { refCode, otpExpireIn } = data;
            tempEditData.refcode = refCode;
            document.getElementById("otp-refcode").innerText = tempEditData.refcode;
        })
        .fail(function () {

            toastr.error("SEND OTP FAIL");

        });
}
function onClickDeleteSendOtp() {
    const payload = {
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: deleteSelection.supervisorId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNSORT_CC_DELETE  // ⚠️ ต้องเปลี่ยน constant
    };

    otp.send(payload)
        .done(function (data) {
            const { refCode, otpExpireIn } = data;
            tempDeleteData.refCode = refCode;
            document.getElementById('deleteOtpRefcode').innerText = tempDeleteData.refCode;
        })
        .fail(function () {
            toastr.error("SEND OTP FAIL");
        });
}
async function handleEditActionSuccess() {
    clearAllTempData();
    getModal('#otpModal')?.hide();
    getModal('#confirmModal')?.hide();
    showModal('#successModal');

    await onUpdateSuccess();
}

async function handleDeleteActionSuccess() {
    clearAllTempData();
    getModal('#deleteOtpModal')?.hide();
    getModal('#deleteConfirmModal')?.hide?.();
    showModal('#deleteSuccessModal');

    // capture current header/package code so preview uses correct packageBarcode
    try {
        const headerEl = document.getElementById('headerCardCodeText');
        if (headerEl) packageBarcode = (headerEl.textContent || headerEl.innerText || '').trim();
        else if (window.jQuery) packageBarcode = ($('#headerCardCodeText').text() || '').trim();

        if (packageBarcode === '000000000000000000') packageBarcode = '';
    } catch (e) {
        console.error('failed to read headerCardCodeText for packageBarcode', e);
    }

    const barcodeContainer = document.getElementById("barcodeContainerInput").value.trim();
    const bankId = Number(pageState.selected.bankId || 0);
    const denomId = Number(pageState.selected.denominationId || 0);

    if (barcodeContainer) {

        const unsortData = await updateStateBarcodeListTableAsync(barcodeContainer);

        if (unsortData) {
            pageState.unsortCCCollection = [...unsortData];
        }

        // currentUnsortCC = match inst+deno
        pageState.currentUnsortCC =
            (pageState.unsortCCCollection || []).find(x =>
                Number(x.instId) === bankId &&
                Number(x.denoId) === denomId
            ) || null;

        await updateBarcodeListTableAsync();
        await updateBarcodeWrapAndPackageCodeAsync();
        await updateReceiveCbmsCountsAsync();
        await updatePrepareCount();
    }
    await onUpdateSuccess();
}
async function handleCreatedSuccess() {

    await onCreatedSuccess();
}
async function onCreatedSuccess() {

    await onUpdateSuccess();
}
async function onUpdateSuccess() {
    clearSelectionState();
    await reloadTable();

}

//function showBarcodeErrorModal(message) {
//    const errorSpan = document.getElementById("barcodeErrorMessageText");
//    if (errorSpan) {
//        errorSpan.innerText = message || "เกิดข้อผิดพลาด";
//    }

//    const modalElement = document.getElementById("barcodeErrorModal");
//    if (!modalElement) return;

//    const modal = new bootstrap.Modal(modalElement);
//    modal.show();
//}


async function printContainer() {

    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        if (id) selectedIds.push(id);
    });

    if (selectedIds.length === 0) {
        showSupervisorOffLineErrorModal("กรุณาเลือกข้อมูลธนบัตร");
        return;
    }

    let checkSupervisor = await checkSupervisorIsOnlineAsync();
    if (checkSupervisor?.data !== true) {
        showSupervisorOffLineErrorModal("ไม่สามารถพิมพ์รายงานได้ เนื่องจากไม่พบ Supervisor online อยู่");
        return;
    }

    const params = new URLSearchParams();
    selectedIds.forEach(id => params.append("preparationIds", id));

    const url = `/Report/PreparationUnsortCC?${params.toString()}`;
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

    const windowFeatures = `scrollbars=no, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}, resizable=yes`;

    // 1. เปิดหน้าต่างใหม่เป็นหน้าว่างรอก่อน โดยตั้งชื่อ name ให้ตรงกับ target ของ Form
    const newWindow = window.open('', title, windowFeatures);

    // 2. สร้าง Form ชั่วคราวเพื่อส่งแบบ POST
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/Report/PreparationUnsortCC"; // ตรวจสอบว่า Action ใน Controller รองรับ [HttpPost]
    form.target = title; // ส่งข้อมูลลงในหน้าต่างที่ชื่อ PrintWindow

    selectedIds.forEach(id => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "preparationIds"; // ต้องตรงกับชื่อ Parameter ใน Controller
        input.value = id;
        form.appendChild(input);
    });

    // 3. ยิง Form และลบทิ้ง
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    if (window.focus && newWindow) {
        newWindow.focus();
    }
}


function clearStateOnContainerInput() {


    pageState.unsortCCCollection = [];
    pageState.currentUnsortCC = null;
    pageState.cashCollectionByZone = [];
    pageState.cashCollectionByBank = [];
    pageState.denoCollectionByBank = [];
    pageState.bankCollection = [];
    pageState.currentBank = null;
    pageState.denoCollection = [];
    pageState.currentDeno = null;
    pageState.zoneCollectionMaster = [];
    pageState.zoneCollection = [];
    pageState.currentZone = null;
    pageState.cashCollection = [];
    pageState.currentCash = null;
    pageState.cashCenterCollection = [];
    pageState.currentCashCenter = null;

    // Reset bundle count tracking
    targetBundleCount = 0;
    currentScanCount = 0;

    // Reset stepCount
    stepCount = 1;

    // Clear Screen
    $('#bankInput').val('').trigger('change');
    $('#bankInput').empty();
    $('#bankInput').prop('disabled', true);

    $('#zoneInput').empty();
    $('#zoneInput').prop('disabled', true);

    $('#cashInput').empty();
    $('#cashInput').prop('disabled', true);

    $('#branchInput').empty();
    $('#branchInput').prop('disabled', true);

    $('#bankNoteInput').empty();
    $('#bankNoteInput').prop('disabled', true);

    const element = document.querySelector('#notesample');
    const allowedClasses = ['qty-badge'];

    Array.from(element.classList).forEach(cls => {
        if (!allowedClasses.includes(cls)) {
            element.classList.remove(cls);
        }
    });

    $("#bankAmountInput").val('');
    $('#bankAmountInput').prop('disabled', true);
    $("#barcodeHeaderCardInput").val('');
    $('#barcodeHeaderCardInput').prop('disabled', true);

    $("#headerCardCodeText").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#packageCodeText").text('000000000000000000000000');
    $("#headerContainerCode").text('');
    $("#prepareCount").text('0 / 0');
    $("#reconcileCount").text('0');
    $('#barcodeListBody').empty();
}

function clearStateFieldInput(stepIndex) {
    switch (stepIndex) {
        case 1: // เปลี่ยน bankInput → clear ทุกอันด้านหลัง
            $('#zoneInput').val('').trigger('change.select2');
            $('#cashInput').val('').trigger('change.select2');
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');

            $('#bankNoteInput').prop('disabled', true);

            // Reset pageState selections
            pageState.selected.zoneId = 0;
            pageState.selected.cashpointId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.selected.denominationId = 0;

            pageState.currentZone = null;
            pageState.currentCash = null;
            pageState.currentCashCenter = null;
            pageState.currentDeno = null;
            break;
        case 2: // เปลี่ยน zoneInput → clear ตั้งแต่ cashpoint เป็นต้นไป
            $('#cashInput').val('').trigger('change.select2');
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');

            $('#bankNoteInput').prop('disabled', true);

            // Reset pageState selections
            pageState.selected.cashpointId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.selected.denominationId = 0;

            pageState.currentCash = null;
            pageState.currentCashCenter = null;
            pageState.currentDeno = null;
            break;

        case 3: // เปลี่ยน cashInput → clear ตั้งแต่ branch เป็นต้นไป
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');

            // Reset pageState selections
            pageState.selected.denominationId = 0;
            pageState.currentDeno = null;
            break;

        case 4: // เปลี่ยน branchInput → clear ตั้งแต่ bankNote เป็นต้นไป
            $('#bankNoteInput').val('').trigger('change.select2');

            // Reset pageState selections
            pageState.selected.denominationId = 0;
            pageState.currentDeno = null;
            break;

        case 5: // เปลี่ยน bankNoteInput (denomination) → Clear UI elements เท่านั้น
            break;
    }

    // Clear UI elements
    const element = document.querySelector('#notesample');
    if (element) {
        const allowedClasses = ['qty-badge'];
        Array.from(element.classList).forEach(cls => {
            if (!allowedClasses.includes(cls)) {
                element.classList.remove(cls);
            }
        });
        element.textContent = '0';
    }

    $("#bankAmountInput").val('0');
    $('#bankAmountInput').prop('disabled', true);
    $("#barcodeHeaderCardInput").val('');
    $('#barcodeHeaderCardInput').prop('disabled', true);
    $("#headerCardCodeText").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#packageCodeText").text('000000000000000000000000');
}
async function updatePrepareCount() {
    totalQtyByContainer = 0;

    const barcodeContainer = document.getElementById("barcodeContainerInput")?.value.trim() ?? '';

    // Guard: ถ้าไม่มี barcode ให้ reset UI แล้วออกเลย
    if (!barcodeContainer) {
        const prepareCountEl = document.getElementById('prepareCount');
        if (prepareCountEl) prepareCountEl.textContent = '0 / 0';

        const containerNameEl = document.getElementById('headerContainerCode');
        if (containerNameEl) containerNameEl.textContent = '';

        return;
    }

    const requestCountData = {
        departmentId: 0,
        containerId: barcodeContainer,
        bssBNTypeCode: "UC"
    };

    const responseCountPrepare = await getCountCountPrepareByContainer(requestCountData);

    if (!responseCountPrepare || responseCountPrepare.is_success === false || responseCountPrepare.data == null) {
        prepareCount = 0;
    } else {
        prepareCount = parseInt(responseCountPrepare.data?.countPrepare) || 0; // fallback 0 กัน NaN
    }

    if (pageState.unsortCCCollection?.length > 0) {
        pageState.unsortCCCollection.forEach(item => {
            totalQtyByContainer += Number(item.banknoteQty || 0) - Number(item.adjustQty || 0);
        });
    }

    const prepareCountEl = document.getElementById('prepareCount');
    if (prepareCountEl) {
        prepareCountEl.textContent = `${prepareCount} / ${totalQtyByContainer}`;
    }

    const containerNameEl = document.getElementById('headerContainerCode');
    if (containerNameEl) {
        containerNameEl.textContent = barcodeContainer;
    }
}

async function updateBarcodeWrapAndPackageCodeAsync() {
    let containerBarcode = $('#barcodeContainerInput').val();

    const previewPrepareRequest = {
        unSortCcId: pageState.currentUnsortCC?.unsortCCId,
        containerCode: containerBarcode,
        packageCode: packageBarcode,
        headerCardCode: "0",
        institutionId: Number(pageState.selected.bankId),
        cashCenterId: Number(pageState.selected.cashCenterId),
        cashpointId: Number(pageState.selected.cashpointId),
        denominationId: Number(pageState.selected.denominationId),
        zoneId: Number(pageState.selected.zoneId),
        isFirstScan: isFirstScan
    };

    const previewBarcodeResponse = await getPreviewGenerateBarcode(previewPrepareRequest);

    if (previewBarcodeResponse.is_success === true || previewBarcodeResponse.isSuccess === true) {
        const dataExisting = previewBarcodeResponse.data;

        if (dataExisting != null) {
            bundleCountByPackage = dataExisting.bundleSequence;
            $("#headerCardCodeText").text(dataExisting.packageCode);
            $("#packageCodeText").text(dataExisting.bundleCode);
        }
        else {
            bundleCountByPackage = 0;
        }
        packageBarcode = '';
    }
}

function getExistingTransactionContainerPrepare(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PreparationUnsortCC/GetExistingTransactionContainerPrepare',
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

function handleFocusStep(step) {
    const modalEvent = document.getElementById("barcodeErrorModal");

    modalEvent.removeEventListener('hidden.bs.modal', focusByStep);

    function focusByStep() {
        focusStep(step);
    }

    modalEvent.addEventListener('hidden.bs.modal', focusByStep);
}

$('#bankAmountInput').on('change', function (e) {
    try {
        $.enablePageLoader();

        // Validate bundle count input
        const remainingQty = pageState.currentUnsortCC?.remainingQty ?? 0;
        const inputValue = parseInt($(this).val()) || 0;
        const maxAllowed = Math.floor((remainingQty)); // remainingQty is in leafs

        // clear previous invalid styling
        $('#bankAmountInput').removeClass('border-danger');

        if (inputValue < 1) {
            handleInputSelect('#bankAmountInput');
            $('#bankAmountInput').addClass('border-danger');
            lockHeaderCard(true);
            showBarcodeErrorModal('จำนวนมัดต้องไม่น้อยกว่า 1');
            targetBundleCount = inputValue;
            isLessOrMoreThanBankAmount = true;
            return;
        }

        if (inputValue > maxAllowed) {
            handleInputSelect('#bankAmountInput');
            $('#bankAmountInput').addClass('border-danger');
            lockHeaderCard(true);
            showBarcodeErrorModal(`จำนวนมัดต้องไม่มากกว่า ${maxAllowed}`);
            targetBundleCount = inputValue;
            currentScanCount = 0;
            isLessOrMoreThanBankAmount = true;
            return;
        }

        // update bundle count by package
        bundleCountByPackage = 1;

        // valid value: enable header card and focus it
        lockHeaderCard(false);
        targetBundleCount = inputValue;
        currentScanCount = 0;
        isLessOrMoreThanBankAmount = false;

        const headerEl = document.getElementById('barcodeHeaderCardInput');
        if (headerEl) {
            headerEl.focus();
            headerEl.select();
        }

        // Set isFirstScan to true when change the value
        if (!isFirstScan) {
            isFirstScan = true;
        }

        updateBarcodeWrapAndPackageCodeAsync();
        updateReceiveCbmsCountsAsync();

    } finally {
        $.disablePageLoader();
    }
});

$('#bankAmountInput').on('keydown', function (e) {
    try {
        $.enablePageLoader();
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // Use a tiny timeout so the input value will be updated if the browser changes it
            setTimeout(() => {
                const remainingQty = pageState.currentUnsortCC?.remainingQty ?? 0;
                const val = parseInt($('#bankAmountInput').val()) || 0;
                const maxAllowed = Math.floor((remainingQty));
                if (val > 0 && val <= maxAllowed) {
                    lockHeaderCard(false);
                    const headerEl = document.getElementById('barcodeHeaderCardInput');
                    if (headerEl) {
                        headerEl.focus();
                        headerEl.select();
                    }
                }
            }, 0);
        }

    } finally {
        $.disablePageLoader();
    }
});

function clearHeaderBarcodeInput() {
    const input = document.getElementById("barcodeHeaderCardInput");
    if (input) {
        input.value = "";
        input.focus();
    }
}

function lockHeaderCard(isLock) {
    $("#barcodeHeaderCardInput").val('');

    const el = document.getElementById('barcodeHeaderCardInput');
    if (!el) return;

    el.disabled = isLock;

    if (!isLock) {
        el.focus();
        el.select();
    }
}

function lockBankAmount(isLock) {
    const el = document.getElementById('bankAmountInput');
    if (!el) return;

    el.disabled = isLock;

    if (!isLock) {
        el.focus();
        el.select();
    }
}

function focusSelect2(selector) {
    setTimeout(() => {
        $(selector).focus();
    }, 250);
}

function clearStateAfterCheckRemaining(stepIndex) {
    switch (stepIndex) {
        case 1: // cleare all input
            $("#barcodeContainerInput").val('');
            clearStateOnContainerInput();
            $('#bankInput').val('').trigger('change');

            const sidebarContainerName = document.getElementById('containerSideCard');
            if (sidebarContainerName) {
                sidebarContainerName.textContent = '-';
            }
            break;
        case 2: // Clear all Step 2 dropdowns and inputs

            $('#bankInput').val('').trigger('change');
            $('#cashInput').empty();
            $('#branchInput').empty();
            $('#zoneInput').empty();
            $('#bankAmountInput').val('');
            break;
        default:
            break;
    }

    // Set isFirstScan to true after all bundles and wrap scanned
    if (!isFirstScan) {
        isFirstScan = true;
    }

    // Reset counters
    targetBundleCount = 0;
    currentScanCount = 0;
    bundleCountByPackage = 0;
}