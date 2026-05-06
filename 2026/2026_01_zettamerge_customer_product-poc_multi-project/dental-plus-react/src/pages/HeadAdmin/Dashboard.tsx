import { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export function Dashboard() {
  const [period] = useState<'today' | 'week' | 'month'>('today');

  const stats: StatCard[] = [
    {
      title: 'ข้อความทั้งหมด',
      value: '1,234',
      change: '+12%',
      changeType: 'up',
      icon: <MessageSquare className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'AI ตอบอัตโนมัติ',
      value: '892',
      change: '72%',
      changeType: 'neutral',
      icon: <Bot className="w-6 h-6" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'ส่งต่อ Admin',
      value: '342',
      change: '28%',
      changeType: 'neutral',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'นัดหมายใหม่',
      value: '89',
      change: '+8%',
      changeType: 'up',
      icon: <Calendar className="w-6 h-6" />,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const recentChats = [
    { id: 1, name: 'คุณสมชาย', channel: 'LINE', service: 'ผ่าฟันคุด', time: '10:32', status: 'ai-active' },
    { id: 2, name: 'คุณพิมพ์ลดา', channel: 'Facebook', service: 'จัดฟัน', time: '10:28', status: 'pending' },
    { id: 3, name: 'คุณวิชัย', channel: 'LINE', service: 'ขูดหินปูน', time: '10:15', status: 'completed' },
    { id: 4, name: 'คุณนารี', channel: 'Instagram', service: 'วีเนียร์', time: '10:05', status: 'admin-mode' },
  ];

  const aiPerformance = [
    { label: 'ตอบถูกต้อง', value: 94, color: 'bg-green-500' },
    { label: 'ต้องแก้ไข', value: 4, color: 'bg-yellow-500' },
    { label: 'ส่งต่อ Admin', value: 2, color: 'bg-red-500' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ai-active':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'AI กำลังตอบ' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'รอดำเนินการ' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'เสร็จสิ้น' };
      case 'admin-mode':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin รับเรื่อง' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'LINE': return 'bg-green-500';
      case 'Facebook': return 'bg-blue-500';
      case 'Instagram': return 'bg-gradient-to-br from-purple-500 to-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-dental-100 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-dental-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500">ภาพรวมระบบ Chat Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">AI กำลังทำงาน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <span className={stat.iconColor}>{stat.icon}</span>
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'up' ? 'text-green-600' :
                  stat.changeType === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Chats */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-dental-500" />
                แชทล่าสุด
              </h2>
              <button className="text-sm text-dental-600 hover:text-dental-800 font-medium">
                ดูทั้งหมด →
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentChats.map((chat) => {
                const statusStyle = getStatusStyle(chat.status);
                return (
                  <div key={chat.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getChannelColor(chat.channel)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {chat.name.charAt(3)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{chat.name}</p>
                          <p className="text-xs text-gray-500">{chat.channel} • {chat.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs rounded-full font-medium`}>
                          {statusStyle.label}
                        </span>
                        <span className="text-xs text-gray-400">{chat.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-dental-500" />
                ประสิทธิภาพ AI
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {aiPerformance.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">เวลาตอบเฉลี่ย</span>
                  <span className="text-sm font-bold text-dental-600">2.5 นาที</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">คะแนนความพึงพอใจ</span>
                  <span className="text-sm font-bold text-dental-600">4.8/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">อัตรา Conversion</span>
                  <span className="text-sm font-bold text-dental-600">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="font-bold text-gray-800">รอตรวจสอบ</p>
            <p className="text-sm text-gray-500">12 เคส</p>
          </button>
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-bold text-gray-800">แชทที่ต้องตอบ</p>
            <p className="text-sm text-gray-500">8 ข้อความ</p>
          </button>
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-bold text-gray-800">นัดหมายวันนี้</p>
            <p className="text-sm text-gray-500">24 คิว</p>
          </button>
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-bold text-gray-800">Admin ออนไลน์</p>
            <p className="text-sm text-gray-500">5 คน</p>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-dental-600 to-dental-800 px-8 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">สรุปวันนี้</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-dental-200">ข้อความทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">892</p>
              <p className="text-xs text-dental-200">AI ตอบ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-dental-200">นัดหมายใหม่</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">฿245K</p>
              <p className="text-xs text-dental-200">มูลค่านัดหมาย</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
