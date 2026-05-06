/*
  Approve Manual Key-in Transaction JavaScript
<<<<<<< HEAD
  Business logic + AJAX calls + Mock data
  Date: 2026-02-19
=======
  Matched to Figma design (Node 5:33827)
  Updated: 2026-03-04
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
*/

// ===================================
// Configuration
// ===================================

<<<<<<< HEAD
const USE_MOCK_DATA = true; // Set to false when backend is ready
=======
let USE_MOCK_DATA = false; // Toggle via button on page
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
const API_BASE = '/ApproveManualKeyIn/';

// ===================================
// State Management
// ===================================

let currentSelectedRow = null;
let currentSelectedId = null;
let currentPageData = [];

// ===================================
<<<<<<< HEAD
// Mock Data
=======
// Mock Data (15-column Figma layout)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ===================================

const MOCK_DATA = {
    transactions: [
        {
            approveManualKeyInTranId: 1,
<<<<<<< HEAD
            headerCardCode: 'HC-2026-001',
            machineName: 'Machine A',
            denominationPrice: 20,
            m7Qty: 100,
            manualKeyInQty: 98,
            diff: -2,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 10:30:00',
            createdByName: 'John Doe'
        },
        {
            approveManualKeyInTranId: 2,
            headerCardCode: 'HC-2026-002',
            machineName: 'Machine B',
            denominationPrice: 50,
            m7Qty: 200,
            manualKeyInQty: 201,
            diff: 1,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 11:15:00',
            createdByName: 'Jane Smith'
        },
        {
            approveManualKeyInTranId: 3,
            headerCardCode: 'HC-2026-003',
            machineName: 'Machine A',
            denominationPrice: 100,
            m7Qty: 150,
            manualKeyInQty: 150,
            diff: 0,
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติแล้ว',
            prepareDate: '2026-02-19 09:00:00',
            createdByName: 'Bob Johnson'
        },
        {
            approveManualKeyInTranId: 4,
            headerCardCode: 'HC-2026-004',
            machineName: 'Machine C',
            denominationPrice: 500,
            m7Qty: 80,
            manualKeyInQty: 82,
            diff: 2,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 12:45:00',
            createdByName: 'Alice Wong'
        },
        {
            approveManualKeyInTranId: 5,
            headerCardCode: 'HC-2026-005',
            machineName: 'Machine D',
            denominationPrice: 1000,
            m7Qty: 50,
            manualKeyInQty: 50,
            diff: 0,
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติแล้ว',
            prepareDate: '2026-02-19 08:20:00',
            createdByName: 'Charlie Brown'
        },
        {
            approveManualKeyInTranId: 6,
            headerCardCode: 'HC-2026-006',
            machineName: 'Machine A',
            denominationPrice: 20,
            m7Qty: 120,
            manualKeyInQty: 118,
            diff: -2,
            statusCode: 'DENIED',
            statusNameTh: 'ปฏิเสธ',
            prepareDate: '2026-02-19 13:10:00',
            createdByName: 'Diana Prince'
        },
        {
            approveManualKeyInTranId: 7,
            headerCardCode: 'HC-2026-007',
            machineName: 'Machine B',
            denominationPrice: 50,
            m7Qty: 250,
            manualKeyInQty: 253,
            diff: 3,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 14:00:00',
            createdByName: 'Ethan Hunt'
        },
        {
            approveManualKeyInTranId: 8,
            headerCardCode: 'HC-2026-008',
            machineName: 'Machine C',
            denominationPrice: 100,
            m7Qty: 180,
            manualKeyInQty: 180,
            diff: 0,
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติแล้ว',
            prepareDate: '2026-02-19 15:30:00',
            createdByName: 'Fiona Glenanne'
        },
        {
            approveManualKeyInTranId: 9,
            headerCardCode: 'HC-2026-009',
            machineName: 'Machine D',
            denominationPrice: 500,
            m7Qty: 90,
            manualKeyInQty: 88,
            diff: -2,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 16:20:00',
            createdByName: 'George Martin'
        },
        {
            approveManualKeyInTranId: 10,
            headerCardCode: 'HC-2026-010',
            machineName: 'Machine A',
            denominationPrice: 1000,
            m7Qty: 60,
            manualKeyInQty: 61,
            diff: 1,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 17:00:00',
            createdByName: 'Hannah Baker'
        },
        {
            approveManualKeyInTranId: 11,
            headerCardCode: 'HC-2026-011',
            machineName: 'Machine B',
            denominationPrice: 20,
            m7Qty: 110,
            manualKeyInQty: 110,
            diff: 0,
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติแล้ว',
            prepareDate: '2026-02-19 07:45:00',
            createdByName: 'Ian Malcolm'
        },
        {
            approveManualKeyInTranId: 12,
            headerCardCode: 'HC-2026-012',
            machineName: 'Machine C',
            denominationPrice: 50,
            m7Qty: 220,
            manualKeyInQty: 215,
            diff: -5,
            statusCode: 'DENIED',
            statusNameTh: 'ปฏิเสธ',
            prepareDate: '2026-02-19 18:10:00',
            createdByName: 'Julia Roberts'
        },
        {
            approveManualKeyInTranId: 13,
            headerCardCode: 'HC-2026-013',
            machineName: 'Machine D',
            denominationPrice: 100,
            m7Qty: 190,
            manualKeyInQty: 192,
            diff: 2,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 19:00:00',
            createdByName: 'Kevin Hart'
        },
        {
            approveManualKeyInTranId: 14,
            headerCardCode: 'HC-2026-014',
            machineName: 'Machine A',
            denominationPrice: 500,
            m7Qty: 75,
            manualKeyInQty: 75,
            diff: 0,
            statusCode: 'APPROVED',
            statusNameTh: 'อนุมัติแล้ว',
            prepareDate: '2026-02-19 20:15:00',
            createdByName: 'Laura Croft'
        },
        {
            approveManualKeyInTranId: 15,
            headerCardCode: 'HC-2026-015',
            machineName: 'Machine B',
            denominationPrice: 1000,
            m7Qty: 55,
            manualKeyInQty: 54,
            diff: -1,
            statusCode: 'PENDING',
            statusNameTh: 'รออนุมัติ',
            prepareDate: '2026-02-19 21:30:00',
            createdByName: 'Michael Scott'
=======
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
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        }
    ],
    detailBreakdown: {
        'HC-2026-001': [
<<<<<<< HEAD
            { denomination: 20, bnType: 'Fit', form: 17, quantity: 50 },
            { denomination: 20, bnType: 'Unfit', form: 17, quantity: 48 }
        ],
        'HC-2026-002': [
            { denomination: 50, bnType: 'Fit', form: 17, quantity: 100 },
            { denomination: 50, bnType: 'Unfit', form: 17, quantity: 100 },
            { denomination: 50, bnType: 'Reject', form: 17, quantity: 1 }
        ],
        'HC-2026-003': [
            { denomination: 100, bnType: 'Fit', form: 17, quantity: 75 },
            { denomination: 100, bnType: 'Unfit', form: 17, quantity: 75 }
        ],
        'HC-2026-004': [
            { denomination: 500, bnType: 'Fit', form: 17, quantity: 40 },
            { denomination: 500, bnType: 'Unfit', form: 17, quantity: 42 }
        ],
        'HC-2026-005': [
            { denomination: 1000, bnType: 'Fit', form: 17, quantity: 25 },
            { denomination: 1000, bnType: 'Unfit', form: 17, quantity: 25 }
        ],
        'HC-2026-006': [
            { denomination: 20, bnType: 'Fit', form: 17, quantity: 60 },
            { denomination: 20, bnType: 'Unfit', form: 17, quantity: 58 }
        ],
        'HC-2026-007': [
            { denomination: 50, bnType: 'Fit', form: 17, quantity: 125 },
            { denomination: 50, bnType: 'Unfit', form: 17, quantity: 128 }
        ],
        'HC-2026-008': [
            { denomination: 100, bnType: 'Fit', form: 17, quantity: 90 },
            { denomination: 100, bnType: 'Unfit', form: 17, quantity: 90 }
        ],
        'HC-2026-009': [
            { denomination: 500, bnType: 'Fit', form: 17, quantity: 45 },
            { denomination: 500, bnType: 'Unfit', form: 17, quantity: 43 }
        ],
        'HC-2026-010': [
            { denomination: 1000, bnType: 'Fit', form: 17, quantity: 30 },
            { denomination: 1000, bnType: 'Unfit', form: 17, quantity: 31 }
        ],
        'HC-2026-011': [
            { denomination: 20, bnType: 'Fit', form: 17, quantity: 55 },
            { denomination: 20, bnType: 'Unfit', form: 17, quantity: 55 }
        ],
        'HC-2026-012': [
            { denomination: 50, bnType: 'Fit', form: 17, quantity: 110 },
            { denomination: 50, bnType: 'Unfit', form: 17, quantity: 105 }
        ],
        'HC-2026-013': [
            { denomination: 100, bnType: 'Fit', form: 17, quantity: 95 },
            { denomination: 100, bnType: 'Unfit', form: 17, quantity: 97 }
        ],
        'HC-2026-014': [
            { denomination: 500, bnType: 'Fit', form: 17, quantity: 38 },
            { denomination: 500, bnType: 'Unfit', form: 17, quantity: 37 }
        ],
        'HC-2026-015': [
            { denomination: 1000, bnType: 'Fit', form: 17, quantity: 28 },
            { denomination: 1000, bnType: 'Unfit', form: 17, quantity: 26 }
=======
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
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
<<<<<<< HEAD
    var year = now.getFullYear();
=======
    var year = now.getFullYear() + 543; // Buddhist era
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    $('#headerDate').text(day + '/' + month + '/' + year + ' ' + hours + ':' + minutes);
}

function initializeEventHandlers() {
<<<<<<< HEAD
    // Filter buttons
    $('#btnApprove').click(showApproveConfirmModal);
    $('#btnDeny').click(showDenyConfirmModal);

    // Table row selection
    $('#approveMainTableBody').on('click', 'tr', handleRowClick);
    $('#selectAllCheckbox').change(toggleSelectAll);

    // Sortable table headers
    $('.th-sort').on('click', handleSort);
}

function loadInitialData() {
=======
    // Table row selection
    $('#approveMainTableBody').on('click', 'tr', handleRowClick);

    // Sortable table headers
    $('.th-sort').on('click', handleSort);

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

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
                currentPageData = response.data.items || [];
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
<<<<<<< HEAD
                $('#detailHeaderCardCode').text(response.data.headerCardCode || '-');
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
<<<<<<< HEAD
        showToast('warning', 'Please select a transaction');
=======
        showToast('warning', 'กรุณาเลือกรายการ');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
<<<<<<< HEAD
                showSuccessModal('Approve successful');
                loadMainTable(); // Reload data
=======
                showSuccessModal('บันทึกข้อมูลสำเร็จ');
                loadMainTable();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
<<<<<<< HEAD
        showToast('warning', 'Please select a transaction');
=======
        showToast('warning', 'กรุณาเลือกรายการ');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        return;
    }

    const note = $('#approveNotes').val();
    if (!note || note.trim() === '') {
<<<<<<< HEAD
        showToast('warning', 'Please enter a remark for denial');
=======
        showToast('warning', 'กรุณากรอกหมายเหตุ');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
<<<<<<< HEAD
                showSuccessModal('Deny successful');
                loadMainTable(); // Reload data
=======
                showSuccessModal('บันทึกข้อมูลสำเร็จ');
                loadMainTable();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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
    currentPageData = MOCK_DATA.transactions;
    renderMainTable(currentPageData);
}

function loadDetailBreakdownMock(headerCardCode) {
    const details = MOCK_DATA.detailBreakdown[headerCardCode] || [];
    renderDetailTable(details);
<<<<<<< HEAD
    $('#detailHeaderCardCode').text(headerCardCode);
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ===================================
// Rendering Functions
// ===================================

function renderMainTable(data) {
    const tbody = $('#approveMainTableBody');
    tbody.empty();

    if (!data || data.length === 0) {
<<<<<<< HEAD
        tbody.append('<tr><td colspan="11" style="text-align: center; padding: 20px;">No data available</td></tr>');
        return;
    }

    data.forEach((row, index) => {
        const diffClass = row.diff === 0 ? '' : (row.diff > 0 ? 'text-success' : 'text-danger');
        const statusClass = row.statusCode === 'APPROVED' ? 'text-success' : (row.statusCode === 'DENIED' ? 'text-danger' : 'text-warning');

        const tr = $('<tr></tr>')
            .attr('data-id', row.approveManualKeyInTranId)
            .attr('data-hc', row.headerCardCode);

        // Denomination badge
        const denomValue = row.denominationPrice || row.denomination || 0;
        const badgeClass = getDenominationBadgeClass(denomValue);

        tr.append(`<td class="col-select"><input type="radio" name="selectRow" value="${row.approveManualKeyInTranId}"></td>`);
        tr.append(`<td class="col-no">${index + 1}</td>`);
        tr.append(`<td class="col-header-card">${row.headerCardCode || '-'}</td>`);
        tr.append(`<td class="col-machine">${row.machineName || '-'}</td>`);
        tr.append(`<td class="col-denom"><span class="qty-badge ${badgeClass}">${denomValue}</span></td>`);
        tr.append(`<td class="col-m7-qty">${row.m7Qty || 0}</td>`);
        tr.append(`<td class="col-manual-qty">${row.manualKeyInQty || 0}</td>`);
        tr.append(`<td class="col-diff ${diffClass}">${row.diff || 0}</td>`);
        tr.append(`<td class="col-status ${statusClass}">${row.statusNameTh || row.statusCode || '-'}</td>`);
        tr.append(`<td class="col-prepare-date">${row.prepareDate || '-'}</td>`);
        tr.append(`<td class="col-action"><button class="btn btn-sm btn-primary" onclick="viewDetail(${row.approveManualKeyInTranId})">ดูรายละเอียด</button></td>`);
=======
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

        // Status badge (pill shape) — supports both mock statusCode strings and real statusId numbers
        const badgeClass = getStatusBadgeClass(row.statusCode, row.statusId);
        const iconSvg = getStatusIcon(row.statusCode, row.statusId);
        tr.append(`<td class="col-status"><span class="status-badge ${badgeClass}">${iconSvg}<span>${row.statusNameTh || '-'}</span></span></td>`);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

        tbody.append(tr);
    });
}

<<<<<<< HEAD
=======
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

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function renderDetailTable(details) {
    const tbody = $('#approveDetailTableBody');
    tbody.empty();

    if (!details || details.length === 0) {
<<<<<<< HEAD
        tbody.append('<tr><td colspan="4" style="text-align: center; padding: 20px;">No detail data</td></tr>');
=======
        fillDetailEmptyRows(tbody, 0);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        enableActionButtons(false);
        return;
    }

<<<<<<< HEAD
    details.forEach(detail => {
        const tr = $('<tr></tr>');
        const denomValue = detail.denomination || detail.Denomination || 0;
        const badgeClass = getDenominationBadgeClass(denomValue);
        tr.append(`<td class="col-denom-badge"><span class="qty-badge ${badgeClass}">${denomValue}</span></td>`);
        tr.append(`<td class="col-bn-type">${detail.bnType || detail.BnType || '-'}</td>`);
        tr.append(`<td class="col-form">${detail.form || '-'}</td>`);
        tr.append(`<td class="col-qty">${detail.quantity || detail.Qty || 0}</td>`);
        tbody.append(tr);
    });

=======
    details.forEach((detail, index) => {
        const rowBg = (index % 2 === 0) ? '#F8FAFC' : '#F2F6F6';
        const tr = $('<tr></tr>').css('background', rowBg);
        // denomination value: from mock (denomination) or from API (totalValue / qty)
        const denomValue = detail.denomination || detail.Denomination
            || (detail.qty > 0 ? Math.round(detail.totalValue / detail.qty) : 0);

        tr.append(`<td class="col-denom-badge"><span class="qty-badge">${denomValue}</span></td>`);
        tr.append(`<td class="col-detail-type">${detail.bnType || detail.BnType || '-'}</td>`);
        tr.append(`<td class="col-detail-form">${detail.denomSeries || detail.form || detail.Form || '-'}</td>`);
        tr.append(`<td class="col-detail-qty">${(detail.qty || detail.quantity || detail.Qty || 0).toLocaleString()}</td>`);
        tbody.append(tr);
    });

    fillDetailEmptyRows(tbody, details.length);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    enableActionButtons(true);
}

function clearDetailTable() {
    const tbody = $('#approveDetailTableBody');
    tbody.empty();
<<<<<<< HEAD
    tbody.append('<tr><td colspan="4" style="text-align: center; padding: 20px;">Please select a transaction</td></tr>');
    $('#detailHeaderCardCode').text('-');
=======
    fillDetailEmptyRows(tbody, 0);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    enableActionButtons(false);
}

// ===================================
<<<<<<< HEAD
=======
// Status Badge Helpers
// ===================================

function getStatusBadgeClass(statusCode, statusId) {
    // Support both mock string codes and real numeric status IDs
    if (statusCode === 'PENDING' || statusId === 24) return 'status-edit';
    if (statusCode === 'APPROVED' || statusId === 16) return 'status-approved';
    if (statusCode === 'DENIED' || statusId === 25) return 'status-denied';
    return 'status-pending';
}

function getStatusIcon(statusCode, statusId) {
    const isPending = statusCode === 'PENDING' || statusId === 24;
    const isApproved = statusCode === 'APPROVED' || statusId === 16;
    const isDenied = statusCode === 'DENIED' || statusId === 25;

    if (isPending)
        return '<svg class="status-icon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/><path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/></svg>';
    if (isApproved)
        return '<svg class="status-icon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>';
    if (isDenied)
        return '<svg class="status-icon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
    return '';
}

// ===================================
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// Event Handlers
// ===================================

function handleRowClick(e) {
    const row = $(e.currentTarget);
    const id = row.data('id');
    const hc = row.data('hc');

<<<<<<< HEAD
    // Update selection
    $('#approveMainTableBody tr').removeClass('selected');
    row.addClass('selected');
    row.find('input[type="radio"]').prop('checked', true);
=======
    if (!id) return;

    // Update selection
    $('#approveMainTableBody tr').removeClass('selected');
    row.addClass('selected');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    currentSelectedRow = row;
    currentSelectedId = id;

    // Load detail breakdown
    if (USE_MOCK_DATA) {
        loadDetailBreakdownMock(hc);
    } else {
        loadDetailBreakdown(id);
    }
}

<<<<<<< HEAD
function toggleSelectAll() {
    const isChecked = $('#selectAllCheckbox').is(':checked');
    $('#approveMainTableBody input[type="checkbox"]').prop('checked', isChecked);
}

function searchData() {
    const filters = {
        DepartmentId: parseInt($('#filterDepartment').val()) || null,
        BnTypeId: parseInt($('#filterBnType').val()) || null,
        MachineId: parseInt($('#filterMachine').val()) || null,
        HeaderCardCode: $('#filterHeaderCard').val() || null,
        DenoId: parseInt($('#filterDenomination').val()) || null,
        StartDate: $('#filterStartDate').val() || null,
        EndDate: $('#filterEndDate').val() || null,
=======
function searchData() {
    const filters = {
        HeaderCardCode: $('#filterHeaderCard').val() || null,
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        IsActive: true
    };

    if (USE_MOCK_DATA) {
        loadMainTableMock();
    } else {
        loadMainTable(filters);
    }
}

function clearFilters() {
    $('#filterHeaderCard').val('');
    $('#filterType').val('');
    $('#filterBank').val('');
    $('#filterZone').val('');
    $('#filterCashpoint').val('');
    $('#filterOperatorPrepare').val('');
    $('#filterOperatorReconcile').val('');
    $('#filterSupervisor').val('');
    $('#filterStatus').val('');

    if (USE_MOCK_DATA) {
        loadMainTableMock();
    } else {
        loadMainTable();
    }
}

<<<<<<< HEAD
function viewDetail(id) {
    const row = $(`#approveMainTableBody tr[data-id="${id}"]`);
    row.click();
}

function exportData() {
    console.log('Export function not implemented yet');
    showToast('info', 'Export function coming soon');
}

=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ===================================
// Modal Functions
// ===================================

function showApproveConfirmModal() {
    if (!currentSelectedId) {
<<<<<<< HEAD
        showToast('warning', 'Please select a transaction to approve');
        return;
    }
    $('#approveConfirmModal').fadeIn(200);
}

function closeApproveConfirmModal() {
    $('#approveConfirmModal').fadeOut(200);
=======
        showToast('warning', 'กรุณาเลือกรายการที่ต้องการ Approve');
        return;
    }
    $('#approveConfirmModal').addClass('show');
}

function closeApproveConfirmModal() {
    $('#approveConfirmModal').removeClass('show');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function confirmApprove() {
    if (USE_MOCK_DATA) {
        closeApproveConfirmModal();
<<<<<<< HEAD
        showSuccessModal('Approve successful (Mock)');
=======
        showSuccessModal('บันทึกข้อมูลสำเร็จ');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        loadMainTableMock();
        clearSelection();
    } else {
        submitApprove();
    }
}

function showDenyConfirmModal() {
    if (!currentSelectedId) {
<<<<<<< HEAD
        showToast('warning', 'Please select a transaction to deny');
=======
        showToast('warning', 'กรุณาเลือกรายการที่ต้องการ Deny');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        return;
    }
    const note = $('#approveNotes').val();
    if (!note || note.trim() === '') {
<<<<<<< HEAD
        showToast('warning', 'Please enter a remark before denying');
        return;
    }
    $('#denyConfirmModal').fadeIn(200);
}

function closeDenyConfirmModal() {
    $('#denyConfirmModal').fadeOut(200);
=======
        showToast('warning', 'กรุณากรอกหมายเหตุก่อน Deny');
        return;
    }
    $('#denyConfirmModal').addClass('show');
}

function closeDenyConfirmModal() {
    $('#denyConfirmModal').removeClass('show');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function confirmDeny() {
    if (USE_MOCK_DATA) {
        closeDenyConfirmModal();
<<<<<<< HEAD
        showSuccessModal('Deny successful (Mock)');
=======
        showSuccessModal('บันทึกข้อมูลสำเร็จ');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        loadMainTableMock();
        clearSelection();
    } else {
        submitDeny();
    }
}

function showSuccessModal(message) {
    $('#successMessage').text(message);
<<<<<<< HEAD
    $('#successModal').fadeIn(200);
}

function closeSuccessModal() {
    $('#successModal').fadeOut(200);
=======
    $('#successModal').addClass('show');
}

function closeSuccessModal() {
    $('#successModal').removeClass('show');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ===================================
// Utility Functions
// ===================================

<<<<<<< HEAD
=======
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

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function enableActionButtons(enabled) {
    $('#btnApprove').prop('disabled', !enabled);
    $('#btnDeny').prop('disabled', !enabled);
}

function clearSelection() {
    currentSelectedRow = null;
    currentSelectedId = null;
    $('#approveMainTableBody tr').removeClass('selected');
<<<<<<< HEAD
    $('#approveMainTableBody input[type="radio"]').prop('checked', false);
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    $('#approveNotes').val('');
    clearDetailTable();
}

function showToast(type, message) {
    console.log(`[${type.toUpperCase()}] ${message}`);
<<<<<<< HEAD
    // TODO: Integrate with toast notification library if available
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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

<<<<<<< HEAD
function getDenominationBadgeClass(denomination) {
    const denom = parseInt(denomination);
    switch (denom) {
        case 20: return 'qty-20';
        case 50: return 'qty-50';
        case 100: return 'qty-100';
        case 500: return 'qty-500';
        case 1000: return 'qty-1000';
        default: return 'qty-100'; // Default fallback
    }
}
=======
// ===================================
// Sort Functions
// ===================================
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

let sortState = {
    column: null,
    direction: 'asc'
};

function handleSort(e) {
    const th = $(e.currentTarget);
    const sortColumn = th.data('sort');

<<<<<<< HEAD
    // Toggle sort direction
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
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

<<<<<<< HEAD
    // Sort the data
=======
    // Sort data
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    currentPageData.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

<<<<<<< HEAD
        // Handle numeric vs string comparison
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
        } else {
            aVal = String(aVal || '').toLowerCase();
            bVal = String(bVal || '').toLowerCase();
<<<<<<< HEAD
            if (sortState.direction === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        }
    });

    // Re-render table
=======
            return sortState.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
    });

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    renderMainTable(currentPageData);
}

// ===================================
<<<<<<< HEAD
// Export for global access
=======
// Global Exports
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ===================================

window.toggleFilter = toggleFilter;
window.searchData = searchData;
window.clearFilters = clearFilters;
<<<<<<< HEAD
window.exportData = exportData;
window.viewDetail = viewDetail;
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
window.showApproveConfirmModal = showApproveConfirmModal;
window.closeApproveConfirmModal = closeApproveConfirmModal;
window.confirmApprove = confirmApprove;
window.showDenyConfirmModal = showDenyConfirmModal;
window.closeDenyConfirmModal = closeDenyConfirmModal;
window.confirmDeny = confirmDeny;
window.closeSuccessModal = closeSuccessModal;
<<<<<<< HEAD
window.toggleSelectAll = toggleSelectAll;
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
