// ตัวแปรหลักที่จะเก็บข้อมูลทั้งหมดที่โหลดมาครั้งแรก
let allUnsortData = [];

// ตัวแปรสำหรับรายการที่กำลังเลือกแสดงผลในตารางรายละเอียด
let currentContainerList = [];


document.addEventListener("DOMContentLoaded", async () => {

    $("#pageloading").fadeOut();

    setTimeout(async () => {
        await initComponent();
    }, 100);
    startRealTimeClock();

    // ตั้งค่า Event Listener สำหรับ Modal ทั้งหมดในหน้าจอเพื่อแก้ปัญหา aria-hidden
    setupModalFocusFix();

    const input = document.getElementById('deliveryInput');

    // โฟกัสที่ช่อง input ทันทีที่เปิดหน้าจอ (เพื่อพร้อมรับการสแกน)
    input.focus();


    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            playScannerAlarm();

            $('#containerListBody').html('');
            //$('#deliveryInput').val('');
            //$('#afterScanInfo').addClass('d-none'); // ซ่อนข้อมูลเดิม
            //$('#dvBtnExecute').addClass('d-none'); // ซ่อนปุ่ม
            $('#dvBtnExecute button').prop('disabled', true);
            $('#deliveryInput').focus();

            document.getElementById('senderName').innerText = "";
            $('#containerListBody').html('');

            const barcode = this.value.trim();

            // ✅ Validate: a-z, A-Z หรือ 0-9 เท่านั้น
            if (!/^[A-Za-z0-9]+$/.test(barcode)) {
                showErrorModal(`รหัสใบนำส่ง ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น`, false);
                handleBarcode();
                return;
            }

            $("#pageloading").fadeIn();

            if (barcode !== "") {
                console.log("กำลังค้นหาข้อมูลของ:", barcode);

                processDeliveryScan(barcode);

                //setTimeout(async () => {
                //    await initComponent(false);
                //}, 100);
            } else {
                // --- กรณีเป็นค่าว่าง ให้ใส่ class d-none กลับคืน ---
                console.log("ช่องสแกนว่างเปล่า - ซ่อนข้อมูล");

                // ซ่อนข้อมูล Supervisor มุมขวา
                /*const infoSection = document.getElementById('afterScanInfo');
                if (infoSection) {
                    infoSection.classList.add('d-none');
                    infoSection.classList.remove('d-flex');
                }*/

                // ซ่อนปุ่มกด รับมอบ/ไม่รับมอบ
                /*const dvBtnExecute = document.getElementById('dvBtnExecute');
                if (dvBtnExecute) {
                    dvBtnExecute.classList.add('d-none');
                    dvBtnExecute.classList.remove('d-flex', 'flex-column');
                }*/
                $('#dvBtnExecute button').prop('disabled', true);

                // (ทางเลือก) รีเซ็ตสถานะกลับเป็นค่าเริ่มต้น
                $('#overallStatusBadge').html('-');

                initComponent(true);
            }
        }
    });

    $('#newUnPrepare').on('focus', function () {
        $(this).select();
    });

});

const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;

// --- ฟังก์ชันแก้ปัญหา aria-hidden และ Focus Error ---
function setupModalFocusFix() {
    // เมื่อ Modal กำลังจะปิด ให้ถอน Focus ออกจาก Element ที่ถือ Focus อยู่ทันที
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hide.bs.modal', () => {
            if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
            }
        });
    });
}


async function initComponent(isClear = false) {
    if (isClear) {
        // ล้างสถานะ
        $('#overallStatusBadge').html('-');

        // ล้างข้อมูลในตารางทั้งหมดให้ว่างเปล่า
        $('#containerListBody').html('');
        //$('#receiveDeliveryTableBody').html('');
        //$('#deliveryDataBody').html('');
        //$('#chooseContainerBody').html('');
        //return; // จบการทำงาน
    }

    //const initialStatus = renderStatusBadge('ส่งมอบ');
    //$('#overallStatusBadge').html(initialStatus);

    //renderTable();
    renderHistoryTable();
    //renderDeliveryDataTable();
    //renderChooseContainerTable();
}

let mocContainer = [
    { barcode: 'PPP1005', qty: 15 },
    { barcode: 'PPP1006', qty: 10 },
    { barcode: 'PPP1007', qty: 20 },

    { barcode: 'PPP1005', qty: 15 },
    { barcode: 'PPP1006', qty: 10 },
    { barcode: 'PPP1007', qty: 20 },
    { barcode: 'PPP1005', qty: 15 },
    { barcode: 'PPP1006', qty: 10 },
    { barcode: 'PPP1007', qty: 20 },
];

let mocReceiveDelivery = [
    { id: 1, code: 'UCC2568010025', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 2, code: 'UCC2568010024', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 3, code: 'UCC2568010023', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 4, code: 'UCC2568010022', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 5, code: 'UCC2568010021', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: 'แก้ไขจำนวนมัดใหม่', status: 'ส่งคืน' },
    { id: 6, code: 'UCC2568010020', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: 'แก้ไขจำนวนมัดใหม่', status: 'ส่งคืน' },

    { id: 3, code: 'UCC2568010023', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 4, code: 'UCC2568010022', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 3, code: 'UCC2568010023', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 4, code: 'UCC2568010022', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 3, code: 'UCC2568010023', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 4, code: 'UCC2568010022', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 3, code: 'UCC2568010023', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
    { id: 4, code: 'UCC2568010022', datesend: '21/07/2568 14:00', daterecive: '21/07/2568 14:00', remark: '-', status: 'รับมอบ' },
];

let mocContainerIsChoose = [
    { id: 1, bankName: 'ธ.กรุงเทพ', priceType: 1000, unPrepare: 10, prepare: 10 },
    { id: 2, bankName: 'ธ.กรุงเทพ', priceType: 500, unPrepare: '-', prepare: 20 },
    { id: 3, bankName: 'ธ.กรุงเทพ', priceType: 100, unPrepare: 20, prepare: 10 },
    { id: 4, bankName: 'ธ.กรุงเทพ', priceType: 50, unPrepare: 10, prepare: '-' },

    { id: 1, bankName: 'ธ.กรุงเทพ', priceType: 1000, unPrepare: 10, prepare: 10 },
    { id: 2, bankName: 'ธ.กรุงเทพ', priceType: 500, unPrepare: '-', prepare: 20 },
    { id: 3, bankName: 'ธ.กรุงเทพ', priceType: 100, unPrepare: 20, prepare: 10 },
    { id: 4, bankName: 'ธ.กรุงเทพ', priceType: 50, unPrepare: 10, prepare: '-' },
    { id: 1, bankName: 'ธ.กรุงเทพ', priceType: 1000, unPrepare: 10, prepare: 10 },
    { id: 2, bankName: 'ธ.กรุงเทพ', priceType: 500, unPrepare: '-', prepare: 20 },
    { id: 3, bankName: 'ธ.กรุงเทพ', priceType: 100, unPrepare: 20, prepare: 10 },
    { id: 4, bankName: 'ธ.กรุงเทพ', priceType: 50, unPrepare: 10, prepare: '-' }
];

let mocUnsortNote = [
    { id: 101, barcode: 'B001-2568', date: '24/12/2568 10:00', type: 'ถุงพลาสติก' },
    { id: 102, barcode: 'B002-2568', date: '24/12/2568 11:30', type: 'กล่องกระดาษ' }
];

let tempDeleteBarcode = null;

function renderTable() {
    let html = '';
    mocContainer.forEach(item => {
        html += `
            <tr>
                <td style="font-weight: 600; color: #1e3a5f; text-align: center;">${item.barcode}</td>
                <td style="font-weight: 700; font-size: 16px; color: #333 !important; text-align: center;">${item.qty}</td>
            </tr>`;
    });
    $('#containerListBody').html(html);
}

async function renderHistoryTable() {
    $("#pageloading").fadeIn();
    const tbody = document.getElementById('receiveDeliveryTableBody');
    if (!tbody) return;

    try {

        // โหลดข้อมูลเฉพาะเมื่อ allUnsortData ยังว่างอยู่
        console.log(allUnsortData.length);
        //if (allUnsortData.length === 0) {
        const responseData = await LoadSendUnsortCCList();
        // ตรวจสอบโครงสร้างข้อมูลป้องกัน Error forEach
        allUnsortData = (responseData && responseData.data) ? responseData.data : [];
        // }

        tbody.innerHTML = '';


        console.log(allUnsortData);
        allUnsortData.forEach(item => {
            const isReturned = item.statusName === 'ส่งคืน' || item.statusName === "ไม่รับมอบ";

            // ตรวจสอบว่า ID นี้ถูกเลือกอยู่หรือไม่ (สมมติใช้ตัวแปร global: selectedReceivedId)
            //const isSelected = typeof selectedReceivedId !== 'undefined' && item.sendUnsortId === selectedReceivedId;

            const canEditFromAPI = item.canEdit === true;

            // --- ส่วนที่เพิ่มใหม่: ตรวจสอบว่าใน ContainerData มีอันไหนเริ่ม Prepare ไปหรือยัง ---
            // เช็คว่ามีรายการใดที่จำนวนคงเหลือไม่เท่ากับจำนวนตั้งต้นหรือไม่
            //const hasStartedPrepare = item.containerData && item.containerData.some(container =>
            //    container.unsortCCReceiveData && container.unsortCCReceiveData.some(cc => cc.remainingQty !== cc.banknoteQty)
            //);

            const row = document.createElement('tr');
            row.id = `row-${item.sendUnsortId}`;
            row.style.cursor = isReturned ? 'default' : 'pointer';

            // กำหนด Class ตามสถานะ
            let classList = [];
            //if (isSelected) classList.push('active-row');
            if (isReturned) classList.push('row-returned');
            row.className = classList.join(' ');

            if (isReturned) {
                row.style.backgroundColor = '#f8f9fa';
                row.style.color = '#adb5bd';
            }

            // Event: คลิกเลือกแถว
            row.onclick = () => {
                const allRows = tbody.querySelectorAll('tr');
                allRows.forEach(r => r.classList.remove('active-row'));
                row.classList.add('active-row');

                if (!isReturned && typeof onSelectReceived === 'function') {
                    // --- เพิ่มส่วนนี้เพื่อล้างข้อมูลเดิมก่อนโหลดใหม่ ---
                    currentContainerList = []; // ล้างข้อมูลในตัวแปร Global
                    $('#deliveryDataBody').html(''); // ล้าง HTML ตารางรายละเอียด
                    $('#chooseContainerBody').html(''); // ล้าง HTML ตารางเงินด้านล่างสุด
                    // -------------------------------------------

                    onSelectReceived(item.sendUnsortId, item.containerData); // ส่งข้อมูล containerData ไปด้วยถ้าจำเป็น
                    $('#chooseContainerBody').html('');
                } else {

                    $('#deliveryDataBody').html('');
                    $('#chooseContainerBody').html('');

                    currentContainerList = [];
                }
            };

            const sendDateTH = formatThaiDate(item.sendDate);
            const receivedDateTH = formatThaiDate(item.receivedDate);
            const statusHtml = renderStatusBadge(item.statusName);

            // --- Logic การแสดงผลปุ่ม ---
            // 1. Checkbox: จะ Disable ถ้าเริ่มมีการ Prepare แล้ว (hasStartedPrepare) หรือแก้ไขไม่ได้ (canEdit === false)
            const disableCheckbox = (!canEditFromAPI) ? 'disabled' : '';

            // 2. ปุ่มส่งคืน (Action Btn): จะหายไป (d-none) ถ้าเริ่ม Prepare แล้ว หรือถูกส่งคืนไปแล้ว
            const hideReturnBtn = (isReturned || !canEditFromAPI ) ? 'd-none' : '';

            row.innerHTML = `
                <td style="text-align: center;">
                    ${!isReturned ?
                `<input type="checkbox" class="return-checkbox" ${disableCheckbox}
                            value="${item.sendUnsortId}" 
                            onclick="event.stopPropagation(); updateSelectedReturn();">` :
                    `<i class="bi bi-dash-square text-muted" style="font-size: 1.1rem; opacity: 0.5;"></i>`
                }
                </td>
                <td style="text-align: center;">${item.sendUnsortCode}</td>
                <td style="text-align: center;">${sendDateTH}</td>
                <td style="text-align: center;">${receivedDateTH}</td>
                <td style="text-align: left; padding-left:15px;">${item.remark || '-'}</td>
                <td style="text-align: center;">${statusHtml}</td>
                <td style="text-align: center;">
                    <div class="action-btns ${hideReturnBtn}">
                        ${!isReturned ? `
                            <div class="btn-action" title="ส่งคืน"
                                onclick="event.stopPropagation(); handleReturn('${item.sendUnsortId}')">
                                <i class="bi bi-arrow-return-left"></i>
                            </div>
                        ` : '-'}
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });

        //$("#pageloading").fadeOut();

    } catch (error) {
        console.error("Error rendering table:", error);
    }

    $("#pageloading").fadeOut();
}
// ตัวแปรสำหรับเก็บ ID ที่ถูกเลือกในตารางรายละเอียด
let selectedDetailId = null;


function renderDeliveryDataTable(data) {
    const tbody = document.getElementById('deliveryDataBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // เก็บข้อมูลลงตัวแปร Global
    currentContainerList = data || [];

    if (currentContainerList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">ไม่พบข้อมูลภาชนะ</td></tr>';
        $('#chooseContainerBody').html('');
        return;
    }

    currentContainerList.forEach((item, index) => {
        const row = document.createElement('tr');
        const rowId = item.registerUnsortId;

        row.id = `detail-row-${rowId}`;
        row.style.cursor = 'pointer';

        // ส่งแค่ ID และ Index ของ Array ไป
        row.onclick = () => {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(r => r.classList.remove('active-row'));
            row.classList.add('active-row');
            onSelectDetailRow(rowId, index);
        };

        const containerCode = item.containerCode || '-';
        const qty = item.banknoteQty !== undefined ? item.banknoteQty.toLocaleString() : '0';

        row.innerHTML = `
            <td style="text-align: center;">${containerCode}</td>
            <td style="text-align: center;">${qty}</td>
            <td style="text-align: center;">
                <div class="action-btns ${item.canEdit === false ? 'd-none' : ''}">
                    <div class="btn-action btn-danger" title="ลบ" 
                         onclick="event.stopPropagation(); handleDelete('${rowId}')">
                        <i class="bi bi-trash"></i>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ฟังก์ชันเมื่อคลิกเลือกแถวในตารางรายละเอียด
// ตัวแปรเก็บข้อมูลเงินในตู้ที่กำลังเลือก (ใช้สำหรับตอนกด Save แก้ไขด้วย)
let currentUnsortCCData = [];

function onSelectDetailRow(id, index) {
    selectedDetailId = id;

    // ดึงข้อมูลลูกจากตัวแปร Global โดยใช้ index
    const selectedContainer = currentContainerList[index];
    currentUnsortCCData = selectedContainer ? selectedContainer.unsortCCReceiveData : [];

    // Highlight แถวที่เลือก
    const allRows = document.querySelectorAll('#deliveryDataBody tr');
    allRows.forEach(row => row.classList.remove('table-info'));

    const selectedRow = document.getElementById(`detail-row-${id}`);
    if (selectedRow) {
        selectedRow.classList.add('table-info');
    }

    // วาดตารางรายการเงินด้านล่าง
    renderChooseContainerTable(currentUnsortCCData);
}

function renderChooseContainerTable(data) {
    const tbody = document.getElementById('chooseContainerBody');
    if (!tbody) return;

    let html = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">ไม่พบข้อมูลรายการเงินในตู้นี้</td></tr>';
        return;
    }

    data.forEach(item => {
        // Mapping ข้อมูลจาก JSON: instShortNameTh, denoPrice, banknoteQty
        const bankName = item.instShortNameTh || '-';
        const priceType = item.denoPrice || 0;
        const UPqty = item.remainingQty || 0;
        const Pqty = (item.banknoteQty - item.remainingQty - item.adjustQty) || 0;
        const priceClass = `qty-${priceType}`;

        html += `
            <tr>
                <td style="text-align: left; padding-left: 10px;">${bankName}</td>
                <td style="text-align: center;">
                    <span class="qty-badge ${priceClass}">
                        ${priceType.toLocaleString()}
                    </span>
                </td>
                <td style="text-align: center;">${UPqty.toLocaleString()}</td> 
                <td style="text-align: center;">${Pqty.toLocaleString()}</td> 
                <td style="text-align: center;">
                    <div class="action-btns ${item.canEdit === false ? 'd-none' : ''}" >
                        <div class="btn-action" title="แก้ไข" onclick="handleEditCC(${item.unsortCCId})">
                            <i class="bi bi-pencil"></i>
                        </div>
                    </div>
                </td>
            </tr>`;
    });

    tbody.innerHTML = html;
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

//$(document).on('click', '#btnConfirmReceive', function () {
//    $('#overallStatusBadge').html(renderStatusBadge('รับมอบ'));
//});

//$(document).on('click', '#btnRejectReceive', function () {
//    $('#overallStatusBadge').html(renderStatusBadge('ส่งคืน'));
//});


function handleDelete(barcode) {
    tempDeleteBarcode = barcode;

    const deleteModal = new bootstrap.Modal(document.getElementById('DeleteModal'));
    deleteModal.show();
}

async function confirmDelete() {
    if (!tempDeleteBarcode) return;

    try {
        // แนะนำให้ใส่ / นำหน้า หรือระบุ Path ให้ชัดเจนตาม Controller
        // สมมติชื่อ Controller คือ PrePreparationUnsort
        const response = await fetch(`/PrePreparationUnsort/RemoveBinContainerNotPrepareData/${tempDeleteBarcode}`, {
            method: 'DELETE'
        });

        // ตรวจสอบ HTTP Status
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
            alert("ไม่สามารถลบข้อมูลได้ (Internal Server Error)");
            return;
        }

        // อ่าน JSON ที่ได้จาก Ok(new { success = true, count = result })
        const result = await response.json();

        // ตรวจสอบเงื่อนไขความสำเร็จ
        if (result.success && result.count > 0) {

            // 2. ลบออกจากตัวแปร Global (allUnsortData)
            // ค้นหาและลบ Container ที่อยู่ในหีบห่อที่เลือก
            allUnsortData.forEach(master => {
                if (master.containerData) {
                    master.containerData = master.containerData.filter(c =>
                        c.registerUnsortId.toString() !== tempDeleteBarcode.toString()
                    );
                }
            });

            // 1. ลบแถวออกจาก Array (ใช้ .filter)
            currentContainerList = currentContainerList.filter(item =>
                item.registerUnsortId.toString() !== tempDeleteBarcode.toString()
            );

            // 2. วาดตารางใหม่
            renderDeliveryDataTable(currentContainerList);

            // 3. ปิด Modal
            // --- ส่วนที่แก้ไข: ปิด Modal อย่างปลอดภัย ---
            const modalElement = document.getElementById('DeleteModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);

            if (modalInstance) {
                modalInstance.hide();
                // Bootstrap จะจัดการคืน Focus ไปยังปุ่มที่กดเปิด Modal ให้เอง
                // และลบ aria-hidden ออกให้อย่างถูกต้อง
            }

            // 4. (Optional) แจ้งเตือนความสำเร็จ
            console.log(`ลบสำเร็จ: ${result.count} รายการ`);
        } else {
            alert(result.message || 'ไม่พบข้อมูลที่ต้องการลบในระบบ');
        }
    } catch (error) {
        console.error('JS Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ หรือรูปแบบข้อมูลไม่ถูกต้อง');
    } finally {
        tempDeleteBarcode = null;
    }
}

let selectedReturnIds = [];

function updateSelectedReturn() {
    selectedReturnIds = [];
    $('.return-checkbox:checked').each(function () {
        selectedReturnIds.push($(this).val());
    });

    const count = selectedReturnIds.length;
    $('#selectedCount').text(count);

    if (count > 0) {
        $('#btnReturnSelected').removeClass('d-none');
    } else {
        $('#btnReturnSelected').addClass('d-none');
    }
}

function toggleCheckAll(source) {
    $('.return-checkbox:not(:disabled)').prop('checked', source.checked);
    updateSelectedReturn();
}

function handleReturn(id) {
    selectedReturnIds = [id];
    $('#returnQtyText').text("1");
    $('#returnNote').val('');
    $('#ReturnModal').modal('show');
}

function handleReturnSelected() {
    $('#returnQtyText').text(selectedReturnIds.length);
    $('#returnNote').val('');
    $('#ReturnModal').modal('show');
}

async function confirmReturn() {
    const noteInput = $('#returnNote');
    const noteValue = noteInput.val().trim();

    // 1. ตรวจสอบหมายเหตุ
    if (noteValue === "") {
        noteInput.addClass('is-invalid');
        noteInput.focus();
        return;
    }

    // 2. ปิด Modal และเริ่ม Loading
    $('#ReturnModal').modal('hide');
    $("#pageloading").fadeIn();

    try {
        console.log("--- เริ่มกระบวนการส่งคืนข้อมูล ---", selectedReturnIds);

        // 3. ยิง API (สมมติว่าสร้าง Method ใหม่ชื่อ ExecuteReturn)
        const response = await fetch('/PrePreparationUnsort/ExecuteReturn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sendUnsortIds: selectedReturnIds, // ส่งเป็น Array ของ ID
                note: noteValue
            })
        });

        const result = await response.json();

        if (result.is_success) {
            // 4. แสดง Modal สำเร็จ
            setTimeout(() => {
                $('#SuccessModal').modal('show');
            }, 400);

            // 5. ล้างค่าหน้าจอและอัปเดตตาราง
            selectedReturnIds = [];
            $('#btnReturnSelected').addClass('d-none');
            $('#checkAllHistory').prop('checked', false);

            await renderHistoryTable(); // ดึงข้อมูลใหม่จาก DB
        } else {
            showErrorModal(result.msg_desc || "ไม่สามารถดำเนินการส่งคืนได้");
        }

    } catch (error) {
        console.error("Return Error:", error);
        showErrorModal("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
        $("#pageloading").fadeOut();
    }
}

let tempRejectId = null;

function handleReject() {
    const senderName = $('#senderName').text().trim();
    const receiverName = $('#receiverName').text().trim();
    const scanValue = $('#scanInput').val() || $('#deliveryInput').val();

    // 1. ตรวจสอบว่ามีการสแกนข้อมูลหรือยัง
    if (!scanValue || !senderName) {
        showErrorModal("ไม่พบข้อมูลใบนำส่ง กรุณาสแกนรหัส");
        return;
    }

    if (!receiverName) {
        showErrorModal("ไม่สามารถดำเนินการได้: ไม่พบข้อมูลชื่อผู้รับมอบ");
        return;
    }

    // 2. ตรวจสอบเงื่อนไข: ผู้รับและผู้ส่งต้องไม่ใช่คนเดียวกัน
    if (senderName === receiverName && senderName !== "") {
        //showErrorModal("ไม่สามารถปฏิเสธการรับได้: ผู้ส่งและผู้รับเป็นบุคคลเดียวกัน");
        showErrorModal("ไม่สามารถปฏิเสธการรับมอบได้<br/>Supervisor รับมอบ ต้องไม่ใช่คนเดียวกันกับส่งมอบ");
        return;
    }

    // 3. ถ้าผ่านเงื่อนไข ให้เตรียม Modal ปฏิเสธ
    $('#RejectModal h3').text(scanValue); // แสดงรหัสที่จะปฏิเสธ
    $('#rejectNote').val('').removeClass('is-invalid');
    $('#rejectQtyText').text("1"); // หรือค่าจำนวนที่ต้องการ
    $('#RejectModal').modal('show');
}

// ฟังก์ชันสำหรับส่งข้อมูลปฏิเสธจริง
async function executeReject() {
    const note = $('#rejectNote').val().trim();

    if (!note) {
        $('#rejectNote').addClass('is-invalid');
        return;
    }

    $('#RejectModal').modal('hide');
    $("#pageloading").fadeIn();

    // จำลองการส่ง API
    console.log("Rejecting Order...", {
        reason: note,
        reject_date: new Date().toISOString()
    });

    // ล้างค่าหน้าจอและแสดงความสำเร็จ (ใช้ Logic เดียวกับ executeReceive)
    alert("ปฏิเสธการรับมอบเรียบร้อยแล้ว");
    $("#pageloading").fadeOut();
}

// ขั้นตอนที่ 1: ตรวจสอบข้อมูลเบื้องต้น แล้วค่อยเปิด Modal
// ฟังก์ชันสำหรับกดปุ่ม "รับมอบ"
function openReceiveModal() {
    // 1. ดึงค่าชื่อจาก UI (อ้างอิงจาก ID ที่คุณมีในโค้ดก่อนหน้า)
    const senderName = $('#senderName').text().trim();
    const receiverName = $('#receiverName').text().trim();
    const scanValue = $('#deliveryInput').val();

    // 2. ตรวจสอบว่ามีข้อมูลครบไหม
    if (!scanValue || !senderName) {
        showErrorModal("ไม่พบข้อมูลใบนำส่ง กรุณาสแกนรหัส");
        return;
    }

    if (!receiverName) {
        showErrorModal("ไม่สามารถดำเนินการได้: ไม่พบข้อมูลชื่อผู้รับมอบ");
        return;
    }

    // 3. ตรวจสอบเงื่อนไข: ห้ามเป็นคนเดียวกัน
    if (senderName === receiverName && senderName !== "") {
        showErrorModal("ไม่สามารถรับมอบได้<br/>Supervisor รับมอบ ต้องไม่ใช่คนเดียวกันกับส่งมอบ");
        return;
    }

    console.log('senderName:: '+senderName);
    console.log('receiverName:: ' + receiverName);
    console.log('scanValue:: ' + scanValue);

    // 4. ถ้าผ่านเงื่อนไข ให้เปิด Modal ยืนยัน
    $('#ReceiveModal h3').text(scanValue);
    $('#ReceiveModal').modal('show');
}

// ขั้นตอนที่ 2: ฟังก์ชันบันทึกข้อมูลจริง (เรียกเมื่อกดปุ่ม "ยืนยัน" ใน Modal)
async function executeReceive() {
    // ปิด Modal ก่อนเริ่มทำงาน
    $('#ReceiveModal').modal('hide');

    // แสดง loading
    $("#pageloading").fadeIn();

    const scanValue = $('#ReceiveModal h3').text(); // ดึงค่าจากหัวข้อ Modal ที่เราใส่ไว้

    try {
        console.log("--- เริ่มกระบวนการบันทึกข้อมูล ---");
        const sendUnsortId = $('#currentSendUnsortId').val();
        /* จำลองการเรียก API จริง 
           const response = await fetch('/api/receive', {
               method: 'POST',
               body: JSON.stringify({ import_code: scanValue })
           });
        */

        // เรียก API จริงตามโครงสร้าง Controller [HttpPost("ExecuteReceive")]
        const response = await fetch('/PrePreparationUnsort/ExecuteReceive', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' // <--- จุดที่ต้องเพิ่มเพื่อแก้ 415
            },
            body: JSON.stringify({
                SendUnsortId: parseInt(sendUnsortId)
            })
        });

        const result = await response.json();

        // ล้างค่าหน้าจอ (UI Cleanup)
        $('#deliveryInput').val('');
        //$('#afterScanInfo').addClass('d-none');
        //$('#dvBtnExecute').addClass('d-none');
        $('#dvBtnExecute button').prop('disabled', true);
        $('#senderName').text("");
        $('#containerListBody').empty();

        //alert("บันทึกข้อมูล " + scanValue + " สำเร็จ!");

        // อัปเดตตารางประวัติ
        renderHistoryTable();

        $('#deliveryDataBody').html('');
        $('#chooseContainerBody').html('');

    } catch (error) {
        console.error("Error:", error);
        showErrorModal("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
        $("#pageloading").fadeOut();
        $('#deliveryInput').focus();
    }
}

async function confirmReject() {
    const noteInput = $('#rejectNote');
    const noteValue = noteInput.val().trim();
    const scanValue = $('#scanInput').val() || $('#deliveryInput').val(); // ดึงรหัสใบนำส่ง
    const sendUnsortId = $('#currentSendUnsortId').val();

    // 1. ตรวจสอบการกรอกหมายเหตุ
    if (noteValue === "") {
        noteInput.addClass('is-invalid');
        noteInput.focus();
        return;
    }

    // 2. ปิด Modal และแสดง Loading
    $('#RejectModal').modal('hide');
    $("#pageloading").fadeIn();

    try {
        // --- ส่วนนี้ไว้ใส่การเรียก API จริงในอนาคต ---
        console.log("--- ดำเนินการไม่รับมอบ ---");
        console.log("รหัสใบนำส่ง:", scanValue);
        console.log("เหตุผล:", noteValue);

        // 3. แจ้งเตือนผู้ใช้ (แนะนำให้ใช้ Toast หรือ Alert ที่สวยงาม)
        //alert("บันทึกการไม่รับมอบ " + scanValue + " เรียบร้อยแล้ว");
        const response = await fetch('/PrePreparationUnsort/ExecuteReject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sendUnsortId: parseInt(sendUnsortId),
                note: noteValue
            })
        });

        const result = await response.json();

        //if (result.is_success) {
        //    console.log("REJECT SUCCESS:", { scanValue, noteValue });

        //    // 4. แจ้งเตือนผู้ใช้
        //    //alert("บันทึกการไม่รับมอบ " + scanValue + " เรียบร้อยแล้ว");

        //    // 5. ล้างค่าหน้าจอหลัก (UI Cleanup) และหมายเหตุใน Modal
        //    noteInput.val('');
        //    noteInput.removeClass('is-invalid');
        //    clearScanInterface(); // ฟังก์ชันล้าง UI ที่คุณสร้างไว้

        //    // 6. อัปเดตตารางประวัติ (เพื่อให้เห็นสถานะเป็น 'ไม่รับมอบ' สีแดง)
        //    if (typeof renderHistoryTable === "function") {
        //        await renderHistoryTable();
        //    }
        //} else {
        //    showErrorModal(result.msg_desc || "ไม่สามารถบันทึกข้อมูลได้");
        //}

        // 4. ล้างค่าหน้าจอหลัก (UI Cleanup) ให้พร้อมรับใบงานถัดไป
        clearScanInterface();
        renderHistoryTable();

    } catch (error) {
        console.error("Reject Error:", error);
        showErrorModal("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่");
    } finally {
        $("#pageloading").fadeOut();
    }
}

// ฟังก์ชันช่วยล้างค่าหน้าจอ (ใช้ร่วมกันทั้งตอน Receive และ Reject)
function clearScanInterface() {
    $('#deliveryInput').val('');
    $('#scanInput').val('');
    $('#rejectNote').val('').removeClass('is-invalid'); // ล้างค่า note

    //$('#afterScanInfo').addClass('d-none').removeClass('d-flex'); // ซ่อนข้อมูลใบนำส่ง
    //$('#dvBtnExecute').addClass('d-none').removeClass('d-flex'); // ซ่อนปุ่มดำเนินการ
    $('#dvBtnExecute button').prop('disabled', true);

    // ล้างข้อมูลตัวหนังสือต่างๆ
    $('#senderName').text('');
    $('#deliveryDateTextt').text('-');
    $('#overallStatusBadge').html('-');
    $('#containerListBody').empty();

    $('#deliveryDataBody').html('');
    $('#chooseContainerBody').html('');

    // Focus กลับไปที่ช่องสแกน
    $('#deliveryInput').focus();

    // อัปเดตตารางประวัติ (ถ้ามี)
    if (typeof renderHistoryTable === "function") {
        renderHistoryTable();
    }
}

$('#rejectNote').on('input', function () {
    $(this).removeClass('is-invalid');
});

$('#returnNote').on('input', function () {
    $(this).removeClass('is-invalid');
});

$('#ErrorModal').on('hidden.bs.modal', function () {
    clearScanInterface();
});

//function handleEditBarcode(id) {
//    const data = mocContainerIsChoose.find(item => item.id == id);
//    if (!data) return;

//    const priceClass = `qty-${data.priceType}`;
//    const badgeHtml = `<div class="${priceClass}">${data.priceType.toLocaleString()}</div>`;

//    $('#editBankText').text(data.bankName);
//    $('#editDenomBadge').html(badgeHtml);

//    const prepareVal = data.prepare === '-' ? 0 : data.prepare;
//    const unPrepareVal = data.unPrepare === '-' ? 0 : data.unPrepare;

//    $('#editPrepare').val(prepareVal);
//    $('#oldUnPrepare').val(unPrepareVal);
//    $('#newUnPrepare').val(unPrepareVal).removeClass('is-invalid');

//    $('#unPrepareError').hide();

//    $('#btnSaveEdit').off('click').on('click', function () {
//        saveEditBarcode(data.id);
//    });

//    $('#EditBarcodeModal').modal('show');
//}

function handleEditCC(unsortCCId) {
    // อ้างอิงจาก Log บรรทัดที่ 207 ที่มีข้อมูล 3 รายการ
    const data = currentUnsortCCData.find(item => item.unsortCCId == unsortCCId);
    if (!data) return;

    //console.log('handleEditCC');
    //console.log(data);

    // ล็อกค่าสูงสุดไว้ที่ remainingQty ปัจจุบัน
    const maxAllowed = data.remainingQty || 0;

    const prepare = data.banknoteQty - data.remainingQty - data.adjustQty
    //const upprepare = data.banknoteQty - data.remainingQty

    // ล้าง UI และแมปข้อมูลตามดีไซน์ใหม่
    $('#unPrepareError').hide();
    $('#newUnPrepare').removeClass('is-invalid');

    $('#editContainerBarcode').val(data.containerCode);
    $('#editBankText').val(data.instShortNameTh);
    $('#editDenomText').val(data.denoPrice.toLocaleString());
    $('#oldUnPrepare').val(data.remainingQty);

    // ตั้งค่า Input สำหรับกรอกค่าใหม่
    $('#newUnPrepare')
        .val(maxAllowed) // ใส่ค่าปัจจุบันรอไว้ให้เลย
        //.attr('max', maxAllowed) // ล็อก attribute max ไว้ตรวจสอบ
        .focus();

    $('#unPrepareError').text(`* ระบุได้ไม่เกินจำนวนคงเหลือปัจจุบัน (0 - ${maxAllowed})`);

    $('#btnSaveEdit').off('click').on('click', function () {

        var status = validateMax($('#newUnPrepare'));

        if (status) {
            const newVal = parseInt($('#newUnPrepare').val());


            ///Updateto API
            $.requestAjax({
                service: 'PrePreparationUnsort/UpdateRemainingQtyReceive',
                type: 'POST',
                enableLoader: true,
                parameter: {
                    RemainingQty: newVal,
                    RegisterUnsortId: data.registerUnsortId,
                    InstId: data.instId,
                    DenoId: data.denoId
                },
                onSuccess: function (response) {
                    if (response.is_success && response.data) {

                        //console.log("UpdateRemainingQtyReceive :: ", response);

                        // อัปเดตค่าใน Array หลัก (Data Object)
                        // ในที่นี้ newVal คือ 'ค่าคงเหลือใหม่' ที่ผู้ใช้ต้องการ
                        data.remainingQty = newVal;

                        //console.log(currentUnsortCCData);

                        const isZero = response.data.remainingQty === 0;

                        // 1. นำค่า AdjustQty ที่ Server คำนวณกลับมา อัปเดตลงใน Object ปัจจุบัน
                        data.adjustQty = response.data.adjustQty;
                        data.remainingQty = response.data.remainingQty;

                        //// 2. แสดงแจ้งเตือน (ถ้ามีระบบ Alert)
                        //Swal.fire('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว', 'success');

                        //// 3. สั่ง Render ตารางย่อยใหม่เพื่อให้ค่า AdjustQty ล่าสุดแสดงผล
                        //renderChooseContainerTable(currentUnsortCCData);

                        // 2. ค้นหาแถวในตารางประวัติ (allUnsortData) เพื่ออัปเดตค่าข้างใน
                        // สมมติเรามีตัวแปร selectedReceivedId ที่เก็บ ID ของรายการหลักที่เลือกอยู่
                        const parentData = allUnsortData.find(item => item.sendUnsortId === selectedReceivedId);
                        if (parentData) {
                            // ค้นหา container และ cc เพื่ออัปเดตค่า remainingQty ให้ตรงกัน
                            // เพื่อให้ logic 'hasStartedPrepare' ใน renderHistoryTable ทำงานถูกต้อง
                            parentData.containerData.forEach(cont => {
                                cont.unsortCCReceiveData.forEach(cc => {
                                    if (cc.unsortCCId === data.unsortCCId) {
                                        cc.remainingQty = data.remainingQty;
                                    }
                                });
                            });
                        }

                        //console.log('currentContainerList :: ', currentContainerList);

                        // กรองตารางย่อย (ถ้ามี)
                        currentUnsortCCData = currentUnsortCCData.filter(cc => cc.remainingQty > 0);
                        

                        // ขั้นตอนที่ A: เข้าไปกรองรายการลูกในแต่ละตู้
                        currentContainerList = currentContainerList.map(container => {

                            // กรองรายการลูกในตู้แม่ให้เหลือเฉพาะ Remaining > 0
                            const filteredCCs = container.unsortCCReceiveData.filter(cc => cc.remainingQty > 0);

                            // คำนวณยอด banknoteQty รวมของตู้แม่ใหม่ 
                            // สูตร: Sum ของ (banknoteQty - adjustQty)
                            const newTotalBanknote = filteredCCs.reduce((sum, cc) => {
                                return sum + (cc.banknoteQty - (cc.adjustQty || 0));
                            }, 0);

                            return {
                                ...container,
                                banknoteQty: newTotalBanknote,
                                // เก็บเฉพาะลูกที่ยังมี RemainingQty > 0
                                unsortCCReceiveData: container.unsortCCReceiveData.filter(cc => cc.remainingQty > 0)

                            };
                        })
                            // ขั้นตอนที่ B: กรองตู้แม่ทิ้ง ถ้าไม่มีลูกเหลืออยู่ในตู้เลย (length เป็น 0)
                            .filter(container => container.unsortCCReceiveData.length > 0);

                        // 4. สั่ง Render ใหม่
                        renderHistoryTable(); // เพื่อ Update สถานะปุ่มคืนเงินในตารางประวัติ
                        renderDeliveryDataTable(currentContainerList); // ตารางแม่จะหายไปถ้าลูกหมด
                        renderChooseContainerTable(currentUnsortCCData);
                        

                        // 5. ปิด Modal
                        $('#EditBarcodeModal').modal('hide');



                    } else {
                        Swal.fire('แจ้งเตือน', response.msg_desc || 'เกิดข้อผิดพลาด', 'warning');
                    }

                    console.log(response.msg_desc);

                    if (data.remainingQty != data.banknoteQty) {

                        // ค้นหา Object ใน List ใหญ่ เพื่อแก้ไขค่า reference
                        const targetContainer = currentContainerList.find(item =>
                            item.registerUnsortId.toString() == data.registerUnsortId.toString()
                        );

                        if (targetContainer) {
                            targetContainer.canEdit = false; // ล็อกสถานะ

                            // สั่ง Render ตารางใหญ่ใหม่ทันทีเพื่ออัปเดตปุ่ม (Disabled)
                            if (typeof renderDeliveryDataTable === "function") {
                                renderDeliveryDataTable(currentContainerList);
                            }

                            console.log('Updated Container Status:', targetContainer);
                        }

                    }

                    renderChooseContainerTable(currentUnsortCCData);
                },
                onComplete: function () {

                }
            });


            $('#EditBarcodeModal').modal('hide');
            clearScanInterface();
            renderHistoryTable();
        }
    });

    $('#EditBarcodeModal').modal('show');
}

function handleBarcode() { 
    $('#ErrorModal').one('hidden.bs.modal', function () {
        $('#deliveryInput').focus();
        $('#deliveryInput').select();
    });
}

function validateMax(input) {
    var status = true;
    const max = $('#oldUnPrepare').val() || 0;
    let val = $(input).val();
    if (val === "") return;
    let intVal = parseInt(val);
    // ตรวจสอบถ้าค่าเกิน max
    if (intVal > max) {
        showErrorModal(`ไม่สามารถกรอกเกิน ${max.toLocaleString()} ได้`, false);

        $('#ErrorModal').one('hidden.bs.modal', function () {
            input.focus();
            input.select();
            $(input).addClass('is-invalid');

            // พอผู้ใช้เริ่มแก้ตัวเลข (keypress) ให้เอาสีแดงออก
            $(input).one('input', function () {
                $(this).removeClass('is-invalid');
            });
        });
        return false;

    } else {
        // ถ้าค่าถูกต้อง ให้เอาสีแดงออก (เผื่อกรณีเคยกรอกผิดมาก่อน)
        $(input).removeClass('is-invalid');
        return true;
    }
}

//function saveEditBarcode(id) {
//    const newVal = $('#newUnPrepare').val().trim();

//    if (newVal === "" || parseInt(newVal) < 0 || parseInt(newVal) > 20) {
//        $('#newUnPrepare').addClass('is-invalid');
//        $('#unPrepareError').show();
//        return;
//    }

//    const index = mocContainerIsChoose.findIndex(item => item.id == id);
//    if (index !== -1) {
//        mocContainerIsChoose[index].unPrepare = parseInt(newVal);

//        renderChooseContainerTable();

//        $('#EditBarcodeModal').modal('hide');
//    }
//}

$('#newUnPrepare').on('input', function () {
    $(this).removeClass('is-invalid');
    $('#unPrepareError').hide();
});


function closeAllModals() {
    $('#SuccessModal').modal('hide');

    $('#returnNote').val('').removeClass('is-invalid');
    $('#returnNoteFeedback').hide();
}

function handleViewDetail(code) { console.log("UCC Detail:", code); }
function handleAction(barcode) { console.log("Return Barcode:", barcode); }


async function processDeliveryScan(barcode) {
    try {
        const response = await GetUnsortReceiveDeliverly(barcode);
        let senderName = '';
        const resiverName = document.getElementById('receiverName');

        // ตรวจสอบ success flag จาก JSON
        if (response?.is_success) {
            const item = response.data; // เข้าถึง object data ด้านใน

            $('#currentSendUnsortId').val(item.sendUnsortId);

            // 1. แสดงวันที่ (แปลง Format วันที่จาก JSON)
            if (item.sendDate) {
                const date = new Date(item.sendDate);
                document.getElementById('deliveryDateTextt').innerText = date.toLocaleString('th-TH');
            }

            if (item.createdByName) {
                senderName = item.createdByName;
                document.getElementById('senderName').innerText = senderName;
            }

            // 2. แสดงสถานะ Badge
            // ใช้ statusName จาก JSON: "รับมอบ"
            const statusName = item.statusName || "ไม่ทราบสถานะ";
            const statusHtml = renderStatusBadge(item.statusName);
            document.getElementById('overallStatusBadge').innerHTML = statusHtml;

            // 3. แสดง Section ข้อมูลหัวข้อ
            /*const infoSection = document.getElementById('afterScanInfo');
            if (infoSection) {
                infoSection.classList.remove('d-none');
                infoSection.classList.add('d-flex');
            }*/

            // 4. จัดการปุ่มดำเนินการ (Business Logic: ผู้รับต้องไม่ใช่คนเดียวกับผู้ส่ง)
            const receiverText = document.getElementById('receiverName')?.innerText.trim() || "";
            //const dvBtn = document.getElementById('dvBtnExecute');
            //const btnExecute = document.getElementById('btnExecute');

            //if (dvBtn) {
                // เช็คเงื่อนไข: ชื่อไม่ตรงกัน และ สถานะต้องยังไม่เสร็จสมบูรณ์ (ถ้าจำเป็น)
                if (receiverText !== senderName && senderName !== "") {
                    //dvBtn.classList.remove('d-none');
                    //dvBtn.classList.add('d-flex', 'flex-column', 'gap-2');
                    $('#dvBtnExecute button').prop('disabled', false);
                    console.log("Validation passed: Ready to execute.");
                } else {
                    //dvBtn.classList.add('d-none');
                    //dvBtn.classList.remove('d-flex', 'flex-column', 'gap-2');
                    //dvBtn.classList.remove('d-none');
                    //dvBtn.classList.add('d-flex', 'flex-column', 'gap-2');
                    $('#dvBtnExecute button').prop('disabled', false);

                    if (receiverText === senderName) {
                        //alert("ไม่สามารถรับมอบได้: ผู้รับและผู้ส่งเป็นบุคคลเดียวกัน");
                    }
                }
            //}

            // 5. (เพิ่มเติม) ถ้าคุณมีตารางแสดงรายการตู้ (Containers)
            //if (item.containerData && item.containerData.length > 0) {
            renderContainerTable(item.containerData);
            //}

            // ล้างค่าในช่องสแกนเพื่อให้พร้อมสแกนใบถัดไป
            //document.getElementById('deliveryInput').value = '';
            //document.getElementById('deliveryInput').focus();

        }
        else {
            // --- กรณีไม่พบข้อมูล หรือ is_success เป็น false ---
            const msg = response.msg_desc || "ไม่พบข้อมูลในระบบ หรือรหัสอาจไม่ถูกต้อง";
            //showErrorModal(msg);

            //$('#deliveryInput').val('');
        }
    } catch (error) {
        //console.error("Error:", error);
        console.log('error ::', error);
        //showErrorModal("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
        $("#pageloading").fadeOut();
    }
}

// ฟังก์ชันช่วยเปิด Error Modal
function showErrorModal(message, clear = true) {
    $('#errorMessage').html(message);
    $('#ErrorModal').modal('show');
    //$('#deliveryInput').val('').focus(); // ล้างค่าและ focus พร้อมสแกนใหม่

    $('#ErrorModal').on('shown.bs.modal', function () {
        $('.modal-backdrop').last().css('z-index', 2090);
    });

    if (clear !== false) {
        clearScanInterface();
    }
}

// ฟังก์ชันช่วยแสดงรายการตู้ในตาราง (ถ้ามี)
function renderContainerTable(containers) {
    const tbody = document.getElementById('containerListBody');
    if (!tbody) return;

    console.log('containers :::');
    console.log(containers);
    // 1. ตรวจสอบว่ามีข้อมูลหรือไม่ (Check for null, undefined หรือ empty array)
    if (!containers || containers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-muted" style="padding: 20px;">                    
                    ไม่พบข้อมูลภาชนะ
                </td>
            </tr>`;

        /*const dvBtnExecute = document.getElementById('dvBtnExecute');
        if (dvBtnExecute) {
            dvBtnExecute.classList.add('d-none');
            dvBtnExecute.classList.remove('d-flex', 'flex-column');
        }*/
        $('#dvBtnExecute button').prop('disabled', true);

        return;
    }

    // 2. ถ้ามีข้อมูล ให้ทำการ Loop เพื่อสร้างแถวตาราง
    let html = '';
    containers.forEach((con) => {
        const code = con.containerCode || '-';
        const qty = con.banknoteQty !== undefined ? con.banknoteQty.toLocaleString() : '0';

        html += `
            <tr>
                <td style="text-align: center;">${code}</td>
                <td style="text-align: center;">${qty}</td>
            </tr>`;
    });

    tbody.innerHTML = html;
}


function GetUnsortReceiveDeliverly(barcode) {
    // ลบการสร้าง object requestData ออก
    // แล้วเอา barcode ไปต่อท้าย URL แทน
    let serviceUrl = 'PrePreparationUnsort/GetUnsortReceiveDeliverly?barcode=' + encodeURIComponent(barcode.trim());

    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: serviceUrl,
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


function startRealTimeClock() {
    function updateClock() {
        const now = new Date();

        // รูปแบบวันที่: วัน/เดือน/ปี (พ.ศ.)
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear() + 543; // แปลงเป็น พ.ศ.

        // รูปแบบเวลา: ชั่วโมง:นาที:วินาที
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const currentDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        // อัปเดตลงใน Element
        const dateElement = document.getElementById('deliveryDateText');
        if (dateElement) {
            dateElement.innerText = currentDateTime;
        }
    }

    // เรียกครั้งแรกทันที
    updateClock();
    // ตั้งให้ทำงานทุกๆ 1 วินาที (1000ms)
    setInterval(updateClock, 1000);
}

// เรียกใช้งานฟังก์ชันนาฬิกาใน DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    startRealTimeClock();
    // ... โค้ดส่วนอื่นๆ ของคุณ ...
});


function LoadSendUnsortCCList() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'PrePreparationUnsort/LoadSendUnsortCCList',
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

function formatThaiDate(isoString) {
    const date = new Date(isoString);

    // ตรวจสอบว่า Date valid หรือไม่
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    if (!isoString) {
        return "-"; // หรือ return "" ตามความเหมาะสมของ UI
    }

    const formatter = new Intl.DateTimeFormat('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // ใช้ formatToParts เพื่อเอาค่ามาเรียงใหม่เอง ลดปัญหาเรื่องเครื่องหมาย , หรือ / ที่อาจต่างกันในแต่ละ OS
    const parts = formatter.formatToParts(date);
    const d = parts.find(p => p.type === 'day').value;
    const m = parts.find(p => p.type === 'month').value;
    const y = parts.find(p => p.type === 'year').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;

    return `${d}/${m}/${y} ${hour}:${minute}`;
}

// เก็บตัวแปร Global สำหรับสถานะการเลือก
let selectedReceivedId = null;

function onSelectReceived(id) {
    selectedReceivedId = id;

    // ค้นหาข้อมูลจาก Global แทนการโหลดใหม่
    const masterData = allUnsortData.find(item => item.sendUnsortId === id);

    // 1. จัดการ Highlight แถวที่เลือก
    const allRows = document.querySelectorAll('#receiveDeliveryTableBody tr');
    allRows.forEach(row => row.classList.remove('active-row'));

    const selectedRow = document.getElementById(`row-${id}`);
    if (selectedRow) {
        selectedRow.classList.add('active-row');
    }

    // 2. ส่ง containerData ไป render ตารางรายละเอียดทันที
    renderDeliveryDataTable(masterData ? masterData.containerData : []);

    // ล้างตารางล่างสุดเสมอเมื่อเปลี่ยนรายการหลัก
    $('#chooseContainerBody').html('');
}

// ฟังก์ชันตัวอย่างสำหรับ Render ตารางลูก (Container)
function renderDetailTable(data) {
    const tbody = document.getElementById('detailTableBody'); // เปลี่ยนเป็น ID ตารางของคุณ
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">ไม่มีข้อมูลตู้คอนเทนเนอร์</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center">${item.containerCode}</td>
            <td class="text-end">${item.banknoteQty.toLocaleString()}</td>
            <td class="text-center">${item.canEdit ? 'แก้ไขได้' : '-'}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-search"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}