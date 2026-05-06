let remainQty = 0;
let responseBranchState = false;
let stepCount = 1;
let bankobject = {};
let isResettingSelect = false;
let currentcbmsData = {};
let currentCbmsonTable = [];
let matchedCbms = {};

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
    cbmsCollection: [],
    currentCbms: null,
    cbmsHeader: null,
    computed: { instIds: [], denomIds: [], bundleCount: 0 },
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
    isScannedContainerConflict: false,
    scannedContainerId: '',
    scannedContainerConflictText: '',
    selected: { bankId: 0, denominationId: 0, zoneId: 0, cashpointId: 0, cashCenterId: 0, branchId: 0 },
    denoByBankCollection: []

};
function showCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear() + 543;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    document.getElementById("info-current-datetime").textContent = formatted;
}
setInterval(showCurrentDateTime, 1000);
showCurrentDateTime();

function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delay);
    };
}

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
const barcodeSteps = [
    { stepIndex: 1, inputId: "barcodeContainerInput" },
    { stepIndex: 2, inputId: "bankInput", inputClass: 'bankInfo' },  
    { stepIndex: 3, inputId: "barcodeHeaderCardInput" }
];

const tableState = {
    pageNumber: 1,
    pageSize: 0,
    search: '',
    sorts: [{ field: "createdDate", dir: "desc" }]
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

    document.getElementById("barcodeHeaderCardInput")
        ?.addEventListener("change", () => focusStep(3));

    // -----------------------------

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

let tableData = [];
function clearAllTempData() {
    clearTempDeleteData();
    clearTempEditData();
}
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
async function reloadTable() {
    await loadPreparationUnsortCaMembers(
        tableState.pageNumber,
        tableState.pageSize,
        tableState.search
    );
}
function formatDateThai(dateValue) {
    if (!dateValue) return '';

    const d = new Date(dateValue);
    if (isNaN(d)) return dateValue;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543;
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}.${minute}`;
}
function mapApiToData(items) {

    return (items || []).map(x => ({
        id: x.prepareId ?? x.id ?? 0,
        header: x.headerCardCode ?? '',
        bank: x.bank ?? x.bankCode ?? '',
        cashPointName: x.center ?? x.cashPointName ?? '',
        qty: x.qty ?? x.denominationPrice ?? 0,
        barcode: x.barcode ?? x.containerCode ?? '',
        date: formatDateThai(x.createdDate),
        createdBy: x.createdBy ?? '',
        createdByName: x.createdByName ?? '',
        updatedBy: x.updatedBy ?? '',
        isFlag: x.isFlag ?? true,
        zoneId: x.zoneId,
        zoneName: x.zoneName,
        machineId: x.machineId,
        isSameMachine: x.isSameMachine
    }));
}
// =========================
// Init focus + debounce
// =========================
// ดูว่า current step อยู่ที่ step ไหน ถ้าอยู่ใน step นั้น input id จะถูก disable
function initBarcodeFocusWorkflow() {
    barcodeSteps.forEach((step, index) => {
        const input = document.getElementById(step.inputId);
        if (!input) return;

        input.disabled = index !== 0;

        const previewHandler = debounce(() => { }, 300);
        input.addEventListener('input', previewHandler);

        input.addEventListener('keydown', async (e) => {
            if (e.key !== 'Enter' && e.key !== 'Tab') return;
            e.preventDefault();
            if (input.disabled) return;

            const value = (input.value || '').trim();
            if (!value) return;

            playScannerAlarm();
            await onBarcodeInputChanged(step.stepIndex); // ← ใช้ step.stepIndex ตลอด
        });
    });

    focusStep(1);
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

    if (!currentValue) return;

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
        bssBNTypeCode: "CA",
        ReceiveId : pageState.currentCbms?.receiveId ?? null

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
                if (!/^[A-Za-z0-9]+$/.test(containerBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("บาร์โค้ดภาชนะ ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น");
                    return;
                }
            } else if (stepIndex === 3) {
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

            // ==================================================
            // STEP 1 : scan container
            // ==================================================
            if (stepIndex === 1) {
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
                    } else {
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
                    if (stepIndex === 1) {
                        await setupDropdownsFromCbms(containerBarcode);

                    } else {
                        var nextStep = stepIndex + 1;
                        stepCount = nextStep;
                        var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
                        if (hasNext) {
                            focusStep(nextStep);
                        }
                    }
                } else {
                    // ==================================================
                    // STEP 3 : scan header card
                    // ==================================================

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
                        receiveId: pageState.currentCbms.receiveId,
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
                  
                    const responseCreate = await createPreparationCaMemberContainer(containerPrepareRequest);

                    if (!responseCreate) {
                        showBarcodeErrorModal(errorMessage);
                        return;
                    }

                    clearHeaderBarcodeInput();

                    await loadPreparationUnsortCaMembers(1, 0, '');

                    // refresh CBMS จาก API (pattern เดียวกับ CC)
                    const updatedCbms = await loadCbmsAfterContainerScan(containerBarcode);
                    // loadCbmsAfterContainerScan set pageState.cbmsCollection ให้แล้วในตัว

                    await updateBarcodeListTableAsync();

                    if (updatedCbms && updatedCbms.length > 0) {

                        // update currentCbms ให้ตรงกับที่ select ไว้
                        const bankId = Number(pageState.selected.bankId || 0);
                        const denomId = Number(pageState.selected.denominationId || 0);
                        const matched = updatedCbms.find(x =>
                            Number(x.institutionId) === bankId &&
                            Number(x.denominationId) === denomId
                        );
                        if (matched) {
                            pageState.currentCbms = { ...pageState.currentCbms, ...matched };
                        }

                        const sortedCbms = updatedCbms.sort((a, b) => {
                            const r = a.institutionId - b.institutionId;
                            return r !== 0 ? r : a.denominationId - b.denominationId;
                        });

                        if (responseCreate.is_success === true || responseCreate.isSuccess === true) {
                            const resData = responseCreate.data;
                            packageBarcode = '';
                            if (Array.isArray(resData.transactionPreparation) && resData.transactionPreparation.length > 0) {

                                // store created transactionPreparation items for later delete comparison
                                try {
                                    createdTransactionPreparations.push(...resData.transactionPreparation);
                                } catch (e) {
                                    console.error('failed to store transactionPreparation', e);
                                }

                                currentScanCount++;

                                if (isFirstScan) isFirstScan = false;
                                
                                await updateBarcodeWrapAndPackageCodeAsync();

                                const allRemainingZero = sortedCbms.every(
                                    item => (item.remainingQty / 1000) === 0
                                );

                                if (allRemainingZero) {
                                    clearStateAfterCheckRemaining(1);
                                    focusStep(1);
                                } else {
                                    if (currentScanCount >= targetBundleCount) {
                                        clearStateAfterCheckRemaining(2);
                                        focusStep(2);
                                    }
                                }
                            } else {
                                bundleCountByPackage = 0;
                            }
                        }

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

                        // Update data
                        await loadCbmsAfterContainerScan(containerBarcode);
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

                // Normal Flow Error Message
                showBarcodeErrorModal(errorMessage);
                handleFocusStep(stepIndex);
            }
        } else {
            var msgCode = response.msg_code || response.msgCode || "";
            var msgDesc = response.msg_desc || response.msgDesc || "";
            $.sweetError({ text: msgCode + " : " + msgDesc });
        }
    } catch (err) {
        console.error(err);
        showBarcodeErrorModal("เกิดข้อผิดพลาดในการตรวจสอบบาร์โค้ด");
    }
    finally {
        $.disablePageLoader();
    }
}
async function loadPreparationUnsortCaMembers(pageNumber = 1, pageSize = 0, search = '') {
    try {
        const requestData = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search,
            sorts: [
                { field: "createdDate", dir: "desc" }
            ]
        };

        const response = await getPreparationUnsortCaMembersDetailAsync(requestData);

        const items = response?.items || response?.data?.items || response?.data || [];
        const totalCount = response?.totalCount || response?.data?.totalCount || items.length;

        tableData = mapApiToData(items);

        renderTable();

        setupDropdownforSecondScreen();


    } catch (err) {
        console.error(err);
        alert("โหลดข้อมูลไม่สำเร็จ");
    }
}

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
    cashPointName: '',
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
        cashPointName: '',
        zoneName: ''
    };
}

function clearSelectionState() {
    document.querySelectorAll('.row-checkbox').forEach(x => x.checked = false);

    updateSelectedCount?.();
}
let countdown = 300;
let timerInterval = null;
let deleteCountdown = 300;
let deleteTimerInterval = null;

function renderTable() {
    const tbody = document.getElementById('tableBody');

    let html = '';
    const scannedId = String(pageState.scannedContainerId || '').trim();
    const hasConflict = pageState.isScannedContainerConflict === true;

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
            <td style="width: 26px;">
                ${hideCheckboxAttr}
            </td>
            <td>${item.header} ${isLocked ? `<i class="bi bi-exclamation-triangle-fill text-warning ms-2" title="${tooltipMsg || 'พบการ prepare จากเครื่องอื่น'}"></i>` : ''}</td>
            <td>${item.bank}</td>
            <td>${item.zoneName}</td>
            <td>${item.cashPointName}</td>
            <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
            <td>${item.date}</td>
            <td>${item.barcode}</td>
            <td>
            <div class="action-btns">
                <button class="btn-action" onclick="editRow(${item.id})"  ${disabledAttr}><i class="bi bi-pencil"></i></button>
                <button class="btn-action btn-danger" onclick="deleteRow(${item.id})"  ${disabledAttr}><i class="bi bi-trash"></i></button>
            </div>
        </td>
      </tr>
    `;
    });

    tbody.innerHTML = html;
}
function isRowLocked(item) {
    const machineId = Number(item?.machineId || 0);
    return pageState.conflictMachineIds.includes(machineId);
}

function updateCounts() {
    document.getElementById('prepareCount').textContent = `0 / 0`;
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
    const allIds = tableData.map(item => item.id);
    if (allIds.length === 0) {
        toastr.error('ไม่มีข้อมูลให้ลบ');
        return;
    }

    tempDeleteData.prepareIds = allIds;

    document.getElementById('deleteCountMsg').textContent = allIds.length;

    showModal('#confirmDeleteModal');
}


// ====================================================== Start Edit ============================================================= //
function editRow(id) {
    tempEditData.isMultiEdit = false;
    const item = tableData.find(x => x.id === id);
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

function handleInputSelect(name) {
    $('#barcodeErrorModal').on('hidden.bs.modal', function () {
        $(name).focus().select();
    });
}

//  Modal 2: ยืนยัน Edit //
async function showConfirmModal() {
    const id = parseInt(document.getElementById("editId").value);
    const item = tableData.find(x => x.id === id);

    if (!item) return;

    tempEditData.newHeader = document.getElementById("editHeaderCard").value;
    tempEditData.newCreatedBy = document.getElementById("editCreatedBy").value;

    if (!tempEditData.newHeader.trim() || !tempEditData.newCreatedBy.trim()) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
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
        bssBNTypeCode: 'CA',
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
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </div>
                        </td>
                        <td>1</td>
                        <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                        <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                        <td>${item.bank}</td>
                        <td>${item.zoneName}</td>
                        <td>${item.cashPointName}</td>
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

//  Modal 3: ยืนยัน OTP //
function submitApprovalRequest() {
    const remark = document.getElementById("reasonText").value.trim();
    const supervisorName = document.getElementById("supervisorName").value;

    if (!remark) {
        alert("กรุณาระบุเหตุผลในการแก้ไข");
        return;
    }

    if (!supervisorName) {
        alert("กรุณาเลือก Supervisor");
        return;
    }

    tempEditData.remark = remark;
    tempEditData.supervisorName = supervisorName;
    const otpTableBody = document.getElementById("otpTableBody");
    otpTableBody.innerHTML = '';

    const count = tempEditData.selectedIds.length;
    document.getElementById('editOtpListCount').textContent = count;

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
                           <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                               <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                           </svg>
                       </div>
                   </td>
                   <td>1</td>
                   <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                   <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                   <td>${item.bank}</td>
                   <td>${item.zoneName}</td>
                   <td>${item.cashPointName}</td>
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
                           <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                               <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                           </svg>
                       </div>
                   </td>
                   <td>1</td>
                   <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                   <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                   <td>${item.bank}</td>
                   <td>${item.zoneName}</td>
                   <td>${item.cashPointName}</td>
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
     bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();
    setTimeout(() => {
        let otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
        otpModal.show();
    }, 300);
    //getModal('#confirmModal')?.hide();
    //showModal('#otpModal');
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
        alert('กรุณาเลือกรายการที่ต้องการแก้ไข');
        return;
    }

    //if (selectedIds.length === 1) {
    //    alert('กรุณาเลือกมากกว่า 1 รายการ สำหรับการแก้ไขหลายรายการ');
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
        alert('กรุณากรอก Preparation ใหม่');
        return;
    }

    const count = tempEditData.selectedIds.length;
    document.getElementById('editListCount').textContent = count;

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
                       <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                           <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                       </svg>
                   </div>
                </td>
                <td>${index + 1}</td>
                <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                <td>${item.bank}</td>
                <td>${item.zoneName}</td>
                <td>${item.cashPointName}</td>
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
// ====================================================== End Edit ============================================================= //





// ====================================================== Delete ============================================================= //
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
                <td>${item.cashPointName}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });

    document.getElementById('deleteReasonText').value = '';
    document.getElementById('deleteSupervisorSelect').value = '';


    //// ⭐ ปิด Modal ก่อนหน้า
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
    const remark = document.getElementById('deleteReasonText').value;;
    const supervisorName = document.getElementById('deleteSupervisorSelect').value;

    if (!remark) {
        alert('กรุณาระบุเหตุผลในการลบ');
        return;
    }
    if (!supervisorName) {
        alert('กรุณาเลือก Supervisor');
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
                    <div style="width: 30px; height: 30px; background: #dc3545; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                        <i class="bi bi-trash-fill text-white" style="font-size: 14px;"></i>
                    </div>
                </td>
                <td>${index + 1}</td>
                <td>${item.header}</td>
                <td>${item.bank}</td>
                <td>${item.cashPointName}</td>
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
function confirmDeleteMultiple() {
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        if (id) selectedIds.push(id);
    });
    if (selectedIds.length === 0) {
        alert('กรุณาเลือกรายการที่ต้องการลบ');
        return;
    }

    //if (selectedIds.length === 1) {
    //    alert('กรุณาเลือกมากกว่า 1 รายการ สำหรับการลบหลายรายการ');
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

// ====================================================== End Delete ============================================================= //

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




// ====================================================== OTP ================================================================ //
function sendOtp() {
    document.getElementById("btnSendOtp").disabled = true;
    document.getElementById("otpInput").disabled = false;
    document.getElementById("otpInput").focus();
    document.getElementById("btnConfirmOtp").disabled = false;

    document.getElementById("otpErrorMsg").innerText = "";

    onClickSendOtp();

    clearInterval(timerInterval);
    countdown = 300;
    runOtpTimer();

}

// เวลา เมื่อกดปุ่ม 
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

// ยืนยัน Otp
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
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_MEMBER_EDIT,
        bssMailRefCode: tempEditData.refcode,
        bssMailOtpCode: otpInput
    })
        .done(function () {

            clearInterval(timerInterval);
            submitEdit();

        })
        .fail(function () {
            toastr.error("Verify OTP FAIL");
        });

    renderTable();

    document.getElementById('selectAll').checked = false;
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    updateSelectedCount();

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
function onClickSendOtp() {
    const payload = {
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: tempEditData.supervisorId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_MEMBER_EDIT
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
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_CA_MEMBER_DELETE
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
    clearInterval(deleteTimerInterval);

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
            toastr.error("Verify OTP FAIL");
        });




}

// ===================================================== End OTP =============================================================== //

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

    bootstrap.Modal.getInstance(document.getElementById('otpModal')).hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    }, 300);
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

function clearTempData() {
    tempEditData = {
        id: null,
        selectedIds: [],
        isMultiEdit: false,
        isDelete: false,
        deleteIds: [],
        oldHeader: '',
        oldCreatedBy: '',
        newHeader: '',
        newCreatedBy: '',
        remark: '',
        supervisorName: ''
    };
}

function getPreparationUnsortCaMembersDetailAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'api/PreparationUnsortCaMember/GetAll',
            type: 'POST',
            parameter: requestData,
            enableLoader: false
            , headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
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
        service: 'api/PreparationUnSortCaMember/Edit',
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
        service: 'api/PreparationUnSortCaMember/Delete',
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
async function handleEditActionSuccess() {
    clearAllTempData();
    getModal('#otpModal')?.hide();
    getModal('#confirmModal')?.hide?.();
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

    const containerBarcode = document.getElementById("barcodeContainerInput").value.trim();
    if (containerBarcode) {
        const cbms = await loadCbmsAfterContainerScan(containerBarcode);
        if (cbms && cbms.length > 0) {
            const bankId = Number(pageState.selected.bankId || 0);
            const denomId = Number(pageState.selected.denominationId || 0);
            if (bankId > 0 && denomId > 0) {
                const matched = cbms.find(x =>
                    Number(x.institutionId) === bankId &&
                    Number(x.denominationId) === denomId
                );
                if (matched) {
                    pageState.currentCbms = { ...pageState.currentCbms, ...matched };
                }
            }
        }
        await updateBarcodeListTableAsync();
        if (pageState.currentCbms && pageState.selected?.bankId) {
            await updateBarcodeWrapAndPackageCodeAsync();
            await updateReceiveCbmsCountsAsync();
        }
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
            $('#barcodeContainerInput').trigger('focus').trigger('select');

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
            $('#barcodeHeaderCardInput').trigger('focus').trigger('select');
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
let arrDropdownDisplayTwo = [];

function mapDropdownDisplayTwoToData(items) {

    return (items || []).map(x => ({
        code: x.cashPointName.trim() + '|' + x.bank + '|' + x.barcode + '|' + x.qty + '|' + x.zoneName.trim() ?? '',
        text: `ภาชนะ: ${x.barcode}, ธนาคาร: ${x.bank}, ศูนย์เงินสด: ${x.cashPointName.trim()} , ชนิดราคา: ${x.qty} , โซน: ${x.zoneName.trim()}` ?? '',
    }));
}

function setupDropdownforSecondScreen() {
    const select = document.getElementById("dropdownDisplayTwo");
    if (!select) return;

    //const activeTableData = tableData.filter(c => c.isFlag === true);
    const activeTableData = tableData;

    arrDropdownDisplayTwo = mapDropdownDisplayTwoToData(activeTableData);
    if (arrDropdownDisplayTwo != null && arrDropdownDisplayTwo.length > 0) {
        const distinctTableData = arrDropdownDisplayTwo.filter((value, index, self) => index === self.findIndex(v => v.code.trim() === value.code.trim()));

        select.innerHTML = '<option value="">-- กรุณาเลือก --</option>';
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

    if (window.pageState.currentCbms != null) {

        const currBankCode = window.pageState.currentCbms.bankCode.trim() ?? '';
        const currContainerId = window.pageState.currentCbms.containerId.trim() ?? '';
        const currDenominationPrice = window.pageState.currentCbms.denominationPrice.trim() ?? '';
        let currCashCenterName = window.pageState.currentCbms.cashCenterName ?? '';
        let currZoneName = window.pageState.currentZone.name.trim() ?? '';

        tempCbmsData.bankCode = currBankCode ?? '';
        tempCbmsData.containerId = currContainerId ?? '';
        tempCbmsData.denominationPrice = currDenominationPrice ?? '';
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
    const pageUrl = rootPath + "Preparation/SecondScreenPreparationUnsortCAMember";
    let pageName = "DisplayTwoPreparationMemberWindow";

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

            displayTwoCashpoint = tempCbmsData.cashPointName ?? '';
            displayTwoBankName = tempCbmsData.bankCode ?? '';
            displayTwoContainerId = tempCbmsData.containerId ?? '';
            displayTwoDeno = tempCbmsData.denominationPrice ?? '';
            // displayTwoZone = tempCbmsData.zoneName ?? '';
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

function getReCdmsDataTransaction(containerBarcode) {
    const barcode = document.getElementById("barcodeContainerInput").value;
    let requestData = {
        containerId: containerBarcode,
    };

    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'ReceiveCbms/ValidateCbmsDataTransaction',
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
async function checkPointsteptwo() {
    const clearAllValid = () => $('.bankInfo').removeClass('border-danger');
    clearAllValid();

    const s = window.pageState?.selected || {};
    const bankId = Number(s.bankId || 0);
    const zoneId = Number(s.zoneId || 0);
    const cashpointId = Number(s.cashpointId || 0);
    const denomId = Number(s.denominationId || 0);

    if (bankId > 0) {
        if (zoneId <= 0) { $('#zoneInput').addClass('border-danger'); return; }
        if (cashpointId <= 0) { $('#cashInput, #branchInput').addClass('border-danger'); return; }  // ✅ เอา cashCenterId ออก
        if (denomId <= 0) { $('#bankNoteInput').addClass('border-danger'); return; }
    }

    updateReceiveCbmsCountsAsync();

    const nextStep = stepCount + 1;
    const hasNext = barcodeSteps.some(s => s.stepIndex === nextStep);
    await updatePrepareCount();
    if (hasNext) focusStep(nextStep);
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

const bankInput = document.getElementById('bankAmountInput');

function setRemainQty(remainQty) {
    const display = Number(remainQty) || 0;
    bankInput.value = String(display);
}

bankInput.addEventListener('input', () => {
    let v = Number(bankInput.value);

    if (Number.isNaN(v)) return;

    if (v < 0) bankInput.value = '0';
});

function createPreparationCaMemberContainer(requestData) {
    $.enablePageLoader();
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'api/PreparationUnsortCaMember/Create',
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

function updateCbmsContainer(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'api/PreparationUnsortCaMember/Create',
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


async function loadCbmsAfterContainerScan(containerBarcode) {
    const res = await getReCdmsDataTransaction(containerBarcode);
    const ok = res?.is_success === true || res?.isSuccess === true;

    if (!ok || !Array.isArray(res.data) || res.data.length === 0) {
        pageState.cbmsCollection = [];
        pageState.currentCbms = null;
        pageState.computed.bundleCount = 0;
        return [];
    }


    pageState.cbmsCollection = res.data;
    return res.data;
}

function extractCbmsIds() {
    const rows = pageState.cbmsCollection || [];
    return {
        bankIds: [...new Set(rows.map(x => Number(x.institutionId)).filter(Boolean))],
        denomIds: [...new Set(rows.map(x => Number(x.denominationId)).filter(Boolean))]
    };
}


async function loadInstitutionMasterByIds(bankIds, departmentId) {
    const request = {
        tableName: "MasterInstitution",
        operator: "OR",
        searchCondition: bankIds.map(id => ({
            columnName: "InstitutionId",
            filterOperator: "EQUAL",
            filterValue: id
        })),
        selectItemCount: 200,
        includeData: true,
        departmentId
    };

    const res = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);
    const ok = res?.is_success === true || res?.isSuccess === true;
    return ok && Array.isArray(res.data) ? res.data : [];
}

function updateCurrentCbmsAndBundle() {
    const bankId = Number(pageState.selected.bankId || 0);
    const denomId = Number(pageState.selected.denominationId || 0);

    pageState.currentCbms = (pageState.cbmsCollection || []).find(x =>
        Number(x.institutionId) === bankId &&
        Number(x.denominationId) === denomId
    ) || null;

    const rawQty = Number(pageState.currentCbms?.remainingQty || 0);
    const bundleCount = Math.max(0, Math.floor(rawQty / 1000));

    targetBundleCount = bundleCount;
    pageState.computed.bundleCount = bundleCount;

    if (bundleCount <= 0) {
        lockHeaderCard(true);
        lockBankAmount(true);
    }

    if (!isFirstScan) isFirstScan = true;

    setRemainQty(bundleCount);

    const el = document.querySelector('#bundleCountInput');
    if (el) {
        el.value = bundleCount;
        el.max = bundleCount;
        el.oninput = function () {
            const v = parseInt(this.value || '0', 10);
            if (v > bundleCount) this.value = bundleCount;
        };
    }
    checkPointsteptwo();
    refreshStep3Lock();
}

async function setupDropdownsFromCbms(containerBarcode) {
    const cbms = await loadCbmsAfterContainerScan(containerBarcode);
    if (!cbms || cbms.length === 0) {
        showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดจาก CBMS ได้");
        return false;
    }

    pageState.cbmsHeader = {
        containerId: cbms[0].containerId || containerBarcode,
        departmentId: Number(cbms[0].departmentId || 0),
        receiveId: Number(cbms[0].receiveId || 0)
    };
    pageState.cbmsCollection = cbms;

    const bankIds = [...new Set(cbms.map(x => Number(x.institutionId)).filter(Boolean))];
    const denomIds = [...new Set(cbms.map(x => Number(x.denominationId)).filter(Boolean))];
    pageState.computed = { instIds: bankIds, denomIds: denomIds, bundleCount: 0 };

    const departmentId = getUserDepartmentId() || Number(cbms[0].departmentId || 0);

    // ✅ 3. โหลด bank
    const bankItems = await loadInstitutionMasterByIds(bankIds, departmentId);
    pageState.bankCollection = bankItems.map(x => ({ id: x.key, name: x.text, code: x.value }));

    // ✅ 4. โหลด deno global (เหมือน UnsortCC โหลด responseDeno)
    const requestDeno = {
        tableName: "MasterDenomination",
        operator: "OR",
        searchCondition: denomIds.map(id => ({
            columnName: "DenominationId",
            filterOperator: "EQUAL",
            filterValue: id
        })),
        selectItemCount: 200,
        includeData: false,
        departmentId
    };
    const responseDeno = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', requestDeno);
    // ✅ เก็บ denoCollection global ไว้ใช้กับ badge เหมือน UnsortCC
    pageState.denoCollection = (responseDeno?.data || []);

    // ✅ 5. Render bank dropdown
    renderDropdown({ selectId: 'bankInput', items: pageState.bankCollection, includeEmpty: true });

    initSelect2NormalWithSearch('#bankInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (!val) return;

            pageState.selected.bankId = Number(val) || 0;
            const selectedBank = (pageState.bankCollection || [])
                .find(x => Number(x.id) === pageState.selected.bankId) || null;

            clearStateFieldInput(1);

            pageState.currentBank = selectedBank;
            pageState.selected.bankId = Number(val) || 0;

            // ✅ 6. หา currentCbms เบื้องต้น (ใช้ instId ตัวแรกของ bank นี้)
            //    เพื่อให้ loadDenoByBankId มี receiveId ใช้งานได้
            pageState.currentCbms = (pageState.cbmsCollection || [])
                .find(x => Number(x.institutionId) === pageState.selected.bankId) || null;

            if (pageState.currentBank) {
                await onBankSelectedLoadZoneCashpointBranch(pageState.currentBank.id, departmentId);
            }

            updateCurrentCbmsAndBundle();
            refreshStep3Lock();
            progressStep2('bankInput');
        }
        finally {
            $.disablePageLoader();
        }
    });

    refreshStep3Lock();
    await updateBarcodeListTableAsync();
    await updatePrepareCount();

    var nextStep = stepCount + 1;
    stepCount = nextStep;
    var hasNext = barcodeSteps.some(s => s.stepIndex === nextStep);
    if (hasNext) focusStep(nextStep);

    return true;
}
function refreshStep3Lock() {
    const ok =
        !!pageState.selected.bankId &&
        !!pageState.selected.denominationId &&
        !!pageState.selected.zoneId &&
        !!pageState.selected.cashpointId ;
    lockStep3(!ok);

    if (ok) focusStep(3);
}
function lockStep3(isLocked) {
    const headerInput = document.getElementById("barcodeHeaderCardInput");
    if (headerInput) headerInput.disabled = isLocked;

    document.querySelector('#step3')?.classList.toggle('disabled', isLocked);

    document.querySelectorAll('.step3-field').forEach(el => {
        el.disabled = isLocked;
    });
}
// -------------------------
// util
// -------------------------
function getUserDepartmentId() {
    return window.currentUserDepartmentId || 0;
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
            branchcode: x.code,
            name: x.text,
            code: x.code,
            value: x.value
    }));
}
async function onBankSelectedLoadZoneCashpointBranch(bankId, departmentId) {
    bankId = Number(bankId || 0);
    departmentId = Number(currentDepartmentId || 0);

    const [zones, cashByBank, cashCenters, denoByBank] = await Promise.all([
        loadZoneByBankId(),
        loadCashPointByBank(),
        loadCashCenterByBank(),
        loadDenoByBankId()          
    ]);

    pageState.zoneCollection = Array.isArray(zones) ? zones : [];
    pageState.cashCollectionByBank = Array.isArray(cashByBank) ? cashByBank : [];
    pageState.cashCollectionByZone = [];
    pageState.cashCenterCollection = Array.isArray(cashCenters) ? cashCenters : [];
    pageState.denoCollectionByBank = Array.isArray(denoByBank) ? denoByBank : []; // ← เพิ่ม

    pageState.selected.zoneId = 0;
    pageState.selected.cashpointId = 0;
    pageState.selected.cashCenterId = 0;
    pageState.currentZone = null;
    pageState.currentCash = null;
    pageState.currentCashCenter = null;

    renderDropdown({ selectId: 'zoneInput', items: pageState.zoneCollection, includeEmpty: true });
    applyCashCollection();

    // --- Zone DDL ---
    initSelect2NormalWithSearch('#zoneInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (isSyncingCashBranch) return;

            pageState.selected.zoneId = Number(val || 0);
            pageState.currentZone = (pageState.zoneCollection || [])
                .find(x => Number(x.id) === pageState.selected.zoneId) || null;

            pageState.selected.cashpointId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.currentCash = null;
            clearStateFieldInput(2);

            if (pageState.currentZone) {
                // ✅ filter โดย zoneId ที่ฝังมากับ cashpoint
                const zoneValue = pageState.currentZone.value;
                pageState.cashCollectionByZone = (pageState.cashCollectionByBank || [])
                    .filter(c => c.value === zoneValue);
            } else {
                pageState.cashCollectionByZone = [];
            }

            applyCashCollection();
            checkPointsteptwo();
            refreshStep3Lock();
            progressStep2('zoneInput');
        }
        finally {
            $.disablePageLoader();
        }
    });

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

        const currentDeno = (pageState.denoCollectionByBank || [])
            .find(x => Number(x.value) === denominationId);

            if (!currentDeno) return;

            clearStateFieldInput(5);

            const el = document.getElementById('notesample');
            el.className = 'qty-badge';
            el.classList.add('qty-' + currentDeno.name);
            el.textContent = currentDeno.name;

            pageState.selected.denominationId = denominationId;
            pageState.currentDeno = currentDeno;

            updateCurrentCbmsAndBundle();

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

async function loadDenoByBankId() {
    const items = await loadMasterDropdownNotMap({
        cacheKey: 'MasterDenomination',
        request: {
            tableName: 'MasterDenominationWithBank',
            operator: 'AND',
            searchCondition: [{
                columnName: 'InstId',
                filterOperator: 'EQUAL',
                filterValue: String(pageState.selected.bankId)
            },  {
                columnName: 'ContainerId',
               filterOperator: 'EQUAL',
               filterValue: pageState.cbmsHeader.containerId
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

function applyCashCollection() {
    const cashs = (pageState.cashCollectionByZone?.length > 0)
        ? pageState.cashCollectionByZone
        : (pageState.cashCollectionByBank || []);

    pageState.cashCollection = cashs;

    renderDropdown({ selectId: 'cashInput', items: cashs, includeEmpty: true });
    renderDropdown({ selectId: 'branchInput', items: cashs, includeEmpty: true });

    initSelect2NormalWithSearch('#cashInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (isSyncingCashBranch) return;
            isSyncingCashBranch = true;

            pageState.selected.cashpointId = Number(val || 0);
            pageState.currentCash =
                (pageState.cashCollection || []).find(x => Number(x.id) === pageState.selected.cashpointId) || null;

            if (pageState.currentCash) {
                const matchedZone = (pageState.zoneCollection || [])
                    .find(z => z.value === pageState.currentCash.value) || null;
                if (matchedZone) {
                    pageState.selected.zoneId = matchedZone.id;
                    pageState.currentZone = matchedZone;
                    $('#zoneInput').val(matchedZone.id).trigger('change.select2');
                }
            }

            if (val) {
                $('#branchInput').val(val).trigger('change.select2');
            }

            refreshStep3Lock?.();
            progressStep2('cashInput');
            isSyncingCashBranch = false;
        } finally {
            $.disablePageLoader();
        }
    });

    initSelect2NormalWithSearch('#branchInput', '- เลือก -', async (val) => {
        try {
            $.enablePageLoader();
            if (isSyncingCashBranch) return;
            isSyncingCashBranch = true;

            pageState.selected.cashpointId = Number(val || 0);
            pageState.currentCash =
                (pageState.cashCollection || []).find(x => Number(x.id) === pageState.selected.cashpointId) || null;

            if (pageState.currentCash) {
                const matchedZone = (pageState.zoneCollection || [])
                    .find(z => z.value === pageState.currentCash.value) || null;
                if (matchedZone) {
                    pageState.selected.zoneId = matchedZone.id;
                    pageState.currentZone = matchedZone;
                    $('#zoneInput').val(matchedZone.id).trigger('change.select2');
                }
            }

            if (val) {
                $('#cashInput').val(val).trigger('change.select2');
            }

            clearStateFieldInput(4);
            refreshStep3Lock?.();
            progressStep2('branchInput');
            isSyncingCashBranch = false;
        } finally {
            $.disablePageLoader();
        }
    });
}

const formatBranchIdWithOptionalQty = (state) => {
    if (!state.id) return state.text || '';

    const code = String(parseInt(state.id, 10)).padStart(5, '0');
    const hasQty = state.qty !== undefined && state.qty !== null && state.qty !== '';

    return hasQty
        ? $(`<span>${code} <small class="text-muted">(${state.qty})</small></span>`)
        : $(`<span>${code}</span>`);
};


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

    const url = `/Report/PreparationUnsortCAMember?${params.toString()}`;
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

    const windowFeatures = `scrollbars=no, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}, resizable=yes, status=no, toolbar=no, menubar=no, location=no`;


    // --- ส่วนที่แก้ไข: เปลี่ยนมาใช้ Hidden Form POST ---

    // 1. เปิดหน้าต่างเปล่ารอก่อน
    const newWindow = window.open('', title, windowFeatures);

    if (newWindow) {
        // 2. สร้าง Form ส่งค่า POST ไปยัง Action PreparationUnsortCAMember
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/Report/PreparationUnsortCAMember";
        form.target = title; // ระบุให้ส่งไปที่หน้าต่างที่เปิดไว้

        // 3. วนลูปสร้าง input สำหรับ preparationIds
        selectedIds.forEach(id => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "preparationIds"; // ชื่อต้องตรงกับ Parameter ใน Controller
            input.value = id;
            form.appendChild(input);
        });

        // 4. Submit และทำลาย Form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        if (window.focus) {
            newWindow.focus();
        }
    }
}

function clearStateOnContainerInput() {

    pageState.cbmsCollection = [];
    pageState.currentCbms = null;
    pageState.cbmsHeader = null;   
    pageState.computed = { instIds: [], denomIds: [], bundleCount: 0 };
    pageState.denoCollection = [];
    pageState.cashCollectionByZone = [];
    pageState.cashCollectionByBank = [];
    pageState.bankCollection = [];
    pageState.currentBank = null;
    pageState.currentDeno = null;
    pageState.zoneCollectionMaster = [];
    pageState.zoneCollection = [];
    pageState.currentZone = null;
    pageState.cashCollection = [];
    pageState.currentCash = null;
    pageState.cashCenterCollection = [];
    pageState.currentCashCenter = null;
    pageState.branchCollectionByZone = [];
    pageState.branchCollectionByBank = [];
    pageState.denoByBankCollection = [];

    targetBundleCount = 0;
    currentScanCount = 0;

    // Reset stepCount
    stepCount = 1;

    pageState.selected = {
        bankId: 0,
        denominationId: 0,
        zoneId: 0,
        cashpointId: 0,
        cashCenterId: 0,
        branchId: 0  

    };

    ['#bankInput', '#zoneInput', '#cashInput', '#branchInput', '#bankNoteInput', '#bankAmountInput']
        .forEach(id => $(id).removeClass('border-danger'));

    const dropdowns = [
        '#bankInput',
        '#zoneInput',
        '#cashInput',
        '#branchInput',
        '#bankNoteInput'
    ];

    currentCbmsonTable = [];
    prepareCount = 0;
    stepCount = 1;
    remainQty = 0;
    currentcbmsData = {};
    matchedCbms = {};

    clearTempCbms();

    dropdowns.forEach(id => {
        const $el = $(id);
        if ($el.data('select2')) {
            $el.select2('destroy');
        }
        $el.empty().prop('disabled', true);
    });

    // ===== Clear Note Badge =====
    const noteEl = document.getElementById('notesample');
    if (noteEl) {
        noteEl.className = 'qty-badge';
        noteEl.textContent = '0';
    }

    $('#bankAmountInput').val('').prop('disabled', true);
    $('#barcodeHeaderCardInput').val('').prop('disabled', true);

    $("#headerCardCodeText").text('000000000000000000');
    $("#bundleCount").text('0 / 0');
    $("#packageCodeText").text('000000000000000000000000');
    $('#headerContainerCode').text('');
    $('#prepareCount').text('0 / 0'); 
    $('#reconcileCount').text('0');
    $('#barcodeListBody').empty();
    $('#containerSideCard').html('');

}
function clearStateFieldInput(stepIndex) {

    ['#bankInput', '#zoneInput', '#cashInput', '#branchInput', '#bankNoteInput', '#bankAmountInput']
        .forEach(id => $(id).removeClass('border-danger'));

    switch (stepIndex) {
        case 1: // เปลี่ยน bankInput → clear ทุกอันด้านหลัง
            $('#zoneInput').val('').trigger('change.select2');
            $('#cashInput').val('').trigger('change.select2');
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');
            $("#headerCardCodeText").text('000000000000000000');
            $("#bundleCount").text('0 / 0');
            $("#packageCodeText").text('000000000000000000000000');
            $('#bankNoteInput').prop('disabled', true);

            // Reset pageState
            pageState.selected.zoneId = 0;
            pageState.selected.cashpointId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.selected.denominationId = 0;

            pageState.currentZone = null;
            pageState.currentCash = null;
            pageState.currentCashCenter = null;
            pageState.currentDeno = null;
            pageState.currentBank = null; 
            pageState.currentCbms = null; 

            pageState.cashCollectionByZone = [];
            pageState.branchCollectionByZone = [];
            pageState.denoByBankCollection = [];
            break;

        case 2: // เปลี่ยน zoneInput → clear ตั้งแต่ cashpoint เป็นต้นไป
            $('#cashInput').val('').trigger('change.select2');
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');
            $("#headerCardCodeText").text('000000000000000000');
            $("#bundleCount").text('0 / 0');
            $("#packageCodeText").text('000000000000000000000000');
            $('#bankNoteInput').prop('disabled', true);

            pageState.selected.cashpointId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.selected.denominationId = 0;

            pageState.currentCash = null;
            pageState.currentCashCenter = null;
            pageState.currentDeno = null;
            pageState.currentCbms = null; 

            break;

        case 3: // เปลี่ยน cashInput → clear ตั้งแต่ branch เป็นต้นไป
            $('#branchInput').val('').trigger('change.select2');
            $('#bankNoteInput').val('').trigger('change.select2');
            $("#headerCardCodeText").text('000000000000000000');
            $("#bundleCount").text('0 / 0');
            $("#packageCodeText").text('000000000000000000000000');

            pageState.selected.cashCenterId = 0; 
            pageState.selected.denominationId = 0;
            pageState.selected.cashCenterId = 0;
            pageState.currentCashCenter = null; 
            pageState.currentDeno = null;
            pageState.currentCbms = null;  

            break;

        case 4: // เปลี่ยน branchInput → clear ตั้งแต่ bankNote เป็นต้นไป
            $('#bankNoteInput').val('').trigger('change.select2');
            $("#headerCardCodeText").text('000000000000000000');
            $("#bundleCount").text('0 / 0');
            $("#packageCodeText").text('000000000000000000000000');

            pageState.selected.denominationId = 0;
            pageState.currentDeno = null;
            pageState.currentCbms = null;  

            break;

        case 5: // เปลี่ยน bankNoteInput (denomination)
            $("#headerCardCodeText").text('000000000000000000');
            $("#bundleCount").text('0 / 0');
            $("#packageCodeText").text('000000000000000000000000');
            break;
    }

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

function handleFocusStep(step) {
    const modalEvent = document.getElementById("barcodeErrorModal");

    modalEvent.removeEventListener('hidden.bs.modal', focusByStep);

    function focusByStep() {
        focusStep(step);
    }

    modalEvent.addEventListener('hidden.bs.modal', focusByStep);
}

function clearHeaderBarcodeInput() {
    const input = document.getElementById("barcodeHeaderCardInput");
    if (input) {
        input.value = "";
        input.focus();
    }
}

async function updateBarcodeWrapAndPackageCodeAsync() {
    const containerBarcode = $('#barcodeContainerInput').val();

    if (!pageState.currentCbms) return;

    const previewPrepareRequest = {
        receiveId: pageState.currentCbms?.receiveId,
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

    if (previewBarcodeResponse?.is_success === true || previewBarcodeResponse?.isSuccess === true) {
        const dataExisting = previewBarcodeResponse.data;
        if (dataExisting != null) {
            bundleCountByPackage = dataExisting.bundleSequence;
            $("#headerCardCodeText").text(dataExisting.packageCode);
            $("#packageCodeText").text(dataExisting.bundleCode);
        } else {
            bundleCountByPackage = 0;
        }
        packageBarcode = '';
    }
}

function getPreviewGenerateBarcode(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'api/PreparationUnsortCaMember/GetPreviewCaMemberGenerateBarcode',
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

function focusSelect2(selector) {
    setTimeout(() => {
        $(selector).focus();
    }, 250);
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
        bssBNTypeCode: "CA"
    };

    const responseCountPrepare = await getCountCountPrepareByContainer(requestCountData);

    if (!responseCountPrepare || responseCountPrepare.is_success === false || responseCountPrepare.data == null) {
        prepareCount = 0;
    } else {
        prepareCount = parseInt(responseCountPrepare.data?.countPrepare) || 0; // fallback 0 กัน NaN
    }

    if (pageState.cbmsCollection?.length > 0) {
        pageState.cbmsCollection.forEach(item => {
            totalQtyByContainer += Math.floor(Number(item.qty || item.banknoteQty || 0) / 1000);
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
$('#bankAmountInput').on('change', function (e) {
    try {
        $.enablePageLoader();
        // ✅ CA Member ใช้ currentCbms และ remainingQty ÷ 1000
        const rawRemaining = Number(pageState.currentCbms?.remainingQty ?? 0);
        const maxAllowed = Math.floor(rawRemaining / 1000); // ← ÷ 1000 เพราะ CBMS เป็นใบ

        const inputValue = parseInt($(this).val()) || 0;

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
            setTimeout(() => {
                const rawRemaining = Number(pageState.currentCbms?.remainingQty ?? 0);
                const maxAllowed = Math.floor(rawRemaining / 1000);
                const val = parseInt($('#bankAmountInput').val()) || 0;

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


async function updateBarcodeListTableAsync() {
    const barcodeContainer = document.getElementById("barcodeContainerInput").value.trim();
    const tbody = document.getElementById("barcodeListBody");

    let sortcbmsData = [...(pageState.cbmsCollection || [])].sort((a, b) => {
        const r = a.institutionId - b.institutionId;
        if (r !== 0) return r;
        return a.denominationId - b.denominationId;
    });

    tbody.innerHTML = '';

    if (sortcbmsData.length > 0) {
        sortcbmsData
            .filter(item => item?.remainingQty !== 0)
            .forEach(item => {
                const denoPrice = Number(item.denominationPrice || 0);
                const bankId = item.institutionId;
                const bankData = (pageState.bankCollection || []).find(d => Number(d.id) === Number(bankId));
                const bankCode = bankData?.code ?? '-';
                const remainingQty = Math.floor(Number(item.remainingQty || 0) / 1000);
                const qtyClass = `qty-${denoPrice}`;

                tbody.innerHTML += `
                    <tr>
                        <td style="text-align: left;">${bankCode}</td>
                        <td style="text-align: right;">
                            <span class="qty-badge ${qtyClass}">${denoPrice}</span>
                        </td>
                        <td style="text-align: right;">${remainingQty}</td>
                    </tr>
                `;
            });
    }

    const sidebarContainerName = document.getElementById('containerSideCard');
    if (sidebarContainerName) {
        sidebarContainerName.textContent = barcodeContainer || '-';
    }
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
            clearStateFieldInput(1);
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

