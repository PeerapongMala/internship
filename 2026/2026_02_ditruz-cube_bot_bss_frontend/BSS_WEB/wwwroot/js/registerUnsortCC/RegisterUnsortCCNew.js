window.addEventListener('load', async () => {
    setTimeout(async () => {
        await initComponent();
    }, 100);
});

let selectedContainerId = null;
let editingBankNoteId = null;
let dropDownEmptyText = "-- กรุณาเลือก --";
let isEditingReceivedStatus = false;

let defaultMaxEditBundle = 999;
let editingNoteMaxBundle = defaultMaxEditBundle;

async function initComponent() {
    const allTbody = document.querySelectorAll('tbody');
    allTbody.forEach((tbody, index) => {
    });

    $.enablePageLoader();

    // disable button add unsort cc and confirm register
    await isDisabledConfirmRegisterButton(true);
    await isDisabledAddUnsortCC(true);
    setFormToStep1();

    await Promise.all([loadRegisterUnsorts(), setupDropdownsInstitution()]);

    setupRadioDenomination();

    setupEventListeners();
    setupEventListenerContainer();
    setupModalEventListeners();
    renderUnsortTable();

    $.disablePageLoader();
}

async function isDisabledConfirmRegisterButton(isDisabled) {
    document.getElementById("confirmRegisterUnsort").disabled = isDisabled;
}

async function isDisabledAddUnsortCC(isDisabled) {
    document.getElementById("btnAddUnsortCC").disabled = isDisabled;
}

function setBanknoteRadiosEnabled(enabled) {
    const container = document.getElementById('banknoteContainer');
    if (!container) return;
    container.querySelectorAll('input[name="noteType"]').forEach(r => r.disabled = !enabled);

    container.querySelectorAll('input[name="noteType"]').forEach(r => {
        r.checked = false;   // เอา selection ออก
    });

    container.querySelectorAll('label').forEach(l => {
        l.style.opacity = enabled ? '1' : '0.5';
        l.style.pointerEvents = enabled ? 'auto' : 'none';
    });
}

function setFormToStep1() {
    const scanInput = document.getElementById('txtScanContainerCode');
    if (scanInput) { scanInput.disabled = false; scanInput.value = ''; scanInput.classList.remove('is-valid', 'is-invalid'); }
    $('#bankName').val(null).trigger('change');
    $('#bankName').prop('disabled', true).removeClass('is-invalid is-valid');
    setBanknoteRadiosEnabled(false);
    const bundleInput = document.getElementById('txtBundleCount');
    if (bundleInput) { bundleInput.disabled = true; bundleInput.value = ''; bundleInput.classList.remove('is-valid', 'is-invalid'); }
    document.getElementById('btnAddUnsortCC').disabled = true;
}

function setFormToStep2() {
    document.getElementById('txtScanContainerCode').disabled = false;
    $('#bankName').val(null).trigger('change');
    $('#bankName').prop('disabled', false).removeClass('is-invalid is-valid');
    setBanknoteRadiosEnabled(false);
    const bundleInput = document.getElementById('txtBundleCount');
    if (bundleInput) { bundleInput.disabled = true; bundleInput.value = ''; bundleInput.classList.remove('is-valid', 'is-invalid'); }
    document.getElementById('btnAddUnsortCC').disabled = true;
}

function setFormToAllDisabled() {
    document.getElementById('txtScanContainerCode').disabled = true;
    $('#bankName').prop('disabled', true).removeClass('is-invalid is-valid');
    setBanknoteRadiosEnabled(false);
    const bundleInput = document.getElementById('txtBundleCount');
    if (bundleInput) { bundleInput.disabled = true; bundleInput.value = ''; bundleInput.classList.remove('is-valid', 'is-invalid'); }
    document.getElementById('btnAddUnsortCC').disabled = true;
}

let tableContainerData = [];
let tempIdCounter = -1;

window.pageState = window.pageState || {
    bankCollection: [],
    currentBank: null,
    denoCollection: [],
    currentDeno: null,
    registerUnsortsCollection: [],
    selected: { bankId: 0, denominationId: 0 }
};

const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;

const tableConfig = {
    'รับมอบ': [
        { label: 'ธนาคาร', field: 'instNameTh' },
        { label: 'ชนิดราคา', field: 'denoName', isBadge: true },
        { label: 'Un-Prepare', field: 'remainingQty' },
        { label: 'Prepare', field: 'banknoteQty', isPrepare: true },
        { label: 'Action', field: 'action' }
    ],
    'ลงทะเบียน': [
        { label: 'ธนาคาร', field: 'instNameTh' },
        { label: 'ชนิดราคา', field: 'denoName', isBadge: true },
        { label: 'จำนวน(มัด)', field: 'banknoteQty' },
        { label: 'วันที่ลงทะเบียน', field: 'createdDate' },
        { label: 'Action', field: 'action' }
    ],
    'ส่งมอบ': [
        { label: 'ธนาคาร', field: 'instNameTh' },
        { label: 'ชนิดราคา', field: 'denoName', isBadge: true },
        { label: 'จำนวน(มัด)', field: 'banknoteQty' },
        { label: 'วันที่ลงทะเบียน', field: 'createdDate' },
        { label: 'Action', field: 'action' }
    ],
    'ส่งคืน': [
        { label: 'ธนาคาร', field: 'instNameTh' },
        { label: 'ชนิดราคา', field: 'denoName', isBadge: true },
        { label: 'จำนวน(มัด)', field: 'banknoteQty' },
        { label: 'วันที่ลงทะเบียน', field: 'createdDate' },
        { label: 'Action', field: 'action' }
    ]
};

let mocdBanknotes = [
    { id: 1, Banknotes: 20 },
    { id: 2, Banknotes: 50 },
    { id: 3, Banknotes: 100 },
    { id: 4, Banknotes: 500 },
    { id: 5, Banknotes: 1000 },
];

let tempDeleteData =
{
    deleteIds: [],
};

// temp object สำหรับเก็บ item ที่ถูกลบรอยืนยัน
let pendingDeleteContainer = null;   // { id, backup: {...} }
let pendingDeleteBankNotes = [];     // [{ unsortCCId, containerId, backup: {...} }]

let editingContainerId = null;

function restorePendingDeletes() {
    // restore ภาชนะที่ลบไว้
    if (pendingDeleteContainer) {
        const item = tableContainerData.find(x => x.id === pendingDeleteContainer.id);
        if (item) item.isActive = pendingDeleteContainer.backup.isActive;
        pendingDeleteContainer = null;
        renderContainerTable();
    }

    // restore ธนบัตรที่ลบไว้
    if (pendingDeleteBankNotes.length > 0) {
        pendingDeleteBankNotes.forEach(pending => {
            const container = tableContainerData.find(c => c.id === pending.containerId);
            if (container && container.unsortCC) {
                const note = container.unsortCC.find(n => n.unsortCCId === pending.unsortCCId);
                if (note) note.isActive = pending.backup.isActive;
            }
        });
        pendingDeleteBankNotes = [];
    }
}

function renderBankDropdownInEditModal() {
    const select = document.getElementById("editBankNote");
    if (!select) return;

    select.innerHTML = '<option value="">-- กรุณาเลือก --</option>';
    pageState.bankCollection.forEach(bank => {
        const option = document.createElement("option");
        option.value = bank.id;
        option.textContent = bank.name;
        select.appendChild(option);
    });
}

function renderPriceTypeDropdownInEditModal() {
    const editPriceSelect = document.getElementById("editPriceType");
    if (!editPriceSelect) return;

    let html = '<option value="">-- เลือกชนิดราคา --</option>';
    pageState.denoCollection.forEach(item => {
        html += `<option value="${item.key}" data-text="${item.text}">${item.text}</option>`;
    });
    editPriceSelect.innerHTML = html;
}

function updatePriceTypeBadge(value) {
    const badge = document.getElementById('priceTypeBadge');
    if (!badge) return;

    if (!value) {
        badge.innerText = '-';
        badge.className = 'qty-badge';
        return;
    }

    const deno = pageState.denoCollection?.find(f => f.key == value);
    const displayText = deno ? deno.text : value;

    badge.innerText = displayText;
    badge.className = `qty-badge qty-${displayText}`;
}

function renderContainerTable() {
    const tbody = document.getElementById('tableContainer');
    if (!tbody) return;

    tbody.innerHTML = '';
    const hasNewContainer = tableContainerData.some(item => item.id < 0 && item.isActive !== false);
    tableContainerData.filter(item => item.isActive !== false).forEach(item => {
        const hideAction = [BSSStatusEnum.Delivered, BSSStatusEnum.NotAccepted].includes(item.statusId);
        const isNew = item.statusId === null;
        const isSelected = item.id === selectedContainerId;
        const isLocked = hasNewContainer && item.id >= 0;

        const row = document.createElement('tr');
        row.id = item.container;
        row.style.cursor = isLocked ? 'default' : 'pointer';
        row.style.pointerEvents = isLocked ? 'none' : 'auto';
        row.style.opacity = isLocked ? '0.5' : '1';
        row.className = isSelected ? 'table-primary active-row' : '';
        row.onclick = function () {
            tbody.querySelectorAll('tr').forEach(r => {
                r.classList.remove('table-primary', 'active-row');
            });
            this.classList.add('table-primary', 'active-row');
            onSelectContainer(item.id);
        };

        row.innerHTML = `
            <td>${item.container}</td>
            <td>${item.date}</td>
            <td>${item.remark}</td>
            <td>${renderStatusBadge(item.status)}</td>
            <td style="text-align: center !important;">
                ${!hideAction ? `
                    ${(item.canEdit || isNew) ? `
                     <button class="btn-action btn-warning" onclick="editContainer(${item.id}); event.stopPropagation();">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ` : ''}

                   ${item.canPrint ? `
                    <button class="btn-action"
                        onclick="printContainer(${item.id}); event.stopPropagation();">
                        <i class="bi bi-printer"></i>
                    </button>
                    ` : ''}

                   ${(item.canDelete || (isNew && (item.statusId === BSSStatusEnum.Received || item.statusId === null))) ? `
                    <button class="btn-action btn-danger" onclick="deleteContainer(${item.id}); event.stopPropagation();">
                        <i class="bi bi-trash"></i>
                    </button>
                    ` : ''}

                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
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

// เลือก Container (ดับเบิ้ลคลิก)
async function onSelectContainer(containerId) {

    // ถ้ามี pending delete ค้างอยู่ ให้ restore กลับ (user ไม่ได้กดยืนยัน)
    restorePendingDeletes();
    selectedContainerId = containerId
    let selectRegisterUnsort = tableContainerData.find(i => i.id === selectedContainerId);

    if (selectRegisterUnsort.statusId == BSSStatusEnum.Registered || selectRegisterUnsort.statusId === null) {
        // สถานะลงทะเบียน หรือ ภาชนะใหม่ → step 2 (bank enabled, rest disabled)
        if (selectRegisterUnsort.statusId === null) {
            // ภาชนะใหม่: enable เฉพาะมีธนบัตรอย่างน้อย 1 รายการ
            const hasNotes = (selectRegisterUnsort.unsortCC || []).some(n => n.isActive !== false);
            await isDisabledConfirmRegisterButton(!hasNotes);
        } else {
            // สถานะลงทะเบียน: enable เสมอ
            await isDisabledConfirmRegisterButton(false);
        }
        setFormToStep2();
    } else if (selectRegisterUnsort.statusId == BSSStatusEnum.Received) {
        // สถานะรับมอบ → ปิดปุ่มยืนยัน
        await isDisabledConfirmRegisterButton(true);
        setFormToAllDisabled();
    } else {
        await isDisabledConfirmRegisterButton(true);
        setFormToAllDisabled();
    }

    const scanInput = document.getElementById('txtScanContainerCode');
    scanInput.value = selectRegisterUnsort.container;
    scanInput.disabled = false;

    // clear unsort cc if unsortCCId is null;
    if (selectRegisterUnsort?.unsortCC && selectRegisterUnsort?.unsortCC?.length > 0) {
        selectRegisterUnsort.unsortCC = selectRegisterUnsort.unsortCC.filter(item => item.unsortCCId !== undefined);
    }
    renderUnsortTable(selectRegisterUnsort);
}

function updateSelectedContainerTitle(containerName) {
    const titleElement = document.querySelector('.card-title');
    if (titleElement) {
        const titleSpan = titleElement.parentElement.querySelector('span.card-title');
        if (titleSpan && titleSpan.textContent.includes('รายการลงทะเบียนธนบัตร')) {
            titleSpan.innerHTML = `รายการลงทะเบียนธนบัตรตามบาร์โค้ดภาชนะที่เลือก <span class="badge bg-primary ms-2">${containerName}</span>`;
        }
    }
}
function renderUnsortTable(registerUnsort) {

    const thead = document.querySelector('#tableBody').closest('table').querySelector('thead');
    const tbody = document.getElementById('tableBody');

    const tableEl = thead?.closest('table');
    if (!tableEl) return; // ป้องกันถ้าหา Table ไม่เจอ
    tableEl.classList.remove(
        'preparationREGISTER_UNSORT_CC_T1',
        'preparationREGISTER_UNSORT_CC_T2',
        'preparationREGISTER_UNSORT_CC_T3',
        'preparationREGISTER_UNSORT_CC_T4'
    );
    const currentStatus = registerUnsort?.status?.text || registerUnsort?.status;
    if (currentStatus == "รับมอบ")
        thead.closest('table').classList.add('preparationREGISTER_UNSORT_CC_T1');
    else if (currentStatus == "ส่งมอบ")
        thead.closest('table').classList.add('preparationREGISTER_UNSORT_CC_T2');
    else if (currentStatus == "ส่งคืน")
        thead.closest('table').classList.add('preparationREGISTER_UNSORT_CC_T3');
    else
        thead.closest('table').classList.add('preparationREGISTER_UNSORT_CC_T4');

    if (!tbody || !thead) return;

    if (registerUnsort && registerUnsort.unsortCC?.some(n => n.isActive !== false)) {

        // 2. ดึง Config ตามสถานะ (เพื่อสลับหัวตารางระหว่าง 'ลงทะเบียน' กับ 'รับมอบ')
        const columns = tableConfig[registerUnsort.status] || tableConfig['ลงทะเบียน'];

        // 3. วาดหัวตาราง (Thead)
        let headHtml = '<tr>'; // คอลัมน์ลำดับ เอาออก <th></th>
        columns.forEach(col => {
            headHtml += `<th>${col.label}</th>`;
        });
        headHtml += '</tr>';
        thead.innerHTML = headHtml;

        // 4. ดึงข้อมูลลูกจาก property "child" ภายใน container นั้น (กรอง isActive = false ออก)
        const filteredNotes = (registerUnsort && registerUnsort.unsortCC) ? registerUnsort.unsortCC.filter(n => n.isActive !== false) : [];
        tbody.innerHTML = '';

        if (filteredNotes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="text-center text-muted py-4">
            ${selectedContainerId ? 'ไม่มีข้อมูลสำหรับภาชนะนี้' : 'กรุณาเลือกภาชนะจากตารางด้านบน'}
        </td></tr>`;
        } else {
            // 5. วาดเนื้อหาตาราง (Tbody)
            filteredNotes.forEach((note, index) => {

                const row = document.createElement('tr');
                let rowHtml = '';//`<td>${index + 1}</td>`;

                columns.forEach(col => {
                    if (col.field === 'action') {
                        let actionHtml = '';

                        if (note.canEdit) {
                            actionHtml += `
                                <button class="btn-action btn-warning" onclick="editUnsortNote(${note.unsortCCId})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            `;
                        }

                        if (note.canDelete) {
                            actionHtml += `
                                <button class="btn-action btn-danger" onclick="deleteUnsortNote(${note.unsortCCId})">
                                   <i class="bi bi-trash"></i>
                                </button>
                            `;
                        }

                        rowHtml += `<td>${actionHtml}</td>`;
                    } else if (col.isPrepare) {
                        const prepareQty = (note.banknoteQty || 0) - (note.remainingQty || 0) - (note.adjustQty || 0);
                        rowHtml += `<td>${prepareQty}</td>`;
                    } else if (col.isBadge) {
                        rowHtml += `<td><span class="qty-badge qty-${note[col.field]}">${note[col.field]}</span></td>`;
                    } else if (col.field === 'createdDate') {
                        const isTemp = (note.unsortCCId ?? 0) < 0;
                        if (isTemp) {
                            rowHtml += `<td></td>`;
                        } else {
                            const val = note[col.field];
                            const d = val ? new Date(val) : null;
                            if (d && !isNaN(d)) {
                                const dd = String(d.getDate()).padStart(2, '0');
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const yyyy = d.getFullYear() + 543;
                                const hh = String(d.getHours()).padStart(2, '0');
                                const min = String(d.getMinutes()).padStart(2, '0');
                                rowHtml += `<td>${dd}/${mm}/${yyyy} ${hh}:${min}</td>`;
                            } else {
                                rowHtml += `<td>${val || ''}</td>`;
                            }
                        }
                    } else {
                        rowHtml += `<td>${note[col.field] || 0}</td>`;
                    }
                });

                row.innerHTML = rowHtml;
                tbody.appendChild(row);
            });
        }
    } else {
        // clear table รายการลงทะเบียนธนบัตรตามบาร์โค้ดภาชนะที่เลือก 
        tbody.innerHTML = ''
    }


    // อัปเดตตัวเลขยอดรวมมัดด้านบนตาราง
    const activeNotes = (registerUnsort?.unsortCC || []).filter(n => n.isActive !== false);
    updateTotalBundle(activeNotes, registerUnsort?.status?.text || registerUnsort?.status);
}

// คำนวณและแสดงจำนวนมัดรวม
function updateTotalBundle(notes, status) {
    const totalBundleElement = document.getElementById('totalBundle');
    if (totalBundleElement) {
        const isReceived = status === 'รับมอบ';
        const total = notes.reduce((sum, note) => {
            return sum + (isReceived ? (note.remainingQty || 0) : (note.banknoteQty || 0));
        }, 0);

        totalBundleElement.textContent = total;
    }
}

function setupEventListeners() {
    // 1. ปุ่มเพิ่มธนบัตร
    const btnAdd = document.getElementById('btnAddUnsortCC');
    if (btnAdd) {
        btnAdd.addEventListener('click', addUnsortNote);
    }

    // 2. ช่องเลือกธนาคาร (ใช้ jQuery on เพื่อดักจับ Select2 jQuery event)
    $('#bankName').on('change', function () {
        if (this.value !== "") {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            // step 3: enable deno, reset bundle/add
            setBanknoteRadiosEnabled(true);
            const bundleEl = document.getElementById('txtBundleCount');
            if (bundleEl) { bundleEl.disabled = true; bundleEl.value = ''; bundleEl.classList.remove('is-valid', 'is-invalid'); }
            document.getElementById('btnAddUnsortCC').disabled = true;
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            setBanknoteRadiosEnabled(false);
            const bundleEl = document.getElementById('txtBundleCount');
            if (bundleEl) { bundleEl.disabled = true; bundleEl.value = ''; }
            document.getElementById('btnAddUnsortCC').disabled = true;
        }
    });

    // 2.5 ชนิดราคา (radio)
    const denoContainer = document.getElementById('banknoteContainer');
    if (denoContainer) {
        denoContainer.addEventListener('change', function (e) {
            if (e.target.name === 'noteType' && e.target.value) {
                // step 4: enable bundle, disable add
                const bundleEl = document.getElementById('txtBundleCount');
                if (bundleEl) { bundleEl.disabled = false; bundleEl.value = ''; bundleEl.classList.remove('is-valid', 'is-invalid'); }
                document.getElementById('btnAddUnsortCC').disabled = true;
            }
        });
    }

    // 3. ช่องจำนวนมัด
    const bundleInput = document.getElementById('txtBundleCount');
    if (bundleInput) {
        bundleInput.addEventListener('keydown', function (e) {
            // ป้องกันทศนิยม
            if (e.key === '.' || e.key === ',') {
                e.preventDefault();
                return;
            }
        });

        bundleInput.addEventListener('input', function () {
            const val = parseInt(this.value, 10);

            if (this.value.trim() === '' || isNaN(val)) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                document.getElementById('btnAddUnsortCC').disabled = true;
                return;
            }

            if (val === 0) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                document.getElementById('btnAddUnsortCC').disabled = true;
                showBarcodeErrorModal('จำนวนมัดต้องมากกว่า 0');
            } else if (val > 999) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                document.getElementById('btnAddUnsortCC').disabled = true;
                showBarcodeErrorModal('จำนวนมัดต้องไม่เกิน 999');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                // step 5: enable add button
                document.getElementById('btnAddUnsortCC').disabled = false;
            }
        });
    }

    // 4. ช่องแก้ไขบาร์โค้ดภาชนะใน Modal
    const editContainerInput = document.getElementById('editContainer');
    if (editContainerInput) {
        editContainerInput.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
            }
        });

        // กด Enter เพื่อบันทึก
        editContainerInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateContainer();
            }
        });
    }

    // 5. validation สำหรับ editoldCountBundle ใน modal แก้ไข (ทั้งสถานะลงทะเบียนและรับมอบ)
    const editBundleInput = document.getElementById('editoldCountBundle');
    if (editBundleInput) {
        editBundleInput.addEventListener('input', function () {
            const btnSave = document.getElementById('btnSaveEditBankNote');
            const val = parseInt(this.value, 10);

            if (this.value.trim() === '' || isNaN(val)) {
                this.classList.remove('is-invalid');
                if (btnSave) btnSave.disabled = true;
                return;
            }

            if (val < 0 || val > editingNoteMaxBundle) {
                this.classList.add('is-invalid');
                if (btnSave) btnSave.disabled = true;
            } else {
                this.classList.remove('is-invalid');
                if (btnSave) btnSave.disabled = false;
            }
        });
    }
}

function setupEventListenerContainer() {
    // ช่องสแกนบาร์โค้ด
    const scanInput = document.getElementById('txtScanContainerCode');

    if (scanInput) {
        scanInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const containerBarcode = this.value.trim();

                if (containerBarcode.length !== 7) {

                    // บาร์โค้ดภาชนะต้องมีความยาว 7 ตัวอักษร
                    showBarcodeErrorModal("บาร์โค้ดภาชนะต้องมีความยาว 7 ตัวอักษร");
                    return;
                }

                var requestData = {
                    stepIndex: 1,
                    containerBarcode: containerBarcode || null,
                    wrapBarcode: "" || null,
                    bundleBarcode: "" || null,
                    headerCardBarcode: "" || null,
                    bssBNTypeCode: 'REUC',
                    validateExistingInDatabase: true
                };

                try {

                    $.enablePageLoader();
                    $.requestAjax({
                        service: 'PrePreparationUnsort/ValidateBarcodeContainer',
                        type: 'POST',
                        parameter: requestData,
                        enableLoader: false,
                        headers: {
                            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                        },
                        onSuccess: async function (response) {
                            $.disablePageLoader();
                            if (response?.is_success) {

                                setTimeout(() => {

                                    var data = response.data || {};
                                    var isValid = data.isValid ?? data.IsValid;
                                    var errorMessage = data.errorMessage || data.ErrorMessage || "";

                                    if (!isValid) {
                                        showBarcodeErrorModal(errorMessage);
                                        $('#txtScanContainerCode').removeClass('is-invalid');
                                        $('#txtScanContainerCode').removeClass('is-valid');
                                        scanInput.focus();
                                        return;
                                    }

                                    // เพิ่ม item ใหม่เสมอ ไม่ auto select item ที่มีอยู่ในตาราง
                                    const existingContainer = tableContainerData.find(c => c.container === containerBarcode && c.isActive !== false);
                                    if (!existingContainer) {
                                        const newContainer = {
                                            id: tempIdCounter--,
                                            container: containerBarcode,
                                            date: '',
                                            remark: '-',
                                            statusId: null,
                                            status: '-',
                                            canEdit: false,
                                            canPrint: false,
                                            canDelete: false,
                                            isActive: true,
                                            unsortCC: []
                                        };
                                        tableContainerData.unshift(newContainer);
                                        selectedContainerId = newContainer.id;
                                        renderContainerTable();
                                        renderUnsortTable(newContainer);
                                        isDisabledConfirmRegisterButton(true);
                                        setFormToStep2();
                                        document.getElementById('txtScanContainerCode').disabled = true;
                                    }

                                    const nextInput = document.getElementById('bankName');
                                    nextInput.focus();

                                }, 300);

                            } else {

                                var msgCode = response.msg_code || response.msgCode || "";
                                var msgDesc = response.msg_desc || response.msgDesc || "";

                                $.sweetError({
                                    text: msgCode + " : " + msgDesc
                                });

                                //showBarcodeErrorModal("ไม่สามารถตรวจสอบบาร์โค้ดได้");
                                return;
                            }
                        },
                        onError: function () {
                            $.disablePageLoader();
                        }
                    });


                } catch (err) {
                    $.disablePageLoader();
                    console.error(err);
                    showBarcodeErrorModal("เกิดข้อผิดพลาดในการตรวจสอบบาร์โค้ด");
                }
            }
        });

        scanInput.addEventListener('input', function () {
            if (this.value.trim() !== "") {
                this.classList.remove('is-invalid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
}

// Setup Event Listeners สำหรับ Modal
function setupModalEventListeners() {
    // รีเซ็ต Modal เมื่อปิด
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.addEventListener('hidden.bs.modal', function () {
            resetEditModal();
        });
    }

    const editBankNoteModal = document.getElementById('editBankNoteModal');
    if (editBankNoteModal) {
        editBankNoteModal.addEventListener('hidden.bs.modal', function () {
            resetEditBankNoteModal();
        });
    }

    const editBundleInput = document.getElementById('editoldCountBundle');
    if (editBundleInput) {
        editBundleInput.addEventListener('keydown', function (e) {
            if (e.key === '-') e.preventDefault();
        });
    }
}

/**
 * /
 * เพิ่มธนบัตรใส่ ภาชนะ
 */
function addUnsortNote() {
    const scanInput = document.getElementById('txtScanContainerCode');
    const bankSelect = document.getElementById('bankName');
    const bundleInput = document.getElementById('txtBundleCount');


    // --- 1. Validation ---
    let isValid = true;
    if (!selectedContainerId) { scanInput.classList.add('is-invalid'); isValid = false; }
    if (bankSelect.value === "") { bankSelect.classList.add('is-invalid'); isValid = false; }
    if (bundleInput.value.trim() === "" || parseInt(bundleInput.value) <= 0) {
        bundleInput.classList.add('is-invalid'); isValid = false;
    }

    if (!isValid) return;

    // --- 2. เตรียมข้อมูล ---
    const noteType = parseInt(document.querySelector('input[name="noteType"]:checked')?.value) || 0;
    const denoName = pageState.denoCollection?.find(f => f.key === noteType).text;
    const inputValue = parseInt(bundleInput.value);
    const today = new Date().toLocaleDateString('th-TH');

    // หา Object Container ตัวแม่
    const registerUnsort = tableContainerData.find(c => c.id === selectedContainerId && c.container === scanInput.value);
    if (!registerUnsort) return;
    if (!registerUnsort.unsortCC) registerUnsort.unsortCC = [];

    // check ว่า unsort cc มี ธนาคาร และ ชนิดราคา ซ้ำในภาชนะ
    const exists = registerUnsort?.unsortCC?.some(item => item.instId === Number(bankSelect.value) && item.denoId === Number(noteType) && item.isActive);
    if (exists) {
        showBarcodeErrorModal('มีธนาคาร และ ชนิดราคา นี้ในภาชนะแล้ว');
        return;
    }

    // สร้าง Object ลูกใหม่ตามเงื่อนไขสถานะ
    let newNote = {
        unsortCCId: tempIdCounter--,
        registerUnsortId: registerUnsort?.id,
        instId: Number(bankSelect.value),
        instNameTh: bankSelect.options[bankSelect.selectedIndex].text,
        denoId: noteType,
        denoName: denoName,
        banknoteQty: inputValue,
        remainingQty: inputValue,
        createdDate: today,
        canEdit: true,
        canDelete: true,
        isActive: true
    };

    registerUnsort?.unsortCC?.push(newNote);

    // เปิดปุ่มยืนยันเมื่อมีธนบัตรแล้ว
    isDisabledConfirmRegisterButton(false);

    // --- 4. ล้างค่าหน้าจอและรีเฟรชตาราง ---
    bundleInput.value = '';
    renderUnsortTable(registerUnsort);
    resetValidation();
    // step 6: cursor ไปที่ธนาคาร, disable ชนิดราคา/จำนวนมัด/ปุ่มเพิ่ม
    $('#bankName').val('').trigger('change.select2');
    setBanknoteRadiosEnabled(false);
    bundleInput.disabled = true;
    document.getElementById('btnAddUnsortCC').disabled = true;
    bankSelect.focus();
}
function resetValidation() {
    const autoResetInputs = ['bankName', 'txtBundleCount'];
    autoResetInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('is-invalid', 'is-valid');
        }
    });

    const scanInput = document.getElementById('txtScanContainerCode');
    if (scanInput) {
        if (scanInput.value.trim() !== "" && selectedContainerId !== null) {
            scanInput.classList.add('is-valid');
            scanInput.classList.remove('is-invalid');
        } else {
            scanInput.classList.remove('is-valid', 'is-invalid');
        }
    }
}

function editUnsortNote(id) {

    let note = null;
    let parentContainer = null;

    // วนลูปหา Note ในทุกๆ Container
    for (let c of tableContainerData) {
        if (c.unsortCC) {
            note = c.unsortCC.find(x => x.unsortCCId === id);
            if (note) {
                parentContainer = c;
                break;
            }
        }
    }

    if (!note) return; // ถ้าหาไม่เจอให้หยุดทำงาน

    const bundleInput = document.getElementById('editoldCountBundle');
    if (bundleInput) {
        bundleInput.classList.remove('is-invalid');
        bundleInput.value = "";
    }

    // ใช้ status จาก parentContainer ที่เราหาเจอ
    const statusId = parentContainer ? parentContainer.statusId : BSSStatusEnum.Registered;
    const isReceived = (statusId === BSSStatusEnum.Received);

    if (document.getElementById('editId')) document.getElementById('editId').value = id;

    // การแสดงผล Section ใน Modal
    const sections = {
        'sectionViewBank': isReceived, 'sectionOldBank': !isReceived, 'sectionEditBank': !isReceived,
        'sectionViewPrice': isReceived, 'sectionOldPrice': !isReceived, 'sectionEditPrice': !isReceived
    };
    for (let sectionId in sections) {
        let el = document.getElementById(sectionId);
        if (el) el.style.display = sections[sectionId] ? 'block' : 'none';
    }

    const oldBundleDisplay = isReceived ? note.remainingQty : note.banknoteQty;
    if (document.getElementById('oldCountBundle')) {
        document.getElementById('oldCountBundle').value = oldBundleDisplay || 0;
    }

    // เก็บสถานะว่ากำลัง edit รายการของ "รับมอบ" หรือไม่
    isEditingReceivedStatus = isReceived;
    editingNoteMaxBundle = isReceived ? note.remainingQty : defaultMaxEditBundle;

    if (isReceived) {
        // สถานะรับมอบ
        if (document.getElementById('oldBankNoteFull')) document.getElementById('oldBankNoteFull').value = note.instNameTh;
        if (document.getElementById('oldPriceFull')) document.getElementById('oldPriceFull').value = note.denoName;
        if (document.getElementById('editoldCountBundle')) {
            document.getElementById('editoldCountBundle').value = "";
            document.getElementById('editoldCountBundle').placeholder = "ระบุจำนวนมัดที่รับจริง...";
        }
        updatePriceTypeBadge(note.denoId);
        // reset ปุ่มบันทึก: disable เพราะค่ายังว่างอยู่
        const btnSave = document.getElementById('btnSaveEditBankNote');
        if (btnSave) btnSave.disabled = true;
    } else {
        if (document.getElementById('oldBankNoteHalf')) document.getElementById('oldBankNoteHalf').value = note.instNameTh;
        if (document.getElementById('oldPriceHalf')) document.getElementById('oldPriceHalf').value = note.denoName;

        renderBankDropdownInEditModal();
        renderPriceTypeDropdownInEditModal();

        if (document.getElementById('editBankNote')) {
            const bankSelect = document.getElementById('editBankNote');
            bankSelect.value = String(note.instId);
            if (bankSelect.selectedIndex === -1) bankSelect.selectedIndex = 0;
        }
        if (document.getElementById('editPriceType')) {
            document.getElementById('editPriceType').value = note.denoId;
            updatePriceTypeBadge(note.denoId);
        }
        if (document.getElementById('editoldCountBundle')) {
            document.getElementById('editoldCountBundle').value = note.banknoteQty;
        }
        // สถานะลงทะเบียน: enable ปุ่มบันทึกปกติ
        const btnSave = document.getElementById('btnSaveEditBankNote');
        if (btnSave) btnSave.disabled = false;
    }

    if (document.getElementById('oldContainerBankNote')) {
        document.getElementById('oldContainerBankNote').value = parentContainer ? parentContainer.container : '';
    }

    const modalEl = document.getElementById('editBankNoteModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function toggleEditFields(showOld) {
    const oldFields = ['oldBankNote', 'oldPriceType', 'oldCountBundle'];
    oldFields.forEach(id => {
        const parentCol = document.getElementById(id).closest('.col-md-6');
        if (parentCol) {
            parentCol.style.display = showOld ? 'block' : 'none';
        }
    });
}

function updateBankNote() {
    const id = parseInt(document.getElementById('editId').value);
    const newBundleInput = document.getElementById('editoldCountBundle');
    const newBundleValue = parseInt(newBundleInput.value);

    // --- 1. Validation ---
    if (isNaN(newBundleValue) || newBundleValue < 0) {
        newBundleInput.classList.add('is-invalid');
        newBundleInput.focus();
        return;
    }

    // --- 2. ค้นหา Note และ Container ตัวแม่ ---
    let targetNote = null;
    let parentContainer = null;

    for (let container of tableContainerData) {
        if (container.unsortCC) {
            targetNote = container.unsortCC.find(n => n.unsortCCId === id);
            if (targetNote) {
                parentContainer = container;
                break;
            }
        }
    }

    if (!targetNote) {
        showBarcodeErrorModal("ไม่พบข้อมูลที่ต้องการแก้ไข");
        return;
    }

    // validate ถ้าเป็น status รับมอบ new bundle จะต้องไม่มากกว่า remaing qty ของเดิม
    if (parentContainer.statusId === BSSStatusEnum.Received && newBundleValue > targetNote.remainingQty) {
        showBarcodeErrorModal('จำนวนมัดต้องไม่มากกว่าจำนวนมัดคงเหลือในระบบ');
        return;
    }

    if (newBundleValue < 0) {
        showBarcodeErrorModal('จำนวนมัดไม่ต้องไม่เป็น 0');
        return;
    }

    // --- 3. แก้ไขข้อมูลตามสถานะของ Container ---
    if (parentContainer.statusId === null || parentContainer.statusId === BSSStatusEnum.Registered) {
        const bankSelect = document.getElementById('editBankNote');
        const newInstId = Number(bankSelect.value);
        const newDenoId = parseInt(document.getElementById('editPriceType').value);

        // validate: ห้ามซ้ำ ธนาคาร+ชนิดราคา กับ item อื่นในภาชนะเดียวกัน
        const duplicate = parentContainer.unsortCC?.some(item =>
            item.unsortCCId !== id &&
            item.instId === newInstId &&
            item.denoId === newDenoId &&
            item.isActive !== false
        );
        if (duplicate) {
            showBarcodeErrorModal('มีธนาคาร และ ชนิดราคา นี้ในภาชนะแล้ว');
            return;
        }

        targetNote.instId = newInstId;
        targetNote.instNameTh = bankSelect.options[bankSelect.selectedIndex]?.text || targetNote.instNameTh;
        targetNote.denoId = newDenoId;
        const denoName = pageState.denoCollection?.find(f => f.key === targetNote.denoId);
        if (denoName) targetNote.denoName = denoName.text;
        targetNote.banknoteQty = newBundleValue;
    } else if (parentContainer.statusId === BSSStatusEnum.Received) {

        // สถานะรับมอบ → อัปเดต note แล้ว call API ทันที
        let oldAdjustQty = targetNote.adjustQty;
        targetNote.adjustQty = (oldAdjustQty + targetNote.remainingQty) - newBundleValue;
        targetNote.remainingQty = newBundleValue;

        const modalElement = document.getElementById('editBankNoteModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        callEditUnsortCCStatusDelivery(targetNote);
        return;
    }

    // --- 4. ปิด Modal และรีเฟรชหน้าจอ ---
    renderUnsortTable(parentContainer);
    const modalElement = document.getElementById('editBankNoteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
}

function deleteUnsortNote(id) {
    tempDeleteData.deleteIds = [id];

    const modal = new bootstrap.Modal(
        document.getElementById('DeleteBankNoteModal')
    );
    modal.show();
}

// ยืนยันการลบธนบัตร
function confirmDeleteBankNote() {
    if (tempDeleteData.deleteIds.length === 0) return;

    const idToDelete = tempDeleteData.deleteIds[0];
    const parentContainer = tableContainerData.find(c => c.id === selectedContainerId);

    const deleteModalElement = document.getElementById('DeleteBankNoteModal');
    const deleteModal = bootstrap.Modal.getInstance(deleteModalElement);
    if (deleteModal) deleteModal.hide();

    // สถานะรับมอบ → call API ทันที
    if (parentContainer?.statusId === BSSStatusEnum.Received) {
        const noteToDelete = parentContainer?.unsortCC?.find(n => n.unsortCCId === idToDelete);
        if (noteToDelete) {
            noteToDelete.isActive = false;
            callEditUnsortCCStatusDelivery(noteToDelete);
        }
        tempDeleteData.deleteIds = [];
        return;
    }

    if (parentContainer && parentContainer.unsortCC) {
        const noteToDelete = parentContainer.unsortCC.find(n => n.unsortCCId === idToDelete);
        if (noteToDelete) {
            // เก็บ backup ไว้กรณี user ไม่กดยืนยัน
            pendingDeleteBankNotes.push({
                unsortCCId: idToDelete,
                containerId: selectedContainerId,
                backup: { isActive: noteToDelete.isActive }
            });

            // mark isActive = false (ยังไม่ลบจริง ส่งไป API ตอนยืนยัน)
            noteToDelete.isActive = false;
        }
    }

    // render โดยกรอง item ที่ isActive = false ออก
    renderUnsortTable(parentContainer);

    // ตรวจสอบว่ามีรายการธนบัตรที่ active อยู่หรือไม่
    const activeNotes = (parentContainer?.unsortCC || []).filter(n => n.isActive !== false);
    const isNewContainer = parentContainer?.statusId == null;

    if (activeNotes.length > 0) {
        isDisabledConfirmRegisterButton(false);
    } else {
        // ภาชนะใหม่ (ยังไม่มีสถานะ) ลบธนบัตรจนหมด → ปิดปุ่มยืนยัน
        // ภาชนะที่มีสถานะแล้ว ลบจนหมดก็ยังกดยืนยันได้
        isDisabledConfirmRegisterButton(isNewContainer);
    }

    tempDeleteData.deleteIds = [];
}

// แก้ไข Container
function editContainer(id) {
    const item = tableContainerData.find(x => x.id === id);
    if (!item) return;

    editingContainerId = id;

    // ตรวจสอบและ set ค่า
    const oldContainerInput = document.getElementById("oldContainer");
    const editContainerInput = document.getElementById("editContainer");

    if (oldContainerInput) {
        oldContainerInput.value = item.container;
    } else {
        console.error("ไม่พบ element: oldContainer");
    }

    if (editContainerInput) {
        editContainerInput.value = item.container;
        editContainerInput.classList.remove('is-invalid');
    } else {
        console.error("ไม่พบ element: editContainer");
    }

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

let tempNewContainer = null;

function updateContainer() {
    if (!editingContainerId) return;

    const newContainer = document.getElementById('editContainer').value.trim();

    // Validation
    if (!newContainer || newContainer === '') {
        const editContainerInput = document.getElementById('editContainer');
        editContainerInput.classList.add('is-invalid');
        return;
    }

    // ตรวจสอบว่าบาร์โค้ดซ้ำหรือไม่
    const isDuplicate = tableContainerData.some(item => 
        item.container === newContainer && item.id !== editingContainerId
    );

    if (isDuplicate) {
        showBarcodeErrorModal('บาร์โค้ดภาชนะนี้มีอยู่ในระบบแล้ว');
        return;
    }

    // เก็บค่าชั่วคราว
    tempNewContainer = newContainer;

    // ปิด edit modal แล้วเปิด confirm modal
    const editModal = bootstrap.Modal.getInstance(
        document.getElementById('editModal')
    );
    if (editModal) {
        editModal.hide();
    }

    setTimeout(() => {
        const confirmModal = new bootstrap.Modal(document.getElementById('ConfirmEditContainerModal'));
        confirmModal.show();
    }, 300);
}

async function confirmUpdateContainer() {
    if (!editingContainerId || !tempNewContainer) {
        return;
    }

    // หา item ใน tableContainerData
    const item = tableContainerData.find(x => x.id === editingContainerId);
    if (!item) {
        return;
    }

    // แก้ไขข้อมูลใน tableContainerData
    item.container = tempNewContainer;

    // ปิด confirm modal
    const confirmModal = bootstrap.Modal.getInstance(
        document.getElementById('ConfirmEditContainerModal')
    );
    if (confirmModal) {
        confirmModal.hide();
    }

    // ถ้าสถานะเป็น รับมอบ ให้ call API ทันทีแล้ว reload page
    if (item.statusId === BSSStatusEnum.Received) {
        try {
            const response = await fetch('/PrePreparationUnsort/EditRegisterUnsortContainer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const result = await response.json();
            if (result && result.is_success) {
                location.reload();
            } else {
                showBarcodeErrorModal(result?.msg_desc || 'เกิดข้อผิดพลาดในการอัปเดตบาร์โค้ด');
            }
        } catch (e) {
            showBarcodeErrorModal('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        editingContainerId = null;
        tempNewContainer = null;
        return;
    }

    // ถ้าภาชนะที่แก้ไขคือภาชนะที่เลือกอยู่ ให้อัปเดต input field
    if (selectedContainerId === editingContainerId) {
        const scanInput = document.getElementById('txtScanContainerCode');
        if (scanInput) {
            scanInput.value = tempNewContainer;
        }
        updateSelectedContainerTitle(tempNewContainer);
    }

    // รีเฟรชตาราง
    renderContainerTable();

    // รีเซ็ต
    editingContainerId = null;
    tempNewContainer = null;
}

async function ConfirmRegisterUnsort() {
    // validate: ได้รับอนุญาตให้ส่งข้อมูลแม้ตารางจะว่าง (ลบรายการจนหมด)
    let selectRegisterUnsort = tableContainerData.find(i => i.id === selectedContainerId);
    if (!selectRegisterUnsort && !pendingDeleteContainer) {
        showBarcodeErrorModal('กรุณาเลือกภาชนะก่อน');
        return;
    }

    // แสดง confirm dialog ก่อนดำเนินการ
    const modal = new bootstrap.Modal(document.getElementById('confirmRegisterUnsortModal'));
    modal.show();
}

async function doConfirmRegisterUnsort() {
    // ปิด confirm modal
    const confirmModalEl = document.getElementById('confirmRegisterUnsortModal');
    const confirmModal = bootstrap.Modal.getInstance(confirmModalEl);
    if (confirmModal) confirmModal.hide();

    try {
        let createRegisterUnsortResponse = undefined;

        // ลบภาชนะ (isActive = false) ส่งไป API
        if (pendingDeleteContainer) {
            const item = tableContainerData.find(x => x.id === pendingDeleteContainer.id);
            if (item) {
                createRegisterUnsortResponse = await createRegisterUnsort(item);
            }
            pendingDeleteContainer = null;
        }

        // ยืนยัน register unsort (รวมธนบัตรที่ isActive = false ด้วย)
        let selectRegisterUnsort = tableContainerData.find(i => i.id === selectedContainerId);
        if (selectRegisterUnsort) {
            const latestBarcode = document.getElementById('txtScanContainerCode')?.value?.trim();
            if (latestBarcode) selectRegisterUnsort.container = latestBarcode;
            createRegisterUnsortResponse = await createRegisterUnsort(selectRegisterUnsort);
        }

        pendingDeleteBankNotes = [];
        if (createRegisterUnsortResponse) {
            if (createRegisterUnsortResponse?.is_success) {

                // show print dialog ถ้าเป็นสถานะ รับมอบ
                if (createRegisterUnsortResponse.data.statusId === BSSStatusEnum.Received) {

                    // clear selected item on table
                    selectedContainerId = undefined;

                    await loadRegisterUnsorts();
                    setFormToStep1();
                    await isDisabledConfirmRegisterButton(true);
                    printContainer(createRegisterUnsortResponse.data.registerUnsortId);
                } else {
                    // แสดง success modal ก่อน reload
                    setTimeout(() => {
                        const successModal = new bootstrap.Modal(document.getElementById('registerUnsortSuccessModal'));
                        successModal.show();
                    }, 300);
                }

            } else {
                showBarcodeErrorModal(createRegisterUnsortResponse.msg_desc);
            }
        }

    } catch (err) {
        console.error('ConfirmRegisterUnsort failed:', err);
    }
}

async function createRegisterUnsort(selectRegisterUnsort) {
    // สร้าง payload ตาม backend model ConfirmRegisterUnsortRequest
    const src = selectRegisterUnsort;
    const payload = {
        id: (src.id != null && src.id >= 0) ? src.id : null,
        container: src.container || '',
        statusId: src.statusId || 0,
        statusNameTh: src.status || '',
        remark: src.remark || '',
        isActive: src.isActive !== false,
        unsortCC: (src.unsortCC || []).filter(n => !((n.unsortCCId == null || n.unsortCCId < 0) && n.isActive === false)).map(n => ({
            unsortCCId: (n.unsortCCId != null && n.unsortCCId >= 0) ? n.unsortCCId : null,
            registerUnsortId: (src.id != null && src.id >= 0) ? src.id : 0,
            instId: n.instId || 0,
            instNameTh: n.instNameTh || '',
            denoId: n.denoId || 0,
            denoName: n.denoName || '',
            banknoteQty: n.banknoteQty || 0,
            remainingQty: n.remainingQty || 0,
            adjustQty: n.adjustQty || 0,
            isActive: n.isActive !== false
        }))
    };

    $.enablePageLoader();
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PrePreparationUnsort/ConfirmRegisterUnsort',
            type: 'POST',
            parameter: payload,
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

function printContainer(registerUnsortId) {

    const url = `/Report/RegisterUnsortCC?registerUnsortId=${registerUnsortId}`;
    const title = 'PrintWindow';

    // กำหนดขนาดหน้าต่างที่ต้องการ
    const w = 1100;
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

function deleteContainer(id) {
    tempDeleteData.deleteIds = [id];

    const modal = new bootstrap.Modal(
        document.getElementById('DeleteModal')
    );
    modal.show();
}

async function confirmDelete() {
    if (tempDeleteData.deleteIds.length === 0) return;

    const idToDelete = tempDeleteData.deleteIds[0];
    const item = tableContainerData.find(x => x.id === idToDelete);
    if (!item) return;

    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('DeleteModal'));
    if (deleteModal) deleteModal.hide();

    if (item.id < 0) {
        // ภาชนะใหม่ที่ยังไม่ได้ save → ลบออกจาก array เลย ไม่ต้องส่ง API
        const index = tableContainerData.findIndex(x => x.id === idToDelete);
        if (index > -1) tableContainerData.splice(index, 1);

        if (selectedContainerId === idToDelete) {
            selectedContainerId = null;
            const scanInput = document.getElementById('txtScanContainerCode');
            if (scanInput) {
                scanInput.disabled = false;
                scanInput.value = '';
                scanInput.classList.remove('is-valid', 'is-invalid');
            }
            unlockContainerTable();
        }

        renderContainerTable();
        renderUnsortTable();
        isDisabledAddUnsortCC(true);
        isDisabledConfirmRegisterButton(true);
        tempDeleteData.deleteIds = [];
        setFormToStep1();
        return;
    }

    // สถานะรับมอบ → call API ทันที เหมือน edit
    if (item.statusId === BSSStatusEnum.Received) {
        item.isActive = false;
        try {
            const response = await fetch('/PrePreparationUnsort/EditRegisterUnsortContainer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const result = await response.json();
            if (result && result.is_success) {
                location.reload();
            } else {
                item.isActive = true;
                showBarcodeErrorModal(result?.msg_desc || 'เกิดข้อผิดพลาดในการลบ');
            }
        } catch (e) {
            item.isActive = true;
            showBarcodeErrorModal('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        tempDeleteData.deleteIds = [];
        return;
    }

    // ภาชนะเก่า → เก็บ backup ไว้กรณี user ไม่กดยืนยัน
    pendingDeleteContainer = { id: idToDelete, backup: { isActive: item.isActive } };

    // mark isActive = false (ยังไม่ลบจริง ส่งไป API ตอนยืนยัน)
    item.isActive = false;

    if (selectedContainerId === idToDelete) {
        selectedContainerId = null;
    }

    renderContainerTable();
    renderUnsortTable();

    // เปิดปุ่มยืนยัน
    isDisabledConfirmRegisterButton(false);

    tempDeleteData.deleteIds = [];
}

function closeAllModals() {
    const modals = ['deleteSuccessModal', 'DeleteModal', 'DeleteBankNoteModal', 'editModal', 'editBankNoteModal', 'editSuccessModal', 'ConfirmEditContainerModal', 'ConfirmEditBankNoteModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    });

    // รีเซ็ตหลังจากปิด modal แล้ว
    setTimeout(() => {
        resetEditModal();
        resetEditBankNoteModal();
        clearTempData();
    }, 500);
}

function resetEditModal() {
    const oldContainer = document.getElementById("oldContainer");
    const editContainer = document.getElementById("editContainer");

    if (oldContainer) oldContainer.value = '';
    if (editContainer) {
        editContainer.value = '';
        editContainer.classList.remove('is-invalid', 'is-valid');
    }
}

function resetEditBankNoteModal() {
    editingBankNoteId = null;
}

function clearTempData() {
    tempDeleteData = {
        deleteIds: [],
    };
}

async function callEditUnsortCCStatusDelivery(noteObject) {
    try {
        const response = await fetch('/PrePreparationUnsort/EditUnsortCCStatusDelivery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteObject)
        });
        const result = await response.json();
        console.log('EditUnsortCCStatusDelivery response:', result);
        if (result && result.is_success) {
            location.reload();
        } else {
            showBarcodeErrorModal(result?.msg_desc || 'เกิดข้อผิดพลาด');
            await loadRegisterUnsorts();
            renderUnsortTable(tableContainerData?.find(i => i.id === selectedContainerId));
        }
    } catch (e) {
        showBarcodeErrorModal('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        await loadRegisterUnsorts();
        renderUnsortTable(tableContainerData?.find(i => i.id === selectedContainerId));
    }
}

const bankSelect = document.getElementById('bankName');
if (bankSelect) {
    bankSelect.addEventListener('change', function () {
        if (this.value !== "") {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid'); // เลือกแล้วให้เป็นสีเขียว
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid'); // ถ้าเลือกกลับเป็น "เลือกธนาคาร" ให้กลับมาแดง
        }
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


async function setupDropdownsInstitution() {

    const departmentId = currentDepartmentId || 0;
    const request = { tableName: "MasterInstitutionWithCompany", operator: "OR", searchCondition: [], selectItemCount: 200, includeData: false, departmentId: departmentId };
    const responseBank = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', request);
    pageState.bankCollection = responseBank.data.map(x => ({ id: x.key, name: x.text, code: x.value }));

    renderDropdown({
        selectId: 'bankName',
        items: pageState.bankCollection,
        includeEmpty: true
    });

    initSelect2Normal('#bankName', dropDownEmptyText, async (val) => {
        pageState.selected.bankId = Number(val || 0);
        pageState.currentBank = (pageState.bankCollection || [])
            .find(x => Number(x.id) === pageState.selected.bankId) || null;
    });
}

async function setupRadioDenomination() {

    const departmentId = currentDepartmentId || 0;
    const requestDeno = { tableName: "MasterDenomination", operator: "OR", searchCondition: [], selectItemCount: 200, includeData: false, departmentId: departmentId };

    const responseDeno = await getDropdownData('Dropdown/GetMasterDropdownData', 'POST', requestDeno);
    pageState.denoCollection = responseDeno.data;

    const container = document.getElementById('banknoteContainer');
    container.innerHTML = '';

    pageState.denoCollection
        .sort((a, b) => b.value - a.value)
        .forEach((item, index) => {
            if (item.text == '20' ||
                item.text == '50' ||
                item.text == '100' ||
                item.text == '500' ||
                item.text == '1000') {
                container.innerHTML += `
                <label class="btn rounded-3 px-2 me-2" style="opacity:0.5;pointer-events:none;">
                    <input
                        type="radio"
                        name="noteType"
                        value="${item.value}"
                        disabled
                        ${index === 0 ? 'checked' : ''}
                    />
                    <span class="qty-badge qty-${item.text}">
                        ${item.text}
                    </span>
                </label>
            `;
            }
        });

    const banknoteRadios = document.getElementsByName("noteType");
    // banknoteRadios[0].checked = true;   // เลือกตัวแรก

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

async function loadRegisterUnsorts() {
    try {

        const response = await getRegisterUnsortsAsync();
        if (response != null && response?.is_success && response?.data != null) {
            const items = response?.data || [];
            const totalCount = items.length;

            pageState.registerUnsortsCollection = response?.data || [];
            if (items != null && items.length > 0) {
                tableContainerData = mapApiToData(items);
                renderContainerTable();
            }
        }

    } catch (err) {
        showBarcodeErrorModal("โหลดข้อมูลไม่สำเร็จ");
    }
}

function getRegisterUnsortsAsync() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PrePreparationUnsort/LoadRegisterUnsortList',
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

function mapApiToData(items) {

    return (items || []).map(x => ({
        id: x.registerUnsortId ?? 0,
        container: x.containerCode ?? '',
        date: formatDateThai(x.createdDate),
        remark: x.remark ?? '-',
        statusId: x.statusId,
        status: x.statusNameTh ?? '',
        canEdit: x.canEdit,
        canPrint: x.canPrint,
        canDelete: x.canDelete,
        isActive: x.isActive,
        unsortCC: x.unsortCC ?? []
    }));
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

function lockContainerTable() {
    const table = document.getElementById("tableContainer");
    table.style.pointerEvents = "none";
    // table.style.opacity = "0.6";
}

function unlockContainerTable() {
    const table = document.getElementById("tableContainer");
    table.style.pointerEvents = "auto";
    table.style.opacity = "1";
}

function lockContainerRowByCode(containerCode) {

    const row = document.querySelector(`#tableContainer tr[id="${containerCode}"]`);

    if (!row) return;

    row.classList.add('locked-row');

    row.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
}