import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Clock,
  Calendar,
  CheckCircle2,
  Search,
  Send,
  MessageSquare,
  Phone,
  Building2,
  Tag,
  X,
  User
} from 'lucide-react';

// Types
interface Message {
  sender: 'customer' | 'ai' | 'agent';
  text: string;
  time: string;
}

interface Task {
  id: number;
  name: string;
  phone: string;
  channel: 'LINE' | 'Facebook' | 'Instagram' | 'TikTok';
  avatar: string;
  status: 'consult' | 'appoint' | 'treatment' | 'payment' | 'completed';
  lastMessage: string;
  time: string;
  service: string;
  priority: 'high' | 'medium' | 'low';
  branch: string;
  tags?: string[];
  unread?: number;
  messages: Message[];
}

// Channel icons as SVG strings
const channelIcons = {
  LINE: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  ),
  Facebook: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  TikTok: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
};

// Mock Data
const mockTasks: Task[] = [
  { id: 1, name: 'คุณสมชาย', phone: '081-234-5678', channel: 'LINE', avatar: 'ส', status: 'consult', lastMessage: 'อยากจะนัดผ่าฟันคุดครับ', time: '10:32', service: 'ผ่าฟันคุด', priority: 'high', branch: 'สาขาสยาม', tags: ['ลูกค้าใหม่'], unread: 2,
    messages: [
      { sender: 'customer', text: 'สวัสดีครับ', time: '10:30' },
      { sender: 'customer', text: 'อยากจะนัดผ่าฟันคุดครับ', time: '10:32' },
    ]
  },
  { id: 2, name: 'คุณพิมพ์ลดา', phone: '089-876-5432', channel: 'Facebook', avatar: 'พ', status: 'consult', lastMessage: 'สนใจแบบไหนเป็นพิเศษคะ?', time: '10:28', service: 'จัดฟัน', priority: 'medium', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'สวัสดีค่ะ', time: '10:25' },
      { sender: 'customer', text: 'รบกวนสอบถามราคาจัดฟันค่ะ', time: '10:28' },
      { sender: 'ai', text: 'สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nสำหรับการจัดฟันที่ Dental Plus มีหลายแบบให้เลือกค่ะ:\n\n1. จัดฟันแบบโลหะ: เริ่มต้น 35,000 บาท\n2. จัดฟันแบบเซรามิก: เริ่มต้น 45,000 บาท\n3. จัดฟันใส (Invisalign): เริ่มต้น 120,000 บาท\n\nสนใจแบบไหนเป็นพิเศษคะ?', time: '10:28' },
    ]
  },
  { id: 3, name: 'คุณวิชัย', phone: '062-111-2222', channel: 'LINE', avatar: 'ว', status: 'appoint', lastMessage: 'ขอบคุณครับ นัดวันเสาร์นะครับ', time: '10:15', service: 'ขูดหินปูน', priority: 'low', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'สอบถามเรื่องขูดหินปูนครับ', time: '09:50' },
      { sender: 'ai', text: 'สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nบริการขูดหินปูนที่ Dental Plus\nราคา: 800-1,200 บาท\nใช้เวลา: 30-45 นาที\n\nต้องการนัดวันไหนดีคะ?', time: '09:51' },
      { sender: 'customer', text: 'วันเสาร์ว่างไหมครับ', time: '10:00' },
      { sender: 'ai', text: 'วันเสาร์ที่ 20 ม.ค. ว่างค่ะ\n\nช่วงเวลาที่ว่าง:\n- 09:00\n- 10:30\n- 14:00\n- 15:30\n\nสะดวกช่วงไหนคะ?', time: '10:01' },
      { sender: 'customer', text: '10:30 ครับ ชื่อ วิชัย โทร 062-111-2222', time: '10:10' },
      { sender: 'ai', text: 'รับทราบค่ะ ยืนยันการนัดหมาย:\n\nวันเสาร์ที่ 20 ม.ค. 2567\nเวลา 10:30 น.\nบริการ: ขูดหินปูน\nคุณวิชัย (062-111-2222)\nสาขาสยาม\n\nระบบจะส่งข้อความแจ้งเตือนก่อนนัด 1 วันค่ะ ขอบคุณที่ใช้บริการค่ะ', time: '10:11' },
      { sender: 'customer', text: 'ขอบคุณครับ นัดวันเสาร์นะครับ', time: '10:15' },
    ]
  },
  { id: 4, name: 'คุณนารี', phone: '091-333-4444', channel: 'Instagram', avatar: 'น', status: 'consult', lastMessage: 'รบกวนขอราคาพิเศษได้ไหมคะ ทำหลายซี่', time: '10:05', service: 'วีเนียร์', priority: 'high', branch: 'สาขาอารีย์', tags: ['VIP', 'ติดตาม'], unread: 1,
    messages: [
      { sender: 'customer', text: 'สนใจทำวีเนียร์ 6 ซี่ค่ะ', time: '09:30' },
      { sender: 'ai', text: 'สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nวีเนียร์ที่ Dental Plus\nราคา: 15,000-25,000 บาท/ซี่\n\nสำหรับ 6 ซี่ ราคาประมาณ 90,000-150,000 บาทค่ะ\n\nต้องการนัดมาปรึกษาก่อนไหมคะ?', time: '09:31' },
      { sender: 'customer', text: 'ราคาเท่าไหร่คะถ้าทำ 6 ซี่พร้อมกัน', time: '09:45' },
      { sender: 'ai', text: 'สำหรับวีเนียร์ 6 ซี่ ราคาปกติ 120,000 บาทค่ะ\n\nรวมบริการ:\n- ตรวจและออกแบบรอยยิ้ม\n- วีเนียร์ E-max 6 ซี่\n- ติดตามผล 1 ปี\n\nสนใจนัดปรึกษาไหมคะ?', time: '09:46' },
      { sender: 'customer', text: 'รบกวนขอราคาพิเศษได้ไหมคะ ทำหลายซี่', time: '10:05' },
    ]
  },
  { id: 5, name: 'คุณประเสริฐ', phone: '085-555-6666', channel: 'LINE', avatar: 'ป', status: 'consult', lastMessage: 'ฟันผุหลายซี่ ต้องทำยังไงบ้างครับ', time: '09:55', service: 'อุดฟัน', priority: 'medium', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'สวัสดีครับ', time: '09:50' },
      { sender: 'customer', text: 'ฟันผุหลายซี่ ต้องทำยังไงบ้างครับ', time: '09:55' },
    ]
  },
  { id: 6, name: 'คุณสุภา', phone: '087-777-8888', channel: 'Facebook', avatar: 'ส', status: 'consult', lastMessage: 'สนใจบริการไหนเป็นพิเศษคะ?', time: '09:41', service: 'ปรึกษา', priority: 'low', branch: 'สาขาอารีย์',
    messages: [
      { sender: 'customer', text: 'มีโปรโมชั่นอะไรบ้างคะ', time: '09:40' },
      { sender: 'ai', text: 'สวัสดีค่ะ โปรโมชั่นเดือนนี้ค่ะ:\n\n1. ฟอกสีฟัน ลด 20% เหลือ 3,200 บาท\n2. ขูดหินปูน + ขัดฟัน 999 บาท (จาก 1,500)\n3. จัดฟันใส ผ่อน 0% 12 เดือน\n\nสนใจบริการไหนเป็นพิเศษคะ?', time: '09:41' },
    ]
  },
  { id: 7, name: 'คุณมานะ', phone: '083-999-0000', channel: 'LINE', avatar: 'ม', status: 'appoint', lastMessage: 'ได้เลยครับ ขอบคุณมากครับ', time: '09:20', service: 'ฟอกสีฟัน', priority: 'medium', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'ฟอกสีฟันราคาเท่าไหร่ครับ', time: '09:00' },
      { sender: 'ai', text: 'สวัสดีค่ะ ฟอกสีฟันที่ Dental Plus:\n\nZoom Whitening: 4,000 บาท (ปกติ 5,000)\nใช้เวลา: 1-1.5 ชั่วโมง\nขาวขึ้น 3-8 เฉด\n\nโปรเดือนนี้ลด 20% เหลือ 3,200 บาทค่ะ!', time: '09:01' },
      { sender: 'customer', text: 'สนใจครับ นัดวันอาทิตย์ได้ไหม', time: '09:10' },
      { sender: 'ai', text: 'วันอาทิตย์ที่ 21 ม.ค. ว่างค่ะ\n\nช่วงเวลาที่ว่าง:\n- 10:00\n- 13:00\n- 15:00\n\nสะดวกช่วงไหนคะ?', time: '09:11' },
      { sender: 'customer', text: '13:00 ครับ ชื่อมานะ', time: '09:15' },
      { sender: 'ai', text: 'ยืนยันการนัดหมาย:\n\nวันอาทิตย์ที่ 21 ม.ค. 2567\nเวลา 13:00 น.\nบริการ: ฟอกสีฟัน Zoom\nราคาโปร: 3,200 บาท\nคุณมานะ\nสาขาสยาม\n\nขอบคุณที่ใช้บริการค่ะ', time: '09:16' },
      { sender: 'customer', text: 'ได้เลยครับ ขอบคุณมากครับ', time: '09:20' },
    ]
  },
  { id: 8, name: 'คุณจินตนา', phone: '086-111-3333', channel: 'LINE', avatar: 'จ', status: 'treatment', lastMessage: 'ทำประกันได้ไหมคะ ประกัน AIA', time: '09:00', service: 'รากเทียม', priority: 'high', branch: 'สาขาสยาม', tags: ['ประกัน', 'VIP'], unread: 1,
    messages: [
      { sender: 'customer', text: 'สอบถามเรื่องรากเทียมค่ะ', time: '08:30' },
      { sender: 'ai', text: 'สวัสดีค่ะ รากเทียมที่ Dental Plus:\n\nรากเทียม Straumann (Swiss): 80,000 บาท/ซี่\nรากเทียม Osstem (Korea): 45,000 บาท/ซี่\n\nรวมครอบฟันและติดตามผล 5 ปีค่ะ', time: '08:31' },
      { sender: 'customer', text: 'ทำประกันได้ไหมคะ ประกัน AIA', time: '09:00' },
    ]
  },
  { id: 9, name: 'คุณธนา', phone: '084-222-4444', channel: 'Facebook', avatar: 'ธ', status: 'consult', lastMessage: 'มีหมอเฉพาะทางจัดฟันไหมครับ', time: '08:45', service: 'จัดฟัน', priority: 'medium', branch: 'สาขาอารีย์',
    messages: [
      { sender: 'customer', text: 'มีหมอเฉพาะทางจัดฟันไหมครับ', time: '08:45' },
    ]
  },
  { id: 10, name: 'คุณกัญญา', phone: '088-333-5555', channel: 'Instagram', avatar: 'ก', status: 'treatment', lastMessage: 'ต้องเตรียมตัวยังไงบ้างคะก่อนมา', time: '08:30', service: 'ผ่าฟันคุด', priority: 'medium', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'พรุ่งนี้นัดผ่าฟันคุดค่ะ ต้องเตรียมตัวยังไงบ้างคะก่อนมา', time: '08:30' },
      { sender: 'ai', text: 'สวัสดีค่ะ การเตรียมตัวก่อนผ่าฟันคุด:\n\n- พักผ่อนให้เพียงพอ\n- รับประทานอาหารก่อนมา 2-3 ชม.\n- ไม่ดื่มแอลกอฮอล์ 24 ชม. ก่อน\n- แจ้งยาที่รับประทานอยู่\n- นำบัตรประชาชนมาด้วย\n\nงดสูบบุหรี่ก่อน-หลังผ่า\n\nมีคนมาส่งไหมคะ? แนะนำให้มีคนมาด้วยค่ะ', time: '08:31' },
    ]
  },
  { id: 11, name: 'คุณอนันต์', phone: '082-444-6666', channel: 'LINE', avatar: 'อ', status: 'completed', lastMessage: 'เข้าใจแล้วครับ ขอบคุณครับ', time: '08:15', service: 'ปรึกษา', priority: 'low', branch: 'สาขาสยาม',
    messages: [
      { sender: 'customer', text: 'ทำไมต้องถ่าย X-ray ก่อนครับ', time: '08:00' },
      { sender: 'ai', text: 'การถ่าย X-ray ก่อนรักษาสำคัญมากค่ะ:\n\nเพื่อดู:\n- รากฟันและกระดูกใต้เหงือก\n- ฟันคุดที่ซ่อนอยู่\n- โพรงประสาทฟัน\n- ปัญหาที่มองไม่เห็นด้วยตา\n\nช่วยให้หมอวางแผนการรักษาได้แม่นยำค่ะ\n\nที่คลินิกใช้ Digital X-ray ซึ่งปลอดภัย รังสีน้อยมากค่ะ', time: '08:01' },
      { sender: 'customer', text: 'เข้าใจแล้วครับ ขอบคุณครับ', time: '08:15' },
    ]
  },
  { id: 12, name: 'คุณรัตนา', phone: '089-555-7777', channel: 'LINE', avatar: 'ร', status: 'payment', lastMessage: 'โอเคค่ะ เจอกันวันพฤหัส', time: '07:50', service: 'ตรวจสุขภาพฟัน', priority: 'low', branch: 'สาขาอารีย์',
    messages: [
      { sender: 'customer', text: 'จะพาลูกมาตรวจฟันค่ะ อายุ 5 ขวบ', time: '07:30' },
      { sender: 'ai', text: 'สวัสดีค่ะ ยินดีให้บริการค่ะ\n\nสำหรับน้องอายุ 5 ขวบ:\n- ตรวจสุขภาพฟัน: ฟรี!\n- เคลือบฟลูออไรด์: 300 บาท\n- เคลือบหลุมร่องฟัน: 400 บาท/ซี่\n\nมีหมอเฉพาะทางเด็กค่ะ นัดวันไหนดีคะ?', time: '07:31' },
      { sender: 'customer', text: 'วันพฤหัสบ่ายว่างไหมคะ', time: '07:40' },
      { sender: 'ai', text: 'วันพฤหัสที่ 18 ม.ค. ช่วงบ่ายว่างค่ะ:\n- 13:00\n- 14:30\n- 16:00\n\nสะดวกช่วงไหนคะ?', time: '07:41' },
      { sender: 'customer', text: '14:30 ค่ะ ชื่อแม่ รัตนา ลูกชื่อน้องบีม', time: '07:45' },
      { sender: 'ai', text: 'ยืนยันการนัดหมาย:\n\nวันพฤหัสที่ 18 ม.ค. 2567\nเวลา 14:30 น.\นน้องบีม (5 ขวบ)\nผู้ปกครอง: คุณรัตนา\nบริการ: ตรวจสุขภาพฟัน\nสาขาสยาม\n\nขอบคุณที่ใช้บริการค่ะ', time: '07:46' },
      { sender: 'customer', text: 'โอเคค่ะ เจอกันวันพฤหัส', time: '07:50' },
    ]
  },
];

type StatusTab = 'all' | 'consult' | 'appoint' | 'treatment' | 'payment' | 'completed';
type ChannelFilter = 'all' | 'LINE' | 'Facebook' | 'Instagram' | 'TikTok';

// FAQ Data
const faqData = [
  {
    id: 'faq-price',
    label: 'ราคาค่าบริการ',
    answer: 'ราคาค่าบริการของเรา:\n\n• ตรวจสุขภาพฟัน: 500 บาท\n• ขูดหินปูน: 800-1,200 บาท\n• อุดฟัน: 800-2,000 บาท\n• ถอนฟัน: 500-1,500 บาท\n• จัดฟัน: เริ่มต้น 35,000 บาท\n• รากฟันเทียม: เริ่มต้น 45,000 บาท\n\nสามารถนัดเข้ามาปรึกษาเพื่อประเมินราคาที่แน่นอนได้ค่ะ'
  },
  {
    id: 'faq-location',
    label: 'สาขาและที่ตั้ง',
    answer: 'Dental Plus มีสาขาให้บริการ:\n\n📍 สาขาสยาม: ชั้น 4 สยามพารากอน\nเปิด 10:00-21:00 น.\n\n📍 สาขาทองหล่อ: ซอยทองหล่อ 10\nเปิด 09:00-20:00 น.\n\n📍 สาขาเซ็นทรัลลาดพร้าว: ชั้น 3\nเปิด 10:00-21:00 น.\n\nทุกสาขาเปิดให้บริการทุกวันค่ะ'
  },
  {
    id: 'faq-booking',
    label: 'วิธีการนัดหมาย',
    answer: 'วิธีการนัดหมาย:\n\n1️⃣ นัดผ่าน LINE: @dentalplus\n2️⃣ โทรศัพท์: 02-xxx-xxxx\n3️⃣ เว็บไซต์: www.dentalplus.co.th\n4️⃣ Walk-in ได้ทุกสาขา\n\nแนะนำนัดล่วงหน้าเพื่อความสะดวกค่ะ'
  },
  {
    id: 'faq-insurance',
    label: 'ประกันสังคม/ประกันสุขภาพ',
    answer: 'เรารับประกันสังคมและประกันสุขภาพ:\n\n✅ ประกันสังคม: รับทุกสาขา\n✅ ประกันสุขภาพ: AIA, เมืองไทย, กรุงเทพ, FWD และอื่นๆ\n\nกรุณานำบัตรประกันมาด้วยในวันนัดหมายค่ะ'
  },
  {
    id: 'faq-all',
    label: 'FAQ ทั้งหมด',
    answer: 'คำถามที่พบบ่อยทั้งหมด:\n\n• ราคาค่าบริการ\n• สาขาและที่ตั้ง\n• วิธีการนัดหมาย\n• ประกันสังคม/ประกันสุขภาพ\n• การเตรียมตัวก่อนพบแพทย์\n• การดูแลหลังทำฟัน\n\nสามารถสอบถามเพิ่มเติมได้เลยค่ะ'
  }
];

export function ChatTaskManagement() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentTab, setCurrentTab] = useState<StatusTab>('all');
  const [currentChannel, setCurrentChannel] = useState<ChannelFilter>('all');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Booking form state
  const [bookingBranch, setBookingBranch] = useState('siam');
  const [bookingTreatment, setBookingTreatment] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [bookingDoctor, setBookingDoctor] = useState('ทพ.สมศรี');

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Get counts
  const getCounts = () => {
    const counts = {
      all: tasks.length,
      consult: tasks.filter(t => t.status === 'consult').length,
      appoint: tasks.filter(t => t.status === 'appoint').length,
      treatment: tasks.filter(t => t.status === 'treatment').length,
      payment: tasks.filter(t => t.status === 'payment').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status !== 'completed').length,
    };
    return counts;
  };

  const counts = getCounts();

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (currentTab !== 'all') {
      filtered = filtered.filter(t => t.status === currentTab);
    }

    if (currentChannel !== 'all') {
      filtered = filtered.filter(t => t.channel === currentChannel);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.service.toLowerCase().includes(q) ||
        t.phone.includes(q)
      );
    }

    // Sort: selected first, then unread, then by time
    filtered.sort((a, b) => {
      if (a.id === selectedTaskId) return -1;
      if (b.id === selectedTaskId) return 1;
      const aUnread = a.unread || 0;
      const bUnread = b.unread || 0;
      if (aUnread > 0 && bUnread === 0) return -1;
      if (aUnread === 0 && bUnread > 0) return 1;
      return b.time.localeCompare(a.time);
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Handle task selection
  const handleSelectTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    // Clear unread
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, unread: 0 } : t
    ));
  };

  // Handle send reply
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTaskId) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskId) {
        return {
          ...t,
          messages: [...t.messages, { sender: 'agent', text: replyText, time }],
          lastMessage: replyText,
          time: time,
          status: t.status === 'consult' ? 'appoint' : t.status
        };
      }
      return t;
    }));

    setReplyText('');
  };

  // Handle add tag
  const handleAddTag = (taskId: number, tag: string) => {
    if (!tag.trim()) return;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const currentTags = t.tags || [];
        if (!currentTags.includes(tag)) {
          return { ...t, tags: [...currentTags, tag] };
        }
      }
      return t;
    }));
    setNewTag('');
  };

  // Handle remove tag
  const handleRemoveTag = (taskId: number, tag: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.tags) {
        return { ...t, tags: t.tags.filter(tg => tg !== tag) };
      }
      return t;
    }));
  };

  // Handle status change
  const handleStatusChange = (newStatus: Task['status']) => {
    if (!selectedTaskId) return;
    setTasks(prev => prev.map(t =>
      t.id === selectedTaskId ? { ...t, status: newStatus } : t
    ));
    setShowStatusModal(false);
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!selectedTaskId) return;
    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskId) {
        const currentTags = t.tags || [];
        if (!currentTags.includes('นัดแล้ว')) {
          return { ...t, tags: [...currentTags, 'นัดแล้ว'], status: 'treatment' };
        }
        return { ...t, status: 'treatment' };
      }
      return t;
    }));
    setShowBookingModal(false);
  };

  // Handle FAQ link click - auto reply with answer or navigate to FAQ page
  const handleFaqClick = (faqId: string) => {
    // Navigate to FAQ page for "FAQ ทั้งหมด"
    if (faqId === 'faq-all') {
      window.open('/faq-all', '_blank');
      return;
    }

    if (!selectedTaskId) return;

    const faq = faqData.find(f => f.id === faqId);
    if (!faq) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskId) {
        return {
          ...t,
          messages: [...t.messages, { sender: 'ai' as const, text: faq.answer, time }],
          lastMessage: faq.answer.slice(0, 50) + '...',
        };
      }
      return t;
    }));
  };

  // Send FAQ links message
  const sendFaqLinksMessage = () => {
    if (!selectedTaskId) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    const faqMessage = 'ระหว่างนี้คุณลูกค้าสามารถอ่านข้อมูลคำตอบของคำถามที่พบบ่อยได้จากลิงค์ต่อไปนี้ค่ะ\n\n[FAQ_LINKS]';

    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskId) {
        return {
          ...t,
          messages: [...t.messages, { sender: 'ai' as const, text: faqMessage, time }],
          lastMessage: 'ระหว่างนี้คุณลูกค้าสามารถอ่านข้อมูล...',
        };
      }
      return t;
    }));
  };

  // Open booking modal
  const openBookingModal = () => {
    if (selectedTask) {
      setBookingTreatment(selectedTask.service);
      if (selectedTask.branch.includes('สยาม')) setBookingBranch('siam');
      else if (selectedTask.branch.includes('อารีย์')) setBookingBranch('ari');
      else setBookingBranch('thonglor');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().split('T')[0]);
    }
    setShowBookingModal(true);
  };

  // Get channel color
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'LINE': return 'bg-green-500';
      case 'Facebook': return 'bg-blue-500';
      case 'Instagram': return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'TikTok': return 'bg-gray-800';
      default: return 'bg-gray-500';
    }
  };

  const getChannelIconColor = (channel: string) => {
    switch (channel) {
      case 'LINE': return 'text-green-500';
      case 'Facebook': return 'text-blue-600';
      case 'Instagram': return 'text-pink-500';
      case 'TikTok': return 'text-gray-800';
      default: return 'text-gray-500';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'consult': return { border: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700', text: 'ปรึกษา' };
      case 'appoint': return { border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', text: 'นัดหมาย' };
      case 'treatment': return { border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700', text: 'พบแพทย์' };
      case 'payment': return { border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700', text: 'ชำระเงิน' };
      case 'completed': return { border: 'border-l-green-500', badge: 'bg-green-100 text-green-700', text: 'เสร็จสิ้น' };
      default: return { border: 'border-l-gray-500', badge: 'bg-gray-100 text-gray-700', text: status };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-100 text-red-700', text: 'ด่วน' };
      case 'medium': return { bg: 'bg-yellow-100 text-yellow-700', text: 'ปานกลาง' };
      default: return { bg: 'bg-gray-100 text-gray-600', text: 'ปกติ' };
    }
  };

  const statusTabs: { key: StatusTab; label: string; activeClass: string; inactiveClass: string }[] = [
    { key: 'all', label: 'All', activeClass: 'bg-gray-700 text-white', inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { key: 'consult', label: 'ปรึกษา', activeClass: 'bg-yellow-500 text-white', inactiveClass: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
    { key: 'appoint', label: 'นัดหมาย', activeClass: 'bg-blue-500 text-white', inactiveClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { key: 'treatment', label: 'พบแพทย์', activeClass: 'bg-purple-500 text-white', inactiveClass: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { key: 'payment', label: 'ชำระเงิน', activeClass: 'bg-orange-500 text-white', inactiveClass: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { key: 'completed', label: 'เสร็จสิ้น', activeClass: 'bg-green-500 text-white', inactiveClass: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Quick Stats Header */}
      <div className="bg-white px-8 py-3 border-b border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">รอดำเนินการ</p>
              <p className="text-lg font-bold text-yellow-600">{counts.pending}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">งานวันนี้</p>
              <p className="text-lg font-bold text-blue-600">{counts.all}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">เสร็จแล้ว</p>
              <p className="text-lg font-bold text-green-600">{counts.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white px-8 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === tab.key ? tab.activeClass : tab.inactiveClass
              }`}
            >
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                currentTab === tab.key ? 'bg-white/20' : 'bg-white'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task Card List (Left) */}
        <div className="w-96 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="ค้นหาชื่อ / บริการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Channel Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">ช่องทาง:</span>
              {(['all', 'LINE', 'Facebook', 'Instagram', 'TikTok'] as ChannelFilter[]).map(channel => (
                <button
                  key={channel}
                  onClick={() => setCurrentChannel(channel)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    currentChannel === channel
                      ? 'bg-gray-700 text-white'
                      : channel === 'LINE' ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : channel === 'Facebook' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : channel === 'Instagram' ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      : channel === 'TikTok' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {channel === 'all' ? 'ทั้งหมด' : (
                    <>
                      {channelIcons[channel]}
                      {channel}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 p-8">
                <p className="text-center text-sm">ไม่มีงานในหมวดนี้</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const statusStyle = getStatusStyle(task.status);
                const priorityStyle = getPriorityStyle(task.priority);
                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelectTask(task.id)}
                    className={`bg-white rounded-xl p-4 shadow-sm border-l-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      statusStyle.border
                    } ${selectedTaskId === task.id ? 'ring-2 ring-dental-500 bg-dental-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className={`w-10 h-10 ${getChannelColor(task.channel)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {task.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm ${getChannelIconColor(task.channel)}`}>
                            {channelIcons[task.channel]}
                          </div>
                          {(task.unread || 0) > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{task.name}</p>
                          <p className="text-xs text-gray-500">{task.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400">{task.time}</span>
                        {(task.unread || 0) > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold min-w-[20px] text-center">
                            {task.unread}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.lastMessage}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 ${statusStyle.badge} text-xs rounded-full font-medium`}>
                          {statusStyle.text}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {task.service}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 ${priorityStyle.bg} text-xs rounded-full`}>
                        {priorityStyle.text}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className={`flex items-center gap-1 ${getChannelIconColor(task.channel)}`}>
                        {channelIcons[task.channel]}
                        <span>{task.channel}</span>
                      </span>
                      <span>{task.branch}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Detail (Right) */}
        <div className="flex-1 flex bg-gray-50">
          {!selectedTask ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>เลือก Task จากรายการด้านซ้าย</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getChannelColor(selectedTask.channel)} rounded-full flex items-center justify-center text-white font-bold`}>
                      {selectedTask.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selectedTask.name}</p>
                      <p className="text-xs text-gray-500">{selectedTask.phone} • {selectedTask.channel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowStatusModal(true)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium ${getStatusStyle(selectedTask.status).badge}`}
                    >
                      {getStatusStyle(selectedTask.status).text}
                    </button>
                    <button
                      onClick={() => setShowDrawer(!showDrawer)}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all bg-dental-100 text-dental-700 hover:bg-dental-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>ข้อมูลลูกค้า</span>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedTask.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'customer'
                          ? 'bg-white rounded-bl-md shadow-sm border border-gray-100'
                          : msg.sender === 'ai'
                          ? 'bg-green-100 rounded-br-md'
                          : 'bg-dental-500 text-white rounded-br-md'
                      }`}>
                        {msg.sender !== 'customer' && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className={`text-xs font-medium ${
                              msg.sender === 'ai' ? 'text-green-600' : 'text-dental-100'
                            }`}>
                              {msg.sender === 'ai' ? 'AI ตอบ' : 'คุณ'}
                            </span>
                          </div>
                        )}
                        <div className={`text-sm whitespace-pre-wrap ${msg.sender === 'agent' ? '' : 'text-gray-800'}`}>
                          {msg.text.includes('[FAQ_LINKS]') ? (
                            <>
                              {msg.text.split('[FAQ_LINKS]')[0]}
                              <div className="mt-1">
                                {faqData.map((faq, index) => (
                                  <span key={faq.id}>
                                    <button
                                      onClick={() => handleFaqClick(faq.id)}
                                      className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                    >
                                      {faq.label}
                                    </button>
                                    {index < faqData.length - 1 && <br />}
                                  </span>
                                ))}
                              </div>
                            </>
                          ) : (
                            msg.text
                          )}
                        </div>
                        <p className={`text-xs mt-1 text-right ${
                          msg.sender === 'customer' ? 'text-gray-400'
                            : msg.sender === 'ai' ? 'text-green-600'
                            : 'text-dental-200'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags & Booking Section */}
                <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-400">แท็ก:</span>
                    <div className="flex flex-wrap gap-1">
                      {(selectedTask.tags || []).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-dental-100 text-dental-700 text-xs rounded-full flex items-center gap-0.5">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(selectedTask.id, tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag(selectedTask.id, newTag)}
                        placeholder="+แท็ก"
                        className="w-16 px-1.5 py-0.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-dental-500 bg-white"
                      />
                      <button onClick={() => handleAddTag(selectedTask.id, 'VIP')} className="px-1 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded hover:bg-yellow-200">VIP</button>
                      <button onClick={() => handleAddTag(selectedTask.id, 'ติดตาม')} className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">ติดตาม</button>
                      <button onClick={() => handleAddTag(selectedTask.id, 'ประกัน')} className="px-1 py-0.5 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200">ประกัน</button>
                      <span className="mx-1 text-gray-300">|</span>
                      <button
                        onClick={openBookingModal}
                        className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200 flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Booking
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Input */}
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={sendFaqLinksMessage}
                      className="px-3 py-2.5 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 text-sm flex items-center gap-1"
                      title="ส่ง FAQ Links"
                    >
                      📋 FAQ
                    </button>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="พิมพ์ข้อความตอบกลับ..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dental-500"
                    />
                    <button
                      onClick={handleSendReply}
                      className="px-4 py-2.5 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Info Drawer */}
              {showDrawer && (
                <div className="w-72 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                    <span className="font-medium text-gray-700">ข้อมูลลูกค้า</span>
                    <button
                      onClick={() => setShowDrawer(false)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Profile */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 ${getChannelColor(selectedTask.channel)} rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3`}>
                        {selectedTask.avatar}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">{selectedTask.name}</h3>
                      <div className={`flex items-center gap-1 mt-1 ${getChannelIconColor(selectedTask.channel)}`}>
                        {channelIcons[selectedTask.channel]}
                        <span className="text-sm">{selectedTask.channel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">ข้อมูลลูกค้า</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{selectedTask.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{selectedTask.branch}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{selectedTask.service}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {(selectedTask.tags || []).length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">แท็ก</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedTask.tags || []).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-dental-100 text-dental-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-5 h-5" />
            <span className="font-medium">สรุปงานวันนี้</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{counts.consult}</p>
              <p className="text-xs text-blue-200">ปรึกษา</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{counts.appoint}</p>
              <p className="text-xs text-blue-200">นัดหมาย</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{counts.treatment}</p>
              <p className="text-xs text-blue-200">พบแพทย์</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{counts.payment}</p>
              <p className="text-xs text-blue-200">ชำระเงิน</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{counts.completed}</p>
              <p className="text-xs text-blue-200">เสร็จสิ้น</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">เปลี่ยนสถานะ</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 space-y-2">
              <button onClick={() => handleStatusChange('consult')} className="w-full px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200">ปรึกษา</button>
              <button onClick={() => handleStatusChange('appoint')} className="w-full px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200">นัดหมาย</button>
              <button onClick={() => handleStatusChange('treatment')} className="w-full px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200">พบแพทย์</button>
              <button onClick={() => handleStatusChange('payment')} className="w-full px-4 py-2.5 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200">ชำระเงิน</button>
              <button onClick={() => handleStatusChange('completed')} className="w-full px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200">เสร็จสิ้น</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">นัดหมาย</h3>
                  <p className="text-sm text-gray-500">{selectedTask.name} • {selectedTask.phone}</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
                <select
                  value={bookingBranch}
                  onChange={(e) => setBookingBranch(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="siam">สาขาสยาม</option>
                  <option value="ari">สาขาอารีย์</option>
                  <option value="thonglor">สาขาทองหล่อ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">การรักษา</label>
                <select
                  value={bookingTreatment}
                  onChange={(e) => setBookingTreatment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>ขูดหินปูน</option>
                  <option>ผ่าฟันคุด</option>
                  <option>อุดฟัน</option>
                  <option>ถอนฟัน</option>
                  <option>จัดฟัน</option>
                  <option>ฟอกสีฟัน</option>
                  <option>วีเนียร์</option>
                  <option>รากเทียม</option>
                  <option>ตรวจสุขภาพฟัน</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">แพทย์</label>
                <select
                  value={bookingDoctor}
                  onChange={(e) => setBookingDoctor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>ทพ.สมศรี</option>
                  <option>ทพญ.มนัสวี</option>
                  <option>ทพ.ประเสริฐ</option>
                  <option>ทพญ.นิดา</option>
                  <option>ทพ.วิชัย</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-500 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-700">ส่งยืนยันนัดหมายทาง LINE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-500 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-700">แจ้งเตือนก่อนนัด 1 วัน</span>
                </label>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex gap-3 bg-gray-50">
              <button onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
                ยกเลิก
              </button>
              <button onClick={handleConfirmBooking} className="flex-1 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600">
                ยืนยันนัดหมาย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
