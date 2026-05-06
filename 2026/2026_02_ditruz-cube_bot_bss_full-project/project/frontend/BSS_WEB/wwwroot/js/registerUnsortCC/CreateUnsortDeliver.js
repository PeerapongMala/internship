let mocWaybill = [
    {
        id: 1, waybill: 'UCC256XXXXXX1', dateWaybil: '-', remark: '-', status: 'สร้างใบนำส่ง',
        container: [
            {
                id: 1, container: 'PPL1001', date: '10/09/2568', status: 'ลงทะเบียน',
                details: [
                    { bank: 'ธ.กรุงไทย', banknote: 1000, bundle: 10, regisDate: '10/09/2568' },
                    { bank: 'ธ.กสิกร', banknote: 500, bundle: 5, regisDate: '10/09/2568' },
                    { bank: 'ธ.ไทยพาณิชย์', banknote: 1000, bundle: 5, regisDate: '10/09/2568' },
                    { bank: 'ธ.ไทยพาณิชย์', banknote: 50, bundle: 5, regisDate: '10/09/2568' },
                    { bank: 'ธ.กสิกร', banknote: 20, bundle: 5, regisDate: '10/09/2568' },
                    { bank: 'ธ.ไทยพาณิชย์', banknote: 100, bundle: 5, regisDate: '10/09/2568' },
                    { bank: 'ธ.กสิกร', banknote: 1000, bundle: 5, regisDate: '10/09/2568' }
                ]
            },
            {
                id: 2, container: 'PPP1002', date: '10/09/2568', status: 'ลงทะเบียน',
                details: [{ bank: 'ธ.กรุงไทย', banknote: 500, bundle: 20, regisDate: '10/09/2568' }]
            },
            {
                id: 3, container: 'PPP1003', date: '10/09/2568', status: 'ลงทะเบียน',
                details: [{ bank: 'ธ.กรุงไทย', banknote: 20, bundle: 10, regisDate: '11/09/2568' }]
            },
            {
                id: 4, container: 'PPP1004', date: '10/09/2568', status: 'ลงทะเบียน',
                details: [{ bank: 'ธ.กรุงไทย', banknote: 50, bundle: 10, regisDate: '11/09/2568' }]
            },
            {
                id: 5, container: 'PPP1005', date: '10/09/2568', status: 'ลงทะเบียน',
                details: [{ bank: 'ธ.กรุงไทย', banknote: 500, bundle: 10, regisDate: '11/09/2568' }]
            },
            {
                id: 6, container: 'PPP1006', date: '12/09/2568', status: 'ลงทะเบียน',
                details: [{ bank: 'ธ.กรุงไทย', banknote: 100, bundle: 10, regisDate: '11/09/2568' }]
            }
        ]
    }
];

let currentTableData = [];
let currentContainers = [];
let activeContainerId = null;
let selectedContainerIds = new Set(); // เก็บ ID ของ container ที่เลือก
let lastDeliveryCode = localStorage.getItem('lastDeliveryCode'); // อ่านรหัสเก่าจาก localStorage

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        initComponent();
    }, 100);
});

async function initComponent() {
    setupEventListeners();
    await loadInitialDeliveryCode();
    initDateRangePicker();
}

function setupEventListeners() {
    const ddlContainer = document.getElementById('ddlContainer');
    const chkAll = document.getElementById('checkAll');

    if (ddlContainer) {
        ddlContainer.addEventListener('change', executeMultiFilter);
    }

    if (chkAll) {
        chkAll.onclick = function () { toggleSelectAll(this); };
    }
}

async function loadInitialDeliveryCode() {
    const deliveryCode = await getInitialDeliveryCode();
    const txtCode = document.getElementById('txtDeliveryCode');
    if (txtCode) {
        txtCode.value = deliveryCode;
    }
}

// ========== Date Picker ==========

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

function getDateRangeISO() {
    const startDate = parseThaiDate(document.getElementById('filterDateStart')?.value);
    const endDate = parseThaiDate(document.getElementById('filterDateEnd')?.value);

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
                const oneMonthLater = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
                const currentEnd = parseThaiDate(endEl.value);
                let newEnd = (currentEnd && selectedDate <= currentEnd) ? currentEnd : new Date(selectedDate);
                if (newEnd > oneMonthLater) {
                    newEnd = oneMonthLater;
                }
                endEl.value = formatThaiDate(newEnd);
            }
            loadRegisterUnsortData();
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
                if (newStart < oneMonthBefore) {
                    newStart = oneMonthBefore;
                }
                startEl.value = formatThaiDate(newStart);
            }
            loadRegisterUnsortData();
        }
    });

    // เรียก API ครั้งแรก
    loadRegisterUnsortData();
}

function resetDateToNow() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const startEl = document.getElementById('filterDateStart');
    const endEl = document.getElementById('filterDateEnd');
    if (startEl) startEl.value = formatThaiDate(oneMonthAgo);
    if (endEl) endEl.value = formatThaiDate(now);
    loadRegisterUnsortData();
}

// โหลดข้อมูลจาก API
function loadRegisterUnsortData() {
    const dates = getDateRangeISO();
    $.requestAjax({
        service: 'TransactionSendUnsortCC/LoadRegisterUnsort',
        type: 'POST',
        enableLoader: true,
        parameter: {
            startDate: dates.startDate,
            endDate: dates.endDate
        },
        onSuccess: function (result) {
            if (result.is_success && result.data && result.data.registerUnsort) {
                // แปลงรูปแบบข้อมูลจาก API ให้เข้ากับโครงสร้างเดิม
                currentContainers = result.data.registerUnsort.map(item => ({
                    id: item.registerUnsortId,
                    container: item.containerCode,
                    date: formatDateTime(item.createdDate),
                    status: item.statusNameTh,
                    details: item.unsortCC.map(unsort => ({
                        bank: unsort.instNameTh,
                        banknote: unsort.denoName,
                        bundle: unsort.banknoteQty,
                        regisDate: formatDateTime(item.createdDate)
                    }))
                }));

                populateDropdowns(currentContainers);
                renderTableData(currentContainers);
            } else {
                renderTableData([]);
                renderEmptyDetail();
            }
        }
    });
}

// ฟังก์ชันแปลงวันที่เป็น format dd/MM/yyyy hh:mm (พ.ศ.)
function formatDateTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;  // แปลงเป็น พ.ศ.
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// ดึง Delivery Code จาก API
async function getInitialDeliveryCode() {
    try {
        // สร้าง URL พร้อมกับ query parameter oldDeliveryCode ถ้ามี
        let url = '/TransactionSendUnsortCC/GetNewDeliveryCode';
        if (lastDeliveryCode) {
            url += '?oldDeliveryCode=' + encodeURIComponent(lastDeliveryCode);
        }

        const response = await fetch(url, {
            method: 'GET'
        });
        const result = await response.json();
        
        if (result.is_success && result.data) {
            lastDeliveryCode = result.data; // เก็บรหัสปัจจุบัน
            localStorage.setItem('lastDeliveryCode', result.data); // บันทึกลง localStorage
            return result.data;
        } else {
            console.error('Failed to get delivery code:', result.msg_desc);
            return null;
        }
    } catch (error) {
        console.error('Error fetching delivery code:', error);
        return null;
    }
}

// เติมข้อมูลใน Dropdowns
function populateDropdowns(containers) {
    const ddlContainer = document.getElementById('ddlContainer');

    if (ddlContainer) {
        ddlContainer.innerHTML = '<option value="">-- ทั้งหมด --</option>';
        const uniqueContainers = [...new Set(containers.map(item => item.container))];
        uniqueContainers.forEach(c => {
            ddlContainer.innerHTML += `<option value="${c}">${c}</option>`;
        });
        ddlContainer.disabled = false;
    }
}

// กรองข้อมูลตาม Dropdown ที่เลือก
function executeMultiFilter() {
    const containerFilter = document.getElementById('ddlContainer').value;

    const filtered = currentContainers.filter(item => {
        const matchContainer = containerFilter === "" || item.container === containerFilter;
        return matchContainer;
    });

    renderTableData(filtered);

    // ซ่อน detail section ถ้าภาชนะที่เลือกไว้ไม่อยู่ในรายการที่กรองแล้ว
    const detailSection = document.getElementById('detailSection');
    if (activeContainerId !== null) {
        const isStillVisible = filtered.some(item => item.id === activeContainerId);
        if (!isStillVisible) {
            if (detailSection) detailSection.style.display = 'none';
            activeContainerId = null;
        }
    }
}

// แสดงข้อมูลในตารางภาชนะ
function renderTableData(data = []) {
    currentTableData = data;
    const tbody = document.getElementById('createTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">ไม่พบข้อมูลรายการภาชนะ</td></tr>';
        toggleConfirmButton(false);
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.style.cursor = "pointer";
        row.onclick = () => showContainerDetail(item.id);

        const isChecked = selectedContainerIds.has(item.id);
        if (isChecked) row.classList.add('active-row');
        row.innerHTML = `
            <td class="text-center" style="vertical-align: middle;">
                <input type="checkbox" class="container-checkbox" value="${item.id}" 
                       ${isChecked ? 'checked' : ''}
                       onchange="handleCheckboxChange(this)" onclick="event.stopPropagation();"
                       style="cursor: pointer; display: block; margin: 0 auto;">
            </td>
            <td style="vertical-align: middle;">${item.container}</td>
            <td style="vertical-align: middle;">${item.date}</td>
            <td class="text-center" style="vertical-align: middle;">${renderStatusBadge(item.status)}</td>
        `;
        tbody.appendChild(row);
    });

    updateSelectAllCheckbox();
    checkSelection();
}

// สร้าง Badge แสดงสถานะ
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

// สร้าง Badge แสดงชนิดธนบัตร
function renderBanknoteBadge(price) {
    let cssClass = "qty-badge";
    const p = parseInt(price);
    if (p === 1000) cssClass = "qty-1000";
    else if (p === 500) cssClass = "qty-500";
    else if (p === 100) cssClass = "qty-100";
    else if (p === 50) cssClass = "qty-50";
    else if (p === 20) cssClass = "qty-20";
    return `<span class="${cssClass}">${p.toLocaleString()}</span>`;
}

// แสดงรายละเอียดภาชนะที่เลือก
function showContainerDetail(containerId) {
    const detailSection = document.getElementById('detailSection');
    const detailTbody = document.getElementById('detailTableBody');
    const totalSumLabel = document.getElementById('totalBundleSum');

    activeContainerId = containerId;

    const item = currentContainers.find(c => c.id === containerId);

    if (!item || !item.details || item.details.length === 0) {
        renderEmptyDetail('ไม่พบข้อมูลรายการธนบัตร');
        return;
    }

    detailTbody.innerHTML = '';
    let totalBundles = 0;

    item.details.forEach(detail => {
        totalBundles += parseInt(detail.bundle || 0);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center">${detail.bank || '-'}</td>
            <td class="text-center">${renderBanknoteBadge(detail.banknote)}</td>
            <td class="text-center">${detail.bundle || 0}</td>
            <td class="text-center">${detail.regisDate || item.date}</td>
        `;
        detailTbody.appendChild(row);
    });

    if (totalSumLabel) totalSumLabel.textContent = totalBundles.toLocaleString();
    detailSection.style.display = 'block';

    const scrollDiv = document.getElementById('tableBodyScroll');
    if (scrollDiv) scrollDiv.scrollTop = 0;
}

// แสดงข้อความเมื่อไม่มีข้อมูลรายละเอียด
function renderEmptyDetail(message = 'กรุณาเลือกภาชนะเพื่อแสดงข้อมูล') {
    const detailTbody = document.getElementById('detailTableBody');
    const totalSumLabel = document.getElementById('totalBundleSum');

    detailTbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted py-4">
                ${message}
            </td>
        </tr>
    `;

    if (totalSumLabel) totalSumLabel.textContent = '0';
}

// จัดการการเปลี่ยนแปลง checkbox
function handleCheckboxChange(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        selectedContainerIds.add(parseInt(checkbox.value));
        row.classList.add('active-row');
    } else {
        selectedContainerIds.delete(parseInt(checkbox.value));
        row.classList.remove('active-row');
    }
    checkSelection();
}

// ตรวจสอบว่ามีการเลือก checkbox หรือไม่
function checkSelection() {
    const selectedCount = document.querySelectorAll('.container-checkbox:checked').length;
    toggleConfirmButton(selectedCount > 0);
}

// เปิด/ปิดปุ่มยืนยัน
function toggleConfirmButton(isEnabled) {
    const btnConfirm = document.getElementById('btnConfirm');
    if (btnConfirm) btnConfirm.disabled = !isEnabled;
}

// เลือก/ยกเลิกเลือกทั้งหมด
function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll('.container-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = source.checked;
        if (source.checked) {
            selectedContainerIds.add(parseInt(cb.value));
        } else {
            selectedContainerIds.delete(parseInt(cb.value));
        }
    });
    checkSelection();
}

// อัปเดต checkbox "เลือกทั้งหมด" ตามจำนวน checkbox ที่เลือก
function updateSelectAllCheckbox() {
    const checkAll = document.getElementById('checkAll');
    if (!checkAll) return;

    const checkboxes = document.querySelectorAll('.container-checkbox');
    const checkedCount = document.querySelectorAll('.container-checkbox:checked').length;

    if (checkboxes.length === 0) {
        checkAll.checked = false;
    } else if (checkedCount === checkboxes.length) {
        checkAll.checked = true;
    } else {
        checkAll.checked = false;
    }
}

// แสดง Modal ยืนยันการสร้างใบนำส่ง
function confirmCreateDelivery() {
    const selectedCheckboxes = document.querySelectorAll('.container-checkbox:checked');
    if (selectedCheckboxes.length === 0) return;

    const confirmModal = new bootstrap.Modal(document.getElementById('DeleteModal'));
    confirmModal.show();
}

// ยืนยันสร้างใบนำส่ง
async function confirmCreateDeliverySubmit() {
    const deleteModalElement = document.getElementById('DeleteModal');
    const deleteModal = bootstrap.Modal.getInstance(deleteModalElement);
    deleteModal.hide();

    // เก็บข้อมูลที่จำเป็น
    const deliveryCode = document.getElementById('txtDeliveryCode').value;
    const selectedCheckboxes = document.querySelectorAll('.container-checkbox:checked');
    
    const registerUnsortIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

    if (!deliveryCode || registerUnsortIds.length === 0) {
        console.error('Invalid data for API call');
        return;
    }

    // สร้าง JSON body
    const payload = {
        deliveryCode: deliveryCode,
        registerUnsortId: registerUnsortIds
    };

    try {
        // Call API
        const response = await fetch('/TransactionSendUnsortCC/CreateSendUnsort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!result.is_success && result.msg_code === '409') {
            // รหัสใบนำส่งซ้ำ - แสดง confirm dialog
            showDuplicateDeliveryCodeDialog();
        } else if (result.is_success) {
            // สำเร็จ - แสดง success modal และ redirect
            const successModal = new bootstrap.Modal(document.getElementById('commonSuccessModal'));
            document.getElementById('successModalMessage').innerText = "สร้างใบนำส่งเรียบร้อยแล้ว";
            successModal.show();
        } else {
            // Error อื่นๆ
            console.error('API Error:', result.msg_desc);
            alert('เกิดข้อผิดพลาด: ' + result.msg_desc);
        }
    } catch (error) {
        console.error('Error calling API:', error);
        alert('เกิดข้อผิดพลาดในการสร้างใบนำส่ง');
    }
}

// แสดง Dialog สำหรับรหัสใบนำส่งที่ซ้ำ
function showDuplicateDeliveryCodeDialog() {
    if (!document.getElementById('duplicateDeliveryCodeModal')) {
        // สร้าง Modal ใหม่ถ้ายังไม่มี
        const modalHTML = `
            <div class="modal fade" id="duplicateDeliveryCodeModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-5">
                            <div class="mb-4">
                                <div style="width: 100px; height: 100px; margin: 0 auto; border: 4px solid #ff9800; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 60px;"></i>
                                </div>
                            </div>
                            <h3 class="text-black fw-bold mb-3">รหัสใบนำส่งนี้มีอยู่แล้ว</h3>
                            <h6 class="text-muted mb-4">คุณต้องการสร้างรหัสใบนำส่งใหม่ ?</h6>
                        </div>
                        <div class="modal-footer d-flex justify-content-center gap-2">
                            <button class="btn btn-secondary px-4" data-bs-dismiss="modal">ยกเลิก</button>
                            <button class="btn btn-warning px-4" onclick="generateNewDeliveryCode()">สร้างรหัสใหม่</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = new bootstrap.Modal(document.getElementById('duplicateDeliveryCodeModal'));
    modal.show();
}

// สร้างรหัสใบนำส่งใหม่
async function generateNewDeliveryCode() {
    const duplicateModal = bootstrap.Modal.getInstance(document.getElementById('duplicateDeliveryCodeModal'));
    if (duplicateModal) {
        duplicateModal.hide();
    }

    try {
        const response = await fetch('/TransactionSendUnsortCC/GetNewDeliveryCode', {
            method: 'GET'
        });
        const result = await response.json();

        if (result.is_success && result.data) {
            // อัปเดต txtDeliveryCode ด้วยรหัสใหม่
            const txtCode = document.getElementById('txtDeliveryCode');
            if (txtCode) {
                txtCode.value = result.data;
                lastDeliveryCode = result.data;
                localStorage.setItem('lastDeliveryCode', result.data);
            }
            
            // เคลียร์ selection ทั้งหมด
            selectedContainerIds.clear();

            // รีเซ็ต filter dropdowns
            const ddlContainer = document.getElementById('ddlContainer');
            const checkAll = document.getElementById('checkAll');

            if (ddlContainer) ddlContainer.value = '';
            if (checkAll) checkAll.checked = false;
            
            // ซ่อน detail section
            const detailSection = document.getElementById('detailSection');
            if (detailSection) detailSection.style.display = 'none';
            activeContainerId = null;
            
            // โหลดข้อมูลตารางใหม่เพราะว่าข้อมูลอาจถูก user อื่นนำไปใช้แล้ว
            loadRegisterUnsortData();
        } else {
            console.error('Failed to generate new delivery code:', result.msg_desc);
            alert('ไม่สามารถสร้างรหัสใบนำส่งใหม่ได้');
        }
    } catch (error) {
        console.error('Error generating new delivery code:', error);
        alert('เกิดข้อผิดพลาดในการสร้างรหัสใหม่');
    }
}

// หลังจากสำเร็จแล้ว
function onSuccessDone() {
    // เคลียร์ข้อมูล selection
    selectedContainerIds.clear();

    // ลบ lastDeliveryCode ออกจาก localStorage ก่อน redirect
    localStorage.removeItem('lastDeliveryCode');

    // กลับไปหน้า RegisterUnsortDeliver
    goBack();
}

// กลับไปหน้าก่อนหน้า
function goBack() {
    window.location.href = '/PrePreparationUnsort/RegisterUnsortDeliver';
}