/* ============================================
   Revoke Transaction JS — Multi-Variant Support
   Figma nodes: 2-51051, 2-52386, 2-51248, 2-51641
   ============================================ */

// ============ State ============
let hcListData = [];       // ตารางบน: HC items from API
<<<<<<< HEAD
let selectedHcIds = [];    // checked VerifyTranIds
let detailDataMap = {};    // { verifyTranId: [denominations] }
=======
let selectedHcIds = [];    // checked ReconcileTranIds
let detailDataMap = {};    // { reconcileTranId: [denominations] }
let activeDetailId = null; // row ที่กดดู detail (ทีละ 1)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// Sort state
let hcSortState = { column: null, direction: 'asc' };
let detailSortState = { column: null, direction: 'asc' };
let modalSortState = { column: null, direction: 'asc' };

<<<<<<< HEAD
const USE_MOCK_DATA = true;

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || '';
const cssVariantClass = document.getElementById('cssVariantClass')?.value || '';

=======
const USE_MOCK_DATA = false;

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;
const currentUserFullName = document.getElementById('currentUserFullName')?.value || '';
const cssVariantClass = document.getElementById('cssVariantClass')?.value || '';

// ============ OTP State ============
var revokeOtpData = {}; // { managerId, managerName, refCode }
var revokeOtpTimerInterval = null;

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Variant Config ============
// CC, CA Member → 4 filters (ธนาคาร, Zone, Cashpoint, ชนิดราคา)
// UNFIT, CA Non Member → 3 filters (ธนาคาร, ศูนย์เงินสด, ชนิดราคา)
function getVariantConfig(variant) {
    var usesZoneCashpoint = (variant === 'revoke-unsort-cc' || variant === 'revoke-ca-member');

    if (usesZoneCashpoint) {
        return {
            filterIds: ['filterBank', 'filterZone', 'filterCashpoint', 'filterDenomination'],
            filterGroupIds: {
                filterGroupBank: true,
                filterGroupZone: true,
                filterGroupCashpoint: true,
                filterGroupCashCenter: false,
                filterGroupDenomination: true
            },
            hcColumns: [
                { key: 'checkbox', label: '', sortable: false, className: 'col-chk' },
                { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
                { key: 'Bank', label: 'ธนาคาร', sortable: true },
                { key: 'Zone', label: 'Zone', sortable: true },
                { key: 'Cashpoint', label: 'Cashpoint', sortable: true },
                { key: 'PrepareDate', label: 'วันเวลาเตรียม', sortable: true, format: 'datetime' },
                { key: 'CreatedDate', label: 'วันเวลานับคัด', sortable: true, format: 'datetime' },
                { key: 'ShiftName', label: 'shift', sortable: true }
            ],
            modalColumns: [
                { key: 'HeaderCardCode', label: 'Header Card' },
                { key: 'Bank', label: 'ธนาคาร' },
                { key: 'Cashpoint', label: 'Cashpoint' },
                { key: 'PrepareDate', label: 'วันเวลาเตรียม', format: 'datetime' },
                { key: 'CreatedDate', label: 'วันเวลานับคัด', format: 'datetime' },
                { key: 'ShiftName', label: 'shift' }
            ]
        };
    }

    // UNFIT / CA Non Member
    return {
        filterIds: ['filterBank', 'filterCashCenter', 'filterDenomination'],
        filterGroupIds: {
            filterGroupBank: true,
            filterGroupZone: false,
            filterGroupCashpoint: false,
            filterGroupCashCenter: true,
            filterGroupDenomination: true
        },
        hcColumns: [
            { key: 'checkbox', label: '', sortable: false, className: 'col-chk' },
            { key: 'BarcodeWrap', label: 'บาร์โค้ดรายห่อ', sortable: true },
            { key: 'BarcodeBundle', label: 'บาร์โค้ดรายมัด', sortable: true },
            { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
            { key: 'Bank', label: 'ธนาคาร', sortable: true },
            { key: 'CashCenter', label: 'ศูนย์เงินสด', sortable: true },
            { key: 'PrepareDate', label: 'วันเวลาเตรียม', sortable: true, format: 'datetime' },
            { key: 'CreatedDate', label: 'วันเวลานับคัด', sortable: true, format: 'datetime' },
            { key: 'ShiftName', label: 'shift', sortable: true }
        ],
        modalColumns: [
            { key: 'BarcodeWrap', label: 'บาร์โค้ดรายห่อ' },
            { key: 'BarcodeBundle', label: 'บาร์โค้ดรายมัด' },
            { key: 'HeaderCardCode', label: 'Header Card' },
            { key: 'Bank', label: 'ธนาคาร' },
            { key: 'CashCenter', label: 'ศูนย์เงินสด' },
            { key: 'PrepareDate', label: 'วันเวลาเตรียม', format: 'datetime' },
            { key: 'CreatedDate', label: 'วันเวลานับคัด', format: 'datetime' },
            { key: 'ShiftName', label: 'shift' }
        ]
    };
}

var VARIANT = getVariantConfig(cssVariantClass);

<<<<<<< HEAD
=======
// ============ Cached Dropdown Data ============
var cachedSupervisorOptions = [];

function loadSupervisorDropdown() {
    return loadMasterDropdown({
        request: { tableName: 'MasterUserSuperVisor' },
        cacheKey: 'MasterUserSuperVisor',
        onLoaded: function (items) {
            cachedSupervisorOptions = items;
            populateManagerSelect();
        }
    });
}

function populateManagerSelect() {
    var el = document.getElementById('selectManager');
    if (!el) return;
    var placeholder = el.options[0];
    el.innerHTML = '';
    if (placeholder) el.appendChild(placeholder);
    cachedSupervisorOptions.forEach(function (item) {
        var opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item.name;
        el.appendChild(opt);
    });
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Init ============
document.addEventListener("DOMContentLoaded", function () {
    showCurrentDateTime();
    setInterval(showCurrentDateTime, 1000);
    initVariantUI();
    initFilterListeners();
    initPage();

    // Debug: กด 'm' สลับ data เยอะ/น้อย
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'm' && USE_MOCK_DATA) {
            var isFull = hcListData.length > 5;
            if (isFull) {
                hcListData = hcListData.slice(0, 3);
            } else {
                loadMockData();
                return;
            }
            selectedHcIds = [];
            detailDataMap = {};
            renderHcTable(hcListData);
            updateHcCount();
            hideDetailSection();
            console.log('[Debug] Toggle mock data:', isFull ? '3 รายการ' : 'ทั้งหมด');
        }
    });
});

async function initPage() {
    if (USE_MOCK_DATA) {
        loadMockData();
<<<<<<< HEAD
=======
        loadSupervisorDropdown();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        return;
    }
    $.enablePageLoader();
    try {
<<<<<<< HEAD
        await loadAllData();
=======
        await Promise.all([
            loadAllData(),
            loadSupervisorDropdown()
        ]);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    } finally {
        $.disablePageLoader();
    }
}

// ============ Variant UI Setup ============
function initVariantUI() {
    // Show/hide filter groups
    Object.keys(VARIANT.filterGroupIds).forEach(function (groupId) {
        var el = document.getElementById(groupId);
        if (el) {
            el.style.display = VARIANT.filterGroupIds[groupId] ? '' : 'none';
        }
    });

    // Build HC table thead
    buildHcThead();

    // Build modal confirm thead
    buildModalThead();
}

function buildHcThead() {
    var thead = document.getElementById('hcTableHead');
    if (!thead) return;
    thead.innerHTML = VARIANT.hcColumns.map(function (col) {
        if (col.key === 'checkbox') {
            return '<th class="col-chk"><input type="checkbox" id="checkAllHc" onchange="checkAllHcHandler(this.checked)" /></th>';
        }
        if (col.sortable) {
            return '<th class="th-sort" data-sort="' + col.key + '" onclick="sortHcTable(\'' + col.key + '\')">' +
                col.label + ' <i class="bi bi-chevron-expand sort-icon"></i></th>';
        }
        return '<th>' + col.label + '</th>';
    }).join('') + '<th></th>';
}

function buildModalThead() {
    var thead = document.getElementById('revokeConfirmTableHead');
    if (!thead) return;
    thead.innerHTML = VARIANT.modalColumns.map(function (col) {
        return '<th class="th-sort" data-sort="' + col.key + '" onclick="sortModalTable(\'' + col.key + '\')">' +
            col.label + ' <i class="bi bi-chevron-expand sort-icon"></i></th>';
    }).join('') + '<th></th>';
}

// ============ Date/Time Display ============
function showCurrentDateTime() {
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear() + 543;
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var formatted = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    var el = document.getElementById("infoDate");
    if (el) el.textContent = formatted;
}

// ============ Mock Data ============
function loadMockData() {
    var usesZoneCashpoint = (cssVariantClass === 'revoke-unsort-cc' || cssVariantClass === 'revoke-ca-member');

    if (usesZoneCashpoint) {
        // CC / CA Member — Zone + Cashpoint
        hcListData = [
            { VerifyTranId: 1, HeaderCardCode: '0054231020', Bank: 'ธนาคารแห่งประเทศไทย', Zone: 'Z.001', Cashpoint: 'สำนักงานใหญ่', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:30:00', PrepareDate: '2025-07-21T07:45:00', StatusId: 18 },
            { VerifyTranId: 2, HeaderCardCode: '0054231021', Bank: 'ธนาคารกรุงเทพ', Zone: 'Z.002', Cashpoint: 'สาขาสีลม', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:15:00', PrepareDate: '2025-07-21T08:30:00', StatusId: 18 },
            { VerifyTranId: 3, HeaderCardCode: '0054231022', Bank: 'ธนาคารกสิกร', Zone: 'Z.002', Cashpoint: 'สาขาอโศก', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T13:20:00', PrepareDate: '2025-07-21T12:45:00', StatusId: 18 },
            { VerifyTranId: 4, HeaderCardCode: '0054231023', Bank: 'ธนาคารไทยพาณิชย์', Zone: 'Z.003', Cashpoint: 'สาขาลาดพร้าว', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:00:00', PrepareDate: '2025-07-21T13:10:00', StatusId: 18 },
            { VerifyTranId: 5, HeaderCardCode: '0054231024', Bank: 'ธนาคารกรุงไทย', Zone: 'Z.001', Cashpoint: 'สำนักงานใหญ่', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:30:00', PrepareDate: '2025-07-21T09:50:00', StatusId: 18 },
            { VerifyTranId: 6, HeaderCardCode: '0054231025', Bank: 'ธนาคารกรุงศรี', Zone: 'Z.003', Cashpoint: 'สาขาบางนา', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:00:00', PrepareDate: '2025-07-21T14:20:00', StatusId: 18 },
            { VerifyTranId: 7, HeaderCardCode: '0054231026', Bank: 'ธนาคารทหารไทยธนชาต', Zone: 'Z.001', Cashpoint: 'สาขาพหลโยธิน', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:00:00', PrepareDate: '2025-07-21T07:15:00', StatusId: 18 },
            { VerifyTranId: 8, HeaderCardCode: '0054231027', Bank: 'ธนาคารออมสิน', Zone: 'Z.002', Cashpoint: 'สาขาราชดำเนิน', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:45:00', PrepareDate: '2025-07-21T09:00:00', StatusId: 18 },
            { VerifyTranId: 9, HeaderCardCode: '0054231028', Bank: 'ธนาคารแห่งประเทศไทย', Zone: 'Z.003', Cashpoint: 'สาขารังสิต', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T13:50:00', PrepareDate: '2025-07-21T13:00:00', StatusId: 18 },
            { VerifyTranId: 10, HeaderCardCode: '0054231029', Bank: 'ธนาคารกรุงเทพ', Zone: 'Z.001', Cashpoint: 'สาขาสยาม', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:00:00', PrepareDate: '2025-07-21T09:20:00', StatusId: 18 },
            { VerifyTranId: 11, HeaderCardCode: '0054231030', Bank: 'ธนาคารกสิกร', Zone: 'Z.003', Cashpoint: 'สาขาบางแค', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:30:00', PrepareDate: '2025-07-21T13:45:00', StatusId: 18 },
            { VerifyTranId: 12, HeaderCardCode: '0054231031', Bank: 'ธนาคารไทยพาณิชย์', Zone: 'Z.002', Cashpoint: 'สาขาทองหล่อ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:45:00', PrepareDate: '2025-07-21T08:00:00', StatusId: 18 },
            { VerifyTranId: 13, HeaderCardCode: '0054231032', Bank: 'ธนาคารกรุงไทย', Zone: 'Z.002', Cashpoint: 'สาขาเอกมัย', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:30:00', PrepareDate: '2025-07-21T14:50:00', StatusId: 18 },
            { VerifyTranId: 14, HeaderCardCode: '0054231033', Bank: 'ธนาคารกรุงศรี', Zone: 'Z.001', Cashpoint: 'สาขาจตุจักร', ShiftName: 'เช้า', CreatedDate: '2025-07-21T11:00:00', PrepareDate: '2025-07-21T10:15:00', StatusId: 18 },
            { VerifyTranId: 15, HeaderCardCode: '0054231034', Bank: 'ธนาคารทหารไทยธนชาต', Zone: 'Z.003', Cashpoint: 'สาขามีนบุรี', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T16:00:00', PrepareDate: '2025-07-21T15:15:00', StatusId: 18 },
            { VerifyTranId: 16, HeaderCardCode: '0054231035', Bank: 'ธนาคารออมสิน', Zone: 'Z.001', Cashpoint: 'สาขาบางซื่อ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T07:30:00', PrepareDate: '2025-07-21T06:45:00', StatusId: 18 },
            { VerifyTranId: 17, HeaderCardCode: '0054231036', Bank: 'ธนาคารแห่งประเทศไทย', Zone: 'Z.002', Cashpoint: 'สาขาสุขุมวิท', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:15:00', PrepareDate: '2025-07-21T13:30:00', StatusId: 18 },
            { VerifyTranId: 18, HeaderCardCode: '0054231037', Bank: 'ธนาคารกรุงเทพ', Zone: 'Z.003', Cashpoint: 'สาขาพระราม 9', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:30:00', PrepareDate: '2025-07-21T08:45:00', StatusId: 18 },
            { VerifyTranId: 19, HeaderCardCode: '0054231038', Bank: 'ธนาคารกสิกร', Zone: 'Z.001', Cashpoint: 'สาขาอารีย์', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:45:00', PrepareDate: '2025-07-21T15:00:00', StatusId: 18 },
            { VerifyTranId: 20, HeaderCardCode: '0054231039', Bank: 'ธนาคารไทยพาณิชย์', Zone: 'Z.002', Cashpoint: 'สาขาพร้อมพงษ์', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:45:00', PrepareDate: '2025-07-21T10:00:00', StatusId: 18 }
        ];
    } else {
        // UNFIT / CA Non Member — CashCenter + Barcode
        hcListData = [
            { VerifyTranId: 1, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002001', HeaderCardCode: '0054231020', Bank: 'ธนาคารแห่งประเทศไทย', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:30:00', PrepareDate: '2025-07-21T07:45:00', StatusId: 18 },
            { VerifyTranId: 2, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002002', HeaderCardCode: '0054231021', Bank: 'ธนาคารกรุงเทพ', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:15:00', PrepareDate: '2025-07-21T08:30:00', StatusId: 18 },
            { VerifyTranId: 3, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002003', HeaderCardCode: '0054231022', Bank: 'ธนาคารกสิกร', CashCenter: 'ศูนย์เงินสดเชียงใหม่', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T13:20:00', PrepareDate: '2025-07-21T12:45:00', StatusId: 18 },
            { VerifyTranId: 4, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002004', HeaderCardCode: '0054231023', Bank: 'ธนาคารไทยพาณิชย์', CashCenter: 'ศูนย์เงินสดขอนแก่น', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:00:00', PrepareDate: '2025-07-21T13:10:00', StatusId: 18 },
            { VerifyTranId: 5, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002005', HeaderCardCode: '0054231024', Bank: 'ธนาคารกรุงไทย', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:30:00', PrepareDate: '2025-07-21T09:50:00', StatusId: 18 },
            { VerifyTranId: 6, BarcodeWrap: '002002230000001010', BarcodeBundle: '002002230000010100002006', HeaderCardCode: '0054231025', Bank: 'ธนาคารกรุงศรี', CashCenter: 'ศูนย์เงินสดเชียงใหม่', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:00:00', PrepareDate: '2025-07-21T14:20:00', StatusId: 18 },
            { VerifyTranId: 7, BarcodeWrap: '002002230000001011', BarcodeBundle: '002002230000010100003001', HeaderCardCode: '0054231026', Bank: 'ธนาคารทหารไทยธนชาต', CashCenter: 'ศูนย์เงินสดนครราชสีมา', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:00:00', PrepareDate: '2025-07-21T07:15:00', StatusId: 18 },
            { VerifyTranId: 8, BarcodeWrap: '002002230000001011', BarcodeBundle: '002002230000010100003002', HeaderCardCode: '0054231027', Bank: 'ธนาคารออมสิน', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:45:00', PrepareDate: '2025-07-21T09:00:00', StatusId: 18 },
            { VerifyTranId: 9, BarcodeWrap: '002002230000001011', BarcodeBundle: '002002230000010100003003', HeaderCardCode: '0054231028', Bank: 'ธนาคารแห่งประเทศไทย', CashCenter: 'ศูนย์เงินสดสงขลา', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T13:50:00', PrepareDate: '2025-07-21T13:00:00', StatusId: 18 },
            { VerifyTranId: 10, BarcodeWrap: '002002230000001011', BarcodeBundle: '002002230000010100003004', HeaderCardCode: '0054231029', Bank: 'ธนาคารกรุงเทพ', CashCenter: 'ศูนย์เงินสดเชียงใหม่', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:00:00', PrepareDate: '2025-07-21T09:20:00', StatusId: 18 },
            { VerifyTranId: 11, BarcodeWrap: '002002230000001012', BarcodeBundle: '002002230000010100004001', HeaderCardCode: '0054231030', Bank: 'ธนาคารกสิกร', CashCenter: 'ศูนย์เงินสดขอนแก่น', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:30:00', PrepareDate: '2025-07-21T13:45:00', StatusId: 18 },
            { VerifyTranId: 12, BarcodeWrap: '002002230000001012', BarcodeBundle: '002002230000010100004002', HeaderCardCode: '0054231031', Bank: 'ธนาคารไทยพาณิชย์', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T08:45:00', PrepareDate: '2025-07-21T08:00:00', StatusId: 18 },
            { VerifyTranId: 13, BarcodeWrap: '002002230000001012', BarcodeBundle: '002002230000010100004003', HeaderCardCode: '0054231032', Bank: 'ธนาคารกรุงไทย', CashCenter: 'ศูนย์เงินสดนครราชสีมา', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:30:00', PrepareDate: '2025-07-21T14:50:00', StatusId: 18 },
            { VerifyTranId: 14, BarcodeWrap: '002002230000001012', BarcodeBundle: '002002230000010100004004', HeaderCardCode: '0054231033', Bank: 'ธนาคารกรุงศรี', CashCenter: 'ศูนย์เงินสดสงขลา', ShiftName: 'เช้า', CreatedDate: '2025-07-21T11:00:00', PrepareDate: '2025-07-21T10:15:00', StatusId: 18 },
            { VerifyTranId: 15, BarcodeWrap: '002002230000001013', BarcodeBundle: '002002230000010100005001', HeaderCardCode: '0054231034', Bank: 'ธนาคารทหารไทยธนชาต', CashCenter: 'ศูนย์เงินสดเชียงใหม่', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T16:00:00', PrepareDate: '2025-07-21T15:15:00', StatusId: 18 },
            { VerifyTranId: 16, BarcodeWrap: '002002230000001013', BarcodeBundle: '002002230000010100005002', HeaderCardCode: '0054231035', Bank: 'ธนาคารออมสิน', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T07:30:00', PrepareDate: '2025-07-21T06:45:00', StatusId: 18 },
            { VerifyTranId: 17, BarcodeWrap: '002002230000001013', BarcodeBundle: '002002230000010100005003', HeaderCardCode: '0054231036', Bank: 'ธนาคารแห่งประเทศไทย', CashCenter: 'ศูนย์เงินสดขอนแก่น', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T14:15:00', PrepareDate: '2025-07-21T13:30:00', StatusId: 18 },
            { VerifyTranId: 18, BarcodeWrap: '002002230000001013', BarcodeBundle: '002002230000010100005004', HeaderCardCode: '0054231037', Bank: 'ธนาคารกรุงเทพ', CashCenter: 'ศูนย์เงินสดนครราชสีมา', ShiftName: 'เช้า', CreatedDate: '2025-07-21T09:30:00', PrepareDate: '2025-07-21T08:45:00', StatusId: 18 },
            { VerifyTranId: 19, BarcodeWrap: '002002230000001014', BarcodeBundle: '002002230000010100006001', HeaderCardCode: '0054231038', Bank: 'ธนาคารกสิกร', CashCenter: 'ศูนย์เงินสดสงขลา', ShiftName: 'บ่าย', CreatedDate: '2025-07-21T15:45:00', PrepareDate: '2025-07-21T15:00:00', StatusId: 18 },
            { VerifyTranId: 20, BarcodeWrap: '002002230000001014', BarcodeBundle: '002002230000010100006002', HeaderCardCode: '0054231039', Bank: 'ธนาคารไทยพาณิชย์', CashCenter: 'ศูนย์เงินสดกรุงเทพ', ShiftName: 'เช้า', CreatedDate: '2025-07-21T10:45:00', PrepareDate: '2025-07-21T10:00:00', StatusId: 18 }
        ];
    }

    renderHcTable(hcListData);
    updateHcCount();
    populateFilterDropdowns();
}

// Mock detail per HC
var mockDetailMap = {
    1: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 995, totalValue: 995000 },
        { denominationPrice: 1000, bnType: 'ทำลาย', denomSeries: '17', qty: 1, totalValue: 1000 },
        { denominationPrice: 1000, bnType: 'Reject', denomSeries: '17', qty: 4, totalValue: 4000 }
    ],
    2: [
        { denominationPrice: 500, bnType: 'ดี', denomSeries: '16', qty: 850, totalValue: 425000 },
        { denominationPrice: 500, bnType: 'ทำลาย', denomSeries: '16', qty: 12, totalValue: 6000 },
        { denominationPrice: 500, bnType: 'Reject', denomSeries: '16', qty: 3, totalValue: 1500 }
    ],
    3: [
        { denominationPrice: 100, bnType: 'ดี', denomSeries: '15', qty: 1200, totalValue: 120000 },
        { denominationPrice: 100, bnType: 'ทำลาย', denomSeries: '15', qty: 45, totalValue: 4500 },
        { denominationPrice: 100, bnType: 'Reject', denomSeries: '17', qty: 8, totalValue: 800 }
    ],
    4: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 500, totalValue: 500000 },
        { denominationPrice: 1000, bnType: 'ทำลาย', denomSeries: '17', qty: 3, totalValue: 3000 }
    ],
    5: [
        { denominationPrice: 50, bnType: 'ดี', denomSeries: '16', qty: 2000, totalValue: 100000 },
        { denominationPrice: 50, bnType: 'ทำลาย', denomSeries: '16', qty: 18, totalValue: 900 },
        { denominationPrice: 50, bnType: 'Reject', denomSeries: '16', qty: 5, totalValue: 250 }
    ],
    6: [
        { denominationPrice: 20, bnType: 'ดี', denomSeries: '17', qty: 3000, totalValue: 60000 },
        { denominationPrice: 20, bnType: 'ทำลาย', denomSeries: '17', qty: 22, totalValue: 440 }
    ],
    7: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 780, totalValue: 780000 },
        { denominationPrice: 500, bnType: 'ดี', denomSeries: '16', qty: 320, totalValue: 160000 },
        { denominationPrice: 500, bnType: 'Reject', denomSeries: '16', qty: 7, totalValue: 3500 }
    ],
    8: [
        { denominationPrice: 100, bnType: 'ดี', denomSeries: '15', qty: 1500, totalValue: 150000 },
        { denominationPrice: 100, bnType: 'ทำลาย', denomSeries: '15', qty: 30, totalValue: 3000 }
    ],
    9: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 600, totalValue: 600000 },
        { denominationPrice: 1000, bnType: 'ทำลาย', denomSeries: '17', qty: 5, totalValue: 5000 },
        { denominationPrice: 1000, bnType: 'Reject', denomSeries: '17', qty: 2, totalValue: 2000 }
    ],
    10: [
        { denominationPrice: 50, bnType: 'ดี', denomSeries: '16', qty: 1800, totalValue: 90000 },
        { denominationPrice: 50, bnType: 'ทำลาย', denomSeries: '16', qty: 25, totalValue: 1250 }
    ],
    11: [
        { denominationPrice: 20, bnType: 'ดี', denomSeries: '17', qty: 4500, totalValue: 90000 },
        { denominationPrice: 20, bnType: 'ทำลาย', denomSeries: '17', qty: 40, totalValue: 800 },
        { denominationPrice: 20, bnType: 'Reject', denomSeries: '17', qty: 10, totalValue: 200 }
    ],
    12: [
        { denominationPrice: 500, bnType: 'ดี', denomSeries: '16', qty: 950, totalValue: 475000 },
        { denominationPrice: 500, bnType: 'ทำลาย', denomSeries: '16', qty: 8, totalValue: 4000 }
    ],
    13: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 420, totalValue: 420000 },
        { denominationPrice: 100, bnType: 'ดี', denomSeries: '15', qty: 800, totalValue: 80000 },
        { denominationPrice: 100, bnType: 'Reject', denomSeries: '15', qty: 15, totalValue: 1500 }
    ],
    14: [
        { denominationPrice: 50, bnType: 'ดี', denomSeries: '16', qty: 2200, totalValue: 110000 },
        { denominationPrice: 50, bnType: 'ทำลาย', denomSeries: '16', qty: 35, totalValue: 1750 },
        { denominationPrice: 50, bnType: 'Reject', denomSeries: '16', qty: 12, totalValue: 600 }
    ],
    15: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 1100, totalValue: 1100000 },
        { denominationPrice: 1000, bnType: 'ทำลาย', denomSeries: '17', qty: 9, totalValue: 9000 }
    ],
    16: [
        { denominationPrice: 100, bnType: 'ดี', denomSeries: '15', qty: 2500, totalValue: 250000 },
        { denominationPrice: 100, bnType: 'ทำลาย', denomSeries: '17', qty: 60, totalValue: 6000 },
        { denominationPrice: 100, bnType: 'Reject', denomSeries: '15', qty: 20, totalValue: 2000 }
    ],
    17: [
        { denominationPrice: 500, bnType: 'ดี', denomSeries: '16', qty: 700, totalValue: 350000 },
        { denominationPrice: 500, bnType: 'Reject', denomSeries: '16', qty: 4, totalValue: 2000 }
    ],
    18: [
        { denominationPrice: 20, bnType: 'ดี', denomSeries: '17', qty: 5000, totalValue: 100000 },
        { denominationPrice: 20, bnType: 'ทำลาย', denomSeries: '17', qty: 55, totalValue: 1100 }
    ],
    19: [
        { denominationPrice: 1000, bnType: 'ดี', denomSeries: '17', qty: 350, totalValue: 350000 },
        { denominationPrice: 500, bnType: 'ดี', denomSeries: '16', qty: 600, totalValue: 300000 },
        { denominationPrice: 100, bnType: 'ดี', denomSeries: '15', qty: 900, totalValue: 90000 }
    ],
    20: [
        { denominationPrice: 50, bnType: 'ดี', denomSeries: '16', qty: 3200, totalValue: 160000 },
        { denominationPrice: 50, bnType: 'ทำลาย', denomSeries: '16', qty: 45, totalValue: 2250 },
        { denominationPrice: 20, bnType: 'ดี', denomSeries: '17', qty: 1500, totalValue: 30000 }
    ]
};

// ============ API Calls ============
<<<<<<< HEAD
function getRevokeTransactionsAsync(requestData) {
=======
function getRevokeListAsync(requestData) {
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Revoke/GetRevokeTransactionsDetailAsync',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) { resolve(response); },
            onError: function (err) { reject(err); }
        });
    });
}

<<<<<<< HEAD
function getRevokeDetailAsync(verifyTranId) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Revoke/GetRevokeDetail/' + verifyTranId,
=======
function getRevokeDetailAsync(headerCardCode) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Revoke/GetRevokeDetail?headerCardCode=' + encodeURIComponent(headerCardCode),
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            type: 'GET',
            parameter: {},
            enableLoader: false,
            onSuccess: function (response) { resolve(response); },
            onError: function (err) { reject(err); }
        });
    });
}

<<<<<<< HEAD
function revokeActionAsync(verifyTranId) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Revoke/RevokeAction',
            type: 'POST',
            parameter: { VerifyTranId: verifyTranId },
=======
function executeRevokeAsync(reconcileTranIds, remark) {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Revoke/ExecuteRevoke',
            type: 'POST',
            parameter: {
                ReconcileTranIds: reconcileTranIds,
                Remark: remark || null
            },
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            enableLoader: false,
            onSuccess: function (response) { resolve(response); },
            onError: function (err) { reject(err); }
        });
    });
}

// ============ Load All Data ============
<<<<<<< HEAD
async function loadAllData(filterParams) {
    try {
        var requestData = { PageNumber: 1, PageSize: 500 };

        // Merge filter params into request if provided
        if (filterParams) {
            if (filterParams.bank) requestData.Bank = filterParams.bank;
            if (filterParams.zone) requestData.Zone = filterParams.zone;
            if (filterParams.cashpoint) requestData.Cashpoint = filterParams.cashpoint;
            if (filterParams.cashCenter) requestData.CashCenter = filterParams.cashCenter;
            if (filterParams.denomination) requestData.Denomination = filterParams.denomination;
        }

        console.log('[Revoke] loadAllData — calling API...', requestData);
        var response = await getRevokeTransactionsAsync(requestData);
=======
async function loadAllData() {
    try {
        var requestData = { PageNumber: 1, PageSize: 500 };

        console.log('[Revoke] loadAllData — calling API...', requestData);
        var response = await getRevokeListAsync(requestData);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        console.log('[Revoke] loadAllData — response:', JSON.stringify(response).substring(0, 500));

        if (response && response.is_success && response.data) {
            hcListData = (response.data.items || []).map(function (x) {
                return {
<<<<<<< HEAD
                    VerifyTranId: x.verifyTranId,
                    HeaderCardCode: x.headerCardCode || '-',
                    ShiftName: x.shiftName || '-',
                    CreatedDate: x.createdDate,
                    PrepareDate: x.prepareDate,
                    StatusId: x.statusId,
                    Bank: x.bank || '-',
                    Zone: x.zone || '-',
                    Cashpoint: x.cashpoint || '-',
                    CashCenter: x.cashCenter || '-'
=======
                    ReconcileTranId: x.reconcileTranId,
                    HeaderCardCode: x.headerCardCode || '-',
                    ShiftName: x.shiftName || '-',
                    CreatedDate: x.createdDate,
                    StatusId: x.statusId,
                    StatusName: x.statusName || '-',
                    Bank: x.bank || '-',
                    Zone: x.zone || '-',
                    Cashpoint: x.cashpoint || '-',
                    CashCenter: x.cashpoint || '-',
                    DenominationPrice: x.denominationPrice,
                    ReconcileQty: x.reconcileQty,
                    ReconcileTotalValue: x.reconcileTotalValue,
                    Denominations: x.denominations || []
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                };
            });
        } else {
            console.warn('[Revoke] loadAllData — API returned empty or failed:', response);
            hcListData = [];
        }

        console.log('[Revoke] loadAllData — hcListData count:', hcListData.length);

        // Reset selections
        selectedHcIds = [];
        detailDataMap = {};

        renderHcTable(hcListData);
        updateHcCount();

<<<<<<< HEAD
        // Only repopulate dropdowns on initial load (no filter), not on filter-reload
        if (!filterParams) {
            populateFilterDropdowns();
        }
=======
        populateFilterDropdowns();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

        hideDetailSection();
    } catch (err) {
        console.error('loadAllData error:', err);
        hcListData = [];
        renderHcTable(hcListData);
    }
}

// ============ Render HC Table (ตารางบน) — Dynamic Columns ============
function renderHcTable(data) {
    var tbody = document.getElementById('hcTableBody');
    if (!tbody) return;

    var colCount = VARIANT.hcColumns.length;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + (colCount + 1) + '" class="text-center text-muted">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(function (item) {
<<<<<<< HEAD
        var isChecked = selectedHcIds.indexOf(item.VerifyTranId) !== -1;
        var cells = VARIANT.hcColumns.map(function (col) {
            if (col.key === 'checkbox') {
                return '<td class="col-chk"><input type="checkbox" ' + (isChecked ? 'checked' : '') +
                    ' onchange="onHcCheckboxChange(' + item.VerifyTranId + ', this.checked)" /></td>';
=======
        var isChecked = selectedHcIds.indexOf(item.ReconcileTranId) !== -1;
        var cells = VARIANT.hcColumns.map(function (col) {
            if (col.key === 'checkbox') {
                return '<td class="col-chk"><input type="checkbox" ' + (isChecked ? 'checked' : '') +
                    ' onclick="event.stopPropagation()" onchange="onHcCheckboxChange(' + item.ReconcileTranId + ', this.checked)" /></td>';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            }
            if (col.format === 'datetime') {
                return '<td>' + formatDateTime(item[col.key]) + '</td>';
            }
            return '<td>' + (item[col.key] || '-') + '</td>';
        }).join('');

<<<<<<< HEAD
        return '<tr class="' + (isChecked ? 'selected' : '') + '" data-id="' + item.VerifyTranId + '">' + cells + '<td></td></tr>';
=======
        var isActive = activeDetailId === item.ReconcileTranId;
        var rowClass = (isActive ? 'active-detail' : '');
        return '<tr class="' + rowClass + '" data-id="' + item.ReconcileTranId + '" onclick="onRowClick(' + item.ReconcileTranId + ')" style="cursor:pointer;">' + cells + '<td></td></tr>';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }).join('');

    // Sync checkAll state
    var checkAll = document.getElementById('checkAllHc');
    if (checkAll) {
        checkAll.checked = selectedHcIds.length > 0 && selectedHcIds.length === data.length;
    }
}

function updateHcCount() {
    var el = document.getElementById('hcTotalCount');
    if (el) el.textContent = numberWithCommas(hcListData.length);
}

<<<<<<< HEAD
// ============ Checkbox Handlers ============
function onHcCheckboxChange(verifyTranId, checked) {
    if (checked) {
        if (selectedHcIds.indexOf(verifyTranId) === -1) {
            selectedHcIds.push(verifyTranId);
        }
    } else {
        selectedHcIds = selectedHcIds.filter(function (id) { return id !== verifyTranId; });
        delete detailDataMap[verifyTranId];
    }

    // Update row highlight
    var row = document.querySelector('#hcTableBody tr[data-id="' + verifyTranId + '"]');
    if (row) {
        if (checked) row.classList.add('selected');
        else row.classList.remove('selected');
=======
// ============ Checkbox Handlers (เลือกเพื่อ Revoke) ============
function onHcCheckboxChange(reconcileTranId, checked) {
    if (checked) {
        if (selectedHcIds.indexOf(reconcileTranId) === -1) {
            selectedHcIds.push(reconcileTranId);
        }
    } else {
        selectedHcIds = selectedHcIds.filter(function (id) { return id !== reconcileTranId; });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }

    // Sync checkAll
    var visibleData = getFilteredData();
    var checkAll = document.getElementById('checkAllHc');
    if (checkAll) {
        checkAll.checked = selectedHcIds.length > 0 && selectedHcIds.length === visibleData.length;
    }
<<<<<<< HEAD

    loadDetailForSelected();
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function checkAllHcHandler(checked) {
    selectedHcIds = [];
<<<<<<< HEAD
    detailDataMap = {};
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    var visibleData = getFilteredData();

    if (checked) {
        visibleData.forEach(function (item) {
<<<<<<< HEAD
            selectedHcIds.push(item.VerifyTranId);
=======
            selectedHcIds.push(item.ReconcileTranId);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        });
    }

    renderHcTable(visibleData);
<<<<<<< HEAD
    loadDetailForSelected();
}

// ============ Load Detail for Selected HCs (ตารางล่าง) ============
async function loadDetailForSelected() {
    if (selectedHcIds.length === 0) {
        hideDetailSection();
        return;
    }

    showDetailSection();

    if (USE_MOCK_DATA) {
        selectedHcIds.forEach(function (id) {
            detailDataMap[id] = mockDetailMap[id] || [];
        });
=======
}

// ============ Row Click Handler (ดู Detail ทีละ 1 รายการ) ============
async function onRowClick(reconcileTranId) {
    // Toggle: ถ้ากดซ้ำ → ปิด detail
    if (activeDetailId === reconcileTranId) {
        activeDetailId = null;
        hideDetailSection();
        highlightActiveRow(null);
        return;
    }

    activeDetailId = reconcileTranId;
    highlightActiveRow(reconcileTranId);
    showDetailSection();

    if (USE_MOCK_DATA) {
        detailDataMap = {};
        detailDataMap[reconcileTranId] = mockDetailMap[reconcileTranId] || [];
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        renderDetailTable();
        return;
    }

<<<<<<< HEAD
    // Load detail for IDs not yet fetched
    var toLoad = selectedHcIds.filter(function (id) { return !detailDataMap[id]; });

    if (toLoad.length > 0) {
        $.enablePageLoader();
        try {
            var promises = toLoad.map(function (id) {
                return getRevokeDetailAsync(id).then(function (response) {
                    if (response && response.is_success && response.data && response.data.denominations) {
                        detailDataMap[id] = response.data.denominations;
                    } else {
                        detailDataMap[id] = [];
                    }
                }).catch(function () {
                    detailDataMap[id] = [];
                });
            });
            await Promise.all(promises);
        } finally {
            $.disablePageLoader();
        }
    }

    renderDetailTable();
}

=======
    // Call detail API using headerCardCode
    var item = hcListData.find(function (x) { return x.ReconcileTranId === reconcileTranId; });
    var headerCardCode = item ? item.HeaderCardCode : '';

    $.enablePageLoader();
    try {
        var response = await getRevokeDetailAsync(headerCardCode);
        detailDataMap = {};
        if (response && response.is_success && response.data && response.data.rows) {
            detailDataMap[reconcileTranId] = response.data.rows;
        } else {
            // Fallback: ใช้ denominations จาก list data
            detailDataMap[reconcileTranId] = (item && item.Denominations) ? item.Denominations : [];
        }
        renderDetailTable();
    } catch (err) {
        console.error('[Revoke] getRevokeDetail error:', err);
        detailDataMap = {};
        detailDataMap[reconcileTranId] = [];
        renderDetailTable();
    } finally {
        $.disablePageLoader();
    }
}

function highlightActiveRow(reconcileTranId) {
    var rows = document.querySelectorAll('#hcTableBody tr');
    rows.forEach(function (row) {
        row.classList.remove('active-detail');
    });
    if (reconcileTranId) {
        var row = document.querySelector('#hcTableBody tr[data-id="' + reconcileTranId + '"]');
        if (row) row.classList.add('active-detail');
    }
}

// (Detail loading is now handled by onRowClick)

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Render Detail Table (ตารางล่าง) ============
function renderDetailTable() {
    var tbody = document.getElementById('detailTableBody');
    if (!tbody) return;

<<<<<<< HEAD
    // Aggregate all denominations from selected HCs
    var allDenoms = [];
    selectedHcIds.forEach(function (id) {
        var denoms = detailDataMap[id] || [];
        denoms.forEach(function (d) {
            allDenoms.push(d);
        });
    });
=======
    // Show denominations for the active detail row
    var allDenoms = [];
    if (activeDetailId) {
        var denoms = detailDataMap[activeDetailId] || [];
        denoms.forEach(function (d) {
            allDenoms.push(d);
        });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    if (allDenoms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">ไม่มีข้อมูลรายละเอียด</td></tr>';
        updateDetailCount(0);
        return;
    }

    var totalQty = 0;
    tbody.innerHTML = allDenoms.map(function (d) {
        var qty = d.qty || d.Qty || 0;
<<<<<<< HEAD
        var denomPrice = d.denominationPrice || d.DenominationPrice || '-';
        totalQty += qty;
        return '<tr>' +
            '<td><span class="qty-badge qty-' + denomPrice + '">' + numberWithCommas(denomPrice) + '</span></td>' +
            '<td>' + (d.bnType || d.BnType || '-') + '</td>' +
            '<td>' + (d.denomSeries || d.DenomSeries || '-') + '</td>' +
            '<td class="col-qty">' + numberWithCommas(qty) + '</td>' +
            '<td></td>' +
=======
        var denomPrice = d.denoPrice || d.DenoPrice || '-';
        totalQty += qty;
        return '<tr>' +
            '<td><span class="qty-badge qty-' + denomPrice + '">' + denomPrice + '</span></td>' +
            '<td>' + (d.bnType || d.BnType || '-') + '</td>' +
            '<td>' + (d.denomSeries || d.DenomSeries || '-') + '</td>' +
            '<td class="col-qty">' + numberWithCommas(qty) + '</td>' +
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            '</tr>';
    }).join('');

    updateDetailCount(totalQty);
}

function updateDetailCount(qty) {
    var el = document.getElementById('detailTotalQty');
    if (el) el.textContent = numberWithCommas(qty);
}

function showDetailSection() {
    var el = document.getElementById('detailSection');
    if (el) el.style.display = 'flex';
}

function hideDetailSection() {
    var el = document.getElementById('detailSection');
    if (el) el.style.display = 'none';
}

// ============ Revoke Confirm Modal — Dynamic Columns ============
function openRevokeConfirmModal() {
    if (selectedHcIds.length === 0) {
        showRevokeError('กรุณาเลือกรายการ Header Card ที่ต้องการ Revoke');
        return;
    }

    // Reset modal sort state
    modalSortState = { column: null, direction: 'asc' };
    updateSortIcons('revokeConfirmTable', null, 'asc');

    renderModalTable(selectedHcIds);

<<<<<<< HEAD
    // Reset manager select
    var managerSelect = document.getElementById('selectManager');
    if (managerSelect) managerSelect.value = '';
=======
    // Reset manager select + OTP state
    var managerSelect = document.getElementById('selectManager');
    if (managerSelect) managerSelect.value = '';
    BssModal.hideInlineError('revokeManagerError');
    revokeOtpData = {};

    // Always start at Step A
    BssModal.setStep('revokeConfirmModal', 'revokeStepA');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    var modal = new bootstrap.Modal(document.getElementById('revokeConfirmModal'));
    modal.show();
}

function renderModalTable(ids) {
    var tbody = document.getElementById('revokeConfirmTableBody');
    if (!tbody) return;

    var items = ids.map(function (id) {
<<<<<<< HEAD
        return hcListData.find(function (x) { return x.VerifyTranId === id; });
=======
        return hcListData.find(function (x) { return x.ReconcileTranId === id; });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }).filter(Boolean);

    tbody.innerHTML = items.map(function (item) {
        var cells = VARIANT.modalColumns.map(function (col) {
            if (col.format === 'datetime') {
                return '<td>' + formatDateTime(item[col.key]) + '</td>';
            }
            return '<td>' + (item[col.key] || '-') + '</td>';
        }).join('');
        return '<tr>' + cells + '<td></td></tr>';
    }).join('');
}

function sortModalTable(column) {
    if (modalSortState.column === column) {
        modalSortState.direction = modalSortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        modalSortState.column = column;
        modalSortState.direction = 'asc';
    }

    // Get selected items and sort
    var items = selectedHcIds.map(function (id) {
<<<<<<< HEAD
        return hcListData.find(function (x) { return x.VerifyTranId === id; });
=======
        return hcListData.find(function (x) { return x.ReconcileTranId === id; });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }).filter(Boolean);

    items.sort(function (a, b) {
        var valA = a[column] || '';
        var valB = b[column] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return modalSortState.direction === 'asc' ? -1 : 1;
        if (valA > valB) return modalSortState.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Re-render with sorted order
    var tbody = document.getElementById('revokeConfirmTableBody');
    if (tbody) {
        tbody.innerHTML = items.map(function (item) {
            var cells = VARIANT.modalColumns.map(function (col) {
                if (col.format === 'datetime') {
                    return '<td>' + formatDateTime(item[col.key]) + '</td>';
                }
                return '<td>' + (item[col.key] || '-') + '</td>';
            }).join('');
            return '<tr>' + cells + '<td></td></tr>';
        }).join('');
    }

    updateSortIcons('revokeConfirmTable', column, modalSortState.direction);
}

<<<<<<< HEAD
async function confirmRevoke() {
    if (selectedHcIds.length === 0) return;

    // Close modal
    var modalEl = document.getElementById('revokeConfirmModal');
    var modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    var total = selectedHcIds.length;

    if (USE_MOCK_DATA) {
        // Mock mode: remove revoked items from data, then refresh
        var revokedIds = selectedHcIds.slice();
        console.log('[Revoke] Mock confirmRevoke — removing ids:', revokedIds);

        hcListData = hcListData.filter(function (item) {
            return revokedIds.indexOf(item.VerifyTranId) === -1;
        });
        revokedIds.forEach(function (id) {
            delete detailDataMap[id];
            delete mockDetailMap[id];
        });

=======
// ============ Revoke OTP Flow ============

// Step A → validate manager → go to Step B + auto send OTP
function confirmRevokeStepA() {
    var managerSelect = document.getElementById('selectManager');
    if (!managerSelect || !managerSelect.value) {
        BssModal.showInlineError('revokeManagerError');
        return;
    }
    BssModal.hideInlineError('revokeManagerError');

    var managerText = managerSelect.options[managerSelect.selectedIndex].text;
    revokeOtpData.managerId = managerSelect.value;
    revokeOtpData.managerName = managerText;

    // Populate Step B info
    document.getElementById('revokeOtpCount').textContent = selectedHcIds.length;
    document.getElementById('revokeOtpManager').textContent = managerText;

    // Reset OTP input state
    document.getElementById('revokeOtpInput').value = '';
    document.getElementById('revokeOtpInput').disabled = true;
    document.getElementById('revokeOtpSentMsg').style.display = 'none';
    document.getElementById('revokeOtpResendRow').style.display = 'none';
    BssModal.hideInlineError('revokeOtpError');

    // Switch to Step B and auto-send OTP
    BssModal.setStep('revokeConfirmModal', 'revokeStepB');
    sendRevokeOtp();
}

function sendRevokeOtp() {
    if (revokeOtpTimerInterval) { clearInterval(revokeOtpTimerInterval); revokeOtpTimerInterval = null; }
    BssModal.hideInlineError('revokeOtpError');

    otp.send({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        userReceiveId: parseInt(revokeOtpData.managerId),
        bssMailSystemTypeCode: 'REVOKE_AUTO_SELLING'
    }).done(function (data) {
        revokeOtpData.refCode = data.refCode;
        document.getElementById('revokeOtpInput').disabled = false;
        document.getElementById('revokeOtpInput').value = '';
        document.getElementById('revokeOtpInput').focus();
        document.getElementById('revokeOtpSentMsg').style.display = '';
        document.getElementById('revokeOtpResendRow').style.display = '';
        startRevokeOtpTimer();
    }).fail(function () {
        BssModal.chain('revokeConfirmModal', function () {
            showRevokeError('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
        });
    });
}

function startRevokeOtpTimer() {
    var btnResend = document.getElementById('btnRevokeResendOtp');
    var timerEl = document.getElementById('revokeOtpTimer');
    btnResend.disabled = true;
    var remaining = 5 * 60; // 5 minutes

    function updateTimer() {
        var min = Math.floor(remaining / 60);
        var sec = remaining % 60;
        timerEl.textContent = 'ส่งอีกครั้งได้ภายใน ' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + ' นาที';
        if (remaining <= 0) {
            clearInterval(revokeOtpTimerInterval);
            revokeOtpTimerInterval = null;
            btnResend.disabled = false;
            timerEl.textContent = '';
        }
        remaining--;
    }
    updateTimer();
    if (revokeOtpTimerInterval) clearInterval(revokeOtpTimerInterval);
    revokeOtpTimerInterval = setInterval(updateTimer, 1000);
}

// Verify OTP → call ExecuteRevoke API
function confirmRevokeOtp() {
    var otpVal = document.getElementById('revokeOtpInput').value.trim();
    var errEl = document.getElementById('revokeOtpError');
    if (!otpVal) {
        if (errEl) errEl.textContent = 'กรุณากรอก OTP ให้ถูกต้อง';
        BssModal.showInlineError('revokeOtpError');
        return;
    }
    if (!/^\d{6}$/.test(otpVal)) {
        if (errEl) errEl.textContent = 'OTP ไม่ถูกต้อง';
        BssModal.showInlineError('revokeOtpError');
        return;
    }
    BssModal.hideInlineError('revokeOtpError');

    otp.verify({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        bssMailSystemTypeCode: 'REVOKE_AUTO_SELLING',
        bssMailOtpCode: otpVal,
        bssMailRefCode: revokeOtpData.refCode
    }).done(function () {
        if (revokeOtpTimerInterval) { clearInterval(revokeOtpTimerInterval); revokeOtpTimerInterval = null; }
        executeRevokeAfterOtp();
    }).fail(function (err) {
        if (errEl) errEl.textContent = (err && err.message) || 'OTP ไม่ถูกต้อง';
        BssModal.showInlineError('revokeOtpError');
    });
}

async function executeRevokeAfterOtp() {
    var total = selectedHcIds.length;

    if (USE_MOCK_DATA) {
        var revokedIds = selectedHcIds.slice();
        hcListData = hcListData.filter(function (item) {
            return revokedIds.indexOf(item.ReconcileTranId) === -1;
        });
        revokedIds.forEach(function (id) {
            delete detailDataMap[id];
        });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        selectedHcIds = [];
        renderHcTable(hcListData);
        updateHcCount();
        populateFilterDropdowns();
        hideDetailSection();

<<<<<<< HEAD
        showSuccessModal('Revoke สำเร็จ ' + total + ' รายการ');
        return;
    }

    // API mode
    $.enablePageLoader();
    var hasError = false;

    try {
        var promises = selectedHcIds.map(function (id) {
            return revokeActionAsync(id).then(function (response) {
                if (!(response && response.is_success)) {
                    hasError = true;
                }
            }).catch(function () {
                hasError = true;
            });
        });
        await Promise.all(promises);
=======
        BssModal.chain('revokeConfirmModal', function () {
            showSuccessModal('Revoke สำเร็จ ' + total + ' รายการ');
        });
        return;
    }

    // API mode — batch execute
    $.enablePageLoader();
    try {
        var response = await executeRevokeAsync(selectedHcIds.slice());
        if (response && response.is_success && response.data && response.data.isSuccess) {
            BssModal.chain('revokeConfirmModal', function () {
                showSuccessModal('Revoke สำเร็จ ' + (response.data.affectedCount || total) + ' รายการ');
            });
        } else {
            var msg = (response && response.data && response.data.message) || 'Revoke ไม่สำเร็จ';
            BssModal.chain('revokeConfirmModal', function () {
                showRevokeError(msg);
            });
        }
    } catch (err) {
        console.error('[Revoke] executeRevoke error:', err);
        BssModal.chain('revokeConfirmModal', function () {
            showRevokeError('เกิดข้อผิดพลาดในการ Revoke');
        });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    } finally {
        $.disablePageLoader();
    }

<<<<<<< HEAD
    if (hasError) {
        showRevokeError('Revoke บางรายการไม่สำเร็จ');
    } else {
        showSuccessModal('Revoke สำเร็จ ' + total + ' รายการ');
    }

=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    refreshData();
}

// ============ Sort ============
function sortHcTable(column) {
    if (hcSortState.column === column) {
        hcSortState.direction = hcSortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        hcSortState.column = column;
        hcSortState.direction = 'asc';
    }

    var filtered = getFilteredData();
    var sorted = filtered.slice().sort(function (a, b) {
        var valA = a[column] || '';
        var valB = b[column] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return hcSortState.direction === 'asc' ? -1 : 1;
        if (valA > valB) return hcSortState.direction === 'asc' ? 1 : -1;
        return 0;
    });

    renderHcTable(sorted);
    updateSortIcons('hcTable', column, hcSortState.direction);
}

function sortDetailTable(column) {
    if (detailSortState.column === column) {
        detailSortState.direction = detailSortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        detailSortState.column = column;
        detailSortState.direction = 'asc';
    }

<<<<<<< HEAD
    // Re-aggregate and sort
    var allDenoms = [];
    selectedHcIds.forEach(function (id) {
        (detailDataMap[id] || []).forEach(function (d) { allDenoms.push(d); });
    });
=======
    // Get denominations for the active detail row
    var allDenoms = [];
    if (activeDetailId) {
        (detailDataMap[activeDetailId] || []).forEach(function (d) { allDenoms.push(d); });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    allDenoms.sort(function (a, b) {
        var valA = a[column] || '';
        var valB = b[column] || '';
        if (typeof valA === 'number' && typeof valB === 'number') {
            return detailSortState.direction === 'asc' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return detailSortState.direction === 'asc' ? -1 : 1;
        if (valA > valB) return detailSortState.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Render sorted detail
    var tbody = document.getElementById('detailTableBody');
    if (!tbody) return;
    var totalQty = 0;
    tbody.innerHTML = allDenoms.map(function (d) {
        var qty = d.qty || d.Qty || 0;
<<<<<<< HEAD
        var denomPrice = d.denominationPrice || d.DenominationPrice || '-';
        totalQty += qty;
        return '<tr>' +
            '<td><span class="qty-badge qty-' + denomPrice + '">' + numberWithCommas(denomPrice) + '</span></td>' +
            '<td>' + (d.bnType || d.BnType || '-') + '</td>' +
            '<td>' + (d.denomSeries || d.DenomSeries || '-') + '</td>' +
            '<td class="col-qty">' + numberWithCommas(qty) + '</td>' +
            '<td></td>' +
=======
        var denomPrice = d.denoPrice || d.DenoPrice || '-';
        totalQty += qty;
        return '<tr>' +
            '<td><span class="qty-badge qty-' + denomPrice + '">' + denomPrice + '</span></td>' +
            '<td>' + (d.bnType || d.BnType || '-') + '</td>' +
            '<td>' + (d.denomSeries || d.DenomSeries || '-') + '</td>' +
            '<td class="col-qty">' + numberWithCommas(qty) + '</td>' +
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            '</tr>';
    }).join('');
    updateDetailCount(totalQty);
    updateSortIcons('detailTable', column, detailSortState.direction);
}

function updateSortIcons(tableId, activeColumn, direction) {
    var table = document.getElementById(tableId);
    if (!table) return;
    // Reset all icons to default expand
    table.querySelectorAll('.th-sort .sort-icon').forEach(function (icon) {
        icon.className = 'bi bi-chevron-expand sort-icon';
    });
    // Set active icon
    var activeTh = table.querySelector('.th-sort[data-sort="' + activeColumn + '"]');
    if (activeTh) {
        var icon = activeTh.querySelector('.sort-icon');
        if (icon) {
            icon.className = direction === 'asc'
                ? 'bi bi-chevron-up sort-icon'
                : 'bi bi-chevron-down sort-icon';
        }
    }
}

// ============ Filter ============
function toggleFilter() {
    var section = document.getElementById('filterSection');
    if (!section) return;
    section.style.display = section.style.display === 'none' ? 'flex' : 'none';
}

function populateFilterDropdowns() {
    var banks = [], zones = [], cashpoints = [], cashCenters = [], denoms = [];
    hcListData.forEach(function (item) {
        if (item.Bank && banks.indexOf(item.Bank) === -1) banks.push(item.Bank);
        if (item.Zone && zones.indexOf(item.Zone) === -1) zones.push(item.Zone);
        if (item.Cashpoint && cashpoints.indexOf(item.Cashpoint) === -1) cashpoints.push(item.Cashpoint);
        if (item.CashCenter && cashCenters.indexOf(item.CashCenter) === -1) cashCenters.push(item.CashCenter);
    });
    // Denominations from detail data (mock or real)
    var denomSource = USE_MOCK_DATA ? mockDetailMap : detailDataMap;
    Object.keys(denomSource).forEach(function (key) {
        (denomSource[key] || []).forEach(function (d) {
            var p = d.denominationPrice || d.DenominationPrice;
            if (p && denoms.indexOf(p) === -1) denoms.push(p);
        });
    });
    denoms.sort(function (a, b) { return b - a; });

    fillSelect('filterBank', banks);
    fillSelect('filterZone', zones);
    fillSelect('filterCashpoint', cashpoints);
    fillSelect('filterCashCenter', cashCenters);
    fillSelect('filterDenomination', denoms);
}

function fillSelect(id, items) {
    var sel = document.getElementById(id);
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = '<option value="">Please select</option>';
    items.forEach(function (val) {
        sel.innerHTML += '<option value="' + val + '">' + val + '</option>';
    });
    sel.value = current;
}

function getFilteredData() {
    var bank = document.getElementById('filterBank')?.value || '';
    var zone = document.getElementById('filterZone')?.value || '';
    var cashpoint = document.getElementById('filterCashpoint')?.value || '';
    var cashCenter = document.getElementById('filterCashCenter')?.value || '';
    var denom = document.getElementById('filterDenomination')?.value || '';

    if (!bank && !zone && !cashpoint && !cashCenter && !denom) return hcListData;

    return hcListData.filter(function (item) {
        if (bank && item.Bank !== bank) return false;
        if (zone && item.Zone !== zone) return false;
        if (cashpoint && item.Cashpoint !== cashpoint) return false;
        if (cashCenter && item.CashCenter !== cashCenter) return false;
<<<<<<< HEAD
        if (denom) {
            var details = detailDataMap[item.VerifyTranId] || mockDetailMap[item.VerifyTranId] || [];
            var hasDenom = details.some(function (d) {
                return String(d.denominationPrice || d.DenominationPrice) === String(denom);
            });
            if (!hasDenom) return false;
        }
=======
        if (denom && String(item.DenominationPrice) !== String(denom)) return false;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        return true;
    });
}

function getFilterParams() {
    return {
        bank: document.getElementById('filterBank')?.value || '',
        zone: document.getElementById('filterZone')?.value || '',
        cashpoint: document.getElementById('filterCashpoint')?.value || '',
        cashCenter: document.getElementById('filterCashCenter')?.value || '',
        denomination: document.getElementById('filterDenomination')?.value || ''
    };
}

function applyFilters() {
<<<<<<< HEAD
    if (USE_MOCK_DATA) {
        // Mock mode: client-side filter
        var filtered = getFilteredData();

        selectedHcIds = selectedHcIds.filter(function (id) {
            return filtered.some(function (item) { return item.VerifyTranId === id; });
        });

        renderHcTable(filtered);
        document.getElementById('hcTotalCount').textContent = numberWithCommas(filtered.length);

        if (selectedHcIds.length > 0) {
            loadDetailForSelected();
        } else {
            hideDetailSection();
        }
    } else {
        // API mode: reload from backend with filter params
        $.enablePageLoader();
        loadAllData(getFilterParams()).finally(function () {
            $.disablePageLoader();
        });
    }
=======
    var filtered = getFilteredData();

    selectedHcIds = selectedHcIds.filter(function (id) {
        return filtered.some(function (item) { return item.ReconcileTranId === id; });
    });

    renderHcTable(filtered);
    document.getElementById('hcTotalCount').textContent = numberWithCommas(filtered.length);

    // Reset detail view on filter
    activeDetailId = null;
    hideDetailSection();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function initFilterListeners() {
    ['filterBank', 'filterZone', 'filterCashpoint', 'filterCashCenter', 'filterDenomination'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });
}

// ============ Refresh ============
function refreshData() {
    selectedHcIds = [];
    detailDataMap = {};
    hideDetailSection();

    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }
    initPage();
}

// ============ Modals ============
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message || 'ดำเนินการสำเร็จ';
    var modal = new bootstrap.Modal(document.getElementById('revokeSuccessModal'));
    modal.show();
}

function showRevokeError(message) {
    document.getElementById('revokeErrorMessage').textContent = message || 'เกิดข้อผิดพลาด';
    var modal = new bootstrap.Modal(document.getElementById('revokeErrorModal'));
    modal.show();
}

function closeSuccessModal() {
    var el = document.getElementById('revokeSuccessModal');
    if (el) {
        var inst = bootstrap.Modal.getInstance(el);
        if (inst) inst.hide();
    }
}

// ============ Utilities ============
function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear() + 543;
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    return day + '/' + month + '/' + year + ' ' + hh + ':' + mm;
}

function numberWithCommas(x) {
    if (x == null) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
