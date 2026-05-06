// Mock Data for Dental Plus Chat Management

export interface Message {
  sender: 'customer' | 'ai' | 'admin' | 'system';
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  customerName: string;
  channel: 'LINE' | 'Facebook' | 'Instagram' | 'TikTok' | 'WhatsApp';
  channelIcon: string;
  channelColor: string;
  avatarBg: string;
  avatarColor: string;
  status: 'ai-active' | 'pending' | 'admin-mode';
  lastMessage: string;
  time: string;
  messages: Message[];
  quickReplies: string[];
  aiNote?: string;
}

export const mockConversations: Conversation[] = [
  {
    id: 1,
    customerName: "คุณมานะ",
    channel: "LINE",
    channelIcon: "L",
    channelColor: "bg-green-500",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-600",
    status: "ai-active",
    lastMessage: "ราคาขูดหินปูนเท่าไหร่คะ",
    time: "2 นาทีที่แล้ว",
    messages: [
      { sender: "customer", text: "สวัสดีค่ะ", time: "10:30" },
      { sender: "ai", text: "สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus ค่ะ มีอะไรให้ช่วยเหลือไหมคะ?", time: "10:30" },
      { sender: "customer", text: "อยากถามราคาขูดหินปูนค่ะ", time: "10:31" },
      { sender: "ai", text: "ราคาขูดหินปูนของเราเริ่มต้นที่ 500-800 บาทค่ะ ขึ้นอยู่กับปริมาณหินปูน หากมีหินปูนมากอาจต้องใช้เวลาทำเพิ่มเติมค่ะ", time: "10:31" },
      { sender: "customer", text: "มีโปรโมชั่นไหมคะ", time: "10:32" },
      { sender: "ai", text: "ตอนนี้มีโปรโมชั่นขูดหินปูน + ตรวจฟันฟรี ในราคา 599 บาทค่ะ โปรโมชั่นนี้หมดเขตสิ้นเดือนนี้ค่ะ สนใจนัดหมายไหมคะ?", time: "10:32" },
      { sender: "customer", text: "ราคาขูดหินปูนเท่าไหร่คะ", time: "10:33" }
    ],
    quickReplies: ["ดูโปรโมชั่นเพิ่มเติม", "นัดหมายเลย", "ถามราคาอื่นๆ"]
  },
  {
    id: 2,
    customerName: "คุณสมศรี",
    channel: "Facebook",
    channelIcon: "f",
    channelColor: "bg-blue-600",
    avatarBg: "bg-pink-100",
    avatarColor: "text-pink-600",
    status: "ai-active",
    lastMessage: "อยากจัดฟันค่ะ ราคาเท่าไหร่",
    time: "5 นาทีที่แล้ว",
    messages: [
      { sender: "customer", text: "สวัสดีค่ะ สนใจจัดฟันค่ะ", time: "10:25" },
      { sender: "ai", text: "สวัสดีค่ะ ยินดีให้บริการค่ะ ทาง Dental Plus มีบริการจัดฟันหลายแบบเลยค่ะ ไม่ทราบว่าสนใจจัดฟันแบบไหนคะ?", time: "10:25" },
      { sender: "customer", text: "จัดฟันแบบใสค่ะ", time: "10:26" },
      { sender: "ai", text: "จัดฟันแบบใส (Invisalign) เริ่มต้นที่ 80,000 - 150,000 บาทค่ะ ขึ้นอยู่กับความซับซ้อนของเคส แนะนำให้มาปรึกษาทันตแพทย์ก่อนเพื่อวางแผนการรักษาที่เหมาะสมค่ะ", time: "10:26" },
      { sender: "customer", text: "แพงจังค่ะ มีผ่อนไหม", time: "10:27" },
      { sender: "ai", text: "มีบริการผ่อนชำระ 0% นานสูงสุด 10 เดือนค่ะ หรือผ่อนผ่านบัตรเครดิตได้ทุกธนาคารค่ะ สนใจนัดปรึกษาฟรีไหมคะ?", time: "10:27" },
      { sender: "customer", text: "อยากจัดฟันค่ะ ราคาเท่าไหร่", time: "10:28" }
    ],
    quickReplies: ["นัดปรึกษาฟรี", "ดูรายละเอียดเพิ่มเติม", "เปรียบเทียบแบบจัดฟัน"]
  },
  {
    id: 3,
    customerName: "คุณวิชัย",
    channel: "LINE",
    channelIcon: "L",
    channelColor: "bg-green-500",
    avatarBg: "bg-yellow-100",
    avatarColor: "text-yellow-600",
    status: "ai-active",
    lastMessage: "หมอคนไหนเก่งเรื่องผ่าฟันคุด",
    time: "8 นาทีที่แล้ว",
    messages: [
      { sender: "customer", text: "ฟันคุดปวดมากครับ", time: "10:20" },
      { sender: "ai", text: "เสียใจด้วยนะคะที่ฟันคุดทำให้ปวด หากปวดมากแนะนำให้มาพบทันตแพทย์โดยเร็วค่ะ ทานยาแก้ปวดไว้ก่อนได้ค่ะ", time: "10:20" },
      { sender: "customer", text: "ต้องผ่าออกไหมครับ", time: "10:21" },
      { sender: "ai", text: "ขึ้นอยู่กับตำแหน่งและสภาพฟันคุดค่ะ ต้องให้ทันตแพทย์ตรวจและเอกซเรย์ก่อน หากฟันคุดขึ้นไม่ได้หรือดันฟันข้างเคียง แนะนำให้ผ่าออกค่ะ", time: "10:21" },
      { sender: "customer", text: "ผ่าฟันคุดราคาเท่าไหร่", time: "10:22" },
      { sender: "ai", text: "ราคาผ่าฟันคุดเริ่มต้นที่ 3,000-8,000 บาท/ซี่ค่ะ ขึ้นอยู่กับความยากของเคส ฟันคุดที่อยู่ลึกหรือเอียงมากจะมีราคาสูงกว่าค่ะ", time: "10:22" },
      { sender: "customer", text: "หมอคนไหนเก่งเรื่องผ่าฟันคุด", time: "10:23" }
    ],
    quickReplies: ["ดูประวัติหมอ", "นัดผ่าฟันคุด", "สอบถามเพิ่มเติม"]
  },
  {
    id: 4,
    customerName: "คุณนภา",
    channel: "Facebook",
    channelIcon: "f",
    channelColor: "bg-blue-600",
    avatarBg: "bg-red-100",
    avatarColor: "text-red-600",
    status: "pending",
    lastMessage: "ไม่พอใจบริการมาก ทำไมนัดแล้วต้องรอนาน",
    time: "12 นาทีที่แล้ว",
    messages: [
      { sender: "customer", text: "มีเรื่องจะร้องเรียนค่ะ", time: "10:15" },
      { sender: "ai", text: "ขออภัยในความไม่สะดวกค่ะ กรุณาแจ้งรายละเอียดเพื่อให้ทางเราช่วยแก้ไขปัญหาให้ค่ะ", time: "10:15" },
      { sender: "customer", text: "เมื่อวานมานัดหมอตอน 10 โมง แต่ต้องรอเกือบ 2 ชั่วโมงกว่าจะได้พบหมอ", time: "10:16" },
      { sender: "ai", text: "ขอโทษอย่างสูงค่ะสำหรับความไม่สะดวกที่เกิดขึ้น ทางเราจะรับเรื่องไว้และประสานงานกับทีมงานค่ะ", time: "10:16" },
      { sender: "customer", text: "ไม่พอใจบริการมาก ทำไมนัดแล้วต้องรอนาน", time: "10:17" },
      { sender: "ai", text: "ขออภัยอีกครั้งค่ะ ทางเราจะส่งเรื่องให้ผู้จัดการสาขาติดต่อกลับภายใน 24 ชั่วโมงค่ะ กรุณารอสักครู่ค่ะ", time: "10:17" }
    ],
    quickReplies: [],
    aiNote: "AI ตรวจพบว่าเป็นเคสร้องเรียน แนะนำให้ Admin รับเรื่องต่อ"
  }
];

// Analytics Data
export const analyticsData = {
  'this-week': {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    responseTime: [2.5, 2.3, 2.8, 2.1, 2.4, 2.6, 2.2],
    casesHandled: [45, 52, 48, 61, 55, 40, 35],
    stats: { speed: '2.5 นาที', quality: '4.8/5.0', volume: '336 เคส' }
  },
  'last-week': {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    responseTime: [2.8, 2.6, 3.0, 2.4, 2.7, 2.9, 2.5],
    casesHandled: [42, 48, 45, 55, 50, 38, 32],
    stats: { speed: '2.7 นาที', quality: '4.6/5.0', volume: '310 เคส' }
  },
  'this-month': {
    labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
    responseTime: [2.6, 2.4, 2.5, 2.3],
    casesHandled: [310, 325, 336, 348],
    stats: { speed: '2.5 นาที', quality: '4.7/5.0', volume: '1,319 เคส' }
  },
  'last-month': {
    labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ที่ 4'],
    responseTime: [2.9, 2.7, 2.6, 2.5],
    casesHandled: [280, 295, 310, 320],
    stats: { speed: '2.7 นาที', quality: '4.5/5.0', volume: '1,205 เคส' }
  }
};

// Admin Performance Data
export const adminPerformance = [
  {
    id: 1,
    name: 'แอดมินน้ำ',
    initial: 'น',
    level: 'Admin Level 2',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    cases: 127,
    caseChange: '+12%',
    avgTime: '1.8 นาที',
    timeNote: 'เร็วที่สุด',
    rating: 4.9,
    conversion: '78%',
    status: 'Online'
  },
  {
    id: 2,
    name: 'แอดมินฟ้า',
    initial: 'ฟ',
    level: 'Admin Level 2',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    cases: 98,
    caseChange: '+5%',
    avgTime: '2.3 นาที',
    rating: 4.7,
    conversion: '72%',
    status: 'Online'
  },
  {
    id: 3,
    name: 'แอดมินพลอย',
    initial: 'พ',
    level: 'Admin Level 1',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    cases: 65,
    caseChange: '-3%',
    avgTime: '3.1 นาที',
    rating: 4.5,
    conversion: '58%',
    status: 'Away'
  },
  {
    id: 4,
    name: 'แอดมินมิ้นท์',
    initial: 'ม',
    level: 'Admin Level 1',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    cases: 46,
    caseChange: 'ใหม่',
    avgTime: '4.2 นาที',
    rating: 4.3,
    conversion: '52%',
    status: 'Offline'
  }
];

// Quick Replies Data
export interface QuickReply {
  id: number;
  shortcut: string;
  category: 'greeting' | 'price' | 'booking' | 'promo' | 'closing';
  message: string;
  usageCount: number;
  updatedAt: string;
}

export const quickReplies: QuickReply[] = [
  {
    id: 1,
    shortcut: '/hello',
    category: 'greeting',
    message: 'สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus Clinic ยินดีให้บริการค่ะ 😊',
    usageCount: 156,
    updatedAt: '2 วันที่แล้ว'
  },
  {
    id: 2,
    shortcut: '/thanks',
    category: 'greeting',
    message: 'ขอบคุณมากค่ะที่ไว้วางใจ Dental Plus ยินดีให้บริการเสมอค่ะ 🙏',
    usageCount: 98,
    updatedAt: '5 วันที่แล้ว'
  },
  {
    id: 3,
    shortcut: '/scaling',
    category: 'price',
    message: 'ค่าขูดหินปูนเริ่มต้นที่ 800-1,500 บาท ขึ้นอยู่กับปริมาณหินปูนค่ะ รวมตรวจฟันฟรีด้วยนะคะ',
    usageCount: 234,
    updatedAt: '1 วันที่แล้ว'
  },
  {
    id: 4,
    shortcut: '/ortho',
    category: 'price',
    message: 'จัดฟันแบบโลหะ 35,000-45,000 บาท / Invisalign เริ่มต้น 80,000 บาท ผ่อน 0% ได้ค่ะ',
    usageCount: 189,
    updatedAt: '3 วันที่แล้ว'
  },
  {
    id: 5,
    shortcut: '/book',
    category: 'booking',
    message: 'สะดวกวันไหนคะ? คลินิกเปิดทุกวัน 10:00-20:00 น. หมอว่างช่วงบ่ายค่ะ',
    usageCount: 312,
    updatedAt: 'วันนี้'
  },
  {
    id: 6,
    shortcut: '/confirm',
    category: 'booking',
    message: 'ยืนยันนัดหมายค่ะ ✅ วัน [DATE] เวลา [TIME] น. พบหมอ [DOCTOR] ที่ Dental Plus สาขา [BRANCH] ค่ะ',
    usageCount: 278,
    updatedAt: 'วันนี้'
  },
  {
    id: 7,
    shortcut: '/promo',
    category: 'promo',
    message: '🎉 โปรเดือนนี้! ฟอกสีฟันลด 30% จาก 5,000 เหลือ 3,500 บาท ถึงสิ้นเดือนนี้เท่านั้นค่ะ',
    usageCount: 145,
    updatedAt: '1 สัปดาห์ที่แล้ว'
  },
  {
    id: 8,
    shortcut: '/close',
    category: 'closing',
    message: 'ถ้าพร้อมนัดได้เลยนะคะ มีช่วงเย็นวันพรุ่งนี้ว่างอยู่ค่ะ จองเลยไหมคะ? 😊',
    usageCount: 167,
    updatedAt: '2 วันที่แล้ว'
  }
];

// Message Logs Data
export interface MessageLog {
  id: number;
  time: string;
  direction: 'IN' | 'OUT';
  channel: 'LINE' | 'Facebook' | 'Instagram' | 'TikTok' | 'WhatsApp';
  customer: string;
  message: string;
  status: 'success' | 'failed';
}

export const messageLogs: MessageLog[] = [
  { id: 1, time: '10:45:32', direction: 'IN', channel: 'LINE', customer: 'คุณสมชาย', message: 'ปวดฟันมากครับ อยากนัดพบหมอ', status: 'success' },
  { id: 2, time: '10:46:15', direction: 'OUT', channel: 'LINE', customer: 'คุณสมชาย', message: 'สวัสดีค่ะ ยินดีต้อนรับสู่ Dental Plus...', status: 'success' },
  { id: 3, time: '10:52:08', direction: 'IN', channel: 'Facebook', customer: 'คุณลิซ่า', message: 'สนใจจัดฟันค่ะ ราคาเท่าไหร่', status: 'success' },
  { id: 4, time: '10:55:22', direction: 'OUT', channel: 'Facebook', customer: 'คุณลิซ่า', message: 'จัดฟันแบบโลหะ 35,000-45,000 บาท...', status: 'success' },
  { id: 5, time: '11:02:45', direction: 'OUT', channel: 'Instagram', customer: 'คุณวิภา', message: 'ราคาฟอกสีฟัน...', status: 'failed' }
];

// Treatment Types
export const treatmentTypes = [
  { id: 1, name: 'ทันตกรรมทั่วไป', code: 'general', description: 'อุดฟัน ขูดหินปูน ถอนฟัน', color: 'blue' },
  { id: 2, name: 'ศัลยกรรม', code: 'surgery', description: 'ผ่าฟันคุด ศัลยกรรมช่องปาก', color: 'red' },
  { id: 3, name: 'จัดฟัน', code: 'ortho', description: 'ทันตกรรมจัดฟัน Invisalign', color: 'purple' },
  { id: 4, name: 'เสริมความงาม', code: 'cosmetic', description: 'วีเนียร์ ฟอกสีฟัน', color: 'pink' },
  { id: 5, name: 'สอบถามเฉยๆ', code: 'inquiry', description: 'สอบถามข้อมูล ไม่ต้องการรักษา', color: 'gray' }
];

// Teams Data
export const teams = [
  { id: 1, name: 'ทีมทันตกรรมทั่วไป', type: 'general', color: 'blue', members: ['Admin แอน', 'Admin เบน'] },
  { id: 2, name: 'ทีมศัลยกรรม', type: 'surgery', color: 'red', members: ['Admin เดวิด'] },
  { id: 3, name: 'ทีมจัดฟัน', type: 'ortho', color: 'purple', members: ['Admin แคท', 'Admin ฟ้า (off)'] },
  { id: 4, name: 'ทีมเสริมความงาม', type: 'cosmetic', color: 'pink', members: ['Admin เอมมี่'] }
];

// Members Data
export const members = [
  { id: 1, name: 'Admin แอน', initial: 'A', team: 'ทีมทันตกรรมทั่วไป', bgColor: 'bg-pink-100', textColor: 'text-pink-600', status: 'Online' },
  { id: 2, name: 'Admin เบน', initial: 'B', team: 'ทีมทันตกรรมทั่วไป', bgColor: 'bg-blue-100', textColor: 'text-blue-600', status: 'Online' },
  { id: 3, name: 'Admin แคท', initial: 'C', team: 'ทีมจัดฟัน', bgColor: 'bg-purple-100', textColor: 'text-purple-600', status: 'Online' },
  { id: 4, name: 'Admin เดวิด', initial: 'D', team: 'ทีมศัลยกรรม', bgColor: 'bg-green-100', textColor: 'text-green-600', status: 'Online' },
  { id: 5, name: 'Admin เอมมี่', initial: 'E', team: 'ทีมเสริมความงาม', bgColor: 'bg-pink-100', textColor: 'text-pink-600', status: 'Online' },
  { id: 6, name: 'Admin ฟ้า', initial: 'F', team: 'ทีมจัดฟัน', bgColor: 'bg-cyan-100', textColor: 'text-cyan-600', status: 'Offline' }
];

// Channels Data
export const channels = [
  { id: 1, name: 'LINE Official Account', handle: '@dentalplus', color: 'green', icon: 'L', connected: true },
  { id: 2, name: 'Facebook Messenger', handle: 'Dental Plus Clinic', color: 'blue', icon: 'F', connected: true },
  { id: 3, name: 'Instagram', handle: '@dentalplus.clinic', color: 'pink', icon: 'I', connected: true },
  { id: 4, name: 'TikTok', handle: '@dentalplus', color: 'black', icon: 'T', connected: true },
  { id: 5, name: 'WhatsApp Business', handle: '+66 2 XXX XXXX', color: 'green', icon: 'W', connected: true }
];
