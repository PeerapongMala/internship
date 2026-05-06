import { useState } from 'react';
import { Lightbulb, MessageCircle, User, Users, X, Check } from 'lucide-react';
import { mockConversations, Conversation, Message } from '../../data/mockData';

type FilterType = 'all' | 'ai-active' | 'pending';

const channelIcons: Record<string, JSX.Element> = {
  'LINE': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  ),
  'Facebook': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
};

const channelIconColors: Record<string, string> = {
  'LINE': 'text-green-500',
  'Facebook': 'text-blue-600'
};

const statusStyles = {
  'ai-active': { border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700', badgeText: '🤖 AI กำลังตอบ', pulse: true },
  'pending': { border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700', badgeText: '⏳ รอส่งต่อ', pulse: false },
  'admin-mode': { border: 'border-l-teal-500', badge: 'bg-teal-100 text-teal-700', badgeText: '👤 Admin Mode', pulse: false }
};

export function AIChatbot() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'all') return true;
    if (filter === 'ai-active') return conv.status === 'ai-active';
    if (filter === 'pending') return conv.status === 'pending';
    return true;
  });

  const selectedConversation = conversations.find(c => c.id === selectedId);
  const activeCount = conversations.filter(c => c.status === 'ai-active').length;

  const handleTakeOver = () => {
    if (!selectedId) return;
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          status: 'admin-mode' as const,
          messages: [...conv.messages, {
            sender: 'ai' as const,
            text: '[ระบบ] Admin Ann เข้ามารับช่วงต่อแล้วค่ะ',
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return conv;
    }));
    setShowAdminModal(true);
  };

  const handleTransfer = (team: string) => {
    if (!selectedId) return;
    const teamNames: Record<string, string> = {
      general: 'ทีมทันตกรรมทั่วไป',
      surgery: 'ทีมศัลยกรรมช่องปาก',
      ortho: 'ทีมจัดฟัน',
      cosmetic: 'ทีมเสริมความงาม'
    };
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          status: 'admin-mode' as const,
          lastMessage: `ส่งต่อไปยัง ${teamNames[team]}`,
          messages: [...conv.messages, {
            sender: 'ai' as const,
            text: `[ระบบ] ส่งต่อไปยัง ${teamNames[team]} แล้วค่ะ`,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return conv;
    }));
    setShowTransferModal(false);
  };

  const handleSimulateNewChat = () => {
    const names = ["คุณธนา", "คุณปิยะ", "คุณจันทร์", "คุณดวง", "คุณเอก"];
    const messages = [
      "สวัสดีค่ะ อยากสอบถามราคาทำฟันค่ะ",
      "ฟันผุต้องถอนไหมคะ",
      "มีบริการทำฟันปลอมไหมครับ"
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const channels: Array<{ channel: 'LINE' | 'Facebook', icon: string, color: string }> = [
      { channel: "LINE", icon: "L", color: "bg-green-500" },
      { channel: "Facebook", icon: "f", color: "bg-blue-600" }
    ];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const avatarColors = [
      { bg: "bg-green-100", color: "text-green-600" },
      { bg: "bg-purple-100", color: "text-purple-600" },
      { bg: "bg-orange-100", color: "text-orange-600" }
    ];
    const randomAvatar = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newConv: Conversation = {
      id: Date.now(),
      customerName: randomName,
      channel: randomChannel.channel,
      channelIcon: randomChannel.icon,
      channelColor: randomChannel.color,
      avatarBg: randomAvatar.bg,
      avatarColor: randomAvatar.color,
      status: "ai-active",
      lastMessage: randomMessage,
      time: "เมื่อกี้",
      messages: [
        { sender: "customer", text: randomMessage, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) },
        { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ กำลังตรวจสอบข้อมูลให้ค่ะ กรุณารอสักครู่นะคะ", time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }
      ],
      quickReplies: ["ดูราคา", "นัดหมาย", "สอบถามเพิ่มเติม"]
    };

    setConversations(prev => [newConv, ...prev]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Chatbot Demo</h1>
            <p className="text-sm text-gray-500">จำลองการทำงานของ AI ตอบแชทลูกค้าอัตโนมัติ</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl">
              <div className="ai-pulse w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-purple-700">AI กำลังทำงาน</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              <p className="text-xs text-gray-500">แชทที่ AI กำลังตอบ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversations List */}
        <div className="w-96 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                AI Conversations
              </h2>
              <button
                onClick={handleSimulateNewChat}
                className="px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
              >
                + จำลองแชทใหม่
              </button>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-2">
              {(['all', 'ai-active', 'pending'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded-lg ${
                    filter === f
                      ? 'bg-dental-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'ทั้งหมด' : f === 'ai-active' ? 'AI ตอบอยู่' : 'รอส่งต่อ'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-center text-sm">ไม่มีแชทในหมวดนี้</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const style = statusStyles[conv.status];
                return (
                  <div
                    key={conv.id}
                    className={`chat-card bg-white rounded-xl p-4 shadow-sm border-l-4 ${style.border} cursor-pointer transition-all hover:shadow-md ${
                      selectedId === conv.id ? 'ring-2 ring-dental-500 bg-dental-50' : ''
                    }`}
                    onClick={() => setSelectedId(conv.id)}
                  >
                    {/* Row 1: Avatar + Name + Time */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 ${conv.avatarBg} rounded-full flex items-center justify-center`}>
                            <span className={`${conv.avatarColor} font-semibold`}>{conv.customerName.charAt(3)}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm ${channelIconColors[conv.channel] || 'text-gray-500'}`}>
                            {channelIcons[conv.channel] || <span className="text-[8px] font-bold">{conv.channelIcon}</span>}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{conv.customerName}</p>
                          <p className="text-xs text-gray-500">{conv.channel}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>

                    {/* Row 2: Last Message */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{conv.lastMessage}</p>

                    {/* Row 3: Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${style.badge} text-xs rounded-full font-medium`}>
                        {style.pulse && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full ai-pulse"></span>}
                        {style.badgeText}
                      </span>
                      {conv.aiNote && <span className="text-xs text-orange-500 font-medium">⚠️</span>}
                    </div>

                    {/* Row 4: Footer Info */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className={`flex items-center gap-1 ${channelIconColors[conv.channel] || 'text-gray-500'}`}>
                        {channelIcons[conv.channel]}
                        {conv.channel}
                      </span>
                      <span>{conv.messages.length} ข้อความ</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Chat Preview */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            {selectedConversation ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 ${selectedConversation.avatarBg} rounded-full flex items-center justify-center`}>
                      <span className={`${selectedConversation.avatarColor} font-semibold`}>{selectedConversation.customerName.charAt(3)}</span>
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${selectedConversation.channelColor} rounded text-white text-[8px] flex items-center justify-center font-bold`}>
                      {selectedConversation.channelIcon}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedConversation.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.channel} - {
                        selectedConversation.status === "ai-active" ? "AI กำลังตอบ" :
                        selectedConversation.status === "pending" ? "รอส่งต่อ Admin" : "Admin Mode"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConversation.status === "ai-active" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      <span className="w-2 h-2 bg-purple-500 rounded-full ai-pulse"></span>
                      AI กำลังตอบ
                    </span>
                  )}
                  {selectedConversation.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      รอส่งต่อ Admin
                    </span>
                  )}
                  {selectedConversation.status === "admin-mode" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-dental-100 text-dental-700 text-sm rounded-full">
                      <span className="w-2 h-2 bg-dental-500 rounded-full"></span>
                      Admin Mode
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">?</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">เลือกแชทเพื่อดูบทสนทนา</p>
                  <p className="text-xs text-gray-500">คลิกที่รายการแชทด้านซ้าย</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedConversation ? (
              <>
                {selectedConversation.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} mb-4`}>
                    <div className={`max-w-[80%] ${
                      msg.sender === 'customer'
                        ? 'bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none'
                        : 'bg-purple-500 text-white rounded-2xl rounded-tr-none'
                    } px-4 py-3`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs ${msg.sender === 'customer' ? 'text-gray-500' : 'text-purple-200'} mt-1 text-right`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                {selectedConversation.status === "pending" && selectedConversation.aiNote && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm">
                      <span className="font-medium">AI Note:</span> {selectedConversation.aiNote}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 text-sm py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>เลือกแชทจากรายการด้านซ้ายเพื่อดูบทสนทนา</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {selectedConversation && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedConversation.status !== 'admin-mode' && selectedConversation.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTakeOver}
                    className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    รับเรื่องต่อ
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    ส่งต่อทีม
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Stats Footer */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">AI Chatbot Performance</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-xs text-purple-200">ตอบได้เองโดยไม่ต้องส่งต่อ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1.2s</p>
              <p className="text-xs text-purple-200">เวลาตอบเฉลี่ย</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-purple-200">แชทที่ตอบวันนี้</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">ส่งต่อทีม</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">เลือกทีมที่ต้องการส่งต่อ:</p>
              <div className="space-y-2">
                {[
                  { id: 'general', name: 'ทีมทันตกรรมทั่วไป', desc: 'ขูดหินปูน, อุดฟัน, ถอนฟัน', color: 'blue' },
                  { id: 'surgery', name: 'ทีมศัลยกรรมช่องปาก', desc: 'ผ่าฟันคุด, รากเทียม', color: 'red' },
                  { id: 'ortho', name: 'ทีมจัดฟัน', desc: 'จัดฟัน, Invisalign', color: 'purple' },
                  { id: 'cosmetic', name: 'ทีมเสริมความงาม', desc: 'ฟอกฟัน, วีเนียร์, ครอบฟัน', color: 'pink' }
                ].map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleTransfer(team.id)}
                    className={`w-full p-3 text-left border border-gray-200 rounded-xl hover:bg-${team.color}-50 hover:border-${team.color}-300 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${team.color}-100 rounded-lg flex items-center justify-center`}>
                        <Users className={`w-5 h-5 text-${team.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowTransferModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Mode Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-dental-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-dental-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">รับเรื่องต่อสำเร็จ</h3>
              <p className="text-sm text-gray-600 mb-4">คุณได้รับช่วงต่อจาก AI แล้ว สามารถตอบลูกค้าได้เลย</p>
              <button
                onClick={() => setShowAdminModal(false)}
                className="w-full px-4 py-2 bg-dental-500 text-white rounded-xl hover:bg-dental-600 transition-colors"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
