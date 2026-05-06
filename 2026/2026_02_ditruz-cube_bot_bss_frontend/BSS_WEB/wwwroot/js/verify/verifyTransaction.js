/* ============================================
   Auto Selling — Verify Transaction JS
   Rewritten: div-based → <table>-based with sort, filter, checkbox
   Uses shared modules: BssDateTime, BssFormat, BssSort, BssModal, BssDom
   Figma: Node 2:20263 (Default), Node 2:18859 (Detail + Adjustment)
   ============================================ */

// ============ State ============
var table1Data = [];   // มัดครบจำนวน ครบมูลค่า (left top)
var table2Data = [];   // มัดรวมครบจำนวน ครบมูลค่า (left bottom)
var tableAData = [];   // มัดขาด-เกิน (right top)
var tableBData = [];   // มัดรวมขาด-เกิน (right middle)
<<<<<<< HEAD
var tableCData = [];   // มัดเกินโดยขอจากเครื่องจักร (right bottom)
var detailData = [];   // Detail panel rows
var selectedLeftRow = null;
var selectedRightRow = null;
=======
var tableCData = [];   // มัดเกินโดยยอดจากเครื่องจักร (right bottom)
var detailData = [];   // Detail panel rows
var detailParentDenom = null; // Parent item DenominationPrice for detail panel
var detailParentQty = null;   // Parent item Qty (reconcile_qty) for detail panel
var selectedLeftRow = null;
var selectedRightRow = null;
var activeTableKey = null;  // track ว่า click row อยู่ตารางไหน
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

// Checkbox selection
var selected1Ids = [];
var selected2Ids = [];
var selectedAIds = [];
var selectedBIds = [];
var selectedCIds = [];

// Sort states
var sortStates = {
    table1: BssSort.createState(),
    table2: BssSort.createState(),
    tableA: BssSort.createState(),
    tableB: BssSort.createState(),
    tableC: BssSort.createState(),
    detail: BssSort.createState(),
<<<<<<< HEAD
    shiftConfirm: BssSort.createState()
=======
    shiftConfirm: BssSort.createState(),
    offset: BssSort.createState()
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
};

// Edit/Delete flow data
var editFlowData = {};
// deleteFlowData removed — replaced by cancelSendData in Cancel Send flow

<<<<<<< HEAD
var USE_MOCK_DATA = true;

var currentUserId = document.getElementById('currentUserId')?.value || 0;
=======
var USE_MOCK_DATA = false;

// ============ Cached Dropdown Data ============
var cachedDenomOptions = [];   // [{value, label}] from MasterDenomination
var cachedSeriesOptions = [];  // [{value, label}] from MasterSeriesDenom
var cachedSupervisorOptions = []; // [{id, name}] from MasterUserSuperVisor
var cachedShiftOptions = [];   // [{value, label}] from MasterShift

async function loadDropdownData() {
    try {
        await Promise.all([
            loadDenominationDropdown(),
            loadSeriesDenomDropdown(),
            loadSupervisorDropdown(),
            loadShiftDropdown()
        ]);
    } catch (err) {
        console.error('loadDropdownData error:', err);
    }
}

function loadDenominationDropdown() {
    return loadMasterDropdown({
        request: { tableName: 'MasterDenomination' },
        cacheKey: 'MasterDenomination',
        onLoaded: function (items) {
            cachedDenomOptions = items.map(function (x) {
                return { value: String(x.id), label: x.name };
            });
        }
    });
}

function loadSeriesDenomDropdown() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'MasterSeriesDenom/GetAll',
            type: 'GET',
            enableLoader: false,
            onSuccess: function (res) {
                if (res && res.is_success && res.data) {
                    cachedSeriesOptions = (res.data || [])
                        .filter(function (x) { return x.isActive !== false; })
                        .map(function (x) {
                            return {
                                value: String(x.seriesDenomId ?? x.id ?? ''),
                                label: x.seriesCode ?? x.name ?? ''
                            };
                        });
                }
                resolve(cachedSeriesOptions);
            },
            onError: function () {
                console.error('loadSeriesDenomDropdown failed');
                resolve([]);
            }
        });
    });
}

function loadSupervisorDropdown() {
    return loadMasterDropdown({
        request: { tableName: 'MasterUserSuperVisor' },
        cacheKey: 'MasterUserSuperVisor',
        onLoaded: function (items) {
            cachedSupervisorOptions = items;
            populateSupervisorSelects();
        }
    });
}

function populateSupervisorSelects() {
    var selectIds = ['cancelManagerSelect', 'shiftVerifierSelect', 'offsetManagerSelect'];
    selectIds.forEach(function (selId) {
        var el = document.getElementById(selId);
        if (!el) return;
        // Keep first placeholder option, remove the rest
        var placeholder = el.options[0];
        el.innerHTML = '';
        if (placeholder) el.appendChild(placeholder);
        cachedSupervisorOptions.forEach(function (item) {
            var opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.name;
            el.appendChild(opt);
        });
    });
}

function loadShiftDropdown() {
    return loadMasterDropdown({
        request: { tableName: 'MasterShift' },
        cacheKey: 'MasterShift',
        onLoaded: function (items) {
            cachedShiftOptions = (items || []).map(function (x) {
                return {
                    value: String(x.id ?? ''),
                    label: x.name ?? ''
                };
            });
            populateShiftSelect();
        }
    });
}

function populateShiftSelect() {
    var el = document.getElementById('shiftTimeSelect');
    if (!el) return;
    var placeholder = el.options[0];
    el.innerHTML = '';
    if (placeholder) el.appendChild(placeholder);
    cachedShiftOptions.forEach(function (item) {
        var opt = document.createElement('option');
        opt.value = item.value;
        opt.textContent = item.label;
        el.appendChild(opt);
    });
}

var currentUserId = document.getElementById('currentUserId')?.value || 0;
var currentDepartmentId = document.getElementById('currentDepartmentId')?.value || 0;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
var currentUserFullName = document.getElementById('currentUserFullName')?.value || '';
var cssVariantClass = document.getElementById('cssVariantClass')?.value || '';

// ============ Variant Config ============
function getVerifyVariantConfig(variant) {
    var usesZoneCashpoint = (variant === 'verify-unsort-cc' || variant === 'verify-ca-member');

    var leftColumns = [
        { key: 'checkbox', label: '', sortable: false, className: 'col-chk' },
        { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
        { key: 'DenominationPrice', label: 'ชนิดราคา', sortable: true, format: 'badge' },
        { key: 'CountingDate', label: 'วันเวลานับคัด', sortable: true, format: 'datetime' },
        { key: 'Qty', label: 'จำนวนฉบับ', sortable: true, format: 'number', className: 'text-right' },
        { key: 'TotalValue', label: 'มูลค่า', sortable: true, format: 'number', className: 'text-right' },
        { key: 'Status', label: 'สถานะ', sortable: true, format: 'status', className: 'text-center' },
        { key: 'action', label: 'Action', sortable: false, className: 'text-center table-action-cell' }
    ];

    var rightColumns = [
        { key: 'checkbox', label: '', sortable: false, className: 'col-chk' },
        { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
        { key: 'DenominationPrice', label: 'ชนิดราคา', sortable: true, format: 'badge' },
        { key: 'CountingDate', label: 'วันเวลานับคัด', sortable: true, format: 'datetime' },
        { key: 'Qty', label: 'จำนวนฉบับ', sortable: true, format: 'number', className: 'text-right' },
        { key: 'TotalValue', label: 'มูลค่า', sortable: true, format: 'number', className: 'text-right' },
        { key: 'Status', label: 'สถานะ', sortable: true, format: 'status', className: 'text-center' },
        { key: 'action', label: 'Action', sortable: false, className: 'text-center table-action-cell' }
    ];

    var rightNoActionColumns = [
        { key: 'checkbox', label: '', sortable: false, className: 'col-chk' },
        { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
        { key: 'DenominationPrice', label: 'ชนิดราคา', sortable: true, format: 'badge' },
        { key: 'CountingDate', label: 'วันเวลานับคัด', sortable: true, format: 'datetime' },
        { key: 'Qty', label: 'จำนวนฉบับ', sortable: true, format: 'number', className: 'text-right' },
        { key: 'TotalValue', label: 'มูลค่า', sortable: true, format: 'number', className: 'text-right' },
        { key: 'Status', label: 'สถานะ', sortable: true, format: 'status', className: 'text-center' },
        { key: 'action', label: 'Action', sortable: false, className: 'text-center table-action-cell' }
    ];

    return {
        leftColumns: leftColumns,
        rightColumns: rightColumns,
        rightNoActionColumns: rightNoActionColumns
    };
}

var VARIANT = getVerifyVariantConfig(cssVariantClass);

// ============ Init ============
var mockSmall = false;

document.addEventListener("DOMContentLoaded", function () {
    BssDateTime.startClock('infoDate', 1000);
    initVariantUI();
    initFilterListeners();
    setupRadioButtons();
<<<<<<< HEAD
=======
    updateHeaderActionButtons();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    initPage();

    // Debug: กด 'm' สลับ data เยอะ/น้อย
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'm' && USE_MOCK_DATA) {
            mockSmall = !mockSmall;
            selected1Ids = []; selected2Ids = []; selectedAIds = []; selectedBIds = []; selectedCIds = [];
            selectedLeftRow = null; selectedRightRow = null;
            detailData = [];
            var detailPanel = document.getElementById('detailPanel');
            if (detailPanel) detailPanel.style.display = 'none';
            var adjPanel = document.getElementById('adjustmentPanel');
            if (adjPanel) adjPanel.style.display = 'none';
            loadMockData(mockSmall);
            console.log('[Debug] Toggle mock data:', mockSmall ? 'น้อย' : 'มาก');
        }
    });
});

function initVariantUI() {
    buildTableThead('table1Head', VARIANT.leftColumns, 'table1');
    buildTableThead('table2Head', VARIANT.leftColumns, 'table2');
    buildTableThead('tableAHead', VARIANT.rightColumns, 'tableA');
    buildTableThead('tableBHead', VARIANT.rightNoActionColumns, 'tableB');
    buildTableThead('tableCHead', VARIANT.rightNoActionColumns, 'tableC');
}

async function initPage() {
    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }
    $.enablePageLoader();
    try {
<<<<<<< HEAD
        await loadAllData();
=======
        await Promise.all([loadAllData(), loadDropdownData()]);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    } finally {
        $.disablePageLoader();
    }
}

// ============ Build Table Headers (dynamic from column config) ============
function buildTableThead(headId, columns, tableKey) {
    var thead = document.getElementById(headId);
    if (!thead) return;

    thead.innerHTML = columns.map(function (col) {
        if (col.key === 'checkbox') {
            var checkId = 'checkAll_' + tableKey;
            return '<th class="col-chk" onclick="event.stopPropagation()"><input type="checkbox" id="' + checkId + '" onchange="checkAllHandler(\'' + tableKey + '\', this.checked)" /></th>';
        }
        if (col.key === 'action') {
            return '<th class="' + (col.className || '') + '">' + col.label + '</th>';
        }
        if (col.sortable) {
            return '<th class="th-sort ' + (col.className || '') + '" data-sort="' + col.key + '" onclick="sortTable(\'' + tableKey + '\', \'' + col.key + '\')">' +
                col.label + ' <i class="bi bi-chevron-expand sort-icon"></i></th>';
        }
        return '<th class="' + (col.className || '') + '">' + col.label + '</th>';
    }).join('');
}

// ============ Render Table Body (dynamic from column config) ============
function renderTableBody(bodyId, data, columns, options) {
    var tbody = document.getElementById(bodyId);
    if (!tbody) return;

    var colCount = columns.length;

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + colCount + '" class="text-center text-muted">ไม่มีข้อมูล</td></tr>';
        return;
    }

    var tableKey = options.tableKey || '';
    var selectedIds = options.selectedIds || [];

    tbody.innerHTML = data.map(function (item) {
        var isChecked = selectedIds.indexOf(item.Id) !== -1;
        var isActiveRow = (selectedRightRow && selectedRightRow.Id === item.Id)
            || (selectedLeftRow && selectedLeftRow.Id === item.Id);
<<<<<<< HEAD
        var rowClass = (isChecked || isActiveRow) ? 'selected' : '';
=======
        var rowClass = isActiveRow ? 'selected' : '';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

        var cells = columns.map(function (col) {
            if (col.key === 'checkbox') {
                return '<td class="col-chk" onclick="event.stopPropagation()"><input type="checkbox" ' + (isChecked ? 'checked' : '') +
                    ' onchange="onCheckboxChange(\'' + tableKey + '\', ' + item.Id + ', this.checked)" /></td>';
            }
            if (col.key === 'action') {
<<<<<<< HEAD
=======
                // ซ่อน action ถ้า status เป็น Edited หรือ Adjust Offset
                if (item.IsEdited || item.Status === 'Adjust Offset') {
                    return '<td class="' + (col.className || '') + '"></td>';
                }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                var editIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip_edit' + item.Id + ')"><path d="M2.3237 9.96774C2.37829 9.98819 2.43775 9.99996 2.49949 9.99996H2.99949V10.5C2.99969 10.7759 3.22347 11 3.49949 11H3.99949V11.5C3.99969 11.7759 4.22347 12 4.49949 12H4.99949V12.5C4.99969 12.7759 5.22347 13 5.49949 13H5.99949V13.5C5.99953 13.5615 6.01038 13.6204 6.03074 13.6748L5.853 13.8535C5.80515 13.9013 5.74784 13.9387 5.68503 13.9638L0.685032 15.9638C0.499458 16.0381 0.287401 15.9947 0.145969 15.8535C0.00453812 15.712 -0.0396421 15.4991 0.0346413 15.3134L2.03464 10.3134C2.05978 10.2507 2.09819 10.1942 2.14597 10.1464L2.3237 9.96774ZM13.4995 6.20699L6.99949 12.707V12.5C6.99949 12.2239 6.77551 12.0001 6.49949 12H5.99949V11.5C5.99949 11.2239 5.77551 11.0001 5.49949 11H4.99949V10.5C4.99949 10.2239 4.77551 10.0001 4.49949 9.99996H3.99949V9.49996C3.99949 9.22391 3.77551 9.0001 3.49949 8.99996H3.29245L9.79245 2.49996L13.4995 6.20699ZM12.146 0.146447C12.3412 -0.0488155 12.6577 -0.0488155 12.853 0.146447L15.853 3.14645C16.048 3.34173 16.0482 3.65832 15.853 3.85348L14.2065 5.49996L10.4995 1.79293L12.146 0.146447Z" fill="black"/></g><defs><clipPath id="clip_edit' + item.Id + '"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>';
                var deleteIcon = '<svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip_del' + item.Id + ')"><path d="M11.1061 0C11.2386 0 11.3658 0.052802 11.4596 0.146484L15.8531 4.54004C15.9469 4.63381 15.9996 4.76096 15.9996 4.89355V11.1064C15.9996 11.239 15.9469 11.3662 15.8531 11.46L11.4596 15.8535C11.3658 15.9472 11.2386 16 11.1061 16H4.89319C4.76059 16 4.63344 15.9473 4.53967 15.8535L0.146118 11.46C0.0524357 11.3662 -0.000366211 11.239 -0.000366211 11.1064V4.89355C-0.000366211 4.76101 0.0524359 4.63379 0.146118 4.54004L4.53967 0.146484C4.63344 0.0527281 4.76059 0 4.89319 0H11.1061ZM11.3531 4.64648C11.1579 4.45128 10.8414 4.45124 10.6461 4.64648L7.99963 7.29297L5.35315 4.64648C5.15788 4.45128 4.84136 4.45124 4.64612 4.64648C4.45093 4.84173 4.45093 5.15827 4.64612 5.35352L7.2926 8L4.64612 10.6465C4.45093 10.8417 4.45093 11.1583 4.64612 11.3535C4.84136 11.5488 5.15788 11.5487 5.35315 11.3535L7.99963 8.70703L10.6461 11.3535C10.8414 11.5488 11.1579 11.5487 11.3531 11.3535C11.5484 11.1583 11.5484 10.8417 11.3531 10.6465L8.70667 8L11.3531 5.35352C11.5484 5.15825 11.5484 4.84175 11.3531 4.64648Z" fill="black"/></g><defs><clipPath id="clip_del' + item.Id + '"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>';
                return '<td class="' + (col.className || '') + '">' +
                    '<div class="table-action-buttons">' +
                    '<button class="table-action-btn" onclick="event.stopPropagation(); openEditModal(' + item.Id + ')" title="แก้ไข">' + editIcon + '</button>' +
                    '<button class="table-action-btn" onclick="event.stopPropagation(); openCancelSendModal(' + item.Id + ')" title="Cancel Send">' + deleteIcon + '</button>' +
                    '</div></td>';
            }
            var val = item[col.key];
            var tdClass = col.className || '';
            if (col.format === 'datetime') {
                return '<td class="' + tdClass + '">' + BssDateTime.format(val) + '</td>';
            }
            if (col.format === 'number') {
                return '<td class="' + tdClass + '">' + BssFormat.numberWithCommas(val) + '</td>';
            }
            if (col.format === 'badge') {
                return '<td class="' + tdClass + '">' + BssFormat.denomBadgeHtml(val) + '</td>';
            }
            if (col.format === 'status') {
<<<<<<< HEAD
                var badge = item.IsEdited
                    ? '<span class="badge-edited">Edited</span>'
                    : '<span class="badge-status badge-status--auto-selling">' + (val || 'Auto Selling') + '</span>';
=======
                var badge;
                if (item.IsEdited) {
                    badge = '<span class="badge-edited">Edited</span>';
                } else if (val === 'Adjust Offset') {
                    badge = '<span class="badge-status badge-status--adjust-offset">' + val + '</span>';
                } else {
                    badge = '<span class="badge-status badge-status--auto-selling">' + (val || 'Auto Selling') + '</span>';
                }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return '<td class="' + tdClass + '">' + badge + '</td>';
            }
            return '<td class="' + tdClass + '">' + (val != null ? val : '-') + '</td>';
        }).join('');

        var clickAttr = '';
        if (options.onRowClick) {
<<<<<<< HEAD
            clickAttr = ' onclick="' + options.onRowClick + '(' + item.Id + ')" style="cursor:pointer"';
=======
            clickAttr = ' onclick="' + options.onRowClick + '(' + item.Id + ', \'' + tableKey + '\')" style="cursor:pointer"';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        }

        return '<tr class="' + rowClass + '" data-id="' + item.Id + '"' + clickAttr + '>' + cells + '</tr>';
    }).join('');
}

// ============ Mock Data ============
function getMockTable1Data(small) {
    var denoms = [20, 50, 100, 500, 1000];
    var banks = ['BBL', 'KBANK', 'SCB', 'KTB', 'TMB', 'GSB', 'BAY', 'CIMBT', 'TISCO', 'KKP', 'LHBANK', 'TTB', 'ICBC', 'UOB', 'CITI'];
    var zones = ['กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'ภาคตะวันตก', 'ภาคอีสาน', 'กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ'];
    var cashpoints = ['สีลม', 'ลาดพร้าว', 'สาทร', 'เชียงใหม่', 'นนทบุรี', 'หาดใหญ่', 'พัทยา', 'ขอนแก่น', 'ราชบุรี', 'อุดรธานี', 'ภูเก็ต', 'ระยอง', 'บางรัก', 'ปทุมธานี', 'เชียงราย'];
    var count = small ? 5 : 15;
    var rows = [];
    for (var i = 1; i <= count; i++) {
        var denom = denoms[i % denoms.length];
        var qty = 900 + i * 20;
        rows.push({
            Id: i,
            HeaderCardCode: '005494' + String(1520 + i).padStart(4, '0'),
            Bank: banks[(i - 1) % banks.length],
            Zone: zones[(i - 1) % zones.length],
            Cashpoint: cashpoints[(i - 1) % cashpoints.length],
            DenominationPrice: denom,
            CountingDate: '2025-07-21T14:' + String(i * 3 % 60).padStart(2, '0') + ':00',
            Qty: qty,
            TotalValue: qty * denom,
            Status: 'Auto Selling',
            IsEdited: i === 3 || i === 7
        });
    }
    return rows;
}

function getMockTable2Data(small) {
    var denoms = [100, 500, 1000, 50, 20];
    var banks = ['BBL', 'KBANK', 'SCB', 'KTB', 'TMB', 'GSB', 'BAY', 'CIMBT', 'TISCO', 'KKP', 'TTB', 'UOB'];
    var zones = ['กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'ภาคอีสาน', 'กรุงเทพฯ', 'ภาคตะวันตก', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก'];
    var cashpoints = ['สีลม', 'นนทบุรี', 'สาทร', 'เชียงใหม่', 'ลาดพร้าว', 'ขอนแก่น', 'บางรัก', 'ราชบุรี', 'ปทุมธานี', 'อุดรธานี', 'หาดใหญ่', 'ระยอง'];
    var count = small ? 4 : 12;
    var rows = [];
    for (var i = 1; i <= count; i++) {
        var denom = denoms[i % denoms.length];
        var qty = 1990 + i * 3;
        rows.push({
            Id: 10 + i,
            HeaderCardCode: '005494' + String(1537 + i).padStart(4, '0'),
            Bank: banks[(i - 1) % banks.length],
            Zone: zones[(i - 1) % zones.length],
            Cashpoint: cashpoints[(i - 1) % cashpoints.length],
            DenominationPrice: denom,
            CountingDate: '2025-07-21T14:' + String(10 + i * 3 % 60).padStart(2, '0') + ':00',
            Qty: qty,
            TotalValue: qty * denom,
            Status: 'Auto Selling',
            IsEdited: i === 2 || i === 8
        });
    }
    return rows;
}

function getMockTableAData(small) {
    var denoms = [100, 500, 1000, 50, 20];
    var banks = ['SCB', 'BBL', 'KBANK', 'KTB', 'TMB', 'GSB', 'BAY', 'CIMBT', 'TISCO', 'KKP'];
    var zones = ['กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'ภาคอีสาน', 'กรุงเทพฯ', 'ภาคตะวันตก', 'ภาคกลาง', 'ภาคเหนือ'];
    var cashpoints = ['สาทร', 'สีลม', 'เชียงใหม่', 'หาดใหญ่', 'พัทยา', 'ขอนแก่น', 'บางรัก', 'ราชบุรี', 'ปทุมธานี', 'อุดรธานี'];
    var count = small ? 3 : 10;
    var rows = [];
    for (var i = 1; i <= count; i++) {
        var denom = denoms[i % denoms.length];
        var qty = 995 + i;
        rows.push({
            Id: 20 + i,
            HeaderCardCode: '005494' + String(1525 + i).padStart(4, '0'),
            Bank: banks[(i - 1) % banks.length],
            Zone: zones[(i - 1) % zones.length],
            Cashpoint: cashpoints[(i - 1) % cashpoints.length],
            DenominationPrice: denom,
            CountingDate: '2025-07-21T14:' + String(i * 7 % 60).padStart(2, '0') + ':00',
            Qty: qty,
            TotalValue: qty * denom,
            Status: 'Auto Selling',
            IsEdited: i === 1 || i === 5 || i === 9
        });
    }
    return rows;
}

function getMockTableBData(small) {
    var denoms = [1000, 500, 100, 50, 20, 1000, 500, 100];
    var banks = ['KTB', 'BBL', 'SCB', 'KBANK', 'TMB', 'GSB', 'BAY', 'CIMBT'];
    var zones = ['ภาคกลาง', 'กรุงเทพฯ', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'ภาคอีสาน', 'กรุงเทพฯ', 'ภาคตะวันตก'];
    var cashpoints = ['นนทบุรี', 'สีลม', 'เชียงใหม่', 'หาดใหญ่', 'พัทยา', 'ขอนแก่น', 'บางรัก', 'ราชบุรี'];
    var count = small ? 2 : 8;
    var rows = [];
    for (var i = 1; i <= count; i++) {
        var denom = denoms[(i - 1) % denoms.length];
        var qty = 1996 + i;
        rows.push({
            Id: 30 + i,
            HeaderCardCode: '005494' + String(1540 + i).padStart(4, '0'),
            Bank: banks[(i - 1) % banks.length],
            Zone: zones[(i - 1) % zones.length],
            Cashpoint: cashpoints[(i - 1) % cashpoints.length],
            DenominationPrice: denom,
            CountingDate: '2025-07-21T15:' + String(i * 7 % 60).padStart(2, '0') + ':00',
            Qty: qty,
            TotalValue: qty * denom,
            Status: 'Auto Selling',
            IsEdited: i === 4
        });
    }
    return rows;
}

function getMockTableCData(small) {
    var denoms = [1000, 500, 100, 1000, 500, 100];
    var banks = ['SCB', 'TMB', 'BBL', 'KBANK', 'KTB', 'GSB'];
    var zones = ['กรุงเทพฯ', 'ภาคกลาง', 'ภาคเหนือ', 'ภาคใต้', 'ภาคตะวันออก', 'ภาคอีสาน'];
    var cashpoints = ['สาทร', 'นนทบุรี', 'เชียงใหม่', 'หาดใหญ่', 'พัทยา', 'ขอนแก่น'];
    var count = small ? 2 : 6;
    var rows = [];
    for (var i = 1; i <= count; i++) {
        var denom = denoms[(i - 1) % denoms.length];
        var qty = 1000 + i;
        rows.push({
            Id: 40 + i,
            HeaderCardCode: '005494' + String(1550 + i).padStart(4, '0'),
            Bank: banks[(i - 1) % banks.length],
            Zone: zones[(i - 1) % zones.length],
            Cashpoint: cashpoints[(i - 1) % cashpoints.length],
            DenominationPrice: denom,
            CountingDate: '2025-07-21T15:' + String(20 + i * 5 % 60).padStart(2, '0') + ':00',
            Qty: qty,
            TotalValue: qty * denom,
            Status: 'Auto Selling',
            ExcessQty: i === 2 || i === 5 ? 2 : 0
        });
    }
    return rows;
}

function getMockDetailData(item) {
    var hc = item.HeaderCardCode || '-';
    var denom = item.DenominationPrice || 1000;
    var bank = item.Bank || 'BBL';
    var cp = item.Cashpoint || 'สีลม';
    return [
        { HeaderCardCode: hc, Bank: bank, Cashpoint: cp, DenominationPrice: denom, Type: 'ทำลาย', TypeNum: 17, Qty: 990, TotalValue: 990 * denom },
        { HeaderCardCode: hc, Bank: bank, Cashpoint: cp, DenominationPrice: denom, Type: 'ดี', TypeNum: 17, Qty: 4, TotalValue: 4 * denom },
        { HeaderCardCode: hc, Bank: bank, Cashpoint: cp, DenominationPrice: denom, Type: 'Reject', TypeNum: 17, Qty: 3, TotalValue: 3 * denom }
    ];
}

function loadMockData(small) {
    table1Data = getMockTable1Data(small);
    table2Data = getMockTable2Data(small);
    tableAData = getMockTableAData(small);
    tableBData = getMockTableBData(small);
    tableCData = getMockTableCData(small);

    renderAllTables();
    populateFilterDropdowns();
}

// ============ Render All Tables ============
function renderAllTables() {
<<<<<<< HEAD
    renderTableBody('table1Body', getFilteredData(table1Data), VARIANT.leftColumns, { tableKey: 'table1', selectedIds: selected1Ids });
    renderTableBody('table2Body', getFilteredData(table2Data), VARIANT.leftColumns, { tableKey: 'table2', selectedIds: selected2Ids });
    renderTableBody('tableABody', getFilteredData(tableAData), VARIANT.rightColumns, { tableKey: 'tableA', selectedIds: selectedAIds });
    renderTableBody('tableBBody', getFilteredData(tableBData), VARIANT.rightNoActionColumns, { tableKey: 'tableB', selectedIds: selectedBIds });
    renderTableBody('tableCBody', getFilteredData(tableCData), VARIANT.rightNoActionColumns, { tableKey: 'tableC', selectedIds: selectedCIds });
=======
    renderTableBody('table1Body', getFilteredData(table1Data), VARIANT.leftColumns, { tableKey: 'table1', selectedIds: selected1Ids, onRowClick: 'onLeftRowClick' });
    renderTableBody('table2Body', getFilteredData(table2Data), VARIANT.leftColumns, { tableKey: 'table2', selectedIds: selected2Ids, onRowClick: 'onLeftRowClick' });
    renderTableBody('tableABody', getFilteredData(tableAData), VARIANT.rightColumns, { tableKey: 'tableA', selectedIds: selectedAIds, onRowClick: 'onRightRowClick' });
    renderTableBody('tableBBody', getFilteredData(tableBData), VARIANT.rightNoActionColumns, { tableKey: 'tableB', selectedIds: selectedBIds, onRowClick: 'onRightRowClick' });
    renderTableBody('tableCBody', getFilteredData(tableCData), VARIANT.rightNoActionColumns, { tableKey: 'tableC', selectedIds: selectedCIds, onRowClick: 'onRightRowClick' });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f

    updateAllCounts();
}

function updateAllCounts() {
    BssDom.setText('table1Count', BssFormat.numberWithCommas(sumQty(getFilteredData(table1Data))));
    BssDom.setText('table2Count', BssFormat.numberWithCommas(sumQty(getFilteredData(table2Data))));
    BssDom.setText('tableACount', BssFormat.numberWithCommas(sumQty(getFilteredData(tableAData))));
    BssDom.setText('tableBCount', BssFormat.numberWithCommas(sumQty(getFilteredData(tableBData))));
    BssDom.setText('tableCCount', BssFormat.numberWithCommas(sumQty(getFilteredData(tableCData))));

    // Excess count for table C
    var excessQty = tableCData.reduce(function (sum, item) { return sum + (item.ExcessQty || 0); }, 0);
    var tableCExtra = document.getElementById('tableCExtraCount');
    if (tableCExtra) {
        if (excessQty > 0) {
            tableCExtra.style.display = '';
            tableCExtra.innerHTML = 'เกิน: <strong class="count-danger">' + BssFormat.numberWithCommas(excessQty) + '</strong> ฉบับ';
        } else {
            tableCExtra.style.display = 'none';
        }
    }
}

// ============ Checkbox Handlers ============
function onCheckboxChange(tableKey, id, checked) {
    var selectedIds;
    if (tableKey === 'table1') selectedIds = selected1Ids;
    else if (tableKey === 'table2') selectedIds = selected2Ids;
    else if (tableKey === 'tableA') selectedIds = selectedAIds;
    else if (tableKey === 'tableB') selectedIds = selectedBIds;
    else if (tableKey === 'tableC') selectedIds = selectedCIds;
    else return;

    if (checked) {
        if (selectedIds.indexOf(id) === -1) selectedIds.push(id);
    } else {
        var idx = selectedIds.indexOf(id);
        if (idx !== -1) selectedIds.splice(idx, 1);
    }

<<<<<<< HEAD
    // Update row highlight
    var row = document.querySelector('#' + tableKey + ' tbody tr[data-id="' + id + '"]');
    if (row) {
        if (checked) row.classList.add('selected');
        else row.classList.remove('selected');
    }

    // Sync checkAll
    syncCheckAll(tableKey);

    // Show detail panel when checking an item
    if (checked) {
        var isLeft = (tableKey === 'table1' || tableKey === 'table2');
        if (isLeft) {
            selectLeftRow(id);
        } else {
            selectRightRow(id);
        }
    } else {
        var isLeft = (tableKey === 'table1' || tableKey === 'table2');
        if (isLeft) {
            var allCheckedLeft = getAllCheckedLeftItems();
            if (allCheckedLeft.length > 0) {
                showDetailPanelMulti(allCheckedLeft);
            } else {
                hideDetailAndAdjustment();
            }
        } else {
            var allCheckedRight = getAllCheckedRightItems();
            if (allCheckedRight.length > 0) {
                showDetailPanelMulti(allCheckedRight);
            } else {
                hideDetailAndAdjustment();
            }
        }
        renderAllTables();
=======
    syncCheckAll(tableKey);

    // tableA/tableB: checkbox triggers adjustment panel
    if (tableKey === 'tableA' || tableKey === 'tableB') {
        onRightTableCheckboxChange(id, checked, tableKey);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }
}

function checkAllHandler(tableKey, checked) {
    var data, selectedIds, columns;

    if (tableKey === 'table1') {
        data = getFilteredData(table1Data);
        selected1Ids = [];
        selectedIds = selected1Ids;
        columns = VARIANT.leftColumns;
    } else if (tableKey === 'table2') {
        data = getFilteredData(table2Data);
        selected2Ids = [];
        selectedIds = selected2Ids;
        columns = VARIANT.leftColumns;
    } else if (tableKey === 'tableA') {
        data = getFilteredData(tableAData);
        selectedAIds = [];
        selectedIds = selectedAIds;
        columns = VARIANT.rightColumns;
    } else if (tableKey === 'tableB') {
        data = getFilteredData(tableBData);
        selectedBIds = [];
        selectedIds = selectedBIds;
        columns = VARIANT.rightNoActionColumns;
    } else if (tableKey === 'tableC') {
        data = getFilteredData(tableCData);
        selectedCIds = [];
        selectedIds = selectedCIds;
        columns = VARIANT.rightNoActionColumns;
    } else {
        return;
    }

    if (checked) {
        data.forEach(function (item) { selectedIds.push(item.Id); });
    }

    var bodyId = tableKey + 'Body';
<<<<<<< HEAD
    renderTableBody(bodyId, data, columns, { tableKey: tableKey, selectedIds: selectedIds });

    // Show/hide detail panel
    var isLeft = (tableKey === 'table1' || tableKey === 'table2');
    if (checked) {
        var allChecked = isLeft ? getAllCheckedLeftItems() : getAllCheckedRightItems();
        showDetailPanelMulti(allChecked);
        if (!isLeft) {
            var adj = document.getElementById('adjustmentPanel');
            if (adj) adj.style.display = 'none';
        }
    } else {
        hideDetailAndAdjustment();
    }
=======
    var isLeft = (tableKey === 'table1' || tableKey === 'table2');
    var onRowClick = isLeft ? 'onLeftRowClick' : 'onRightRowClick';
    renderTableBody(bodyId, data, columns, { tableKey: tableKey, selectedIds: selectedIds, onRowClick: onRowClick });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function syncCheckAll(tableKey) {
    var data, selectedIds;
    if (tableKey === 'table1') { data = getFilteredData(table1Data); selectedIds = selected1Ids; }
    else if (tableKey === 'table2') { data = getFilteredData(table2Data); selectedIds = selected2Ids; }
    else if (tableKey === 'tableA') { data = getFilteredData(tableAData); selectedIds = selectedAIds; }
    else if (tableKey === 'tableB') { data = getFilteredData(tableBData); selectedIds = selectedBIds; }
    else if (tableKey === 'tableC') { data = getFilteredData(tableCData); selectedIds = selectedCIds; }
    else return;

    var checkAll = document.getElementById('checkAll_' + tableKey);
    if (checkAll) {
        checkAll.checked = selectedIds.length > 0 && selectedIds.length === data.length;
    }
}

// ============ Sort ============
function sortTable(tableKey, column) {
    var state = sortStates[tableKey];
    if (!state) return;

    BssSort.toggle(state, column);

    var data;
    if (tableKey === 'table1') data = getFilteredData(table1Data);
    else if (tableKey === 'table2') data = getFilteredData(table2Data);
    else if (tableKey === 'tableA') data = getFilteredData(tableAData);
    else if (tableKey === 'tableB') data = getFilteredData(tableBData);
    else if (tableKey === 'tableC') data = getFilteredData(tableCData);
    else return;

    var sorted = data.slice().sort(function (a, b) {
        if (column === 'Status') {
            var sa = a.IsEdited ? 'Edited' : (a.Status || 'Auto Selling');
            var sb = b.IsEdited ? 'Edited' : (b.Status || 'Auto Selling');
            if (sa < sb) return state.direction === 'asc' ? -1 : 1;
            if (sa > sb) return state.direction === 'asc' ? 1 : -1;
            return 0;
        }
        return BssSort.compare(a, b, column, state.direction);
    });

    var bodyId = tableKey + 'Body';
    var columns, options;
    if (tableKey === 'table1') {
        columns = VARIANT.leftColumns;
<<<<<<< HEAD
        options = { tableKey: 'table1', selectedIds: selected1Ids };
    } else if (tableKey === 'table2') {
        columns = VARIANT.leftColumns;
        options = { tableKey: 'table2', selectedIds: selected2Ids };
    } else if (tableKey === 'tableA') {
        columns = VARIANT.rightColumns;
        options = { tableKey: 'tableA', selectedIds: selectedAIds };
    } else if (tableKey === 'tableB') {
        columns = VARIANT.rightNoActionColumns;
        options = { tableKey: 'tableB', selectedIds: selectedBIds };
    } else {
        columns = VARIANT.rightNoActionColumns;
        options = { tableKey: 'tableC', selectedIds: selectedCIds };
=======
        options = { tableKey: 'table1', selectedIds: selected1Ids, onRowClick: 'onLeftRowClick' };
    } else if (tableKey === 'table2') {
        columns = VARIANT.leftColumns;
        options = { tableKey: 'table2', selectedIds: selected2Ids, onRowClick: 'onLeftRowClick' };
    } else if (tableKey === 'tableA') {
        columns = VARIANT.rightColumns;
        options = { tableKey: 'tableA', selectedIds: selectedAIds, onRowClick: 'onRightRowClick' };
    } else if (tableKey === 'tableB') {
        columns = VARIANT.rightNoActionColumns;
        options = { tableKey: 'tableB', selectedIds: selectedBIds, onRowClick: 'onRightRowClick' };
    } else {
        columns = VARIANT.rightNoActionColumns;
        options = { tableKey: 'tableC', selectedIds: selectedCIds, onRowClick: 'onRightRowClick' };
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }

    renderTableBody(bodyId, sorted, columns, options);
    BssSort.updateIcons(tableKey, column, state.direction);
}

// ============ Filter ============
function toggleFilter() {
    BssDom.toggleFilter('filterSection');
}

function populateFilterDropdowns() {
    var allData = table1Data.concat(table2Data, tableAData, tableBData, tableCData);
    var headerCards = [];
    var banks = [];
    var zones = [];
    var cashpoints = [];
    var denoms = [];

    allData.forEach(function (item) {
<<<<<<< HEAD
=======
        if (item.Status === 'Verify') return;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        if (item.HeaderCardCode && headerCards.indexOf(item.HeaderCardCode) === -1) headerCards.push(item.HeaderCardCode);
        if (item.Bank && banks.indexOf(item.Bank) === -1) banks.push(item.Bank);
        if (item.Zone && zones.indexOf(item.Zone) === -1) zones.push(item.Zone);
        if (item.Cashpoint && cashpoints.indexOf(item.Cashpoint) === -1) cashpoints.push(item.Cashpoint);
        if (item.DenominationPrice && denoms.indexOf(item.DenominationPrice) === -1) denoms.push(item.DenominationPrice);
    });

    headerCards.sort();
    banks.sort();
    zones.sort();
    cashpoints.sort();
    denoms.sort(function (a, b) { return b - a; });

    fillSelect('filterHeaderCard', headerCards);
    fillSelect('filterBank', banks);
    fillSelect('filterZone', zones);
    fillSelect('filterCashpoint', cashpoints);
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

function getFilteredData(data) {
    var hcFilter = document.getElementById('filterHeaderCard')?.value || '';
    var bankFilter = document.getElementById('filterBank')?.value || '';
    var zoneFilter = document.getElementById('filterZone')?.value || '';
    var cpFilter = document.getElementById('filterCashpoint')?.value || '';
    var denomFilter = document.getElementById('filterDenomination')?.value || '';

    if (!hcFilter && !bankFilter && !zoneFilter && !cpFilter && !denomFilter) return data;

    return data.filter(function (item) {
        if (hcFilter && item.HeaderCardCode !== hcFilter) return false;
        if (bankFilter && item.Bank !== bankFilter) return false;
        if (zoneFilter && item.Zone !== zoneFilter) return false;
        if (cpFilter && item.Cashpoint !== cpFilter) return false;
        if (denomFilter && String(item.DenominationPrice) !== String(denomFilter)) return false;
        return true;
    });
}

function applyFilters() {
    // Clear selections
    selected1Ids = [];
    selected2Ids = [];
    selectedAIds = [];
    selectedBIds = [];
    selectedCIds = [];

    renderAllTables();
    hideDetailAndAdjustment();
}

function initFilterListeners() {
    ['filterHeaderCard', 'filterBank', 'filterZone', 'filterCashpoint', 'filterDenomination'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });
}

<<<<<<< HEAD
// ============ Select Row in Left Panel ============
function selectLeftRow(id) {
    var item = table1Data.find(function (x) { return x.Id === id; })
        || table2Data.find(function (x) { return x.Id === id; });
=======
// ============ Row Click — Left Panel (ดู 1 รายการ) ============
function onLeftRowClick(id, tableKey) {
    var data = tableKey === 'table2' ? table2Data : table1Data;
    var item = data.find(function (x) { return x.Id === id; });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    if (!item) return;

    selectedLeftRow = item;
    selectedRightRow = null;
<<<<<<< HEAD

    // Re-render all tables to update highlights
    renderAllTables();

    // Collect all checked items from left panel tables
    var allCheckedItems = getAllCheckedLeftItems();
    showDetailPanelMulti(allCheckedItems);
=======
    activeTableKey = tableKey;

    renderAllTables();
    updateHeaderActionButtons();
    showDetailPanel(item);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    var adj = document.getElementById('adjustmentPanel');
    if (adj) adj.style.display = 'none';
}

<<<<<<< HEAD
=======
// ============ Row Click — Right Panel (ดู 1 รายการ + adjustment สำหรับมัดขาด-เกิน) ============
function onRightRowClick(id, tableKey) {
    var dataMap = { tableA: tableAData, tableB: tableBData, tableC: tableCData };
    var data = dataMap[tableKey];
    if (!data) return;
    var item = data.find(function (x) { return x.Id === id; });
    if (!item) return;

    selectedRightRow = item;
    selectedLeftRow = null;
    activeTableKey = tableKey;

    renderAllTables();
    updateHeaderActionButtons();
    showDetailPanel(item);

    // Row click shows detail only — adjustment panel is triggered by checkbox
    var adj = document.getElementById('adjustmentPanel');
    if (adj) adj.style.display = 'none';
}

// ============ Restore Selections (กลับจาก VerifyConfirmation) ============
function restoreSelections() {
    try {
        var vd = JSON.parse(localStorage.getItem('verifyData') || '{}');
        var saved1 = vd.selected1Ids || [];
        var saved2 = vd.selected2Ids || [];
        // เฉพาะ IDs ที่ยังมีอยู่ใน data จริง
        if (saved1.length > 0) {
            var valid1 = saved1.filter(function (id) {
                return table1Data.some(function (x) { return x.Id === id; });
            });
            if (valid1.length > 0) selected1Ids = valid1;
        }
        if (saved2.length > 0) {
            var valid2 = saved2.filter(function (id) {
                return table2Data.some(function (x) { return x.Id === id; });
            });
            if (valid2.length > 0) selected2Ids = valid2;
        }
    } catch (e) { /* ignore */ }
}

// ============ Get Checked Items (for summary) ============
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function getAllCheckedLeftItems() {
    var items = [];
    selected1Ids.forEach(function (id) {
        var item = table1Data.find(function (x) { return x.Id === id; });
        if (item) items.push(item);
    });
    selected2Ids.forEach(function (id) {
        var item = table2Data.find(function (x) { return x.Id === id; });
        if (item) items.push(item);
    });
    return items;
}

<<<<<<< HEAD
// ============ Select Row in Right Panel ============
function selectRightRow(id) {
    var item = tableAData.find(function (x) { return x.Id === id; })
        || tableBData.find(function (x) { return x.Id === id; })
        || tableCData.find(function (x) { return x.Id === id; });
    if (!item) return;

    selectedRightRow = item;
    selectedLeftRow = null;

    // Re-render all tables to update highlights
    renderAllTables();

    // Collect all checked items from right panel tables
    var allCheckedItems = getAllCheckedRightItems();
    showDetailPanelMulti(allCheckedItems);

    // Show adjustment only for tableA items (มัดขาด-เกิน)
    var isTableA = tableAData.some(function (x) { return x.Id === id; });
    if (isTableA) {
        showAdjustmentPanel(item);
    } else {
        var adj = document.getElementById('adjustmentPanel');
        if (adj) adj.style.display = 'none';
    }
}

=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function getAllCheckedRightItems() {
    var items = [];
    selectedAIds.forEach(function (id) {
        var item = tableAData.find(function (x) { return x.Id === id; });
        if (item) items.push(item);
    });
    selectedBIds.forEach(function (id) {
        var item = tableBData.find(function (x) { return x.Id === id; });
        if (item) items.push(item);
    });
    selectedCIds.forEach(function (id) {
        var item = tableCData.find(function (x) { return x.Id === id; });
        if (item) items.push(item);
    });
    return items;
}

function showDetailPanelMulti(items) {
    var panel = document.getElementById('detailPanel');
    if (!panel) return;
    if (!items || items.length === 0) {
        hideDetailAndAdjustment();
        return;
    }

    if (USE_MOCK_DATA) {
        detailData = [];
        items.forEach(function (item) {
            var rows = getMockDetailData(item);
            detailData = detailData.concat(rows);
        });
<<<<<<< HEAD
    }

    sortStates.detail = BssSort.createState();
    renderDetailTable();
    panel.style.display = 'flex';
=======
        sortStates.detail = BssSort.createState();
        renderDetailTable();
        panel.style.display = 'flex';
    } else {
        // Call backend API for each item, collect all rows
        detailData = [];
        var completed = 0;
        var total = items.length;

        items.forEach(function (item) {
            $.ajax({
                url: rootPath + 'AutoSelling/GetAutoSellingDetail',
                type: 'GET',
                data: { headerCardCode: item.HeaderCardCode },
                dataType: 'json',
                success: function (response) {
                    if (response && response.is_success && response.data) {
                        var rows = response.data.rows || response.data.Rows || [];
                        detailData = detailData.concat(rows.map(mapApiDetailRow));
                    }
                },
                error: function () {
                    console.error('GetAutoSellingDetail failed for', item.HeaderCardCode);
                },
                complete: function () {
                    completed++;
                    if (completed === total) {
                        sortStates.detail = BssSort.createState();
                        renderDetailTable();
                        panel.style.display = 'flex';
                    }
                }
            });
        });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============ Detail Panel ============
var detailColumns = [
    { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
    { key: 'Bank', label: 'ธนาคาร', sortable: true },
    { key: 'Cashpoint', label: 'Cashpoint', sortable: true },
    { key: 'DenominationPrice', label: 'ชนิดราคา', sortable: true, format: 'badge' },
    { key: 'Type', label: 'ประเภท', sortable: true },
    { key: 'TypeNum', label: 'แบบ', sortable: true, className: 'text-center' },
    { key: 'Qty', label: 'จำนวนฉบับ', sortable: true, format: 'number', className: 'text-right' },
<<<<<<< HEAD
    { key: 'TotalValue', label: 'มูลค่า', sortable: true, format: 'number', className: 'text-right' }
=======
    { key: 'TotalValue', label: 'มูลค่า', sortable: true, format: 'number', className: 'text-right' },
    { key: 'detailAction', label: 'Action', sortable: false, className: 'text-center' }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
];

function showDetailPanel(item) {
    var panel = document.getElementById('detailPanel');
    if (!panel) return;

<<<<<<< HEAD
    if (USE_MOCK_DATA) {
        detailData = getMockDetailData(item);
    }

    // Reset sort state when new data loaded
    sortStates.detail = BssSort.createState();

    renderDetailTable();
    panel.style.display = 'flex';
=======
    detailParentDenom = item.DenominationPrice || null;
    detailParentQty = item.Qty || null;

    if (USE_MOCK_DATA) {
        detailData = getMockDetailData(item);
        sortStates.detail = BssSort.createState();
        renderDetailTable();
        panel.style.display = 'flex';
    } else {
        // Call backend API
        $.ajax({
            url: rootPath + 'AutoSelling/GetAutoSellingDetail',
            type: 'GET',
            data: { headerCardCode: item.HeaderCardCode },
            dataType: 'json',
            success: function (response) {
                if (response && response.is_success && response.data) {
                    var rows = response.data.rows || response.data.Rows || [];
                    detailData = rows.map(mapApiDetailRow);
                } else {
                    detailData = [];
                }
                sortStates.detail = BssSort.createState();
                renderDetailTable();
                panel.style.display = 'flex';
            },
            error: function () {
                console.error('GetAutoSellingDetail failed for', item.HeaderCardCode);
                detailData = [];
                sortStates.detail = BssSort.createState();
                renderDetailTable();
                panel.style.display = 'flex';
            }
        });
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function renderDetailTable() {
    var totalQty = detailData.reduce(function (sum, d) { return sum + d.Qty; }, 0);
    BssDom.setText('detailPanelCount', BssFormat.numberWithCommas(totalQty));

    // Build thead
    var thead = document.getElementById('detailTableHead');
    if (thead) {
        thead.innerHTML = detailColumns.map(function (col) {
            if (col.sortable) {
                return '<th class="th-sort ' + (col.className || '') + '" data-sort="' + col.key + '" onclick="sortDetailTable(\'' + col.key + '\')">' +
                    col.label + ' <i class="bi bi-chevron-expand sort-icon"></i></th>';
            }
            return '<th class="' + (col.className || '') + '">' + col.label + '</th>';
        }).join('');
    }

    // Build tbody
<<<<<<< HEAD
=======
    var insertReplaceIcon = '<img src="/images/icons/insert-replace.svg" width="16" height="16" alt="แทรกแทน" />';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    var tbody = document.getElementById('detailPanelBody');
    if (tbody) {
        tbody.innerHTML = detailData.map(function (d) {
            return '<tr>' + detailColumns.map(function (col) {
                var val = d[col.key];
                var cls = col.className || '';
<<<<<<< HEAD
=======
                if (col.key === 'detailAction') {
                    var showIcon = detailParentDenom != null && d.DenominationPrice !== detailParentDenom;
                    return '<td class="' + cls + '">' + (showIcon ? '<button class="table-action-btn" onclick="event.stopPropagation(); onInsertReplace(\'' + d.HeaderCardCode + '\', ' + d.DenominationPrice + ', ' + d.Qty + ')" title="แทรกแทน">' + insertReplaceIcon + '</button>' : '') + '</td>';
                }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                if (col.format === 'badge') return '<td class="' + cls + '">' + BssFormat.denomBadgeHtml(val) + '</td>';
                if (col.format === 'number') return '<td class="' + cls + '">' + BssFormat.numberWithCommas(val) + '</td>';
                return '<td class="' + cls + '">' + (val != null ? val : '-') + '</td>';
            }).join('') + '</tr>';
        }).join('');
    }
}

function sortDetailTable(column) {
    var state = sortStates.detail;
    BssSort.toggle(state, column);

    detailData.sort(function (a, b) {
        return BssSort.compare(a, b, column, state.direction);
    });

    renderDetailTable();
    BssSort.updateIcons('detailTable', column, state.direction);
}

<<<<<<< HEAD
=======
// ============ Insert Replace (แทรกแทน) ============
// เปิด panel แทรกแทน — foreignDenom คือชนิดราคาที่แทรกมา, foreignQty คือจำนวนที่แทรก
function onInsertReplace(headerCardCode, foreignDenom, foreignQty) {
    var panel = document.getElementById('insertReplacePanel');
    if (!panel) return;

    // ซ่อน adjustment panel ถ้าเปิดอยู่
    var adj = document.getElementById('adjustmentPanel');
    if (adj) adj.style.display = 'none';

    // Header Card
    var hcEl = document.getElementById('irHeaderCard');
    if (hcEl) hcEl.textContent = headerCardCode;

    // ชนิดราคาหลัก (parent)
    var originalDenom = detailParentDenom || 1000;

    // Build rows (from API cache)
    var denomOptions = cachedDenomOptions;
    var typeOptions = cachedSeriesOptions;

    function buildSelect(options, selectedVal, idPrefix, matchByLabel) {
        return '<select class="adj-select" id="' + idPrefix + '">' +
            options.map(function (opt) {
                var matchField = matchByLabel ? opt.label : opt.value;
                var sel = String(matchField) === String(selectedVal) ? ' selected' : '';
                return '<option value="' + opt.value + '"' + sel + '>' + opt.label + '</option>';
            }).join('') + '</select>';
    }

    var container = document.getElementById('irRowsContainer');
    if (container) {
        // Row 1: ชนิดราคาแทรก → ลด (disabled — auto คำนวณ)
        var radioSubtract = '<div class="radio-group-direction" style="pointer-events:none;opacity:0.7;">' +
            '<label class="radio-item"><span class="radio-circle"></span><span class="radio-label">เพิ่ม</span></label>' +
            '<label class="radio-item active"><span class="radio-circle"></span><span class="radio-label">ลด</span></label>' +
            '</div>';
        var row1 = '<div class="ir-form-row">' +
            '<div class="form-group"><label class="form-label">ชนิดราคา</label>' + buildSelect(denomOptions, foreignDenom, 'irDenom1', true) + '</div>' +
            '<div class="form-group"><label class="form-label">แบบ</label>' + buildSelect(typeOptions, '17', 'irType1') + '</div>' +
            '<div class="form-group"><label class="form-label">จำนวน (ฉบับ)</label><input type="number" class="form-input" id="irQty1" value="' + foreignQty + '" min="0" disabled /></div>' +
            '<div class="ir-direction-badges">' + radioSubtract + '</div>' +
            '</div>';

        // Row 2: ชนิดราคาหลัก → เพิ่ม (จำนวนครบ 1000, disabled — auto คำนวณ)
        var supQty = 1000;
        var currentCorrectQty = (detailParentQty || 0) - foreignQty;
        var addQty = supQty - currentCorrectQty;
        if (addQty < foreignQty) addQty = foreignQty;

        var radioAdd = '<div class="radio-group-direction" style="pointer-events:none;opacity:0.7;">' +
            '<label class="radio-item active"><span class="radio-circle"></span><span class="radio-label">เพิ่ม</span></label>' +
            '<label class="radio-item"><span class="radio-circle"></span><span class="radio-label">ลด</span></label>' +
            '</div>';
        var row2 = '<div class="ir-form-row">' +
            '<div class="form-group"><label class="form-label">ชนิดราคา</label>' + buildSelect(denomOptions, originalDenom, 'irDenom2', true) + '</div>' +
            '<div class="form-group"><label class="form-label">แบบ</label>' + buildSelect(typeOptions, '17', 'irType2') + '</div>' +
            '<div class="form-group"><label class="form-label">จำนวน (ฉบับ)</label><input type="number" class="form-input" id="irQty2" value="' + addQty + '" min="0" disabled /></div>' +
            '<div class="ir-direction-badges">' + radioAdd + '</div>' +
            '</div>';

        container.innerHTML = row1 + row2;
        // Row 1 (แทรก): disabled ทั้งหมด, Row 2 (หลัก): เปิดแบบให้เลือกได้
        container.querySelectorAll('select').forEach(function(s) { s.disabled = true; });
        var irType2 = document.getElementById('irType2');
        if (irType2) irType2.disabled = false;
    }

    // Reset remark + radio
    var remarkEl = document.getElementById('irRemark');
    if (remarkEl) remarkEl.value = '';
    resetRadioGroup('.ir-radio-group-type', 'normal');

    // Setup radio click for this panel
    panel.querySelectorAll('.ir-radio-group-type .radio-item').forEach(function (item) {
        item.addEventListener('click', function () {
            if (this.classList.contains('disabled')) return;
            var group = this.closest('.ir-radio-group-type');
            if (!group) return;
            group.querySelectorAll('.radio-item').forEach(function (r) { r.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    panel.style.display = 'flex';
}

function getSelectedLabel(selectId) {
    var el = document.getElementById(selectId);
    if (!el || el.selectedIndex < 0) return '';
    return el.options[el.selectedIndex].text;
}

function saveInsertReplace() {
    var headerCard = document.getElementById('irHeaderCard')?.textContent || '';
    var denom1Label = getSelectedLabel('irDenom1');
    var type1Label = getSelectedLabel('irType1');
    var qty1 = parseInt(document.getElementById('irQty1')?.value || '0');
    var denom2Label = getSelectedLabel('irDenom2');
    var type2Label = getSelectedLabel('irType2');
    var qty2 = parseInt(document.getElementById('irQty2')?.value || '0');
    var remark = document.getElementById('irRemark')?.value || '';
    var typeRadio = document.querySelector('.ir-radio-group-type .radio-item.active')?.dataset?.value || 'normal';

    var payload = {
        HeaderCardCode: headerCard,
        Rows: [
            { Denomination: parseInt(denom1Label), TypeNum: type1Label, Qty: qty1, Direction: 'subtract' },
            { Denomination: parseInt(denom2Label), TypeNum: type2Label, Qty: qty2, Direction: 'add' }
        ],
        Remark: remark,
        Type: typeRadio
    };

    if (USE_MOCK_DATA) {
        console.log('Save Insert Replace (mock):', payload);
        showSuccessModal('บันทึกแทรกแทนสำเร็จ');
        return;
    }

    $.requestAjax({
        service: 'AutoSelling/SaveInsertReplace',
        type: 'POST',
        parameter: payload,
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                showSuccessModal('บันทึกแทรกแทนสำเร็จ');
                hideInsertReplacePanel();
                refreshData();
            } else {
                showVerifyError(response?.msg_desc || 'บันทึกแทรกแทนไม่สำเร็จ');
            }
        },
        onError: function () {
            showVerifyError('เกิดข้อผิดพลาดในการบันทึกแทรกแทน');
        }
    });
}

function hideInsertReplacePanel() {
    var panel = document.getElementById('insertReplacePanel');
    if (panel) panel.style.display = 'none';
}

// ============ Adjust Offset ============
var offsetCheckedItemId = null; // item Id ที่ถูก checkbox ก่อนเปิด modal

// เมื่อ checkbox ใน tableA หรือ tableB เปลี่ยน
function onRightTableCheckboxChange(id, checked, tableKey) {
    var adj = document.getElementById('adjustmentPanel');
    var btnOffset = document.getElementById('btnAdjustOffset');

    if (!checked) {
        // uncheck → ซ่อน adjustment panel
        if (adj) adj.style.display = 'none';
        offsetCheckedItemId = null;
        return;
    }

    // หา item ที่เลือก
    var dataMap = { tableA: tableAData, tableB: tableBData };
    var data = dataMap[tableKey];
    if (!data) return;
    var item = data.find(function (x) { return x.Id === id; });
    if (!item) return;

    // uncheck อันเก่าก่อน — เลือกปรับได้ทีละ 1 รายการ
    if (offsetCheckedItemId && offsetCheckedItemId !== id) {
        var oldIdx = selectedAIds.indexOf(offsetCheckedItemId);
        if (oldIdx !== -1) selectedAIds.splice(oldIdx, 1);
        oldIdx = selectedBIds.indexOf(offsetCheckedItemId);
        if (oldIdx !== -1) selectedBIds.splice(oldIdx, 1);
    }

    offsetCheckedItemId = id;

    // เซ็ต selectedRightRow เพื่อให้ saveAdjustment ใช้ได้
    selectedRightRow = item;
    activeTableKey = tableKey;

    // render ใหม่เพื่อ uncheck อันเก่าใน UI
    renderAllTables();

    // sync checkAll ทุกตารางหลัง uncheck อันเก่า
    ['tableA', 'tableB', 'tableC'].forEach(function (k) { syncCheckAll(k); });

    // แสดง adjustment panel
    showAdjustmentPanel(item);

    // เช็คว่ามี header card ต่อเนื่องไหม (เฉพาะ tableA)
    if (btnOffset) {
        if (tableKey === 'tableA') {
            var group = findConsecutiveGroup(item.HeaderCardCode);
            btnOffset.style.display = group.length >= 2 ? '' : 'none';
        } else {
            btnOffset.style.display = 'none';
        }
    }
}

// backward compat alias
function onTableACheckboxChange(id, checked) {
    onRightTableCheckboxChange(id, checked, 'tableA');
}

// หา header card ที่ต่อเนื่องกันจาก tableA โดยดูจาก HC ที่เลือก
function findConsecutiveGroup(selectedHc) {
    var selectedNum = parseHcNumber(selectedHc);
    if (isNaN(selectedNum)) return [];

    // ดึง prefix (ส่วนที่ไม่ใช่ตัวเลขท้าย)
    var match = selectedHc.match(/^(.*?)(\d+)$/);
    if (!match) return [];
    var prefix = match[1];
    var numLen = match[2].length;

    // สร้าง map ของเลข HC ทั้งหมดใน tableA
    var hcMap = {};
    tableAData.forEach(function (item) {
        var num = parseHcNumber(item.HeaderCardCode);
        if (!isNaN(num)) hcMap[num] = item;
    });

    // ขยายช่วงจาก selectedNum ไปซ้ายและขวา
    var lo = selectedNum, hi = selectedNum;
    while (hcMap[lo - 1] !== undefined) lo--;
    while (hcMap[hi + 1] !== undefined) hi++;

    var group = [];
    for (var n = lo; n <= hi; n++) {
        if (hcMap[n]) group.push(hcMap[n]);
    }

    return group;
}

function parseHcNumber(hc) {
    if (!hc) return NaN;
    var match = hc.match(/(\d+)$/);
    return match ? parseInt(match[1]) : NaN;
}

// Offset modal — sortable columns & cached group data
var offsetGroupData = [];
var offsetColumns = [
    { key: 'checkbox', label: '<input type="checkbox" id="offsetSelectAll" onchange="toggleOffsetSelectAll(this)" />', sortable: false, className: 'text-center', width: '40px' },
    { key: 'HeaderCardCode', label: 'Header Card', sortable: true },
    { key: 'Bank', label: 'ธนาคาร', sortable: true },
    { key: 'Cashpoint', label: 'Cashpoint', sortable: true },
    { key: 'DenominationPrice', label: 'ชนิดราคา', sortable: true, format: 'badge', className: 'text-center' },
    { key: 'Qty', label: 'จำนวนฉบับ', sortable: true, format: 'number', className: 'text-right' }
];

function renderOffsetTableBody() {
    var tbody = document.getElementById('offsetSelectBody');
    if (!tbody) return;
    // preserve checked state
    var checkedIds = [];
    tbody.querySelectorAll('.offset-checkbox:checked').forEach(function (cb) {
        checkedIds.push(Number(cb.getAttribute('data-id')));
    });
    // if first render, pre-check the selected item
    if (checkedIds.length === 0 && offsetCheckedItemId) {
        checkedIds.push(offsetCheckedItemId);
    }

    tbody.innerHTML = offsetGroupData.map(function (item) {
        var isChecked = checkedIds.indexOf(item.Id) !== -1 ? ' checked' : '';
        var rowClass = isChecked ? ' class="selected"' : '';
        return '<tr' + rowClass + ' data-id="' + item.Id + '">' +
            '<td class="text-center"><input type="checkbox" class="offset-checkbox" data-id="' + item.Id + '"' + isChecked + ' onchange="updateOffsetRowHighlight(this)" /></td>' +
            '<td>' + item.HeaderCardCode + '</td>' +
            '<td>' + (item.Bank || '-') + '</td>' +
            '<td>' + (item.Cashpoint || '-') + '</td>' +
            '<td class="text-center">' + BssFormat.denomBadgeHtml(item.DenominationPrice) + '</td>' +
            '<td class="text-right">' + BssFormat.numberWithCommas(item.Qty) + '</td>' +
            '</tr>';
    }).join('');
}

function renderOffsetTableHead() {
    var thead = document.querySelector('#offsetSelectTable thead tr');
    if (!thead) return;
    thead.innerHTML = offsetColumns.map(function (col) {
        var style = col.width ? ' style="width:' + col.width + ';"' : '';
        if (col.sortable) {
            return '<th class="th-sort ' + (col.className || '') + '"' + style + ' data-sort="' + col.key + '" onclick="sortOffsetTable(\'' + col.key + '\')">' +
                col.label + ' <i class="bi bi-chevron-expand sort-icon"></i></th>';
        }
        return '<th class="' + (col.className || '') + '"' + style + '>' + col.label + '</th>';
    }).join('');
}

function sortOffsetTable(column) {
    var state = sortStates.offset;
    BssSort.toggle(state, column);

    offsetGroupData.sort(function (a, b) {
        return BssSort.compare(a, b, column, state.direction);
    });

    renderOffsetTableBody();
    BssSort.updateIcons('offsetSelectTable', column, state.direction);
}

// เปิด modal Adjust Offset — แสดง consecutive group เป็นตาราง, pre-check item ที่เลือก
function openAdjustOffsetModal() {
    var checkedItem = tableAData.find(function (x) { return x.Id === offsetCheckedItemId; });
    if (!checkedItem) return;

    var group = findConsecutiveGroup(checkedItem.HeaderCardCode);
    if (group.length < 2) {
        showVerifyError('ไม่พบ Header Card ที่ต่อเนื่องกัน');
        return;
    }

    // Store group data for sorting
    offsetGroupData = group.slice();
    sortStates.offset = BssSort.createState();

    // Render Step A: sortable header + table body
    renderOffsetTableHead();
    renderOffsetTableBody();

    // Update select-all checkbox
    var selectAll = document.getElementById('offsetSelectAll');
    if (selectAll) selectAll.checked = false;

    var errEl = document.getElementById('offsetError');
    if (errEl) errEl.classList.remove('show');

    BssModal.setStep('adjustOffsetModal', 'offsetStepA');

    var modal = new bootstrap.Modal(document.getElementById('adjustOffsetModal'));
    modal.show();
}

// Reset ทั้งหมดเมื่อปิด modal Adjust Offset
(function () {
    var modalEl = document.getElementById('adjustOffsetModal');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', function () {
            // ล้าง OTP timer
            if (offsetOtpTimerInterval) { clearInterval(offsetOtpTimerInterval); offsetOtpTimerInterval = null; }
            // ล้าง OTP data
            offsetOtpData = { managerId: null, managerName: '', refCode: '', selectedIds: [] };
            // ล้าง OTP input
            var otpInput = document.getElementById('offsetOtpInput');
            if (otpInput) { otpInput.value = ''; otpInput.disabled = true; }
            // ซ่อน OTP sent msg + resend row
            var sentMsg = document.getElementById('offsetOtpSentMsg');
            if (sentMsg) sentMsg.style.display = 'none';
            var resendRow = document.getElementById('offsetOtpResendRow');
            if (resendRow) resendRow.style.display = 'none';
            // ซ่อน inline error
            BssModal.hideInlineError('offsetError');
            BssModal.hideInlineError('offsetOtpError');
            BssModal.hideInlineError('offsetManagerError');
            // reset manager select
            var managerSelect = document.getElementById('offsetManagerSelect');
            if (managerSelect) managerSelect.value = '';
            // reset step กลับ A
            BssModal.setStep('adjustOffsetModal', 'offsetStepA');
        });
    }
})();

// Toggle select-all checkboxes
function toggleOffsetSelectAll(masterCb) {
    var checkboxes = document.querySelectorAll('#offsetSelectBody .offset-checkbox');
    checkboxes.forEach(function (cb) {
        cb.checked = masterCb.checked;
        updateOffsetRowHighlight(cb);
    });
}

// Highlight/unhighlight row on checkbox change
function updateOffsetRowHighlight(cb) {
    var row = cb.closest('tr');
    if (row) {
        if (cb.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    }
}

// Step A → Step B: ดำเนินการต่อ (validate ก่อนไป Step B)
function confirmOffsetStepA() {
    var checkboxes = document.querySelectorAll('#offsetSelectBody .offset-checkbox:checked');

    // Collect selected items
    var selectedItems = [];
    checkboxes.forEach(function (cb) {
        var id = parseInt(cb.dataset.id);
        var item = tableAData.find(function (x) { return x.Id === id; });
        if (item) selectedItems.push(item);
    });

    // Validate: ต้องเลือกอย่างน้อย 2 รายการ
    var errEl = document.getElementById('offsetError');
    if (selectedItems.length < 2) {
        if (errEl) errEl.textContent = 'กรุณาเลือกรายการให้ครบ 2 รายการ';
        BssModal.showInlineError('offsetError');
        return;
    }

    // Validate: ผลรวม Qty ต้องครบ 2000
    var totalQty = selectedItems.reduce(function (sum, item) { return sum + (item.Qty || 0); }, 0);
    if (totalQty !== 2000) {
        if (errEl) errEl.textContent = 'กรุณาเลือกรายการให้ผลรวมจำนวนธนบัตรรวมกันได้ครบจำนวน 2,000 ใบ (ปัจจุบัน: ' + BssFormat.numberWithCommas(totalQty) + ')';
        BssModal.showInlineError('offsetError');
        return;
    }

    BssModal.hideInlineError('offsetError');

    // Render Step B: reconfirm table (no checkbox)
    var tbody = document.getElementById('offsetConfirmBody');
    if (tbody) {
        tbody.innerHTML = selectedItems.map(function (item) {
            return '<tr>' +
                '<td>' + item.HeaderCardCode + '</td>' +
                '<td>' + (item.Bank || '-') + '</td>' +
                '<td>' + (item.Cashpoint || '-') + '</td>' +
                '<td class="text-center">' + BssFormat.denomBadgeHtml(item.DenominationPrice) + '</td>' +
                '<td class="text-right">' + BssFormat.numberWithCommas(item.Qty) + '</td>' +
                '</tr>';
        }).join('');
    }

    // Reset manager
    var managerSelect = document.getElementById('offsetManagerSelect');
    if (managerSelect) managerSelect.value = '';
    BssModal.hideInlineError('offsetManagerError');

    BssModal.setStep('adjustOffsetModal', 'offsetStepB');
}

// ── Offset OTP State ──
var offsetOtpData = { managerId: null, managerName: '', refCode: '', selectedIds: [] };
var offsetOtpTimerInterval = null;

// Step B → Step C: ส่งคำขออนุมัติ → ไปหน้า OTP
function confirmOffsetStepB() {
    var managerSelect = document.getElementById('offsetManagerSelect');
    if (!managerSelect || !managerSelect.value) {
        BssModal.showInlineError('offsetManagerError');
        return;
    }
    BssModal.hideInlineError('offsetManagerError');

    var checkboxes = document.querySelectorAll('#offsetSelectBody .offset-checkbox:checked');
    var selectedIds = [];
    checkboxes.forEach(function (cb) { selectedIds.push(parseInt(cb.dataset.id)); });

    // เก็บข้อมูลไว้ใช้ตอน confirm OTP
    offsetOtpData.managerId = managerSelect.value;
    offsetOtpData.managerName = managerSelect.options[managerSelect.selectedIndex].text;
    offsetOtpData.selectedIds = selectedIds;

    BssModal.setStep('adjustOffsetModal', 'offsetStepC');
    sendOffsetOtp(); // ยิง API ขอ OTP อัตโนมัติเมื่อเปิด Step C
}

function sendOffsetOtp() {
    if (offsetOtpTimerInterval) { clearInterval(offsetOtpTimerInterval); offsetOtpTimerInterval = null; }
    BssModal.hideInlineError('offsetOtpError');

    otp.send({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        userReceiveId: parseInt(offsetOtpData.managerId),
        bssMailSystemTypeCode: 'VERIFY_ADJUST_OFFSET'
    }).done(function (data) {
        offsetOtpData.refCode = data.refCode;
        var btnSend = document.getElementById('btnOffsetSendOtp');
        if (btnSend) btnSend.style.display = 'none';
        var otpInput = document.getElementById('offsetOtpInput');
        if (otpInput) { otpInput.disabled = false; otpInput.value = ''; otpInput.focus(); }
        var sentMsg = document.getElementById('offsetOtpSentMsg');
        if (sentMsg) sentMsg.style.display = '';
        var resendRow = document.getElementById('offsetOtpResendRow');
        if (resendRow) resendRow.style.display = '';
        startOffsetOtpTimer();
    }).fail(function () {
        BssModal.chain('adjustOffsetModal', function () {
            document.getElementById('verifyErrorMessage').textContent = 'ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่';
            new bootstrap.Modal(document.getElementById('verifyErrorModal')).show();
        });
    });
}

function startOffsetOtpTimer() {
    var btnResend = document.getElementById('btnOffsetResendOtp');
    var timerEl = document.getElementById('offsetOtpTimer');
    if (btnResend) btnResend.disabled = true;
    var remaining = 5 * 60;

    function updateTimer() {
        var min = Math.floor(remaining / 60);
        var sec = remaining % 60;
        if (timerEl) timerEl.textContent = 'ส่งอีกครั้งได้ภายใน ' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + ' นาที';
        if (remaining <= 0) {
            clearInterval(offsetOtpTimerInterval);
            offsetOtpTimerInterval = null;
            if (btnResend) btnResend.disabled = false;
            if (timerEl) timerEl.textContent = '';
        }
        remaining--;
    }
    updateTimer();
    if (offsetOtpTimerInterval) clearInterval(offsetOtpTimerInterval);
    offsetOtpTimerInterval = setInterval(updateTimer, 1000);
}

// Step C: ยืนยัน OTP → verify → เรียก API → ปิด modal → toast
function confirmOffsetOtp() {
    var otpVal = document.getElementById('offsetOtpInput').value.trim();
    var errEl = document.getElementById('offsetOtpError');
    if (!otpVal) {
        if (errEl) errEl.textContent = 'กรุณากรอกรหัส OTP';
        BssModal.showInlineError('offsetOtpError');
        return;
    }
    if (!/^\d{6}$/.test(otpVal)) {
        if (errEl) errEl.textContent = 'รหัส OTP ไม่ถูกต้อง กรุณากรอกตัวเลข 6 หลัก';
        BssModal.showInlineError('offsetOtpError');
        return;
    }
    BssModal.hideInlineError('offsetOtpError');

    otp.verify({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        bssMailSystemTypeCode: 'VERIFY_ADJUST_OFFSET',
        bssMailOtpCode: otpVal,
        bssMailRefCode: offsetOtpData.refCode
    }).done(function () {
        if (offsetOtpTimerInterval) { clearInterval(offsetOtpTimerInterval); offsetOtpTimerInterval = null; }

        var modalEl = document.getElementById('adjustOffsetModal');
        var modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        $.requestAjax({
            service: 'AutoSelling/SaveAdjustOffset',
            type: 'POST',
            parameter: {
                Ids: offsetOtpData.selectedIds,
                ManagerId: parseInt(offsetOtpData.managerId) || 0
            },
            enableLoader: true,
            onSuccess: function (response) {
                if (response && response.is_success) {
                    showSuccessModal('ส่งคำขออนุมัติ Adjust Offset สำเร็จ');
                    loadAllData();
                } else {
                    showVerifyError(response?.msg_desc || 'บันทึกไม่สำเร็จ');
                }
            },
            onError: function () {
                showVerifyError('เกิดข้อผิดพลาดในการส่งคำขออนุมัติ');
            }
        });
    }).fail(function (err) {
        if (errEl) errEl.textContent = otp.mapError(err);
        BssModal.showInlineError('offsetOtpError');
    });
}

function showVerifyError(msg) {
    var el = document.getElementById('verifyErrorMessage');
    if (el) el.textContent = msg;
    var modal = new bootstrap.Modal(document.getElementById('verifyErrorModal'));
    modal.show();
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
// ============ Adjustment Panel ============
function showAdjustmentPanel(item) {
    var panel = document.getElementById('adjustmentPanel');
    if (!panel) return;

    var hcEl = document.getElementById('adjHeaderCard');
    if (hcEl) hcEl.textContent = item.HeaderCardCode;

<<<<<<< HEAD
    // Populate ชนิดราคา dropdown
    var denomSelect = document.getElementById('adjDenomination');
    if (denomSelect) {
        var denomOptions = [
            { value: '1000', label: '1,000' },
            { value: '500', label: '500' },
            { value: '100', label: '100' },
            { value: '50', label: '50' },
            { value: '20', label: '20' }
        ];
        denomSelect.innerHTML = '';
        denomOptions.forEach(function (opt) {
            var option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (parseInt(opt.value) === item.DenominationPrice) option.selected = true;
            denomSelect.appendChild(option);
        });
    }

    // Populate แบบ dropdown
    var typeSelect = document.getElementById('adjType');
    if (typeSelect) {
        var typeOptions = [
            { value: '17', label: '17' },
            { value: '16', label: '16' },
            { value: '15', label: '15' },
            { value: '14', label: '14' }
        ];
        typeSelect.innerHTML = '';
        typeOptions.forEach(function (opt) {
            var option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
=======
    // แสดงชนิดราคาของ item ที่เลือก (ไม่ให้เปลี่ยน)
    var denomSelect = document.getElementById('adjDenomination');
    if (denomSelect) {
        denomSelect.innerHTML = '';
        var denomLabel = item.DenominationPrice;
        cachedDenomOptions.forEach(function (opt) {
            if (parseInt(opt.value) === item.DenominationPrice) denomLabel = opt.label;
        });
        var option = document.createElement('option');
        option.value = item.DenominationPrice;
        option.textContent = denomLabel;
        option.selected = true;
        denomSelect.appendChild(option);
        denomSelect.disabled = true;
    }

    // Populate แบบ dropdown — default เลือกตาม item
    var typeSelect = document.getElementById('adjType');
    if (typeSelect) {
        typeSelect.innerHTML = '';
        var seriesVal = String(item.SeriesDenomId || '');
        // fallback: ดึง TypeNum จาก item เอง หรือจาก detailData row แรก
        var typeNumVal = String(item.TypeNum || '');
        if (!seriesVal && !typeNumVal && detailData && detailData.length > 0) {
            typeNumVal = String(detailData[0].TypeNum || '');
        }
        var matched = false;
        cachedSeriesOptions.forEach(function (opt) {
            var option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (!matched) {
                if (seriesVal && opt.value === seriesVal) {
                    option.selected = true;
                    matched = true;
                } else if (!seriesVal && typeNumVal && opt.label === typeNumVal) {
                    option.selected = true;
                    matched = true;
                }
            }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            typeSelect.appendChild(option);
        });
    }

<<<<<<< HEAD
    resetRadioGroup('.radio-group-direction', 'add');
    resetRadioGroup('.radio-group-type', 'normal');

    var qtyEl = document.getElementById('adjQuantity');
    if (qtyEl) qtyEl.value = '0';
=======
    // ── กฎ 1,000 ฉบับถ้วน: auto-lock + auto-fill ──
    var qty = item.Qty || 0;
    var remainder = qty % 1000;  // ส่วนเกิน/ขาดจากพันถ้วน
    var diff;

    if (remainder === 0) {
        // ครบพันถ้วนพอดี (1000, 2000, 3000...)
        diff = 0;
        resetRadioGroup('.radio-group-direction', 'add');
        lockRadioOption('.radio-group-direction', 'add', false);
        lockRadioOption('.radio-group-direction', 'subtract', false);
    } else if (remainder <= 500) {
        // เกินจากพันถ้วน เช่น 2004→ลด 4, 1003→ลด 3
        diff = remainder;
        resetRadioGroup('.radio-group-direction', 'subtract');
        lockRadioOption('.radio-group-direction', 'add', true);
        lockRadioOption('.radio-group-direction', 'subtract', false);
    } else {
        // ขาดจากพันถ้วนถัดไป เช่น 996→เพิ่ม 4, 3996→เพิ่ม 4
        diff = 1000 - remainder;
        resetRadioGroup('.radio-group-direction', 'add');
        lockRadioOption('.radio-group-direction', 'subtract', true);
        lockRadioOption('.radio-group-direction', 'add', false);
    }

    resetRadioGroup('.radio-group-type', 'normal');

    var qtyEl = document.getElementById('adjQuantity');
    if (qtyEl) qtyEl.value = diff > 0 ? diff : '0';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    var remarkEl = document.getElementById('adjRemark');
    if (remarkEl) remarkEl.value = '';

    panel.style.display = 'flex';
}

function hideDetailAndAdjustment() {
    var detail = document.getElementById('detailPanel');
    var adj = document.getElementById('adjustmentPanel');
<<<<<<< HEAD
    if (detail) detail.style.display = 'none';
    if (adj) adj.style.display = 'none';
    selectedLeftRow = null;
    selectedRightRow = null;
=======
    var ir = document.getElementById('insertReplacePanel');
    if (detail) detail.style.display = 'none';
    if (adj) adj.style.display = 'none';
    if (ir) ir.style.display = 'none';
    selectedLeftRow = null;
    selectedRightRow = null;
    activeTableKey = null;
    updateHeaderActionButtons();
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ============ Radio Buttons ============
function setupRadioButtons() {
    document.querySelectorAll('.adjustment-panel .radio-item').forEach(function (item) {
        item.addEventListener('click', function () {
<<<<<<< HEAD
=======
            if (this.classList.contains('disabled')) return;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            var group = this.closest('.radio-group-direction, .radio-group-type');
            if (!group) return;
            group.querySelectorAll('.radio-item').forEach(function (r) { r.classList.remove('active'); });
            this.classList.add('active');
        });
    });
}

function resetRadioGroup(selector, defaultValue) {
    var group = document.querySelector(selector);
    if (!group) return;
    group.querySelectorAll('.radio-item').forEach(function (r) {
        r.classList.toggle('active', r.dataset.value === defaultValue);
    });
}

<<<<<<< HEAD
=======
function lockRadioOption(groupSelector, value, locked) {
    var group = document.querySelector(groupSelector);
    if (!group) return;
    group.querySelectorAll('.radio-item').forEach(function (r) {
        if (r.dataset.value === value) {
            if (locked) {
                r.classList.add('disabled');
                r.style.pointerEvents = 'none';
                r.style.opacity = '0.4';
            } else {
                r.classList.remove('disabled');
                r.style.pointerEvents = '';
                r.style.opacity = '';
            }
        }
    });
}

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function getActiveRadio(selector) {
    var group = document.querySelector(selector);
    if (!group) return null;
    var active = group.querySelector('.radio-item.active');
    return active ? active.dataset.value : null;
}

// ============ Save Adjustment ============
function saveAdjustment() {
    if (!selectedRightRow) return;

    var direction = getActiveRadio('.radio-group-direction');
    var type = getActiveRadio('.radio-group-type');
    var qty = parseInt(document.getElementById('adjQuantity')?.value || '0');
    var remark = document.getElementById('adjRemark')?.value || '';

    if (qty <= 0) {
        showVerifyError('กรุณาระบุจำนวนที่มากกว่า 0');
        return;
    }

    if (USE_MOCK_DATA) {
        var item = tableAData.find(function (x) { return x.Id === selectedRightRow.Id; });
        if (item) {
            item.IsEdited = true;
            item.Status = 'Edited';
        }
        renderTableBody('tableABody', getFilteredData(tableAData), VARIANT.rightColumns, { tableKey: 'tableA', selectedIds: selectedAIds });
        showSuccessModal('บันทึกการปรับข้อมูลสำเร็จ');
        return;
    }

<<<<<<< HEAD
    $.requestAjax({
        service: 'Verify/SaveAdjustment',
=======
    var denomValue = document.getElementById('adjDenomination')?.value || '';
    var seriesValue = document.getElementById('adjType')?.value || '';
    var adjustType = (direction === 'add') ? 'ADD' : 'DEC';
    var isAddon = (type === 'addon');
    var isEndjam = (type === 'entjam');

    $.requestAjax({
        service: 'AutoSelling/SaveAdjustment',
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        type: 'POST',
        parameter: {
            HeaderCardCode: selectedRightRow.HeaderCardCode,
            Direction: direction,
            Type: type,
            Qty: qty,
<<<<<<< HEAD
            Remark: remark
=======
            Remark: remark,
            DenominationPrice: denomValue ? parseInt(denomValue) : null,
            SeriesDenomCode: seriesValue || null,
            AdjustType: adjustType,
            IsMachineResult: false,
            IsAddon: isAddon,
            IsEndjam: isEndjam
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                showSuccessModal('บันทึกการปรับข้อมูลสำเร็จ');
                refreshData();
            } else {
                showVerifyError(response?.msg_desc || 'บันทึกไม่สำเร็จ');
            }
        },
        onError: function () {
            showVerifyError('เกิดข้อผิดพลาดในการบันทึก');
        }
    });
}

// ============ Refresh ============
function refreshData() {
    selected1Ids = [];
    selected2Ids = [];
    selectedAIds = [];
    selectedBIds = [];
    selectedCIds = [];
    hideDetailAndAdjustment();
    if (USE_MOCK_DATA) {
        loadMockData();
        return;
    }
    initPage();
}

<<<<<<< HEAD
// ============ API Calls (placeholder) ============
async function loadAllData() {
    try {
        // TODO: Call backend APIs when available
=======
// ============ Offset Logic — Header Card ต่อเนื่อง (tableA) ============
function areConsecutiveHeaderCards(items) {
    if (!items || items.length < 2) return false;
    var sorted = items.slice().sort(function (a, b) {
        return parseInt(a.HeaderCardCode) - parseInt(b.HeaderCardCode);
    });
    for (var i = 1; i < sorted.length; i++) {
        var prev = parseInt(sorted[i - 1].HeaderCardCode);
        var curr = parseInt(sorted[i].HeaderCardCode);
        if (isNaN(prev) || isNaN(curr) || curr - prev !== 1) return false;
    }
    return true;
}

function areSameCountingFile(items) {
    if (!items || items.length < 2) return false;
    var firstDate = items[0].CountingDate ? items[0].CountingDate.split('T')[0] : '';
    return items.every(function (item) {
        var d = item.CountingDate ? item.CountingDate.split('T')[0] : '';
        return d === firstDate;
    });
}

function validateOffset(items) {
    if (!items || items.length < 2) {
        return { valid: false, reason: 'ต้องเลือกอย่างน้อย 2 รายการ' };
    }
    if (!areConsecutiveHeaderCards(items)) {
        return { valid: false, reason: 'Header Card ต้องเป็นเลขต่อเนื่องกัน' };
    }
    if (!areSameCountingFile(items)) {
        return { valid: false, reason: 'ต้องอยู่ในไฟล์นับคัดเดียวกัน' };
    }
    return { valid: true, reason: '' };
}

// ============ Merge Logic — รวมมัด (tableA เท่านั้น) ============
function openMergeModal(tableKey) {
    if (tableKey !== 'tableA') {
        showVerifyError('การรวมมัดใช้ได้เฉพาะตาราง "มัดขาด-เกิน" เท่านั้น');
        return;
    }
    if (selectedAIds.length !== 2) {
        showVerifyError('กรุณาเลือกรายการ 2 รายการเท่านั้น เพื่อรวมมัด');
        return;
    }

    var items = tableAData.filter(function (item) {
        return selectedAIds.indexOf(item.Id) !== -1;
    });

    var offsetCheck = validateOffset(items);
    if (!offsetCheck.valid) {
        showVerifyError(offsetCheck.reason);
        return;
    }

    if (USE_MOCK_DATA) {
        var keepItem = items[0];
        var removeItem = items[1];
        keepItem.Qty += removeItem.Qty;
        keepItem.TotalValue = keepItem.Qty * keepItem.DenominationPrice;
        keepItem.IsEdited = true;

        tableAData = tableAData.filter(function (x) { return x.Id !== removeItem.Id; });
        selectedAIds = [keepItem.Id];

        renderAllTables();
        showSuccessModal('รวมมัดสำเร็จ');
        return;
    }

    // TODO: Call backend API for merge
    $.requestAjax({
        service: 'AutoSelling/MergeBundles',
        type: 'POST',
        parameter: {
            KeepId: items[0].Id,
            MergeId: items[1].Id
        },
        enableLoader: true,
        onSuccess: function (response) {
            if (response && response.is_success) {
                showSuccessModal('รวมมัดสำเร็จ');
                refreshData();
            } else {
                showVerifyError(response?.msg_desc || 'รวมมัดไม่สำเร็จ');
            }
        },
        onError: function () {
            showVerifyError('เกิดข้อผิดพลาดในการรวมมัด');
        }
    });
}

// ============ สรุปรายการทั้งหมด — Validate ก่อนไป Verify ============
function openSummaryValidated() {
    // เช็คว่ามีรายการจาก tableA/tableB/tableC ถูกเลือกอยู่ไหม
    if (selectedAIds.length > 0 || selectedBIds.length > 0 || selectedCIds.length > 0) {
        showVerifyError('ยังพบมัดธนบัตร ขาด-เกิน');
        return;
    }

    var leftItems = getAllCheckedLeftItems();
    if (leftItems.length === 0) {
        showVerifyError('กรุณาเลือกรายการอย่างน้อย 1 รายการ');
        return;
    }

    // เช็ค status — ต้องเป็น Auto Selling หรือ Approved เท่านั้น
    var invalidStatusItems = leftItems.filter(function (item) {
        var s = (item.Status || '').toLowerCase();
        return s !== 'auto selling' && s !== 'approved' && s !== 'อนุมัติ';
    });
    if (invalidStatusItems.length > 0) {
        showVerifyError('ไม่สามารถดูสรุปรายการทั้งหมดได้\nเนื่องจากมีรายการที่สถานะไม่ใช่ Auto Selling หรือ Approved');
        return;
    }

    // ดึง detail ทั้งหมดก่อนไปหน้า Verify Confirmation (ไม่ต้องเรียก API ซ้ำ)
    var headerCards = leftItems.map(function (item) { return item.HeaderCardCode; });
    var selectedIds = leftItems.map(function (item) { return item.Id; });

    $.enablePageLoader();
    var allDetailRows = [];
    var completed = 0;
    var totalCalls = headerCards.length;
    var hasError = false;

    headerCards.forEach(function (hc) {
        $.ajax({
            url: rootPath + 'AutoSelling/GetAutoSellingDetail',
            type: 'GET',
            data: { headerCardCode: hc },
            dataType: 'json',
            success: function (response) {
                if (response && response.is_success && response.data) {
                    var rows = response.data.rows || response.data.Rows || [];
                    rows.forEach(function (row) {
                        allDetailRows.push({
                            DenominationPrice: pick(row, 'denominationPrice', 'DenominationPrice', 0),
                            Type: pick(row, 'type', 'Type', '-'),
                            Series: pick(row, 'typeNum', 'TypeNum', null),
                            Qty: pick(row, 'qty', 'Qty', 0),
                            Shortage: 0,
                            Excess: 0
                        });
                    });
                }
            },
            error: function () { hasError = true; },
            complete: function () {
                completed++;
                if (completed >= totalCalls) {
                    $.disablePageLoader();
                    if (hasError) {
                        showVerifyError('เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด');
                        return;
                    }
                    // เก็บทุกอย่างลง localStorage แล้วไปหน้า Verify Confirmation
                    localStorage.setItem('verifyData', JSON.stringify({
                        summaryIds: selectedIds,
                        detailRows: allDetailRows,
                        selected1Ids: selected1Ids,
                        selected2Ids: selected2Ids
                    }));
                    window.location.href = rootPath + 'AutoSelling/VerifyConfirmation';
                }
            }
        });
    });
}

// ============ API Calls ============

// Pick value from object supporting both camelCase and PascalCase keys
// Uses != null check (not ||) so 0 and false are preserved correctly
function pick(obj, camelKey, pascalKey, fallback) {
    var val = obj[camelKey];
    if (val != null) return val;
    val = obj[pascalKey];
    if (val != null) return val;
    return fallback;
}

// Map API detail row → PascalCase (used by JS render)
function mapApiDetailRow(row) {
    return {
        HeaderCardCode: pick(row, 'headerCardCode', 'HeaderCardCode', '-'),
        Bank: pick(row, 'bank', 'Bank', '-'),
        Cashpoint: pick(row, 'cashpoint', 'Cashpoint', '-'),
        DenominationPrice: pick(row, 'denominationPrice', 'DenominationPrice', 0),
        Type: pick(row, 'type', 'Type', '-'),
        TypeNum: pick(row, 'typeNum', 'TypeNum', 0),
        Qty: pick(row, 'qty', 'Qty', 0),
        TotalValue: pick(row, 'totalValue', 'TotalValue', 0)
    };
}

// Map API item → PascalCase (used by JS render)
function mapApiItem(item) {
    return {
        Id: pick(item, 'id', 'Id', 0),
        HeaderCardCode: pick(item, 'headerCardCode', 'HeaderCardCode', '-'),
        Bank: pick(item, 'bank', 'Bank', '-'),
        Zone: pick(item, 'zone', 'Zone', '-'),
        Cashpoint: pick(item, 'cashpoint', 'Cashpoint', '-'),
        DenominationPrice: pick(item, 'denominationPrice', 'DenominationPrice', 0),
        CountingDate: pick(item, 'countingDate', 'CountingDate', null),
        Qty: pick(item, 'qty', 'Qty', 0),
        TotalValue: pick(item, 'totalValue', 'TotalValue', 0),
        Status: pick(item, 'status', 'Status', '-'),
        IsEdited: pick(item, 'isEdited', 'IsEdited', false),
        ExcessQty: pick(item, 'excessQty', 'ExcessQty', 0),
        SeriesDenomId: pick(item, 'seriesDenomId', 'SeriesDenomId', null),
        ShiftId: pick(item, 'shiftId', 'ShiftId', null),
        ShiftName: pick(item, 'shiftName', 'ShiftName', null)
    };
}

async function loadAllData() {
    try {
        $.requestAjax({
            service: 'AutoSelling/GetAutoSellingData',
            type: 'POST',
            parameter: {},
            enableLoader: true,
            onSuccess: function (response) {
                if (response && response.is_success && response.data) {
                    var d = response.data;
                    table1Data = (d.table1 || d.Table1 || []).map(mapApiItem);
                    table2Data = (d.table2 || d.Table2 || []).map(mapApiItem);
                    tableAData = (d.tableA || d.TableA || []).map(mapApiItem);
                    tableBData = (d.tableB || d.TableB || []).map(mapApiItem);
                    tableCData = (d.tableC || d.TableC || []).map(mapApiItem);
                    // Restore checkbox selections จาก localStorage (กลับจาก VerifyConfirmation)
                    restoreSelections();
                    renderAllTables();
                    populateFilterDropdowns();
                } else {
                    console.warn('GetAutoSellingData: no data', response);
                }
            },
            onError: function () {
                console.error('GetAutoSellingData failed');
            }
        });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    } catch (err) {
        console.error('loadAllData error:', err);
    }
}

// ============ Navigation ============
function openSecondScreen() {
    // TODO: Open second screen
}

function openPrintData() {
    showPrintReportModal();
}

function openManualKeyIn() {
<<<<<<< HEAD
    // TODO: Open manual key-in flow
}

function openSummary() {
    // TODO: Open summary page
}

// ============ Edit Modal Flow ============
=======
    window.location.href = '/AutoSelling/ManualKeyIn';
}

function openSummary() {
    openSummaryValidated();
}

// ============ Edit → Navigate to Manual Key-in ============
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function openEditModal(id) {
    var item = findItemById(id);
    if (!item) return;

<<<<<<< HEAD
=======
    window.location.href = '/AutoSelling/ManualKeyIn?headerCardCode=' + encodeURIComponent(item.HeaderCardCode) + '&mode=edited';
    return;

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    editFlowData = { id: id, item: item };

    document.getElementById('editFormVerifyTranId').value = id;
    document.getElementById('editFormOldHc').value = item.HeaderCardCode;
    document.getElementById('editFormIsAlert').value = '0';

    BssModal.hideInlineError('editFormError');

    var modal = new bootstrap.Modal(document.getElementById('editFormModal'));
    modal.show();
}

function submitEditForm() {
    var newHc = document.getElementById('editFormNewHc')?.value;
    if (!newHc) {
        BssModal.showInlineError('editFormError');
        return;
    }
    BssModal.hideInlineError('editFormError');

    var reviewData = getMockEditReviewData(editFlowData.item, newHc, false, null);
    populateEditReviewTable(reviewData);

    BssModal.chain('editFormModal', function () {
        BssModal.setStep('editReviewModal', 'editReviewStepA');
        var modal = new bootstrap.Modal(document.getElementById('editReviewModal'));
        modal.show();
    });
}

function submitEditAlertForm() {
    var newHc1 = document.getElementById('editAlertNewHc1')?.value;
    var newHc2 = document.getElementById('editAlertNewHc2')?.value;
    if (!newHc1 || !newHc2) {
        BssModal.showInlineError('editAlertFormError');
        return;
    }
    BssModal.hideInlineError('editAlertFormError');

    var reviewData = getMockEditReviewData(editFlowData.item, newHc1, true, newHc2);
    populateEditReviewTable(reviewData);

    BssModal.chain('editAlertFormModal', function () {
        BssModal.setStep('editReviewModal', 'editReviewStepA');
        var modal = new bootstrap.Modal(document.getElementById('editReviewModal'));
        modal.show();
    });
}

function populateEditReviewTable(reviewData) {
    BssDom.setText('editReviewSubtitle', 'เตรียมแก้ไขข้อมูล ' + reviewData.length + ' รายการ');

    var tbody = document.getElementById('editReviewTableBody');
    if (!tbody) return;
    tbody.innerHTML = reviewData.map(function (row, idx) {
        var warningIcon = row.hasWarning ? '<i class="bi bi-exclamation-triangle-fill text-warning"></i>' : '';
        return '<tr>' +
            '<td>' + (idx + 1) + '</td>' +
            '<td>' + warningIcon + '</td>' +
            '<td>' + row.oldHc + '</td>' +
            '<td>' + row.newHc + '</td>' +
            '<td>' + BssFormat.denomBadgeHtml(row.denomPrice) + '</td>' +
            '<td>' + row.containerBarcode + '</td>' +
            '<td>' + row.preparer + '</td>' +
            '<td>' + row.source + '</td>' +
            '</tr>';
    }).join('');
}

function confirmEditReview() {
    var remark = document.getElementById('editReviewRemark')?.value?.trim();
    if (!remark) {
        BssModal.showInlineError('editReviewRemarkError');
        return;
    }
    BssModal.hideInlineError('editReviewRemarkError');
    editFlowData.remark = remark;

    BssModal.setStep('editReviewModal', 'editReviewStepB');
}

function confirmEditSupervisorOtp() {
    BssModal.setStep('editReviewModal', 'editReviewStepC');
}

function confirmEditManagerOtp() {
    BssModal.chain('editReviewModal', function () {
        showSuccessModal('แก้ไขข้อมูลสำเร็จ');
    });
}

// ============ Cancel Send Modal Flow — Figma 2:31555, 2:31581, 2:31610 ============
var cancelSendData = {};

function openCancelSendModal(id) {
    var item = findItemById(id);
    if (!item) return;

    cancelSendData = { id: id, item: item };

    // Populate Step A info
    document.getElementById('cancelInfoHc').textContent = item.HeaderCardCode || '-';
    document.getElementById('cancelInfoDenom').innerHTML = BssFormat.denomBadgeHtml(item.DenominationPrice);
    document.getElementById('cancelInfoQty').textContent = BssFormat.numberWithCommas(item.Qty);
    document.getElementById('cancelManagerSelect').value = '';
    BssModal.hideInlineError('cancelManagerError');

    BssModal.setStep('cancelSendModal', 'cancelStepA');
    var modal = new bootstrap.Modal(document.getElementById('cancelSendModal'));
    modal.show();
}

function confirmCancelSendA() {
    var managerSelect = document.getElementById('cancelManagerSelect');
    if (!managerSelect.value) {
        BssModal.showInlineError('cancelManagerError');
        return;
    }
    BssModal.hideInlineError('cancelManagerError');

    var managerText = managerSelect.options[managerSelect.selectedIndex].text;
    cancelSendData.managerId = managerSelect.value;
    cancelSendData.managerName = managerText;

    // Populate Step B info
    var item = cancelSendData.item;
    document.getElementById('cancelConfirmHc').textContent = item.HeaderCardCode || '-';
    document.getElementById('cancelConfirmDenom').innerHTML = BssFormat.denomBadgeHtml(item.DenominationPrice);
    document.getElementById('cancelConfirmQty').textContent = BssFormat.numberWithCommas(item.Qty);
    document.getElementById('cancelConfirmManager').textContent = managerText;

<<<<<<< HEAD
    // Reset OTP step
    resetOtpStep();

    BssModal.setStep('cancelSendModal', 'cancelStepB');
=======
    BssModal.setStep('cancelSendModal', 'cancelStepB');
    sendCancelOtp(); // ยิง API ขอ OTP อัตโนมัติเมื่อเปิด Step OTP
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

// ── OTP State ──
var otpTimerInterval = null;
<<<<<<< HEAD
var MOCK_OTP = '123456';

function resetOtpStep() {
    document.getElementById('cancelOtpInput').value = '';
    document.getElementById('cancelOtpInput').disabled = true;
    document.getElementById('btnSendOtp').style.display = '';
    document.getElementById('btnSendOtp').disabled = false;
    document.getElementById('btnConfirmOtp').disabled = true;
    document.getElementById('otpSentMsg').style.display = 'none';
    document.getElementById('otpResendRow').style.display = 'none';
    BssModal.hideInlineError('cancelOtpError');
    if (otpTimerInterval) { clearInterval(otpTimerInterval); otpTimerInterval = null; }
}

function sendCancelOtp() {
    // Mock: "send" OTP
    document.getElementById('btnSendOtp').style.display = 'none';
    document.getElementById('cancelOtpInput').disabled = false;
    document.getElementById('cancelOtpInput').value = '';
    document.getElementById('cancelOtpInput').focus();
    document.getElementById('btnConfirmOtp').disabled = true;
    document.getElementById('otpSentMsg').style.display = '';
    document.getElementById('otpResendRow').style.display = '';

    // Listen for input — enable confirm only when 6 digits
    document.getElementById('cancelOtpInput').oninput = function () {
        document.getElementById('btnConfirmOtp').disabled = this.value.trim().length < 6;
    };

    // Start 5-min countdown for resend
    startOtpTimer();
    console.log('[Mock] OTP sent — correct code is 123456');
=======

function sendCancelOtp() {
    if (otpTimerInterval) { clearInterval(otpTimerInterval); otpTimerInterval = null; }
    BssModal.hideInlineError('cancelOtpError');
    otp.send({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        userReceiveId: parseInt(cancelSendData.managerId),
        bssMailSystemTypeCode: 'VERIFY_CANCEL_SEND'
    }).done(function (data) {
        cancelSendData.refCode = data.refCode;
        document.getElementById('btnSendOtp').style.display = 'none';
        document.getElementById('cancelOtpInput').disabled = false;
        document.getElementById('cancelOtpInput').value = '';
        document.getElementById('cancelOtpInput').focus();
        document.getElementById('otpSentMsg').style.display = '';
        document.getElementById('otpResendRow').style.display = '';
        startOtpTimer();
    }).fail(function () {
        BssModal.chain('cancelSendModal', function () {
            document.getElementById('verifyErrorMessage').textContent = 'ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่';
            new bootstrap.Modal(document.getElementById('verifyErrorModal')).show();
        });
    });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function startOtpTimer() {
    var btnResend = document.getElementById('btnResendOtp');
    var timerEl = document.getElementById('otpTimer');
    btnResend.disabled = true;
    var remaining = 5 * 60; // 5 minutes

    function updateTimer() {
        var min = Math.floor(remaining / 60);
        var sec = remaining % 60;
        timerEl.textContent = 'ส่งอีกครั้งได้ภายใน ' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + ' นาที';
        if (remaining <= 0) {
            clearInterval(otpTimerInterval);
            otpTimerInterval = null;
            btnResend.disabled = false;
            timerEl.textContent = '';
        }
        remaining--;
    }
    updateTimer();
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    otpTimerInterval = setInterval(updateTimer, 1000);
}

function confirmCancelSendB() {
<<<<<<< HEAD
    var otp = document.getElementById('cancelOtpInput').value.trim();
    if (!otp || otp.length < 6) {
=======
    var otpVal = document.getElementById('cancelOtpInput').value.trim();
    var errEl = document.getElementById('cancelOtpError');
    if (!otpVal) {
        if (errEl) errEl.textContent = 'กรุณากรอกรหัส OTP';
        BssModal.showInlineError('cancelOtpError');
        return;
    }
    if (!/^\d{6}$/.test(otpVal)) {
        if (errEl) errEl.textContent = 'รหัส OTP ไม่ถูกต้อง กรุณากรอกตัวเลข 6 หลัก';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        BssModal.showInlineError('cancelOtpError');
        return;
    }
    BssModal.hideInlineError('cancelOtpError');

<<<<<<< HEAD
    if (otp !== MOCK_OTP) {
        // Wrong OTP → show error modal
        BssModal.chain('cancelSendModal', function () {
            document.getElementById('verifyErrorMessage').textContent = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
            var errorModal = new bootstrap.Modal(document.getElementById('verifyErrorModal'));
            errorModal.show();
        });
        return;
    }

    // Correct OTP → remove item from data + success
    if (otpTimerInterval) { clearInterval(otpTimerInterval); otpTimerInterval = null; }

    var removeId = cancelSendData.id;
    removeItemFromTables(removeId);

    BssModal.chain('cancelSendModal', function () {
        document.getElementById('successMessage').textContent = 'Cancel Send สำเร็จ';
        var successModal = new bootstrap.Modal(document.getElementById('verifySuccessModal'));
        successModal.show();
=======
    otp.verify({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        bssMailSystemTypeCode: 'VERIFY_CANCEL_SEND',
        bssMailOtpCode: otpVal,
        bssMailRefCode: cancelSendData.refCode
    }).done(function () {
        if (otpTimerInterval) { clearInterval(otpTimerInterval); otpTimerInterval = null; }
        $.requestAjax({
            service: 'AutoSelling/CancelSend',
            type: 'POST',
            parameter: {
                Ids: [cancelSendData.id],
                ManagerId: parseInt(cancelSendData.managerId) || 0
            },
            onSuccess: function (response) {
                if (response && response.is_success && response.data && response.data.isSuccess) {
                    removeItemFromTables(cancelSendData.id);
                    BssModal.chain('cancelSendModal', function () {
                        document.getElementById('successMessage').textContent = 'Cancel Send สำเร็จ';
                        new bootstrap.Modal(document.getElementById('verifySuccessModal')).show();
                    });
                } else {
                    BssModal.chain('cancelSendModal', function () {
                        document.getElementById('verifyErrorMessage').textContent =
                            (response && response.data && response.data.message) || 'Cancel Send ไม่สำเร็จ';
                        new bootstrap.Modal(document.getElementById('verifyErrorModal')).show();
                    });
                }
            }
        });
    }).fail(function (err) {
        var errEl = document.getElementById('cancelOtpError');
        if (errEl) errEl.textContent = otp.mapError(err);
        BssModal.showInlineError('cancelOtpError');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    });
}

function removeItemFromTables(id) {
    table1Data = table1Data.filter(function (x) { return x.Id !== id; });
    table2Data = table2Data.filter(function (x) { return x.Id !== id; });
    tableAData = tableAData.filter(function (x) { return x.Id !== id; });
    tableBData = tableBData.filter(function (x) { return x.Id !== id; });
    tableCData = tableCData.filter(function (x) { return x.Id !== id; });

    // Remove from selected arrays
    [selected1Ids, selected2Ids, selectedAIds, selectedBIds, selectedCIds].forEach(function (arr) {
        var idx = arr.indexOf(id);
        if (idx !== -1) arr.splice(idx, 1);
    });

    // Re-render + hide detail if deleted item was selected
    renderAllTables();
    if ((selectedRightRow && selectedRightRow.Id === id) || (selectedLeftRow && selectedLeftRow.Id === id)) {
        selectedRightRow = null;
        selectedLeftRow = null;
        hideDetailAndAdjustment();
    }
}

// ============ Header Action Dropdown ============
function toggleHeaderDropdown(btn) {
    var menu = btn.parentElement.querySelector('.header-action-menu');
    var isOpen = menu.classList.contains('open');
    // Close all other dropdowns first
    document.querySelectorAll('.header-action-menu.open').forEach(function (m) { m.classList.remove('open'); });
    if (!isOpen) menu.classList.add('open');
}
<<<<<<< HEAD
=======

function updateHeaderActionButtons() {
    document.querySelectorAll('.header-action-dropdown').forEach(function (dropdown) {
        var container = dropdown.closest('.table-container');
        var table = container ? container.querySelector('table.verify-table') : null;
        var tableKey = table ? table.id : null;

        if (tableKey === activeTableKey) {
            dropdown.style.display = '';
        } else {
            dropdown.style.display = 'none';
        }
    });
}
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
function closeHeaderDropdown(item) {
    var menu = item.closest('.header-action-menu');
    if (menu) menu.classList.remove('open');
}
// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.header-action-dropdown')) {
        document.querySelectorAll('.header-action-menu.open').forEach(function (m) { m.classList.remove('open'); });
    }
});

// ============ Shift Modal ============
var shiftFlowData = {};
var shiftOtpTimerInterval = null;

function openShiftModal(tableKey) {
    // Get selected IDs and data for the table
    var selectedIds, tableData;
    switch (tableKey) {
        case 'table1': selectedIds = selected1Ids; tableData = table1Data; break;
        case 'table2': selectedIds = selected2Ids; tableData = table2Data; break;
        case 'tableA': selectedIds = selectedAIds; tableData = tableAData; break;
        case 'tableB': selectedIds = selectedBIds; tableData = tableBData; break;
        case 'tableC': selectedIds = selectedCIds; tableData = tableCData; break;
        default: return;
    }

    if (!selectedIds || selectedIds.length === 0) {
        showVerifyError('กรุณาเลือกรายการในตารางก่อน');
        return;
    }

    var items = tableData.filter(function (item) {
        return selectedIds.indexOf(item.Id) !== -1;
    });

    shiftFlowData = { tableKey: tableKey, items: items };
    sortStates.shiftTable = BssSort.createState();
    renderShiftItemsTable();

    // Reset form
<<<<<<< HEAD
    document.getElementById('shiftTimeSelect').value = 'morning';
=======
    document.getElementById('shiftTimeSelect').value = '';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    document.getElementById('shiftVerifierSelect').value = '';
    BssModal.hideInlineError('shiftVerifierError');
    BssModal.setStep('shiftModal', 'shiftStepA');
    var modal = new bootstrap.Modal(document.getElementById('shiftModal'));
    modal.show();
}

function renderShiftItemsTable() {
    var items = shiftFlowData.items || [];
    var state = sortStates.shiftTable;
    if (state && state.column) {
        items = items.slice().sort(function (a, b) {
            var valA = (a[state.column] || '').toString();
            var valB = (b[state.column] || '').toString();
            if (state.column === 'Shift') {
<<<<<<< HEAD
                valA = a.Shift || 'บ่าย';
                valB = b.Shift || 'บ่าย';
=======
                valA = a.ShiftName || '-';
                valB = b.ShiftName || '-';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            }
            var cmp = valA.localeCompare(valB, 'th');
            return state.direction === 'desc' ? -cmp : cmp;
        });
    }
    var tbody = document.getElementById('shiftItemsBody');
    tbody.innerHTML = '';
    items.forEach(function (item) {
        var tr = document.createElement('tr');
<<<<<<< HEAD
        var shiftText = item.Shift || 'บ่าย';
=======
        var shiftText = item.ShiftName || '-';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        tr.innerHTML = '<td>' + (item.HeaderCardCode || '-') + '</td>'
            + '<td>' + shiftText + '</td>';
        tbody.appendChild(tr);
    });
}

function sortShiftTable(column) {
    BssSort.toggle(sortStates.shiftTable, column);
    BssSort.updateIcons(sortStates.shiftTable, '#shiftItemsTable thead th', 'shiftSort_');
    renderShiftItemsTable();
}

function renderShiftConfirmTable() {
    var items = shiftFlowData.items || [];
    var state = sortStates.shiftConfirm;
    if (state && state.column) {
        items = items.slice().sort(function (a, b) {
            var valA = (a[state.column] || '').toString();
            var valB = (b[state.column] || '').toString();
            if (state.column === 'Shift') {
<<<<<<< HEAD
                valA = a.Shift || 'บ่าย';
                valB = b.Shift || 'บ่าย';
=======
                valA = a.ShiftName || '-';
                valB = b.ShiftName || '-';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            }
            var cmp = valA.localeCompare(valB, 'th');
            return state.direction === 'desc' ? -cmp : cmp;
        });
    }
    var tbody = document.getElementById('shiftConfirmBody');
    tbody.innerHTML = '';
    items.forEach(function (item) {
        var tr = document.createElement('tr');
<<<<<<< HEAD
        var shiftText = item.Shift || 'บ่าย';
=======
        var shiftText = item.ShiftName || '-';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        tr.innerHTML = '<td>' + (item.HeaderCardCode || '-') + '</td>'
            + '<td>' + shiftText + '</td>';
        tbody.appendChild(tr);
    });
}

function sortShiftConfirmTable(column) {
    BssSort.toggle(sortStates.shiftConfirm, column);
    BssSort.updateIcons(sortStates.shiftConfirm, '#shiftConfirmTable thead th', 'shiftConfirmSort_');
    renderShiftConfirmTable();
}

function confirmShiftA() {
<<<<<<< HEAD
=======
    var shiftEl = document.getElementById('shiftTimeSelect');
    if (!shiftEl.value) {
        showVerifyError('กรุณาเลือก Shift');
        return;
    }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    var verifierSelect = document.getElementById('shiftVerifierSelect');
    if (!verifierSelect.value) {
        BssModal.showInlineError('shiftVerifierError');
        return;
    }
    BssModal.hideInlineError('shiftVerifierError');

    var shiftSelect = document.getElementById('shiftTimeSelect');
    var shiftValue = shiftSelect.value;
    var shiftLabel = shiftSelect.options[shiftSelect.selectedIndex].text;
    var verifierText = verifierSelect.options[verifierSelect.selectedIndex].text;

    shiftFlowData.shift = shiftValue;
    shiftFlowData.shiftLabel = shiftLabel;
    shiftFlowData.verifierId = verifierSelect.value;
    shiftFlowData.verifierName = verifierText;

    // Populate confirm table (same as Step A) with fresh sort state
    sortStates.shiftConfirm = BssSort.createState();
    renderShiftConfirmTable();

<<<<<<< HEAD
    resetShiftOtp();
    BssModal.setStep('shiftModal', 'shiftStepB');
}

function resetShiftOtp() {
    document.getElementById('shiftOtpInput').value = '';
    document.getElementById('shiftOtpInput').disabled = true;
    document.getElementById('btnShiftSendOtp').style.display = '';
    document.getElementById('btnShiftSendOtp').disabled = false;
    document.getElementById('btnShiftConfirmOtp').disabled = true;
    document.getElementById('shiftOtpSentMsg').style.display = 'none';
    document.getElementById('shiftOtpResendRow').style.display = 'none';
    BssModal.hideInlineError('shiftOtpError');
    if (shiftOtpTimerInterval) { clearInterval(shiftOtpTimerInterval); shiftOtpTimerInterval = null; }
}

function sendShiftOtp() {
    document.getElementById('btnShiftSendOtp').style.display = 'none';
    document.getElementById('shiftOtpInput').disabled = false;
    document.getElementById('shiftOtpInput').value = '';
    document.getElementById('shiftOtpInput').focus();
    document.getElementById('btnShiftConfirmOtp').disabled = true;
    document.getElementById('shiftOtpSentMsg').style.display = '';
    document.getElementById('shiftOtpResendRow').style.display = '';

    document.getElementById('shiftOtpInput').oninput = function () {
        document.getElementById('btnShiftConfirmOtp').disabled = this.value.trim().length < 6;
    };

    startShiftOtpTimer();
    console.log('[Mock] Shift OTP sent — correct code is 123456');
=======
    BssModal.setStep('shiftModal', 'shiftStepB');
    sendShiftOtp(); // ยิง API ขอ OTP อัตโนมัติเมื่อเปิด Step OTP
}

function sendShiftOtp() {
    if (shiftOtpTimerInterval) { clearInterval(shiftOtpTimerInterval); shiftOtpTimerInterval = null; }
    BssModal.hideInlineError('shiftOtpError');
    otp.send({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        userReceiveId: parseInt(shiftFlowData.verifierId),
        bssMailSystemTypeCode: 'VERIFY_CHANGE_SHIFT'
    }).done(function (data) {
        shiftFlowData.refCode = data.refCode;
        document.getElementById('btnShiftSendOtp').style.display = 'none';
        document.getElementById('shiftOtpInput').disabled = false;
        document.getElementById('shiftOtpInput').value = '';
        document.getElementById('shiftOtpInput').focus();
        document.getElementById('shiftOtpSentMsg').style.display = '';
        document.getElementById('shiftOtpResendRow').style.display = '';
        startShiftOtpTimer();
    });
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}

function startShiftOtpTimer() {
    var btnResend = document.getElementById('btnShiftResendOtp');
    var timerEl = document.getElementById('shiftOtpTimer');
    btnResend.disabled = true;
    var remaining = 5 * 60;

    function updateTimer() {
        var min = Math.floor(remaining / 60);
        var sec = remaining % 60;
        timerEl.textContent = 'ส่งอีกครั้งได้ภายใน ' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + ' นาที';
        if (remaining <= 0) {
            clearInterval(shiftOtpTimerInterval);
            shiftOtpTimerInterval = null;
            btnResend.disabled = false;
            timerEl.textContent = '';
        }
        remaining--;
    }
    updateTimer();
    if (shiftOtpTimerInterval) clearInterval(shiftOtpTimerInterval);
    shiftOtpTimerInterval = setInterval(updateTimer, 1000);
}

function confirmShiftB() {
<<<<<<< HEAD
    var otp = document.getElementById('shiftOtpInput').value.trim();
    if (!otp || otp.length < 6) {
=======
    var otpVal = document.getElementById('shiftOtpInput').value.trim();
    var errEl = document.getElementById('shiftOtpError');
    if (!otpVal) {
        if (errEl) errEl.textContent = 'กรุณากรอกรหัส OTP';
        BssModal.showInlineError('shiftOtpError');
        return;
    }
    if (!/^\d{6}$/.test(otpVal)) {
        if (errEl) errEl.textContent = 'รหัส OTP ไม่ถูกต้อง กรุณากรอกตัวเลข 6 หลัก';
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        BssModal.showInlineError('shiftOtpError');
        return;
    }
    BssModal.hideInlineError('shiftOtpError');

<<<<<<< HEAD
    if (otp !== MOCK_OTP) {
        BssModal.chain('shiftModal', function () {
            document.getElementById('verifyErrorMessage').textContent = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
            var errorModal = new bootstrap.Modal(document.getElementById('verifyErrorModal'));
            errorModal.show();
        });
        return;
    }

    if (shiftOtpTimerInterval) { clearInterval(shiftOtpTimerInterval); shiftOtpTimerInterval = null; }
    BssModal.chain('shiftModal', function () {
        document.getElementById('successMessage').textContent = 'เปลี่ยน Shift สำเร็จ';
        var successModal = new bootstrap.Modal(document.getElementById('verifySuccessModal'));
        successModal.show();
=======
    otp.verify({
        userSendId: parseInt(currentUserId),
        userSendDepartmentId: parseInt(currentDepartmentId),
        bssMailSystemTypeCode: 'VERIFY_CHANGE_SHIFT',
        bssMailOtpCode: otpVal,
        bssMailRefCode: shiftFlowData.refCode
    }).done(function () {
        if (shiftOtpTimerInterval) { clearInterval(shiftOtpTimerInterval); shiftOtpTimerInterval = null; }
        var ids = (shiftFlowData.items || []).map(function (i) { return i.Id; });
        $.requestAjax({
            service: 'AutoSelling/ChangeShift',
            type: 'POST',
            parameter: {
                Ids: ids,
                ShiftId: parseInt(shiftFlowData.shift) || 0,
                ManagerId: parseInt(shiftFlowData.verifierId) || 0
            },
            onSuccess: function (response) {
                BssModal.chain('shiftModal', function () {
                    if (response && response.is_success) {
                        showSuccessModal('เปลี่ยน Shift สำเร็จ');
                        loadAllData();
                    } else {
                        showVerifyError((response && response.msg_desc) || 'เปลี่ยน Shift ไม่สำเร็จ');
                    }
                });
            },
            onError: function () {
                BssModal.chain('shiftModal', function () {
                    showVerifyError('เกิดข้อผิดพลาด กรุณาลองใหม่');
                });
            }
        });
    }).fail(function (err) {
        var errEl = document.getElementById('shiftOtpError');
        if (errEl) errEl.textContent = otp.mapError(err);
        BssModal.showInlineError('shiftOtpError');
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    });
}

// ============ Print Report ============
function showPrintReportModal() {
    var content = document.getElementById('reportPreviewContent');
    if (content) content.innerHTML = getMockPrintReportHtml();
    var modal = new bootstrap.Modal(document.getElementById('printReportModal'));
    modal.show();
}

function printReport() {
    window.print();
}

// ============ Modals ============
function showSuccessModal(message) {
    BssModal.showSuccess('verifySuccessModal', 'successMessage', message);
}

function showVerifyError(message) {
    BssModal.showError('verifyErrorModal', 'verifyErrorMessage', message);
}

function closeAllVerifyModals() {
    var allModalIds = [
        'verifySuccessModal', 'verifyErrorModal',
        'editFormModal', 'editAlertFormModal', 'editReviewModal',
        'cancelSendModal', 'shiftModal', 'printReportModal'
    ];
    allModalIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            var inst = bootstrap.Modal.getInstance(el);
            if (inst) inst.hide();
        }
    });
}

// ============ Utilities ============
function sumQty(data) {
    return data.reduce(function (sum, item) { return sum + (item.Qty || 0); }, 0);
}

function findItemById(id) {
    return table1Data.find(function (x) { return x.Id === id; })
        || table2Data.find(function (x) { return x.Id === id; })
        || tableAData.find(function (x) { return x.Id === id; })
        || tableBData.find(function (x) { return x.Id === id; })
        || tableCData.find(function (x) { return x.Id === id; });
}

// ============ Mock Data Generators — Edit Flow ============
function getMockEditReviewData(item, newHc, isAlert, newHc2) {
    var rows = [];
    rows.push({
        oldHc: item.HeaderCardCode || '0054941520',
        newHc: newHc || '0054941521',
        denomPrice: item.DenominationPrice || 1000,
        containerBarcode: 'BK' + String(12345 + item.Id).slice(-5),
        preparer: currentUserFullName || 'นายทดสอบ ระบบ',
        source: 'Machine',
        hasWarning: false
    });

    if (isAlert && newHc2) {
        var mockHc2 = String(parseInt(item.HeaderCardCode) + 1).padStart(10, '0');
        rows.push({
            oldHc: mockHc2,
            newHc: newHc2,
            denomPrice: item.DenominationPrice || 1000,
            containerBarcode: 'BK' + String(12346 + item.Id).slice(-5),
            preparer: currentUserFullName || 'นายทดสอบ ระบบ',
            source: 'Machine',
            hasWarning: true
        });
    }

    return rows;
}

// ============ Mock Data — Print Report ============
function getMockPrintReportHtml() {
    var now = new Date();
    var dateStr = now.getDate() + '/' + (now.getMonth() + 1) + '/' + (now.getFullYear() + 543);
    var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    var item = cancelSendData?.item || { HeaderCardCode: '0054941525', DenominationPrice: 1000 };
    var hc = item.HeaderCardCode;
    var denom = item.DenominationPrice;

    return '<table class="report-mock-table">' +
        '<tr><td colspan="8" class="report-header-text">Auto Selling Report</td></tr>' +
        '<tr><td colspan="8" class="report-subheader-text">' +
        '<strong>Branch:</strong> กรุงเทพฯ &nbsp;&nbsp;' +
        '<strong>Machine:</strong> M7-1 &nbsp;&nbsp;' +
        '<strong>Date:</strong> ' + dateStr + ' ' + timeStr + ' &nbsp;&nbsp;' +
        '<strong>Header Card:</strong> ' + hc +
        '</td></tr>' +
        '<tr><th>รายการ</th><th>Header Card</th><th>ชนิดราคา</th><th>จำนวน (มัด)</th><th>จำนวน (ฉบับ)</th><th>มูลค่า</th><th>ผู้ดำเนินการ</th><th>เหตุผล</th></tr>' +
        '<tr><td>1</td><td style="text-align:center">' + hc + '</td><td style="text-align:center">' + denom + '</td><td>1</td>' +
        '<td>' + BssFormat.numberWithCommas(997) + '</td><td>' + BssFormat.numberWithCommas(997 * denom) + '</td>' +
        '<td style="text-align:left">' + (currentUserFullName || 'นายทดสอบ ระบบ') + '</td>' +
        '<td style="text-align:left">Cancel Send</td></tr>' +
        '<tr style="font-weight:500; background:#e9ecef">' +
        '<td colspan="3" style="text-align:left"><strong>รวม</strong></td>' +
        '<td><strong>1</strong></td><td><strong>' + BssFormat.numberWithCommas(997) + '</strong></td>' +
        '<td><strong>' + BssFormat.numberWithCommas(997 * denom) + '</strong></td><td colspan="2"></td></tr>' +
        '</table>' +
        '<div style="margin-top:24px; text-align:center; color:#6c757d; font-size:12px">' +
        '<p style="margin:0">Printed: ' + dateStr + ' ' + timeStr + '</p>' +
        '<p style="margin:4px 0 0 0">Supervisor: Mock Supervisor &nbsp; | &nbsp; Manager: ' + (cancelSendData?.managerName || 'Mock Manager') + '</p></div>';
}
