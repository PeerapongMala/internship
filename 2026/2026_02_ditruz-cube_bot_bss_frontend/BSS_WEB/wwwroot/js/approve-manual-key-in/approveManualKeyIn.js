/* ============================================
   Approve Manual Key-in — JavaScript
   Handles data loading, filtering, approval/denial workflow
   ============================================ */

// ============ Constants ============
let USE_MOCK_DATA = true; // Toggle with 'm' key
const API_BASE_URL = '/api/ApproveManualKeyIn';

// ============ State ============
let mainTableData = [];
let denominationDetailsData = [];
let selectedHC = null;
let currentFilters = {};

const currentUserId = document.getElementById('currentUserId')?.value || 0;
const currentUserFullName =
  document.getElementById('currentUserFullName')?.value || '';
const currentRoleCode = document.getElementById('currentRoleCode')?.value || '';

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  setupEventListeners();
  setupKeyboardShortcuts();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  renderModeIndicator();
});

function initPage() {
  // Initialize date filters to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('filterDateFrom').value = today;
  document.getElementById('filterDateTo').value = today;

  // Load dropdown options
  loadFilterOptions();

  // Load initial data
  if (USE_MOCK_DATA) {
    loadMockData();
  } else {
    loadMainTableData();
  }
}

function setupEventListeners() {
  // Search button
  document.getElementById('btnSearch').addEventListener('click', handleSearch);

  // Filter enter key
  document.getElementById('filterHC').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Action buttons
  document
    .getElementById('btnApprove')
    .addEventListener('click', () => handleApproveClick());
  document
    .getElementById('btnDeny')
    .addEventListener('click', () => handleDenyClick());

  // Confirm modal action
  document
    .getElementById('btnConfirmAction')
    .addEventListener('click', handleConfirmAction);

  // Success modal auto-dismiss
  const successModal = document.getElementById('successModal');
  successModal.addEventListener('shown.bs.modal', () => {
    setTimeout(() => {
      bootstrap.Modal.getInstance(successModal).hide();
      // Reload data after successful action
      if (!USE_MOCK_DATA) {
        loadMainTableData();
      }
    }, 3000);
  });
}

// ============ Date/Time Display ============
function updateDateTime() {
  // ถ้าอยู่ใน DEMO MODE ไม่อัพเดทเวลา (ใช้ค่า mock ที่ hardcode ใน HTML)
  if (USE_MOCK_DATA) {
    return;
  }

  // LIVE MODE - แสดงเวลาปัจจุบันแบบเรียลไทม์
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear() + 543; // ปี พ.ศ.
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateTimeStr = `${day}/${month}/${year} ${hours}:${minutes}`;
  const headerDateEl = document.getElementById('headerDate');
  if (headerDateEl) {
    headerDateEl.textContent = dateTimeStr;
  }
}

// ============ Filter Options ============
async function loadFilterOptions() {
  // TODO: Load actual dropdown options from backend
  // For now, add empty options (already in HTML)

  if (USE_MOCK_DATA) {
    // Mock machine options
    const machineSelect = document.getElementById('filterMachine');
    machineSelect.innerHTML =
      '<option value="">ทั้งหมด</option><option value="1">M7-001</option><option value="2">M7-002</option>';

    // Mock BnType options
    const bnTypeSelect = document.getElementById('filterBnType');
    bnTypeSelect.innerHTML =
      '<option value="">ทั้งหมด</option><option value="1">Unfit</option><option value="2">Unsort CC</option>';

    // Mock User options
    const userSelect = document.getElementById('filterUser');
    userSelect.innerHTML =
      '<option value="">ทั้งหมด</option><option value="1">สมชาย ใจดี</option><option value="2">สมหญิง รักงาน</option>';
  }
}

// ============ Search & Filters ============
function handleSearch() {
  currentFilters = {
    headerCardCode: document.getElementById('filterHC').value.trim(),
    statusId: document.getElementById('filterStatus').value,
    shiftId: document.getElementById('filterShift').value,
    machineId: document.getElementById('filterMachine').value,
    bnTypeId: document.getElementById('filterBnType').value,
    dateFrom: document.getElementById('filterDateFrom').value,
    dateTo: document.getElementById('filterDateTo').value,
    userId: document.getElementById('filterUser').value,
  };

  if (USE_MOCK_DATA) {
    loadMockData();
  } else {
    loadMainTableData();
  }
}

// ============ Data Loading ============
async function loadMainTableData() {
  $.enablePageLoader();
  try {
    const requestBody = {
      pageNumber: 1,
      pageSize: 100,
      filter: currentFilters,
    };

    const response = await fetch(`${API_BASE_URL}/GetApprovalList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        RequestVerificationToken: document.querySelector(
          'input[name="__RequestVerificationToken"]',
        ).value,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.is_success && result.data) {
      mainTableData = result.data.items || [];
      renderMainTable();
    } else {
      console.error('Failed to load data:', result.message);
      showErrorMessage('ไม่สามารถโหลดข้อมูลได้');
    }
  } catch (error) {
    console.error('Error loading data:', error);
    showErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล');
  } finally {
    $.disablePageLoader();
  }
}

function loadMockData() {
  const mockRecords = [
    {
      headerCardId: 1,
      headerCardCode: 'HC-2026-001',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 2 * 3600000).toISOString(),
      createdByName: 'สมชาย ใจดี',
      machineName: 'M7-001',
      shiftName: 'กะเช้า',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 1000,
      totalValue: 20000.0,
    },
    {
      headerCardId: 2,
      headerCardCode: 'HC-2026-002',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 3 * 3600000).toISOString(),
      createdByName: 'สมหญิง รักงาน',
      machineName: 'M7-002',
      shiftName: 'กะเช้า',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 500,
      totalValue: 50000.0,
    },
    {
      headerCardId: 3,
      headerCardCode: 'HC-2026-003',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 5 * 3600000).toISOString(),
      createdByName: 'ประเสริฐ มานะดี',
      machineName: 'M7-001',
      shiftName: 'กะบ่าย',
      statusId: 16,
      statusName: 'Approved',
      totalQuantity: 750,
      totalValue: 75000.0,
    },
    {
      headerCardId: 4,
      headerCardCode: 'HC-2026-004',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 6 * 3600000).toISOString(),
      createdByName: 'วิไล สุขใจ',
      machineName: 'M7-002',
      shiftName: 'กะบ่าย',
      statusId: 25,
      statusName: 'Denied',
      totalQuantity: 300,
      totalValue: 6000.0,
    },
    {
      headerCardId: 5,
      headerCardCode: 'HC-2026-005',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 8 * 3600000).toISOString(),
      createdByName: 'ชาคริต วงศ์ดี',
      machineName: 'M7-001',
      shiftName: 'กะดึก',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 1250,
      totalValue: 125000.0,
    },
    {
      headerCardId: 6,
      headerCardCode: 'HC-2026-006',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 10 * 3600000).toISOString(),
      createdByName: 'อรุณี ใจงาม',
      machineName: 'M7-002',
      shiftName: 'กะเช้า',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 850,
      totalValue: 42500.0,
    },
    {
      headerCardId: 7,
      headerCardCode: 'HC-2026-007',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 12 * 3600000).toISOString(),
      createdByName: 'สมชาย ใจดี',
      machineName: 'M7-001',
      shiftName: 'กะบ่าย',
      statusId: 16,
      statusName: 'Approved',
      totalQuantity: 920,
      totalValue: 46000.0,
    },
    {
      headerCardId: 8,
      headerCardCode: 'HC-2026-008',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 15 * 3600000).toISOString(),
      createdByName: 'สมหญิง รักงาน',
      machineName: 'M7-002',
      shiftName: 'กะดึก',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 640,
      totalValue: 64000.0,
    },
    {
      headerCardId: 9,
      headerCardCode: 'HC-2026-009',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 18 * 3600000).toISOString(),
      createdByName: 'ประเสริฐ มานะดี',
      machineName: 'M7-001',
      shiftName: 'กะเช้า',
      statusId: 16,
      statusName: 'Approved',
      totalQuantity: 1100,
      totalValue: 550000.0,
    },
    {
      headerCardId: 10,
      headerCardCode: 'HC-2026-010',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 20 * 3600000).toISOString(),
      createdByName: 'วิไล สุขใจ',
      machineName: 'M7-002',
      shiftName: 'กะบ่าย',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 480,
      totalValue: 48000.0,
    },
    {
      headerCardId: 11,
      headerCardCode: 'HC-2026-011',
      bnTypeName: 'Unsort CC',
      bnTypeId: 2,
      createDate: new Date(Date.now() - 22 * 3600000).toISOString(),
      createdByName: 'ชาคริต วงศ์ดี',
      machineName: 'M7-001',
      shiftName: 'กะดึก',
      statusId: 25,
      statusName: 'Denied',
      totalQuantity: 780,
      totalValue: 39000.0,
    },
    {
      headerCardId: 12,
      headerCardCode: 'HC-2026-012',
      bnTypeName: 'Unfit',
      bnTypeId: 1,
      createDate: new Date(Date.now() - 24 * 3600000).toISOString(),
      createdByName: 'อรุณี ใจงาม',
      machineName: 'M7-002',
      shiftName: 'กะเช้า',
      statusId: 24,
      statusName: 'รอ Approve',
      totalQuantity: 1300,
      totalValue: 1300000.0,
    },
  ];

  mainTableData = mockRecords;
  renderMainTable();
}

// ============ Table Rendering ============
function renderMainTable() {
  const tbody = document.getElementById('mainTableBody');

  if (!mainTableData || mainTableData.length === 0) {
    tbody.innerHTML = `
            <tr class="no-data-row">
                <td colspan="11" style="text-align: center; padding: 30px;">
                    <div class="no-data-message">ไม่พบข้อมูล</div>
                </td>
            </tr>
        `;
    clearSelection();
    return;
  }

  tbody.innerHTML = mainTableData
    .map(
      (row, index) => `
        <tr data-hc-id="${row.headerCardId}" onclick="handleRowClick(${row.headerCardId})">
            <td class="col-select">
                <input type="radio" name="rowSelect" value="${row.headerCardId}" 
                    ${selectedHC?.headerCardId === row.headerCardId ? 'checked' : ''} 
                    onclick="event.stopPropagation(); handleRowClick(${row.headerCardId})" />
            </td>
            <td class="col-no">${index + 1}</td>
            <td class="col-hc">${escapeHtml(row.headerCardCode)}</td>
            <td class="col-bntype">${escapeHtml(row.bnTypeName)}</td>
            <td class="col-date">${formatDateTime(row.createDate)}</td>
            <td class="col-user">${escapeHtml(row.createdByName)}</td>
            <td class="col-machine">${escapeHtml(row.machineName)}</td>
            <td class="col-shift">${escapeHtml(row.shiftName)}</td>
            <td class="col-status">${renderStatusBadge(row.statusId, row.statusName)}</td>
            <td class="col-total">${formatNumber(row.totalQuantity)}</td>
            <td class="col-value">${formatCurrency(row.totalValue)}</td>
        </tr>
    `,
    )
    .join('');
}

function renderStatusBadge(statusId, statusName) {
  let badgeClass = 'pending';
  if (statusId === 16) badgeClass = 'approved';
  else if (statusId === 25) badgeClass = 'denied';

  return `<span class="status-badge ${badgeClass}">${escapeHtml(statusName)}</span>`;
}

// ============ Row Selection ============
function handleRowClick(headerCardId) {
  const row = mainTableData.find((r) => r.headerCardId === headerCardId);
  if (!row) return;

  // Update selection state
  selectedHC = row;

  // Update UI
  document.querySelectorAll('#mainTableBody tr').forEach((tr) => {
    tr.classList.remove('selected');
  });
  document
    .querySelector(`tr[data-hc-id="${headerCardId}"]`)
    ?.classList.add('selected');

  // Update radio button
  document.querySelector(
    `input[name="rowSelect"][value="${headerCardId}"]`,
  ).checked = true;

  // Enable action buttons
  document.getElementById('btnApprove').disabled = false;
  document.getElementById('btnDeny').disabled = false;

  // Update panel title
  document.getElementById('panelTitle').textContent = `${row.bnTypeName}`;

  // Load denomination details
  loadDenominationDetails(headerCardId);
}

async function loadDenominationDetails(headerCardId) {
  if (USE_MOCK_DATA) {
    loadMockDenominationDetails();
    return;
  }

  $.enablePageLoader();
  try {
    const response = await fetch(
      `${API_BASE_URL}/GetDenominationDetails?headerCardId=${headerCardId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          RequestVerificationToken: document.querySelector(
            'input[name="__RequestVerificationToken"]',
          ).value,
        },
      },
    );

    const result = await response.json();

    if (result.is_success && result.data) {
      denominationDetailsData = result.data;
      renderDenominationTable();
    } else {
      console.error('Failed to load denomination details:', result.message);
      showErrorMessage('ไม่สามารถโหลดรายละเอียดได้');
    }
  } catch (error) {
    console.error('Error loading denomination details:', error);
    showErrorMessage('เกิดข้อผิดพลาดในการโหลดรายละเอียด');
  } finally {
    $.disablePageLoader();
  }
}

function loadMockDenominationDetails() {
  if (!selectedHC) return;

  // Different denomination details for each HC
  const mockDenominationsByHC = {
    1: [ // HC-2026-001 (ธนบัตรราคา 20 บาท)
      { denominationName: '20', typeName: 'ดี', seriesName: '17', quantity: 4 },
      { denominationName: '20', typeName: 'เสีย', seriesName: '17', quantity: 995 },
      { denominationName: '20', typeName: 'Reject', seriesName: '17', quantity: 1 },
    ],
    2: [ // HC-2026-002 (ธนบัตรราคา 100 บาท)
      { denominationName: '100', typeName: 'ดี', seriesName: '17', quantity: 250 },
      { denominationName: '100', typeName: 'เสีย', seriesName: '17', quantity: 245 },
      { denominationName: '100', typeName: 'Reject', seriesName: '17', quantity: 5 },
    ],
    3: [ // HC-2026-003 (ธนบัตรราคา 50 + 100 บาท)
      { denominationName: '50', typeName: 'ดี', seriesName: '17', quantity: 300 },
      { denominationName: '50', typeName: 'เสีย', seriesName: '17', quantity: 200 },
      { denominationName: '100', typeName: 'ดี', seriesName: '17', quantity: 150 },
      { denominationName: '100', typeName: 'เสีย', seriesName: '17', quantity: 100 },
    ],
    4: [ // HC-2026-004 (ธนบัตรราคา 20 บาท)
      { denominationName: '20', typeName: 'ดี', seriesName: '17', quantity: 100 },
      { denominationName: '20', typeName: 'เสีย', seriesName: '17', quantity: 198 },
      { denominationName: '20', typeName: 'Reject', seriesName: '17', quantity: 2 },
    ],
    5: [ // HC-2026-005 (ธนบัตรราคา 1000 บาท)
      { denominationName: '1000', typeName: 'ดี', seriesName: '17', quantity: 100 },
      { denominationName: '1000', typeName: 'เสีย', seriesName: '17', quantity: 25 },
    ],
    6: [ // HC-2026-006 (ธนบัตรราคา 50 บาท)
      { denominationName: '50', typeName: 'ดี', seriesName: '17', quantity: 400 },
      { denominationName: '50', typeName: 'เสีย', seriesName: '17', quantity: 445 },
      { denominationName: '50', typeName: 'Reject', seriesName: '17', quantity: 5 },
    ],
    7: [ // HC-2026-007 (ธนบัตรราคา 50 บาท)
      { denominationName: '50', typeName: 'ดี', seriesName: '17', quantity: 500 },
      { denominationName: '50', typeName: 'เสีย', seriesName: '17', quantity: 420 },
    ],
    8: [ // HC-2026-008 (ธนบัตรราคา 100 บาท)
      { denominationName: '100', typeName: 'ดี', seriesName: '17', quantity: 320 },
      { denominationName: '100', typeName: 'เสีย', seriesName: '17', quantity: 315 },
      { denominationName: '100', typeName: 'Reject', seriesName: '17', quantity: 5 },
    ],
    9: [ // HC-2026-009 (ธนบัตรราคา 500 บาท)
      { denominationName: '500', typeName: 'ดี', seriesName: '17', quantity: 600 },
      { denominationName: '500', typeName: 'เสีย', seriesName: '17', quantity: 500 },
    ],
    10: [ // HC-2026-010 (ธนบัตรราคา 100 บาท)
      { denominationName: '100', typeName: 'ดี', seriesName: '17', quantity: 240 },
      { denominationName: '100', typeName: 'เสีย', seriesName: '17', quantity: 238 },
      { denominationName: '100', typeName: 'Reject', seriesName: '17', quantity: 2 },
    ],
    11: [ // HC-2026-011 (ธนบัตรราคา 50 บาท)
      { denominationName: '50', typeName: 'ดี', seriesName: '17', quantity: 380 },
      { denominationName: '50', typeName: 'เสีย', seriesName: '17', quantity: 395 },
      { denominationName: '50', typeName: 'Reject', seriesName: '17', quantity: 5 },
    ],
    12: [ // HC-2026-012 (ธนบัตรราคา 1000 บาท)
      { denominationName: '1000', typeName: 'ดี', seriesName: '17', quantity: 650 },
      { denominationName: '1000', typeName: 'เสีย', seriesName: '17', quantity: 650 },
    ],
  };

  const details = mockDenominationsByHC[selectedHC.headerCardId] || [];

  denominationDetailsData = details.map((d) => ({
    denominationId: parseInt(d.denominationName),
    denominationName: d.denominationName,
    denominationValue: parseInt(d.denominationName),
    typeName: d.typeName,
    seriesName: d.seriesName,
    quantity: d.quantity,
    totalValue: d.quantity * parseInt(d.denominationName),
    imageUrl: `/images/banknotes/${d.denominationName}_baht.png`,
  }));

  renderDenominationTable();
}

function renderDenominationTable() {
  const tbody = document.getElementById('denominationTableBody');

  if (!denominationDetailsData || denominationDetailsData.length === 0) {
    tbody.innerHTML = `
            <tr class="no-data-row">
                <td colspan="4" style="text-align: center; padding: 20px;">
                    <div class="no-data-message">ไม่มีข้อมูลรายละเอียด</div>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = denominationDetailsData
    .map(
      (row) => `
        <tr>
            <td class="col-denom">
                <span class="banknote-badge">${escapeHtml(row.denominationName)}฿</span>
            </td>
            <td class="col-type">${escapeHtml(row.typeName)}</td>
            <td class="col-series">${escapeHtml(row.seriesName)}</td>
            <td class="col-qty">${formatNumber(row.quantity)}</td>
        </tr>
    `,
    )
    .join('');
}

function clearSelection() {
  selectedHC = null;
  denominationDetailsData = [];

  document.querySelectorAll('#mainTableBody tr').forEach((tr) => {
    tr.classList.remove('selected');
  });

  document.querySelectorAll('input[name="rowSelect"]').forEach((radio) => {
    radio.checked = false;
  });

  document.getElementById('btnApprove').disabled = true;
  document.getElementById('btnDeny').disabled = true;
  document.getElementById('panelTitle').textContent = 'Details';
  document.getElementById('inputRemark').value = '';

  const tbody = document.getElementById('denominationTableBody');
  tbody.innerHTML = `
        <tr class="no-data-row">
            <td colspan="4" style="text-align: center; padding: 20px;">
                <div class="no-data-message">กรุณาเลือก Header Card</div>
            </td>
        </tr>
    `;
}

// ============ Approve/Deny Actions ============
let currentAction = null; // 'approve' or 'deny'

function handleApproveClick() {
  if (!selectedHC) {
    alert('กรุณาเลือก Header Card ที่ต้องการ Approve');
    return;
  }

  currentAction = 'approve';
  document.getElementById('confirmModalTitle').textContent = 'Approve';
  document.getElementById('confirmModalMessage').textContent =
    'คุณแน่ใจหรือไม่ที่ต้องการ Approve ข้อมูลนี้';

  const confirmModal = new bootstrap.Modal(
    document.getElementById('confirmModal'),
  );
  confirmModal.show();
}

function handleDenyClick() {
  if (!selectedHC) {
    alert('กรุณาเลือก Header Card ที่ต้องการ Deny');
    return;
  }

  const remark = document.getElementById('inputRemark').value.trim();
  if (!remark) {
    alert('กรุณากรอกหมายเหตุสำหรับการ Deny');
    document.getElementById('inputRemark').focus();
    return;
  }

  currentAction = 'deny';
  document.getElementById('confirmModalTitle').textContent = 'Deny';
  document.getElementById('confirmModalMessage').textContent =
    'คุณแน่ใจหรือไม่ที่ต้องการ Deny ข้อมูลนี้';

  const confirmModal = new bootstrap.Modal(
    document.getElementById('confirmModal'),
  );
  confirmModal.show();
}

async function handleConfirmAction() {
  if (!selectedHC) return;

  // Hide confirm modal
  const confirmModal = bootstrap.Modal.getInstance(
    document.getElementById('confirmModal'),
  );
  confirmModal.hide();

  const endpoint = currentAction === 'approve' ? '/Approve' : '/Deny';
  const remark = document.getElementById('inputRemark').value.trim();

  const requestBody =
    currentAction === 'approve'
      ? {
          headerCardId: selectedHC.headerCardId,
          remark: remark || '',
          approvedBy: parseInt(currentUserId),
        }
      : {
          headerCardId: selectedHC.headerCardId,
          remark: remark,
          deniedBy: parseInt(currentUserId),
        };

  if (USE_MOCK_DATA) {
    // Mock success
    setTimeout(() => {
      showSuccessModal(
        currentAction === 'approve' ? 'Approve สำเร็จ' : 'Deny สำเร็จ',
      );
      clearSelection();
      // Update mock data status
      const row = mainTableData.find(
        (r) => r.headerCardId === selectedHC.headerCardId,
      );
      if (row) {
        row.statusId = currentAction === 'approve' ? 16 : 25;
        row.statusName = currentAction === 'approve' ? 'Approved' : 'Denied';
      }
      renderMainTable();
    }, 500);
    return;
  }

  $.enablePageLoader();
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        RequestVerificationToken: document.querySelector(
          'input[name="__RequestVerificationToken"]',
        ).value,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.is_success && result.data && result.data.isSuccess) {
      showSuccessModal(result.data.message || 'บันทึกข้อมูลสำเร็จ');
      clearSelection();
    } else {
      const errorMessage =
        result.data?.message || result.message || 'เกิดข้อผิดพลาด';
      showErrorMessage(errorMessage);
    }
  } catch (error) {
    console.error('Error executing action:', error);
    showErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  } finally {
    $.disablePageLoader();
  }
}

function showSuccessModal(message) {
  document.getElementById('successModalMessage').textContent = message;
  const successModal = new bootstrap.Modal(
    document.getElementById('successModal'),
  );
  successModal.show();
}

function showErrorMessage(message) {
  alert(message); // TODO: Use a better notification system
}

// ============ Utility Functions ============
function formatDateTime(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
}

function formatCurrency(num) {
  if (num === null || num === undefined) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ Page Loader (if not defined globally) ============
if (!$.enablePageLoader) {
  $.enablePageLoader = function () {
    // TODO: Implement page loader if not available globally
    console.log('Loading...');
  };
}

if (!$.disablePageLoader) {
  $.disablePageLoader = function () {
    // TODO: Implement page loader if not available globally
    console.log('Loaded.');
  };
}

// ============ Mock Data Toggle (Press 'm' key) ============
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Toggle mock mode with 'm' key (must not be in input/textarea)
    if (
      e.key === 'm' &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
    ) {
      toggleMockMode();
    }
  });
}

function toggleMockMode() {
  USE_MOCK_DATA = !USE_MOCK_DATA;
  console.log(`Mock Mode: ${USE_MOCK_DATA ? 'ON' : 'OFF'}`);

  // Show notification
  showModeNotification();

  // Update indicator
  renderModeIndicator();

  // Reset header date/supervisor
  if (USE_MOCK_DATA) {
    // DEMO MODE - แสดง mock data
    document.getElementById('headerDate').textContent = '21/7/2568 16:26';
    document.getElementById('headerSupervisor').textContent = 'พัฒนา วิไล';
  } else {
    // LIVE MODE - เริ่มแสดงเวลาจริง
    updateDateTime();
  }

  // Reload data
  clearSelection();
  if (USE_MOCK_DATA) {
    loadMockData();
  } else {
    loadMainTableData();
  }
}

function renderModeIndicator() {
  // Remove existing indicator
  const existing = document.getElementById('mockModeIndicator');
  if (existing) existing.remove();

  // Create new indicator
  const indicator = document.createElement('div');
  indicator.id = 'mockModeIndicator';
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    background: ${USE_MOCK_DATA ? '#198754' : '#6c757d'};
    color: white;
    border-radius: 20px;
    font-family: 'Pridi', sans-serif;
    font-size: 13px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
  `;
  indicator.innerHTML = `
    <span style="margin-right: 6px;">${USE_MOCK_DATA ? '🟢' : '🔴'}</span>
    ${USE_MOCK_DATA ? 'DEMO MODE' : 'LIVE MODE'}
    <span style="margin-left: 6px; opacity: 0.8; font-size: 11px;">(Press 'm' to toggle)</span>
  `;

  indicator.addEventListener('click', toggleMockMode);
  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.05)';
  });
  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)';
  });

  document.body.appendChild(indicator);
}

function showModeNotification() {
  // Remove existing notification
  const existing = document.getElementById('modeNotification');
  if (existing) existing.remove();

  // Create notification
  const notification = document.createElement('div');
  notification.id = 'modeNotification';
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 24px 48px;
    background: ${USE_MOCK_DATA ? '#198754' : '#0d6efd'};
    color: white;
    border-radius: 12px;
    font-family: 'Pridi', sans-serif;
    font-size: 18px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    animation: fadeInOut 1.5s ease;
  `;
  notification.textContent = `${USE_MOCK_DATA ? 'เปิด DEMO MODE' : 'ปิด DEMO MODE'}`;

  // Add CSS animation
  if (!document.getElementById('modeNotificationStyle')) {
    const style = document.createElement('style');
    style.id = 'modeNotificationStyle';
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after animation
  setTimeout(() => notification.remove(), 1500);
}

// ============ Filter Panel Toggle ============
function toggleFilterPanel() {
  const filterPanel = document.querySelector('.filter-panel');
  if (!filterPanel) return;

  if (filterPanel.style.display === 'none') {
    filterPanel.style.display = 'block';
  } else {
    filterPanel.style.display = 'none';
  }
}

// Export for global access
window.toggleFilterPanel = toggleFilterPanel;
