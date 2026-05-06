import { useState } from 'react';
import { FileText, Download, Inbox, Send, Zap, AlertCircle, X } from 'lucide-react';
import { messageLogs } from '../../data/mockData';

type TabType = 'messages' | 'webhook' | 'ai';

export function MessageLogs() {
  const [currentTab, setCurrentTab] = useState<TabType>('messages');
  const [showAIConvoModal, setShowAIConvoModal] = useState(false);

  const channelColors: Record<string, string> = {
    'LINE': 'bg-green-100 text-green-700',
    'Facebook': 'bg-blue-100 text-blue-700',
    'Instagram': 'bg-pink-100 text-pink-700',
    'TikTok': 'bg-gray-100 text-gray-700',
    'WhatsApp': 'bg-green-100 text-green-700'
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Message Logs</h1>
            <p className="text-gray-500 mt-1">ดูประวัติข้อความ IN/OUT และ Webhook Events</p>
          </div>
          <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">1,234</p>
                <p className="text-xs text-gray-500">Messages IN</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">856</p>
                <p className="text-xs text-gray-500">Messages OUT</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">45</p>
                <p className="text-xs text-gray-500">Webhook Events</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">3</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'messages' as TabType, label: 'Messages IN/OUT' },
            { id: 'webhook' as TabType, label: 'Webhook Events' },
            { id: 'ai' as TabType, label: 'AI Conversations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium border-2 ${
                currentTab === tab.id
                  ? 'border-dental-500 bg-dental-50 text-dental-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dental-500">
              <option value="">ทุกทิศทาง</option>
              <option value="in">IN</option>
              <option value="out">OUT</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dental-500">
              <option value="">ทุกช่องทาง</option>
              <option value="line">LINE</option>
              <option value="fb">Facebook</option>
              <option value="ig">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาข้อความ..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
              />
            </div>
            <button className="px-4 py-2 bg-dental-500 text-white rounded-lg text-sm font-medium hover:bg-dental-600">
              ค้นหา
            </button>
          </div>
        </div>

        {/* Messages Table */}
        {currentTab === 'messages' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">เวลา</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ทิศทาง</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ช่องทาง</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ลูกค้า</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ข้อความ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messageLogs.map((log) => (
                  <tr key={log.id} className={`hover:bg-gray-50 ${log.status === 'failed' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${log.direction === 'IN' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {log.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${channelColors[log.channel]}`}>
                        {log.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{log.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{log.message}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {log.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Webhook Events Table */}
        {currentTab === 'webhook' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">เวลา</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Event Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">10:30:00</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-mono">booking_created</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">Booking System</td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{`{"patient_id": "P001", "date": "2026-02-10"...}`}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">OK</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">10:35:00</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-mono">patient_arrived</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">HIS System</td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{`{"patient_id": "P002", "check_in": "10:32"...}`}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">OK</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">11:00:00</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-mono">payment_received</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">Payment Gateway</td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{`{"amount": 3500, "method": "credit_card"...}`}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">OK</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* AI Conversations Tab */}
        {currentTab === 'ai' && (
          <>
            {/* AI Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-purple-600">89</p>
                <p className="text-xs text-gray-500">AI Handled</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-green-600">47</p>
                <p className="text-xs text-gray-500">AI Closed</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-xs text-gray-500">Escalated</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-blue-600">2.3 min</p>
                <p className="text-xs text-gray-500">Avg Resolution</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ลูกค้า</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ช่องทาง</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">คำถาม</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tools Used</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">สถานะ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">เวลา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setShowAIConvoModal(true)}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#AI-001</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">คุณแก้ว</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">LINE</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">คลินิกเปิดกี่โมงคะ</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">get_hours</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Closed</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">1.2 min</td>
                  </tr>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setShowAIConvoModal(true)}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#AI-002</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">คุณนิด</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Facebook</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">อยากเช็คนัดหมอแคท</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mr-1">check_booking</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">get_doctor</span>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Closed</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">2.5 min</td>
                  </tr>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setShowAIConvoModal(true)}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#AI-003</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">คุณต้น</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">LINE</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">ปวดฟันมาก ต้องการคุยกับคน</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">escalate</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Escalated</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">0.8 min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* AI Conversation Modal */}
      {showAIConvoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-800">AI Conversation #AI-001</h3>
                <p className="text-sm text-gray-500">คุณแก้ว • LINE • 1.2 min</p>
              </div>
              <button onClick={() => setShowAIConvoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
              {/* Customer Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">ก</span>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-md">
                  <p className="text-sm text-gray-800">คลินิกเปิดกี่โมงคะ</p>
                  <p className="text-xs text-gray-400 mt-1">10:30</p>
                </div>
              </div>

              {/* AI Tool Call */}
              <div className="flex justify-center">
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 text-xs text-purple-700">
                  🔧 Calling: get_hours()
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-3 justify-end">
                <div className="bg-dental-500 text-white rounded-2xl rounded-tr-none p-3 max-w-md">
                  <p className="text-sm">สวัสดีค่ะ คลินิก Dental Plus เปิดให้บริการทุกวัน 10:00 - 20:00 น. ค่ะ มีอะไรให้ช่วยเพิ่มเติมไหมคะ? 😊</p>
                  <p className="text-xs text-dental-100 mt-1">10:30 • AI</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">AI</span>
                </div>
              </div>

              {/* Customer Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-semibold">ก</span>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-md">
                  <p className="text-sm text-gray-800">ขอบคุณค่ะ</p>
                  <p className="text-xs text-gray-400 mt-1">10:31</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-3 justify-end">
                <div className="bg-dental-500 text-white rounded-2xl rounded-tr-none p-3 max-w-md">
                  <p className="text-sm">ยินดีค่ะ หากมีคำถามเพิ่มเติมทักมาได้เลยนะคะ 🙏</p>
                  <p className="text-xs text-dental-100 mt-1">10:31 • AI</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">AI</span>
                </div>
              </div>

              {/* Closed */}
              <div className="flex justify-center">
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs text-green-700">
                  ✓ Conversation closed by AI
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAIConvoModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
