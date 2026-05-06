document.addEventListener('DOMContentLoaded', async function () {
    initDatePicker();

    await Promise.all([
        fetchMachineList(),
        loadInstitutionList(),
        loadCashTypeList(),
        loadDenominationList(),
        loadShiftTimeList()
    ]);



    // ตั้งค่า Select2 ให้กับทุก Dropdown ที่ต้องการให้ค้นหาได้
    $('.select2').select2({
        theme: 'bootstrap-5',
        width: '100%',
        //placeholder: '-- ค้นหา Header Card --',
        allowClear: false
    });





    //// เมื่อมีการเปลี่ยนธนาคาร (Institution)
    //$('#stationMachine').on('change', async function () {
    //    const machineId = $(this).val();

    //    // แสดงสถานะกำลังโหลดใน dropdown ลูก
    //    $('#headercardSelect').html('<option value="">กำลังโหลด...</option>').trigger('change');

    //    // เรียกโหลดข้อมูลใหม่ตาม Filter
    //    await loadHeaderCardList(machineId);
    //});

});


async function fetchMachineList() {
    const selectElem = document.getElementById('stationMachine');

    try {
        // เรียกไปยัง Action ใน Controller ของคุณ
        const response = await fetch('/Report/GetMachineList');
        const result = await response.json();

        // ตรวจสอบโครงสร้าง { "data": [...], "is_success": true }
        if (result.is_success && Array.isArray(result.data)) {

            // ล้าง "กำลังโหลดข้อมูล..." ออก และใส่ Option เริ่มต้น
            selectElem.innerHTML = '<option value="all">รวมทุกเครื่อง</option>';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.machineId;       // ส่ง ID ไปใช้งาน (เช่น 1)
                option.textContent = item.machineName; // แสดงชื่อภาษาไทย (เช่น นจธ. M7-2)
                selectElem.appendChild(option);

            });

        } else {
            selectElem.innerHTML = '<option value="">ไม่พบข้อมูลเครื่อง</option>';
        }
    } catch (error) {
        console.error('Error fetching machines:', error);
        selectElem.innerHTML = '<option value="">โหลดข้อมูลล้มเหลว</option>';
    }
}

async function loadInstitutionList() {
    const selectElem = document.getElementById('institutionSelect');

    try {
        const response = await fetch('/Report/GetInstitutionList'); // เปลี่ยน Path ให้ถูก
        const result = await response.json();

        if (result.is_success && result.data) {
            // ตั้งค่า Default เป็น "ทั้งหมด"
            selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.institutionId;       // เช่น 11
                option.textContent = item.institutionNameTh; // เช่น ธนาคารออมสิน
                selectElem.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching institutions:', error);
        selectElem.innerHTML = '<option value="">โหลดล้มเหลว</option>';
    }
}

async function loadCashTypeList() {
    const selectElem = document.getElementById('cashTypeSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetBanknoteTypeList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // ล้าง "กำลังโหลดข้อมูล..." ออกให้หมด
            selectElem.innerHTML = '';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.banknoteTypeId;

                // รูปแบบการแสดงผล -> Fit : ธนบัตรปิดผนึก
                option.textContent = `${item.banknoteTypeName} `;

                selectElem.appendChild(option);
            });

            // ถ้าใช้ Select2 ต้องเรียก trigger change เพื่อให้ UI อัปเดต
            if ($(selectElem).hasClass("select2")) {
                $(selectElem).trigger('change');
            }
        }
    } catch (error) {
        console.error('Error fetching cash types:', error);
        selectElem.innerHTML = '<option value="">โหลดล้มเหลว</option>';
    }
}

async function loadDenominationList() {
    const selectElem = document.getElementById('denominationSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetDenominationList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // 1. ล้างข้อมูลเก่าและตั้งค่าเริ่มต้น "ทั้งหมด"
            selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

            // 2. กรองเฉพาะ isActive: true และเรียงลำดับจาก "มากไปน้อย"
            const activeSortedData = result.data
                .filter(item => item.isActive === true)
                .sort((a, b) => b.denominationPrice - a.denominationPrice);

            // 3. สร้าง Option จากข้อมูลที่เรียงแล้ว
            activeSortedData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.denominationId;
                // ใช้ Intl.NumberFormat เพื่อเพิ่มคอมม่าให้ตัวเลข (เช่น 1,000) เพื่อความสวยงาม
                option.textContent = new Intl.NumberFormat().format(item.denominationPrice);
                selectElem.appendChild(option);
            });

            // อัปเดต Select2 (ถ้ามีใช้งาน)
            if ($(selectElem).hasClass("select2")) {
                $(selectElem).trigger('change');
            }
        }
    } catch (error) {
        console.error('Error fetching denominations:', error);
        selectElem.innerHTML = '<option value="">ล้มเหลว</option>';
    }
}

async function loadShiftTimeList() {
    const selectElem = document.getElementById('shiftTimeSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetShiftTimeList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // ล้างข้อมูลเก่าออกให้หมดก่อน append ใหม่
            selectElem.innerHTML = '';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.shiftCode;
                option.textContent = item.shiftName;

                // กำหนดให้ All Day (SHIFT04) เป็นตัวเลือกเริ่มต้น
                if (item.shiftCode === 'SHIFT04') {
                    option.selected = true;
                }

                selectElem.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching shift times:', error);
        selectElem.innerHTML = '<option value="">โหลดล้มเหลว</option>';
    }
}


function initDatePicker() {
    const dateEl = document.getElementById('filterDate');
    if (!dateEl) return;

    // 1. คำนวณวันที่และปีปัจจุบัน
    const now = new Date();
    let defaultDate = new Date();

    // กฎ CBMS: เลยเวลา 16:30 น. เป็นวันถัดไป
    if (now.getHours() > 16 || (now.getHours() === 16 && now.getMinutes() >= 30)) {
        defaultDate.setDate(defaultDate.getDate() + 1);
    }

    const currentYear = now.getFullYear(); // ปี ค.ศ. ปัจจุบัน

    // 2. ตั้งค่าขอบเขตวันที่ (Min/Max Date)
    const minDate = new Date();
    minDate.setFullYear(currentYear - 3); // ย้อนหลัง 3 ปี

    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 1);   // ถัดไป 1 วัน

    // 3. ตั้งค่า DateTimePicker พร้อมล็อกรายการปีใน Dropdown
    $.datetimepicker.setLocale('th');
    $(dateEl).datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        lang: 'th',
        yearOffset: 543,
        validateOnBlur: false,
        scrollInput: false,

        // ล็อกช่วงวันที่เลือกได้
        minDate: minDate,
        maxDate: maxDate,

        // --- ล็อกรายการใน Dropdown ปีให้มีแค่ 3-4 ปีตามที่กำหนด ---
        // currentYear - 3 คือปีเริ่มต้น, currentYear + 1 คือปีสิ้นสุด (รวมวันพรุ่งนี้)
        yearStart: currentYear - 3,
        yearEnd: currentYear + 1,

        onChangeDateTime: function (selectedDate) {
            if (typeof fetchData === "function") {
                fetchData(false);
            }

            const currentMachine = $('#stationMachine').val();
            if (currentMachine) {
                loadHeaderCardList(currentMachine);
            }
        }
    });

    // แสดงค่าเริ่มต้นใน Input
    dateEl.value = formatThaiDate(defaultDate);


}

// ฟังก์ชัน Helper สำหรับแปลง Date Object เป็น String พ.ศ. (dd/mm/yyyy)
function formatThaiDate(date) {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
}

function getSelectedDateForApi() {
    const dateStr = document.getElementById('filterDate').value; // "18/02/2569"
    const parts = dateStr.split('/');

    // ลบ 543 เพื่อกลับเป็น ค.ศ.
    const day = parts[0];
    const month = parts[1];
    const year = Number.parseInt(parts[2]) - 543;

    return `${year}-${month}-${day}`; // ส่งค่านี้ "2026-02-18" ไปที่ API
}

function getFilterParams() {
    return {
        machineId: $('#stationMachine').val() || "",
        date: $('#filterDate').val(),
        headercardSelect: $('#headercardSelect').val() || "",
    };
}


// เมื่อกดปุ่มสร้างรายงาน
document.getElementById('btnGenerateReport').addEventListener('click', async function () {
    const btn = this;
    const params = getFilterParams();
    console.log("พารามิเตอร์ที่ใช้ค้นหา:", params);

    //// --- เพิ่มการตรวจสอบ Validation ---
    //if (!params.headercardSelect || params.headercardSelect === "") {
    //    //alert("กรุณาเลือก Header Card ก่อนสร้างรายงาน");
    //    // หรือใช้ SweetAlert2 ถ้ามี: Swal.fire('แจ้งเตือน', 'กรุณาเลือก Header Card', 'warning');
    //    Swal.fire('แจ้งเตือน', 'กรุณาเลือก Header Card' , 'warning');
    //    //$('#headercardSelect').select2('open'); // เปิด dropdown ให้ผู้ใช้เลือกทันที
    //    return;
    //}

    console.log("พารามิเตอร์ที่ใช้ค้นหา:", params);

    // ป้องกันการกดซ้ำและแสดงสถานะ Loading
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> กำลังโหลด...';


    try {
        // --- ส่วนที่แกไข ---
        const response = await fetch('/Report/GetReportSingleHeaderCard', {
            method: 'POST', // 1. เปลี่ยนเป็น POST
            headers: {
                'Content-Type': 'application/json', // 2. ระบุ Content-Type
            },
            body: JSON.stringify(params) // 3. แปลง Object เป็น JSON String
        });
        // ------------------

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.is_success && result.data) {
            console.log("ข้อมูลรายงาน:", result.data);

            renderReport(result.data);

            const container = document.getElementById('report-body');

            if (container) {
                const content = container.innerHTML;
                // ส่ง true เข้าไปเพื่อให้แสดงผลใน iframe (Preview Mode)
                //console.log(content);
                await window.exportPdfByPlaywright(content, 'SingleHeaderCard_Report', true, "landscape");
            }


        } else {
            console.warn("ดึงข้อมูลไม่สำเร็จ:", result.message);
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    } finally {
        // คืนค่าปุ่มให้กดได้ใหม่
        btn.disabled = false;
        btn.innerHTML = originalText;
    }


});


function renderReport(data) {
    const reportContainer = document.getElementById('report-body');
    if (!reportContainer) return;

    // Helper สำหรับจัด Format ตัวเลข
    const fmt = (num) => (num || 0).toLocaleString('en-US');

    const renderBarcode = (label, code, image, isEnd = false) => {
        if (!code) return `<div><strong>${label} :</strong> -</div>`;

        const alignmentClass = isEnd ? 'd-flex justify-content-end' : '';
        return `
            <div class="mt-2"><strong>${label} :</strong> ${code}</div>
            <div class="mt-1 ${alignmentClass}">
                ${image ?
                `<div class="barcode-wrapper-bundle">
                        <img src="${image}" alt="${label}" style="height: 35px; width: 250px;" />
                    </div>` :
                `<div style="letter-spacing: 1px; color: #ccc;"></div>`
            }
            </div>
        `;
    };

    // ส่วนประกอบของ Header
    let html = `
    <style>
        /* แก้ไขคำสะกดจาก <stylet> เป็น <style> */
        .barcode-wrapper-bundle img {
            display: block;
            -webkit-print-color-adjust: exact;
            image-rendering: pixelated;
        }
        .report-title-center {
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
    </style>
    <div class="text-end small">วันที่พิมพ์ : ${data.printDate}</div>
    <div class="report-title-center">Single Header Card Report</div>

    <div class="report-header-info row">
        <div class="col-md-4">
            <div><strong>วันที่นับคัด :</strong> ${data.countingDate}</div>
            <div class="mt-2"><strong>เครื่องจักร :</strong> ${data.machineName}</div>
            ${renderBarcode("บาร์โค้ดรายมัด", data.bundleBarcode, data.bundleBarcodeImage)}
            <div class="mt-2"><strong>ธนาคาร :</strong> ${data.bankName}</div>
            <div class="mt-2"><strong>Operator-Prepare :</strong> ${data.operatorPrepare}</div>
            <div class="mt-2"><strong>Operator-Reconcile :</strong> ${data.operatorReconcile}</div>
        </div>
        <div class="col-md-4 text-center">
            <div class="mt-2"><strong>ประเภทธนบัตร :</strong> ${data.cashType}</div>
        </div>
        <div class="col-md-4 text-end">
            <div><strong>ผลัด :</strong> ${data.shift}</div>
            <div class="mt-2"><strong>Header Card :</strong> ${data.headerCardNo}</div>
            ${renderBarcode("บาร์โค้ดรายห่อ", data.packBarcode, data.packBarcodeImage, true)}
            <div class="mt-2"><strong>ศูนย์เงินสด :</strong> ${data.cashCenter}</div>
            <div class="mt-2"><strong>Operator-Sorter :</strong> ${data.operatorSorter}</div>
            <div class="mt-2"><strong>Supervisor :</strong> ${data.supervisor}</div>
        </div>
    </div>

    <div class="table-responsive mt-3">
        <table class="table table-bordered report-table-custom">
            <thead>
                <tr>                                
                    <th>ชนิดราคา</th>
                    <th>แบบ</th>                                             
                    <th>ดี (+)</th>
                    <th>เสีย (+)</th>
                    <th>Reject (+)</th>
                    <th>ทำลาย (+)</th>
                    <th>ปลอม (0)</th>
                    <th>ชำรุด (0)</th>
                    <th>รวมก่อนปรับ</th>
                    <th>มูลค่าก่อนปรับ</th>
                    <th>ขาด (+)</th>
                    <th>เกิน (-)</th>
                    <th>รวมหลังปรับ</th>
                    <th>รวมหลังปรับทั้งสิ้น</th>
                </tr>
            </thead>
            <tbody>`;

    // วน Loop ข้อมูลตามโครงสร้าง SingleDenominationGroup
    if (data.reportDetails && data.reportDetails.length > 0) {
        data.reportDetails.forEach(group => {
            const rowCount = group.seriesDetails.length;

            group.seriesDetails.forEach((detail, index) => {
                html += `<tr>`;

                // ใส่ TD ชนิดราคา เฉพาะแถวแรกของกลุ่ม (rowspan)
                if (index === 0) {
                    html += `<td rowspan="${rowCount}" class="text-center align-middle"><strong>${group.denomination}</strong></td>`;
                }

                html += `
                    <td>${detail.series}</td>
                    <td class="text-end">${fmt(detail.goodAmount)}</td>
                    <td class="text-end">${fmt(detail.badAmount)}</td>
                    <td class="text-end">${fmt(detail.rejectAmount)}</td>
                    <td class="text-end">${fmt(detail.destroyAmount)}</td>
                    <td class="text-end">${fmt(detail.counterfeitAmount)}</td>
                    <td class="text-end">${fmt(detail.damagedAmount)}</td>
                    <td class="text-end">${fmt(detail.totalBeforeAdjust)}</td>
                    <td class="text-end">${fmt(detail.valueBeforeAdjust)}</td>
                    <td class="text-end">${fmt(detail.shortAmount)}</td>
                    <td class="text-end">${fmt(detail.excessAmount)}</td>
                    <td class="text-end">${fmt(detail.totalAfterAdjust)}</td>
                    <td class="text-end">${fmt(detail.totalValueAfterAdjust)}</td>
                </tr>`;
            });
        });
    } else {
        html += `<tr><td colspan="14" class="text-center">ไม่พบข้อมูลรายละเอียด</td></tr>`;
    }

    html += `</tbody></table></div>`;

    reportContainer.innerHTML = html;
}

async function exportData() {
    const type = document.querySelector('input[name="exportFmt"]:checked').value;

    console.log("export type::");
    console.log(type);

    if (type === "pdf") {
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;
            await window.exportPdfByPlaywright(content, 'SingleHeaderCard_Report', false, "landscape");
        }
    } else if (type === "xlsx") {
        await exportExcelFromHtml(type);
    } else if (type === "csv") {
        await exportExcelFromHtml(type);
    }
}