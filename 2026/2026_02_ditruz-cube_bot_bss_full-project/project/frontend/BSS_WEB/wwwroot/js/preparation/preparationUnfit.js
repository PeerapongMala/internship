const { MAIL_TYPE } = window.APP.CONST;


let cbmsSelected = {};
let cbmsData = [];
let totalQtyByContainer = 0;
let currCashCenterName = '';


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

let isResettingSelect = false;
const tempDeleteData = {
    prepareIds: [],
    remark: "",
    updatedBy: 0,
    refCode: ""
};

let dataEdit = {
    headerCardCode: "",
    prepareIds: [],
    createdBy: 0,
    updatedBy: 0,
    remark: ""
}
const deleteSelection = { supervisorId: "", supervisorName: "" };



async function initComponent() {
    $.enablePageLoader();
    await loadPreparationUnfits(1, 0, '');
    getInstitutionDropdownByIds([2, 3, 5]);
    // setupCashCenterLoader();
    currentStep = 1;
    updateDummyButtonByStep(currentStep);
    // renderPreparatorDropdownForEdit();
    $.disablePageLoader();
}


// ตัวอย่างฟังก์ชัน populate dropdown
function populateDropdown(items) {
    const $select = $('#institutionSelect'); // สมมติว่ามี select element
    $select.empty();
    $select.append('<option value="">-- เลือกธนาคาร --</option>');

    items.forEach(item => {
        $select.append(`<option value="${item.key}">${item.text}</option>`);
    });
}

function showCurrentDateTime() {
    const now = new Date();
    const formatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear() + 543} ` +
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const el = document.getElementById("info-current-datetime");
    if (el) el.textContent = formatted;
}

// ล้าง Timer เก่าก่อนเริ่มใหม่เสมอ (Docker/Resource Optimization)
if (window.clockTimer) clearInterval(window.clockTimer);
    window.clockTimer = setInterval(showCurrentDateTime, 1000);
showCurrentDateTime();

let tableData = [];

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

let tempEditData = {
    id: null,
    selectedIds: [],
    isMultiEdit: false,
    isDelete: false,
    deleteIds: [],
    oldHeader: '',
    newCreatedBy: 0,
    newCreatedByName: '',
    oldCreatedBy: 0,
    oldCreatedByName: '',
    newHeader: '',
    reason: '',
    supervisorName: '',
    supervisorId: '',
    refcode: '',
    barcode: '',
    wrapCode: '',
    bundleCode: ''
};

let countdown = 300;
let timerInterval = null;
let deleteCountdown = 300;
let deleteTimerInterval = null;
function getPreparationUnfitsAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/GetPreparationUnfitsDetailAsync',
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

let receiveId = 0;
let remainingQty = 0;
let unfitQty = 0;
let prepareCount = 0;
let countReconcile = 0;

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
function getCashCenterName(wrapBarcode) {
    return new Promise(function (resolve, reject) {

        if (!wrapBarcode || wrapBarcode.length < 6) {
            resolve("-");
            return;
        }

        const code = wrapBarcode.substring(3, 6);

        const requestData = {
            tableName: "MasterCashCenter",
            operator: "AND",
            searchCondition: [{
                columnName: "CashCenterCode",
                filterOperator: "EQUAL",
                filterValue: code
            }],
            selectItemCount: 1,
            includeData: true
        };

        $.requestAjax({
            service: 'MasterDropdown/GetMasterDropdownData',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) {
                if (response?.is_success && response.data?.length > 0) {
                    resolve(response.data[0].text);
                } else {
                    resolve("ไม่พบ");
                }
            },
            onError: function (err) {
                console.error('getCashCenterName error:', err);
                resolve("ผิดพลาด");
            }
        });
    });
}

function getCheckReceiveCbmsTransactionAsync(requestData) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'ReceiveCbms/CheckReceiveCbmsTransaction',
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

async function updateReceiveCbmsCountsAsync() {
    const bundleCountEl = document.getElementById('bundleCount');
    if (bundleCountEl) {
        bundleCountEl.textContent = `${(unfitQty - remainingQty) + 1} / ${unfitQty}`;
    }
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
            .filter(item => item?.barCode?.[6] === '2')
            .forEach(item => {
                tbody.innerHTML += `
                <tr>
                    <td>${item?.barCode || '-'}</td>
                    <td style="text-align: right;">${item?.remainingQty || 0}</td>
                </tr>
            `;
            });
    }

    // อัพเดตชื่อภาชนะใน sidebar
    const barcodeWrapPendingName = document.getElementById('barcodeWrapPending');
    if (barcodeWrapPendingName) {
        barcodeWrapPendingName.textContent = barcodeContainer || '-';
    }
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
        barcode: x.barcode ?? x.containerCode ?? '',
        bundle: x.bundleCode ?? '',
        header: x.headerCardCode ?? '',
        bank: x.bank ?? x.bankCode ?? '',
        center: x.cashCenterName ?? '',
        qty: x.qty ?? x.denominationPrice ?? 0,
        date: formatDateThai(x.createdDate),
        package: x.packageCode ?? x.package ?? '',
        createBy: x.createdBy ?? '',
        createdByName: x.createdByName ?? '',
        updateBy: x.updatedBy ?? '',
        isFlag: x.isFlag ?? true
    }));
}

function setPriceType(price) {
    const el = document.getElementById('priteType');

    // reset class
    el.className = 'qty-badge';

    if (price) {
        el.classList.add(`qty-${price}`);
        el.textContent = price;
    } else {
        el.textContent = '-';
    }
}


async function loadPreparationUnfits(pageNumber = 1, pageSize = 0, search = '') {
    try {
        const requestData = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search,
            sorts: [
                { field: "createdDate", dir: "desc" }
            ]
        };

        const response = await getPreparationUnfitsAsync(requestData);

        const items = response?.items || response?.data?.items || response?.data || [];
        const totalCount = response?.totalCount || response?.data?.totalCount || items.length;

        tableData = mapApiToData(items);

        renderTable();

        setupDropdownforSecondScreen();

        // updatePagination(totalCount, pageNumber, pageSize);

    } catch (err) {
        console.error(err);
        //alert("โหลดข้อมูลไม่สำเร็จ");
        showBarcodeErrorModal("โหลดข้อมูลไม่สำเร็จ");
        return;
    }
}

function getInstitutionDropdownByIds(ids) {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    return new Promise(function (resolve, reject) {
        const requestData = {
            tableName: "MasterInstitution",
            operator: "OR",
            searchCondition: ids.map(id => ({
                columnName: "InstitutionId",
                filterOperator: "EQUAL",
                filterValue: id
            })),
            selectItemCount: 100,
            includeData: true
        };

        $.ajax({
            url: "/MasterDropdown/GetMasterDropdownData",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestData),
            success: function (response) {
                //console.log('Response:', response);

                if (response && response.is_success && response.data) {
                    resolve(response.data);
                } else {
                    console.error('API Error:', response.msg_desc);
                    reject(new Error(response.msg_desc || 'เกิดข้อผิดพลาด'));
                }
            },
            error: function (xhr, status, err) {
                console.error('AJAX Error:', err);
                reject(err);
            }
        });
    });
}

function renderSupervisorDropdown() {
    const select = document.getElementById("supervisorName");
    if (!select) return;
    select.innerHTML = '<option value="" style="color:#999;">Please select</option>';
    supervisors.forEach(sup => {
        const option = document.createElement("option");
        option.value = sup.id;
        option.textContent = sup.name;
        select.appendChild(option);
    });
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    // ดึงสถานะปัจจุบันมาเช็ค (คงเดิม 100%)
    const scannedId = String(pageState.scannedContainerId || '').trim();
    const hasConflict = pageState.isScannedContainerConflict === true;

    // ใช้ Array เก็บ String ของแต่ละแถว เพื่อประสิทธิภาพสูงสุด (Impact เยอะสุดในจุดนี้)
    const rowsHtml = tableData.map(item => {
        const dangerClass = item.isFlag === false ? 'row-danger' : '';
        const qtyClass = `qty-${item.qty}`;
        const rowContainer = String(item.barcode || '').trim();

        // Logic การเช็ค Lock จากเครื่องอื่น (คงเดิม 100%)
        const isLocked = hasConflict && scannedId && rowContainer === scannedId;
        const tooltipMsg = (pageState.scannedContainerConflictText || 'พบการ prepare จากเครื่องอื่น').replace(/"/g, '&quot;');

        // เงื่อนไข Checkbox: ถ้า Locked จะหายไปเลย (คงเดิม 100%)
        const checkboxHtml = isLocked ? '' : `<input type="checkbox" class="row-checkbox" data-id="${item.id}" onchange="updateSelectedCount()">`;

        // เงื่อนไขปุ่ม Action: ถ้า Locked จะต้องกดไม่ได้ (คงเดิม 100%)
        const disabledAttr = isLocked ? 'disabled aria-disabled="true"' : '';

        // การประกอบ HTML แถว (คง Structure เดิมทุกคอลัมน์)
        return `
            <tr class="${dangerClass}">
                <td class="text-center" style="width:26px;">${checkboxHtml}</td>
                <td>${item.package}</td>
                <td>${item.bundle}</td>
                <td>
                    ${item.header} 
                    ${isLocked ? `<i class="bi bi-exclamation-triangle-fill text-warning ms-2" title="${tooltipMsg}"></i>` : ''}
                </td>
                <td>${item.bank}</td>
                <td>${item.center}</td>
                <td><span class="qty-badge ${qtyClass}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action" onclick="editRow(${item.id})" ${disabledAttr}><i class="bi bi-pencil"></i></button>
                        <button class="btn-action btn-danger" onclick="deleteRow(${item.id})" ${disabledAttr}><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    }).join('');

    // สั่งวาดลง DOM เพียงครั้งเดียว (จุดที่ช่วยลดความหน่วง)
    tbody.innerHTML = rowsHtml;
}


async function updateReconcileCount() {

    var requestCountData = {
        departmentId: 0
    };

    const responseCount = await getCountReconcile(requestCountData);
    console.log('response', responseCount);
    if (!responseCount || responseCount.is_success === false || responseCount.data == null) {
        countReconcile = 0;
    }
    else {

        countReconcile = parseInt(responseCount.data?.countReconcile);
    }

    document.getElementById('reconcileCount').innerHTML = `${countReconcile}`;
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

async function addDummy() {
    const wrapInput = document.getElementById("barcodeWrapInput");
    const bundleInput = document.getElementById("barcodeBundleInput");
    const btnDummy = document.getElementById("btnDummy");

    //if (currentStep !== 3) {
    if (![3, 4].includes(currentStep)) {
        return;
    }

    if (!wrapInput || !bundleInput || !btnDummy) return;

    const currentBarcode = wrapInput.value.trim();
    if (!currentBarcode) return;


    const receiveId = tempCbmsData?.receiveId;
    if (!receiveId) { return; }
    btnDummy.disabled = true;

    try {

        let requestBody = {
            receiveId: receiveId,
            barCode: currentBarcode,
            unfitQty: 1
        };

        //console.log(requestBody);

        const result = await generateDummy(requestBody);
        //console.log('GenerateDummyBarCodeBundle result:', result);

        if (result.is_success && result.data?.dummyBarcode) {
            bundleInput.value = result.data.dummyBarcode;
            await onBarcodeInputChanged(3);
        }
    }
    catch (err) {

    }
    finally {
        btnDummy.disabled = false;
    }
}


async function generateDummy(body) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/Dummy',
            type: 'POST',
            parameter: body,
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

function updateDummyButtonByStep(step) {
    const btn = document.getElementById("btnDummy");
    if (!btn) return;

    //btn.disabled = (step !== 3);   // ✅ กดได้เฉพาะ step 3
    btn.disabled = ![3, 4].includes(step); // กดได้เฉพาะ step 3 หรือ 4
}

function toggleDummyButton() {
    const wrapInput = document.getElementById("barcodeWrapInput");
    const btnDummy = document.getElementById("btnDummy");

    if (!wrapInput || !btnDummy) return;

    btnDummy.disabled = wrapInput.value.trim() === "";
}

async function refreshData() {
    $.enablePageLoader();
    await loadPreparationUnfits(1, 0, '');
    $.disablePageLoader();

    document.getElementById('selectAll').checked = false;
    updateSelectedCount();
}

// ลบทั้งหมด
function deleteAll() {
    const allIds = tableData.map(item => item.id);
    if (allIds.length === 0) {
        toastr.error('ไม่มีข้อมูลให้ลบ');
        return;
    }

    tempDeleteData.prepareIds = allIds;
    document.getElementById('deleteCountMsg').textContent = allIds.length;
    let modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

function deleteRow(id) {
    tempDeleteData.prepareIds = [id];

    let modal = new bootstrap.Modal(document.getElementById('DeleteModal'));
    modal.show();
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

function editRow(id) {
    const item = tableData.find(x => x.id === id);
    if (!item) return;
    console.log(item);
    const prep = preparator.find(x => Number(x.id) === Number(item.createBy)) || null;

    tempEditData.id = item.id;
    tempEditData.barcode = item.barcode;
    tempEditData.wrapCode = item.package;
    tempEditData.bundleCode = item.bundle;
    tempEditData.isMultiEdit = false;
    tempEditData.oldHeader = item.header;
    tempEditData.oldCreatedBy = prep ? prep.id : 0;
    tempEditData.oldCreatedByName = prep ? prep.name : '';
    document.getElementById("editId").value = item.id;
    document.getElementById("oldHeaderCard").value = item.header;
    document.getElementById("oldCreatedBy").value = prep ? prep.name : '';
    document.getElementById("editHeaderCard").value = item.header;


    const modalEl = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('shown.bs.modal', function handler() {

        $('#editCreatedBy').val(String(currentUserId)).trigger('change');
        modalEl.removeEventListener('shown.bs.modal', handler);
    });
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
    document.getElementById('multiConfirmEditCount').textContent = selectedIds.length;
    // เอาค่าจาก Row แรกที่เลือก
    const firstItem = tableData.find(x => x.id === selectedIds[0]);
    const defaultValue = firstItem ? firstItem.createBy : '';
    const modalEl = document.getElementById('editMultipleModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('shown.bs.modal', function handler() {

        $('#multiEditCreatedBy').val(Number(currentUserId)).trigger('change');
        modalEl.removeEventListener('shown.bs.modal', handler);
    });

}

function handleInputSelect(name) {
    $('#barcodeErrorModal').on('hidden.bs.modal', function () {
        $(name).focus().select();
    });
}

function onceModalHidden(modalElOrSelector, callback) {
    const el = typeof modalElOrSelector === 'string'
        ? document.querySelector(modalElOrSelector)
        : modalElOrSelector;

    if (!el) return;
    el.addEventListener('hidden.bs.modal', callback, { once: true });
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

async function showConfirmModal() {
    console.log('showConfirmModal', tempEditData);
    const id = parseInt(document.getElementById("editId").value);
    const item = tableData.find(x => x.id === id);
    const ddlPrepareId = document.getElementById("editCreatedBy").value * 1;
    if (!item) return;

    tempEditData.newHeader = document.getElementById("editHeaderCard").value;

    tempEditData.newCreatedBy = Number(document.getElementById("editCreatedBy").value);

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
        bssBNTypeCode: 'UF',
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

                tbody.innerHTML = `
                <tr>
                    <td>
                        <div class="edit-icon-box">
                            <i class="bi bi-pencil-fill"></i>
                        </div>
                    </td>
                    <td>1</td>
                    <td>${item.package}</td>
                    <td>${item.bundle}</td>
                    <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                    <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                    <td>${item.bank}</td>
                    <td>${item.center}</td>
                    <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
                    <td>${item.date}</td>
                    <td>${item.barcode}</td>
                    <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                    <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
                </tr>
            `;

                document.getElementById("reasonText").value = "";
                document.getElementById("supervisorName").value = "";
                renderSupervisorDropdown();
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
                setTimeout(() => {
                    let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
                    modal.show();
                }, 300);
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

function showMultiConfirmModal() {

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

        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="edit-icon-box">
                        <i class="bi bi-pencil-fill"></i>
                    </div>
                </td>
                <td>${index + 1}</td>
                <td>${item.package}</td>
                <td>${item.bundle}</td>
                <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                <td>${item.bank}</td>
                <td>${item.center}</td>
                <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
            </tr>
        `;
    });
    document.getElementById('reasonText').value = '';
    document.getElementById('supervisorName').value = '';
    renderSupervisorDropdown();
    bootstrap.Modal.getInstance(document.getElementById('editMultipleModal'))?.hide();
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    }, 300);
}

function submitApprovalRequest() {
    const reason = document.getElementById("reasonText").value.trim();
    const supervisorName = tempEditData.supervisorName;
    if (!reason) {
        showBarcodeErrorModal("กรุณาระบุเหตุผลในการแก้ไข");
        return;
    }
    if (!supervisorName) {
        showBarcodeErrorModal("กรุณาเลือก Supervisor");
        return;
    }
    tempEditData.reason = reason;
    // tempEditData.supervisorName = supervisorName;
    const otpTableBody = document.getElementById("otpTableBody");
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

            otpTableBody.innerHTML += `
                <tr>
                   <td>
                        <div class="edit-icon-box">
                            <i class="bi bi-pencil-fill"></i>
                        </div>
                   </td>
                    <td>${index + 1}</td>
                    <td>${item.package}</td>
                    <td>${item.bundle}</td>
                    <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                    <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                    <td>${item.bank}</td>
                    <td>${item.center}</td>
                    <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
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

        otpTableBody.innerHTML = `
            <tr>
                <td>
                    <div class="edit-icon-box">
                        <i class="bi bi-pencil-fill"></i>
                    </div>
                </td>
                <td>1</td>
                <td>${item.package}</td>
                <td>${item.bundle}</td>
                <td ${oldHeaderClass ? `class="${oldHeaderClass}"` : ''}>${tempEditData.oldHeader}</td>
                <td ${newHeaderClass ? `class="${newHeaderClass}"` : ''}>${tempEditData.newHeader}</td>
                <td>${item.bank}</td>
                <td>${item.center}</td>
                <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td ${oldCreatedClass ? `class="${oldCreatedClass}"` : ''}>${tempEditData.oldCreatedByName}</td>
                <td ${newCreatedClass ? `class="${newCreatedClass}"` : ''}>${tempEditData.newCreatedByName}</td>
            </tr>
        `;
    }
    document.getElementById("displayReason").value = reason;
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
}

function sendOtp() {
    document.getElementById("btnSendOtp").disabled = true;
    document.getElementById("otpInput").disabled = false;
    document.getElementById("otpInput").focus();
    document.getElementById("btnConfirmOtp").disabled = false;

    document.getElementById("otpErrorMsg").innerText = "";

    // * Send OTP
    onClickSendOtp();

    clearInterval(timerInterval);
    countdown = 300;
    runOtpTimer();

    // document.getElementById("otpErrorMsg").innerText = `✔ ส่งรหัส OTP ไปยัง ${tempEditData.supervisorName} แล้ว`;
    // alert(`✓ ส่งรหัส OTP ไปยัง ${tempEditData.supervisorName} แล้ว`);
}
function onClickSendOtp() {
    const payload = {
        userSendId: tempEditData.newCreatedBy,
        userSendDepartmentId: currentDepartmentId,
        userReceiveId: tempEditData.supervisorId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNFIT_EDIT
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
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNFIT_DELETE
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

    if (!otpInput) { errorMsg.innerText = "กรุณากรอกรหัส OTP"; return; }
    if (otpInput.length !== 6) { errorMsg.innerText = "รหัส OTP ต้องมี 6 หลัก"; return; }

    const isMulti = !!tempEditData.isMultiEdit;

    const prepareIds = isMulti
        ? (tempEditData.selectedIds ?? [])
        : [tempEditData.id];

    const headerCardCode = isMulti
        ? (tempEditData.newHeader || tempEditData.oldHeader)
        : tempEditData.newHeader;

    dataEdit.headerCardCode = String(headerCardCode ?? '').trim();
    dataEdit.createdBy = Number(tempEditData.newCreatedBy) || 0;
    dataEdit.updatedBy = Number(tempEditData.newCreatedBy) || 0;
    dataEdit.prepareIds = prepareIds;
    dataEdit.remark = String(tempEditData.reason ?? '').trim();

    otp.verify({
        userSendId: tempEditData.newCreatedBy,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNFIT_EDIT,
        bssMailRefCode: tempEditData.refcode,
        bssMailOtpCode: otpInput
    })
        .done(function () {

            submitEditPreparationUnfit();
        })
        .fail(function () {
            showBarcodeErrorModal("รหัส OTP ไม่ถูกต้อง");
            return;
        });

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
    bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();

    let modalEditType = tempEditData.isMultiEdit ? 'editMultipleModal' : 'editModal';
    let selectEditType = tempEditData.isMultiEdit ? 'multiEditCreatedBy' : 'editCreatedBy';
    const modalEl = document.getElementById(modalEditType);
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('shown.bs.modal', function handler() {

        $('#' + selectEditType).val(String(currentUserId)).trigger('change.select2');
        modalEl.removeEventListener('shown.bs.modal', handler);
    });
}

function backToConfirmModal() {
    clearInterval(timerInterval);
    document.getElementById("otpTimer").innerText = "";
    document.getElementById("otpInput").disabled = true;
    document.getElementById("otpErrorMsg").innerText = "";
    document.getElementById("otpErrorMsg").innerText = "";
    document.getElementById("otp-refcode").innerText = "";

    bootstrap.Modal.getInstance(document.getElementById('otpModal')).hide();
    setTimeout(() => {
        //showMultiConfirmModal();
        let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    }, 300);
}

function confirmSingleDelete() {
    bootstrap.Modal.getInstance(document.getElementById('DeleteModal')).hide();
    setTimeout(() => {
        showDeleteConfirmModal();
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
    const singleDeleteModal = bootstrap.Modal.getInstance(document.getElementById('DeleteModal'));

    if (singleDeleteModal) {
        singleDeleteModal.hide();
    }

    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }, 300);
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

    const singleDeleteModal = bootstrap.Modal.getInstance(document.getElementById('DeleteModal'));

    if (singleDeleteModal) {
        singleDeleteModal.hide();
    }

    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }, 300);
}

function showDeleteConfirmModal() {
    const count = tempDeleteData.prepareIds.length;
    document.getElementById('deleteListCount').textContent = count;

    const tbody = document.getElementById('deleteConfirmTableBody');
    tbody.innerHTML = '';

    tempDeleteData.prepareIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        if (!item) return;
        tbody.innerHTML += `
            <tr>
               <td>
                   <div class="trash-icon-box">
                       <i class="bi bi-trash-fill"></i>
                   </div>
               </td>
                <td>${index + 1}</td>
                <td>${item.package}</td>
                <td>${item.bundle}</td>
                <td>${item.header}</td>
                <td>${item.bank}</td>
                <td>${item.center}</td>
                <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });
    tempDeleteData.remark = document.getElementById('deleteReasonText').value;
    document.getElementById('deleteReasonText').value = '';
    //document.getElementById('deleteSupervisorSelect').value = '';


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
    const reason = document.getElementById('deleteReasonText').value.trim();
    const supervisorName = document.getElementById('deleteSupervisorSelect').value;

    if (!reason) {
        showBarcodeErrorModal("กรุณาระบุเหตุผลในการลบ");
        return;
    }
    if (!supervisorName) {
        showBarcodeErrorModal("กรุณาเลือก Supervisor");
        return;
    }

    tempDeleteData.remark = reason;

    const count = tempDeleteData.prepareIds.length;
    document.getElementById('deleteOtpListCount').textContent = count;

    const tbody = document.getElementById('deleteOtpTableBody');
    tbody.innerHTML = '';

    tempDeleteData.prepareIds.forEach((id, index) => {
        const item = tableData.find(x => x.id === id);
        if (!item) return;
        tbody.innerHTML += `
            <tr>
                <td>
                   <div class="trash-icon-box">
                       <i class="bi bi-trash-fill"></i>
                   </div>
                </td>
                <td>${index + 1}</td>
                <td>${item.package}</td>
                <td>${item.bundle}</td>
                <td>${item.header}</td>
                <td>${item.bank}</td>
                <td>${item.center}</td>
                <td><span class="qty-badge qty-${item.qty}">${item.qty}</span></td>
                <td>${item.date}</td>
                <td>${item.barcode}</td>
                <td>${item.createdByName}</td>
            </tr>
        `;
    });

    document.getElementById('deleteDisplayReason').value = reason;
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

    // alert(`✓ ส่งรหัส OTP ไปยัง ${tempEditData.supervisorName} แล้ว`);
    // document.getElementById('deleteOtpErrorMsg').innerText = `ส่งรหัส OTP ไปยัง ${tempEditData.supervisorName} แล้ว`;
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

    otp.verify({
        userSendId: currentUserId,
        userSendDepartmentId: currentDepartmentId,
        bssMailSystemTypeCode: MAIL_TYPE.PREPARE_UNFIT_DELETE,
        bssMailRefCode: tempDeleteData.refCode,
        bssMailOtpCode: otpInput
    })
        .done(function () {

            submitDeletePreparationUnfit();
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

function renderPreparatorDropdown() {
    let ddlSingle = document.getElementById("oldCreatedBy");
    let ddlMulti = document.getElementById("multiEditCreatedBy");

    ddlSingle.innerHTML = '<option value="">-- please select --</option>';
    ddlMulti.innerHTML = '<option value="">-- please select --</option>';

    preparator.forEach(x => {
        let option = `<option value="${x.id}" data-name="${x.name}">${x.name}</option>`;
        ddlSingle.insertAdjacentHTML('beforeend', option);
        ddlMulti.insertAdjacentHTML('beforeend', option);
    });
}

function openSingleEditPopup(rowId) {
    selectedRowId = rowId;

    renderPreparatorDropdown(); // <<< เพิ่มตรงนี้

    let row = tableData.find(x => x.id == rowId);

    $("#oldBarcode").val(row.barcode);
    $("#oldBundle").val(row.bundle);
    $("#oldHeader").val(row.header);

    // set default value dropdown ตาม row.createById
    $("#oldCreatedBy").val(row.createById);

    $("#singleEditModal").modal("show");
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
        oldCreatedByName: '',
        newHeader: '',
        newCreatedBy: '',
        newCreatedByName: '',
        reason: '',
        supervisorName: ''
    };
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

const barcodeSteps = [
    { stepIndex: 1, inputId: "barcodeContainerInput" },
    { stepIndex: 2, inputId: "barcodeWrapInput" },
    { stepIndex: 3, inputId: "barcodeBundleInput" },
    { stepIndex: 4, inputId: "barcodeHeaderCardInput" }
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
    if (stepIndex === 2) {
        document.getElementById('bankAmountInput')
            ?.addEventListener('input', function () {
                this.value = (this.value || '').replace(/\D/g, '');
            });
    }

    barcodeSteps.forEach(step => {
        if (step.inputClass) {
            const inputs = document.querySelectorAll('.' + step.inputClass);
            if (inputs.length === 0) return;
            const isCurrent = step.stepIndex === stepIndex;
            inputs.forEach(input => {
                input.disabled = !isCurrent;
            });
            if (isCurrent) {
                inputs[0].focus();
            }
        }
        else {
            const input = document.getElementById(step.inputId);
            if (!input) return;
            const isCurrent = step.stepIndex === stepIndex;

            if (step.inputId === 'barcodeContainerInput') {
                input.disabled = false; 
            }
            else if (step.inputId === 'barcodeWrapInput') {
                input.disabled = stepIndex < 2; 
            }
            else if (step.inputId === 'barcodeBundleInput') {
                input.disabled = stepIndex < 3; 
            }
            else {
                input.disabled = !isCurrent; 
            }

            if (isCurrent) {
                input.focus();
                input.select();
            }
        }
    });
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

function getModal(elOrSelector) {
    const el = typeof elOrSelector === 'string'
        ? document.querySelector(elOrSelector)
        : elOrSelector;

    if (!el) return null;
    return bootstrap.Modal.getOrCreateInstance(el);
}

function confirmChangeContainerModal() {
    getModal('#ChangeContainerModal')?.hide();
    $("#prepareCount").text('0 / 0');
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

function confirmChangeWrapModal() {
    getModal('#ChangeWrapModal')?.hide();
    $("#bundleCount").text('0 / 0');
    onBarcodeInputChanged(2);
}

function cancelChangeWrapModal() {
    $("#barcodeWrapInput").val($('#barcodeWrapOld').val());
}

function showConfirmChangeWrapModal() {
    const modalElement = document.getElementById("ChangeWrapModal");
    if (!modalElement) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (!modalElement.classList.contains("show")) {
        modal.show();
    }
}

async function onBarcodeInputChanged(stepIndex) {

    const containerBarcode = (document.getElementById("barcodeContainerInput").value || "").trim();
    const wrapBarcode = (document.getElementById("barcodeWrapInput").value || "").trim();
    const bundleBarcode = (document.getElementById("barcodeBundleInput").value || "").trim();
    const headerBarcode = (document.getElementById("barcodeHeaderCardInput").value || "").trim();
    let currentValue = "";

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
    }//เปลี่ยนห่อ
    else if (stepIndex === 2) {
        try {
            if ($("#barcodeWrapInput").val() != $('#barcodeWrapOld').val()) {
                var bundleCount = $("#bundleCount").text().trim();
                var bundleCountLeft = 0;
                var bundleCountRight = 0;

                if (bundleCount && bundleCount.includes("/")) {

                    var numbers = bundleCount.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        bundleCountLeft = parseInt(numbers[0], 10);
                        bundleCountRight = parseInt(numbers[1], 10);
                        if (bundleCountLeft > 0 && (bundleCountLeft == bundleCountRight))
                            bundleCountLeft = bundleCountLeft - 1;
                    }
                }

                if (bundleCountLeft != bundleCountRight) {
                    showConfirmChangeWrapModal();
                    return;
                }
            }
        } catch (err) {
            console.error(err);
            showBarcodeErrorModal("เกิดข้อผิดพลาดในการเปลี่ยนห่อ");
        }
    }

    //Normal Process
    switch (stepIndex) {
        case 1:
            clearStateInput(1);
            currentValue = containerBarcode;
            break;
        case 2:
            clearStateInput(2);
            currentValue = wrapBarcode;
            break;
        case 3:
            clearStateInput(3);
            currentValue = bundleBarcode;
            break;
        case 4:
            currentValue = headerBarcode;
            break;
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

    var requestData = {
        stepIndex: stepIndex,
        containerBarcode: containerBarcode || null,
        wrapBarcode: wrapBarcode || null,
        bundleBarcode: bundleBarcode || null,
        headerCardBarcode: headerBarcode || null,
        bssBNTypeCode: 'UF',
        ReceiveId: receiveId ?? null
    };

    try {
        $.enablePageLoader();
        let response;
        // If caller requests a step greater than 3 (e.g., 4), first validate step 3
        // and only continue to the original step if step 3 passes.
        if (stepIndex > 3) {
            const requestDataStep3 = Object.assign({}, requestData, { stepIndex: 3 });
            // Enable loader once for the whole validation flow (step 3 then original step)
            const responseStep3 = await validateBarcodeStepAsync(requestDataStep3);

            if (!responseStep3) {
                showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
                return;
            }

            if (responseStep3.is_success === true || responseStep3.isSuccess === true) {
                const data3 = responseStep3.data || {};
                const isValid3 = data3.isValid ?? data3.IsValid;
                const errorMessage3 = data3.errorMessage || data3.ErrorMessage || "";

                if (!isValid3) {
                    // If step 3 is not valid, show its error and do not proceed to the original step
                    showBarcodeErrorModal(errorMessage3 || "ไม่สามารถตรวจสอบบาร์โค้ดได้");
                    handleFocusStep(stepIndex);
                    return;
                }

                // Step 3 passed, now validate the original requested step while loader still enabled
                response = await validateBarcodeStepAsync(requestData);
            } else {
                var msgCode = responseStep3.msg_code || responseStep3.msgCode || "";
                var msgDesc = responseStep3.msg_desc || responseStep3.msgDesc || "";

                $.sweetError({
                    text: msgCode + " : " + msgDesc
                });
                return;
            }
        } else {
            response = await validateBarcodeStepAsync(requestData);
        }

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
            else if (stepIndex === 2) {
                // ✅ Validate: ต้องเป็นตัวเลขเท่านั้น
                if (!/^\d+$/.test(wrapBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("บาร์โค้ดรายห่อ ต้องเป็นตัวเลขเท่านั้น");
                    return;
                }
            }
            else if (stepIndex === 3) {
                // ✅ Validate: ต้องเป็นตัวเลขเท่านั้น
                if (!/^\d+$/.test(bundleBarcode)) {
                    handleFocusStep(stepIndex);
                    showBarcodeErrorModal("บาร์โค้ดมัด ต้องเป็นตัวเลขเท่านั้น");
                    return;
                }
            }
            else if (stepIndex === 4) {
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
                    document.getElementById("barcodeContainerInput").focus();
                    showBarcodeErrorModal(errorMachineConflictMessage);
                    return;
                }
            }

            if (isValid === true) {

                currentStep = stepIndex;
                updateDummyButtonByStep(currentStep);

                var nextStep = stepIndex + 1;

                if (stepIndex === 1) {
                    $('#barcodeWrapOld').val('');
                    cbmsData = [];
                    totalQtyByContainer = 0;

                    const responseCbms = await getReCdmsDataTransaction(containerBarcode);
                    if (!responseCbms || responseCbms.is_success === false) {
                        showBarcodeErrorModal(`ไม่พบภาชนะ ${containerBarcode}`);
                        return;
                    }

                    // เอา cbms มาทำเป็น global variable
                    var dataCbms = responseCbms.data || {};
                    cbmsData = dataCbms.sort((a, b) => a.denominationPrice - b.denominationPrice);

                    await updateBarcodeListTableAsync();
                    await updatePrepareCount();
                }

                if (stepIndex === 2) {
                    clearTempCbms();
                    $('#barcodeWrapOld').val(wrapBarcode);

                    var requestCbmsData = {
                        containerBarcode: containerBarcode,
                        wrapBarcode: wrapBarcode
                    };

                    const responseCbms = await getCheckReceiveCbmsTransactionAsync(requestCbmsData);

                    //console.log('response', responseCbms);
                    if (!responseCbms || responseCbms.is_success === false) {
                        focusStep(stepIndex);
                        showBarcodeErrorModal("Barcode รายห่อมีในระบบหรือไม่");
                        return;
                    }

                    if (!responseCbms.data || responseCbms.data.length === 0) {
                        focusStep(stepIndex);
                        showBarcodeErrorModal("ไม่พบข้อมูล Barcode รายห่อในระบบ");
                        return;
                    }

                    cbmsSelected = cbmsData.filter(x => x.containerId == containerBarcode.toUpperCase() && x.barCode == wrapBarcode)[0];
                    const cashCenterName = await getCashCenterName(wrapBarcode);
                    currCashCenterName = cashCenterName;

                    if (responseCbms.data != null) {
                        var data = responseCbms.data[0];
                        receiveId = data?.receiveId;
                        remainingQty = data?.remainingQty;
                        unfitQty = data?.unfitQty;

                        tempCbmsData.receiveId = data?.receiveId;
                        tempCbmsData.departmentId = data?.departmentId;
                        tempCbmsData.departmentName = data?.departmentName;
                        tempCbmsData.bnTypeInput = data?.bnTypeInput;
                        tempCbmsData.containerId = data?.containerId;
                        tempCbmsData.institutionShortName = data?.institutionShortName;
                        tempCbmsData.denominationPrice = data?.denominationPrice;
                        tempCbmsData.qty = data?.qty;
                        tempCbmsData.remainingQty = data?.remainingQty;
                        tempCbmsData.unfitQty = data?.unfitQty;
                        tempCbmsData.bankCode = data?.bankCode;
                        tempCbmsData.cashCenterName = currCashCenterName;

                        setPriceType(data?.denominationPrice);
                        $('#bankName').text(data?.institutionShortName ?? '-');
                        $('#cashcenterName').text(cashCenterName);

                        await updateReceiveCbmsCountsAsync();

                    } else {
                        focusStep(stepIndex);
                        showBarcodeErrorModal(responseCbms.msg_desc);
                    }
                }

                if (stepIndex === 4) {

                    if (!containerBarcode || !wrapBarcode || !bundleBarcode || !headerBarcode) {
                        return; // ถ้าขาดข้อมูลช่องใดจะไม่ทำอะไรเลย
                    }

                    const request = {
                        receiveId: receiveId ?? null,
                        containerCode: containerBarcode ?? null,
                        packageCode: wrapBarcode ?? null,
                        bundleCode: bundleBarcode ?? null,
                        headerCardCode: headerBarcode ?? null,
                    };

                    const saveResult = await createContainerBarcodeAsync(request);

                    if (!saveResult?.is_success) {

                        $("#barcodeBundleInput").val('');
                        $("#barcodeHeaderCardInput").val('');
                        showBarcodeErrorModal("บันทึก Container ไม่สำเร็จ");
                        //focusStep(stepIndex);
                        handleFocusStep(stepIndex);
                        return;
                    }

                    $("#barcodeBundleInput").val('');
                    $("#barcodeHeaderCardInput").val('');

                    //clearHeaderBarcodeInput();
                    await loadPreparationUnfits(1, 0);

                    const responseCbmsCount = await getReCdmsDataTransaction(containerBarcode);

                    if (!responseCbmsCount?.is_success || !responseCbmsCount.data?.length) {
                        showBarcodeErrorModal("ไม่พบข้อมูล CBMS หลังบันทึก");
                        $("#barcodeBundleInput").val('');
                        $("#barcodeHeaderCardInput").val('');
                        handleFocusStep(3);
                        return;
                    }

                    cbmsData = [];
                    // เอา cbms มาทำเป็น global variable
                    var dataCbms = responseCbmsCount.data || {};
                    cbmsData = dataCbms.sort((a, b) => a.denominationPrice - b.denominationPrice);

                    const updatedCbmsData = cbmsData.find(x =>
                        x.containerId === cbmsSelected.containerId &&
                        x.barCode == wrapBarcode
                    );

                    if (updatedCbmsData) {
                        cbmsSelected = updatedCbmsData;

                        receiveId = updatedCbmsData?.receiveId;
                        remainingQty = updatedCbmsData?.remainingQty || 0;
                        unfitQty = updatedCbmsData?.unfitQty || 0;

                        tempCbmsData.receiveId = updatedCbmsData?.receiveId;
                        tempCbmsData.departmentId = updatedCbmsData?.departmentId;
                        tempCbmsData.departmentName = updatedCbmsData?.departmentName;
                        tempCbmsData.bnTypeInput = updatedCbmsData?.bnTypeInput;
                        tempCbmsData.containerId = updatedCbmsData?.containerId;
                        tempCbmsData.institutionShortName = updatedCbmsData?.institutionShortName;
                        tempCbmsData.denominationPrice = updatedCbmsData?.denominationPrice;
                        tempCbmsData.qty = updatedCbmsData?.qty || 0;
                        tempCbmsData.remainingQty = updatedCbmsData?.remainingQty || 0;
                        tempCbmsData.unfitQty = updatedCbmsData?.unfitQty || 0;
                        tempCbmsData.bankCode = updatedCbmsData?.bankCode;
                        tempCbmsData.cashCenterName = currCashCenterName;
                    }

                    await updatePrepareCount();
                    await updateBarcodeListTableAsync();
                    await updateReconcileCount();

                    const containerAllEmpty = await handleCursorAfterHeaderCardScan();
                    if (!containerAllEmpty) {
                        await updateReceiveCbmsCountsAsync();
                    }

                    //renderSecondScreenDropdown();
                    //focusStep(3);
                    return;
                }

                var hasNext = barcodeSteps.some(function (s) { return s.stepIndex === nextStep; });
                if (hasNext) {

                    currentStep = nextStep;
                    focusStep(nextStep);
                    updateDummyButtonByStep(currentStep);
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
                            $("#barcodeContainerInput").val('');
                            clearStateInput(1);
                        }

                        // Clear additional step 2 inputs (only for isRemainingZero)
                        if (isRemainingZero) {
                            $("#barcodeWrapInput").val('');
                            $("#bankName").text('-');
                            $("#cashcenterName").text('-');
                            $("#priteType").text('-');
                            $("#bundleCount").text('0 / 0');

                            const element = document.querySelector('#priteType');
                            Array.from(element.classList).forEach(cls => {
                                element.classList.remove(cls);
                            });

                            element.classList.add('qty-badge.hidden');
                            clearStateInput(2);
                        }

                        // Focus to target step
                        focusStep(targetStep);
                    });
                    return;
                }

                if (stepIndex === 3) {
                    $("#barcodeBundleInput").val('');
                    $("#barcodeHeaderCardInput").val('');
                }

                //focusStep(stepIndex);
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

async function handleCursorAfterHeaderCardScan() {
    const containerBarcode = (document.getElementById("barcodeContainerInput")?.value || "").trim();
    const wrapBarcode = (document.getElementById("barcodeWrapInput")?.value || "").trim();
    const requestCbmsData = { containerBarcode, wrapBarcode };

    const [responseReCdms, responseCbms] = await Promise.all([
        getReCdmsDataTransaction(containerBarcode),
        getCheckReceiveCbmsTransactionAsync(requestCbmsData)
    ]);

    // เช็ค container ทั้งหมดก่อน
    if (responseReCdms?.is_success && Array.isArray(responseReCdms.data)) {

        const allRemainingZero = responseReCdms.data.every(
            item => item.remainingQty === 0
        );

        if (allRemainingZero) {
            $("#barcodeContainerInput").val('');
            clearStateInput(1);
            focusStep(1);
            return true; // indicate container is fully empty
        }
    }

    // เช็ค header card / wrap
    if (!responseCbms?.is_success ||
        !Array.isArray(responseCbms.data) ||
        responseCbms.data.length === 0) {
        return false;
    }

    const { remainingQty } = responseCbms.data[0];

    if (remainingQty === 0) {
        $("#barcodeWrapInput").val('');
        $("#bankName").text('-');
        $("#cashcenterName").text('-');
        $("#priteType").text('-');
        $("#bundleCount").text('0 / 0');

        const element = document.querySelector('#priteType');
        Array.from(element.classList).forEach(cls => {
            element.classList.remove(cls);
        });

        element.classList.add('qty-badge.hidden');

        focusStep(2);
        return true;
    } else {
        focusStep(3);
        return false;
    }
}

function handleFocusStep(step) {
    const modalEvent = document.getElementById("barcodeErrorModal");

    modalEvent.removeEventListener('hidden.bs.modal', focusByStep);

    function focusByStep() {
        focusStep(step);
    }

    modalEvent.addEventListener('hidden.bs.modal', focusByStep);
}

async function updatePrepareCount() {

    totalQtyByContainer = 0;

    const containerBarcode = document.getElementById("barcodeContainerInput").value.trim();

    var requestCountData = {
        departmentId: 0,
        containerId: containerBarcode,
        bssBNTypeCode:"UF"
    };

    const responseCountPrepare = await getCountCountPrepareByContainer(requestCountData);

    if (!responseCountPrepare || responseCountPrepare.is_success === false || responseCountPrepare.data == null) {
        prepareCount = 0;
    }
    else {

        prepareCount = parseInt(responseCountPrepare.data?.countPrepare);
    }

    totalQtyByContainer = 0;

    if (cbmsData.length > 0) {
        cbmsData
            .filter(item => item?.barCode?.[6] === '2')
            .forEach((item) => {
            totalQtyByContainer += item.unfitQty;
        });
    }

    const prepareCountEl = document.getElementById('prepareCount');
    if (prepareCountEl) {
        const totalBundles = totalQtyByContainer;
        prepareCountEl.textContent = `${prepareCount} / ${totalBundles}`;
    }

    const containerNameEl = document.getElementById('containerName');
    if (containerNameEl) {
        containerNameEl.textContent = containerBarcode;
    }
}

function clearHeaderBarcodeInput() {
    const input = document.getElementById("barcodeHeaderCardInput");
    if (input) {
        input.value = "";
        input.focus();
    }
}

function createContainerBarcodeAsync(request) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Preparation/CreateContainerBarcode',
            type: 'POST',
            parameter: request,
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

let arrDropdownDisplayTwo = [];

function mapDropdownDisplayTwoToData(items) {

    return (items || []).map(x => ({
        code: x.center.trim() + '|' + x.bank + '|' + x.barcode + '|' + x.qty ?? '',
        text: `ภาชนะ: ${x.barcode}, ธนาคาร: ${x.bank}, ศูนย์เงินสด: ${x.center.trim()} , ชนิดราคา: ${x.qty}` ?? '',
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

    if (tempCbmsData != null) {

        const currBankCode = tempCbmsData.bankCode.trim() ?? '';
        const currContainerId = tempCbmsData.containerId.trim() ?? '';
        const currDenominationPrice = tempCbmsData.denominationPrice.trim() ?? '';
        const currCashCenterName = tempCbmsData.cashCenterName.trim() ?? '';

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
let pageTwoWindowUnfit = null;

$('#btnShowSecondScreenPreparation').click(function () {

    let screenWidth = 1440;
    let screenHeight = 900;

    let LeftPosition = (screen.width) ? (screen.width - screenWidth) / 2 : 100;
    let TopPosition = (screen.height) ? (screen.height - screenHeight) / 2 : 100;

    const rootPath = document.body.getAttribute("data-root-path");
    const pageUrl = rootPath + "Preparation/SecondScreenPreparationUnfit";
    let pageName = "DisplayTwoPreparationUnfitWindow";

    let screenSettings =
        'width=' + screenWidth +
        ',height=' + screenHeight +
        ',top=' + TopPosition +
        ',left=' + LeftPosition +
        ',scrollbars=no,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no';

    // ถ้า popup ยังเปิดอยู่
    if (pageTwoWindowUnfit && !pageTwoWindowUnfit.closed) {

        pageTwoWindowUnfit.focus();

        const doc = pageTwoWindowUnfit.document;
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
    pageTwoWindowUnfit = window.open(pageUrl, pageName, screenSettings);

    if (!pageTwoWindowUnfit) return;

    pageTwoWindowUnfit.onload = function () {
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

    refreshSecondScreenColor(displayTwoDeno);

    $('#displaySmallCashpoint').text(displayTwoCashpoint);
    $('#displaySmallBankName').text(displayTwoBankName);
    $('#displaySmallDeno').text(displayTwoDeno);
    $('#displaySmallContainerId').text(displayTwoContainerId);

    if (!pageTwoWindowUnfit || pageTwoWindowUnfit.closed) {
        return;
    }

    const doc = pageTwoWindowUnfit.document;

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
    if (!pageTwoWindowUnfit || pageTwoWindowUnfit.closed) {

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

    $(pageTwoWindowUnfit.document).find('#denoType').val(displayTwoDeno);
    $(pageTwoWindowUnfit.document).find('#displayCashpoint').text(displayTwoCashpoint);
    $(pageTwoWindowUnfit.document).find('#displayBankName').text(displayTwoBankName);
    $(pageTwoWindowUnfit.document).find('#displayDeno').text("฿" + displayTwoDeno);
    $(pageTwoWindowUnfit.document).find('#displayContainerId').text(displayTwoContainerId);
    $(pageTwoWindowUnfit.document).find('#btnRefreshSecondScreen').click();
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

document.addEventListener("DOMContentLoaded", initBarcodeFocusWorkflow);

function bindSupervisorState() {
    const select = document.getElementById("supervisorName");
    if (!select) return;


    if (select.dataset.bound === "1") return;

    select.addEventListener("change", function () {
        const sup = supervisors.find(x => String(x.id) === String(this.value));

        tempEditData.supervisorId = sup ? sup.id : '';
        tempEditData.supervisorName = sup ? sup.name : '';
    });

    select.dataset.bound = "1";

}

function submitEditPreparationUnfit() {

    const headerCardCode = String(dataEdit?.headerCardCode) || "";
    const updatedBy = Number(dataEdit?.updatedBy) || 0;
    const createdBy = Number(dataEdit?.createdBy) || 0;


    if (createdBy <= 0 || updatedBy <= 0) return alert('createdBy / updatedBy must be > 0.');

    const prepareIds = [...new Set((dataEdit?.prepareIds ?? [])
        .map(Number)
        .filter(x => x > 0)
    )];
    if (prepareIds.length === 0) return alert('At least 1 prepareId is required.');

    const remark = String(dataEdit?.remark ?? '').trim();
    if (!remark) return toastr.error('กรุณากรอกเหตุผล (remark)');

    const requests = prepareIds.map(id => ({
        prepareId: id,
        headerCardCode: headerCardCode,
        remark: remark,
        updatedBy: updatedBy,
        createdBy: createdBy
    }));

    $.requestAjax({
        service: 'Preparation/EditPreparationUnfit',
        type: 'POST',
        parameter: requests,
        enableLoader: true,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        onSuccess: async function (response) {
            if (response?.is_success) {
                setTimeout(() => {
                    let modal = new bootstrap.Modal(document.getElementById('successModal'));
                    modal.show();

                }, 300);

                await loadPreparationUnfits(1, 0);
            } else {

                toastr.error(response?.msg_desc ?? "บันทึกไม่สำเร็จ", "Error");
            }
        }
    });
}
function submitDeletePreparationUnfit() {

    const prepareIds = [...new Set((tempDeleteData?.prepareIds ?? [])
        .map(Number)
        .filter(x => x > 0)
    )];
    if (prepareIds.length === 0) return alert('At least 1 prepareId is required.');

    const remark = String(tempDeleteData?.remark ?? '').trim();
    if (!remark) return toastr.error('กรุณากรอกเหตุผล (remark)');

    const requests = prepareIds.map(id => ({
        prepareId: id,
        remark: remark,
        updatedBy: Number(currentUserId)
    }));

    $.requestAjax({
        service: 'Preparation/DeletePreparationUnfit',
        type: 'POST',
        parameter: requests,
        enableLoader: true,
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        onSuccess: async function (response) {
            if (response?.is_success) {
                setTimeout(() => {
                    let modal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
                    modal.show();

                }, 500);

                const containerBarcode = document.getElementById("barcodeContainerInput").value.trim();
                if (containerBarcode) {
                    const responseCbms = await getReCdmsDataTransaction(containerBarcode);

                    if (responseCbms?.is_success && Array.isArray(responseCbms.data) && responseCbms.data.length > 0) {

                        cbmsData = responseCbms.data.sort((a, b) => a.denominationPrice - b.denominationPrice);

                        if (cbmsSelected && cbmsSelected.institutionId) {

                            const updatedCbms = cbmsData.find(x =>
                                x.institutionId === cbmsSelected.institutionId &&
                                x.containerId === cbmsSelected.containerId &&
                                x.denominationId === cbmsSelected.denominationId
                            );

                            if (updatedCbms) {
                                cbmsSelected = updatedCbms;
                                remainingQty = updatedCbms.remainingQty ?? 0;
                                unfitQty = updatedCbms.unfitQty ?? 0;

                                await updateReceiveCbmsCountsAsync();
                            }
                        }
                    }

                    await updateBarcodeListTableAsync();
                    await updatePrepareCount();
                }

                await loadPreparationUnfits(1, 0);

            } else {

                toastr.error(response?.msg_desc ?? "บันทึกไม่สำเร็จ", "Error");
            }
        }
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

    const url = `/Report/PreparationUnfit?${params.toString()}`;
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
        scrollbars=no,
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

    // --- ส่วนที่แก้ไข: ใช้ Form POST เพื่อส่ง Ids จำนวนมาก ---

    // 1. เปิดหน้าต่างใหม่เป็นหน้าว่าง (About:blank) รอก่อน
    const newWindow = window.open('', title, windowFeatures);

    if (newWindow) {
        // 2. สร้าง Form ชั่วคราว
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/Report/PreparationUnfit"; // ตรวจสอบ URL ให้ตรงกับ Controller
        form.target = title; // ส่งข้อมูลไปที่หน้าต่างที่เปิดไว้ (ชื่อต้องตรงกัน)

        // 3. ใส่ Ids ทั้งหมดลงใน Hidden Input
        selectedIds.forEach(id => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "preparationIds"; // ชื่อต้องตรงกับ Parameter ใน C#
            input.value = id;
            form.appendChild(input);
        });

        // 4. สั่งส่งข้อมูลและลบ Form ทิ้ง
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        if (window.focus) {
            newWindow.focus();
        }
    }
}

function clearStateInput(stepIndex) {

    switch (stepIndex) {
        case 1:

            cbmsSelected = {};
            cbmsData = [];
            pageState.isScannedContainerConflict = false;
            pageState.scannedContainerId = '';
            pageState.scannedContainerConflictText = '';
            totalQtyByContainer = 0;
            receiveId = 0;
            remainingQty = 0;
            unfitQty = 0;
            prepareCount = 0;
            countReconcile = 0;
            currCashCenterName = '';

            $("#barcodeWrapInput").val('');
            $("#barcodeBundleInput").val('');
            $("#barcodeHeaderCardInput").val('');
            $("#bankName").text('-');
            $("#cashcenterName").text('-');
            $("#priteType").text('-');
            $('#barcodeListBody').empty();
            $("#barcodeWrapPending").text('');
            $("#bundleCount").text('0 / 0');
            $("#containerName").text('');
            $("#prepareCount").text('0 / 0');
            $("#reconcileCount").text('0');

            const element = document.querySelector('#priteType');
            Array.from(element.classList).forEach(cls => {
                element.classList.remove(cls);
            });

            element.classList.add('qty-badge.hidden');
            break;
        case 2:
            $("#barcodeBundleInput").val('');
            $("#barcodeHeaderCardInput").val('');
            break;
        case 3:
            $("#barcodeHeaderCardInput").val('');
            break;
        case 4:
            break;
    }

}

function getReCdmsDataTransaction(containerId) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'ReceiveCbms/ReceiveCbmsDataTransactionForUnfit?containerId=' + containerId,
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