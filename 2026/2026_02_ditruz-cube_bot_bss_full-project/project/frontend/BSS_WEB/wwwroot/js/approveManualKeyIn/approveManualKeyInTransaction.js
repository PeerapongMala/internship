/*
  Approve Manual Key-in Transaction JavaScript
  Matched to Figma design (Node 5:33827)
  Updated: 2026-03-04
*/

// ===================================
// Configuration
// ===================================

let USE_MOCK_DATA = false; // Toggle via button on page
const API_BASE = '/ApproveManualKeyIn/';

// ===================================
// State Management
// ===================================

let currentSelectedRow = null;
let currentSelectedId = null;
let currentPageData = [];
let allPageData = []; // unfiltered data for client-side filtering
let masterFilterData = null; // master data for filter dropdowns

// ===================================
// Mock Data (15-column Figma layout)
// ===================================

const MOCK_DATA = {
    transactions: [
        {
            approveManualKeyInTranId: 1,
            barcodePackage: '1234567890123',
            barcodeBundle: '9876543210001',
            headerCardCode: 'HC-2026-001',
            bankName: 'ธปท.',
            zone: 'A',
            cashpointName: 'ศูนย์เงินสด กทม.',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 10:30',
            sortDate: '19/02/2569 11:00',
            operatorPrepare: 'สมชาย ใจดี',
            sorterName: 'Sorter-01',
            operatorReconcile: 'สมหญิง รักดี',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        },
        {
            approveManualKeyInTranId: 2,
            barcodePackage: '1234567890124',
            barcodeBundle: '9876543210002',
            headerCardCode: 'HC-2026-002',
            bankName: 'กรุงเทพ',
            zone: 'B',
            cashpointName: 'ศูนย์เงินสด เชียงใหม่',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 11:15',
            sortDate: '19/02/2569 12:00',
            operatorPrepare: 'วิชัย สุขใจ',
            sorterName: 'Sorter-02',
            operatorReconcile: 'นภา พิมพ์ใจ',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        },
        {
            approveManualKeyInTranId: 3,
            barcodePackage: '1234567890125',
            barcodeBundle: '9876543210003',
            headerCardCode: 'HC-2026-003',
            bankName: 'กสิกร',
            zone: 'A',
            cashpointName: 'ศูนย์เงินสด กทม.',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 09:00',
            sortDate: '19/02/2569 09:45',
            operatorPrepare: 'ประยุทธ์ มั่นคง',
            sorterName: 'Sorter-01',
            operatorReconcile: 'สุนีย์ ดีงาม',
            supervisorEdit: 'พัฒนา วิไล',
            supervisorCancel: '-',
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติ'
        },
        {
            approveManualKeyInTranId: 4,
            barcodePackage: '1234567890126',
            barcodeBundle: '9876543210004',
            headerCardCode: 'HC-2026-004',
            bankName: 'ไทยพาณิชย์',
            zone: 'C',
            cashpointName: 'ศูนย์เงินสด ขอนแก่น',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 12:45',
            sortDate: '19/02/2569 13:30',
            operatorPrepare: 'อนุชา วงศ์ดี',
            sorterName: 'Sorter-03',
            operatorReconcile: 'มาลี ศรีสุข',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        },
        {
            approveManualKeyInTranId: 5,
            barcodePackage: '1234567890127',
            barcodeBundle: '9876543210005',
            headerCardCode: 'HC-2026-005',
            bankName: 'ธปท.',
            zone: 'A',
            cashpointName: 'ศูนย์เงินสด กทม.',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 08:20',
            sortDate: '19/02/2569 08:50',
            operatorPrepare: 'สมชาย ใจดี',
            sorterName: 'Sorter-01',
            operatorReconcile: 'สมหญิง รักดี',
            supervisorEdit: 'พัฒนา วิไล',
            supervisorCancel: '-',
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติ'
        },
        {
            approveManualKeyInTranId: 6,
            barcodePackage: '1234567890128',
            barcodeBundle: '9876543210006',
            headerCardCode: 'HC-2026-006',
            bankName: 'กรุงเทพ',
            zone: 'B',
            cashpointName: 'ศูนย์เงินสด เชียงใหม่',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 13:10',
            sortDate: '19/02/2569 14:00',
            operatorPrepare: 'วิชัย สุขใจ',
            sorterName: 'Sorter-02',
            operatorReconcile: 'นภา พิมพ์ใจ',
            supervisorEdit: '-',
            supervisorCancel: 'พัฒนา วิไล',
            statusCode: 'DENIED',
            statusNameTh: 'ปฏิเสธ'
        },
        {
            approveManualKeyInTranId: 7,
            barcodePackage: '1234567890129',
            barcodeBundle: '9876543210007',
            headerCardCode: 'HC-2026-007',
            bankName: 'กสิกร',
            zone: 'C',
            cashpointName: 'ศูนย์เงินสด ขอนแก่น',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 14:00',
            sortDate: '19/02/2569 14:45',
            operatorPrepare: 'ประยุทธ์ มั่นคง',
            sorterName: 'Sorter-03',
            operatorReconcile: 'สุนีย์ ดีงาม',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        },
        {
            approveManualKeyInTranId: 8,
            barcodePackage: '1234567890130',
            barcodeBundle: '9876543210008',
            headerCardCode: 'HC-2026-008',
            bankName: 'ไทยพาณิชย์',
            zone: 'A',
            cashpointName: 'ศูนย์เงินสด กทม.',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 15:30',
            sortDate: '19/02/2569 16:00',
            operatorPrepare: 'อนุชา วงศ์ดี',
            sorterName: 'Sorter-01',
            operatorReconcile: 'มาลี ศรีสุข',
            supervisorEdit: 'พัฒนา วิไล',
            supervisorCancel: '-',
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติ'
        },
        {
            approveManualKeyInTranId: 9,
            barcodePackage: '1234567890131',
            barcodeBundle: '9876543210009',
            headerCardCode: 'HC-2026-009',
            bankName: 'ธปท.',
            zone: 'B',
            cashpointName: 'ศูนย์เงินสด เชียงใหม่',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 16:20',
            sortDate: '19/02/2569 17:00',
            operatorPrepare: 'สมชาย ใจดี',
            sorterName: 'Sorter-02',
            operatorReconcile: 'สมหญิง รักดี',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        },
        {
            approveManualKeyInTranId: 10,
            barcodePackage: '1234567890132',
            barcodeBundle: '9876543210010',
            headerCardCode: 'HC-2026-010',
            bankName: 'กรุงเทพ',
            zone: 'C',
            cashpointName: 'ศูนย์เงินสด ขอนแก่น',
            bnTypeName: 'UNFIT',
            prepareDate: '19/02/2569 17:00',
            sortDate: '19/02/2569 17:45',
            operatorPrepare: 'วิชัย สุขใจ',
            sorterName: 'Sorter-03',
            operatorReconcile: 'นภา พิมพ์ใจ',
            supervisorEdit: '-',
            supervisorCancel: '-',
            statusCode: 'PENDING',
            statusNameTh: 'แก้ไข'
        }
    ],
    detailBreakdown: {
        'HC-2026-001': [
            { denomination: 1000, bnType: 'ดี', form: 'มัด', quantity: 50 },
            { denomination: 1000, bnType: 'เสีย', form: 'มัด', quantity: 48 },
            { denomination: 500, bnType: 'ดี', form: 'มัด', quantity: 30 },
            { denomination: 500, bnType: 'เสีย', form: 'มัด', quantity: 25 }
        ],
        'HC-2026-002': [
            { denomination: 1000, bnType: 'ดี', form: 'มัด', quantity: 100 },
            { denomination: 1000, bnType: 'เสีย', form: 'มัด', quantity: 95 },
            { denomination: 100, bnType: 'ดี', form: 'มัด', quantity: 200 },
            { denomination: 100, bnType: 'Reject', form: 'มัด', quantity: 5 }
        ],
        'HC-2026-003': [
            { denomination: 500, bnType: 'ดี', form: 'มัด', quantity: 75 },
            { denomination: 500, bnType: 'เสีย', form: 'มัด', quantity: 70 },
            { denomination: 100, bnType: 'ดี', form: 'มัด', quantity: 150 }
        ],
        'HC-2026-004': [
            { denomination: 1000, bnType: 'ดี', form: 'มัด', quantity: 40 },
            { denomination: 500, bnType: 'ดี', form: 'มัด', quantity: 42 }
        ],
        'HC-2026-005': [
            { denomination: 1000, bnType: 'ดี', form: 'มัด', quantity: 25 },
            { denomination: 1000, bnType: 'เสีย', form: 'มัด', quantity: 25 }
        ],
        'HC-2026-006': [
            { denomination: 20, bnType: 'ดี', form: 'มัด', quantity: 60 },
            { denomination: 20, bnType: 'เสีย', form: 'มัด', quantity: 58 }
        ],
        'HC-2026-007': [
            { denomination: 50, bnType: 'ดี', form: 'มัด', quantity: 125 },
            { denomination: 50, bnType: 'เสีย', form: 'มัด', quantity: 128 }
        ],
        'HC-2026-008': [
            { denomination: 100, bnType: 'ดี', form: 'มัด', quantity: 90 },
            { denomination: 100, bnType: 'เสีย', form: 'มัด', quantity: 90 }
        ],
        'HC-2026-009': [
            { denomination: 500, bnType: 'ดี', form: 'มัด', quantity: 45 },
            { denomination: 500, bnType: 'เสีย', form: 'มัด', quantity: 43 }
        ],
        'HC-2026-010': [
            { denomination: 1000, bnType: 'ดี', form: 'มัด', quantity: 30 },
            { denomination: 1000, bnType: 'เสีย', form: 'มัด', quantity: 31 }
        ]
    }
};

// ===================================
// Initialization
// ===================================

$(document).ready(function () {
    console.log('Approve Manual Key-in Transaction - Initializing...');
    updateDateTime();
    setInterval(updateDateTime, 60000);
    initializeEventHandlers();
    loadInitialData();
});

function updateDateTime() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var year = now.getFullYear() + 543; // Buddhist era
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    $('#headerDate').text(day + '/' + month + '/' + year + ' ' + hours + ':' + minutes);
}

function initializeEventHandlers() {
    // Table row selection
    $('#approveMainTableBody').on('click', 'tr', handleRowClick);

    // Sortable table headers
    $('.th-sort').on('click', handleSort);

    // Auto-apply filters on dropdown change
    $('.approve-filter-select').on('change', function () {
        currentPageData = applyClientFilters(allPageData);
        clearSelection();
        renderMainTable(currentPageData);
    });



    // Press 'm' to toggle mock data
    $(document).on('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'm' || e.key === 'M') {
            USE_MOCK_DATA = !USE_MOCK_DATA;
            if (USE_MOCK_DATA) {
                console.log('[Mock ON]');
                loadMainTableMock();
            } else {
                console.log('[Mock OFF]');
                currentPageData = [];
                currentSelectedRow = null;
                currentSelectedId = null;
                fillMainEmptyRows();
                clearDetailTable();
            }
        }
    });
}

function loadInitialData() {
    // Fill detail table with empty alternating rows immediately
    clearDetailTable();

    // Load master data for filter dropdowns, then load main data
    loadFilterMasterData();

    if (USE_MOCK_DATA) {
        console.log('Loading mock data...');
        loadMainTableMock();
    } else {
        loadMainTable();
    }
}

// ===================================
// AJAX Functions (Backend Integration)
// ===================================

function loadMainTable(filters = {}) {
    const request = {
        PageNumber: 1,
        PageSize: 50,
        Filter: filters
    };

    $.ajax({
        url: API_BASE + 'GetApproveManualKeyInTransactionsDetailAsync',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.is_success) {
                allPageData = response.data.items || [];
                currentPageData = applyClientFilters(allPageData);
                populateTableDerivedFilters(allPageData);
                renderMainTable(currentPageData);
            } else {
                console.error('Failed to load data:', response.msg_desc);
                showToast('error', 'Failed to load data');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
            showToast('error', 'Error loading data');
        }
    });
}

function loadDetailBreakdown(approveManualKeyInTranId) {
    $.ajax({
        url: API_BASE + 'GetApproveManualKeyInDetail',
        method: 'GET',
        data: { id: approveManualKeyInTranId },
        success: function (response) {
            if (response.is_success && response.data) {
                renderDetailTable(response.data.denominations || []);
            } else {
                clearDetailTable();
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
            clearDetailTable();
        }
    });
}

function submitApprove() {
    if (!currentSelectedId) {
        showToast('warning', 'กรุณาเลือกรายการ');
        return;
    }

    const note = $('#approveNotes').val();
    const request = {
        ApproveManualKeyInTranId: currentSelectedId,
        UpdatedBy: parseInt($('#currentUserId').val()) || 1,
        Remark: note
    };

    $.ajax({
        url: API_BASE + 'Approve',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.is_success) {
                closeApproveConfirmModal();
                showSuccessModal('บันทึกข้อมูลสำเร็จ');
                loadMainTable();
                clearSelection();
            } else {
                showToast('error', response.msg_desc || 'Approve failed');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
            showToast('error', 'Error submitting approval');
        }
    });
}

function submitDeny() {
    if (!currentSelectedId) {
        showToast('warning', 'กรุณาเลือกรายการ');
        return;
    }

    const note = $('#approveNotes').val();
    if (!note || note.trim() === '') {
        showToast('warning', 'กรุณากรอกหมายเหตุ');
        return;
    }

    const request = {
        ApproveManualKeyInTranId: currentSelectedId,
        Remark: note,
        UpdatedBy: parseInt($('#currentUserId').val()) || 1
    };

    $.ajax({
        url: API_BASE + 'Deny',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(request),
        success: function (response) {
            if (response.is_success) {
                closeDenyConfirmModal();
                showSuccessModal('บันทึกข้อมูลสำเร็จ');
                loadMainTable();
                clearSelection();
            } else {
                showToast('error', response.msg_desc || 'Deny failed');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
            showToast('error', 'Error submitting denial');
        }
    });
}

// ===================================
// Mock Data Functions
// ===================================

function loadMainTableMock() {
    allPageData = MOCK_DATA.transactions;
    currentPageData = applyClientFilters(allPageData);
    populateTableDerivedFilters(allPageData);
    renderMainTable(currentPageData);
}

function loadDetailBreakdownMock(headerCardCode) {
    const details = MOCK_DATA.detailBreakdown[headerCardCode] || [];
    renderDetailTable(details);
}

// ===================================
// Rendering Functions
// ===================================

function renderMainTable(data) {
    const tbody = $('#approveMainTableBody');
    tbody.empty();

    if (!data || data.length === 0) {
        fillMainEmptyRows();
        return;
    }

    data.forEach((row) => {
        const tr = $('<tr></tr>')
            .attr('data-id', row.approveManualKeyInTranId)
            .attr('data-hc', row.headerCardCode)
            .attr('data-status', row.statusId);

        // 15 columns matching Figma layout
        tr.append(`<td class="col-barcode-pkg">${row.packageCode || row.barcodePackage || '-'}</td>`);
        tr.append(`<td class="col-barcode-bdl">${row.bundleCode || row.barcodeBundle || '-'}</td>`);
        tr.append(`<td class="col-header-card">${row.headerCardCode || '-'}</td>`);
        tr.append(`<td class="col-bank">${row.bankName || '-'}</td>`);
        tr.append(`<td class="col-zone">${row.zoneName || row.zone || '-'}</td>`);
        tr.append(`<td class="col-cashpoint">${row.cashpointName || '-'}</td>`);
        tr.append(`<td class="col-bn-type">${row.bnTypeName || '-'}</td>`);
        tr.append(`<td class="col-prepare-date">${formatDate(row.prepareDate) || '-'}</td>`);
        tr.append(`<td class="col-sort-date">${formatDate(row.createdDate) || row.sortDate || '-'}</td>`);
        tr.append(`<td class="col-op-prepare">${row.createdByName || row.operatorPrepare || '-'}</td>`);
        tr.append(`<td class="col-sorter">${row.sorterName || '-'}</td>`);
        tr.append(`<td class="col-op-reconcile">${row.operatorReconcile || '-'}</td>`);
        tr.append(`<td class="col-sv-edit">${row.updatedByName || row.supervisorEdit || '-'}</td>`);
        tr.append(`<td class="col-sv-cancel">${row.supervisorCancel || '-'}</td>`);

        // Status badge — uses shared bss-badges.css
        const badgeVariant = getStatusBadgeVariant(row.statusId);
        tr.append(`<td class="col-status"><span class="badge-status ${badgeVariant}">${row.statusNameTh || '-'}</span></td>`);

        tbody.append(tr);
    });

    // Fill remaining empty rows to make table look full
    const MIN_ROWS = 12;
    const COLS = 15;
    const tds = '<td></td>'.repeat(COLS);
    for (let i = data.length; i < MIN_ROWS; i++) {
        tbody.append(`<tr>${tds}</tr>`);
    }
}

function fillMainEmptyRows() {
    const tbody = $('#approveMainTableBody');
    tbody.empty();
    const COLS = 15;
    const MIN_ROWS = 12;
    const tds = '<td></td>'.repeat(COLS);
    for (let i = 0; i < MIN_ROWS; i++) {
        if (i === 0) {
            tbody.append(`<tr><td colspan="${COLS}" style="text-align:center;padding:20px;color:#909090;">ไม่มีข้อมูล</td></tr>`);
        } else {
            tbody.append(`<tr>${tds}</tr>`);
        }
    }
}

function fillDetailEmptyRows(tbody, startIndex) {
    const MIN_ROWS = 5;
    for (let i = startIndex; i < MIN_ROWS; i++) {
        const bg = (i % 2 === 0) ? '#F8FAFC' : '#F2F6F6';
        tbody.append(`<tr style="background:${bg}"><td></td><td></td><td></td><td></td></tr>`);
    }
}

function renderDetailTable(details) {
    const tbody = $('#approveDetailTableBody');
    tbody.empty();

    if (!details || details.length === 0) {
        fillDetailEmptyRows(tbody, 0);
        enableActionButtons(false);
        return;
    }

    details.forEach((detail, index) => {
        const rowBg = (index % 2 === 0) ? '#F8FAFC' : '#F2F6F6';
        const tr = $('<tr></tr>').css('background', rowBg);
        const denomValue = detail.denoPrice || detail.DenoPrice || 0;
        const denomClass = [20, 50, 100, 500, 1000].includes(denomValue) ? 'qty-badge qty-' + denomValue : 'qty-badge';

        tr.append(`<td class="col-denom-badge"><span class="${denomClass}">${denomValue}</span></td>`);
        tr.append(`<td class="col-detail-type">${detail.bnType || detail.BnType || '-'}</td>`);
        tr.append(`<td class="col-detail-form">${detail.denomSeries || detail.form || detail.Form || '-'}</td>`);
        tr.append(`<td class="col-detail-qty">${(detail.qty || detail.quantity || detail.Qty || 0).toLocaleString()}</td>`);
        tbody.append(tr);
    });

    fillDetailEmptyRows(tbody, details.length);
    enableActionButtons(true);
}

function clearDetailTable() {
    const tbody = $('#approveDetailTableBody');
    tbody.empty();
    fillDetailEmptyRows(tbody, 0);
    enableActionButtons(false);
}

// ===================================
// Status Badge Helpers
// ===================================

function getStatusBadgeVariant(statusId) {
    switch (statusId) {
        case 24:                     // ManualKeyIn (pending)
            return 'badge-status--manual-keyin';
        case 16:                     // Approved
        case 27:                     // EditedApproved
            return 'badge-status--approved';
        case 25:                     // DeniedManualKeyIn
            return 'badge-status--denied';
        case 20:                     // Edited
            return 'badge-status--edited';
        case 15:                     // AdjustOffset
            return 'badge-status--adjust-offset';
        case 22:                     // CancelSentDeniedEdited
        case 23:                     // CancelSent
        case 26:                     // CancelSentManualKeyIn
        case 29:                     // CancelSentDeniedApproved
        case 30:                     // ApprovedCancel
            return 'badge-status--cancelled';
        default:
            return 'badge-status--cancelled';
    }
}

// ===================================
// Event Handlers
// ===================================

function handleRowClick(e) {
    const row = $(e.currentTarget);
    const id = row.data('id');
    const hc = row.data('hc');

    if (!id) return;

    // Update selection
    $('#approveMainTableBody tr').removeClass('selected');
    row.addClass('selected');

    currentSelectedRow = row;
    currentSelectedId = id;

    // Load detail breakdown
    if (USE_MOCK_DATA) {
        loadDetailBreakdownMock(hc);
    } else {
        loadDetailBreakdown(id);
    }
}

function searchData() {
    currentPageData = applyClientFilters(allPageData);
    clearSelection();
    renderMainTable(currentPageData);
}

function clearFilters() {
    $('.approve-filter-select').val('');
    currentPageData = allPageData;
    clearSelection();
    renderMainTable(currentPageData);
}

function loadFilterMasterData() {
    $.ajax({
        url: API_BASE + 'GetFilterMasterData',
        method: 'GET',
        success: function (response) {
            console.log('GetFilterMasterData response:', response);
            if (response.is_success && response.data) {
                masterFilterData = response.data;
                populateMasterDropdowns(masterFilterData);
            } else {
                console.warn('GetFilterMasterData: is_success=false or no data', response);
            }
        },
        error: function (xhr, status, error) {
            console.warn('GetFilterMasterData AJAX error:', status, error, xhr.responseText);
        }
    });
}

function populateMasterDropdowns(data) {
    // Keys are camelCase due to DictionaryKeyPolicy = CamelCase

    // Bank (ธนาคาร)
    if (data.masterInstitution && data.masterInstitution.length) {
        fillDropdown('#filterBank', data.masterInstitution, item => item.text, item => item.text);
    }

    // Zone
    if (data.masterZone && data.masterZone.length) {
        fillDropdown('#filterZone', data.masterZone, item => item.text, item => item.text);
    }

    // Cashpoint
    if (data.masterCashPoint && data.masterCashPoint.length) {
        fillDropdown('#filterCashpoint', data.masterCashPoint, item => item.text, item => item.text);
    }

    // Supervisor
    if (data.masterUserSuperVisor && data.masterUserSuperVisor.length) {
        fillDropdown('#filterSupervisor', data.masterUserSuperVisor, item => item.text, item => item.text);
    }

    // Operator Prepare
    if (data.masterUserPreparator && data.masterUserPreparator.length) {
        fillDropdown('#filterOperatorPrepare', data.masterUserPreparator, item => item.text, item => item.text);
    }

    // Operator Reconcile (same user list as Prepare)
    if (data.masterUserPreparator && data.masterUserPreparator.length) {
        fillDropdown('#filterOperatorReconcile', data.masterUserPreparator, item => item.text, item => item.text);
    }

    // Status
    if (data.statuses && data.statuses.length) {
        fillDropdown('#filterStatus', data.statuses, item => item.statusNameTh, item => String(item.statusId));
    }

    // Banknote Type (ประเภทธนบัตร)
    if (data.banknoteTypes && data.banknoteTypes.length) {
        fillDropdown('#filterType', data.banknoteTypes, item => item.banknoteTypeName, item => item.banknoteTypeName);
    }
}

function fillDropdown(selector, items, labelFn, valueFn) {
    const select = $(selector);
    const currentVal = select.val();
    select.find('option:not(:first)').remove();

    items.forEach(item => {
        const label = labelFn(item);
        const val = valueFn(item);
        if (label) {
            select.append($('<option></option>').val(val).text(label));
        }
    });

    if (currentVal && select.find(`option[value="${currentVal}"]`).length) {
        select.val(currentVal);
    }
}

function populateTableDerivedFilters(data) {
    if (!data || data.length === 0) return;

    // Only HeaderCard is table-derived (no master table exists for it)
    // All other filters (Bank, Zone, Cashpoint, Status, etc.) come from master data via GetFilterMasterData
    const fields = [
        { id: '#filterHeaderCard', key: row => row.headerCardCode },
    ];

    fields.forEach(f => {
        const select = $(f.id);
        // Skip if already populated by master data
        if (select.find('option').length > 1) return;

        const currentVal = select.val();
        const seen = new Set();
        data.forEach(row => {
            const label = f.key(row);
            const val = f.value ? f.value(row) : label;
            if (label && label !== '-' && !seen.has(label)) {
                seen.add(label);
                select.append($('<option></option>').val(val).text(label));
            }
        });

        if (currentVal && select.find(`option[value="${currentVal}"]`).length) {
            select.val(currentVal);
        }
    });
}

function applyClientFilters(data) {
    if (!data) return [];

    const hc = $('#filterHeaderCard').val();
    const type = $('#filterType').val();
    const bank = $('#filterBank').val();
    const zone = $('#filterZone').val();
    const cashpoint = $('#filterCashpoint').val();
    const opPrepare = $('#filterOperatorPrepare').val();
    const opReconcile = $('#filterOperatorReconcile').val();
    const supervisor = $('#filterSupervisor').val();
    const status = $('#filterStatus').val();

    return data.filter(row => {
        if (hc && row.headerCardCode !== hc) return false;
        if (type && (row.bnTypeName || '') !== type) return false;
        if (bank && (row.bankName || '') !== bank) return false;
        if (zone && (row.zoneName || row.zone || '') !== zone) return false;
        if (cashpoint && (row.cashpointName || '') !== cashpoint) return false;
        if (opPrepare && (row.createdByName || row.operatorPrepare || '') !== opPrepare) return false;
        if (opReconcile && (row.operatorReconcile || '') !== opReconcile) return false;
        if (supervisor && (row.updatedByName || row.supervisorEdit || '') !== supervisor) return false;
        if (status && String(row.statusId || row.statusCode || '') !== status) return false;
        return true;
    });
}

// ===================================
// Modal Functions
// ===================================

function showApproveConfirmModal() {
    if (!currentSelectedId) {
        showToast('warning', 'กรุณาเลือกรายการที่ต้องการ Approve');
        return;
    }
    $('#approveConfirmModal').addClass('show');
}

function closeApproveConfirmModal() {
    $('#approveConfirmModal').removeClass('show');
}

function confirmApprove() {
    if (USE_MOCK_DATA) {
        closeApproveConfirmModal();
        showSuccessModal('บันทึกข้อมูลสำเร็จ');
        loadMainTableMock();
        clearSelection();
    } else {
        submitApprove();
    }
}

function showDenyConfirmModal() {
    if (!currentSelectedId) {
        showToast('warning', 'กรุณาเลือกรายการที่ต้องการ Deny');
        return;
    }
    const note = $('#approveNotes').val();
    if (!note || note.trim() === '') {
        showToast('warning', 'กรุณากรอกหมายเหตุก่อน Deny');
        return;
    }
    $('#denyConfirmModal').addClass('show');
}

function closeDenyConfirmModal() {
    $('#denyConfirmModal').removeClass('show');
}

function confirmDeny() {
    if (USE_MOCK_DATA) {
        closeDenyConfirmModal();
        showSuccessModal('บันทึกข้อมูลสำเร็จ');
        loadMainTableMock();
        clearSelection();
    } else {
        submitDeny();
    }
}

function showSuccessModal(message) {
    $('#successMessage').text(message);
    $('#successModal').addClass('show');
}

function closeSuccessModal() {
    $('#successModal').removeClass('show');
}

// ===================================
// Utility Functions
// ===================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // already formatted string (mock data)
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
}

function enableActionButtons(enabled) {
    $('#btnApprove').prop('disabled', !enabled);
    $('#btnDeny').prop('disabled', !enabled);
}

function clearSelection() {
    currentSelectedRow = null;
    currentSelectedId = null;
    $('#approveMainTableBody tr').removeClass('selected');
    $('#approveNotes').val('');
    clearDetailTable();
}

function showToast(type, message) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}

function toggleFilter() {
    const filterSection = $('#filterSection');
    if (filterSection.is(':visible')) {
        filterSection.slideUp(300);
    } else {
        filterSection.slideDown(300);
    }
}

// ===================================
// Sort Functions
// ===================================

let sortState = {
    column: null,
    direction: 'asc'
};

function handleSort(e) {
    const th = $(e.currentTarget);
    const sortColumn = th.data('sort');

    if (sortState.column === sortColumn) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.column = sortColumn;
        sortState.direction = 'asc';
    }

    // Update sort icons
    $('.th-sort .sort-icon').removeClass('bi-chevron-up bi-chevron-down').addClass('bi-chevron-expand');
    th.find('.sort-icon')
        .removeClass('bi-chevron-expand')
        .addClass(sortState.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down');

    // Sort data
    currentPageData.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
        } else {
            aVal = String(aVal || '').toLowerCase();
            bVal = String(bVal || '').toLowerCase();
            return sortState.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
    });

    renderMainTable(currentPageData);
}

// ===================================
// Global Exports
// ===================================

window.toggleFilter = toggleFilter;
window.showApproveConfirmModal = showApproveConfirmModal;
window.closeApproveConfirmModal = closeApproveConfirmModal;
window.confirmApprove = confirmApprove;
window.showDenyConfirmModal = showDenyConfirmModal;
window.closeDenyConfirmModal = closeDenyConfirmModal;
window.confirmDeny = confirmDeny;
window.closeSuccessModal = closeSuccessModal;
