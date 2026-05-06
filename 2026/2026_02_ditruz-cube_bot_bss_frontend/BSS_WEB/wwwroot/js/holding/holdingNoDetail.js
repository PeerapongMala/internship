const USE_MOCK_DATA = true;

// Init
document.addEventListener("DOMContentLoaded", () => {
    showCurrentDateTime();
    setInterval(showCurrentDateTime, 1000);
    initPage();
});

function initPage() {
    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }
    // TODO: load real data from API
    // $.enablePageLoader();
    // try { await loadHoldingDetail(); } finally { $.disablePageLoader(); }
}

// Mock Data
function loadMockData() {
    // Info card (override server-rendered values for demo)
    setText("infoSorter", "ไพศาล เสาวลักษณ์");
    setText("infoReconciliator", "สมวลัย หมาดี");
    setText("infoSortingMachine", "กรุงเทพฯ M7-1 ศกท.");
    setText("infoShift", "ผลัดบ่าย");

    // Detail table
    const mockDetail = [
        { DenominationPrice: 1000, Type: "ทำลาย", Series: 17,   Qty: 1990 },
        { DenominationPrice: 1000, Type: "ดี",     Series: 17,   Qty: 2986 },
        { DenominationPrice: 1000, Type: "ทำลาย", Series: 16,   Qty: 3 },
        { DenominationPrice: 1000, Type: "Reject", Series: 16,   Qty: 11 },
        { DenominationPrice: 1000, Type: "ปลอม",  Series: null, Qty: 1 },
    ];

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

        html += `<tr>
<<<<<<< HEAD
            <td><span class="${denomClass}">${numberWithCommas(row.DenominationPrice)}</span></td>
=======
            <td><span class="${denomClass}">${row.DenominationPrice}</span></td>
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            <td>${escapeHtml(row.Type)}</td>
            <td>${seriesText}</td>
            <td class="hn-td-qty">${numberWithCommas(row.Qty)}</td>
        </tr>`;
    });

    // Add empty rows for visual spacing (match Figma — visible rows)
    const emptyRowCount = Math.max(0, 6 - data.length);
    for (let i = 0; i < emptyRowCount; i++) {
        html += `<tr class="hn-empty-row"><td colspan="4"></td></tr>`;
    }

    tbody.innerHTML = html;
}

// Render Summary
function renderSummary(data) {
    let sumGood = 0;
    let sumReject = 0;
    let sumCounterfeit = 0;
    let sumExcess = 0;

    data.forEach(row => {
        if (row.Type === "ดี" || row.Type === "ทำลาย" || row.Type === "เสีย") {
            sumGood += row.Qty;
        } else if (row.Type === "Reject") {
            sumReject += row.Qty;
        } else if (row.Type === "ปลอม" || row.Type === "ชำรุด") {
            sumCounterfeit += row.Qty;
        }
    });

    const sumTotal = sumGood + sumReject + sumCounterfeit;

    setText("sumGood", numberWithCommas(sumGood));
    setText("sumReject", sumReject > 0 ? numberWithCommas(sumReject) : "-");
    setText("sumCounterfeit", sumCounterfeit > 0 ? numberWithCommas(sumCounterfeit) : "-");
    setText("sumExcess", sumExcess > 0 ? numberWithCommas(sumExcess) : "-");
    setText("sumTotal", numberWithCommas(sumTotal));
}

// Navigation
function goToReconcileTransaction() {
    window.location.href = "/Reconcilation/ReconcileTransaction";
}

function printData() {
    window.print();
}

// Reject flow: click ส่งยอด Reject -> show confirm modal
function rejectAction() {
    new bootstrap.Modal(document.getElementById("rejectConfirmModal")).show();
}

// Confirm: normal click = success, Shift+click = error (mock toggle)
function confirmReject(event) {
    bootstrap.Modal.getInstance(document.getElementById("rejectConfirmModal"))?.hide();

    const simulateError = event && event.shiftKey;

    if (USE_MOCK_DATA) {
        setTimeout(() => {
            if (simulateError) {
                showRejectError("มีข้อผิดพลาดในการส่งยอด Reject");
            } else {
                showRejectSuccess("ส่งข้อมูลสำเร็จ");
            }
        }, 500);
        return;
    }

    // TODO: Real API call
    // callRejectApi()
    //   .then(() => showRejectSuccess("ส่งข้อมูลสำเร็จ"))
    //   .catch(err => showRejectError(err.message));
}

function showRejectSuccess(message) {
    const el = document.getElementById("rejectSuccessMessage");
    if (el) el.textContent = message;
    new bootstrap.Modal(document.getElementById("rejectSuccessModal")).show();
}

function showRejectError(message) {
    const el = document.getElementById("rejectErrorMessage");
    if (el) el.textContent = message;
    new bootstrap.Modal(document.getElementById("rejectErrorModal")).show();
}

function closeSuccessModal() {
    bootstrap.Modal.getInstance(document.getElementById("rejectSuccessModal"))?.hide();
    // TODO: navigate after real API integration
    // window.location.href = "/Reconcilation/ReconcileTransaction";
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
