import { useState, DragEvent } from 'react';
import {
  Users,
  Inbox,
  MessageSquare,
  X
} from 'lucide-react';

interface Message {
  sender: 'customer' | 'ai';
  text: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  phone: string;
  channel: 'LINE' | 'Facebook' | 'Instagram';
  avatar: string;
  summary: string;
  priority: 'urgent' | 'new' | 'normal';
  service: string;
  time: string;
  sentBy: string;
  messages: Message[];
}

interface Admin {
  id: string;
  name: string;
  team: 'general' | 'surgery' | 'ortho' | 'cosmetic';
  color: string;
  online: boolean;
  tasks: Chat[];
}

type TeamFilter = 'all' | 'general' | 'surgery' | 'ortho' | 'cosmetic';

const initialChats: Chat[] = [
  {
    id: 1,
    name: 'คุณสมชาย',
    phone: '081-234-5678',
    channel: 'LINE',
    avatar: 'ส',
    summary: 'ปวดฟันคุดมาก 2 วัน กินยาแก้ปวดไม่หาย ต้องการผ่าฟันคุด',
    priority: 'urgent',
    service: 'ผ่าฟันคุด',
    time: '10:32',
    sentBy: 'ai',
    messages: [
      { sender: 'customer', text: 'สวัสดีครับ ปวดฟันคุดมากเลยครับ', time: '10:30' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ เสียใจที่ทราบว่าคุณปวดฟันค่ะ ช่วยบอกรายละเอียดเพิ่มเติมได้ไหมคะ?', time: '10:31' },
      { sender: 'customer', text: 'ปวดมา 2 วันแล้ว กินยาแก้ปวดไม่หาย อยากผ่าออกครับ', time: '10:32' },
    ]
  },
  {
    id: 2,
    name: 'คุณลิซ่า',
    phone: '089-876-5432',
    channel: 'Facebook',
    avatar: 'ล',
    summary: 'สนใจจัดฟัน อยากปรึกษาราคาและระยะเวลา งบประมาณ 50,000 บาท',
    priority: 'new',
    service: 'จัดฟัน',
    time: '10:28',
    sentBy: 'ai',
    messages: [
      { sender: 'customer', text: 'สนใจจัดฟันค่ะ', time: '10:25' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ ยินดีให้บริการค่ะ มีหลายแบบให้เลือกค่ะ', time: '10:26' },
      { sender: 'customer', text: 'งบประมาณ 50,000 บาทพอไหมคะ', time: '10:28' },
    ]
  },
  {
    id: 3,
    name: 'คุณวิภา',
    phone: '091-333-4444',
    channel: 'Instagram',
    avatar: 'ว',
    summary: 'ต้องการทำวีเนียร์ 4 ซี่ สอบถามราคาและนัดปรึกษา',
    priority: 'normal',
    service: 'วีเนียร์',
    time: '10:15',
    sentBy: 'Admin แอน',
    messages: [
      { sender: 'customer', text: 'สนใจทำวีเนียร์ค่ะ', time: '10:10' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ วีเนียร์ที่คลินิกเราใช้วัสดุคุณภาพสูงค่ะ', time: '10:12' },
      { sender: 'customer', text: 'อยากทำ 4 ซี่ค่ะ ราคาเท่าไหร่', time: '10:15' },
    ]
  },
  {
    id: 4,
    name: 'คุณประเสริฐ',
    phone: '085-555-6666',
    channel: 'LINE',
    avatar: 'ป',
    summary: 'ฟันผุหลายซี่ อยากอุดฟัน สอบถามราคา',
    priority: 'normal',
    service: 'อุดฟัน',
    time: '10:05',
    sentBy: 'ai',
    messages: [
      { sender: 'customer', text: 'ฟันผุหลายซี่ครับ ต้องทำยังไง', time: '10:00' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ ต้องมาตรวจก่อนเพื่อดูความรุนแรงค่ะ', time: '10:02' },
      { sender: 'customer', text: 'ราคาอุดฟันเท่าไหร่ครับ', time: '10:05' },
    ]
  },
  {
    id: 5,
    name: 'คุณมานะ',
    phone: '083-999-0000',
    channel: 'LINE',
    avatar: 'ม',
    summary: 'สนใจฟอกสีฟัน ถามโปรโมชั่น',
    priority: 'new',
    service: 'ฟอกสีฟัน',
    time: '09:55',
    sentBy: 'Admin เบน',
    messages: [
      { sender: 'customer', text: 'มีโปรฟอกสีฟันไหมครับ', time: '09:50' },
      { sender: 'ai', text: '🤖 สวัสดีค่ะ เดือนนี้มีโปร Zoom Whitening ลด 20% ค่ะ', time: '09:52' },
      { sender: 'customer', text: 'ราคาเท่าไหร่หลังลดครับ', time: '09:55' },
    ]
  },
];

const initialAdmins: Admin[] = [
  { id: 'ann', name: 'Admin แอน', team: 'general', color: 'pink', online: true, tasks: [] },
  { id: 'ben', name: 'Admin เบน', team: 'general', color: 'blue', online: true, tasks: [] },
  { id: 'cat', name: 'Admin แคท', team: 'ortho', color: 'purple', online: true, tasks: [] },
  { id: 'dan', name: 'Admin แดน', team: 'surgery', color: 'red', online: false, tasks: [] },
  { id: 'eve', name: 'Admin อีฟ', team: 'cosmetic', color: 'amber', online: true, tasks: [] },
  { id: 'fay', name: 'Admin เฟย์', team: 'ortho', color: 'green', online: true, tasks: [] },
];

const channelColors: Record<string, string> = {
  'LINE': 'bg-green-500',
  'Facebook': 'bg-blue-500',
  'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500'
};

const priorityConfig: Record<string, { bg: string; text: string; badge: string; label: string }> = {
  'urgent': { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500 text-white', label: 'เร่งด่วน' },
  'new': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500 text-white', label: 'ใหม่' },
  'normal': { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-400 text-white', label: 'ปกติ' }
};

const teamConfig: Record<string, { bg: string; text: string; label: string }> = {
  'general': { bg: 'bg-blue-100', text: 'text-blue-600', label: 'ทันตกรรมทั่วไป' },
  'surgery': { bg: 'bg-red-100', text: 'text-red-600', label: 'ศัลยกรรม' },
  'ortho': { bg: 'bg-purple-100', text: 'text-purple-600', label: 'จัดฟัน' },
  'cosmetic': { bg: 'bg-amber-100', text: 'text-amber-600', label: 'เสริมความงาม' }
};

const avatarColors: Record<string, string> = {
  'pink': 'bg-pink-100 text-pink-600',
  'blue': 'bg-blue-100 text-blue-600',
  'purple': 'bg-purple-100 text-purple-600',
  'red': 'bg-red-100 text-red-600',
  'amber': 'bg-amber-100 text-amber-600',
  'green': 'bg-green-100 text-green-600'
};

const teamFilters: { key: TeamFilter; label: string }[] = [
  { key: 'all', label: 'ทุกทีม' },
  { key: 'general', label: 'ทันตกรรมทั่วไป' },
  { key: 'surgery', label: 'ศัลยกรรม' },
  { key: 'ortho', label: 'จัดฟัน' },
  { key: 'cosmetic', label: 'เสริมความงาม' },
];

export function ChatDispatchCenter() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');
  const [draggedChatId, setDraggedChatId] = useState<number | null>(null);
  const [dragOverAdminId, setDragOverAdminId] = useState<string | null>(null);

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const filteredAdmins = teamFilter === 'all'
    ? admins
    : admins.filter(a => a.team === teamFilter);

  const handleSelectChat = (chatId: number) => {
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    } else {
      setSelectedChatId(chatId);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, chatId: number) => {
    setDraggedChatId(chatId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedChatId(null);
    setDragOverAdminId(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, adminId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverAdminId(adminId);
  };

  const handleDragLeave = () => {
    setDragOverAdminId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, adminId: string) => {
    e.preventDefault();
    if (draggedChatId === null) return;

    const chatIndex = chats.findIndex(c => c.id === draggedChatId);
    if (chatIndex === -1) return;

    const chat = chats[chatIndex];
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return;

    // Check if already assigned
    if (admin.tasks.some(t => t.id === draggedChatId)) return;

    // Remove from queue and add to admin
    const newChats = [...chats];
    newChats.splice(chatIndex, 1);
    setChats(newChats);

    const newAdmins = admins.map(a => {
      if (a.id === adminId) {
        return { ...a, tasks: [...a.tasks, chat] };
      }
      return a;
    });
    setAdmins(newAdmins);

    // Clear selection if it was the assigned chat
    if (selectedChatId === draggedChatId) {
      setSelectedChatId(null);
    }

    setDraggedChatId(null);
    setDragOverAdminId(null);
  };

  const handleRemoveFromAdmin = (chatId: number) => {
    let removedChat: Chat | null = null;

    const newAdmins = admins.map(admin => {
      const taskIndex = admin.tasks.findIndex(t => t.id === chatId);
      if (taskIndex !== -1) {
        removedChat = admin.tasks[taskIndex];
        return {
          ...admin,
          tasks: admin.tasks.filter(t => t.id !== chatId)
        };
      }
      return admin;
    });

    if (removedChat) {
      setAdmins(newAdmins);
      setChats([removedChat, ...chats]);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Center</h1>
              <p className="text-sm text-gray-500">จัดการแชทและมอบหมายงานให้ Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-xl">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700">AI กำลังทำงาน</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{chats.length}</p>
              <p className="text-xs text-gray-500">รอมอบหมาย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area: 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Chat Detail */}
        <div className={`border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300 ${
          selectedChat ? 'w-[400px]' : 'w-0 overflow-hidden'
        }`}>
          {selectedChat ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChatId(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className={`w-10 h-10 ${channelColors[selectedChat.channel]} rounded-full flex items-center justify-center text-white font-bold`}>
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedChat.name}</p>
                    <p className="text-xs text-gray-500">{selectedChat.phone} - {selectedChat.channel}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 ${priorityConfig[selectedChat.priority].badge} text-xs rounded-full`}>
                  {priorityConfig[selectedChat.priority].label}
                </span>
              </div>

              {/* AI Summary */}
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="text-xs font-medium text-indigo-700 mb-1">AI Summary</p>
                    <p className="text-sm text-gray-700">{selectedChat.summary}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      msg.sender === 'customer'
                        ? 'bg-white rounded-bl-md shadow-sm border border-gray-100'
                        : 'bg-green-100 rounded-br-md'
                    }`}>
                      <p className="text-sm text-gray-800">{msg.text}</p>
                      <p className={`text-xs mt-1 text-right ${
                        msg.sender === 'customer' ? 'text-gray-400' : 'text-green-600'
                      }`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Info */}
              <div className="bg-white px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">บริการ:</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg font-medium">
                      {selectedChat.service}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">เวลาล่าสุด: {selectedChat.time}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>เลือกแชทจากรายการด้านขวา</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Chat Queue */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-orange-50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-orange-500" />
                รอมอบหมาย
              </h2>
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                {chats.length}
              </span>
            </div>
            <p className="text-xs text-gray-500">ลากการ์ดไปวางที่ช่อง Admin ด้านขวา</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chats.map((chat) => {
              const priority = priorityConfig[chat.priority];
              const isSelected = chat.id === selectedChatId;
              const isDragging = chat.id === draggedChatId;
              const isAI = chat.sentBy === 'ai';

              return (
                <div
                  key={chat.id}
                  className={`bg-white rounded-xl p-3 shadow-sm border-2 cursor-grab transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected ? 'border-dental-500 bg-dental-50' : 'border-gray-100'
                  } ${isDragging ? 'opacity-50 rotate-1' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chat.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 ${channelColors[chat.channel]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {chat.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{chat.name}</p>
                        <p className="text-xs text-gray-500">{chat.channel}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-400">{chat.time}</span>
                      <span className={`px-1.5 py-0.5 ${priority.badge} text-[10px] rounded-full font-medium`}>
                        {priority.label}
                      </span>
                      {isAI ? (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium flex items-center gap-1">
                          <span>🤖</span>AI
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full font-medium flex items-center gap-1">
                          <span>👤</span>{chat.sentBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 mb-2">
                    <p className="text-xs text-gray-600 line-clamp-2">{chat.summary}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {chat.service}
                    </span>
                    <span className="text-xs text-gray-400">{chat.phone}</span>
                  </div>
                </div>
              );
            })}
            {chats.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Inbox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">ไม่มีแชทรอมอบหมาย</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Admin Drop Zones */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                มอบหมายให้ Admin
              </h2>
            </div>
            {/* Team Filter */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {teamFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setTeamFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    teamFilter === filter.key
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredAdmins.map((admin) => {
                const team = teamConfig[admin.team];
                const avatarColor = avatarColors[admin.color] || 'bg-gray-100 text-gray-600';
                const isDragOver = dragOverAdminId === admin.id;

                return (
                  <div
                    key={admin.id}
                    className={`bg-white rounded-2xl shadow-sm border-2 p-4 flex flex-col transition-all ${
                      isDragOver ? 'border-dental-500 bg-dental-50' : 'border-gray-200'
                    }`}
                    onDragOver={(e) => handleDragOver(e, admin.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, admin.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${avatarColor.split(' ')[0]} rounded-full flex items-center justify-center`}>
                          <span className={`${avatarColor.split(' ')[1]} font-bold`}>
                            {admin.name.charAt(admin.name.length - 3).toUpperCase()}
                          </span>
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                          admin.online ? 'bg-green-500' : 'bg-gray-400'
                        } rounded-full border-2 border-white`}></span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">{admin.name}</h3>
                        <p className={`text-xs ${team.text}`}>{team.label}</p>
                      </div>
                      <span className="bg-dental-100 text-dental-700 text-xs px-2 py-1 rounded-full font-medium">
                        {admin.tasks.length}
                      </span>
                    </div>
                    <div className={`flex-1 border-2 border-dashed rounded-xl p-2 min-h-[100px] space-y-2 transition-colors ${
                      isDragOver ? 'border-dental-500 bg-dental-50' : 'border-gray-200'
                    }`}>
                      {admin.tasks.length === 0 ? (
                        <div className="text-center text-gray-300 text-xs py-6">
                          ลากการ์ดมาวาง
                        </div>
                      ) : (
                        admin.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 ${channelColors[task.channel]} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                  {task.avatar}
                                </div>
                                <span className="text-xs font-medium text-gray-700">{task.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFromAdmin(task.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">{task.service}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
