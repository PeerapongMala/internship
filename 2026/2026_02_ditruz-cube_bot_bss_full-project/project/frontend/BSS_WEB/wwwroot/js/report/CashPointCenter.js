document.addEventListener('DOMContentLoaded', async function () {
    initDatePicker();

    await Promise.all([
        fetchMachineList(),
        loadInstitutionList(),
        loadCashTypeList(),
        loadDenominationList(),
        loadShiftTimeList(),
        loadCashCenterList(),
        loadCashPointList(),
        loadZoneList()
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

    //// สร้าง QueryString
    //const queryString = $.param(params);
    //const reportUrl = `/Report/GetBankSummaryPdf?${queryString}`;

    //// แสดง loading และโหลดเข้าไปใน iframe
    //$("#loadingReport").removeClass("d-none");
    //$("#reportFrame").attr("src", reportUrl);

    //$("#reportFrame").on("load", function () {
    //    $("#loadingReport").addClass("d-none");
    //});



    // เมื่อมีการเปลี่ยนธนาคาร (Institution)
    $('#institutionSelect').on('change', async function () {
        const institutionId = $(this).val();

        // แสดงสถานะกำลังโหลดใน dropdown ลูก
        $('#cashCenterSelect').html('<option value="">กำลังโหลด...</option>').trigger('change');
        $('#cashPointSelect').html('<option value="">กำลังโหลด...</option>').trigger('change');

        // เรียกโหลดข้อมูลใหม่ตาม Filter
        await Promise.all([
            loadCashCenterByFilter(institutionId),
            loadCashPointByFilter(institutionId)
        ]);
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

async function loadCashCenterList() {
    const selectElem = document.getElementById('cashCenterSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetCashCenterList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // 1. ล้างข้อมูลเก่าและตั้งค่าเริ่มต้น "ทั้งหมด"
            selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.cashCenterId;       // เช่น 11
                option.textContent = item.cashCenterName; // เช่น ธนาคารออมสิน
                selectElem.appendChild(option);
            });

            // อัปเดต Select2 (ถ้ามีใช้งาน)
            if ($(selectElem).hasClass("select2")) {
                $(selectElem).trigger('change');
            }
        }
    } catch (error) {
        console.error('Error fetching CashCenter:', error);
        selectElem.innerHTML = '<option value="">ล้มเหลว</option>';
    }
}

async function loadCashPointList() {
    const selectElem = document.getElementById('cashPointSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetCashPointList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // 1. ล้างข้อมูลเก่าและตั้งค่าเริ่มต้น "ทั้งหมด"
            selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.cashpointId;       // เช่น 11
                option.textContent = item.cashpointName; // เช่น ธนาคารออมสิน
                selectElem.appendChild(option);
            });

            // อัปเดต Select2 (ถ้ามีใช้งาน)
            if ($(selectElem).hasClass("select2")) {
                $(selectElem).trigger('change');
            }
        }
    } catch (error) {
        console.error('Error fetching CashPoint:', error);
        selectElem.innerHTML = '<option value="">ล้มเหลว</option>';
    }
}

async function loadZoneList() {
    const selectElem = document.getElementById('zoneSelect');
    if (!selectElem) return;

    try {
        const response = await fetch('/Report/GetZoneList');
        const result = await response.json();

        if (result.is_success && result.data) {
            // 1. ล้างข้อมูลเก่าและตั้งค่าเริ่มต้น "ทั้งหมด"
            selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';


            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.zoneId;       // เช่น 11
                option.textContent = item.zoneName; // เช่น ธนาคารออมสิน
                selectElem.appendChild(option);
            });

            // อัปเดต Select2 (ถ้ามีใช้งาน)
            if ($(selectElem).hasClass("select2")) {
                $(selectElem).trigger('change');
            }
        }
    } catch (error) {
        console.error('Error fetching zone:', error);
        selectElem.innerHTML = '<option value="">ล้มเหลว</option>';
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
        shift: $('#shiftTimeSelect').val() || "",
        cashCenter: $('#cashCenterSelect').val() || "",
        zone: $('#zoneSelect').val() || "",
        cashPoint: $('#cashPointSelect').val() || ""
    };
}

// เมื่อกดปุ่มสร้างรายงาน
document.getElementById('btnGenerateReport').addEventListener('click', async function () {
    const params = getFilterParams();
    console.log("พารามิเตอร์ที่ใช้ค้นหา:", params);


    try {
        // --- ส่วนที่แกไข ---
        const response = await fetch('/Report/GetReportCashPointCenter', {
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
                await window.exportPdfByPlaywright(content, 'CashPointCenter_Report', true, "landscape");
            }


        } else {
            console.warn("ดึงข้อมูลไม่สำเร็จ:", result.message);
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    }


});


function renderReport(data) {
    const reportContainer = document.getElementById('report-body');
    if (!reportContainer) return;

    const fmt = (num) => (num || 0).toLocaleString('en-US');
    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.startsWith('0001')) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH');
    };

    const formatWorkDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US');
    };

    const reportData = data.reportData || {};
    const institutions = reportData.institutions || [];
    const grandTotal = reportData.grandTotal || {};

    const cashType = data.cashType || "";
    // ตรวจสอบว่าเป็นโหมดศูนย์เงินสด (Unfit) หรือโหมดโซนปกติ (Member)
    const isCashCenterMode = (cashType.includes("Unfit") || cashType.includes("Non Member"));
    const secondaryColTitle = isCashCenterMode ? "ศูนย์เงินสด" : "Zone";
    const hasCashPoint = !isCashCenterMode; // ถ้าไม่ใช่ Unfit ให้แสดง Cashpoint

    let html = `
<style>
    /* --- Base Styles --- */
    #report-body {
        background-color: #FFFFFF;
        padding: 20px;
        font-family: "Sarabun", "Pridi", sans-serif;
        color: #000;
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

    .bg-bank { background-color: #d9e9ff !important; font-weight: bold; }
    .bg-subtotal { background-color: #f0f7ff !important; font-weight: bold; }
    .bg-grand { background-color: #adb9ca !important; font-weight: bold; }

    /* --- Print Styles สำหรับ Playwright --- */
    @media print {
        @page {
            size: A4 landscape;
            margin: 0mm; /* คงไว้เพื่อซ่อนเส้นวันที่/เลขหน้า */
        }

        #report-body {
        /* ปรับ padding-top เพื่อกำหนดระยะห่างจากขอบบนกระดาษในหน้าที่ 2 เป็นต้นไป */
        padding-top: 1.5cm !important;
        padding-left: 1cm !important;
        padding-right: 1cm !important;
        padding-bottom: 1cm !important;

        margin: 0;
        width: 100% !important;
        box-sizing: border-box;
        background-color: white;
    }

        /* 2. บังคับหัวตารางแสดงทุกหน้า (โดยไม่มี Row เกิน) */
        thead {
            display: table-header-group;
        }

        /* ลบ thead::before ของเก่าออกเพื่อกำจัด Row ที่เกินมา */
        thead::before {
            display: none !important;
        }

        /* 3. ปรับปรุงการแสดงผลตารางให้เส้นไม่ขาดและไม่มี Row หลอก */
        .table-report {
        border-collapse: collapse !important;
        width: 100% !important;
        /* ระยะห่างนี้จะช่วยให้ตารางที่ขึ้นหน้าใหม่ไม่ไปแปะชิดกับขอบ Padding จนเกินไป */
        margin-top: 10px;
        margin-bottom: 20px;
    }

        tr {
            page-break-inside: avoid !important;
        }

        .table-report th,
        .table-report td {
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }
</style>

<div class="text-end" style="font-size: 10px; margin-bottom: 5px;">วันที่พิมพ์ : ${new Date(data.printDate).toLocaleString('th-TH')}</div>
    <div class="report-title-center">${data.reportTitle}</div>

    <div class="report-header-info">
        <div style="width: 35%;">
            <div><strong>วันที่นับคัด :</strong> ${formatWorkDate(data.workDate)}</div>
            <div><strong>ชนิดราคา :</strong> ${data.denominationType === "5" ? "ทั้งหมด" : data.denominationType}</div>
            <div><strong>Operator-Prepare :</strong> ${data.preparedBy || '-'}</div>
            <div><strong>Operator-Reconcile :</strong> ${data.reconciledBy || '-'}</div>
        </div>
        <div style="width: 30%;"></div>
        <div style="width: 35%; text-align: right;">
            <div><strong>เครื่องจักร :</strong> ${data.machineName}</div>
            <div><strong>ผลัด :</strong> ${data.shift || '-'}</div>
            <div><strong>Operator-Sorter :</strong> ${data.sorterBy || '-'}</div>
            <div><strong>Supervisor :</strong> ${data.supervisorName || '-'}</div>
        </div>
    </div>

    <table class="table-report">
        <thead>
            <tr>
                <th style="width: 12%;">ธนาคาร</th>
                <th style="width: 12%;">${secondaryColTitle}</th>
                ${hasCashPoint ? '<th style="width: 10%;">Cashpoint</th>' : ''}
                <th style="width: 5%;">ชนิดราคา</th>
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
                <th>มูลค่าหลังปรับทั้งสิ้น</th>
            </tr>
        </thead>
        <tbody>
    `;

    institutions.forEach(inst => {
        // คำนวณ rowspan รวมของธนาคาร
        let totalInstRows = inst.zones.reduce((acc, zone) => {
            let detailsCount = zone.denominations.reduce((dAcc, d) => dAcc + (d.details ? d.details.length : 1), 0);
            return acc + detailsCount + 1;
        }, 0);

        // 1. แถวสรุปธนาคาร
        html += `
            <tr class="bg-bank">
                <td colspan="${hasCashPoint ? 4 : 3}" class="text-center">รวม ${inst.institutionName}</td>
                <td>${fmt(inst.totalGood)}</td>
                <td>${fmt(inst.totalBad)}</td>
                <td>${fmt(inst.totalReject)}</td>
                <td>${fmt(inst.totalDestroy)}</td>
                <td>${fmt(inst.totalCounterfeit)}</td>
                <td>${fmt(inst.totalDamaged)}</td>
                <td>${fmt(inst.totalPreAdjust)}</td>
                <td>${fmt(inst.totalPreValue || 0)}</td>
                <td>${fmt(inst.totalShort)}</td>
                <td>${fmt(inst.totalOver)}</td>
                <td>${fmt(inst.totalFinalAmount)}</td>
                <td>${fmt(inst.totalValue)}</td>
            </tr>
        `;

        inst.zones.forEach((zone, zIdx) => {
            // ดึงชื่อที่จะแสดงในคอลัมน์ที่ 2 (Zone หรือ ศูนย์)
            const zoneDisplayName = isCashCenterMode ? (zone.cashCenterName || "-") : (zone.zoneName || "-");

            const rowsInZone = zone.denominations.reduce((acc, denom) => {
                return acc + (denom.details ? denom.details.length : 0);
            }, 0);

            // 2. แถวสรุป Zone / ศูนย์เงินสด
            html += `
                <tr class="bg-subtotal">
                    ${zIdx === 0 ? `<td rowspan="${totalInstRows}" class="text-center">${inst.institutionName}</td>` : ''}
                    <td colspan="${hasCashPoint ? 3 : 2}" class="text-center">รวม ${secondaryColTitle} ${zoneDisplayName}</td>
                    <td>${fmt(zone.totalGood)}</td>
                    <td>${fmt(zone.totalBad)}</td>
                    <td>${fmt(zone.totalReject)}</td>
                    <td>${fmt(zone.totalDestroy)}</td>
                    <td>${fmt(zone.totalCounterfeit)}</td>
                    <td>${fmt(zone.totalDamaged)}</td>
                    <td>${fmt(zone.totalPreAdjust)}</td>
                    <td>${fmt(zone.totalPreValue || 0)}</td>
                    <td>${fmt(zone.totalShort)}</td>
                    <td>${fmt(zone.totalOver)}</td>
                    <td>${fmt(zone.totalFinalAmount)}</td>
                    <td>${fmt(zone.totalValue)}</td>
                </tr>
            `;

            let isFirstRowInZone = true;

            zone.denominations.forEach((denom) => {
                const details = denom.details || [];

                details.forEach((det) => {
                    html += `
                <tr>
                    ${isFirstRowInZone ? `<td rowspan="${rowsInZone}" class="text-center">${zoneDisplayName}</td>` : ''}
                    ${hasCashPoint ? `<td class="text-center">${det.cashPointName || "-"}</td>` : ''}
                    <td>${fmt(denom.denomination)}</td>
                    <td>${fmt(det.totalGood)}</td>
                    <td>${fmt(det.totalBad)}</td>
                    <td>${fmt(det.totalReject)}</td>
                    <td>${fmt(det.totalDestroy)}</td>
                    <td>${fmt(det.totalCounterfeit)}</td>
                    <td>${fmt(det.totalDamaged)}</td>
                    <td>${fmt(det.totalPreAdjust)}</td>
                    <td>${fmt(det.totalValue)}</td>
                    <td>${fmt(det.totalShort)}</td>
                    <td>${fmt(det.totalOver)}</td>
                    <td>${fmt(det.totalFinalAmount)}</td>
                    <td>${fmt(det.totalValue)}</td>
                </tr>
            `;
                    isFirstRowInZone = false; // บรรทัดต่อๆ ไปใน Zone นี้จะไม่ใส่ td ของ Zone อีก
                });
            });
        });
    });

    // 4. แถว Grand Total
    html += `
        <tr class="bg-grand">
            <td colspan="${hasCashPoint ? 4 : 3}" class="text-center">รวมทั้งหมด</td>
            <td>${fmt(grandTotal.totalGood)}</td>
            <td>${fmt(grandTotal.totalBad)}</td>
            <td>${fmt(grandTotal.totalReject)}</td>
            <td>${fmt(grandTotal.totalDestroy)}</td>
            <td>${fmt(grandTotal.totalCounterfeit)}</td>
            <td>${fmt(grandTotal.totalDamaged)}</td>
            <td>${fmt(grandTotal.totalPreAdjust)}</td>
            <td>${fmt(grandTotal.totalPreValue || 0)}</td>
            <td>${fmt(grandTotal.totalShort)}</td>
            <td>${fmt(grandTotal.totalOver)}</td>
            <td>${fmt(grandTotal.totalFinalAmount)}</td>
            <td>${fmt(grandTotal.totalValue)}</td>
        </tr>
    </tbody></table>`;

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
            await window.exportPdfByPlaywright(content, 'CashPointCashCenter_Report', false, "landscape");
        }
    } else if (type === "xlsx") {
        await exportExcelFromHtml(type);
    } else if (type === "csv") {
        await exportExcelFromHtml(type);
    }
}




async function exportExcelFromHtml(type) {
    $("#pageloading").fadeIn();
    try {
        // 1. ดึงข้อมูลพารามิเตอร์ที่ใช้ในการค้นหา (ชุดเดียวกับที่ใช้กดปุ่มสร้างรายงาน)
        const params = getFilterParams();

        // 2. เรียกไปที่ Controller ด้วย POST และส่ง JSON Body
        const response = await fetch('/Report/CashPointCashCenterExportToExcel', {
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
        a.download = `CashPointCashCenterReport_${dateStr}.` + type;

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





async function loadCashCenterByFilter(institutionId) {
    const selectElem = document.getElementById('cashCenterSelect');
    if (!selectElem) return;

    try {
        // ถ้าเลือก "ทั้งหมด" (all) อาจจะส่งค่าว่างหรือ 0 ไปที่ API ขึ้นอยู่กับ Backend
        const url = `/Report/GetCashCenterByFilter?institutionId=${institutionId === 'all' ? '' : institutionId}`;
        const response = await fetch(url);
        const result = await response.json();

        selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

        if (result.is_success && result.data) {
            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.cashCenterId;
                option.textContent = item.cashCenterName;
                selectElem.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error filtering CashCenter:', error);
        selectElem.innerHTML = '<option value="">โหลดล้มเหลว</option>';
    } finally {
        $(selectElem).trigger('change'); // อัปเดต Select2
    }
}

async function loadCashPointByFilter(institutionId) {
    const selectElem = document.getElementById('cashPointSelect');
    if (!selectElem) return;

    try {
        const url = `/Report/GetCashPointByFilter?institutionId=${institutionId === 'all' ? '' : institutionId}`;
        const response = await fetch(url);
        const result = await response.json();

        selectElem.innerHTML = '<option value="all">ทั้งหมด</option>';

        if (result.is_success && result.data) {
            result.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.cashpointId;
                option.textContent = item.cashpointName;
                selectElem.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error filtering CashPoint:', error);
        selectElem.innerHTML = '<option value="">โหลดล้มเหลว</option>';
    } finally {
        $(selectElem).trigger('change'); // อัปเดต Select2
    }
}