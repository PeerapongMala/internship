import { useState, DragEvent } from 'react';
import {
  Lightbulb,
  Clock,
  CheckCircle,
  Heart,
  Scissors,
  Smile,
  Sparkles,
  X,
  Zap
} from 'lucide-react';

type TabType = 'categorize' | 'team-info' | 'individual-info';
type Category = 'inquiry' | 'general' | 'surgery' | 'ortho' | 'cosmetic';
type Priority = 'urgent' | 'new' | 'existing' | 'vip' | 'foreign';
type Channel = 'LINE' | 'Facebook' | 'Instagram' | 'TikTok' | 'WhatsApp';
type TaskStatus = 'do' | 'doing' | 'done';

interface Patient {
  id: number;
  name: string;
  avatar: string;
  avatarBg: string;
  avatarText: string;
  channel: Channel;
  channelLabel: string;
  priority: Priority;
  summary: string;
  tags: string[];
  waitTime: string;
  category?: Category;
  taskStatus?: TaskStatus;
}

interface StaffMember {
  id: string;
  name: string;
  initial: string;
  team: string;
  teamLabel: string;
  avatarBg: string;
  avatarText: string;
  online: boolean;
  currentCount: number;
  closedCount: number;
  progress: number;
  patients: Patient[];
}

const initialPatients: Patient[] = [
  {
    id: 1,
    name: 'คุณสมชาย',
    avatar: 'ส',
    avatarBg: 'bg-red-100',
    avatarText: 'text-red-600',
    channel: 'LINE',
    channelLabel: 'LINE - คนไข้ใหม่',
    priority: 'urgent',
    summary: 'ปวดฟันคุดมาก 2 วัน กินยาแก้ปวดไม่หาย ต้องการผ่าฟันคุด',
    tags: ['ผ่าฟันคุด'],
    waitTime: '05:32'
  },
  {
    id: 2,
    name: 'คุณลิซ่า',
    avatar: 'ล',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-600',
    channel: 'Facebook',
    channelLabel: 'Facebook - คนไข้ใหม่',
    priority: 'new',
    summary: 'สนใจจัดฟัน อยากปรึกษาราคาและระยะเวลา งบประมาณ 50,000 บาท',
    tags: ['จัดฟัน'],
    waitTime: '03:15'
  },
  {
    id: 3,
    name: 'คุณวิภา',
    avatar: 'ว',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-600',
    channel: 'Instagram',
    channelLabel: 'Instagram - HN: D-2023-156',
    priority: 'existing',
    summary: 'ถามราคาฟอกสีฟัน แค่สอบถามยังไม่ได้ตัดสินใจ',
    tags: ['ฟอกฟัน'],
    waitTime: '02:45'
  },
  {
    id: 4,
    name: 'คุณพิมพ์',
    avatar: 'พ',
    avatarBg: 'bg-yellow-100',
    avatarText: 'text-yellow-600',
    channel: 'TikTok',
    channelLabel: 'TikTok - VIP',
    priority: 'vip',
    summary: 'ต้องการทำวีเนียร์ 8 ซี่ สอบถามโปรโมชั่นและนัดพบหมอ',
    tags: ['วีเนียร์'],
    waitTime: '01:20'
  },
  {
    id: 5,
    name: 'John Smith',
    avatar: 'J',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-600',
    channel: 'WhatsApp',
    channelLabel: 'WhatsApp - ต่างชาติ',
    priority: 'foreign',
    summary: 'Asking about clinic opening hours for Saturday',
    tags: ['EN'],
    waitTime: '00:55'
  },
];

const initialStaff: StaffMember[] = [
  {
    id: 'ann',
    name: 'Admin แอน',
    initial: 'A',
    team: 'team-general',
    teamLabel: 'ทีมทันตกรรมทั่วไป',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-600',
    online: true,
    currentCount: 3,
    closedCount: 5,
    progress: 62,
    patients: []
  },
  {
    id: 'ben',
    name: 'Admin เบน',
    initial: 'B',
    team: 'team-general',
    teamLabel: 'ทีมทันตกรรมทั่วไป',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-600',
    online: true,
    currentCount: 2,
    closedCount: 8,
    progress: 80,
    patients: []
  },
  {
    id: 'cat',
    name: 'Admin แคท',
    initial: 'C',
    team: 'team-ortho',
    teamLabel: 'ทีมจัดฟัน',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-600',
    online: true,
    currentCount: 4,
    closedCount: 6,
    progress: 60,
    patients: []
  },
];

const channelColors: Record<Channel, string> = {
  'LINE': 'bg-green-500',
  'Facebook': 'bg-blue-600',
  'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500',
  'TikTok': 'bg-black',
  'WhatsApp': 'bg-green-600'
};

const channelShort: Record<Channel, string> = {
  'LINE': 'L',
  'Facebook': 'f',
  'Instagram': 'IG',
  'TikTok': 'TT',
  'WhatsApp': 'W'
};

const priorityConfig: Record<Priority, { bg: string; text: string; label: string }> = {
  'urgent': { bg: 'bg-red-500', text: 'text-white', label: 'เร่งด่วน' },
  'new': { bg: 'bg-blue-500', text: 'text-white', label: 'ใหม่' },
  'existing': { bg: 'bg-green-500', text: 'text-white', label: 'นัดเดิม' },
  'vip': { bg: 'bg-yellow-500', text: 'text-white', label: 'VIP' },
  'foreign': { bg: 'bg-indigo-500', text: 'text-white', label: 'EN' }
};

const categoryConfig: Record<Category, { icon: React.ReactNode; title: string; desc: string; bg: string; iconBg: string; iconColor: string }> = {
  'inquiry': {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'สอบถามเฉยๆ (ปิดเคส)',
    desc: 'AI ตอบได้ ไม่ต้องส่งต่อ',
    bg: 'bg-gray-50',
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-600'
  },
  'general': {
    icon: <Heart className="w-5 h-5" />,
    title: 'ทันตกรรมทั่วไป',
    desc: 'ขูดหินปูน, อุดฟัน, ถอนฟัน',
    bg: 'bg-white',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  'surgery': {
    icon: <Scissors className="w-5 h-5" />,
    title: 'ศัลยกรรมช่องปาก',
    desc: 'ผ่าฟันคุด, รากเทียม',
    bg: 'bg-white',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  'ortho': {
    icon: <Smile className="w-5 h-5" />,
    title: 'ทันตกรรมจัดฟัน',
    desc: 'จัดฟัน, Invisalign',
    bg: 'bg-white',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  'cosmetic': {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'เสริมความงาม',
    desc: 'ฟอกฟัน, วีเนียร์, ครอบฟัน',
    bg: 'bg-white',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600'
  }
};

const quickTags = ['ทำฟัน', 'จัดฟัน', 'ฟอกฟัน', 'ผ่าฟันคุด', 'วีเนียร์'];

export function Dispatch() {
  const [activeTab, setActiveTab] = useState<TabType>('categorize');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [categorizedPatients, setCategorizedPatients] = useState<Record<Category, Patient[]>>({
    inquiry: [],
    general: [],
    surgery: [],
    ortho: [],
    cosmetic: []
  });
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [draggedPatientId, setDraggedPatientId] = useState<number | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<Category | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  const tabs: { key: TabType; number: number; label: string; count: number; countBg: string }[] = [
    { key: 'categorize', number: 1, label: 'จัดประเภท', count: patients.length, countBg: 'bg-orange-100 text-orange-700' },
    { key: 'team-info', number: 2, label: 'ข้อมูลรายทีม', count: Object.values(categorizedPatients).flat().length, countBg: 'bg-green-100 text-green-700' },
    { key: 'individual-info', number: 3, label: 'ข้อมูลรายบุคคล (Demo)', count: staff[0]?.patients.length || 0, countBg: 'bg-pink-100 text-pink-700' },
  ];

  const filteredStaff = teamFilter === 'all'
    ? staff
    : staff.filter(s => s.team === teamFilter);

  // Get Ann's tasks for tab 3
  const annTasks = staff.find(s => s.id === 'ann')?.patients || [];
  const doTasks = annTasks.filter(p => p.taskStatus === 'do');
  const doingTasks = annTasks.filter(p => p.taskStatus === 'doing');
  const doneTasks = annTasks.filter(p => p.taskStatus === 'done');

  const handleDragStart = (e: DragEvent<HTMLDivElement>, patientId: number) => {
    setDraggedPatientId(patientId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedPatientId(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, category: Category) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, category: Category) => {
    e.preventDefault();
    if (draggedPatientId === null) return;

    const patientIndex = patients.findIndex(p => p.id === draggedPatientId);
    if (patientIndex === -1) return;

    const patient = { ...patients[patientIndex], category, taskStatus: 'do' as TaskStatus };

    // Remove from queue
    const newPatients = patients.filter(p => p.id !== draggedPatientId);
    setPatients(newPatients);

    // Add to category
    setCategorizedPatients(prev => ({
      ...prev,
      [category]: [...prev[category], patient]
    }));

    // If not inquiry (close case), also assign to Ann for demo
    if (category !== 'inquiry') {
      setStaff(prev => prev.map(s => {
        if (s.id === 'ann') {
          return { ...s, patients: [...s.patients, patient] };
        }
        return s;
      }));
    }

    setDraggedPatientId(null);
    setDragOverCategory(null);
  };

  const handleRemoveTag = (patientId: number, tagIndex: number) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newTags = [...p.tags];
        newTags.splice(tagIndex, 1);
        return { ...p, tags: newTags };
      }
      return p;
    }));
  };

  const handleOpenTagEditor = (patientId: number) => {
    setEditingPatientId(patientId);
    setShowTagModal(true);
  };

  const handleAddTag = (tag: string) => {
    if (editingPatientId === null) return;
    setPatients(prev => prev.map(p => {
      if (p.id === editingPatientId && !p.tags.includes(tag)) {
        return { ...p, tags: [...p.tags, tag] };
      }
      return p;
    }));
  };

  const handleOpenChat = (name: string) => {
    setSelectedPatientName(name);
    setShowChatModal(true);
  };

  const handleMoveTask = (patientId: number, newStatus: TaskStatus) => {
    setStaff(prev => prev.map(s => {
      if (s.id === 'ann') {
        return {
          ...s,
          patients: s.patients.map(p =>
            p.id === patientId ? { ...p, taskStatus: newStatus } : p
          )
        };
      }
      return s;
    }));
  };

  const renderPatientCard = (patient: Patient, showDragHandle = true) => {
    const priority = priorityConfig[patient.priority];
    const isDragging = patient.id === draggedPatientId;

    return (
      <div
        key={patient.id}
        className={`bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-dental-300 transition-all ${
          showDragHandle ? 'cursor-grab' : ''
        } ${isDragging ? 'opacity-50 rotate-1' : ''}`}
        draggable={showDragHandle}
        onDragStart={showDragHandle ? (e) => handleDragStart(e, patient.id) : undefined}
        onDragEnd={showDragHandle ? handleDragEnd : undefined}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 ${patient.avatarBg} rounded-full flex items-center justify-center`}>
              <span className={`${patient.avatarText} font-semibold`}>{patient.avatar}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{patient.name}</p>
              <div className="flex items-center gap-1">
                <span className={`w-4 h-4 ${channelColors[patient.channel]} rounded text-white text-[8px] flex items-center justify-center font-bold`}>
                  {channelShort[patient.channel]}
                </span>
                <span className="text-xs text-gray-500">{patient.channelLabel}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 ${priority.bg} ${priority.text} text-xs rounded-full font-medium`}>
            {priority.label}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-2">
          <p className="text-xs text-gray-500 mb-1">AI Summary:</p>
          <p className="text-sm text-gray-800">{patient.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-2">
          {patient.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
              {tag}
              {showDragHandle && (
                <button onClick={() => handleRemoveTag(patient.id, idx)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {showDragHandle && (
            <button
              onClick={() => handleOpenTagEditor(patient.id)}
              className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded hover:bg-gray-200"
            >
              +
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-orange-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-bold">{patient.waitTime}</span>
          </div>
          <button
            onClick={() => handleOpenChat(patient.name)}
            className="text-xs text-violet-600 hover:text-violet-800"
          >
            ดูแชท
          </button>
        </div>
      </div>
    );
  };

  const renderMiniCard = (patient: Patient, showActions = false) => (
    <div key={patient.id} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${patient.avatarBg} rounded-full flex items-center justify-center`}>
            <span className={`${patient.avatarText} text-xs font-semibold`}>{patient.avatar}</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{patient.name}</span>
        </div>
        {showActions && patient.taskStatus && (
          <div className="flex gap-1">
            {patient.taskStatus === 'do' && (
              <button
                onClick={() => handleMoveTask(patient.id, 'doing')}
                className="text-xs text-yellow-600 hover:text-yellow-800"
              >
                เริ่ม
              </button>
            )}
            {patient.taskStatus === 'doing' && (
              <button
                onClick={() => handleMoveTask(patient.id, 'done')}
                className="text-xs text-green-600 hover:text-green-800"
              >
                เสร็จ
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 truncate">{patient.summary}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dispatch Center</h1>
            <p className="text-sm text-gray-500">จัดประเภท → ข้อมูลรายทีม → ข้อมูลรายบุคคล</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700">AI กำลังทำงาน</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
              <p className="text-xs text-gray-500">รอกระจายงาน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-8 py-3 border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'border-dental-500 bg-dental-50 text-dental-700'
                  : 'border-gray-200 text-gray-600 hover:border-dental-300'
              }`}
            >
              <span className={`w-6 h-6 ${activeTab === tab.key ? 'bg-dental-500' : 'bg-gray-400'} text-white rounded-full text-sm flex items-center justify-center`}>
                {tab.number}
              </span>
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${tab.countBg}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden">
        {/* Tab 1: จัดประเภท */}
        {activeTab === 'categorize' && (
          <div className="h-full p-6">
            <div className="flex gap-6 h-full">
              {/* Left: Queue */}
              <div className="w-[420px] flex flex-col">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-500" />
                        แชทจากลูกค้า
                      </h2>
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                        {patients.length} รายการ
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AI ซักประวัติเสร็จแล้ว รอจัดประเภท</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {patients.map(patient => renderPatientCard(patient))}
                    {patients.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">ไม่มีแชทรอจัดประเภท</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Category Drop Zones */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Inquiry (Close Case) */}
                <div
                  className={`rounded-2xl shadow-sm border-2 border-dashed p-4 transition-all ${
                    dragOverCategory === 'inquiry'
                      ? 'border-dental-500 bg-dental-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'inquiry')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'inquiry')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${categoryConfig.inquiry.iconBg} rounded-xl flex items-center justify-center`}>
                      <span className={categoryConfig.inquiry.iconColor}>{categoryConfig.inquiry.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700">{categoryConfig.inquiry.title}</h3>
                      <p className="text-xs text-gray-500">{categoryConfig.inquiry.desc}</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 min-h-[60px] bg-white">
                    {categorizedPatients.inquiry.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-2">ลากมาวางเพื่อปิดเคส</div>
                    ) : (
                      <div className="space-y-2">
                        {categorizedPatients.inquiry.map(p => renderMiniCard(p))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4 Categories Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {(['general', 'surgery', 'ortho', 'cosmetic'] as Category[]).map(category => {
                    const config = categoryConfig[category];
                    const isDragOver = dragOverCategory === category;

                    return (
                      <div
                        key={category}
                        className={`rounded-2xl shadow-sm border-2 p-4 transition-all ${
                          isDragOver ? 'border-dental-500 bg-dental-50' : `border-gray-200 ${config.bg}`
                        }`}
                        onDragOver={(e) => handleDragOver(e, category)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, category)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center`}>
                            <span className={config.iconColor}>{config.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{config.title}</h3>
                            <p className="text-xs text-gray-500">{config.desc}</p>
                          </div>
                        </div>
                        <div className={`border-2 border-dashed rounded-xl p-3 min-h-[100px] transition-colors ${
                          isDragOver ? 'border-dental-500' : 'border-gray-200'
                        }`}>
                          {categorizedPatients[category].length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-6">ลากการ์ดมาวาง</div>
                          ) : (
                            <div className="space-y-2">
                              {categorizedPatients[category].map(p => renderMiniCard(p))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ข้อมูลรายทีม */}
        {activeTab === 'team-info' && (
          <div className="h-full p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">ข้อมูลรายทีม - ดูภาพรวมทีม</h2>
                  <p className="text-sm text-gray-500">ดูว่าแต่ละทีมมีงานกี่ชิ้น ทำเสร็จหรือยัง</p>
                </div>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">ทุกทีม</option>
                  <option value="team-general">ทีมทันตกรรมทั่วไป</option>
                  <option value="team-surgery">ทีมศัลยกรรม</option>
                  <option value="team-ortho">ทีมจัดฟัน</option>
                  <option value="team-cosmetic">ทีมเสริมความงาม</option>
                </select>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4 overflow-y-auto">
                {filteredStaff.map(member => (
                  <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 ${member.avatarBg} rounded-full flex items-center justify-center relative`}>
                        <span className={`${member.avatarText} font-bold text-xl`}>{member.initial}</span>
                        <span className={`absolute bottom-0 right-0 w-4 h-4 ${member.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.teamLabel}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">{member.patients.length || member.currentCount}</p>
                        <p className="text-xs text-gray-500">งานในคิว</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{member.closedCount}</p>
                        <p className="text-xs text-gray-500">ปิดวันนี้</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full ${member.progress >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${member.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {member.patients.length === 0 ? (
                        <p className="text-xs text-gray-400">ไม่มีงานในคิว</p>
                      ) : (
                        member.patients.slice(0, 3).map(p => renderMiniCard(p))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: ข้อมูลรายบุคคล */}
        {activeTab === 'individual-info' && (
          <div className="h-full p-6">
            <div className="flex gap-6 h-full">
              <div className="flex-1 flex flex-col">
                {/* Staff Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-bold text-2xl">A</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800">Admin แอน</h2>
                      <p className="text-sm text-gray-500">ข้อมูลรายบุคคล Demo • ข้อมูลจาก Tab 2</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{doTasks.length}</p>
                        <p className="text-xs text-gray-500">รอทำ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{doingTasks.length}</p>
                        <p className="text-xs text-gray-500">กำลังทำ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{doneTasks.length}</p>
                        <p className="text-xs text-gray-500">เสร็จแล้ว</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DO / DOING / DONE Columns */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {/* DO Column */}
                  <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 flex flex-col">
                    <div className="p-4 border-b border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">DO</span>
                        </div>
                        <h3 className="font-bold text-blue-800">รอดำเนินการ</h3>
                        <span className="ml-auto bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {doTasks.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {doTasks.length === 0 ? (
                        <div className="text-center text-gray-300 py-8 text-xs">มอบหมายงานใน Tab 1 ก่อน</div>
                      ) : (
                        doTasks.map(p => renderMiniCard(p, true))
                      )}
                    </div>
                  </div>

                  {/* DOING Column */}
                  <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 flex flex-col">
                    <div className="p-4 border-b border-yellow-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">DOING</span>
                        </div>
                        <h3 className="font-bold text-yellow-800">กำลังดำเนินการ</h3>
                        <span className="ml-auto bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {doingTasks.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {doingTasks.length === 0 ? (
                        <div className="text-center text-gray-300 py-8 text-xs">ยังไม่มีรายการ</div>
                      ) : (
                        doingTasks.map(p => renderMiniCard(p, true))
                      )}
                    </div>
                  </div>

                  {/* DONE Column */}
                  <div className="bg-green-50 rounded-2xl border-2 border-green-200 flex flex-col">
                    <div className="p-4 border-b border-green-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">DONE</span>
                        </div>
                        <h3 className="font-bold text-green-800">เสร็จสิ้น</h3>
                        <span className="ml-auto bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                          {doneTasks.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {doneTasks.length === 0 ? (
                        <div className="text-center text-gray-300 py-8 text-xs">ยังไม่มีรายการ</div>
                      ) : (
                        doneTasks.map(p => renderMiniCard(p))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" />
            <span className="font-medium">AI ปิดเคสอัตโนมัติวันนี้</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">47</p>
              <p className="text-xs text-purple-200">เคสที่ AI ปิดได้เอง</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">62%</p>
              <p className="text-xs text-purple-200">ลดงาน Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">AI Chat History - {selectedPatientName}</h3>
              <button onClick={() => setShowChatModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-3 py-2 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-800">สวัสดีครับ อยากสอบถามเรื่องบริการครับ</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:00</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-green-100 rounded-2xl rounded-br-md px-3 py-2">
                  <p className="text-sm text-gray-800">🤖 สวัสดีค่ะ ยินดีให้บริการค่ะ มีอะไรให้ช่วยคะ?</p>
                  <p className="text-xs text-green-600 mt-1 text-right">10:01</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-3 py-2 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-800">อยากทราบราคาค่าบริการครับ</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:02</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowChatModal(false)}
                className="w-full px-4 py-2 bg-dental-500 text-white rounded-xl hover:bg-dental-600 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Editor Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Edit Tags</h3>
              <button onClick={() => setShowTagModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Tags</label>
                <div className="flex flex-wrap gap-2">
                  {quickTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowTagModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
