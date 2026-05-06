import { useState } from 'react';
import { MessageCircle, Search, X, Check, Send, Archive } from 'lucide-react';

type TabType = 'audit' | 'admin-complete' | 'ai-complete';
type MessageSender = 'customer' | 'ai' | 'admin' | 'system';

interface Message {
  sender: MessageSender;
  text: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  phone: string;
  channel: 'LINE' | 'Facebook' | 'Instagram';
  avatar: string;
  status: TabType;
  lastMessage: string;
  time: string;
  unread: number;
  service: string;
  respondedBy: 'ai' | 'admin';
  completedBy?: string;
  completedAt?: string;
  messages: Message[];
}

const initialChats: Chat[] = [
  {
    id: 1, name: 'คุณสมชาย', phone: '081-234-5678', channel: 'LINE', avatar: 'ส', status: 'audit',
    lastMessage: 'ขอบคุณครับ AI ตอบได้ครบถ้วน', time: '10:32', unread: 0, service: 'ผ่าฟันคุด',
    respondedBy: 'ai', completedAt: '10:35',
    messages: [
      { sender: 'customer', text: 'สวัสดีครับ', time: '10:30' },
      { sender: 'customer', text: 'อยากจะนัดผ่าฟันคุดครับ', time: '10:32' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nบริการผ่าฟันคุดที่ Dental Plus\n💰 ราคา: 3,500-8,000 บาท/ซี่\n⏰ ใช้เวลา: 30-60 นาที\n\nต้องการนัดวันไหนดีคะ?', time: '10:33' },
      { sender: 'customer', text: 'ขอบคุณครับ AI ตอบได้ครบถ้วน', time: '10:35' },
    ]
  },
  {
    id: 2, name: 'คุณพิมพ์ลดา', phone: '089-876-5432', channel: 'Facebook', avatar: 'พ', status: 'audit',
    lastMessage: 'ขอบคุณค่ะ ได้ข้อมูลครบแล้ว', time: '10:28', unread: 0, service: 'จัดฟัน',
    respondedBy: 'ai', completedAt: '10:30',
    messages: [
      { sender: 'customer', text: 'สวัสดีค่ะ', time: '10:25' },
      { sender: 'customer', text: 'รบกวนสอบถามราคาจัดฟันค่ะ', time: '10:28' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nสำหรับการจัดฟันที่ Dental Plus:\n\n1. จัดฟันแบบโลหะ: 35,000 บาท\n2. จัดฟันแบบเซรามิก: 45,000 บาท\n3. จัดฟันใส (Invisalign): 120,000 บาท\n\nสนใจแบบไหนเป็นพิเศษคะ?', time: '10:28' },
    ]
  },
  {
    id: 3, name: 'คุณวิชัย', phone: '062-111-2222', channel: 'LINE', avatar: 'ว', status: 'admin-complete',
    lastMessage: 'ขอบคุณครับ นัดวันเสาร์นะครับ', time: '10:15', unread: 0, service: 'ขูดหินปูน',
    respondedBy: 'admin', completedBy: 'แอดมินน้ำ',
    messages: [
      { sender: 'customer', text: 'สอบถามเรื่องขูดหินปูนครับ', time: '09:50' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ ขูดหินปูนราคา 800-1,200 บาทค่ะ', time: '09:51' },
      { sender: 'customer', text: 'วันเสาร์ว่างไหมครับ', time: '10:00' },
      { sender: 'admin', text: '👤 วันเสาร์ว่างค่ะ ช่วง 10:30 สะดวกไหมคะ?', time: '10:10' },
      { sender: 'customer', text: 'ขอบคุณครับ นัดวันเสาร์นะครับ', time: '10:15' },
    ]
  },
  {
    id: 4, name: 'คุณสุภา', phone: '087-777-8888', channel: 'Facebook', avatar: 'ส', status: 'audit',
    lastMessage: 'ได้เลยค่ะ ขอบคุณค่ะ', time: '09:40', unread: 0, service: 'ปรึกษา',
    respondedBy: 'ai', completedAt: '09:45',
    messages: [
      { sender: 'customer', text: 'มีโปรโมชั่นอะไรบ้างคะ', time: '09:40' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ โปรโมชั่นเดือนนี้:\n\n1. ฟอกสีฟัน ลด 20% เหลือ 3,200 บาท\n2. ขูดหินปูน + ขัดฟัน 999 บาท\n3. จัดฟันใส ผ่อน 0% 12 เดือน', time: '09:41' },
      { sender: 'customer', text: 'ได้เลยค่ะ ขอบคุณค่ะ', time: '09:45' },
    ]
  },
  {
    id: 5, name: 'คุณมานะ', phone: '083-999-0000', channel: 'LINE', avatar: 'ม', status: 'ai-complete',
    lastMessage: 'ได้เลยครับ ขอบคุณมากครับ', time: '09:20', unread: 0, service: 'ฟอกสีฟัน',
    respondedBy: 'ai', completedAt: '09:25',
    messages: [
      { sender: 'customer', text: 'ฟอกสีฟันราคาเท่าไหร่ครับ', time: '09:00' },
      { sender: 'ai', text: '🤖 ฟอกสีฟัน Zoom Whitening: 4,000 บาท (โปรเหลือ 3,200 บาท)', time: '09:01' },
      { sender: 'customer', text: 'นัดวันอาทิตย์ 13:00 ได้ไหมครับ', time: '09:15' },
      { sender: 'ai', text: '🤖 ยืนยันนัดหมาย วันอาทิตย์ 13:00 ฟอกสีฟันค่ะ', time: '09:16' },
      { sender: 'customer', text: 'ได้เลยครับ ขอบคุณมากครับ', time: '09:20' },
    ]
  },
  {
    id: 6, name: 'คุณกัญญา', phone: '088-333-5555', channel: 'Instagram', avatar: 'ก', status: 'ai-complete',
    lastMessage: 'ขอบคุณสำหรับข้อมูลค่ะ', time: '08:30', unread: 0, service: 'ผ่าฟันคุด',
    respondedBy: 'ai', completedAt: '08:35',
    messages: [
      { sender: 'customer', text: 'พรุ่งนี้นัดผ่าฟันคุด ต้องเตรียมตัวยังไงบ้างคะ', time: '08:30' },
      { sender: 'ai', text: '🤖 การเตรียมตัวก่อนผ่าฟันคุด:\n\n✅ พักผ่อนให้เพียงพอ\n✅ รับประทานอาหารก่อนมา 2-3 ชม.\n✅ ไม่ดื่มแอลกอฮอล์ 24 ชม.\n✅ นำบัตรประชาชนมาด้วย', time: '08:31' },
      { sender: 'customer', text: 'ขอบคุณสำหรับข้อมูลค่ะ', time: '08:35' },
    ]
  },
  {
    id: 7, name: 'คุณธนา', phone: '084-222-4444', channel: 'Facebook', avatar: 'ธ', status: 'admin-complete',
    lastMessage: 'เข้าใจแล้วครับ ขอบคุณแอดมินครับ', time: '08:45', unread: 0, service: 'จัดฟัน',
    respondedBy: 'admin', completedBy: 'แอดมินน้ำ',
    messages: [
      { sender: 'customer', text: 'มีหมอเฉพาะทางจัดฟันไหมครับ', time: '08:45' },
      { sender: 'admin', text: '👤 มีค่ะ! ทพญ.พิมพ์ใจ และ ทพ.ศิริชัย ประสบการณ์ 10+ ปีค่ะ', time: '08:47' },
      { sender: 'customer', text: 'เข้าใจแล้วครับ ขอบคุณแอดมินครับ', time: '08:50' },
    ]
  },
];

const channelColors: Record<string, string> = {
  'LINE': 'bg-green-500',
  'Facebook': 'bg-blue-500',
  'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500'
};

export function ChatManagement() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [currentTab, setCurrentTab] = useState<TabType>('audit');
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState('ขออภัยค่ะ ข้อมูลที่แจ้งก่อนหน้านี้ไม่ถูกต้อง ขอแก้ไขดังนี้:\n\n');

  const filteredChats = chats
    .filter(c => c.status === currentTab)
    .filter(c =>
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );

  const currentChat = chats.find(c => c.id === currentChatId);

  const counts = {
    audit: chats.filter(c => c.status === 'audit').length,
    'admin-complete': chats.filter(c => c.status === 'admin-complete').length,
    'ai-complete': chats.filter(c => c.status === 'ai-complete').length,
  };

  const handleConfirmAI = () => {
    if (!currentChat) return;
    const now = new Date().toTimeString().slice(0, 5);

    setChats(prev => prev.map(c => {
      if (c.id === currentChat.id) {
        return {
          ...c,
          status: 'ai-complete' as TabType,
          completedAt: now,
          messages: [...c.messages, { sender: 'system' as MessageSender, text: '✅ Head Admin ยืนยันการตอบของ AI ถูกต้องแล้ว', time: now }]
        };
      }
      return c;
    }));

    setShowConfirmModal(false);
    setCurrentTab('ai-complete');
  };

  const handleRejectAI = () => {
    if (!currentChat || !correctionMessage.trim()) return;
    const now = new Date().toTimeString().slice(0, 5);

    setChats(prev => prev.map(c => {
      if (c.id === currentChat.id) {
        return {
          ...c,
          status: 'admin-complete' as TabType,
          completedBy: 'Head Admin (แก้ไข AI)',
          lastMessage: correctionMessage,
          time: now,
          messages: [
            ...c.messages,
            { sender: 'admin' as MessageSender, text: correctionMessage, time: now },
            { sender: 'system' as MessageSender, text: '✅ Head Admin ส่งข้อความแก้ไขให้ลูกค้าแล้ว', time: now }
          ]
        };
      }
      return c;
    }));

    setShowRejectModal(false);
    setCorrectionMessage('ขออภัยค่ะ ข้อมูลที่แจ้งก่อนหน้านี้ไม่ถูกต้อง ขอแก้ไขดังนี้:\n\n');
    setCurrentTab('admin-complete');
  };

  const tabStyles = {
    audit: { active: 'bg-yellow-500 text-white', inactive: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
    'admin-complete': { active: 'bg-green-600 text-white', inactive: 'bg-green-100 text-green-700 hover:bg-green-200' },
    'ai-complete': { active: 'bg-blue-600 text-white', inactive: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Chat Management - Head Admin</h1>
              <p className="text-sm text-gray-500">ยืนยันแชทที่ AI ปิดแล้ว / ดูประวัติที่จัดการเสร็จ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="text-lg">🤖</span>
              <span className="text-sm text-green-700 font-medium">AI Active</span>
            </div>
            <span className="text-sm text-gray-500">ข้อความทั้งหมด:</span>
            <span className="text-2xl font-bold text-blue-600">{chats.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-8 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('audit')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'audit' ? tabStyles.audit.active : tabStyles.audit.inactive
            }`}
          >
            <span className="mr-1">🔍</span> Audit - ยืนยันแชทจาก AI
            <span className="ml-1 px-1.5 py-0.5 bg-yellow-400/50 text-xs rounded-full">{counts.audit}</span>
          </button>
          <button
            onClick={() => setCurrentTab('admin-complete')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'admin-complete' ? tabStyles['admin-complete'].active : tabStyles['admin-complete'].inactive
            }`}
          >
            <span className="mr-1">👤</span> ประวัติ Admin
            <span className="ml-1 px-1.5 py-0.5 bg-green-200/50 text-xs rounded-full">{counts['admin-complete']}</span>
          </button>
          <button
            onClick={() => setCurrentTab('ai-complete')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'ai-complete' ? tabStyles['ai-complete'].active : tabStyles['ai-complete'].inactive
            }`}
          >
            <span className="mr-1">🤖</span> ประวัติ AI
            <span className="ml-1 px-1.5 py-0.5 bg-blue-200/50 text-xs rounded-full">{counts['ai-complete']}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-96 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาชื่อ / เบอร์โทร..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-center text-sm">ไม่มีแชทในหมวดนี้</p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`chat-card bg-white rounded-xl p-4 shadow-sm border-l-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    currentTab === 'audit' ? 'border-l-yellow-500' :
                    currentTab === 'admin-complete' ? 'border-l-green-500' : 'border-l-blue-500'
                  } ${currentChatId === chat.id ? 'ring-2 ring-dental-500 bg-dental-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${channelColors[chat.channel]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {chat.avatar}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{chat.name}</p>
                        <p className="text-xs text-gray-500">{chat.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{chat.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        currentTab === 'audit' ? 'bg-yellow-100 text-yellow-700' :
                        currentTab === 'admin-complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {currentTab === 'audit' ? '🔍 รอยืนยัน' :
                         currentTab === 'admin-complete' ? '👤 Admin' : '🤖 AI Complete'}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{chat.service}</span>
                    </div>
                    <span className="text-xs text-purple-500 font-medium">
                      {chat.respondedBy === 'ai' ? '🤖 AI' : '👤 Admin'}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{chat.channel}</span>
                    {chat.completedBy ? (
                      <span className="text-green-600">โดย: {chat.completedBy}</span>
                    ) : (
                      <span>ปิดเมื่อ: {chat.completedAt || chat.time}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {!currentChat ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>เลือกแชทจากรายการด้านซ้าย</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${channelColors[currentChat.channel]} rounded-full flex items-center justify-center text-white font-bold`}>
                    {currentChat.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{currentChat.name}</p>
                    <p className="text-xs text-gray-500">{currentChat.phone} • {currentChat.channel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentChat.status === 'audit' && (
                    <>
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        ยืนยัน AI ถูกต้อง
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        แก้ไข
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Banner */}
              {currentChat.status === 'audit' && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🔍</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">AI ปิดแชทนี้แล้ว - รอ Head Admin ยืนยัน</p>
                      <p className="text-xs text-yellow-600 mt-1">บริการ: {currentChat.service} | ปิดเมื่อ: {currentChat.completedAt || currentChat.time}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentChat.status === 'ai-complete' && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">ประวัติแชท AI - ยืนยันแล้ว</p>
                      <p className="text-xs text-blue-600 mt-1">บริการ: {currentChat.service} | ปิดเมื่อ: {currentChat.completedAt || currentChat.time}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">📁 เก็บประวัติ</span>
                  </div>
                </div>
              )}

              {currentChat.status === 'admin-complete' && (
                <div className="bg-green-50 border-b border-green-200 px-6 py-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">ประวัติแชท - ดำเนินการเสร็จสิ้นแล้ว</p>
                      <p className="text-xs text-green-600 mt-1">บริการ: {currentChat.service} | โดย: {currentChat.completedBy || 'Admin'}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">📁 เก็บประวัติ</span>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentChat.messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    {msg.sender === 'system' ? (
                      <div className="flex justify-center w-full my-2">
                        <div className="px-4 py-2 bg-gray-100 rounded-full">
                          <p className="text-xs text-gray-600">{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-[70%] ${
                        msg.sender === 'customer' ? 'bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100' :
                        msg.sender === 'ai' ? 'bg-green-100 rounded-2xl rounded-br-md' :
                        'bg-dental-500 text-white rounded-2xl rounded-br-md'
                      } px-4 py-3`}>
                        {msg.sender !== 'customer' && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className={`text-xs font-medium ${
                              msg.sender === 'ai' ? 'text-green-600' : 'text-dental-100'
                            }`}>
                              {msg.sender === 'ai' ? '🤖 AI ตอบ' : '👤 คุณ'}
                            </span>
                          </div>
                        )}
                        <p className={`text-sm whitespace-pre-wrap ${msg.sender === 'customer' ? 'text-gray-800' : ''}`}>
                          {msg.text}
                        </p>
                        <p className={`text-xs mt-1 text-right ${
                          msg.sender === 'customer' ? 'text-gray-400' :
                          msg.sender === 'ai' ? 'text-green-600' : 'text-dental-200'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              {currentChat.status === 'audit' ? (
                <div className="bg-yellow-50 px-6 py-4 border-t border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <span className="text-sm font-medium">กรุณาตรวจสอบการตอบของ AI แล้วกดยืนยันหรือส่งกลับแก้ไข</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600"
                      >
                        ✓ ยืนยัน
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200"
                      >
                        ✗ แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`px-6 py-4 border-t ${
                  currentChat.status === 'ai-complete' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Archive className="w-5 h-5" />
                    <span className="text-sm">
                      {currentChat.status === 'ai-complete' ? 'ประวัติแชท AI - ดูได้อย่างเดียว' : 'ประวัติแชท Admin - ดูได้อย่างเดียว'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">สรุปการจัดการแชทวันนี้</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">{counts.audit}</p>
              <p className="text-xs text-blue-200">🔍 รอยืนยัน</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-300">{counts['admin-complete']}</p>
              <p className="text-xs text-blue-200">👤 Admin</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-300">{counts['ai-complete']}</p>
              <p className="text-xs text-blue-200">🤖 AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && currentChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-green-500 px-5 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Check className="w-6 h-6" />
                ยืนยันการตอบของ AI
              </h3>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-12 h-12 ${channelColors[currentChat.channel]} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {currentChat.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{currentChat.name}</p>
                  <p className="text-sm text-gray-500">{currentChat.service}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">🤖 AI สรุปการสนทนา:</p>
                <p className="text-sm text-gray-700">{currentChat.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-2">เวลาที่ AI ปิดแชท: {currentChat.completedAt || currentChat.time}</p>
              </div>
              <p className="text-sm text-gray-600">
                คุณยืนยันว่า AI ตอบถูกต้องและครบถ้วนแล้วใช่ไหม?
                <br />
                <span className="text-xs text-blue-500">แชทจะถูกย้ายไปยัง "ประวัติ AI"</span>
              </p>
            </div>
            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmAI}
                className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && currentChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-orange-500 px-5 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-6 h-6" />
                AI ตอบไม่ถูกต้อง - ส่งข้อความแก้ไข
              </h3>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-12 h-12 ${channelColors[currentChat.channel]} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {currentChat.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{currentChat.name}</p>
                  <p className="text-sm text-gray-500">{currentChat.phone} • {currentChat.service}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความแก้ไขที่จะส่งถึงลูกค้า:</label>
                <textarea
                  value={correctionMessage}
                  onChange={(e) => setCorrectionMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="พิมพ์ข้อความที่ถูกต้องที่จะส่งให้ลูกค้า..."
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRejectAI}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                ส่งข้อความแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
