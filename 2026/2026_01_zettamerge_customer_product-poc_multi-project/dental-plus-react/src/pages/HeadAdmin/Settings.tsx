import { useState } from 'react';
import { Settings as SettingsIcon, Tag, Users, User, MessageCircle, Bot, Plus, Pencil, GripVertical } from 'lucide-react';
import { treatmentTypes, teams, members, channels } from '../../data/mockData';

type TabType = 1 | 2 | 3 | 4 | 5;

export function Settings() {
  const [currentTab, setCurrentTab] = useState<TabType>(1);

  const tabs = [
    { id: 1 as TabType, label: 'จัดการประเภท', icon: Tag },
    { id: 2 as TabType, label: 'จัดการทีม', icon: Users },
    { id: 3 as TabType, label: 'จัดการสมาชิก', icon: User },
    { id: 4 as TabType, label: 'จัดการช่องทาง', icon: MessageCircle },
    { id: 5 as TabType, label: 'Super Admin', icon: Bot }
  ];

  const colorMap: Record<string, { bg: string, text: string, border: string, icon: string }> = {
    'blue': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-500' },
    'red': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'bg-red-500' },
    'purple': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-500' },
    'pink': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: 'bg-pink-500' },
    'gray': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'bg-gray-400' },
    'green': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'bg-green-500' },
    'black': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'bg-black' }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">จัดการการตั้งค่าระบบ</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-8 py-3 border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  currentTab === tab.id
                    ? 'bg-dental-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Tab 1: Treatment Types */}
        {currentTab === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">ประเภทการรักษา</h2>
                <p className="text-sm text-gray-500">ประเภทที่ใช้ในการจัดหมวดหมู่แชทของลูกค้า</p>
              </div>
              <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มประเภท
              </button>
            </div>
            <div className="space-y-3">
              {treatmentTypes.map((type) => {
                const colors = colorMap[type.color];
                return (
                  <div key={type.id} className={`flex items-center justify-between p-4 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.code} - {type.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full`}>ใช้งาน</span>
                      <button className={`p-2 hover:${colors.bg} rounded-lg`}>
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Teams */}
        {currentTab === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">ทีม Admin</h2>
                <p className="text-sm text-gray-500">จัดการทีมและกำหนดประเภทที่รับผิดชอบ</p>
              </div>
              <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มทีม
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {teams.map((team) => {
                const colors = colorMap[team.color];
                return (
                  <div key={team.id} className={`p-5 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold ${colors.text}`}>{team.name}</h3>
                      <button className={`p-1.5 hover:${colors.bg} rounded-lg`}>
                        <Pencil className={`w-4 h-4 ${colors.text}`} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      รับผิดชอบ: <span className={`${colors.text} font-medium`}>{team.name.replace('ทีม', '')}</span>
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {team.members.map((member, idx) => (
                        <span key={idx} className={`px-2 py-1 bg-white text-gray-600 text-xs rounded-full ${member.includes('off') ? 'opacity-50' : ''}`}>
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Members */}
        {currentTab === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">สมาชิก Admin</h2>
                <p className="text-sm text-gray-500">จัดการข้อมูล Admin ในทีม</p>
              </div>
              <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มสมาชิก
              </button>
            </div>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 ${member.status === 'Offline' ? 'opacity-60' : ''}`}>
                  <div className={`w-12 h-12 ${member.bgColor} rounded-full flex items-center justify-center`}>
                    <span className={`${member.textColor} font-bold text-lg`}>{member.initial}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.team}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                    member.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {member.status}
                  </span>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Channels */}
        {currentTab === 4 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">ช่องทางการติดต่อ</h2>
                <p className="text-sm text-gray-500">จัดการช่องทางที่เชื่อมต่อกับระบบ</p>
              </div>
              <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                เชื่อมต่อช่องทางใหม่
              </button>
            </div>
            <div className="space-y-3">
              {channels.map((channel) => {
                const colors = colorMap[channel.color];
                return (
                  <div key={channel.id} className={`flex items-center justify-between p-4 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{channel.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{channel.name}</p>
                        <p className="text-xs text-gray-500">{channel.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full`}>เชื่อมต่อแล้ว</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={channel.connected} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-500"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Super Admin */}
        {currentTab === 5 && (
          <>
            {/* Mode Toggle */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-purple-700">โหมดการกระจายงาน</h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Super Admin</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input type="radio" name="allocation-mode" value="round-robin" defaultChecked className="sr-only peer" />
                  <div className="p-6 border-2 border-gray-200 rounded-2xl peer-checked:border-dental-500 peer-checked:bg-dental-50 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Round Robin</h3>
                        <p className="text-sm text-gray-500">แจกงานวนรอบตามลำดับ</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">ระบบจะแจกงานให้พนักงานแต่ละคนสลับกันไปเรื่อยๆ ตามลำดับที่กำหนด</p>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="allocation-mode" value="performance" className="sr-only peer" />
                  <div className="p-6 border-2 border-gray-200 rounded-2xl peer-checked:border-dental-500 peer-checked:bg-dental-50 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Performance-based</h3>
                        <p className="text-sm text-gray-500">แจกตามผลงาน</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">ระบบจะแจกงานให้พนักงานที่มี Conversion Rate สูงกว่าได้รับงานมากกว่า</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Agent Queue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">ลำดับพนักงาน</h2>
                  <p className="text-sm text-gray-500">ลากเพื่อเรียงลำดับการรับงาน</p>
                </div>
                <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600">บันทึกลำดับ</button>
              </div>
              <div className="space-y-3">
                {members.slice(0, 5).map((member, idx) => (
                  <div key={member.id} className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-grab hover:shadow-md transition-all ${member.status === 'Offline' ? 'opacity-60' : ''}`}>
                    <div className="text-gray-400">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <span className={`w-8 h-8 ${member.status === 'Offline' ? 'bg-gray-200 text-gray-500' : 'bg-dental-100 text-dental-700'} rounded-full flex items-center justify-center font-bold text-sm`}>
                      {idx + 1}
                    </span>
                    <div className={`w-10 h-10 ${member.bgColor} rounded-full flex items-center justify-center`}>
                      <span className={`${member.textColor} font-semibold`}>{member.initial}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.team.replace('ทีม', '')} • Conversion 78%</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Rules */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">กฎเพิ่มเติม</h2>
              <div className="space-y-4">
                {[
                  { icon: '🕐', title: 'เฉพาะเวลาทำงาน', desc: 'แจกงานเฉพาะ 09:00 - 18:00', checked: true },
                  { icon: '🚫', title: 'ข้ามคนที่ออฟไลน์', desc: 'ไม่แจกงานให้คนที่ไม่ออนไลน์', checked: true },
                  { icon: '⭐', title: 'VIP Routing', desc: 'ส่งลูกค้า VIP ให้คนเฉพาะ (Admin แอน)', checked: false }
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">
                        {rule.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{rule.title}</p>
                        <p className="text-xs text-gray-500">{rule.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={rule.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-500"></div>
                    </label>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">จำกัดคิวสูงสุด</p>
                      <p className="text-xs text-gray-500">ไม่แจกงานถ้ามีงานเกิน X ชิ้น</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={10} className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-center text-sm" />
                    <span className="text-sm text-gray-500">ชิ้น</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
