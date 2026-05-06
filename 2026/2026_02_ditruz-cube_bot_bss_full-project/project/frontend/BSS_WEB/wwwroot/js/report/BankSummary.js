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
        //placeholder: '-- ทั้งหมด --',
        allowClear: false
    });

    // --- แก้ไขจุดนี้ ---
    // เรียกใช้ฟังก์ชันที่คุณเขียนไว้เพื่อดึงค่าเริ่มต้นจากหน้าจอ
    const params = getFilterParams();

    // สร้าง QueryString
    const queryString = $.param(params);
    const reportUrl = `/Report/GetBankSummaryPdf?${queryString}`;

    // แสดง loading และโหลดเข้าไปใน iframe
    $("#loadingReport").removeClass("d-none");
    $("#reportFrame").attr("src", reportUrl);

    $("#reportFrame").on("load", function () {
        $("#loadingReport").addClass("d-none");
    });
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
        institutionId: $('#institutionSelect').val() || "",
        cashTypeId: $('#cashTypeSelect').val() || "",
        denominationId: $('#denominationSelect').val() || "",
        date: $('#filterDate').val(),
        shift: $('#shiftTimeSelect').val() || ""
    };
}

// เมื่อกดปุ่มสร้างรายงาน
document.getElementById('btnGenerateReport').addEventListener('click', async function () {
    const params = getFilterParams();
    console.log("พารามิเตอร์ที่ใช้ค้นหา:", params);


    try {
        // --- ส่วนที่แกไข ---
        const response = await fetch('/Report/GetReportBankSummary', {
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
            // จัดการข้อมูลรายงานตรงนี้
            renderReport(result.data);


            const container = document.getElementById('report-body');




            if (container) {
                const content = container.innerHTML;
                // ส่ง true เข้าไปเพื่อให้แสดงผลใน iframe (Preview Mode)
                //console.log(content);
                await window.exportPdfByPlaywright(content, 'BankSummary_Report', true, "landscape");
            }


        } else {
            console.warn("ดึงข้อมูลไม่สำเร็จ:", result.message);
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    }




});

async function exportData() {
    const type = document.querySelector('input[name="exportFmt"]:checked').value;

    console.log("export type::");
    console.log(type);

    if (type === "pdf") {
        //await exportPdf('report-body', 'BankSummary');
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;
            await window.exportPdfByPlaywright(content, 'BankSummary_Report', false, "landscape");
        }
    } else if (type === "excel") {
        await exportExcelFromHtml();
    } else if (type === "csv") {
        await exportExcelFromHtml();
    }
}

async function exportExcelFromHtml() {
    $("#pageloading").fadeIn();
    try {
        // 1. ดึงข้อมูลพารามิเตอร์ที่ใช้ในการค้นหา (ชุดเดียวกับที่ใช้กดปุ่มสร้างรายงาน)
        const params = getFilterParams();

        // 2. เรียกไปที่ Controller ด้วย POST และส่ง JSON Body
        const response = await fetch('/Report/BankSummaryExportToExcel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // หากระบบมี Anti-Forgery Token ให้ใส่เพิ่มที่นี่
                // 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "ดาวน์โหลดข้อมูลล้มเหลว");
        }

        // 3. รับข้อมูลเป็น Blob (Binary Large Object)
        const blob = await response.blob();

        // 4. สร้าง Link ชั่วคราวเพื่อสั่ง Download ไฟล์
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // ตั้งชื่อไฟล์: BankSummary_20240304.xlsx
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        a.download = `BankSummaryReport_${dateStr}.xlsx`;

        document.body.appendChild(a);
        a.click();

        // 5. Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error("Export error:", error);
        alert("เกิดข้อผิดพลาดในการ Export Excel: " + error.message);
    } finally {
        // ปิด Loading ไม่ว่าจะสำเร็จหรือไม่ก็ตาม
        $("#pageloading").fadeOut();
    }
}

// ฟังก์ชันสำหรับแปลง JSON เป็น HTML Report
function renderReport(data) {
    const reportContainer = document.getElementById('report-body');

    if (!reportContainer) {
        console.error("หา Element ID 'report-body' ไม่เจอ!");
        return;
    }

    const fmt = (num) => (num || 0).toLocaleString('en-US');

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.startsWith('0001')) return '-';
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    let html = `
    <style>
        /* จำกัด CSS ให้อยู่เฉพาะภายใต้ #report-body เท่านั้น */
        #report-body {
            background-color: #FFFFFF !important; /* บังคับพื้นหลังขาว */
            min-height: 100%;
            margin: 0;
            padding: 40px; /* ระยะห่างขอบกระดาษ */
            box-sizing: border-box;
            font-family: "Pridi", "Sarabun", sans-serif;
            color: #000;
        }

        /* 2. บังคับให้ทุก Element ภายใต้ report-body มีพื้นหลังสีขาว (ถ้าไม่ได้ระบุเป็นอย่างอื่น) */
        #report-body * {
            background-color: transparent;
        }

        #report-body .report-title-center { 
            text-align: center; 
            font-weight: bold; 
            font-size: 20px; 
            margin-bottom: 20px; 
            text-decoration: underline;
        }

        #report-body .report-header-info { 
            display: flex; 
            width: 100%; 
            margin-bottom: 1.5rem; 
            font-size: 13px;
        }

        #report-body .col-md-4 { flex: 1; width: 33.33%; }
        #report-body .text-center { text-align: center; }
        #report-body .text-end { text-align: right; }
        #report-body .text-navy { color: #003366; }
        #report-body .small { font-size: 11px; }
        #report-body .mt-2 { margin-top: 8px; }
        
        #report-body .table-report { 
            width: 100%; 
            border-collapse: collapse !important; 
            font-size: 8px;
            border: 1.5px solid #000 !important;
        }

        #report-body .table-report th { 
            background-color: #f2f2f2 !important; 
            border: 1.5px solid #000 !important;
            padding: 8px 4px;
            -webkit-print-color-adjust: exact;
            text-align: center;
        }

        #report-body .table-report td { 
            border: 1px solid #000 !important;
            padding: 6px 4px;
            text-align: center;
        }

        /* ป้องกัน CSS หน้าหลักมาทำให้ตารางพัง */
        #report-body table, #report-body tr, #report-body td, #report-body th {
            box-sizing: border-box;
        }

         .table-report {
        width: 100%;
        border-collapse: collapse;
        border: 1.2px solid #000;
        table-layout: auto;
    }

    .table-report th,
    .table-report td {
        border: 1px solid #000;
        padding: 2px 4px !important;
        font-size: 8.5px !important;
        line-height: 1.1 !important;
    }

        @media print {
            @page { size: A4 landscape; margin: 0; }
        }
    </style>

    <div class="report-title-center">${data.reportTitle || 'Bank Summary Report'}</div>
    
    <div class="report-header-info">
        <div class="col-md-4">
            <div><strong>Machine:</strong> ${data.machineName || '-'}</div>
            <div><strong>Prepared By:</strong> ${data.preparedBy || '-'}</div>
            <div><strong>Reconciled By:</strong> ${data.reconciledBy || '-'}</div>
        </div>
        <div class="col-md-4 text-center">
            <div class="text-navy"><strong>${data.branchName || 'CC'}</strong></div>
            <div class="text-navy small">${data.shift || '-'}</div>
            <div class="mt-2"><strong>Denomination:</strong> ${data.denominationType || 'All'}</div>
        </div>
        <div class="col-md-4 text-end">
            <div><strong>Print Date:</strong> ${formatDate(data.printDate)}</div>
            <div><strong>Work Date:</strong> ${formatDate(data.workDate)}</div>
            <div><strong>Operator:</strong> ${data.operatorName || '-'}</div>
            <div><strong>Supervisor:</strong> ${data.supervisorName || '-'}</div>
        </div>
    </div>

    <div class="table-responsive" style="border: none !important;">
        <table class="table-report">
            <thead>
                <tr>
                    <th>ธนาคาร</th>
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
                    <th>มูลค่าหลังปรับ</th>
                </tr>
            </thead>
            <tbody>
    `;

    // 1. วนลูปข้อมูล Bank Summaries
    data.bankSummaries.forEach(bank => {
        // แถวรวมของแต่ละธนาคาร
        html += `
            <tr style="background-color: #d9e9ff !important; font-weight: bold; -webkit-print-color-adjust: exact;">
                <td colspan="3">รวม ${bank.bankName}</td>
                <td>${fmt(bank.goodQty)}</td>
                <td>${fmt(bank.badQty)}</td>
                <td>${fmt(bank.rejectQty)}</td>
                <td>${fmt(bank.destroyQty)}</td>
                <td>${fmt(bank.counterfeitQty)}</td>
                <td>${fmt(bank.mutilatedQty)}</td>
                <td>${fmt(bank.totalQtyBeforeAdjust)}</td>
                <td>${fmt(bank.totalValueBeforeAdjust)}</td>
                <td>${fmt(bank.ShortQty)}</td>
                <td>${fmt(bank.ExcessQty)}</td>
                <td>${fmt(bank.totalQtyAfterAdjust)}</td>
                <td>${fmt(bank.totalValueAfterAdjust)}</td>
            </tr>
        `;

        // 2. วนลูปรายละเอียดชนิดราคา
        bank.denominations.forEach(denom => {
            html += `
                <tr>
                    <td>${bank.bankName}</td>
                    <td>${denom.denominationValue}</td>
                    <td>${denom.modelSeries}</td>
                    <td>${fmt(denom.goodQty)}</td>
                    <td>${fmt(denom.badQty)}</td>
                    <td>${fmt(denom.rejectQty)}</td>
                    <td>${fmt(denom.destroyQty)}</td>
                    <td>${fmt(denom.counterfeitQty)}</td>
                    <td>${fmt(denom.mutilatedQty)}</td>
                    <td>${fmt(denom.totalQtyBeforeAdjust)}</td>
                    <td>${fmt(denom.totalValueBeforeAdjust)}</td>
                    <td>${fmt(denom.ShortQty)}</td>
                    <td>${fmt(denom.ExcessQty)}</td>
                    <td>${fmt(denom.totalQtyAfterAdjust)}</td>
                    <td>${fmt(denom.totalValueAfterAdjust)}</td>
                </tr>
            `;
        });
    });

    // 3. แถวรวมทั้งหมด
    if (data.grandTotal) {
        html += `
            <tr style="background-color: #adb9ca !important; font-weight: bold; -webkit-print-color-adjust: exact;">
                <td colspan="3">รวมทั้งหมด</td>
                <td>${fmt(data.grandTotal.goodQty)}</td>
                <td>${fmt(data.grandTotal.badQty)}</td>
                <td>${fmt(data.grandTotal.rejectQty)}</td>
                <td>${fmt(data.grandTotal.destroyQty)}</td>
                <td>${fmt(data.grandTotal.counterfeitQty)}</td>
                <td>${fmt(data.grandTotal.mutilatedQty)}</td>
                <td>${fmt(data.grandTotal.totalQtyBeforeAdjust)}</td>
                <td>${fmt(data.grandTotal.totalValueBeforeAdjust)}</td>
                <td>${fmt(data.grandTotal.ShortQty)}</td>
                <td>${fmt(data.grandTotal.ExcessQty)}</td>
                <td>${fmt(data.grandTotal.totalQtyAfterAdjust)}</td>
                <td>${fmt(data.grandTotal.totalValueAfterAdjust)}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    </div>
    `;

    reportContainer.innerHTML = html;
}



