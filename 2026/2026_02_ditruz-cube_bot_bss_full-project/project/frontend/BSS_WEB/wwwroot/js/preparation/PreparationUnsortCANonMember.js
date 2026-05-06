let remainQty = 0;
let responseBranchState = false;
let stepCount = 1;
let bankobject = {};
let isResettingSelect = false;
const { MAIL_TYPE } = window.APP.CONST;
let cbmsSelected = {};
let cbmsData = [];

let bankList = [];
let cashCenterList = [];
let cashCenterByBankList = [];

let totalQtyByContainer = 0;

// FirstScan tracking
let isFirstScan = true;
let targetBundleCount = 0;
let currentScanCount = 0;

// bundle count by package code
let bundleCountByPackage = 0;

// ✅ เพิ่มตรงนี้ที่ด้านบนไฟล์
let currentScannedPackageCode = '';
let packageBarcode = '';

// store created transactionPreparations for later comparison when deleting
let createdTransactionPreparations = [];

// guard to prevent re-entrant handling when bundle counts overflow
let isProcessingBundleOverflow = false;

// bankAmountInput track less or more than input
let isLessOrMoreThanBankAmount = false;

window.pageState = window.pageState || {
    isScannedContainerConflict: false,
    scannedContainerId: '',
    scannedContainerConflictText: ''
};

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

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || 0;
const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;
const tableState = {
    pageNumber: 1,
    pageSize: 0,
    search: '',
    sorts: [{ field: "createdDate", dir: "desc" }]
};
async function initComponent() {
    $.enablePageLoader();
    await reloadTable();
    // loadPreparationUnsortCaNonMembers(1, 0, '');

    $.disablePageLoader();
}
async function reloadTable() {
    await loadPreparationUnsortCaNonMembers(
        tableState.pageNumber,
        tableState.pageSize,
        tableState.search
    );
}
function clearSelectionState() {
    document.querySelectorAll('.row-checkbox').forEach(x => x.checked = false);

    updateSelectedCount?.();
}
function showCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear() + 543;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    //Date/Time: 15/11/2568 15:45:00
    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    document.getElementById("info-current-datetime").textContent = formatted;
}

// อัปเดตทุก 1 วินาที
setInterval(showCurrentDateTime, 1000);
showCurrentDateTime();

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
    cashCenterName: ''
};

const tempDeleteData = {
    prepareIds: [],
    remark: "",
    updatedBy: 0,
    refCode: ""
};

const deleteSelection = { supervisorId: "", supervisorName: "" };


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
        cashCenterName: ''
    };
}


function clearAllTempData() {
    clearTempDeleteData();
    clearTempEditData();
}
let countdown = 300;
let timerInterval = null;
let deleteCountdown = 300;
let deleteTimerInterval = null;

function getPreparationUnsortCaNonMembersDetailAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/GetPreparationUnsortCaNonMembersDetailAsync',
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
        header: x.headerCardCode ?? '',
        bank: x.bank ?? x.bankCode ?? '',
        cashCenterName: x.center ?? x.cashCenterName ?? '',
        qty: x.qty ?? x.denominationPrice ?? 0,
        barcode: x.barcode ?? x.containerCode ?? '',
        date: formatDateThai(x.createdDate),
        createdBy: x.createdBy ?? '',
        createdByName: x.createdByName ?? '',
        updatedBy: x.updatedBy ?? '',
        createdByName: x.createdByName ?? '',
        isFlag: x.isFlag ?? true,
        zoneId: x.zoneId,
        zoneName: x.zoneName
    }));
}
async function loadPreparationUnsortCaNonMembers(pageNumber = 1, pageSize = 0, search = '') {
    try {
        const requestData = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search,
            sorts: [
                { field: "createdDate", dir: "desc" }
            ]
        };

        const response = await getPreparationUnsortCaNonMembersDetailAsync(requestData);

        const items = response?.items || response?.data?.items || response?.data || [];
        const totalCount = response?.totalCount || response?.data?.totalCount || items.length;

        tableData = mapApiToData(items);

        renderTable();

        setupDropdownforSecondScreen();

        // updatePagination(totalCount, pageNumber, pageSize);

    } catch (err) {
        console.error(err);
        showBarcodeErrorModal("โหลดข้อมูลไม่สำเร็จ");
    }
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
                <td>${item.header} ${isLocked ? `
                <i class="bi bi-exclamation-triangle-fill text-warning ms-2"
                title="${tooltipMsg || 'พบการ prepare จากเครื่องอื่น'}"></i>
                ` : ''}</td>
                <td>${item.bank}</td>
                <td>${item.cashCenterName}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action" onclick="editRow(${item.id})" ${disabledAttr}>
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-action btn-danger" onclick="deleteRow(${item.id})" ${disabledAttr}>
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

}

async function updatePrepareCount() {

    totalQtyByContainer = 0;

    const barcodeContainer = document.getElementById("barcodeContainerInput").value.trim();

    var requestCountData = {
        departmentId: 0,
        containerId: barcodeContainer,
        bssBNTypeCode: "CN"
    };

    const responseCountPrepare = await getCountCountPrepareByContainer(requestCountData);

    if (!responseCountPrepare || responseCountPrepare.is_success === false || responseCountPrepare.data == null) {
        prepareCount = 0;
    }
    else {

        prepareCount = parseInt(responseCountPrepare.data?.countPrepare);
    }

    if (cbmsData.length > 0) {
        cbmsData.forEach((item) => {
            totalQtyByContainer += item.qty;
        });
    }

    const prepareCountEl = document.getElementById('prepareCount');
    if (prepareCountEl) {
        const totalBundles = Math.floor(totalQtyByContainer / 1000);
        prepareCountEl.textContent = `${prepareCount} / ${totalBundles}`;
    }

    const containerNameEl = document.getElementById('containerName');
    if (containerNameEl) {
        containerNameEl.textContent = barcodeContainer;
    }
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

async function updateBarcodeWrapAndPackageCodeAsync() {
    let containerBarcode = $('#barcodeContainerInput').val();

    const previewPrepareRequest = {
        "receiveId": cbmsSelected?.receiveId,
        "containerCode": containerBarcode,
        "packageCode": packageBarcode,
        "headerCardCode": "0",
        "institutionId": cbmsSelected.institutionId,
        "cashCenterId": parseInt($('#cashInput').val()),
        "denominationId": cbmsSelected.denominationId,
        "IsFirstScan": isFirstScan
    }

    const previewBarcodeResponse = await getPreviewGenerateBarcode(previewPrepareRequest);

    if (previewBarcodeResponse.is_success === true || previewBarcodeResponse.isSuccess === true) {
        const dataExisting = previewBarcodeResponse.data;

        if (dataExisting != null) {
            bundleCountByPackage = dataExisting.bundleSequence;
            $("#packageCode").text(dataExisting.packageCode);
            $("#bundleCode").text(dataExisting.bundleCode);
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
            service: 'Preparation/GetExistingTransactionContainerPrepare',
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

async function updateBarcodeListTableAsync() {
    const barcodeContainer = document.getElementById("barcodeContainerInput").value.trim();
    const tbody = document.getElementById("barcodeListBody");

    let sortCbmsData = cbmsData.sort((a, b) => {
        // 1. institutionId ASC
        r = a.institutionId - b.institutionId;
        if (r !== 0) return r;

        // 2. denominationId ASC
        return a.denominationId - b.denominationId;
    });

    tbody.innerHTML = '';
    if (sortCbmsData != null && sortCbmsData.length > 0) {
        sortCbmsData
            .filter(item => item?.remainingQty !== 0)
            .forEach(item => {
            const qtyClass = `qty-${item.denominationPrice}`;

            tbody.innerHTML += `

            <tr>
                <td style="text-align: left;">${item?.bankCode || '-'}</td>
                <td style="text-align: right;"><span class="qty-badge ${qtyClass}">${item?.denominationPrice || 0}</span></td>
                <td style="text-align: right; width: 80px;">${item?.remainingQty / 1000 || 0}</td>
            </tr>
        `;
        });
    }

    // อัพเดตชื่อภาชนะใน sidebar
    const sidebarContainerName = document.getElementById('sidebarContainerName');
    if (sidebarContainerName) {
        sidebarContainerName.textContent = cbmsSelected?.containerId || barcodeContainer || '-';
    }
}

async function updateReconcileCount() {
    var requestCountData = {
        departmentId: 0
    };

    const responseCount = await getCountReconcile(requestCountData);

    if (!responseCount || responseCount.is_success === false || responseCount.data == null) {
        countReconcile = 0;
    } else {
        countReconcile = parseInt(responseCount.data?.countReconcile);
    }

    const reconcileCountEl = document.getElementById('reconcileCount');
    if (reconcileCountEl) {
        reconcileCountEl.textContent = '0';
    }
}


function getCountReconcile(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/GetCountReconcile',
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

async function refreshData() {
    $.enablePageLoader();
    await reloadTable();
    $.disablePageLoader();

    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
}

function deleteAll() {
    const allIds = tableData.map(item => item.id);
    if (allIds.length === 0) {
        toastr.error('ไม่มีข้อมูลให้ลบ');
        return;
    }
    console.log(allIds);
    tempDeleteData.prepareIds = allIds;

    document.getElementById('deleteCountMsg').textContent = allIds.length;

    showModal('#confirmDeleteModal');
}

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

    onceModalShown('#editModal', function () {
        $('#editCreatedBy')
            .val(Number(currentUserId))
            .trigger('change');
    });

    showModal('#editModal');
}
function deleteRow(id) {

    tempDeleteData.prepareIds = [id];
    onceModalShown('#DeleteModal', function () {
        $('#multiEditCreatedBy')
            .val(Number(currentUserId))
            .trigger('change');
    });

    showModal('#DeleteModal');
}

function confirmSingleDelete() {

    getModal('#DeleteModal')?.hide();
    showDeleteConfirmModal();
}

function showDeleteConfirmModal() {
    document.getElementById('deleteReasonText').value = "";
    const count = tempDeleteData.prepareIds.length;
    document.getElementById('deleteListCount').textContent = count;
    console.log(tempDeleteData);

    const tbody = document.getElementById('deleteConfirmTableBody');
    tbody.innerHTML = '';

    tempDeleteData.prepareIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        if (!item) return;

        const qtyClass = `qty-${item.qty}`;
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
                <td>${item.cashCenterName}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });



    getModal('#confirmDeleteModal')?.hide();
    showModal('#deleteConfirmModal');
}

function submitDeleteApproval() {
    const remark = document.getElementById('deleteReasonText').value;;
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
        if (!item) return;

        const qtyClass = `qty-${item.qty}`;
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
                <td>${item.cashCenterName}</td>
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
    tempEditData.newCreateBy = Number(document.getElementById("editCreatedBy").value);



    if (!tempEditData.newHeader.trim() || !tempEditData.newCreatedBy) {
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
        tempEditData.newCreatedBy === Number(tempEditData.oldCreatedBy)
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
        bssBNTypeCode: 'CN',
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
        $.disablePageLoader();

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

                const qtyClass = `qty-${item.qty}`;

                // Conditionally add classes only when values differ
                const oldHeader = String(tempEditData.oldHeader ?? '').trim();
                const newHeader = String(tempEditData.newHeader ?? '').trim();
                const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
                const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

                const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
                const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
                const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
                const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';

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
                        <td>${item.cashCenterName}</td>
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
    }
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
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_NON_MEMBER_DELETE,
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
function backToConfirmDelete() {
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }, 300);
}

function closeAllDeleteModals() {
    const modals = ['deleteSuccessModal', 'deleteOtpModal', 'deleteConfirmModal', 'confirmDeleteModal', 'DeleteModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    });

    document.getElementById("otpErrorMsg").innerText = "";

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



function submitApprovalRequest() {
    const remark = document.getElementById("reasonText").value.trim();
    const supervisorName = document.getElementById("supervisorName").value;

    if (!remark) {
        //alert("กรุณาระบุเหตุผลในการแก้ไข");
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
    otpTableBody.innerHTML = '';

    if (tempEditData.isMultiEdit) {
        tempEditData.selectedIds.forEach((id, index) => {
            const item = tableData.find(x => x.id === id);
            if (!item) return;

            const qtyClass = `qty-${item.qty}`;

            // Conditionally add classes only when values differ
            const oldHeader = String(tempEditData.oldHeader ?? '').trim();
            const newHeader = String(tempEditData.newHeader ?? '').trim();
            const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
            const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

            const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
            const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
            const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
            const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';

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
                   <td>${item.cashCenterName}</td>
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

        const qtyClass = `qty-${item.qty}`;

        // Conditionally add classes only when values differ
        const oldHeader = String(tempEditData.oldHeader ?? '').trim();
        const newHeader = String(tempEditData.newHeader ?? '').trim();
        const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
        const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

        const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
        const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
        const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
        const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';

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
                   <td>${item.cashCenterName}</td>
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
function onClickSendOtp() {
    const payload = {
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: tempEditData.supervisorId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_NON_MEMBER_EDIT,
    };

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
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_NON_MEMBER_DELETE,
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
function submitOtp() {
    const otpInput = document.getElementById("otpInput").value.trim();
    const errorMsg = document.getElementById("otpErrorMsg");

    errorMsg.innerText = "";

    if (!otpInput) { errorMsg.innerText = "กรุณากรอกรหัส OTP"; return; }
    if (otpInput.length !== 6) { errorMsg.innerText = "รหัส OTP ต้องมี 6 หลัก"; return; }

    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_NON_MEMBER_EDIT,
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

    clearInterval(timerInterval);



}

function editMultipleRows() {
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        if (id) selectedIds.push(id);
    });

    if (selectedIds.length === 0) {
        showBarcodeErrorModal("กรุณาเลือกรายการที่ต้องการแก้ไข");
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

function showMultiConfirmModal() {
    const newCreateBy = tempEditData.newCreatedBy;
    if (!newCreateBy) {
        showBarcodeErrorModal("กรุณากรอก Preparation ใหม่");
        return;
    }

    const tbody = document.getElementById('confirmTableBody');
    tbody.innerHTML = '';
    tempEditData.selectedIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        if (!item) return;

        const qtyClass = `qty-${item.qty}`;

        // Conditionally add classes only when values differ
        const oldHeader = String(tempEditData.oldHeader ?? '').trim();
        const newHeader = String(tempEditData.newHeader ?? '').trim();
        const oldHeaderClass = oldHeader !== newHeader ? 'text-decoration-line-through text-muted' : '';
        const newHeaderClass = oldHeader !== newHeader ? 'text-warning' : '';

        const oldCreated = String(tempEditData.oldCreatedByName ?? '').trim();
        const newCreated = String(tempEditData.newCreatedByName ?? '').trim();
        const oldCreatedClass = oldCreated !== newCreated ? 'text-decoration-line-through text-muted' : '';
        const newCreatedClass = oldCreated !== newCreated ? 'text-warning' : '';

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
                <td>${item.cashCenterName}</td>
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

function closeAllModals() {
    const modals = ['successModal', 'otpModal', 'confirmModal', 'editModal', 'editMultipleModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    });

    document.getElementById("otpErrorMsg").innerText = "";

    // clearTempData();
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

function backToConfirmModal() {
    clearInterval(timerInterval);
    document.getElementById("otpTimer").innerText = "";
    document.getElementById("otpInput").disabled = true;
    document.getElementById("otpErrorMsg").innerText = "";

    bootstrap.Modal.getInstance(document.getElementById('otpModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
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

document.getElementById('selectAll').addEventListener('change', function () {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
});

const barcodeSteps = [
    { stepIndex: 1, inputId: "barcodeContainerInput" },
    { stepIndex: 2, inputId: "bankAmountInput", inputClass: 'bankInfo' },
    { stepIndex: 3, inputId: "barcodeHeaderCardInput" }
];

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
            $('#barcodeContainerInput').focus();
            $('#barcodeContainerInput').select();
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
                'bankNoteInput',
                'notesample',
                'bankAmountInput',
                'barcodeHeaderCardInput'
            ]);
            $('#barcodeHeaderCardInput').focus();
            $('#barcodeHeaderCardInput').select();
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

    switch (triggerId) {
        case 'bankInput':
            enable(['cashInput', 'branchInput']);
            break;

        case 'cashInput':
        case 'branchInput':
            enable(['bankNoteInput', 'notesample']);
            break;

        case 'bankNoteInput':
            enable(['bankAmountInput']);
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

function getPreviewGenerateBarcode(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/PreviewCaNonMemberGenerateBarcode',
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

function createPreparationCaNonMemberContainer(requestData) {
    $.enablePageLoader();
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/CreatePreparationCaNonMemberContainer',
            type: 'POST',
            parameter: requestData,
            enableLoader: true,
            onSuccess: function (response) {
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

const getCashCenter = async (request, id, departId, qtyList) => {


    $('#cashInput').empty();
    $('#branchInput').empty();

    const formatBranch = state => {
        if (!state.id) return state.text;
        return $(`<option value="${state.id}">${state.text}</option>`);
    };
    const formatBranchId = state => {
        //if (!state.id) return state.id;
        if (!state.id) return state.text;
        //return $(`<option value="${state.id}">${parseInt(state.text).toString()/*.padStart(5, '0')*/}</option>`);
        return $(`<option value="${state.id}">${state.text}</option>`);
    };
    const $branchSelect = $('#branchInput').select2({
        theme: 'bootstrap-5'
    });

    const $subBranchSelect = $('#cashInput').select2({
        theme: 'bootstrap-5'
    });
    try {


        remainQty = (qtyList.filter(x => x.institutionId == id)[0].remainingQty / 1000);
        //$('#bankAmountInput').val(remainQty);
        bankobject = qtyList.filter(x => x.institutionId == id)[0];

        const responseBranch = await getDropdownData('CashCenter/GetCashCenterList', 'POST', {
            institutionFilter: id.toString(),
            departmentFilter: ""
        });

        if (!responseBranch) {
            showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
            return;
        }

        let cbmsBybank = [];
        let arrCbBdcCode = [];

        cashCenterByBankList = [];
        cashCenterList = [];
        let missingCashCenter = [];
        let missingMessage = '';

        if (responseBranch.is_success === true || responseBranch.isSuccess === true) {
            responseBranchState = true;

            cashCenterByBankList = responseBranch.data.filter(x => x.institutionId == id).map(x => ({
                ...x,
                id: x.cashCenterId,
                text: x.cashCenterName,
                qty: x.qty
            }));

            //cashCenterList = responseBranch.data.filter(x => x.institutionId == id).map(x => ({
            //    ...x,
            //    id: x.cashCenterId,
            //    text: x.cashCenterName,
            //    qty: x.qty
            //}));


            cbmsBybank = qtyList.filter(x => x.institutionId == id).map(x => ({
                ...x
            }));

            arrCbBdcCode = cbmsBybank.map(x => ({
                cbBdcCode: x.cbBdcCode
            }));

            const distinctCbBdcCode = arrCbBdcCode.filter((item, index, self) =>
                index === self.findIndex(x =>
                    x.id === item.id && x.cbBdcCode === item.cbBdcCode
                )
            );

            distinctCbBdcCode.forEach((item) => {

                const itemCashCenter = cashCenterByBankList.find(c => c.cashCenterCode === item.cbBdcCode);
                if (itemCashCenter) {
                    cashCenterList.push(itemCashCenter);
                } else {
                    missingCashCenter.push(item.cbBdcCode);
                }

            });

            if (Array.isArray(cashCenterList) && cashCenterList.length === 0) {

                missingMessage = (Array.isArray(missingCashCenter) && missingCashCenter.length > 0) ? missingCashCenter.join(", ") : 'xxx';
                $.disablePageLoader();
                showBarcodeErrorModal(`ไม่พบศูนย์เงินสด [${missingMessage}] ในฐานข้อมูลของระบบ`);
                $('#bankNoteInput').empty();
                return;
            }


            $branchSelect.append(new Option('-- กรุณาเลือก --', '', true, true));
            $branchSelect.select2({
                theme: 'bootstrap-5',
                data: cashCenterList.map(x => ({
                    ...x,
                    id: x.cashCenterId,
                    text: x.cashCenterName,
                    qty: x.qty
                })),
                templateResult: formatBranch,
                templateSelection: formatBranch,
                placeholder: "- เลือก -"
            });


            $subBranchSelect.append(new Option('-- กรุณาเลือก --', '', true, true));
            $subBranchSelect.select2({
                theme: 'bootstrap-5',
                data: cashCenterList.map(x => ({
                    ...x,
                    id: x.cashCenterId,
                    text: x.cashCenterCode,
                    qty: x.qty
                })),
                templateResult: formatBranchId,
                templateSelection: formatBranchId,
                placeholder: "- เลือก -"
            });

            checkPointsteptwo();
            $('#cashInput').focus();
        } else {
            var msgCode = responseBranch.msg_code || responseBranch.msgCode || "";
            var msgDesc = responseBranch.msg_desc || responseBranch.msgDesc || "";

            $.sweetError({
                text: msgCode + " : " + msgDesc
            });
        }
    } catch (err) {
        console.error(err);
        showBarcodeErrorModal("เกิดข้อผิดพลาดในการตรวจสอบบาร์โค้ด");
    }
}

let denoIdSelected = 0;
async function getBankfromBarcode(containerBarcode) {
    let qtyList = [];
    cbmsData = [];
    totalQtyByContainer = 0;

    let requestData = {
        departmentId: 0,
        containerId: containerBarcode
    };

    try {
        $.enablePageLoader();

        const response = await getReCdmsDataTransaction(containerBarcode);
        //console.log('response', response);

        if (!response || response.is_success === false) {
            //showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
            showBarcodeErrorModal(`ไม่พบภาชนะ ${containerBarcode}`);
            return;
        }

        if (response.is_success === true || response.isSuccess === true) {
            if (response.data.length == 0) {
                $('#barcodeContainerInput').val('').focus();
                showBarcodeErrorModal(`ไม่พบภาชนะ ${containerBarcode}`);
                return;
            }

            // เอา cbms ที่ return มาทำเป็น global variable และทำตัวแปร current cbms

            var data = response.data || {};
            cbmsData = data.sort((a, b) => a.denominationPrice - b.denominationPrice);
            qtyList = data;

            await updateBarcodeListTableAsync();
            await updatePrepareCount();

            const formatBank = state => {
                if (!state.id) return state.text;
                return $(`<option value="${state.id}">${state.text}</option>`);
            };


            let request = {
                tableName: "MasterInstitution",
                operator: "OR",
                searchCondition: [],
                selectItemCount: 100,
                includeData: true
            };

            cbmsData.forEach((item) => {
                // $('#bankNoteInput').append('<option value="' + item.denominationId + '|' + item.denominationPrice + '">' + item.denominationPrice + '</option>');
                request.searchCondition.push({
                    columnName: "InstitutionId",
                    filterOperator: "EQUAL",
                    filterValue: item.institutionId
                });
            });

            const responseBank = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);

            if (!responseBank) {
                showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
                return;
            }

            bankList = responseBank.data;

            $('#bankInput').empty();

            const $bankSelect = $('#bankInput').select2({
                theme: 'bootstrap-5',
                width: '100%'
            });

            //$bankSelect.append(new Option('-- กรุณาเลือก --', '', true, true));
            $bankSelect.select2({
                theme: 'bootstrap-5',
                data: responseBank.data.map(x => ({
                    ...x,
                    id: x.key
                })),
                templateResult: formatBank,
                templateSelection: formatBank,
                placeholder: "- เลือก -"
            });

            var option = new Option("-- กรุณาเลือก --", "", false, false);
            $('#bankInput').prepend(option);
            $('#bankInput')[0].selectedIndex = 0;

            var nextStep = stepCount + 1;
            stepCount = nextStep;
            var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
            if (hasNext) {
                focusStep(nextStep);
            }

            // populate bankNoteInput filtered by selected cash center (cbBdcCode)
            populateBankNoteOptions($('#bankInput').val());

            $('#bankNoteInput').change(async function (e) {
                try {
                    $.enablePageLoader();

                    denoIdSelected = e.target.value.split('|')[0];
                    const val = e.target.value.split('|')[1];

                    const element = document.querySelector('#notesample');
                    const allowedClasses = ['qty-badge'];

                    Array.from(element.classList).forEach(cls => {
                        if (!allowedClasses.includes(cls)) {
                            element.classList.remove(cls);
                        }
                    });

                    $('#notesample').addClass('qty-' + val).html(val);

                    let insId = $('#bankInput').val();
                    let selectedCashCode = ($('#cashInput').find(':selected').text() || '').trim();

                    cbmsSelected = cbmsData.filter(x => x.containerId == containerBarcode.toUpperCase() && x.institutionId == Number(insId) && x.denominationId === Number(denoIdSelected) && x.cbBdcCode === selectedCashCode)[0];

                    clearAfterBankNoteInputChange();

                    if (cbmsSelected) {
                        qty = cbmsSelected.qty || 0;
                        remainingQty = cbmsSelected.remainingQty || 0;
                        unfitQty = cbmsSelected.unfitQty || 0;

                        remainQty = remainingQty / 1000;

                        $('#bankAmountInput').val(remainQty);
                        currentScanCount = 0;
                        targetBundleCount = remainQty;

                        if (remainQty <= 0) {
                            lockHeaderCard(true);
                            lockBankAmount(true);
                        }

                        // Set isFirstScan to true after load default bank amount
                        if (!isFirstScan) {
                            isFirstScan = true;
                        }

                        await updateBarcodeWrapAndPackageCodeAsync();
                        await updateReceiveCbmsCountsAsync();
                    }

                    checkPointsteptwo();

                    $('#bankAmountInput').focus();

                } finally {
                    $.disablePageLoader();
                }
            });

            await getCashCenter(request, cbmsData[0].institutionId, cbmsData[0].departmentId, qtyList);

            $('#branchInput').on('select2:select', async function (e) {
                try {
                    $.enablePageLoader();
                    const data = e.params.data;
                    const targetId = data.id;
                    const action = $('#cashInput');
                    action.val(targetId).trigger('change.select2');

                    // immediate clear & disable of bankAmount and header to reflect selection
                    const amtEl_branch = document.getElementById('bankAmountInput');
                    if (amtEl_branch) { amtEl_branch.value = ''; amtEl_branch.disabled = true; }
                    const headerEl_branch = document.getElementById('barcodeHeaderCardInput');
                    if (headerEl_branch) { headerEl_branch.value = ''; headerEl_branch.disabled = true; }

                    await clearAfterCashInputAsync();

                    if (cbmsSelected) {
                        qty = cbmsSelected.qty || 0;
                        remainingQty = cbmsSelected.remainingQty || 0;
                        unfitQty = cbmsSelected.unfitQty || 0;

                        await updateReceiveCbmsCountsAsync();
                        await updateBarcodeListTableAsync();
                    }

                    isProcessingBundleOverflow = true;

                    checkPointsteptwo();
                    progressStep2('branchInput');
                    // refresh bankNote options to match selected cash center
                    populateBankNoteOptions($('#bankInput').val());
                    $('#bankNoteInput').focus();
                } finally {
                    $.disablePageLoader();
                }
            });

            $('#cashInput').on('select2:select', async function (e) {
                try {
                    $.enablePageLoader();
                    const data = e.params.data;
                    const targetId = data.id;
                    const action = $('#branchInput');
                    action.val(targetId).trigger('change.select2');

                    // immediate clear & disable of bankAmount and header to reflect selection
                    const amtEl_cash = document.getElementById('bankAmountInput');
                    if (amtEl_cash) { amtEl_cash.value = ''; amtEl_cash.disabled = true; }
                    const headerEl_cash = document.getElementById('barcodeHeaderCardInput');
                    if (headerEl_cash) { headerEl_cash.value = ''; headerEl_cash.disabled = true; }

                    await clearAfterCashInputAsync();

                    if (cbmsSelected) {
                        qty = cbmsSelected.qty || 0;
                        remainingQty = cbmsSelected.remainingQty || 0;
                        unfitQty = cbmsSelected.unfitQty || 0;

                        await updateReceiveCbmsCountsAsync();
                        await updateBarcodeListTableAsync();
                    }

                    isProcessingBundleOverflow = true;

                    checkPointsteptwo();
                    progressStep2('cashInput');
                    // refresh bankNote options to match selected cash center
                    populateBankNoteOptions($('#bankInput').val());
                    $('#bankNoteInput').focus();
                } finally {
                    $.disablePageLoader();
                }
            });

            // change handler: validate and set target bundle count
            $('#bankAmountInput').on('change', function (e) {
                try {
                    $.enablePageLoader();

                    // Validate bundle count input
                    const inputValue = parseInt($(this).val()) || 0;
                    const maxAllowed = Math.floor((remainingQty || 0) / 1000); // remainingQty is in leafs, so divide by 1000 for bundles

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

                    // move focus to header card input
                    const headerEl = document.getElementById('barcodeHeaderCardInput');
                    if (headerEl) {
                        headerEl.focus();
                        headerEl.select();
                    }

                    // Set isFirstScan to true when change the value
                    if (!isFirstScan) {
                        isFirstScan = true;
                    }

                    checkPointsteptwo();
                    updateBarcodeWrapAndPackageCodeAsync();
                    updateReceiveCbmsCountsAsync();
                } finally {
                    $.disablePageLoader();
                }
            });

            // arrow key handling: if arrow up/down and value <= max allowed then focus header card
            $('#bankAmountInput').on('keydown', function (e) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    // Use a tiny timeout so the input value will be updated if the browser changes it
                    setTimeout(() => {
                        const val = parseInt($('#bankAmountInput').val()) || 0;
                        const maxAllowed = Math.floor((remainingQty || 0) / 1000);
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
            });
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


$('#bankInput').on('change', function () {

    // Clear & disable dependent fields when bank is selected
    clearAfterBankInput();
    // disable bankNoteInput, bankAmountInput, barcodeHeaderCardInput until populated/enabled later
    const bnEl = document.getElementById('bankNoteInput');
    if (bnEl) { bnEl.value = ''; bnEl.disabled = true; }
    const amtEl = document.getElementById('bankAmountInput');
    if (amtEl) { amtEl.value = ''; amtEl.disabled = true; }
    const headerEl = document.getElementById('barcodeHeaderCardInput');
    if (headerEl) { headerEl.value = ''; headerEl.disabled = true; }


    const bankValue = $(this).val();
    const bankText = $(this).find(':selected').text();
    console.log(bankValue, bankText);

    let containerBarcode = $('#barcodeContainerInput').val();

    cbmsSelected = cbmsData.filter(x => x.institutionId == Number(bankValue) && x.containerId == containerBarcode.toUpperCase())[0];
    if (bankValue) {

        // populate bankNoteInput taking into account selected cash (cbBdcCode)
        populateBankNoteOptions(bankValue);
        $('#bankNoteInput').trigger('change');

        let request = {
            tableName: "MasterInstitution",
            operator: "OR",
            searchCondition: [],
            selectItemCount: 100,
            includeData: true
        };

        request.searchCondition.push({
            columnName: "InstitutionId",
            filterOperator: "EQUAL",
            filterValue: Number(bankValue)
        });

        getCashCenter(request, Number(bankValue), 0, cbmsData);
        progressStep2('bankInput');
    }
});

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

function confirmChangeContainerModal() {
    getModal('#ChangeContainerModal')?.hide();
    $("#prepareCount").text('0 / 0')
    onBarcodeInputChanged(1);
}

function cancelChangeContainerModal() {
    $("#barcodeContainerInput").val($('#containerName').text());
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
    const clearAllValid = () => {
        $('.bankInfo').removeClass('border-danger');
    }
    const cash = (document.getElementById("cashInput").value || "").trim();
    const bankAmount = (document.getElementById("bankAmountInput").value || "").trim();
    clearAllValid();
    if (cash == '' && responseBranchState) {
        $('#cashInput, #branchInput').addClass('border-danger');
        return;
    }
    var amount = parseInt(bankAmount);
    if ((isNaN(amount) || amount <= 0) && $('#bankInput').val() != '') {

        //$('#bankAmountInput').addClass('border-danger');
        return;
    }

    var currRemainQtyData = 0;
    let currContainerBarcode = ($('#barcodeContainerInput').val() || "").trim();
    let currBankId = $('#bankInput').val();
    let currDenoId = $('#bankNoteInput').val().split('|')[0];
    let selectedCashCode = ($('#cashInput').find(':selected').text() || '').trim();

    if (cbmsData != null && cbmsData.length > 0) {

        const currCbmsData = cbmsData.filter(x => x.institutionId == Number(currBankId) && x.containerId == currContainerBarcode.toUpperCase() && x.denominationId == currDenoId && x.cbBdcCode === selectedCashCode)[0];

        if (currCbmsData) {
            currRemainQtyData = (currCbmsData.remainingQty / 1000);
        }
    }

    if (amount > currRemainQtyData && $('#bankInput').val() != '') {
        $('#bankAmountInput').addClass('border-danger');
        lockHeaderCard(true);
        return;
    }

    var nextStep = stepCount + 1;
    var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
    if (hasNext) {
        focusStep(nextStep);
        // renderSecondScreenDropdown();

    }

}

async function onBarcodeInputChanged(stepIndex) {
    const containerBarcode = (document.getElementById("barcodeContainerInput").value || "").trim();
    const headerBarcode = (document.getElementById("barcodeHeaderCardInput").value || "").trim();
    let currentValue = "";

    // reset stored created transaction preparations on each barcode input change
    createdTransactionPreparations = [];

    //เปลี่ยนภาชนะ
    if (stepIndex === 1) {
        try {
            if ($("#barcodeContainerInput").val() != $('#containerName').text()) {
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

    var requestData = {
        stepIndex: stepIndex == 3 ? stepIndex + 1 : stepIndex,
        containerBarcode: containerBarcode || null,
        wrapBarcode: null,
        bundleBarcode: null,
        headerCardBarcode: headerBarcode || null,
        bssBNTypeCode: 'CN',
        ReceiveId: cbmsSelected.receiveId ?? null
    };

    try {
        $.enablePageLoader();
        const response = await validateBarcodeStepAsync(requestData);
        //console.log('response', response);

        if (!response) {
            showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
            return;
        }

        if (response.is_success === true || response.isSuccess === true) {

            //Validation
            if (stepIndex === 1) {
                // ✅ Validate: a-z, A-Z หรือ 0-9 เท่านั้น
                if (!/^[A-Za-z0-9]+$/.test(containerBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("บาร์โค้ดภาชนะ ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น");
                    return;
                }
            }
            else if (stepIndex === 3) {
                // ✅ Validate: ต้องเป็นตัวเลขเท่านั้น
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

                        getBankfromBarcode(containerBarcode);

                    } else {
                        var nextStep = stepIndex + 1;
                        stepCount = nextStep;
                        var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
                        if (hasNext) {
                            focusStep(nextStep);
                        }
                    }
                } else {
                    const todayNoTime = new Date();
                    todayNoTime.setHours(0, 0, 0, 0);

                    const currBankAmountInput = (document.getElementById("bankAmountInput").value || "").trim();
                    let currAmount = parseInt(currBankAmountInput);

                    // capture current header/package code so preview uses correct packageBarcode
                    try {
                        const headerEl = document.getElementById('packageCode');
                        if (headerEl) packageBarcode = (headerEl.textContent || headerEl.innerText || '').trim();
                        else if (window.jQuery) packageBarcode = ($('#packageCode').text() || '').trim();

                        if (packageBarcode === '000000000000000000') packageBarcode = '';
                    } catch (e) {
                        console.error('failed to read headerCardCodeText for packageBarcode', e);
                    }

                    if ($.isEmptyObject(cbmsSelected)) {

                        console.log("cbmsSelected data is empty object");

                        let currDenoId = parseInt($('#bankNoteInput').val().split('|')[0]);
                        let currInstId = parseInt($('#bankInput').val());
                        let selectedCashCode = ($('#cashInput').find(':selected').text() || '').trim();

                        const currCbmsData = cbmsData.find(x =>
                            x.institutionId === currInstId &&
                            x.containerId === containerBarcode &&
                            x.denominationId === currDenoId &&
                            x.cbBdcCode === selectedCashCode
                        );

                        if (currCbmsData) {
                            cbmsSelected = currCbmsData;
                        }
                    }

                    const containerPrepareRequest = {
                        "receiveId": cbmsSelected.receiveId,
                        "containerCode": containerBarcode,
                        "packageCode": packageBarcode,
                        "headerCardCode": headerBarcode,
                        "institutionId": cbmsSelected.institutionId,
                        "cashCenterId": parseInt($('#cashInput').val()),
                        "denominationId": cbmsSelected.denominationId,
                        "IsFirstScan": isFirstScan
                    }


                    if (stepCount == 3) {
                        // Ready to insert
                        console.log(cbmsSelected);
                        await updateReceiveCbmsCountsAsync();
                        await updateBarcodeListTableAsync();
                        return;
                    }
                    //console.log('containerPrepareRequest', containerPrepareRequest);

                    if (currAmount <= 0) {

                        showBarcodeErrorModal("เตรียมธนบัตรครบตามจำนวนมัดที่ระบุแล้ว");
                        focusStep(stepIndex);
                        return;
                    }


                    if (cbmsSelected.remainingQty <= 0) {

                        showBarcodeErrorModal("เตรียมธนบัตรครบจำนวนมัดแล้ว");
                        focusStep(stepIndex);
                        return;
                    }


                    const responseCreatePreparation = await createPreparationCaNonMemberContainer(containerPrepareRequest);

                    if (!responseCreatePreparation) {
                        showBarcodeErrorModal(errorMessage);
                        return;
                    }

                    clearHeaderBarcodeInput();
                    await loadPreparationUnsortCaNonMembers(1, 0, '');

                    const responseCbmsCount = await getReCdmsDataTransaction(cbmsSelected.containerId);

                    if (!responseCbmsCount?.is_success || !responseCbmsCount.data?.length) {
                        showBarcodeErrorModal("ไม่พบข้อมูล CBMS หลังบันทึก");
                        focusStep(stepIndex);
                        return;
                    }

                    cbmsData = [];
                    var data = responseCbmsCount.data || {};
                    cbmsData = data.sort((a, b) => a.denominationPrice - b.denominationPrice);


                    const updatedCbmsData = cbmsData.find(x =>
                        x.institutionId === cbmsSelected.institutionId &&
                        x.containerId === cbmsSelected.containerId &&
                        x.denominationId === cbmsSelected.denominationId &&
                        x.cbBdcCode === cbmsSelected.cbBdcCode
                    );

                    if (updatedCbmsData) {
                        cbmsSelected = updatedCbmsData;

                        remainingQty = updatedCbmsData.remainingQty || 0;
                        unfitQty = updatedCbmsData.unfitQty || 0;
                        qty = updatedCbmsData.qty || 0;
                    }


                    //await updateReceiveCbmsCountsAsync();
                    await updateBarcodeListTableAsync();
                    await updatePrepareCount();


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

                            if (responseCbmsCount?.is_success && Array.isArray(responseCbmsCount.data)) {
                                const allRemainingZero = responseCbmsCount.data.every(item => {
                                    return (item.remainingQty / 1000) === 0;
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
                        //renderSecondScreenDropdown();
                    }
                    // update count after create preparation
                    await updateReceiveCbmsCountsAsync();
                }
            } else {

                // Handle remaining zero cases
                if (isAllRemainingZero === true || isRemainingZero === true) {
                    const targetStep = isAllRemainingZero ? 1 : 2;

                    showBarcodeErrorModal(errorMessage);
                    handleClearAndFocusAfterModal(async () => {

                        // Update data
                        await updateCbmsData(containerBarcode);
                        await updatePrepareCount();
                        await updateBarcodeListTableAsync();
                        await updateReceiveCbmsCountsAsync();

                        // Clear inputs based on case
                        if (isAllRemainingZero) {
                            clearStateAfterCheckRemaining(1);
                        }

                        // Clear additional step 2 inputs (only for isRemainingZero)
                        if (isRemainingZero) {
                            clearStateAfterCheckRemaining(2);
                        }

                        // Focus to target step
                        focusStep(targetStep);
                    });
                    return;
                }

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

async function updateCbmsData(containerBarcode) {
    const responseCbmsCount = await getReCdmsDataTransaction(containerBarcode);

    if (!responseCbmsCount?.is_success || !responseCbmsCount.data?.length) {
        showBarcodeErrorModal("ไม่พบข้อมูล CBMS");
        return;
    }

    cbmsData = [];
    var data = responseCbmsCount.data || {};
    cbmsData = data.sort((a, b) => a.denominationPrice - b.denominationPrice);
}

function handleClearAndFocusAfterModal(callback) {
    onceModalHidden('#barcodeErrorModal', function () {
        // support async callbacks
        try {
            const r = callback();
            if (r && typeof r.then === 'function') r.catch(() => { });
        } catch (e) {
            // swallow to avoid unhandled exceptions from modal hide handler
            console.error(e);
        }
    });
}

function clearHeaderBarcodeInput() {
    const input = document.getElementById("barcodeHeaderCardInput");
    if (input) {
        input.value = "";
        input.focus();
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
    renderDropdown({ selectId: 'editCreatedBy', items, includeEmpty: true, emptyText: '-- กรุณาเลือก --' });
    renderDropdown({ selectId: 'multiEditCreatedBy', items, includeEmpty: true, emptyText: '-- กรุณาเลือก --' });
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
        service: 'api/PreparationUnSortCaNonMember/Edit',
        type: 'PUT',
        parameter: requests,
        enableLoader: true,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        onSuccess: function (response) {
            if (response?.is_success) {
                handleActionSuccess();
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
        service: 'api/PreparationUnSortCaNonMember/Delete',
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

                    handleDeleteSuccess();
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


let arrDropdownDisplayTwo = [];

function mapDropdownDisplayTwoToData(items) {

    return (items || []).map(x => ({
        code: x.cashCenterName.trim() + '|' + x.bank + '|' + x.barcode + '|' + x.qty ?? '',
        text: `ภาชนะ: ${x.barcode}, ธนาคาร: ${x.bank}, ศูนย์เงินสด: ${x.cashCenterName.trim()} , ชนิดราคา: ${x.qty}` ?? '',
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

    if (cbmsSelected != null) {

        const currBankCode = cbmsSelected.bankCode.trim() ?? '';
        const currContainerId = cbmsSelected.containerId.trim() ?? '';
        const currDenominationPrice = cbmsSelected.denominationPrice.trim() ?? '';
        const currCashCenterId = $('#branchInput').val().trim();
        let currCashCenterName = '';

        const resultCashCenter = cashCenterList.filter(c => c.cashCenterId == parseInt(currCashCenterId));

        if (resultCashCenter.length > 0) {
            currCashCenterName = resultCashCenter[0].cashCenterName.trim() ?? '';
        }

        tempCbmsData.containerId = currContainerId;
        tempCbmsData.denominationPrice = currDenominationPrice;
        tempCbmsData.bankCode = currBankCode;
        tempCbmsData.cashCenterName = currCashCenterName;

        const currCode = currCashCenterName + '|' + currBankCode + '|' + currContainerId + '|' + currDenominationPrice ?? '';
        const currText = `ภาชนะ: ${currContainerId}, ธนาคาร: ${currBankCode}, ศูนย์เงินสด: ${currCashCenterName} , ชนิดราคา: ${currDenominationPrice}` ?? '';

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
}

let displayTwoCashpoint = '';
let displayTwoBankName = '';
let displayTwoDeno = '';
let displayTwoContainerId = '';
let pageTwoWindow = null;

$('#btnShowSecondScreenPreparation').click(function () {

    let screenWidth = 1440;
    let screenHeight = 900;

    let LeftPosition = (screen.width) ? (screen.width - screenWidth) / 2 : 100;
    let TopPosition = (screen.height) ? (screen.height - screenHeight) / 2 : 100;

    const rootPath = document.body.getAttribute("data-root-path");
    const pageUrl = rootPath + "Preparation/SecondScreenPreparationUnsortCANonMember";
    let pageName = "DisplayTwoPreparationNonMemberWindow";

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

        displayTwoDeno = '0';
        displayTwoCashpoint = '';
        displayTwoBankName = '';
        displayTwoContainerId = '';

        refreshSecondScreenColor(displayTwoDeno);

        $('#displaySmallCashpoint').text(displayTwoCashpoint);
        $('#displaySmallBankName').text(displayTwoBankName);
        $('#displaySmallDeno').text('');
        $('#displaySmallContainerId').text(displayTwoContainerId);

        if (!pageTwoWindow || pageTwoWindow.closed) {
            return;
        }

        const doc = pageTwoWindow.document;

        if (!doc || !doc.getElementById('displayCashpoint')) {
            return;
        }

        $(doc).find('#denoType').val(displayTwoDeno);
        $(doc).find('#displayCashpoint').text(displayTwoCashpoint);
        $(doc).find('#displayBankName').text(displayTwoBankName);
        $(doc).find('#displayDeno').text('');
        $(doc).find('#displayContainerId').text(displayTwoContainerId);

        $(doc).find('#btnRefreshSecondScreen').trigger('click');

        return;
    }

    const parts = selectedValue.split('|');

    displayTwoCashpoint = parts[0] ?? '';
    displayTwoBankName = parts[1] ?? '';
    displayTwoContainerId = parts[2] ?? '';
    displayTwoDeno = parts[3] ?? '';

    refreshSecondScreenColor(displayTwoDeno);

    $('#displaySmallCashpoint').text(displayTwoCashpoint);
    $('#displaySmallBankName').text(displayTwoBankName);
    $('#displaySmallDeno').text(displayTwoDeno);
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
    }
    else {
        if (tempCbmsData != null && tempCbmsData.containerId !== '') {

            displayTwoCashpoint = tempCbmsData.cashCenterName ?? '';
            displayTwoBankName = tempCbmsData.bankCode ?? '';
            displayTwoContainerId = tempCbmsData.containerId ?? '';
            displayTwoDeno = tempCbmsData.denominationPrice ?? '';
        }
    }

    $(pageTwoWindow.document).find('#denoType').val(displayTwoDeno);
    $(pageTwoWindow.document).find('#displayCashpoint').text(displayTwoCashpoint);
    $(pageTwoWindow.document).find('#displayBankName').text(displayTwoBankName);
    $(pageTwoWindow.document).find('#displayDeno').text("฿" + displayTwoDeno);
    $(pageTwoWindow.document).find('#displayContainerId').text(displayTwoContainerId);
    $(pageTwoWindow.document).find('#btnRefreshSecondScreen').click();
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


async function handleActionSuccess() {

    clearAllTempData();

    $('#deleteConfirmModal').modal('hide');
    $('#deleteOtpModal').modal('hide');
    $('#successModal').modal('show');

    await onUpdateSuccess();
}

async function onUpdateSuccess() {
    clearSelectionState();
    await reloadTable();

    const containerBarcode = (document.getElementById("barcodeContainerInput").value || "").trim();
    if (containerBarcode) {
        const responseCbmsCount = await getReCdmsDataTransaction(containerBarcode);
        if (responseCbmsCount?.is_success && Array.isArray(responseCbmsCount.data) && responseCbmsCount.data.length > 0) {
            cbmsData = responseCbmsCount.data.sort((a, b) => a.denominationPrice - b.denominationPrice);

            if (cbmsSelected && cbmsSelected.institutionId) {
                const updatedCbms = cbmsData.find(x =>
                    x.institutionId === cbmsSelected.institutionId &&
                    x.containerId === cbmsSelected.containerId &&
                    x.denominationId === cbmsSelected.denominationId &&
                    x.cbBdcCode === cbmsSelected.cbBdcCode
                );
                if (updatedCbms) {
                    cbmsSelected = updatedCbms;

                    qty = updatedCbms.qty || 0;
                    remainingQty = updatedCbms.remainingQty || 0;
                    unfitQty = updatedCbms.unfitQty || 0;

                    remainQty = remainingQty / 1000;

                    bundleCountByPackage = remainQty;
                    targetBundleCount = remainQty;

                    $('#bankAmountInput').val(remainQty);

                    if (remainQty <= 0) {
                        lockHeaderCard(true);
                        lockBankAmount(true);
                    }

                    if (!isFirstScan) {
                        isFirstScan = true;
                    }

                    await updateBarcodeWrapAndPackageCodeAsync();
                    await updateReceiveCbmsCountsAsync();
                }
            }
        }
        await updatePrepareCount();
        await updateBarcodeListTableAsync();
    }
}

async function handleDeleteSuccess() {

    clearAllTempData();

    $('#deleteConfirmModal').modal('hide');
    $('#deleteOtpModal').modal('hide');
    $('#deleteSuccessModal').modal('show');

    // capture current header/package code so preview uses correct packageBarcode
    try {
        const headerEl = document.getElementById('packageCode');
        if (headerEl) packageBarcode = (headerEl.textContent || headerEl.innerText || '').trim();
        else if (window.jQuery) packageBarcode = ($('#packageCode').text() || '').trim();

        if (packageBarcode === '000000000000000000') packageBarcode = '';
    } catch (e) {
        console.error('failed to read headerCardCodeText for packageBarcode', e);
    }

    await onDeleteSuccess();
}

async function onDeleteSuccess() {
    clearSelectionState();
    await reloadTable();

    const containerBarcode = (document.getElementById("barcodeContainerInput").value || "").trim();
    if (containerBarcode) {
        const responseCbmsCount = await getReCdmsDataTransaction(containerBarcode);
        if (responseCbmsCount?.is_success && Array.isArray(responseCbmsCount.data) && responseCbmsCount.data.length > 0) {
            cbmsData = responseCbmsCount.data.sort((a, b) => a.denominationPrice - b.denominationPrice);

            if (cbmsSelected && cbmsSelected.institutionId) {
                const updatedCbms = cbmsData.find(x =>
                    x.institutionId === cbmsSelected.institutionId &&
                    x.containerId === cbmsSelected.containerId &&
                    x.denominationId === cbmsSelected.denominationId &&
                    x.cbBdcCode === cbmsSelected.cbBdcCode
                );
                if (updatedCbms) {
                    cbmsSelected = updatedCbms;

                    qty = updatedCbms.qty || 0;
                    remainingQty = updatedCbms.remainingQty || 0;
                    unfitQty = updatedCbms.unfitQty || 0;

                    remainQty = remainingQty / 1000;

                    if (remainQty <= 0) {
                        lockHeaderCard(true);
                        lockBankAmount(true);
                    }

                    await updateBarcodeWrapAndPackageCodeAsync();
                    await updateReceiveCbmsCountsAsync();
                }
            }
        }
        await updatePrepareCount();
        await updateBarcodeListTableAsync();
    }
}

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

    // --- ส่วนการตั้งค่าหน้าต่างใหม่ (เหมือนเดิม) ---
    const title = 'PrintWindow';
    const w = 1200;
    const h = 850;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const windowFeatures = `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}, resizable=yes`;

    // 1. เปิดหน้าต่างใหม่รอก่อน (โดยยังไม่ระบุ URL)
    const newWindow = window.open('', title, windowFeatures);

    if (newWindow) {
        // 2. สร้าง Form ชั่วคราวเพื่อส่งข้อมูลแบบ POST
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Report/PreparationUnsortCANonMember';
        form.target = title; // ส่งข้อมูลเข้าหน้าต่างที่เปิดไว้ด้านบน

        // 3. ใส่ IDs ทั้งหมดลงใน Input (ทำเป็น Hidden inputs)
        selectedIds.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'preparationIds'; // ชื่อต้องตรงกับ Parameter ใน Controller
            input.value = id;
            form.appendChild(input);
        });

        // 4. สั่งส่งข้อมูล
        document.body.appendChild(form);
        form.submit();

        // 5. ลบ Form ทิ้ง
        document.body.removeChild(form);

        if (window.focus) {
            newWindow.focus();
        }
    }
}

function clearStateOnContainerInput() {

    // Clear valiable 
    remainQty = 0;
    responseBranchState = false;
    stepCount = 1;
    bankobject = {};
    cbmsSelected = {};
    cbmsData = [];
    bankList = [];
    cashCenterList = [];
    cashCenterByBankList = [];
    currentScannedPackageCode = '';


    pageState.isScannedContainerConflict = false;
    pageState.scannedContainerId = '';
    pageState.scannedContainerConflictText = '';
    totalQtyByContainer = 0;
    
    // Reset bundle count tracking
    targetBundleCount = 0;
    currentScanCount = 0;

    // Clear Screen

    $('#bankInput').empty();
    $('#bankInput').prop('disabled', true);

    $('#cashInput').empty();
    $('#cashInput').prop('disabled', true);

    $('#branchInput').empty();
    $('#branchInput').prop('disabled', true);

    $('#bankNoteInput').empty();
    $('#bankNoteInput').prop('disabled', true);

    $('#notesample').html('0');

    const element = document.querySelector('#notesample');
    const allowedClasses = ['qty-badge'];

    Array.from(element.classList).forEach(cls => {
        if (!allowedClasses.includes(cls)) {
            element.classList.remove(cls);
        }
    });

    $("#bankAmountInput").val('');
    $("#barcodeHeaderCardInput").val('');

    const sidebarContainerName = document.getElementById('sidebarContainerName');
    if (sidebarContainerName) {
        sidebarContainerName.textContent = '-';
    }

    $('#barcodeListBody').empty();
    $('#dropdownDisplayTwo').val('').trigger('change');
    $("#containerName").text('');
    $("#prepareCount").text('0 / 0');
    $("#reconcileCount").text('0');
    $("#packageCode").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#bundleCode").text('000000000000000000000000');
}

function clearAfterBankNoteInputChange() {

    if (cbmsSelected) {
        let currRemainQty = cbmsSelected.remainingQty / 1000;
        $("#bankAmountInput").val(currRemainQty);
        // Reset bundle counters when changing denomination
        targetBundleCount = 0;
        currentScanCount = 0;
    } else {
        $("#bankAmountInput").val('');
    }

    $("#barcodeHeaderCardInput").val('');
    $("#packageCode").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#bundleCode").text('000000000000000000000000');
}

async function clearAfterCashInputAsync() {

    /*let currDenoSelected = $('#bankNoteInput').val().split('|')[1];
    const element = document.querySelector('#notesample');
    const allowedClasses = ['qty-badge'];

    Array.from(element.classList).forEach(cls => {
        if (!allowedClasses.includes(cls)) {
            element.classList.remove(cls);
        }
    });*/

    //$('#notesample').addClass('qty-' + currDenoSelected).html(currDenoSelected);

    /*if (cbmsSelected) {
        let currRemainQty = cbmsSelected.remainingQty / 1000;
        $("#bankAmountInput").val(currRemainQty);
        // Reset bundle counters when changing cash center
        targetBundleCount = 0;
        currentScanCount = 0;
    } else {
        $("#bankAmountInput").val('');
    }*/

    $('#bankNoteInput').empty();
    $('#notesample').html('0');

    const element = document.querySelector('#notesample');
    const allowedClasses = ['qty-badge'];

    Array.from(element.classList).forEach(cls => {
        if (!allowedClasses.includes(cls)) {
            element.classList.remove(cls);
        }
    });

    $("#bankAmountInput").val('');
    $("#barcodeHeaderCardInput").val('');

    // Reset bundle counters when changing bank
    targetBundleCount = 0;
    currentScanCount = 0;
    bundleCountByPackage = 0;

    $("#bankAmountInput").val('');
    $("#barcodeHeaderCardInput").val('');
    $("#packageCode").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#bundleCode").text('000000000000000000000000');
}

function clearAfterBankInput() {

    $('#cashInput').empty();
    $('#branchInput').empty();
    $('#bankNoteInput').empty();

    $('#notesample').html('0');

    const element = document.querySelector('#notesample');
    const allowedClasses = ['qty-badge'];

    Array.from(element.classList).forEach(cls => {
        if (!allowedClasses.includes(cls)) {
            element.classList.remove(cls);
        }
    });

    $("#bankAmountInput").val('');
    $("#barcodeHeaderCardInput").val('');
    
    // Reset bundle counters when changing bank
    targetBundleCount = 0;
    currentScanCount = 0;

    $("#packageCode").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#bundleCode").text('000000000000000000000000');
}

function handleFocusStep(step) {
    // Ensure we only react once when the barcode error modal is hidden.
    onceModalHidden('#barcodeErrorModal', function () {
        try {
            focusStep(step);
        } catch (e) {
            console.error(e);
        }
    });
}

function clearStateAfterCheckRemaining(stepIndex) {
    switch (stepIndex) {
        case 1: // cleare all input
            $("#barcodeContainerInput").val('');
            clearStateOnContainerInput();
            $('#bankInput').val('').trigger('change');

            // อัพเดตชื่อภาชนะใน sidebar
            const sidebarContainerName = document.getElementById('sidebarContainerName');
            if (sidebarContainerName) {
                sidebarContainerName.textContent = '-';
            }
            break;
        case 2: // Clear all Step 2 dropdowns and inputs
            $('#bankInput').val('').trigger('change');
            $('#cashInput').empty();
            $('#branchInput').empty();
            $('#bankNoteInput').empty();
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

// Helper: populate bankNoteInput filtered by selected bank and selected cash (cbBdcCode)
function populateBankNoteOptions(bankValue) {
    const $bankNote = $('#bankNoteInput');
    $bankNote.empty();
    $bankNote.append(new Option('-- กรุณาเลือก --', '', true, true));

    // selected cash input's displayed code (cashCenterCode) is used to match cbBdcCode
    const selectedCashCode = ($('#cashInput').find(':selected').text() || '').trim();

    (cbmsData || [])
        .filter(item => item?.remainingQty !== 0)
        .forEach((item) => {
            if (item.institutionId === Number(bankValue)) {
                // if a cash code is selected, filter by cbBdcCode; otherwise include all
                if (!selectedCashCode || String(item.cbBdcCode || '').trim() === selectedCashCode) {
                    $bankNote.append('<option value="' + item.denominationId + '|' + item.denominationPrice + '">' + item.denominationPrice + '</option>');
                }
            }
        });

    $bankNote.select2({
        theme: 'bootstrap-5',
        placeholder: "- เลือก -"
    });
}