const USE_MOCK_DATA = false;

var storedIds = [];
var vcSortState = BssSort.createState();
var currentDetailData = [];

// Init
document.addEventListener("DOMContentLoaded", () => {
    showCurrentDateTime();
    setInterval(showCurrentDateTime, 1000);
    initPage();
});

function initPage() {
    // Read data from localStorage (passed from Auto Selling page)
    try {
        var vd = JSON.parse(localStorage.getItem('verifyData') || '{}');
        storedIds = vd.summaryIds || [];
    } catch (e) {
        storedIds = [];
    }

    if (storedIds.length === 0) {
        showVerifyError('ไม่พบข้อมูลรายการที่เลือก กรุณากลับไปหน้า Auto Selling');
        return;
    }

    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }

    loadVerifyDetailFromStorage();
}

// Load detail rows from localStorage (ส่งมาจาก Auto Selling — ไม่ต้องเรียก API)
function loadVerifyDetailFromStorage() {
    var allRows = [];
    try {
        var vd = JSON.parse(localStorage.getItem('verifyData') || '{}');
        allRows = vd.detailRows || [];
    } catch (e) {
        allRows = [];
    }

    if (allRows.length > 0) {
        var aggregated = aggregateRows(allRows);
        currentDetailData = aggregated;
        renderDetailTable(aggregated);
        renderSummary(aggregated);
    } else {
        showVerifyError('ไม่พบรายละเอียดธนบัตร');
    }
}

// Aggregate rows with same denomination + type + series
function aggregateRows(rows) {
    var map = {};
    rows.forEach(function (row) {
        var key = row.DenominationPrice + '|' + row.Type + '|' + (row.Series || '');
        if (!map[key]) {
            map[key] = {
                DenominationPrice: row.DenominationPrice,
                Type: row.Type,
                Series: row.Series,
                Qty: 0,
                Shortage: 0,
                Excess: 0
            };
        }
        map[key].Qty += row.Qty;
        map[key].Shortage += row.Shortage || 0;
        map[key].Excess += row.Excess || 0;
    });

    return Object.keys(map).map(function (key) { return map[key]; });
}

// Mock Data
function loadMockData() {
    // Info card
    setText("infoSupervisor", "ไพศาล เสาวลักษณ์");
    setText("infoSortingMachine", "กรุงเทพฯ M7-1 ศกท.");

    // Detail table
    const mockDetail = [
        { DenominationPrice: 1000, Type: "ดี",     Series: 17,   Qty: 2986, Shortage: 0, Excess: 0 },
        { DenominationPrice: 1000, Type: "ทำลาย",  Series: 17,   Qty: 3,    Shortage: 0, Excess: 0 },
        { DenominationPrice: 1000, Type: "Reject",  Series: 16,   Qty: 11,   Shortage: 0, Excess: 0 },
        { DenominationPrice: 1000, Type: "ปลอม",   Series: null, Qty: 1,    Shortage: 0, Excess: 0 },
    ];

    currentDetailData = mockDetail;
    renderDetailTable(mockDetail);
    renderSummary(mockDetail);
}

// Render Detail Table
function renderDetailTable(data) {
    const tbody = document.getElementById("detailTableBody");
    if (!tbody) return;

    let html = "";

    data.forEach(row => {
        const denomClass = getDenomBadgeClass(row.DenominationPrice);
        const seriesText = row.Series != null ? row.Series : "";
        const shortageText = row.Shortage > 0 ? numberWithCommas(row.Shortage) : "-";
        const excessText = row.Excess > 0 ? numberWithCommas(row.Excess) : "-";

        html += `<tr>
            <td><span class="${denomClass}">${row.DenominationPrice}</span></td>
            <td>${escapeHtml(row.Type)}</td>
            <td>${seriesText}</td>
            <td class="vc-td-qty">${numberWithCommas(row.Qty)}</td>
            <td class="vc-td-center">${shortageText}</td>
            <td class="vc-td-center">${excessText}</td>
        </tr>`;
    });

    // Add empty rows for visual spacing (match Figma — max 6 total rows visible)
    const emptyRowCount = Math.max(0, 6 - data.length);
    for (let i = 0; i < emptyRowCount; i++) {
        html += `<tr class="vc-empty-row"><td colspan="6"></td></tr>`;
    }

    tbody.innerHTML = html;
}

// Render Summary
function renderSummary(data) {
    let sumGood = 0;
    let sumReject = 0;
    let sumShortage = 0;
    let sumExcess = 0;
    let sumDamaged = 0;
    let sumCounterfeit = 0;

    data.forEach(row => {
        var t = (row.Type || '').toLowerCase();
        if (t.indexOf('ดี') >= 0 || t.indexOf('เสีย') >= 0 || t.indexOf('ทำลาย') >= 0) {
            sumGood += row.Qty;
        } else if (t.indexOf('reject') >= 0) {
            sumReject += row.Qty;
        } else if (t.indexOf('ปลอม') >= 0) {
            sumCounterfeit += row.Qty;
        } else if (t.indexOf('ชำรุด') >= 0) {
            sumDamaged += row.Qty;
        } else if (t.indexOf('ขาด') >= 0) {
            sumShortage += row.Qty;
        } else if (t.indexOf('เกิน') >= 0) {
            sumExcess += row.Qty;
        }
    });

    const sumTotal = sumGood + sumReject + sumShortage + sumExcess + sumDamaged + sumCounterfeit;

    setText("sumGood", numberWithCommas(sumGood));
    setText("sumReject", sumReject > 0 ? numberWithCommas(sumReject) : "-");
    setText("sumShortage", sumShortage > 0 ? numberWithCommas(sumShortage) : "-");
    setText("sumExcess", sumExcess > 0 ? numberWithCommas(sumExcess) : "-");
    setText("sumDamaged", sumDamaged > 0 ? numberWithCommas(sumDamaged) : "-");
    setText("sumCounterfeit", sumCounterfeit > 0 ? numberWithCommas(sumCounterfeit) : String(sumCounterfeit));
    setText("sumTotal", numberWithCommas(sumTotal));
}

// Button Handlers
function goBackToAutoSelling() {
    // เก็บ verifyData ไว้ (มี selected1Ids/selected2Ids สำหรับ restore checkbox เมื่อกลับหน้า Auto Selling)
    // ลบเฉพาะ summaryIds + detailRows
    try {
        var vd = JSON.parse(localStorage.getItem('verifyData') || '{}');
        delete vd.summaryIds;
        delete vd.detailRows;
        localStorage.setItem('verifyData', JSON.stringify(vd));
    } catch (e) {
        localStorage.removeItem('verifyData');
    }
    window.location.href = rootPath + "AutoSelling/AutoSelling";
}

function printData() {
    window.print();
}

// Verify flow: click Verify -> show confirm modal
function verifyAction() {
    new bootstrap.Modal(document.getElementById("verifyConfirmModal")).show();
}

// Confirm: call real API to verify all selected IDs
function confirmVerify(event) {
    bootstrap.Modal.getInstance(document.getElementById("verifyConfirmModal"))?.hide();

    if (storedIds.length === 0) {
        showVerifyError('ไม่พบรายการที่ต้อง Verify');
        return;
    }

    $.enablePageLoader();

    // Call ValidateSummary first, then verify each reconcile tran
    $.requestAjax({
        service: 'AutoSelling/ValidateSummary',
        type: 'POST',
        parameter: { SelectedIds: storedIds },
        enableLoader: false,
        onSuccess: function (response) {
            if (response && response.is_success && response.data && response.data.isValid) {
                // Batch verify — call VerifyAction for each ID
                batchVerify(response.data.validIds || storedIds);
            } else {
                $.disablePageLoader();
                var msg = (response && response.data && response.data.message) || 'ไม่ผ่านการตรวจสอบ';
                showVerifyError(msg);
            }
        },
        onError: function () {
            $.disablePageLoader();
            showVerifyError('เกิดข้อผิดพลาดในการตรวจสอบ');
        }
    });
}

function batchVerify(validIds) {
    var completed = 0;
    var totalCalls = validIds.length;
    var hasError = false;
    var errorMsg = '';

    validIds.forEach(function (id) {
        $.requestAjax({
            service: 'AutoSelling/VerifyAction',
            type: 'POST',
            parameter: { VerifyTranId: id },
            enableLoader: false,
            onSuccess: function (response) {
                // $.requestAjax เข้า onSuccess เมื่อ is_success=true เท่านั้น → ถือว่าสำเร็จ
                completed++;
                if (completed >= totalCalls) {
                    $.disablePageLoader();
                    if (hasError) {
                        showVerifyError(errorMsg);
                    } else {
                        showVerifySuccess('บันทึกข้อมูลสำเร็จ');
                    }
                }
            },
            onError: function () {
                hasError = true;
                errorMsg = 'เกิดข้อผิดพลาดในการ Verify';
                completed++;
                if (completed >= totalCalls) {
                    $.disablePageLoader();
                    showVerifyError(errorMsg);
                }
            }
        });
    });
}

function showVerifySuccess(message) {
    const el = document.getElementById("verifySuccessMessage");
    if (el) el.textContent = message;
    new bootstrap.Modal(document.getElementById("verifySuccessModal")).show();
}

function showVerifyError(message) {
    const el = document.getElementById("verifyErrorMessage");
    if (el) el.textContent = message;
    new bootstrap.Modal(document.getElementById("verifyErrorModal")).show();
}

function closeSuccessModal() {
    bootstrap.Modal.getInstance(document.getElementById("verifySuccessModal"))?.hide();
    // Verify สำเร็จ — ล้างทุกอย่าง
    localStorage.removeItem('verifyData');
    window.location.href = rootPath + "AutoSelling/AutoSelling";
}

// Sort
function sortVcTable(column) {
    BssSort.toggle(vcSortState, column);
    var sorted = currentDetailData.slice().sort(function (a, b) {
        return BssSort.compare(a, b, vcSortState.column, vcSortState.direction);
    });
    renderDetailTable(sorted);
    BssSort.updateIcons('vcDetailTable', vcSortState.column, vcSortState.direction);
}

// Utilities
function showCurrentDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const yearBE = now.getFullYear() + 543;
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const dateStr = `${day}/${month}/${yearBE} ${hours}:${minutes}`;

    const el = document.getElementById("infoDate");
    if (el) el.textContent = dateStr;
}

function numberWithCommas(x) {
    if (x == null) return "-";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function getDenomBadgeClass(price) {
    const p = parseInt(price);
    if ([20, 50, 100, 500, 1000].includes(p)) return `qty-badge qty-${p}`;
    return "qty-badge";
}

function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
