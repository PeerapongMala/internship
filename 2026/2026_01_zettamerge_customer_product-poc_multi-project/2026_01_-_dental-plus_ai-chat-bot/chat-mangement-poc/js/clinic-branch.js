/**
 * Dental Plus - Clinic Branch Portal (สาขาเดียว)
 * Enhanced: 6-Tab Layout with Booking, Patient History, Payment, Follow-up, Reports
 */

const BRANCH_ID = 'siam';
const BRANCH_NAME = 'สาขาสยาม';

const SLOT_DEFINITIONS = [
  { key: '09-10', label: '09:00 - 10:00', startHour: 9 },
  { key: '10-11', label: '10:00 - 11:00', startHour: 10 },
  { key: '11-12', label: '11:00 - 12:00', startHour: 11 },
  { key: '13-14', label: '13:00 - 14:00', startHour: 13 },
  { key: '14-15', label: '14:00 - 15:00', startHour: 14 },
  { key: '15-16', label: '15:00 - 16:00', startHour: 15 },
  { key: '16-17', label: '16:00 - 17:00', startHour: 16 },
  { key: '17-18', label: '17:00 - 18:00', startHour: 17 }
];

const DOCTORS = [
  { name: 'หมอแอน', initial: 'อ', color: 'teal' },
  { name: 'หมอเบน', initial: 'บ', color: 'blue' },
  { name: 'หมอแคท', initial: 'ค', color: 'pink' },
  { name: 'หมอเดวิด', initial: 'ด', color: 'amber' },
  { name: 'หมอเอมมี่', initial: 'อ', color: 'purple' }
];

function getDoctorMeta(doctorName) {
  return DOCTORS.find(d => d.name === doctorName) || { name: doctorName, initial: doctorName.charAt(0), color: 'gray' };
}

function getAppointmentsForSlot(slotKey) {
  const startHour = parseInt(slotKey.split('-')[0]);
  const endHour = parseInt(slotKey.split('-')[1]);
  return BranchState.appointments.filter(a => {
    const h = parseInt(a.time.split(':')[0]);
    return h >= startHour && h < endHour && a.status !== 'cancelled';
  });
}

/* ============================================
   State
   ============================================ */
const BranchState = {
  currentDate: new Date(),
  activeTab: 1,
  closingPatientId: null,
  editingPatientId: null,
  selectedPatientId: null,
  chartsInitialized: false,
  groupByDoctor: false,
  expandedOrders: {},

  appointments: [
    {
      id: 1, time: '09:00', name: 'คุณสมชาย', initial: 'ส', color: 'red',
      hn: 'HN-2569-001', phone: '081-234-5678', channel: 'LINE',
      treatment: 'ผ่าฟันคุด', doctor: 'หมอเดวิด',
      cost: 8500, status: 'confirmed', paymentStatus: 'none', paymentMethod: '',
      note: 'ฟันคุดล่างซ้าย มียาแก้ปวดก่อนมา'
    },
    {
      id: 2, time: '09:30', name: 'คุณลิซ่า', initial: 'ล', color: 'blue',
      hn: 'HN-2569-002', phone: '089-876-5432', channel: 'Facebook',
      treatment: 'ปรึกษาจัดฟัน', doctor: 'หมอแคท',
      cost: 2000, status: 'treating', paymentStatus: 'none', paymentMethod: '',
      note: 'สนใจ Invisalign งบ 50,000'
    },
    {
      id: 3, time: '10:30', name: 'คุณธนา', initial: 'ธ', color: 'amber',
      hn: 'HN-2569-078', phone: '086-789-0123', channel: 'LINE',
      treatment: 'ขูดหินปูน', doctor: 'หมอแอน',
      cost: 1200, status: 'pending', paymentStatus: 'none', paymentMethod: '',
      note: 'ขูดหินปูนรอบ 6 เดือน ไม่มีปัญหาเหงือก'
    },
    {
      id: 4, time: '11:00', name: 'John Smith', initial: 'J', color: 'indigo',
      hn: 'HN-2569-201', phone: '+66-91-234-5678', channel: 'WhatsApp',
      treatment: 'ตรวจสุขภาพฟัน', doctor: 'หมอแอน',
      cost: 1500, status: 'confirmed', paymentStatus: 'none', paymentMethod: '',
      note: 'ชาวต่างชาติ ต้องการใบเสร็จภาษาอังกฤษ'
    },
    {
      id: 5, time: '14:00', name: 'คุณปิยะ', initial: 'ป', color: 'rose',
      hn: 'HN-2569-134', phone: '089-012-3456', channel: 'Instagram',
      treatment: 'รากเทียม', doctor: 'หมอเดวิด',
      cost: 55000, status: 'payment', paymentStatus: 'outstanding', paymentMethod: '',
      note: 'Phase 2 ฝังรากเทียมซี่ 36 Osstem'
    },
    {
      id: 6, time: '15:00', name: 'คุณพิมพ์', initial: 'พ', color: 'purple',
      hn: 'HN-2569-089', phone: '082-345-6789', channel: 'LINE',
      treatment: 'ฟอกสีฟัน', doctor: 'หมอแคท',
      cost: 5500, status: 'completed', paymentStatus: 'paid', paymentMethod: 'transfer',
      note: 'ฟอกสีฟัน Zoom สีเดิม A3 ต้องการ A1'
    },
    {
      id: 7, time: '16:00', name: 'คุณเมย์', initial: 'ม', color: 'pink',
      hn: 'HN-2569-156', phone: '085-678-9012', channel: 'LINE',
      treatment: 'ขูดหินปูน', doctor: 'หมอแอน',
      cost: 1200, status: 'noshow', paymentStatus: 'none', paymentMethod: '',
      note: 'นัดขูดหินปูนรอบ 1 ปี'
    },
    {
      id: 8, time: '10:00', name: 'คุณวิทย์', initial: 'ว', color: 'teal',
      hn: 'HN-2569-210', phone: '083-456-7890', channel: 'LINE',
      treatment: 'วีเนียร์', doctor: 'หมอเบน',
      cost: 32000, status: 'completed', paymentStatus: 'partial', paymentMethod: 'credit',
      note: 'วีเนียร์ 4 ซี่ ผ่อน 3 งวด งวดแรก 12,000',
      installment: { total: 3, paid: 1, perInstallment: 12000, paidAmount: 12000 }
    }
  ],

  notifications: [
    { id: 1, type: 'new', message: 'คุณสมชาย ยืนยันนัดผ่าฟันคุด 09:00', time: '10 นาทีที่แล้ว', read: false },
    { id: 2, type: 'alert', message: 'คุณปิยะ แจ้งอาจมาสาย 15 นาที', time: '30 นาทีที่แล้ว', read: false },
    { id: 3, type: 'new', message: 'John Smith ยืนยันนัดตรวจฟัน 11:00', time: '1 ชั่วโมงที่แล้ว', read: false },
    { id: 4, type: 'cancel', message: 'คุณเมย์ ไม่มาตามนัด 16:00 ขูดหินปูน', time: '2 ชั่วโมงที่แล้ว', read: true },
    { id: 5, type: 'new', message: 'คุณพิมพ์ ชำระเงินฟอกสีฟัน ฿5,500 เรียบร้อย', time: '3 ชั่วโมงที่แล้ว', read: true }
  ],

  patients: [
    {
      id: 1, name: 'คุณสมชาย ใจดี', initial: 'ส', color: 'red', hn: 'HN-2569-001',
      gender: 'ชาย', birthday: '15 มี.ค. 2529', age: 40,
      phone: '081-234-5678', channel: 'LINE', email: 'somchai.j@email.com',
      allergies: 'ไม่มี', bloodType: 'O', conditions: '',
      doctorNote: '',
      orders: [
        { id: 101, orderNo: 'ORD-2569-0101', name: 'ผ่าฟันคุด', type: 'visit', status: 'active', createdDate: '9 ก.พ. 2569', serviceType: 'ศัลยกรรม', discount: 0, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ผ่าฟันคุด', doctor: 'หมอเดวิด', cost: 8500, status: 'กำลังรักษา',
            soapNote: 'S: ปวดฟันล่างซ้ายมา 3 วัน | O: ฟันคุดล่างซ้าย impacted | A: ผ่าฟันคุด | P: ผ่าตัดนัดติดตาม 1 สัปดาห์',
            beforeAfter: { before: 'xray-before.jpg', after: '' },
            payments: [{ amount: 8500, method: '-', status: 'pending', date: '-', receiptNo: '' }],
            followup: { dueDate: '10 ก.พ. 2569', type: 'ติดตามอาการหลังผ่า', nextAppointment: '16 ก.พ. 2569' },
            chatId: null }
        ]},
        { id: 102, orderNo: 'ORD-2569-0078', name: 'ตรวจสุขภาพฟัน', type: 'visit', status: 'completed', createdDate: '15 ม.ค. 2569', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '15 ม.ค. 2569', treatment: 'ตรวจสุขภาพฟัน', doctor: 'หมอแอน', cost: 1500, status: 'เสร็จสิ้น',
            soapNote: 'S: ตรวจประจำ | O: ไม่พบฟันผุ | A: สุขภาพฟันดี | P: นัดตรวจอีก 6 เดือน',
            beforeAfter: null,
            payments: [{ amount: 1500, method: 'cash', status: 'paid', date: '15 ม.ค. 2569', receiptNo: 'RCP-2569-0078' }], followup: null }
        ]},
        { id: 103, orderNo: 'ORD-2568-0412', name: 'ขูดหินปูน', type: 'visit', status: 'completed', createdDate: '10 ก.ค. 2568', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '10 ก.ค. 2568', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'เสร็จสิ้น',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1200, method: 'cash', status: 'paid', date: '10 ก.ค. 2568', receiptNo: 'RCP-2568-0412' }], followup: null }
        ]}
      ]
    },
    {
      id: 2, name: 'คุณลิซ่า มโนบาล', initial: 'ล', color: 'blue', hn: 'HN-2569-002',
      gender: 'หญิง', birthday: '22 ส.ค. 2540', age: 28,
      phone: '089-876-5432', channel: 'Facebook', email: 'lisa.m@email.com',
      allergies: 'ยาเพนนิซิลิน', bloodType: 'A', conditions: '',
      doctorNote: 'ต้องการ Invisalign งบ 50,000 - 120,000',
      orders: [
        { id: 201, orderNo: 'ORD-2569-0099', name: 'จัดฟัน Invisalign', type: 'package', status: 'active', createdDate: '9 ก.พ. 2569', serviceType: 'จัดฟัน',
          totalSessions: 12, completedSessions: 0, packagePrice: 120000, discount: 5000, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ปรึกษาจัดฟัน', doctor: 'หมอแคท', cost: 2000, status: 'กำลังรักษา',
            soapNote: 'S: ต้องการจัดฟันให้เรียบ | O: ฟันซ้อนเล็กน้อย Class I | A: เหมาะกับ Invisalign | P: scan + สั่ง aligner',
            beforeAfter: { before: 'lisa-before.jpg', after: '' },
            payments: [{ amount: 2000, method: '-', status: 'pending', date: '-', receiptNo: '' }], followup: null }
        ]},
        { id: 202, orderNo: 'ORD-2568-0501', name: 'ขูดหินปูน', type: 'visit', status: 'completed', createdDate: '20 ธ.ค. 2568', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '20 ธ.ค. 2568', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'เสร็จสิ้น',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1200, method: 'cash', status: 'paid', date: '20 ธ.ค. 2568', receiptNo: 'RCP-2568-0501' }], followup: null }
        ]}
      ]
    },
    {
      id: 3, name: 'คุณธนา สุขสม', initial: 'ธ', color: 'amber', hn: 'HN-2569-078',
      gender: 'ชาย', birthday: '5 พ.ค. 2535', age: 34,
      phone: '086-789-0123', channel: 'LINE', email: '',
      allergies: 'ไม่มี', bloodType: 'B', conditions: '',
      doctorNote: '',
      orders: [
        { id: 301, orderNo: 'ORD-2569-0100', name: 'ขูดหินปูน', type: 'visit', status: 'pending', createdDate: '9 ก.พ. 2569', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'รอมา',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1200, method: '-', status: 'pending', date: '-', receiptNo: '' }], followup: null }
        ]},
        { id: 302, orderNo: 'ORD-2568-0380', name: 'ขูดหินปูน', type: 'visit', status: 'completed', createdDate: '5 ส.ค. 2568', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '5 ส.ค. 2568', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'เสร็จสิ้น',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1200, method: 'cash', status: 'paid', date: '5 ส.ค. 2568', receiptNo: 'RCP-2568-0380' }], followup: null }
        ]},
        { id: 303, orderNo: 'ORD-2568-0201', name: 'ขูดหินปูน', type: 'visit', status: 'completed', createdDate: '2 ก.พ. 2568', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '2 ก.พ. 2568', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1000, status: 'เสร็จสิ้น',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1000, method: 'cash', status: 'paid', date: '2 ก.พ. 2568', receiptNo: 'RCP-2568-0201' }], followup: null }
        ]}
      ]
    },
    {
      id: 4, name: 'John Smith', initial: 'J', color: 'indigo', hn: 'HN-2569-201',
      gender: 'Male', birthday: '12 Jan 1985', age: 41,
      phone: '+66-91-234-5678', channel: 'WhatsApp', email: 'john.s@gmail.com',
      allergies: 'Aspirin', bloodType: 'AB', conditions: '',
      doctorNote: 'ชาวต่างชาติ ต้องการใบเสร็จภาษาอังกฤษ',
      orders: [
        { id: 401, orderNo: 'ORD-2569-0102', name: 'ตรวจสุขภาพฟัน', type: 'visit', status: 'active', createdDate: '9 ก.พ. 2569', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ตรวจสุขภาพฟัน', doctor: 'หมอแอน', cost: 1500, status: 'ยืนยัน',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1500, method: '-', status: 'pending', date: '-', receiptNo: '' }], followup: null }
        ]}
      ]
    },
    {
      id: 5, name: 'คุณปิยะ รัตนกุล', initial: 'ป', color: 'rose', hn: 'HN-2569-134',
      gender: 'ชาย', birthday: '30 ธ.ค. 2523', age: 45,
      phone: '089-012-3456', channel: 'Instagram', email: 'piya.r@email.com',
      allergies: 'ไม่มี', bloodType: 'O', conditions: 'เบาหวาน Type 2',
      doctorNote: 'ต้องระวังเรื่องแผลหายช้า เนื่องจากเบาหวาน',
      orders: [
        { id: 501, orderNo: 'ORD-2569-0045', name: 'รากเทียม Osstem (ซี่ 36)', type: 'package', status: 'active', createdDate: '10 ม.ค. 2569', serviceType: 'ศัลยกรรม',
          totalSessions: 3, completedSessions: 1, packagePrice: 130000, discount: 10000, cases: [
          { date: '10 ม.ค. 2569', treatment: 'รากเทียม Phase 1 - ฝังราก', doctor: 'หมอเดวิด', cost: 45000, status: 'เสร็จสิ้น',
            soapNote: 'S: ฟัน 36 หักไม่สามารถซ่อมได้ | O: ถอนฟัน + ฝังรากเทียม Osstem | A: แผลปกติ | P: นัดติดตาม 1 เดือน',
            beforeAfter: { before: 'implant-before.jpg', after: 'implant-phase1.jpg' },
            payments: [{ amount: 45000, method: 'transfer', status: 'paid', date: '10 ม.ค. 2569', receiptNo: 'RCP-2569-0045' }], followup: null },
          { date: '9 ก.พ. 2569', treatment: 'รากเทียม Phase 2 - ใส่หลัก', doctor: 'หมอเดวิด', cost: 55000, status: 'รอชำระ',
            soapNote: 'S: มาตามนัด | O: Osseointegration ดี ฝังหลักสำเร็จ | A: ปกติ | P: นัดใส่ครอบ 1 เดือน',
            beforeAfter: { before: 'implant-phase1.jpg', after: '' },
            payments: [{ amount: 55000, method: '-', status: 'outstanding', date: '-', receiptNo: '' }],
            followup: { dueDate: '16 ก.พ. 2569', type: 'นัดติดตาม 7 วัน', nextAppointment: '9 มี.ค. 2569' } }
        ]}
      ]
    },
    {
      id: 6, name: 'คุณพิมพ์ ลลิตา', initial: 'พ', color: 'purple', hn: 'HN-2569-089',
      gender: 'หญิง', birthday: '18 มิ.ย. 2538', age: 30,
      phone: '082-345-6789', channel: 'LINE', email: 'pim.l@email.com',
      allergies: 'ไม่มี', bloodType: 'A', conditions: '',
      doctorNote: '',
      orders: [
        { id: 601, orderNo: 'ORD-2569-0098', name: 'ฟอกสีฟัน Zoom', type: 'visit', status: 'completed', createdDate: '9 ก.พ. 2569', serviceType: 'เสริมความงาม', discount: 500, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ฟอกสีฟัน Zoom', doctor: 'หมอแคท', cost: 5500, status: 'เสร็จสิ้น',
            soapNote: 'S: ต้องการฟันขาวขึ้น | O: สี A3 → A1 | A: ฟอก Zoom 3 รอบ | P: ติดตามผล 3 วัน',
            beforeAfter: { before: 'whitening-before.jpg', after: 'whitening-after.jpg' },
            payments: [{ amount: 5000, method: 'transfer', status: 'paid', date: '9 ก.พ. 2569', receiptNo: 'RCP-2569-0098' }],
            followup: { dueDate: '12 ก.พ. 2569', type: 'ติดตามผลฟอกสีฟัน', nextAppointment: '' },
            chatId: 'chat-601-1' }
        ]},
        { id: 602, orderNo: 'ORD-2568-0455', name: 'ขูดหินปูน', type: 'visit', status: 'completed', createdDate: '15 พ.ย. 2568', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '15 พ.ย. 2568', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'เสร็จสิ้น',
            soapNote: '', beforeAfter: null,
            payments: [{ amount: 1200, method: 'cash', status: 'paid', date: '15 พ.ย. 2568', receiptNo: 'RCP-2568-0455' }], followup: null }
        ]}
      ]
    },
    {
      id: 7, name: 'คุณเมย์ ชัยกิจ', initial: 'ม', color: 'pink', hn: 'HN-2569-156',
      gender: 'หญิง', birthday: '3 ก.ย. 2542', age: 26,
      phone: '085-678-9012', channel: 'LINE', email: '',
      allergies: 'Latex', bloodType: 'B', conditions: '',
      doctorNote: '',
      orders: [
        { id: 701, orderNo: 'ORD-2569-0103', name: 'ขูดหินปูน', type: 'visit', status: 'noshow', createdDate: '9 ก.พ. 2569', serviceType: 'ทั่วไป', discount: 0, cases: [
          { date: '9 ก.พ. 2569', treatment: 'ขูดหินปูน', doctor: 'หมอแอน', cost: 1200, status: 'No-show',
            soapNote: '', beforeAfter: null,
            payments: [], followup: null }
        ]}
      ]
    },
    {
      id: 8, name: 'คุณวิทย์ ปัญญาดี', initial: 'ว', color: 'teal', hn: 'HN-2569-210',
      gender: 'ชาย', birthday: '25 ม.ค. 2533', age: 36,
      phone: '083-456-7890', channel: 'LINE', email: 'wit.p@email.com',
      allergies: 'ไม่มี', bloodType: 'O', conditions: '',
      doctorNote: 'วีเนียร์ 4 ซี่ ผ่อน 3 งวด',
      orders: [
        { id: 801, orderNo: 'ORD-2569-0088', name: 'วีเนียร์ E.max 4 ซี่', type: 'package', status: 'completed', createdDate: '20 ม.ค. 2569', serviceType: 'เสริมความงาม',
          totalSessions: 2, completedSessions: 2, packagePrice: 35000, discount: 3000, cases: [
          { date: '20 ม.ค. 2569', treatment: 'ตรวจ + พิมพ์ปากเตรียมวีเนียร์', doctor: 'หมอเบน', cost: 3000, status: 'เสร็จสิ้น',
            soapNote: 'S: ต้องการฟันสวยสม่ำเสมอ | O: ฟัน 11,12,21,22 ผิวไม่เรียบ | A: เหมาะกับ Veneer E.max | P: พิมพ์ปาก + สั่ง lab',
            beforeAfter: { before: 'veneer-before.jpg', after: '' },
            payments: [{ amount: 3000, method: 'cash', status: 'paid', date: '20 ม.ค. 2569', receiptNo: 'RCP-2569-0088' }], followup: null },
          { date: '9 ก.พ. 2569', treatment: 'วีเนียร์ 4 ซี่', doctor: 'หมอเบน', cost: 32000, status: 'เสร็จสิ้น (ผ่อน)',
            soapNote: 'S: มารับวีเนียร์ | O: ติดวีเนียร์ 4 ซี่ สีตรง | A: ผลดี | P: ติดตาม 14 วัน + ผ่อนชำระ',
            beforeAfter: { before: 'veneer-before.jpg', after: 'veneer-after.jpg' },
            payments: [
              { amount: 12000, method: 'credit', status: 'paid', date: '9 ก.พ. 2569', receiptNo: 'RCP-2569-0089' },
              { amount: 12000, method: '-', status: 'outstanding', date: 'งวด 2 - มี.ค.', receiptNo: '' },
              { amount: 8000, method: '-', status: 'outstanding', date: 'งวด 3 - เม.ย.', receiptNo: '' }
            ],
            followup: { dueDate: '23 ก.พ. 2569', type: 'นัดติดตาม 14 วัน', nextAppointment: '23 ก.พ. 2569' },
            chatId: 'chat-801-2' }
        ]}
      ]
    }
  ],

  followups: [
    { id: 1, patientName: 'คุณปิยะ', treatment: 'รากเทียม Phase 2', dueDate: '16 ก.พ. 2569', type: 'นัดติดตาม 7 วัน', status: 'pending', channel: 'LINE' },
    { id: 2, patientName: 'คุณสมชาย', treatment: 'ผ่าฟันคุด', dueDate: '10 ก.พ. 2569', type: 'ติดตามอาการหลังผ่า', status: 'pending', channel: 'LINE' },
    { id: 3, patientName: 'คุณพิมพ์', treatment: 'ฟอกสีฟัน', dueDate: '12 ก.พ. 2569', type: 'ติดตามผลฟอกสีฟัน', status: 'pending', channel: 'LINE' },
    { id: 4, patientName: 'คุณวิทย์', treatment: 'วีเนียร์', dueDate: '23 ก.พ. 2569', type: 'นัดติดตาม 14 วัน', status: 'pending', channel: 'LINE' }
  ],

  postChats: [
    { id: 1, patientName: 'คุณพิมพ์', treatment: 'ฟอกสีฟัน', openDate: '9 ก.พ. 2569', expiryDate: '16 ก.พ. 2569', lastMessage: 'ขอบคุณค่ะ ฟันขาวขึ้นมากเลย', unread: 0 },
    { id: 2, patientName: 'คุณวิทย์', treatment: 'วีเนียร์', openDate: '9 ก.พ. 2569', expiryDate: '16 ก.พ. 2569', lastMessage: 'วีเนียร์เข้ากับสีฟันดีมากครับ', unread: 1 },
    { id: 3, patientName: 'คุณนภา', treatment: 'ถอนฟัน', openDate: '7 ก.พ. 2569', expiryDate: '14 ก.พ. 2569', lastMessage: 'ยังเจ็บนิดหน่อยค่ะ ปกติไหมคะ?', unread: 2 }
  ],

  invoiceCounter: 42,

  slots: {
    '09-10': { closed: false, max: 3 },
    '10-11': { closed: false, max: 3 },
    '11-12': { closed: false, max: 3 },
    '13-14': { closed: false, max: 3 },
    '14-15': { closed: false, max: 3 },
    '15-16': { closed: false, max: 3 },
    '16-17': { closed: true, max: 3 },
    '17-18': { closed: false, max: 3 }
  }
};

/* ============================================
   Init
   ============================================ */
function initClinicBranch() {
  updateDateDisplay();
  renderAppointments();
  renderNotifications();
  updateStats();
  renderCapacityGrid();
  renderBookingList();
  renderPatientListView();
  renderPaymentTable();
  renderInstallments();
  renderFollowups();
  renderPostChats();
  setupClickOutside();

  // Handle URL parameters (e.g. from clinic.html navigation)
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  const hnParam = urlParams.get('hn');

  if (tabParam) {
    switchClinicTab(parseInt(tabParam));
  }
  if (hnParam) {
    const patient = BranchState.patients.find(p => p.hn === hnParam);
    if (patient) {
      selectPatient(patient.id);
    }
  }
}

/* ============================================
   Tab Switching
   ============================================ */
function switchClinicTab(tabNum) {
  BranchState.activeTab = tabNum;

  document.querySelectorAll('.clinic-tab-content').forEach(el => {
    el.classList.add('hidden');
  });
  const target = document.getElementById('clinic-tab-' + tabNum);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.clinic-nav').forEach(btn => {
    btn.classList.remove('active-menu');
    btn.classList.add('text-gray-600');
    btn.classList.remove('text-white');
  });
  const activeBtn = document.querySelector(`.clinic-nav[data-tab="${tabNum}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active-menu');
    activeBtn.classList.remove('text-gray-600');
  }

  if (tabNum === 6 && !BranchState.chartsInitialized) {
    setTimeout(initCharts, 100);
  }
}

/* ============================================
   TAB 1: Render Appointments
   ============================================ */
function renderAppointments() {
  const tbody = document.getElementById('appointment-table-body');
  if (!tbody) return;

  if (BranchState.appointments.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" class="px-6 py-12 text-center text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="font-medium">ไม่มีนัดหมายวันนี้</p>
      </td></tr>`;
    return;
  }

  let sorted;
  if (BranchState.groupByDoctor) {
    sorted = [...BranchState.appointments].sort((a, b) => a.doctor.localeCompare(b.doctor) || a.time.localeCompare(b.time));
  } else {
    sorted = [...BranchState.appointments].sort((a, b) => a.time.localeCompare(b.time));
  }

  let lastDoctor = '';
  tbody.innerHTML = sorted.map(a => {
    const statusInfo = getStatusInfo(a.status);
    const payInfo = getPaymentStatusInfo(a.paymentStatus);
    const docMeta = getDoctorMeta(a.doctor);

    let separator = '';
    if (BranchState.groupByDoctor && a.doctor !== lastDoctor) {
      separator = `<tr class="bg-${docMeta.color}-50"><td colspan="7" class="px-5 py-2">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-${docMeta.color}-100 rounded-full flex items-center justify-center">
            <span class="text-${docMeta.color}-600 font-bold text-xs">${docMeta.initial}</span>
          </div>
          <span class="font-semibold text-${docMeta.color}-700 text-sm">${a.doctor}</span>
        </div>
      </td></tr>`;
      lastDoctor = a.doctor;
    }

    return separator + `
      <tr class="appointment-row border-b border-gray-100 hover:bg-gray-50 transition-all" data-patient-id="${a.id}">
        <td class="px-5 py-4">
          <span class="text-sm font-semibold text-gray-800">${a.time}</span>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-3 cursor-pointer group" onclick="navigateToPatient(${a.id})">
            <div class="w-9 h-9 bg-${a.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-${a.color}-600 font-semibold text-sm">${a.initial}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm group-hover:text-dental-600 group-hover:underline transition-colors">${a.name}</p>
              <p class="text-xs text-gray-400">${a.hn}</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-300 group-hover:text-dental-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </div>
        </td>
        <td class="px-5 py-4">
          <span class="text-sm text-gray-700">${a.treatment}</span>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 bg-${docMeta.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-${docMeta.color}-600 font-semibold text-xs">${docMeta.initial}</span>
            </div>
            <span class="text-sm text-gray-700">${a.doctor}</span>
          </div>
        </td>
        <td class="px-5 py-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}">
            <span class="w-1.5 h-1.5 rounded-full ${statusInfo.dot}"></span>
            ${statusInfo.label}
          </span>
        </td>
        <td class="px-5 py-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${payInfo.class}">
            ${payInfo.label}
          </span>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-1">
            ${getActionButtons(a)}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Update group-by-doctor button label
  const label = document.getElementById('group-doctor-label');
  if (label) label.textContent = BranchState.groupByDoctor ? 'เรียงตามเวลา' : 'กรุ๊ปตามหมอ';
}

function toggleGroupByDoctor() {
  BranchState.groupByDoctor = !BranchState.groupByDoctor;
  renderAppointments();
}

function getStatusInfo(status) {
  const map = {
    pending:   { label: 'Pending', class: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    confirmed: { label: 'Confirmed', class: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    treating:  { label: 'กำลังรักษา', class: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
    payment:   { label: 'รอชำระ', class: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    completed: { label: 'เสร็จสิ้น', class: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    cancelled: { label: 'ยกเลิก', class: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
    noshow:    { label: 'No-show', class: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
  };
  return map[status] || map.pending;
}

function getPaymentStatusInfo(paymentStatus) {
  const map = {
    none:        { label: '-', class: 'text-gray-400' },
    outstanding: { label: 'ค้างชำระ', class: 'bg-orange-100 text-orange-700' },
    partial:     { label: 'ผ่อนชำระ', class: 'bg-purple-100 text-purple-700' },
    paid:        { label: 'ชำระแล้ว', class: 'bg-green-100 text-green-700' }
  };
  return map[paymentStatus] || map.none;
}

function getActionButtons(a) {
  switch (a.status) {
    case 'pending':
      return `
        <button onclick="updateStatus(${a.id}, 'confirmed')" class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600">ยืนยัน</button>`;
    case 'confirmed':
      return `
        <button onclick="updateStatus(${a.id}, 'treating')" class="px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg font-medium hover:bg-purple-600">รับคนไข้</button>`;
    case 'treating':
      return `<button onclick="updateStatus(${a.id}, 'payment')" class="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600">รักษาเสร็จ</button>`;
    case 'payment':
      return `<button onclick="openCloseCase(${a.id})" class="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600">ปิดเคส</button>`;
    case 'completed':
      return `<span class="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        เสร็จสิ้น
      </span>`;
    case 'noshow':
      return `<span class="text-red-500 text-xs font-medium">ไม่มา</span>`;
    case 'cancelled':
      return `<span class="text-gray-400 text-xs font-medium">ยกเลิก</span>`;
    default:
      return '';
  }
}

/* ============================================
   Status Update
   ============================================ */
function updateStatus(id, newStatus) {
  const appointment = BranchState.appointments.find(a => a.id === id);
  if (!appointment) return;

  appointment.status = newStatus;
  if (newStatus === 'payment') {
    appointment.paymentStatus = 'outstanding';
  }

  renderAppointments();
  renderCapacityGrid();
  renderBookingList();
  updateStats();
}

/* ============================================
   Close Case Modal
   ============================================ */
function openCloseCase(id) {
  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;

  BranchState.closingPatientId = id;

  document.getElementById('modal-avatar').className = `w-12 h-12 bg-${a.color}-100 rounded-full flex items-center justify-center`;
  document.getElementById('modal-initial').textContent = a.initial;
  document.getElementById('modal-initial').className = `font-bold text-lg text-${a.color}-600`;
  document.getElementById('modal-patient-name').textContent = a.name;
  document.getElementById('modal-treatment').textContent = a.treatment + ' - ' + a.doctor;
  document.getElementById('modal-cost').value = a.cost.toLocaleString();
  document.getElementById('modal-note').value = '';

  const radios = document.querySelectorAll('input[name="payType"]');
  radios.forEach(r => { if (r.value === 'full') r.checked = true; });

  const modal = document.getElementById('close-case-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function confirmCloseCase() {
  const id = BranchState.closingPatientId;
  if (!id) return;

  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;

  const payType = document.querySelector('input[name="payType"]:checked')?.value || 'full';
  const payMethod = document.getElementById('modal-payment-method').value;

  a.status = 'completed';
  a.paymentMethod = payMethod;

  if (payType === 'full') {
    a.paymentStatus = 'paid';
  } else {
    a.paymentStatus = 'partial';
    a.installment = { total: 3, paid: 1, perInstallment: Math.ceil(a.cost / 3), paidAmount: Math.ceil(a.cost / 3) };
  }

  closeModal('close-case-modal');
  BranchState.closingPatientId = null;

  BranchState.invoiceCounter++;
  const invoiceNum = 'INV-2569-' + String(BranchState.invoiceCounter).padStart(4, '0');
  document.getElementById('receipt-title').textContent = 'ใบเสร็จ #' + invoiceNum;
  document.getElementById('receipt-patient').textContent = a.name + ' - ' + a.treatment;
  document.getElementById('receipt-amount').textContent = '฿' + a.cost.toLocaleString();

  const receiptModal = document.getElementById('receipt-modal');
  receiptModal.classList.remove('hidden');
  receiptModal.classList.add('flex');

  renderAppointments();
  renderCapacityGrid();
  renderBookingList();
  renderPaymentTable();
  renderInstallments();
  updateStats();
}

/* ============================================
   Edit Booking Modal
   ============================================ */
function openEditBooking(id) {
  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;

  BranchState.editingPatientId = id;

  document.getElementById('edit-patient-name').value = a.name;

  const treatmentSelect = document.getElementById('edit-treatment');
  for (let opt of treatmentSelect.options) {
    if (opt.text === a.treatment) { opt.selected = true; break; }
  }

  const today = new Date();
  const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  document.getElementById('edit-date').value = dateStr;

  const timeSelect = document.getElementById('edit-time');
  for (let opt of timeSelect.options) {
    if (opt.text === a.time) { opt.selected = true; break; }
  }

  const doctorSelect = document.getElementById('edit-doctor');
  for (let opt of doctorSelect.options) {
    if (opt.text === a.doctor) { opt.selected = true; break; }
  }

  document.getElementById('edit-reason').value = '';

  const modal = document.getElementById('edit-booking-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function confirmEditBooking() {
  const id = BranchState.editingPatientId;
  if (!id) return;

  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;

  const oldTime = a.time;
  const oldTreatment = a.treatment;
  const oldDoctor = a.doctor;

  a.treatment = document.getElementById('edit-treatment').value;
  a.time = document.getElementById('edit-time').value;
  a.doctor = document.getElementById('edit-doctor').value;

  const reason = document.getElementById('edit-reason').value;

  const changes = [];
  if (oldTime !== a.time) changes.push('เลื่อนนัดจาก ' + oldTime + ' เป็น ' + a.time);
  if (oldTreatment !== a.treatment) changes.push('เปลี่ยนการรักษาเป็น ' + a.treatment);
  if (oldDoctor !== a.doctor) changes.push('เปลี่ยนแพทย์เป็น ' + a.doctor);

  if (changes.length > 0) {
    const logEntry = document.createElement('div');
    logEntry.className = 'flex items-start gap-3 p-3 bg-gray-50 rounded-lg';
    logEntry.innerHTML = `
      <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
      <div><p class="text-sm text-gray-800"><strong>พี่แนน</strong> แก้ไขนัด ${a.name}: ${changes.join(', ')}${reason ? ' - ' + reason : ''}</p><p class="text-xs text-gray-400">เมื่อสักครู่</p></div>
    `;
    const auditLog = document.getElementById('audit-log');
    if (auditLog) auditLog.prepend(logEntry);
  }

  closeModal('edit-booking-modal');
  BranchState.editingPatientId = null;

  renderAppointments();
  renderCapacityGrid();
  renderBookingList();
  updateStats();
}

/* ============================================
   Modal Utilities
   ============================================ */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/* ============================================
   Date Navigation
   ============================================ */
function changeDate(offset) {
  BranchState.currentDate.setDate(BranchState.currentDate.getDate() + offset);
  updateDateDisplay();
}

function goToday() {
  BranchState.currentDate = new Date();
  updateDateDisplay();
}

function updateDateDisplay() {
  const d = BranchState.currentDate;
  const days = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const thaiYear = d.getFullYear() + 543;
  const el = document.getElementById('current-date');
  if (el) el.textContent = `${days[d.getDay()]}ที่ ${d.getDate()} ${months[d.getMonth()]} ${thaiYear}`;
}

/* ============================================
   Notifications
   ============================================ */
function renderNotifications() {
  const list = document.getElementById('noti-list');
  if (!list) return;

  list.innerHTML = BranchState.notifications.map(n => {
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
  document.getElementById('noti-dropdown').classList.toggle('hidden');
}

function markAllRead() {
  BranchState.notifications.forEach(n => n.read = true);
  const badge = document.getElementById('noti-badge');
  if (badge) badge.classList.add('hidden');
  renderNotifications();
}

function setupClickOutside() {
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('noti-dropdown');
    const bell = document.getElementById('noti-bell');
    if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

/* ============================================
   Hover Tooltip
   ============================================ */
function showTooltip(event, patientId) {
  const a = BranchState.appointments.find(apt => apt.id === patientId);
  if (!a) return;

  const tooltip = document.getElementById('patient-tooltip');
  document.getElementById('tooltip-avatar').className = `w-12 h-12 bg-${a.color}-100 rounded-full flex items-center justify-center`;
  document.getElementById('tooltip-initial').textContent = a.initial;
  document.getElementById('tooltip-initial').className = `font-bold text-lg text-${a.color}-600`;
  document.getElementById('tooltip-name').textContent = a.name;
  document.getElementById('tooltip-hn').textContent = a.hn + ' | ' + BRANCH_NAME;
  document.getElementById('tooltip-phone').textContent = a.phone;
  document.getElementById('tooltip-channel').textContent = a.channel;
  document.getElementById('tooltip-treatment').textContent = a.treatment;
  document.getElementById('tooltip-cost').textContent = '฿' + a.cost.toLocaleString();
  document.getElementById('tooltip-note').textContent = a.note;

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
   Stats (Tab 1 footer & status bar)
   ============================================ */
function updateStats() {
  const list = BranchState.appointments;
  const pending = list.filter(a => a.status === 'pending').length;
  const confirmed = list.filter(a => a.status === 'confirmed').length;
  const treating = list.filter(a => a.status === 'treating').length;
  const payment = list.filter(a => a.status === 'payment').length;
  const completed = list.filter(a => a.status === 'completed').length;
  const noshow = list.filter(a => a.status === 'noshow').length;
  const total = list.length;

  const setTextSafe = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

  setTextSafe('today-total', total);
  setTextSafe('stat-pending', pending + ' Pending');
  setTextSafe('stat-confirmed', confirmed + ' Confirmed');
  setTextSafe('stat-treating', treating + ' กำลังรักษา');
  setTextSafe('stat-payment', payment + ' รอชำระ');
  setTextSafe('stat-completed', completed + ' เสร็จสิ้น');
  setTextSafe('stat-noshow', noshow + ' No-show');

  setTextSafe('footer-total', total);
  setTextSafe('footer-closed', completed);
  setTextSafe('footer-noshow', noshow);

  const totalRevenue = list.filter(a => a.paymentStatus === 'paid' || a.paymentStatus === 'partial')
    .reduce((sum, a) => {
      if (a.paymentStatus === 'paid') return sum + a.cost;
      if (a.installment) return sum + a.installment.paidAmount;
      return sum;
    }, 0);
  setTextSafe('footer-revenue', '฿' + totalRevenue.toLocaleString());
}

/* ============================================
   TAB 2: Booking List
   ============================================ */
function renderBookingList() {
  const container = document.getElementById('booking-list');
  if (!container) return;

  const sorted = [...BranchState.appointments].sort((a, b) => a.time.localeCompare(b.time));

  container.innerHTML = sorted.map(a => {
    const statusInfo = getStatusInfo(a.status);
    const canEdit = ['pending', 'confirmed'].includes(a.status);
    const canCancel = ['pending', 'confirmed'].includes(a.status);

    return `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
        <div class="flex items-center gap-3 cursor-pointer group" onclick="navigateToPatient(${a.id})">
          <div class="w-10 h-10 bg-${a.color}-100 rounded-full flex items-center justify-center">
            <span class="text-${a.color}-600 font-semibold">${a.initial}</span>
          </div>
          <div>
            <p class="font-medium text-gray-800 group-hover:text-dental-600 group-hover:underline transition-colors">${a.name} <span class="text-xs text-gray-400">${a.hn}</span></p>
            <p class="text-sm text-gray-500">${a.time} | ${a.treatment} | ${a.doctor}</p>
          </div>
          <svg class="w-3.5 h-3.5 text-gray-300 group-hover:text-dental-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}">
            <span class="w-1.5 h-1.5 rounded-full ${statusInfo.dot}"></span>
            ${statusInfo.label}
          </span>
          ${canEdit ? `<button onclick="openEditBooking(${a.id})" class="px-2 py-1.5 text-gray-400 hover:text-dental-600 transition-colors" title="แก้ไข / เลื่อนนัด">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>` : ''}
          ${canCancel ? `<button onclick="cancelBooking(${a.id})" class="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100 transition-colors">ยกเลิก</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function cancelBooking(id) {
  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;
  if (!confirm('ยกเลิกนัด ' + a.name + ' (' + a.time + ' ' + a.treatment + ') ?')) return;

  a.status = 'cancelled';
  renderAppointments();
  renderCapacityGrid();
  renderBookingList();
  updateStats();

  const auditLog = document.getElementById('audit-log');
  if (auditLog) {
    const logEntry = document.createElement('div');
    logEntry.className = 'flex items-start gap-3 p-3 bg-gray-50 rounded-lg';
    logEntry.innerHTML = `
      <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
      <div><p class="text-sm text-gray-800"><strong>พี่แนน</strong> ยกเลิกนัด ${a.name} ${a.time} ${a.treatment}</p><p class="text-xs text-gray-400">เมื่อสักครู่</p></div>
    `;
    auditLog.prepend(logEntry);
  }
}

function toggleSlot(slotKey) {
  if (!BranchState.slots[slotKey]) BranchState.slots[slotKey] = { closed: false, max: 3 };
  BranchState.slots[slotKey].closed = !BranchState.slots[slotKey].closed;
  renderCapacityGrid();
}

function adjustMaxCapacity(slotKey, delta) {
  if (!BranchState.slots[slotKey]) BranchState.slots[slotKey] = { closed: false, max: 3 };
  BranchState.slots[slotKey].max = Math.max(1, BranchState.slots[slotKey].max + delta);
  renderCapacityGrid();
}

function renderCapacityGrid() {
  const container = document.getElementById('capacity-grid');
  if (!container) return;

  container.innerHTML = SLOT_DEFINITIONS.map(slot => {
    const slotState = BranchState.slots[slot.key] || { closed: false, max: 3 };
    const appointments = getAppointmentsForSlot(slot.key);
    const count = appointments.length;
    const max = slotState.max;
    const pct = max > 0 ? Math.min(Math.round((count / max) * 100), 100) : 0;

    // Doctor badges
    const doctorsInSlot = [...new Set(appointments.map(a => a.doctor))];
    const doctorBadgesHTML = doctorsInSlot.map(docName => {
      const meta = getDoctorMeta(docName);
      const docCount = appointments.filter(a => a.doctor === docName).length;
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-${meta.color}-100 text-${meta.color}-700 rounded-full text-xs font-medium" title="${docName}: ${docCount} นัด">
        <span class="w-4 h-4 bg-${meta.color}-200 rounded-full flex items-center justify-center text-[10px] font-bold">${meta.initial}</span>${docCount}</span>`;
    }).join('');

    if (slotState.closed) {
      return `
        <div class="capacity-slot border border-dashed border-red-300 rounded-xl p-4 text-center bg-red-50">
          <p class="text-sm text-red-500">${slot.label}</p>
          <p class="text-lg font-bold text-red-600 mt-1">ปิดรับ</p>
          ${count > 0 ? `<p class="text-xs text-red-400 mt-1">(${count} นัดอยู่แล้ว)</p>` : ''}
          ${doctorBadgesHTML ? `<div class="flex flex-wrap items-center justify-center gap-1 mt-2">${doctorBadgesHTML}</div>` : ''}
          <button onclick="toggleSlot('${slot.key}')" class="mt-2 text-xs text-red-600 hover:text-red-800 underline">เปิดรับ</button>
        </div>`;
    }

    const barColor = pct >= 100 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-green-500';
    const fullLabel = pct >= 100 ? '<span class="text-xs text-red-500 font-medium mt-1 inline-block">เต็ม</span>' : '';

    return `
      <div class="capacity-slot border border-gray-200 rounded-xl p-4 text-center">
        <p class="text-sm text-gray-500">${slot.label}</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">${count} <span class="text-sm text-gray-400">/ ${max}</span></p>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2"><div class="${barColor} h-2 rounded-full" style="width:${pct}%"></div></div>
        ${fullLabel}
        ${doctorBadgesHTML ? `<div class="flex flex-wrap items-center justify-center gap-1 mt-2">${doctorBadgesHTML}</div>` : ''}
        <div class="flex items-center justify-center gap-2 mt-2">
          <button onclick="adjustMaxCapacity('${slot.key}', -1)" class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold">-</button>
          <span class="text-xs text-gray-500">Max: ${max}</span>
          <button onclick="adjustMaxCapacity('${slot.key}', 1)" class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold">+</button>
        </div>
        <button onclick="toggleSlot('${slot.key}')" class="mt-2 text-xs text-gray-500 hover:text-red-500 underline">ปิดรับ</button>
      </div>`;
  }).join('');
}

function navigateToPatient(appointmentId) {
  const appointment = BranchState.appointments.find(a => a.id === appointmentId);
  if (!appointment) return;
  const patient = BranchState.patients.find(p => p.hn === appointment.hn);
  if (!patient) return;
  switchClinicTab(3);
  selectPatient(patient.id);
}

/* ============================================
   TAB 3: Patient History
   ============================================ */
function renderPatientListView(filter) {
  const detail = document.getElementById('patient-detail');
  if (!detail) return;

  // Update header to list mode
  const header = document.getElementById('tab3-header');
  if (header) {
    header.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <nav class="flex items-center gap-1.5 text-sm mb-1">
            <span class="font-semibold text-dental-700">ประวัติคนไข้</span>
          </nav>
          <p class="text-xs text-gray-400">ประวัติการรักษา, แพ็กเกจ, หมายเหตุทางการแพทย์</p>
        </div>
        <div class="relative">
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="ค้นหาชื่อ / HN..." class="w-72 pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500" oninput="renderPatientListView(this.value)" id="patient-search-input" autocomplete="off" value="${filter || ''}" />
        </div>
      </div>`;
  }

  BranchState.selectedPatientId = null;

  let patients = BranchState.patients;
  if (filter && filter.trim()) {
    const q = filter.toLowerCase();
    patients = patients.filter(p =>
      p.name.toLowerCase().includes(q) || p.hn.toLowerCase().includes(q)
    );
  }

  if (patients.length === 0) {
    detail.innerHTML = `
      <div class="flex items-center justify-center h-full text-gray-400">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <p>ไม่พบคนไข้ที่ค้นหา</p>
        </div>
      </div>`;
    return;
  }

  const rowsHTML = patients.map(p => {
    const summary = getPatientSummary(p);
    const activeOrders = p.orders.filter(o => o.status === 'active').length;
    const lastVisitDate = p.orders.length > 0 ? p.orders[0].createdDate : '-';
    return `
      <tr onclick="selectPatient(${p.id})" class="border-b border-gray-100 hover:bg-dental-50 cursor-pointer transition-all group">
        <td class="pl-5 pr-2 py-4 w-8">
          <svg class="w-4 h-4 text-gray-300 group-hover:text-dental-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </td>
        <td class="px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-${p.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-${p.color}-600 font-semibold">${p.initial}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm group-hover:text-dental-600 transition-colors">${p.name}</p>
              <p class="text-xs text-gray-400">${p.hn}</p>
            </div>
          </div>
        </td>
        <td class="px-5 py-4">
          <span class="text-sm text-gray-600">${p.gender === 'ชาย' || p.gender === 'Male' ? '♂ ' + p.gender : '♀ ' + p.gender}</span>
          <p class="text-xs text-gray-400">อายุ ${p.age} ปี</p>
        </td>
        <td class="px-5 py-4"><span class="text-sm text-gray-600">${p.phone}</span></td>
        <td class="px-5 py-4"><span class="text-sm text-gray-600">${p.channel}</span></td>
        <td class="px-5 py-4 text-center"><span class="text-sm text-gray-700 font-medium">${summary.visits}</span></td>
        <td class="px-5 py-4 text-center">
          ${activeOrders > 0
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${activeOrders} active</span>`
            : '<span class="text-xs text-gray-400">-</span>'}
        </td>
        <td class="px-5 py-4 text-right">
          <span class="text-sm font-bold text-gray-800">฿${summary.totalPaid.toLocaleString()}</span>
          ${summary.outstanding > 0 ? `<p class="text-[10px] text-orange-600 font-medium">ค้าง ฿${summary.outstanding.toLocaleString()}</p>` : ''}
        </td>
        <td class="px-5 py-4"><span class="text-xs text-gray-500">${lastVisitDate}</span></td>
      </tr>`;
  }).join('');

  detail.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-bold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          รายชื่อคนไข้
          <span class="text-xs text-gray-400 font-normal">${patients.length} คน</span>
        </h3>
      </div>
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="pl-5 pr-2 py-3 w-8"></th>
            <th class="text-left px-5 py-3 text-xs text-gray-500 font-medium">ชื่อคนไข้</th>
            <th class="text-left px-5 py-3 text-xs text-gray-500 font-medium">เพศ / อายุ</th>
            <th class="text-left px-5 py-3 text-xs text-gray-500 font-medium">โทรศัพท์</th>
            <th class="text-left px-5 py-3 text-xs text-gray-500 font-medium">ช่องทาง</th>
            <th class="text-center px-5 py-3 text-xs text-gray-500 font-medium">Visits</th>
            <th class="text-center px-5 py-3 text-xs text-gray-500 font-medium">ออเดอร์</th>
            <th class="text-right px-5 py-3 text-xs text-gray-500 font-medium">ยอดสะสม</th>
            <th class="text-left px-5 py-3 text-xs text-gray-500 font-medium">เข้ารับล่าสุด</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>`;
}

function backToPatientList() {
  renderPatientListView();
}

function getPatientSummary(patient) {
  let totalPaid = 0, outstanding = 0, followups = 0, visits = 0, totalDiscount = 0;
  patient.orders.forEach(o => {
    totalDiscount += (o.discount || 0);
    o.cases.forEach(c => {
      visits++;
      c.payments.forEach(p => {
        if (p.status === 'paid') totalPaid += p.amount;
        else if (p.status === 'outstanding') outstanding += p.amount;
      });
      if (c.followup) followups++;
    });
  });
  return { totalPaid, outstanding, followups, visits, totalDiscount };
}

const ORDER_STATUS_MAP = {
  active: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  pending: { label: 'Draft', cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  noshow: { label: 'Cancelled', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' }
};
const METHOD_LABELS = { cash: 'เงินสด', transfer: 'โอนเงิน', credit: 'บัตรเครดิต', insurance: 'ประกัน' };

function selectPatient(patientId) {
  BranchState.selectedPatientId = patientId;

  const p = BranchState.patients.find(pt => pt.id === patientId);
  if (!p) return;

  // Update header to detail mode with back button
  const header = document.getElementById('tab3-header');
  if (header) {
    header.innerHTML = `
      <div class="flex items-center gap-3">
        <button onclick="backToPatientList()" class="p-2 rounded-xl hover:bg-gray-100 transition-all flex-shrink-0" title="กลับ">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <nav class="flex items-center gap-1.5 text-sm mb-0.5">
            <a onclick="backToPatientList()" class="text-gray-400 hover:text-dental-600 cursor-pointer transition-colors">ประวัติคนไข้</a>
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="font-semibold text-dental-700">${p.name}</span>
          </nav>
          <p class="text-xs text-gray-400">${p.hn} | ${BRANCH_NAME}</p>
        </div>
      </div>`;
  }

  const detail = document.getElementById('patient-detail');
  if (!detail) return;

  const summary = getPatientSummary(p);
  const orderStatusMap = ORDER_STATUS_MAP;

  // ===== LAYER 1: Patient Info Card =====
  const hasAllergy = p.allergies && p.allergies !== 'ไม่มี';
  const hasCondition = p.conditions && p.conditions.length > 0;
  const hasDoctorNote = p.doctorNote && p.doctorNote.length > 0;
  const genderIcon = p.gender === 'ชาย' || p.gender === 'Male' ? '♂' : '♀';
  const genderColor = p.gender === 'ชาย' || p.gender === 'Male' ? 'text-blue-500' : 'text-pink-500';

  const layer1HTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-start gap-4 mb-4">
        <div class="w-16 h-16 bg-${p.color}-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-${p.color}-600 font-bold text-2xl">${p.initial}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-gray-800">${p.name}</h2>
            <span class="${genderColor} text-lg font-bold">${genderIcon}</span>
          </div>
          <p class="text-sm text-gray-500">${p.hn} | ${BRANCH_NAME}</p>
          <p class="text-xs text-gray-400 mt-0.5">${p.gender} • อายุ ${p.age} ปี • เกิด ${p.birthday}</p>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <button class="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all" title="โทร ${p.phone}">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </button>
          <button class="p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-all" title="แชท">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>
          <button class="p-2 bg-dental-50 rounded-lg hover:bg-dental-100 transition-all" title="สร้างออเดอร์ใหม่">
            <svg class="w-4 h-4 text-dental-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-3">
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-500">โทรศัพท์</p>
          <p class="text-sm font-medium text-gray-800">${p.phone}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-500">ช่องทาง</p>
          <p class="text-sm font-medium text-gray-800">${p.channel}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-500">Email</p>
          <p class="text-sm font-medium text-gray-800 truncate">${p.email || '-'}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-500">กรุ๊ปเลือด</p>
          <p class="text-sm font-medium text-gray-800">${p.bloodType}</p>
        </div>
        <div class="${hasAllergy ? 'bg-red-50 border border-red-200' : 'bg-gray-50'} rounded-xl p-3">
          <p class="text-xs ${hasAllergy ? 'text-red-500 font-medium' : 'text-gray-500'}">แพ้ยา / วัสดุ ${hasAllergy ? '⚠️' : ''}</p>
          <p class="text-sm font-medium ${hasAllergy ? 'text-red-700' : 'text-gray-800'}">${p.allergies}</p>
        </div>
        <div class="${hasCondition ? 'bg-red-50 border border-red-200' : 'bg-gray-50'} rounded-xl p-3">
          <p class="text-xs ${hasCondition ? 'text-red-500 font-medium' : 'text-gray-500'}">โรคประจำตัว ${hasCondition ? '⚠️' : ''}</p>
          <p class="text-sm font-medium ${hasCondition ? 'text-red-700' : 'text-gray-800'}">${p.conditions || 'ไม่มี'}</p>
        </div>
      </div>

      ${hasDoctorNote ? `
      <div class="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
        <svg class="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        <div>
          <p class="text-xs text-yellow-700 font-semibold">Doctor Note</p>
          <p class="text-sm text-yellow-800">${p.doctorNote}</p>
        </div>
      </div>` : ''}
    </div>`;

  // ===== SUMMARY CARDS =====
  const summaryHTML = `
    <div class="grid grid-cols-4 gap-3">
      <div class="bg-dental-50 rounded-xl p-4 border border-dental-100">
        <p class="text-xs text-dental-600 font-medium">ยอดชำระสะสม</p>
        <p class="text-lg font-bold text-dental-800 mt-1">฿${summary.totalPaid.toLocaleString()}</p>
        <p class="text-xs text-dental-500 mt-0.5">${summary.visits} ครั้ง</p>
      </div>
      <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
        <p class="text-xs text-orange-600 font-medium">ค้างชำระ</p>
        <p class="text-lg font-bold ${summary.outstanding > 0 ? 'text-orange-700' : 'text-gray-400'} mt-1">฿${summary.outstanding.toLocaleString()}</p>
        ${summary.outstanding > 0 ? '<p class="text-xs text-orange-500 mt-0.5">ต้องติดตาม</p>' : '<p class="text-xs text-gray-400 mt-0.5">ไม่มียอดค้าง</p>'}
      </div>
      <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
        <p class="text-xs text-amber-600 font-medium">Follow-up</p>
        <p class="text-lg font-bold ${summary.followups > 0 ? 'text-amber-700' : 'text-gray-400'} mt-1">${summary.followups} รายการ</p>
        ${summary.followups > 0 ? '<p class="text-xs text-amber-500 mt-0.5">รอติดตามผล</p>' : '<p class="text-xs text-gray-400 mt-0.5">ไม่มีรายการ</p>'}
      </div>
      <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
        <p class="text-xs text-purple-600 font-medium">ส่วนลดสะสม</p>
        <p class="text-lg font-bold ${summary.totalDiscount > 0 ? 'text-purple-700' : 'text-gray-400'} mt-1">฿${summary.totalDiscount.toLocaleString()}</p>
        <p class="text-xs text-purple-500 mt-0.5">${p.orders.length} ออเดอร์</p>
      </div>
    </div>

    ${summary.outstanding > 0 ? `
    <div class="bg-orange-50 border border-orange-300 rounded-xl p-4 flex items-center gap-3">
      <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <div class="flex-1">
        <p class="font-semibold text-orange-800 text-sm">มียอดค้างชำระ ฿${summary.outstanding.toLocaleString()}</p>
        <p class="text-xs text-orange-600">กรุณาติดตามการชำระเงินกับคนไข้</p>
      </div>
      <button class="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600">ส่งแจ้งเตือน</button>
    </div>` : ''}`;

  // ===== ORDERS TABLE =====
  const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;

  const ordersRowsHTML = p.orders.map(order => {
    const orderTotal = order.cases.reduce((s, c) => s + c.cost, 0);
    const orderDiscount = order.discount || 0;
    const orderNet = orderTotal - orderDiscount;
    const orderPaid = order.cases.reduce((s, c) => s + c.payments.filter(pay => pay.status === 'paid').reduce((s2, pay) => s2 + pay.amount, 0), 0);
    const orderOutstanding = orderNet - orderPaid;
    const oStatus = orderStatusMap[order.status] || orderStatusMap.pending;
    const completedCases = order.cases.filter(c => c.status.includes('เสร็จ')).length;
    const totalCases = order.cases.length;

    const typeBadge = order.type === 'package'
      ? '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full font-medium">Package</span>'
      : '<span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium">Visit</span>';

    const dateRange = order.cases.length > 1
      ? order.cases[0].date + ' — ' + order.cases[order.cases.length - 1].date
      : order.cases[0].date;

    return `
      <tr class="border-b border-gray-100 hover:bg-gray-50 transition-all">
        <td class="px-4 py-3 text-center">
          <button onclick="showOrderDetail(${order.id}, 'treatment')" class="p-2 rounded-lg hover:bg-dental-50 text-gray-400 hover:text-dental-600 transition-all" title="ดูรายละเอียดการรักษา">
            ${eyeIcon}
          </button>
        </td>
        <td class="px-4 py-3 text-center">
          <button onclick="showOrderDetail(${order.id}, 'payment')" class="p-2 rounded-lg hover:bg-dental-50 text-gray-400 hover:text-dental-600 transition-all relative" title="ดูรายละเอียดการชำระเงิน">
            ${eyeIcon}
            ${orderOutstanding > 0 ? '<span class="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>' : ''}
          </button>
        </td>
        <td class="px-4 py-3">
          <span class="text-xs text-gray-400 font-mono">${order.orderNo}</span>
        </td>
        <td class="px-4 py-3">
          <p class="text-sm font-semibold text-gray-800">${order.name}</p>
          ${order.serviceType ? `<p class="text-[10px] text-dental-600 mt-0.5">${order.serviceType}</p>` : ''}
        </td>
        <td class="px-4 py-3">${typeBadge}</td>
        <td class="px-4 py-3"><span class="text-xs text-gray-600">${dateRange}</span></td>
        <td class="px-4 py-3 text-center"><span class="text-sm ${completedCases === totalCases ? 'text-green-600 font-semibold' : 'text-gray-700'}">${completedCases}/${totalCases}</span></td>
        <td class="px-4 py-3 text-right">
          <span class="text-sm font-bold text-gray-800">฿${orderNet.toLocaleString()}</span>
          ${orderOutstanding > 0 ? `<p class="text-[10px] text-orange-600 font-medium">ค้าง ฿${orderOutstanding.toLocaleString()}</p>` : ''}
        </td>
        <td class="px-4 py-3 text-center">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${oStatus.cls}">
            <span class="w-1.5 h-1.5 rounded-full ${oStatus.dot}"></span>${oStatus.label}
          </span>
        </td>
      </tr>`;
  }).join('');

  // ===== FINAL RENDER =====
  detail.innerHTML = `
    <div class="space-y-5">
      ${layer1HTML}
      ${summaryHTML}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            ออเดอร์ & ประวัติการรักษา
            <span class="text-xs text-gray-400 font-normal">${p.orders.length} ออเดอร์</span>
          </h3>
        </div>
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-medium">การรักษา</th>
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-medium">การชำระเงิน</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-medium">Order No</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-medium">ชื่อออเดอร์</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-medium">ประเภท</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-medium">วันที่</th>
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-medium">เคส</th>
              <th class="text-right px-4 py-3 text-xs text-gray-500 font-medium">ยอดสุทธิ</th>
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${ordersRowsHTML}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================
   Show Order Detail Modal (Treatment / Payment)
   ============================================ */
function showOrderDetail(orderId, tab) {
  const p = BranchState.patients.find(pt => pt.id === BranchState.selectedPatientId);
  if (!p) return;
  const order = p.orders.find(o => o.id === orderId);
  if (!order) return;

  const detail = document.getElementById('patient-detail');
  if (!detail) return;

  const orderStatusMap = ORDER_STATUS_MAP;
  const methodLabels = METHOD_LABELS;
  const oStatus = orderStatusMap[order.status] || orderStatusMap.pending;
  const orderTotal = order.cases.reduce((s, c) => s + c.cost, 0);
  const orderDiscount = order.discount || 0;
  const orderNet = orderTotal - orderDiscount;
  const orderPaid = order.cases.reduce((s, c) => s + c.payments.filter(pay => pay.status === 'paid').reduce((s2, pay) => s2 + pay.amount, 0), 0);
  const orderOutstanding = orderNet - orderPaid;

  // Update header with back to patient
  const headerEl = document.getElementById('tab3-header');
  const tabLabel = tab === 'treatment' ? 'การรักษา' : 'การชำระเงิน';
  const tabIcon = tab === 'treatment'
    ? '<svg class="w-5 h-5 text-dental-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>'
    : '<svg class="w-5 h-5 text-dental-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>';

  if (headerEl) {
    headerEl.innerHTML = `
      <div class="flex items-center gap-3">
        <button onclick="selectPatient(${p.id})" class="p-2 rounded-xl hover:bg-gray-100 transition-all flex-shrink-0" title="กลับ">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <nav class="flex items-center gap-1.5 text-sm mb-0.5">
            <a onclick="backToPatientList()" class="text-gray-400 hover:text-dental-600 cursor-pointer transition-colors">ประวัติคนไข้</a>
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <a onclick="selectPatient(${p.id})" class="text-gray-400 hover:text-dental-600 cursor-pointer transition-colors">${p.name}</a>
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="font-semibold text-dental-700 flex items-center gap-1.5">${tabIcon} ${tabLabel}</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${oStatus.cls} ml-1"><span class="w-1.5 h-1.5 rounded-full ${oStatus.dot}"></span>${oStatus.label}</span>
          </nav>
          <p class="text-xs text-gray-400">${order.orderNo} • ${order.name}</p>
        </div>
      </div>`;
  }

  // Body
  let bodyHTML = '';
  if (tab === 'treatment') {
    bodyHTML = order.cases.map((c, ci) => {
      const caseStatusCls = c.status.includes('เสร็จ') ? 'bg-green-100 text-green-700'
        : c.status === 'No-show' ? 'bg-red-100 text-red-700'
        : c.status === 'รอชำระ' ? 'bg-orange-100 text-orange-700'
        : c.status === 'กำลังรักษา' ? 'bg-purple-100 text-purple-700'
        : 'bg-blue-100 text-blue-700';
      const docMeta = getDoctorMeta(c.doctor);
      const timelineDot = c.status.includes('เสร็จ') ? 'bg-green-500' : c.status === 'No-show' ? 'bg-red-500' : c.status === 'กำลังรักษา' ? 'bg-purple-500' : 'bg-blue-500';
      const caseLabel = order.cases.length > 1 ? `<span class="text-[10px] text-gray-400 font-mono mr-1">${ci === order.cases.length - 1 ? '└─' : '├─'}</span><span class="text-[10px] text-gray-400">Case ${ci + 1}</span>` : '';

      const soapHTML = c.soapNote ? (() => {
        const parts = c.soapNote.split(' | ');
        if (parts.length >= 4) {
          return `<div class="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p class="text-xs text-blue-700 font-semibold mb-1.5">SOAP Note</p>
            <div class="grid grid-cols-2 gap-1.5">
              ${parts.map(part => { const [key, ...rest] = part.split(': '); const val = rest.join(': '); return `<div class="text-xs"><span class="font-semibold text-blue-600">${key}:</span> <span class="text-gray-700">${val}</span></div>`; }).join('')}
            </div>
          </div>`;
        }
        return `<div class="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100"><p class="text-xs text-blue-700 font-semibold mb-1">Note</p><p class="text-xs text-gray-700">${c.soapNote}</p></div>`;
      })() : '';

      const beforeAfterHTML = c.beforeAfter ? `
        <div class="mt-2 flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="text-xs text-gray-600 font-medium">Before</span>
            ${c.beforeAfter.before ? '<span class="w-2 h-2 bg-green-500 rounded-full"></span>' : '<span class="w-2 h-2 bg-gray-300 rounded-full"></span>'}
          </div>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="text-xs text-gray-600 font-medium">After</span>
            ${c.beforeAfter.after ? '<span class="w-2 h-2 bg-green-500 rounded-full"></span>' : '<span class="w-2 h-2 bg-gray-300 rounded-full"></span>'}
          </div>
        </div>` : '';

      const followupHTML = c.followup ? `
        <div class="mt-2 flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
          <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div class="flex-1"><span class="text-xs text-amber-700 font-medium">Follow-up: ${c.followup.type}</span>${c.followup.nextAppointment ? `<span class="text-xs text-amber-500 ml-2">| นัดถัดไป: ${c.followup.nextAppointment}</span>` : ''}</div>
          <span class="text-xs text-amber-600 font-semibold">${c.followup.dueDate}</span>
        </div>` : '';

      const chatHTML = c.chatId ? `
        <div class="mt-2 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-200 cursor-pointer hover:bg-green-100 transition-all">
          <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <span class="text-xs text-green-700 font-medium">Post-treatment Chat</span>
          <svg class="w-3 h-3 text-green-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>` : '';

      return `
        <div class="${ci > 0 ? 'border-t border-gray-100 pt-4 mt-4' : ''} relative pl-5">
          <div class="absolute left-0 top-${ci > 0 ? '5' : '1'} w-2 h-2 rounded-full ${timelineDot}"></div>
          ${ci < order.cases.length - 1 ? '<div class="absolute left-0.5 top-3 w-0.5 h-full bg-gray-200"></div>' : ''}
          ${caseLabel ? `<div class="mb-1.5 flex items-center gap-1">${caseLabel}</div>` : ''}
          <div class="flex items-start justify-between mb-1">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-${docMeta.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-${docMeta.color}-600 font-semibold text-xs">${docMeta.initial}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">${c.treatment}</p>
                <p class="text-xs text-gray-500">${c.date} • ${c.doctor}</p>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-bold text-gray-800 text-sm">฿${c.cost.toLocaleString()}</p>
              <span class="text-xs px-2 py-0.5 rounded-full ${caseStatusCls}">${c.status}</span>
            </div>
          </div>
          ${soapHTML}
          ${beforeAfterHTML}
          ${followupHTML}
          ${chatHTML}
        </div>`;
    }).join('');
  } else {
    // Payment tab
    bodyHTML = order.cases.map((c, ci) => {
      const casePaid = c.payments.filter(pay => pay.status === 'paid').reduce((s, pay) => s + pay.amount, 0);
      const caseOutstanding = c.payments.filter(pay => pay.status === 'outstanding').reduce((s, pay) => s + pay.amount, 0);
      const casePending = c.payments.filter(pay => pay.status === 'pending').reduce((s, pay) => s + pay.amount, 0);
      const hasMultiplePayments = c.payments.length > 1;

      if (c.payments.length === 0) {
        return `<div class="${ci > 0 ? 'border-t border-gray-100 pt-4 mt-4' : ''}">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-mono text-gray-400">${order.cases.length > 1 ? (ci === order.cases.length - 1 ? '└─' : '├─') : ''}</span>
            <span class="text-xs font-semibold text-gray-700">Case ${ci + 1}: ${c.treatment}</span>
            <span class="text-xs text-gray-400">• ${c.date}</span>
          </div>
          <p class="text-xs text-gray-400 ml-6">ไม่มีรายการชำระ</p>
        </div>`;
      }

      return `<div class="${ci > 0 ? 'border-t border-gray-100 pt-4 mt-4' : ''}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-gray-400">${order.cases.length > 1 ? (ci === order.cases.length - 1 ? '└─' : '├─') : ''}</span>
            <span class="text-xs font-semibold text-gray-700">Case ${ci + 1}: ${c.treatment}</span>
            <span class="text-xs text-gray-400">• ${c.date}</span>
            ${hasMultiplePayments ? `<span class="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-medium">ผ่อน ${c.payments.length} งวด</span>` : ''}
          </div>
          <span class="text-xs font-bold text-gray-800">฿${c.cost.toLocaleString()}</span>
        </div>
        <div class="ml-6 space-y-1.5">
          ${c.payments.map((pay, pi) => {
            const payIcon = pay.status === 'paid' ? '<svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
              : pay.status === 'outstanding' ? '<svg class="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
              : '<svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
            const payLabel = pay.status === 'paid' ? 'ชำระแล้ว' : pay.status === 'outstanding' ? 'ค้างชำระ' : 'รอชำระ';
            const payStatusCls = pay.status === 'paid' ? 'text-green-600 bg-green-50' : pay.status === 'outstanding' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 bg-gray-100';
            const payMethod = pay.method !== '-' ? (methodLabels[pay.method] || pay.method) : '';
            const installLabel = hasMultiplePayments ? `งวด ${pi + 1}/${c.payments.length}` : '';
            return `<div class="flex items-center gap-2 text-xs py-1.5 ${pi > 0 ? 'border-t border-gray-50' : ''}">
              ${payIcon}
              <span class="font-bold text-gray-800">฿${pay.amount.toLocaleString()}</span>
              ${payMethod ? `<span class="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">${payMethod}</span>` : ''}
              ${installLabel ? `<span class="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px]">${installLabel}</span>` : ''}
              <span class="px-1.5 py-0.5 rounded text-[10px] font-medium ${payStatusCls}">${payLabel}</span>
              ${pay.receiptNo ? `<span class="text-gray-400 ml-auto">${pay.receiptNo}</span>` : ''}
              ${!pay.receiptNo && pay.date !== '-' ? `<span class="text-gray-400 ml-auto">${pay.date}</span>` : ''}
            </div>`;
          }).join('')}
        </div>
        <div class="ml-6 mt-2 flex items-center gap-3 text-[10px]">
          ${casePaid > 0 ? `<span class="text-green-600 font-medium">ชำระ ฿${casePaid.toLocaleString()}</span>` : ''}
          ${caseOutstanding > 0 ? `<span class="text-orange-600 font-medium">ค้าง ฿${caseOutstanding.toLocaleString()}</span>` : ''}
          ${casePending > 0 ? `<span class="text-gray-500">รอชำระ ฿${casePending.toLocaleString()}</span>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  // Footer — order summary
  const footerHTML = `
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-4">
        <span class="text-gray-500">ยอดรวม: <span class="font-bold text-gray-800">฿${orderTotal.toLocaleString()}</span></span>
        ${orderDiscount > 0 ? `<span class="text-purple-600">ส่วนลด: -฿${orderDiscount.toLocaleString()}</span>` : ''}
        <span class="text-gray-500">สุทธิ: <span class="font-bold text-gray-800">฿${orderNet.toLocaleString()}</span></span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-green-600 font-medium">ชำระ ฿${orderPaid.toLocaleString()}</span>
        ${orderOutstanding > 0 ? `<span class="text-orange-600 font-bold">ค้าง ฿${orderOutstanding.toLocaleString()}</span>` : '<span class="text-green-600 font-bold">ครบ</span>'}
      </div>
    </div>`;

  // Render inline in patient-detail
  detail.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 space-y-4">
        ${bodyHTML}
      </div>
      <div class="border-t border-gray-100 px-6 py-4 bg-gray-50">
        ${footerHTML}
      </div>
    </div>`;
}

/* ============================================
   TAB 4: Payment & Receipts
   ============================================ */
function renderPaymentTable() {
  const tbody = document.getElementById('payment-table-body');
  if (!tbody) return;

  const paymentItems = BranchState.appointments.filter(a =>
    a.paymentStatus === 'paid' || a.paymentStatus === 'partial' || a.paymentStatus === 'outstanding'
  );

  if (paymentItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-8 text-center text-gray-400 text-sm">ยังไม่มีรายการชำระเงิน</td></tr>`;
  } else {
    tbody.innerHTML = paymentItems.map(a => {
      const payInfo = getPaymentStatusInfo(a.paymentStatus);
      const methodLabel = { cash: 'เงินสด', transfer: 'โอนเงิน', credit: 'บัตรเครดิต', insurance: 'ประกัน' };
      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-5 py-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-${a.color}-100 rounded-full flex items-center justify-center">
                <span class="text-${a.color}-600 font-semibold text-xs">${a.initial}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">${a.name}</p>
                <p class="text-xs text-gray-400">${a.hn}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-3 text-sm text-gray-700">${a.treatment}</td>
          <td class="px-5 py-3 text-sm font-medium text-gray-800">฿${a.cost.toLocaleString()}</td>
          <td class="px-5 py-3"><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${payInfo.class}">${payInfo.label}</span></td>
          <td class="px-5 py-3 text-sm text-gray-600">${a.paymentMethod ? (methodLabel[a.paymentMethod] || a.paymentMethod) : '-'}</td>
          <td class="px-5 py-3">
            ${a.paymentStatus === 'paid' || a.paymentStatus === 'partial' ? `<button onclick="openReceipt(${a.id})" class="px-3 py-1.5 bg-dental-50 text-dental-700 text-xs rounded-lg font-medium hover:bg-dental-100">ใบเสร็จ</button>` : `<button onclick="openCloseCase(${a.id})" class="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600">ชำระ</button>`}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Update summary cards
  const paid = BranchState.appointments.filter(a => a.paymentStatus === 'paid');
  const partial = BranchState.appointments.filter(a => a.paymentStatus === 'partial');
  const outstanding = BranchState.appointments.filter(a => a.paymentStatus === 'outstanding');

  const totalRevenue = paid.reduce((s, a) => s + a.cost, 0) + partial.reduce((s, a) => s + (a.installment ? a.installment.paidAmount : 0), 0);
  const totalOutstanding = outstanding.reduce((s, a) => s + a.cost, 0) + partial.reduce((s, a) => s + (a.cost - (a.installment ? a.installment.paidAmount : 0)), 0);

  const setTextSafe = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setTextSafe('pay-total-revenue', '฿' + totalRevenue.toLocaleString());
  setTextSafe('pay-paid-count', paid.length + ' รายการ');
  setTextSafe('pay-outstanding', '฿' + totalOutstanding.toLocaleString());
  setTextSafe('pay-installment', partial.length + ' ราย');
}

function renderInstallments() {
  const container = document.getElementById('installment-list');
  if (!container) return;

  const items = BranchState.appointments.filter(a => a.paymentStatus === 'partial' && a.installment);

  if (items.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">ไม่มีรายการผ่อนชำระ</p>';
    return;
  }

  container.innerHTML = items.map(a => {
    const inst = a.installment;
    const progress = (inst.paid / inst.total * 100);
    const remaining = a.cost - inst.paidAmount;
    return `
      <div class="border border-gray-200 rounded-xl p-4 mb-3">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-${a.color}-100 rounded-full flex items-center justify-center">
              <span class="text-${a.color}-600 font-semibold">${a.initial}</span>
            </div>
            <div>
              <p class="font-medium text-gray-800">${a.name}</p>
              <p class="text-sm text-gray-500">${a.treatment} | ฿${a.cost.toLocaleString()}</p>
            </div>
          </div>
          <span class="text-sm font-bold text-purple-600">งวด ${inst.paid}/${inst.total}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div class="bg-purple-500 h-2 rounded-full" style="width:${progress}%"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>ชำระแล้ว ฿${inst.paidAmount.toLocaleString()}</span>
          <span>คงเหลือ ฿${remaining.toLocaleString()}</span>
          <span>งวดละ ฿${inst.perInstallment.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openReceipt(id) {
  const a = BranchState.appointments.find(apt => apt.id === id);
  if (!a) return;

  document.getElementById('receipt-title').textContent = 'ใบเสร็จ #INV-2569-' + String(BranchState.invoiceCounter).padStart(4, '0');
  document.getElementById('receipt-patient').textContent = a.name + ' - ' + a.treatment;
  const displayAmount = a.paymentStatus === 'partial' && a.installment ? a.installment.paidAmount : a.cost;
  document.getElementById('receipt-amount').textContent = '฿' + displayAmount.toLocaleString();

  const modal = document.getElementById('receipt-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/* ============================================
   TAB 5: Follow-up & Post-Treatment Chat
   ============================================ */
function renderFollowups() {
  const container = document.getElementById('followup-list');
  if (!container) return;

  if (BranchState.followups.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">ไม่มีรายการ Follow-up</p>';
    return;
  }

  container.innerHTML = BranchState.followups.map(f => `
    <div class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="font-medium text-gray-800">${f.patientName} <span class="text-xs text-gray-400">| ${f.treatment}</span></p>
          <p class="text-sm text-gray-500">${f.type}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-medium text-gray-700">${f.dueDate}</p>
          <p class="text-xs text-gray-400">via ${f.channel}</p>
        </div>
        <button onclick="completeFollowup(${f.id})" class="px-3 py-1.5 bg-dental-500 text-white text-xs rounded-lg font-medium hover:bg-dental-600">ส่งข้อความ</button>
        <button onclick="dismissFollowup(${f.id})" class="px-2 py-1.5 text-gray-400 hover:text-red-500" title="ข้าม">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function completeFollowup(id) {
  BranchState.followups = BranchState.followups.filter(f => f.id !== id);
  renderFollowups();
}

function dismissFollowup(id) {
  BranchState.followups = BranchState.followups.filter(f => f.id !== id);
  renderFollowups();
}

function renderPostChats() {
  const container = document.getElementById('post-chat-list');
  if (!container) return;

  if (BranchState.postChats.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">ไม่มีแชทหลังรักษา</p>';
    return;
  }

  container.innerHTML = BranchState.postChats.map(c => `
    <div class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div>
          <p class="font-medium text-gray-800">${c.patientName} <span class="text-xs text-gray-400">| ${c.treatment}</span></p>
          <p class="text-sm text-gray-500 truncate max-w-xs">${c.lastMessage}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-xs text-gray-400">หมดอายุ ${c.expiryDate}</p>
          ${c.unread > 0 ? `<span class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">${c.unread}</span>` : '<span class="text-xs text-green-500">อ่านแล้ว</span>'}
        </div>
        <button class="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium hover:bg-blue-100">เปิดแชท</button>
      </div>
    </div>
  `).join('');
}

/* ============================================
   TAB 6: Charts (Chart.js)
   ============================================ */
function initCharts() {
  if (BranchState.chartsInitialized) return;
  BranchState.chartsInitialized = true;

  // Booking Chart (Line)
  const bookingCtx = document.getElementById('bookingChart');
  if (bookingCtx) {
    new Chart(bookingCtx, {
      type: 'line',
      data: {
        labels: ['3 ก.พ.', '4 ก.พ.', '5 ก.พ.', '6 ก.พ.', '7 ก.พ.', '8 ก.พ.', '9 ก.พ.'],
        datasets: [
          {
            label: 'การจอง',
            data: [5, 7, 6, 8, 4, 9, 8],
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#14b8a6'
          },
          {
            label: 'No-show',
            data: [0, 1, 0, 1, 0, 0, 1],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 15 }, padding: 14 } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 14 } } },
          x: { ticks: { font: { size: 14 } } }
        }
      }
    });
  }

  // Revenue Chart (Doughnut)
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'doughnut',
      data: {
        labels: ['รากเทียม', 'วีเนียร์', 'จัดฟัน', 'ผ่าฟันคุด', 'ขูดหินปูน', 'อื่นๆ'],
        datasets: [{
          data: [660000, 240000, 150000, 87500, 54000, 8500],
          backgroundColor: ['#14b8a6', '#ec4899', '#8b5cf6', '#ef4444', '#3b82f6', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 15 }, padding: 14 } }
        },
        cutout: '60%'
      }
    });
  }
}
