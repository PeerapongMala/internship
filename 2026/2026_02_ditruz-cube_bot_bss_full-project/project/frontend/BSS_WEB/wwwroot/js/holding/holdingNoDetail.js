const USE_MOCK_DATA = false;

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
    loadHoldingData();
}

function loadHoldingData() {
    var rootPath = document.body.getAttribute("data-root-path") || "/";
    $.enablePageLoader();
    $.ajax({
        url: rootPath + 'Reconcilation/GetHoldingSummary',
        type: 'POST',
        contentType: 'application/json',
        success: function (res) {
            if (res && res.is_success && res.data) {
                var d = res.data;
                var rows = (d.rows || []).map(function (r) {
                    return {
                        DenominationPrice: r.denoPrice,
                        Type: r.bnType,
                        Series: r.denomSeries || null,
                        Qty: r.qty
                    };
                });
                renderDetailTable(rows);
                // Use BE-calculated summary
                setText("sumGood", numberWithCommas(d.totalGoodDamagedDestroy));
                setText("sumReject", d.totalReject > 0 ? numberWithCommas(d.totalReject) : "-");
                setText("sumCounterfeit", d.totalCounterfeitDefect > 0 ? numberWithCommas(d.totalCounterfeitDefect) : "-");
                setText("sumExcess", d.totalExcess > 0 ? numberWithCommas(d.totalExcess) : "-");
                setText("sumTotal", numberWithCommas(d.grandTotal));
            } else {
                console.warn("GetHoldingSummary:", res?.msg_desc || "no data");
                renderDetailTable([]);
                renderSummary([]);
            }
        },
        error: function (xhr) {
            console.error("GetHoldingSummary error:", xhr.status);
            renderDetailTable([]);
            renderSummary([]);
        },
        complete: function () {
            $.disablePageLoader();
        }
    });
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
function renderDetailTable(data, isSort) {
    if (!isSort) currentData = [...data];
    const tbody = document.getElementById("detailTableBody");
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:24px 0;">ไม่มีข้อมูล</td></tr>';
        return;
    }

    let html = "";

    data.forEach(row => {
        const denomClass = getDenomBadgeClass(row.DenominationPrice);
        const seriesText = row.Series != null ? row.Series : "";

        html += `<tr>
            <td><span class="${denomClass}">${row.DenominationPrice}</span></td>
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
    if (!currentData || currentData.length === 0) {
        showRejectError("ไม่มีข้อมูลที่ทำการ Reject");
        return;
    }
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

    var rootPath = document.body.getAttribute("data-root-path") || "/";
    $.enablePageLoader();
    $.ajax({
        url: rootPath + 'Reconcilation/SubmitReject',
        type: 'POST',
        contentType: 'application/json',
        success: function (res) {
            if (res && res.is_success) {
                showRejectSuccess("ส่งข้อมูลสำเร็จ");
            } else {
                showRejectError(res?.msg_desc || "มีข้อผิดพลาดในการส่งยอด Reject");
            }
        },
        error: function (xhr) {
            console.error("SubmitReject error:", xhr.status);
            showRejectError("มีข้อผิดพลาดในการส่งยอด Reject");
        },
        complete: function () {
            $.disablePageLoader();
        }
    });
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
    window.location.href = "/Reconciliation/HoldingDetail";
}

// Sort
let currentData = [];
let sortState = { col: null, dir: 'none' }; // none → asc → desc → none

function sortTable(thEl) {
    const col = thEl.dataset.col;
    const type = thEl.dataset.type;

    // Cycle: none → asc → desc → none
    if (sortState.col !== col) {
        sortState = { col: col, dir: 'asc' };
    } else if (sortState.dir === 'asc') {
        sortState.dir = 'desc';
    } else if (sortState.dir === 'desc') {
        sortState = { col: null, dir: 'none' };
    } else {
        sortState.dir = 'asc';
    }

    // Update icons
    document.querySelectorAll('.hn-sortable .hn-sort-icon').forEach(icon => {
        icon.className = 'bi bi-chevron-expand hn-sort-icon';
    });
    if (sortState.dir !== 'none') {
        const icon = thEl.querySelector('.hn-sort-icon');
        icon.className = sortState.dir === 'asc'
            ? 'bi bi-chevron-up hn-sort-icon'
            : 'bi bi-chevron-down hn-sort-icon';
    }

    // Sort data
    let sorted = [...currentData];
    if (sortState.dir !== 'none') {
        sorted.sort((a, b) => {
            let va = a[col], vb = b[col];
            if (va == null) va = type === 'number' ? -Infinity : '';
            if (vb == null) vb = type === 'number' ? -Infinity : '';
            if (type === 'number') {
                va = parseFloat(va) || 0;
                vb = parseFloat(vb) || 0;
            } else {
                va = String(va);
                vb = String(vb);
            }
            let cmp = va < vb ? -1 : va > vb ? 1 : 0;
            return sortState.dir === 'desc' ? -cmp : cmp;
        });
    }
    renderDetailTable(sorted, true);
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
