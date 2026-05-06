/**
 * Dental Plus - Clinic Portal
 * ตารางนัดหมาย, แจ้งเตือน, ปิดเคสหลังชำระเงิน
 */

const ClinicState = {
  currentBranch: 'all',
  currentDate: new Date(),
  closingPatientId: null,
  appointments: [
    {
      id: 1, time: '09:00', name: 'คุณสมชาย', initial: 'ส', color: 'red',
      hn: 'HN-2569-001', phone: '081-234-5678', channel: 'LINE',
      treatment: 'ผ่าฟันคุด', doctor: 'หมอเดวิด', branch: 'siam', branchName: 'สาขาสยาม',
      cost: 8500, status: 'done', note: 'ฟันคุดล่างซ้าย มียาแก้ปวดก่อนมา'
    },
    {
      id: 2, time: '09:30', name: 'คุณลิซ่า', initial: 'ล', color: 'blue',
      hn: 'HN-2569-002', phone: '089-876-5432', channel: 'Facebook',
      treatment: 'ปรึกษาจัดฟัน', doctor: 'หมอแคท', branch: 'siam', branchName: 'สาขาสยาม',
      cost: 2000, status: 'done', note: 'สนใจ Invisalign งบ 50,000'
    },
    {
      id: 3, time: '10:00', name: 'คุณวิภา', initial: 'ว', color: 'pink',
      hn: 'HN-2569-156', phone: '062-345-6789', channel: 'Instagram',
      treatment: 'ฟอกสีฟัน', doctor: 'หมอเอมมี่', branch: 'thonglor', branchName: 'สาขาทองหล่อ',
      cost: 5500, status: 'done', note: 'ฟอกแบบ In-office 1 ครั้ง'
    },
    {
      id: 4, time: '10:30', name: 'คุณพิมพ์', initial: 'พ', color: 'yellow',
      hn: 'HN-2569-089', phone: '095-111-2233', channel: 'TikTok',
      treatment: 'วีเนียร์ 8 ซี่', doctor: 'หมอเอมมี่', branch: 'thonglor', branchName: 'สาขาทองหล่อ',
      cost: 120000, status: 'payment',
      note: 'VIP - ทำวีเนียร์ซี่หน้าบน 8 ซี่ เลือกเฉด A1'
    },
    {
      id: 5, time: '11:00', name: 'John Smith', initial: 'J', color: 'indigo',
      hn: 'HN-2569-201', phone: '+66-91-234-5678', channel: 'WhatsApp',
      treatment: 'ตรวจสุขภาพฟัน', doctor: 'หมอแอน', branch: 'siam', branchName: 'สาขาสยาม',
      cost: 1500, status: 'payment',
      note: 'ชาวต่างชาติ ต้องการใบเสร็จภาษาอังกฤษ'
    },
    {
      id: 6, time: '13:00', name: 'คุณนภา', initial: 'น', color: 'emerald',
      hn: 'HN-2569-045', phone: '083-456-7890', channel: 'LINE',
      treatment: 'อุดฟัน 2 ซี่', doctor: 'หมอเบน', branch: 'bangna', branchName: 'สาขาบางนา',
      cost: 3000, status: 'treating',
      note: 'อุดฟันซี่ 15, 16 คอมโพสิต'
    },
    {
      id: 7, time: '13:30', name: 'คุณธนา', initial: 'ธ', color: 'amber',
      hn: 'HN-2569-078', phone: '086-789-0123', channel: 'LINE',
      treatment: 'ขูดหินปูน', doctor: 'หมอแอน', branch: 'siam', branchName: 'สาขาสยาม',
      cost: 1200, status: 'treating',
      note: 'ขูดหินปูนรอบ 6 เดือน ไม่มีปัญหาเหงือก'
    },
    {
      id: 8, time: '14:00', name: 'คุณแก้ว', initial: 'ก', color: 'cyan',
      hn: 'HN-2569-112', phone: '097-234-5678', channel: 'Facebook',
      treatment: 'ครอบฟัน', doctor: 'หมอเอมมี่', branch: 'ratchada', branchName: 'สาขารัชดา',
      cost: 15000, status: 'treating',
      note: 'ครอบฟันซี่ 46 เซรามิก รอจากแลป'
    },
    {
      id: 9, time: '14:30', name: 'คุณมานะ', initial: 'ม', color: 'violet',
      hn: 'HN-2569-067', phone: '081-567-8901', channel: 'LINE',
      treatment: 'ถอนฟัน', doctor: 'หมอเดวิด', branch: 'bangna', branchName: 'สาขาบางนา',
      cost: 1500, status: 'waiting',
      note: 'ถอนฟันซี่ 38 ผุมาก ไม่สามารถอุดได้'
    },
    {
      id: 10, time: '15:00', name: 'คุณปิยะ', initial: 'ป', color: 'rose',
      hn: 'HN-2569-134', phone: '089-012-3456', channel: 'Instagram',
      treatment: 'รากเทียม', doctor: 'หมอเดวิด', branch: 'siam', branchName: 'สาขาสยาม',
      cost: 55000, status: 'waiting',
      note: 'Phase 2 ฝังรากเทียมซี่ 36 Osstem'
    },
    {
      id: 11, time: '15:30', name: 'คุณอรุณ', initial: 'อ', color: 'teal',
      hn: 'HN-2569-190', phone: '062-890-1234', channel: 'LINE',
      treatment: 'จัดฟัน (นัดตรวจ)', doctor: 'หมอแคท', branch: 'ratchada', branchName: 'สาขารัชดา',
      cost: 3000, status: 'waiting',
      note: 'ปรับลวดครั้งที่ 5 ฟันเรียงตัวดีขึ้น'
    },
    {
      id: 12, time: '16:00', name: 'คุณกมล', initial: 'ก', color: 'orange',
      hn: 'HN-2569-155', phone: '095-345-6789', channel: 'Facebook',
      treatment: 'ขูดหินปูน + ฟลูออไรด์', doctor: 'หมอเบน', branch: 'bangna', branchName: 'สาขาบางนา',
      cost: 2000, status: 'waiting',
      note: 'นัดตรวจประจำ 6 เดือน พร้อมเคลือบฟลูออไรด์'
    }
  ],
  notifications: [
    { id: 1, type: 'new', message: 'คุณมานะ นัดถอนฟัน 14:30 - สาขาบางนา', time: '5 นาทีที่แล้ว', read: false },
    { id: 2, type: 'alert', message: 'คุณพิมพ์ รอชำระเงิน ฿120,000 - วีเนียร์', time: '15 นาทีที่แล้ว', read: false },
    { id: 3, type: 'new', message: 'คุณปิยะ ยืนยันนัดรากเทียม 15:00 - สาขาสยาม', time: '30 นาทีที่แล้ว', read: false },
    { id: 4, type: 'cancel', message: 'คุณสุดา ยกเลิกนัด 16:30 - สาขาทองหล่อ', time: '1 ชั่วโมงที่แล้ว', read: false },
    { id: 5, type: 'new', message: 'คุณกมล ยืนยันนัด 16:00 - สาขาบางนา', time: '2 ชั่วโมงที่แล้ว', read: true },
    { id: 6, type: 'alert', message: 'John Smith รอชำระเงิน ฿1,500 - ตรวจสุขภาพฟัน', time: '2 ชั่วโมงที่แล้ว', read: true }
  ]
};

function initClinic() {
  renderAppointments();
  renderNotifications();
  updateStats();
  setupTooltip();
  setupClickOutside();
}

/* ============================================
   Render Appointments Table
   ============================================ */
function renderAppointments() {
  const tbody = document.getElementById('appointment-table-body');
  const branch = ClinicState.currentBranch;

  const filtered = ClinicState.appointments.filter(a =>
    branch === 'all' || a.branch === branch
  );

  tbody.innerHTML = filtered.map(a => {
    const statusInfo = getStatusInfo(a.status);
    return `
      <tr class="appointment-row border-b border-gray-100 hover:bg-gray-50 transition-all"
          data-patient-id="${a.id}">
        <td class="px-6 py-4">
          <span class="text-sm font-semibold text-gray-800">${a.time}</span>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-3 cursor-pointer group" onclick="navigateToPatientProfile('${a.hn}')">
            <div class="w-9 h-9 bg-${a.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-${a.color}-600 font-semibold text-sm">${a.initial}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm group-hover:text-teal-600 group-hover:underline transition-colors">${a.name}</p>
              <p class="text-xs text-gray-400">${a.hn}</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="text-sm text-gray-700">${a.treatment}</span>
        </td>
        <td class="px-6 py-4">
          <span class="text-sm text-gray-700">${a.doctor}</span>
        </td>
        <td class="px-6 py-4">
          <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">${a.branchName}</span>
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}">
            <span class="w-1.5 h-1.5 rounded-full ${statusInfo.dot}"></span>
            ${statusInfo.label}
          </span>
        </td>
        <td class="px-6 py-4">
          ${getActionButtons(a)}
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusInfo(status) {
  const map = {
    waiting:  { label: 'รอมา', class: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    treating: { label: 'กำลังรักษา', class: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    payment:  { label: 'รอชำระ', class: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    done:     { label: 'เสร็จสิ้น', class: 'bg-green-100 text-green-700', dot: 'bg-green-500' }
  };
  return map[status] || map.waiting;
}

function getActionButtons(appointment) {
  switch (appointment.status) {
    case 'waiting':
      return `<button onclick="updateStatus(${appointment.id}, 'treating')" class="px-3 py-1.5 bg-yellow-500 text-white text-xs rounded-lg font-medium hover:bg-yellow-600 transition-all">รับคนไข้</button>`;
    case 'treating':
      return `<button onclick="updateStatus(${appointment.id}, 'payment')" class="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600 transition-all">รักษาเสร็จ</button>`;
    case 'payment':
      return `<button onclick="openCloseCase(${appointment.id})" class="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 transition-all">ปิดเคส</button>`;
    case 'done':
      return `<span class="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        ชำระแล้ว
      </span>`;
    default:
      return '';
  }
}

/* ============================================
   Status Update
   ============================================ */
function updateStatus(id, newStatus) {
  const appointment = ClinicState.appointments.find(a => a.id === id);
  if (appointment) {
    appointment.status = newStatus;
    renderAppointments();
    updateStats();
  }
}

/* ============================================
   Close Case (Payment)
   ============================================ */
function openCloseCase(id) {
  const appointment = ClinicState.appointments.find(a => a.id === id);
  if (!appointment) return;

  ClinicState.closingPatientId = id;

  const avatar = document.getElementById('modal-avatar');
  avatar.className = `w-12 h-12 bg-${appointment.color}-100 rounded-full flex items-center justify-center`;
  document.getElementById('modal-initial').textContent = appointment.initial;
  document.getElementById('modal-initial').className = `font-bold text-lg text-${appointment.color}-600`;
  document.getElementById('modal-patient-name').textContent = appointment.name;
  document.getElementById('modal-treatment').textContent = appointment.treatment + ' - ' + appointment.doctor;
  document.getElementById('modal-cost').value = appointment.cost.toLocaleString();
  document.getElementById('modal-note').value = '';

  const modal = document.getElementById('close-case-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function confirmCloseCase() {
  const id = ClinicState.closingPatientId;
  if (!id) return;

  const appointment = ClinicState.appointments.find(a => a.id === id);
  if (appointment) {
    appointment.status = 'done';
  }

  closeModal('close-case-modal');
  ClinicState.closingPatientId = null;
  renderAppointments();
  updateStats();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

/* ============================================
   Branch Selector
   ============================================ */
function changeBranch() {
  ClinicState.currentBranch = document.getElementById('branch-selector').value;
  renderAppointments();
  updateStats();
}

/* ============================================
   Date Navigation
   ============================================ */
function changeDate(offset) {
  ClinicState.currentDate.setDate(ClinicState.currentDate.getDate() + offset);
  updateDateDisplay();
}

function goToday() {
  ClinicState.currentDate = new Date();
  updateDateDisplay();
}

function updateDateDisplay() {
  const d = ClinicState.currentDate;
  const days = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const thaiYear = d.getFullYear() + 543;
  document.getElementById('current-date').textContent =
    `${days[d.getDay()]}ที่ ${d.getDate()} ${months[d.getMonth()]} ${thaiYear}`;
}

/* ============================================
   Notifications
   ============================================ */
function renderNotifications() {
  const list = document.getElementById('noti-list');
  list.innerHTML = ClinicState.notifications.map(n => {
    const iconMap = {
      new:    { bg: 'bg-blue-100', text: 'text-blue-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>' },
      alert:  { bg: 'bg-orange-100', text: 'text-orange-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>' },
      cancel: { bg: 'bg-red-100', text: 'text-red-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' }
    };
    const info = iconMap[n.type] || iconMap.new;
    return `
      <div class="flex items-start gap-3 p-4 border-b border-gray-50 ${n.read ? 'opacity-60' : 'bg-dental-50/30'} hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 ${info.bg} rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 ${info.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${info.icon}</svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-800 ${n.read ? '' : 'font-medium'}">${n.message}</p>
          <p class="text-xs text-gray-400 mt-1">${n.time}</p>
        </div>
        ${n.read ? '' : '<div class="w-2 h-2 bg-dental-500 rounded-full mt-2 flex-shrink-0"></div>'}
      </div>
    `;
  }).join('');
}

function toggleNotifications() {
  const dropdown = document.getElementById('noti-dropdown');
  dropdown.classList.toggle('hidden');
}

function markAllRead() {
  ClinicState.notifications.forEach(n => n.read = true);
  document.getElementById('noti-badge').classList.add('hidden');
  renderNotifications();
}

function setupClickOutside() {
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('noti-dropdown');
    const bell = document.getElementById('noti-bell');
    if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

/* ============================================
   Navigate to Patient Profile
   ============================================ */
function navigateToPatientProfile(hn) {
  window.location.href = 'clinic-branch.html?hn=' + encodeURIComponent(hn) + '&tab=3';
}

/* ============================================
   Hover Tooltip (legacy - kept for reference)
   ============================================ */
function setupTooltip() {
  // Tooltip triggers removed from table rows - now using direct navigation
}

function showTooltip(event, patientId) {
  const appointment = ClinicState.appointments.find(a => a.id === patientId);
  if (!appointment) return;

  const tooltip = document.getElementById('patient-tooltip');
  const avatar = document.getElementById('tooltip-avatar');
  avatar.className = `w-12 h-12 bg-${appointment.color}-100 rounded-full flex items-center justify-center`;
  document.getElementById('tooltip-initial').textContent = appointment.initial;
  document.getElementById('tooltip-initial').className = `font-bold text-lg text-${appointment.color}-600`;
  document.getElementById('tooltip-name').textContent = appointment.name;
  document.getElementById('tooltip-hn').textContent = appointment.hn + ' | ' + appointment.branchName;
  document.getElementById('tooltip-phone').textContent = appointment.phone;
  document.getElementById('tooltip-channel').textContent = appointment.channel;
  document.getElementById('tooltip-treatment').textContent = appointment.treatment;
  document.getElementById('tooltip-cost').textContent = '฿' + appointment.cost.toLocaleString();
  document.getElementById('tooltip-note').textContent = appointment.note;

  tooltip.classList.remove('hidden');
  moveTooltip(event);
}

function moveTooltip(event) {
  const tooltip = document.getElementById('patient-tooltip');
  const x = event.clientX + 20;
  const y = event.clientY + 10;
  const rect = tooltip.getBoundingClientRect();

  const adjustedX = (x + 320 > window.innerWidth) ? event.clientX - 340 : x;
  const adjustedY = (y + rect.height > window.innerHeight) ? event.clientY - rect.height - 10 : y;

  tooltip.style.left = adjustedX + 'px';
  tooltip.style.top = adjustedY + 'px';
}

function hideTooltip() {
  document.getElementById('patient-tooltip').classList.add('hidden');
}

/* ============================================
   Stats Update
   ============================================ */
function updateStats() {
  const branch = ClinicState.currentBranch;
  const filtered = ClinicState.appointments.filter(a =>
    branch === 'all' || a.branch === branch
  );

  const waiting = filtered.filter(a => a.status === 'waiting').length;
  const treating = filtered.filter(a => a.status === 'treating').length;
  const payment = filtered.filter(a => a.status === 'payment').length;
  const done = filtered.filter(a => a.status === 'done').length;
  const total = filtered.length;

  document.getElementById('today-total').textContent = total;
  document.getElementById('stat-waiting').textContent = waiting + ' รอมา';
  document.getElementById('stat-treating').textContent = treating + ' กำลังรักษา';
  document.getElementById('stat-payment').textContent = payment + ' รอชำระ';
  document.getElementById('stat-done').textContent = done + ' เสร็จสิ้น';

  document.getElementById('footer-total').textContent = total;
  document.getElementById('footer-closed').textContent = done;

  const totalRevenue = filtered.filter(a => a.status === 'done').reduce((sum, a) => sum + a.cost, 0);
  document.getElementById('footer-revenue').textContent = '฿' + totalRevenue.toLocaleString();
}
