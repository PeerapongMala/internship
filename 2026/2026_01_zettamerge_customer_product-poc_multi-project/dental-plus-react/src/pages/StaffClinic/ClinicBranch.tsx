import { useState } from 'react';
import {
  Building2,
  Calendar,
  Edit3,
  User,
  CreditCard,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Settings
} from 'lucide-react';

type TabType = 'schedule' | 'booking' | 'patient' | 'finance' | 'notifications' | 'reports';
type AppointmentStatus = 'pending' | 'confirmed' | 'treating' | 'payment' | 'completed' | 'noshow';
type PaymentStatus = 'paid' | 'unpaid' | 'partial';

interface Appointment {
  id: number;
  time: string;
  patientName: string;
  patientInitial: string;
  patientBg: string;
  patientText: string;
  hn: string;
  phone: string;
  treatment: string;
  doctor: string;
  doctorColor: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  channel: string;
  note: string;
}

interface FollowUp {
  id: number;
  patientName: string;
  treatment: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'done';
}

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'schedule', label: 'ตารางนัดวันนี้', icon: <Calendar className="w-5 h-5" /> },
  { key: 'booking', label: 'จัดการการจอง', icon: <Edit3 className="w-5 h-5" /> },
  { key: 'patient', label: 'ประวัติคนไข้', icon: <User className="w-5 h-5" /> },
  { key: 'finance', label: 'การเงิน & ใบเสร็จ', icon: <CreditCard className="w-5 h-5" /> },
  { key: 'notifications', label: 'แจ้งเตือน & Follow-up', icon: <Bell className="w-5 h-5" /> },
  { key: 'reports', label: 'รายงาน', icon: <BarChart3 className="w-5 h-5" /> },
];

const mockAppointments: Appointment[] = [
  { id: 1, time: '09:00', patientName: 'คุณสมชาย ใจดี', patientInitial: 'ส', patientBg: 'bg-blue-100', patientText: 'text-blue-600', hn: 'HN-2569-0042', phone: '081-234-5678', treatment: 'ผ่าฟันคุด', doctor: 'หมอแอน', doctorColor: 'bg-pink-100 text-pink-700', status: 'confirmed', paymentStatus: 'unpaid', amount: 3500, channel: 'LINE', note: 'ฟันคุดซี่ล่างขวา' },
  { id: 2, time: '09:30', patientName: 'คุณพิมพ์ลดา รักสวย', patientInitial: 'พ', patientBg: 'bg-pink-100', patientText: 'text-pink-600', hn: 'HN-2569-0043', phone: '089-876-5432', treatment: 'ตรวจสุขภาพฟัน', doctor: 'หมอเบน', doctorColor: 'bg-blue-100 text-blue-700', status: 'treating', paymentStatus: 'unpaid', amount: 500, channel: 'Facebook', note: '' },
  { id: 3, time: '10:00', patientName: 'คุณวิชัย มั่งมี', patientInitial: 'ว', patientBg: 'bg-green-100', patientText: 'text-green-600', hn: 'HN-2569-0044', phone: '091-111-2222', treatment: 'รากเทียม (ติดตั้ง)', doctor: 'หมอแคท', doctorColor: 'bg-purple-100 text-purple-700', status: 'payment', paymentStatus: 'partial', amount: 55000, channel: 'Walk-in', note: 'งวดที่ 2/3' },
  { id: 4, time: '10:30', patientName: 'คุณนารี สดใส', patientInitial: 'น', patientBg: 'bg-yellow-100', patientText: 'text-yellow-600', hn: 'HN-2569-0045', phone: '092-333-4444', treatment: 'ขูดหินปูน', doctor: 'หมอเบน', doctorColor: 'bg-blue-100 text-blue-700', status: 'completed', paymentStatus: 'paid', amount: 1200, channel: 'LINE', note: '' },
  { id: 5, time: '11:00', patientName: 'คุณประเสริฐ ดีเลิศ', patientInitial: 'ป', patientBg: 'bg-orange-100', patientText: 'text-orange-600', hn: 'HN-2569-0046', phone: '083-555-6666', treatment: 'จัดฟัน (ตรวจ)', doctor: 'หมอแคท', doctorColor: 'bg-purple-100 text-purple-700', status: 'pending', paymentStatus: 'unpaid', amount: 2000, channel: 'Instagram', note: 'นัดแรก' },
  { id: 6, time: '13:00', patientName: 'คุณมานะ ขยัน', patientInitial: 'ม', patientBg: 'bg-indigo-100', patientText: 'text-indigo-600', hn: 'HN-2569-0047', phone: '084-777-8888', treatment: 'อุดฟัน', doctor: 'หมอแอน', doctorColor: 'bg-pink-100 text-pink-700', status: 'noshow', paymentStatus: 'unpaid', amount: 800, channel: 'LINE', note: 'โทรไม่ติด' },
];

const mockFollowUps: FollowUp[] = [
  { id: 1, patientName: 'คุณสมชาย', treatment: 'ผ่าฟันคุด', type: 'ตรวจหลังผ่า 7 วัน', dueDate: 'พรุ่งนี้', status: 'pending' },
  { id: 2, patientName: 'คุณวิชัย', treatment: 'รากเทียม', type: 'นัดติดครอบ', dueDate: 'อีก 3 วัน', status: 'pending' },
  { id: 3, patientName: 'คุณนารี', treatment: 'ขูดหินปูน', type: 'นัดทำความสะอาด 6 เดือน', dueDate: '15 ก.ค.', status: 'pending' },
];

const statusConfig: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
  treating: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'กำลังรักษา' },
  payment: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'รอชำระ' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'เสร็จสิ้น' },
  noshow: { bg: 'bg-red-100', text: 'text-red-700', label: 'No-show' },
};

const paymentStatusConfig: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
  paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'ชำระแล้ว' },
  unpaid: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'รอชำระ' },
  partial: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'ผ่อนชำระ' },
};

export function ClinicBranch() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [followUps] = useState<FollowUp[]>(mockFollowUps);
  const [currentDate] = useState(new Date());

  const dateString = currentDate.toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    treating: appointments.filter(a => a.status === 'treating').length,
    payment: appointments.filter(a => a.status === 'payment').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    noshow: appointments.filter(a => a.status === 'noshow').length,
  };

  const totalRevenue = appointments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Clinic Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="h-20 border-b border-gray-100 flex items-center px-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dental-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dental-700">Dental Plus</h1>
              <p className="text-xs text-gray-400">สาขาสยาม</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="h-6 flex items-center px-4 mb-1">
            <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
              Clinic View
            </span>
          </div>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full h-10 flex items-center gap-3 px-4 rounded-xl text-left transition-all ${
                  activeTab === tab.key
                    ? 'bg-dental-100 text-dental-700 font-medium'
                    : 'text-gray-600 hover:bg-dental-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="h-16 border-t border-gray-100 flex items-center px-4">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-semibold">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Staff</p>
              <p className="text-xs text-teal-500">Front Desk - สาขาสยาม</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab 1: Schedule */}
        {activeTab === 'schedule' && (
          <>
            {/* Header */}
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">สาขาสยาม - ตารางนัดวันนี้</h1>
                    <p className="text-sm text-gray-500">รับคนไข้ → รักษา → ชำระเงิน → ปิดเคส</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button className="relative p-2 rounded-xl hover:bg-gray-100">
                      <Bell className="w-6 h-6 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        3
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-xl">
                    <span className="text-2xl font-bold text-teal-700">{appointments.length}</span>
                    <span className="text-sm text-teal-600">นัดวันนี้</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date + Status Bar */}
            <div className="bg-white px-8 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-lg font-bold text-gray-800">{dateString}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="px-3 py-1 bg-dental-100 text-dental-700 rounded-lg text-sm font-medium hover:bg-dental-200">
                    วันนี้
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-700 font-medium">{stats.pending} Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-700 font-medium">{stats.confirmed} Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-purple-700 font-medium">{stats.treating} กำลังรักษา</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-medium">{stats.completed} เสร็จสิ้น</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-red-700 font-medium">{stats.noshow} No-show</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">เวลา</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">คนไข้</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">การรักษา</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">หมอ</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">การชำระ</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => {
                      const status = statusConfig[appt.status];
                      const payStatus = paymentStatusConfig[appt.paymentStatus];

                      return (
                        <tr key={appt.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-800">{appt.time}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${appt.patientBg} rounded-full flex items-center justify-center`}>
                                <span className={`${appt.patientText} font-semibold`}>{appt.patientInitial}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{appt.patientName}</p>
                                <p className="text-xs text-gray-500">{appt.hn}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-800">{appt.treatment}</p>
                            <p className="text-xs text-gray-400">฿{appt.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 ${appt.doctorColor} text-xs rounded-full font-medium`}>
                              {appt.doctor}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 ${status.bg} ${status.text} text-xs rounded-full font-medium`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 ${payStatus.bg} ${payStatus.text} text-xs rounded-full font-medium`}>
                              {payStatus.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1">
                              {appt.status === 'pending' && (
                                <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">
                                  ยืนยัน
                                </button>
                              )}
                              {appt.status === 'confirmed' && (
                                <button className="px-2 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600">
                                  เริ่มรักษา
                                </button>
                              )}
                              {appt.status === 'treating' && (
                                <button className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600">
                                  ชำระเงิน
                                </button>
                              )}
                              {appt.status === 'payment' && (
                                <button className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                  ปิดเคส
                                </button>
                              )}
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-8 py-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">สรุปสาขาสยาม</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{appointments.length}</p>
                    <p className="text-xs text-teal-200">นัดทั้งหมด</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-xs text-teal-200">ปิดเคส</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.noshow}</p>
                    <p className="text-xs text-teal-200">No-show</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-teal-200">รายได้</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Booking Management */}
        {activeTab === 'booking' && (
          <>
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">จัดการการจอง</h1>
              <p className="text-sm text-gray-500">แก้ไข เลื่อนนัด ปิดรับจอง กำหนด Capacity</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Capacity Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-dental-600" />
                  Capacity ต่อ Slot
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
                    <div key={time} className="bg-gray-50 rounded-xl p-4">
                      <p className="font-bold text-gray-800">{time}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">Capacity:</span>
                        <select className="px-2 py-1 border border-gray-200 rounded-lg text-sm">
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">รายการจองทั้งหมด</h2>
                  <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                    <option>ทุกสถานะ</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${appt.patientBg} rounded-full flex items-center justify-center`}>
                          <span className={`${appt.patientText} font-semibold`}>{appt.patientInitial}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appt.patientName}</p>
                          <p className="text-xs text-gray-500">{appt.time} - {appt.treatment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 ${statusConfig[appt.status].bg} ${statusConfig[appt.status].text} text-xs rounded-full`}>
                          {statusConfig[appt.status].label}
                        </span>
                        <button className="px-3 py-1 bg-dental-500 text-white text-xs rounded-lg hover:bg-dental-600">
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Log */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">ประวัติการแก้ไข (Audit Log)</h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-800"><strong>Staff</strong> เลื่อนนัด คุณพิมพ์ จาก 10:00 เป็น 10:30</p>
                      <p className="text-xs text-gray-400">วันนี้ 08:45</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-800"><strong>ระบบ</strong> ยืนยันนัด คุณสมชาย อัตโนมัติ (LINE)</p>
                      <p className="text-xs text-gray-400">วันนี้ 07:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 3: Patient History */}
        {activeTab === 'patient' && (
          <>
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">ประวัติคนไข้</h1>
              <p className="text-sm text-gray-500">ประวัติการรักษา, แพ็กเกจ, หมายเหตุทางการแพทย์</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="ค้นหาคนไข้ (ชื่อ, HN, เบอร์โทร)"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
                  />
                  <button className="px-4 py-2 bg-dental-500 text-white rounded-xl text-sm font-medium hover:bg-dental-600">
                    ค้นหา
                  </button>
                </div>

                <div className="space-y-4">
                  {appointments.slice(0, 4).map((appt) => (
                    <div key={appt.id} className="p-4 border border-gray-200 rounded-xl hover:border-dental-300 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${appt.patientBg} rounded-full flex items-center justify-center`}>
                            <span className={`${appt.patientText} font-bold text-lg`}>{appt.patientInitial}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{appt.patientName}</p>
                            <p className="text-xs text-gray-500">{appt.hn} • {appt.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">รักษาล่าสุด: {appt.treatment}</p>
                          <p className="text-xs text-gray-400">วันนี้ {appt.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 4: Finance */}
        {activeTab === 'finance' && (
          <>
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">การเงิน & ใบเสร็จ</h1>
              <p className="text-sm text-gray-500">สถานะการชำระ, ผ่อนชำระ, ออกใบเสร็จ</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">รายได้วันนี้</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">฿{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">ชำระแล้ว</p>
                  <p className="text-2xl font-bold text-dental-600 mt-1">
                    {appointments.filter(a => a.paymentStatus === 'paid').length} รายการ
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">ค้างชำระ</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    ฿{appointments.filter(a => a.paymentStatus === 'unpaid').reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">ผ่อนชำระ</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {appointments.filter(a => a.paymentStatus === 'partial').length} ราย
                  </p>
                </div>
              </div>

              {/* Payment Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">รายการชำระเงินวันนี้</h2>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                    Export CSV
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">คนไข้</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">การรักษา</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ยอดเงิน</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => {
                      const payStatus = paymentStatusConfig[appt.paymentStatus];
                      return (
                        <tr key={appt.id} className="border-b border-gray-100">
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">{appt.patientName}</p>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{appt.treatment}</td>
                          <td className="px-5 py-4 font-medium text-gray-800">฿{appt.amount.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 ${payStatus.bg} ${payStatus.text} text-xs rounded-full`}>
                              {payStatus.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {appt.paymentStatus === 'paid' && (
                              <button className="text-xs text-dental-600 hover:text-dental-800">พิมพ์ใบเสร็จ</button>
                            )}
                            {appt.paymentStatus !== 'paid' && (
                              <button className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                รับชำระ
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab 5: Notifications & Follow-up */}
        {activeTab === 'notifications' && (
          <>
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">แจ้งเตือน & Follow-up</h1>
              <p className="text-sm text-gray-500">แจ้งเตือนอัตโนมัติ, นัดติดตามผล, แชทหลังรักษา</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Auto Notification Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">ตั้งค่าแจ้งเตือนอัตโนมัติ</h2>
                <div className="space-y-4">
                  {[
                    { title: 'แจ้งเตือนก่อนนัด 1 วัน', desc: 'ส่งข้อความเตือนผ่าน LINE / SMS', enabled: true },
                    { title: 'แจ้งเตือนก่อนนัด 2 ชั่วโมง', desc: 'ส่งข้อความเตือนผ่าน LINE', enabled: true },
                    { title: 'ขอบคุณหลังรับบริการ', desc: 'ส่งข้อความขอบคุณ + คำแนะนำดูแลหลังทำ', enabled: true },
                    { title: 'แจ้งเตือนกินยา', desc: 'เตือนคนไข้กินยาตามที่แพทย์สั่ง', enabled: false },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{setting.title}</p>
                        <p className="text-xs text-gray-500">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-dental-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Queue */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">รายการ Follow-up ที่ต้องทำ</h2>
                <div className="space-y-3">
                  {followUps.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-gray-800">{item.patientName} - {item.treatment}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-orange-600 font-medium">{item.dueDate}</span>
                        <button className="px-3 py-1 bg-dental-500 text-white text-xs rounded-lg hover:bg-dental-600">
                          โทรติดตาม
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 6: Reports */}
        {activeTab === 'reports' && (
          <>
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">รายงาน - สาขาสยาม</h1>
                  <p className="text-sm text-gray-500">สรุปภาพรวมการจอง, No-show, รายได้</p>
                </div>
                <button className="px-4 py-2 bg-dental-500 text-white rounded-xl text-sm font-medium hover:bg-dental-600">
                  Export Excel
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">การจองเดือนนี้</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">156</p>
                  <p className="text-xs text-green-600 mt-1">+12% จากเดือนก่อน</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">No-show Rate</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">8.3%</p>
                  <p className="text-xs text-red-600 mt-1">+2% จากเดือนก่อน</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">รายได้เดือนนี้</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">฿1.2M</p>
                  <p className="text-xs text-green-600 mt-1">+8% จากเดือนก่อน</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Avg. ต่อคนไข้</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">฿7,692</p>
                  <p className="text-xs text-gray-500 mt-1">จาก 156 คน</p>
                </div>
              </div>

              {/* Revenue by Service */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800">รายได้แยกตามบริการ</h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">บริการ</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">จำนวน</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">รายได้</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">สัดส่วน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { service: 'รากเทียม', count: 12, revenue: 660000, percent: 55 },
                      { service: 'วีเนียร์', count: 8, revenue: 240000, percent: 20 },
                      { service: 'จัดฟัน', count: 15, revenue: 150000, percent: 12.5 },
                      { service: 'ผ่าฟันคุด', count: 25, revenue: 87500, percent: 7.3 },
                      { service: 'ขูดหินปูน', count: 45, revenue: 54000, percent: 4.5 },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-5 py-3 text-sm">{item.service}</td>
                        <td className="px-5 py-3 text-sm">{item.count}</td>
                        <td className="px-5 py-3 text-sm font-medium">฿{item.revenue.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-dental-500 h-2 rounded-full"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
