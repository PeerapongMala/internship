import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Eye,
  HelpCircle,
  MessageSquare,
  Settings as SettingsIcon,
  Sparkles,
  DollarSign,
  Calendar,
  Gift,
  Tag,
  Clock,
  CheckSquare,
  Square,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

// Types
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface ChatQuestion {
  id: number;
  question: string;
  customer_name: string;
  channel: 'LINE' | 'Facebook' | 'Instagram';
  created_at: string;
  frequency: number;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

interface Category {
  id: string;
  name: string;
}

interface Settings {
  id: number;
  intro_message: string;
}

const defaultCategories: FAQCategory[] = [
  { id: 'all', name: 'ทั้งหมด', icon: HelpCircle, count: 0 },
  { id: 'price', name: 'ราคา', icon: DollarSign, count: 0 },
  { id: 'service', name: 'บริการ', icon: Tag, count: 0 },
  { id: 'booking', name: 'นัดหมาย', icon: Calendar, count: 0 },
  { id: 'promo', name: 'โปรโมชั่น', icon: Gift, count: 0 },
];

const categoryLabels: Record<string, string> = {
  'price': 'ราคา',
  'service': 'บริการ',
  'booking': 'นัดหมาย',
  'promo': 'โปรโมชั่น',
  'general': 'ทั่วไป',
};

const categoryColors: Record<string, string> = {
  'price': 'bg-blue-100 text-blue-700',
  'service': 'bg-green-100 text-green-700',
  'booking': 'bg-purple-100 text-purple-700',
  'promo': 'bg-orange-100 text-orange-700',
  'general': 'bg-gray-100 text-gray-700',
};

const channelColors: Record<string, string> = {
  'LINE': 'bg-green-100 text-green-700',
  'Facebook': 'bg-blue-100 text-blue-700',
  'Instagram': 'bg-pink-100 text-pink-700',
};

type TabType = 'faq-list' | 'chat-questions' | 'settings';

export function FAQ() {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('faq-list');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [chatQuestions, setChatQuestions] = useState<ChatQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showAddFromChatModal, setShowAddFromChatModal] = useState(false);
  const [selectedChatQuestion, setSelectedChatQuestion] = useState<ChatQuestion | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state for modals
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('price');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Settings state
  const [settingsCategories, setSettingsCategories] = useState<Category[]>([]);
  const [introMessage, setIntroMessage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [previewClickedFaq, setPreviewClickedFaq] = useState<FAQ | null>(null);

  // API Functions
  const fetchFAQs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const response = await fetch(`${API_BASE_URL}/faqs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    }
  }, [selectedCategory, searchQuery]);

  const fetchChatQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-questions`);
      if (response.ok) {
        const data = await response.json();
        setChatQuestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch chat questions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setSettingsCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (response.ok) {
        const data: Settings = await response.json();
        setIntroMessage(data.intro_message || '');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchFAQs();
    fetchChatQuestions();
    fetchCategories();
    fetchSettings();
  }, []);

  // Reload FAQs when filter changes
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // Calculate category counts
  const getCategoryCounts = () => {
    const counts: Record<string, number> = { all: faqs.length };
    faqs.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Filter FAQs (client-side for search)
  const filteredFaqs = faqs;

  // Handlers
  const handleAddFAQ = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
        }),
      });

      if (response.ok) {
        await fetchFAQs();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to add FAQ:', error);
    }
    setLoading(false);
  };

  const handleEditFAQ = async () => {
    if (!editingFaq || !formQuestion.trim() || !formAnswer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${editingFaq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
        }),
      });

      if (response.ok) {
        await fetchFAQs();
        setShowEditModal(false);
        setEditingFaq(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to update FAQ:', error);
    }
    setLoading(false);
  };

  const handleDeleteFAQ = async (id: number) => {
    if (confirm('ต้องการลบ FAQ นี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchFAQs();
        }
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
      }
    }
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('price');
  };

  const handleAIGenerate = async () => {
    if (!formQuestion.trim()) return;

    setIsGeneratingAI(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock AI-generated answers based on question keywords
    let generatedAnswer = '';
    const q = formQuestion.toLowerCase();

    if (q.includes('ราคา') || q.includes('เท่าไหร่')) {
      generatedAnswer = 'ราคาบริการของเราอยู่ในเกณฑ์มาตรฐาน สามารถสอบถามราคาที่แน่นอนได้ที่คลินิกโดยตรง หรือโทรสอบถามที่ 02-xxx-xxxx ค่ะ';
    } else if (q.includes('เปิด') || q.includes('โมง')) {
      generatedAnswer = 'คลินิกเปิดให้บริการ วันจันทร์-ศุกร์ 10:00-20:00 น. วันเสาร์-อาทิตย์ 09:00-18:00 น. ค่ะ';
    } else if (q.includes('นัด') || q.includes('จอง')) {
      generatedAnswer = 'สามารถนัดหมายได้ผ่านทาง LINE หรือโทรนัดล่วงหน้าอย่างน้อย 1 วันค่ะ';
    } else if (q.includes('โปร') || q.includes('ส่วนลด')) {
      generatedAnswer = 'ตอนนี้มีโปรโมชั่นพิเศษสำหรับลูกค้าใหม่ สามารถสอบถามโปรโมชั่นล่าสุดได้ที่ LINE @dentalplus ค่ะ';
    } else {
      generatedAnswer = 'ขอบคุณสำหรับคำถามค่ะ ทีมงานยินดีให้บริการ สามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ LINE @dentalplus หรือโทร 02-xxx-xxxx ค่ะ';
    }

    setFormAnswer(generatedAnswer);
    setIsGeneratingAI(false);
  };

  // Chat Questions Handlers
  const toggleQuestionSelection = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.length === chatQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(chatQuestions.map((q) => q.id));
    }
  };

  const handleAddSelectedToFAQ = () => {
    if (selectedQuestions.length === 1) {
      const question = chatQuestions.find((q) => q.id === selectedQuestions[0]);
      if (question) {
        setSelectedChatQuestion(question);
        setFormQuestion(question.question);
        setFormAnswer('');
        setShowAddFromChatModal(true);
      }
    } else if (selectedQuestions.length > 1) {
      // For multiple selections, open modal with first question
      const question = chatQuestions.find((q) => q.id === selectedQuestions[0]);
      if (question) {
        setSelectedChatQuestion(question);
        setFormQuestion(question.question);
        setFormAnswer('');
        setShowAddFromChatModal(true);
      }
    }
  };

  const handleAddFromChat = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
        }),
      });

      if (response.ok) {
        await fetchFAQs();

        // Remove from chat questions
        if (selectedChatQuestion) {
          await fetch(`${API_BASE_URL}/chat-questions/${selectedChatQuestion.id}`, {
            method: 'DELETE',
          });
          await fetchChatQuestions();
          setSelectedQuestions(selectedQuestions.filter((id) => id !== selectedChatQuestion.id));
        }

        setShowAddFromChatModal(false);
        setSelectedChatQuestion(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to add FAQ from chat:', error);
    }
    setLoading(false);
  };

  const handleDeleteChatQuestions = async () => {
    if (selectedQuestions.length === 0) return;
    if (confirm(`ต้องการลบ ${selectedQuestions.length} รายการที่เลือกใช่หรือไม่?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat-questions`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedQuestions }),
        });
        if (response.ok) {
          await fetchChatQuestions();
          setSelectedQuestions([]);
        }
      } catch (error) {
        console.error('Failed to delete chat questions:', error);
      }
    }
  };

  // Settings Handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    if (settingsCategories.find((c) => c.id === newId)) {
      alert('หมวดหมู่นี้มีอยู่แล้ว');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId, name: newCategoryName }),
      });
      if (response.ok) {
        await fetchCategories();
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchCategories();
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intro_message: introMessage }),
      });
      if (response.ok) {
        alert('บันทึกเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
          <p className="text-gray-500 mt-1">จัดการคำถามที่พบบ่อยสำหรับลูกค้า</p>
        </div>
        {activeTab === 'faq-list' && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            เพิ่ม FAQ
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('faq-list')}
          className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'faq-list'
              ? 'border-dental-500 text-dental-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          รายการ FAQ
        </button>
        <button
          onClick={() => setActiveTab('chat-questions')}
          className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'chat-questions'
              ? 'border-dental-500 text-dental-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          คำถามจากแชท
          {chatQuestions.length > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
              {chatQuestions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-dental-500 text-dental-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          ตั้งค่า
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'faq-list' && (
        <div className="flex gap-6">
          {/* Category Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">หมวดหมู่</h3>
              <div className="space-y-1">
                {defaultCategories.map((cat) => {
                  const Icon = cat.icon;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-dental-50 text-dental-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
            </div>

            {/* FAQ Cards */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>ไม่พบ FAQ ที่ตรงกับเงื่อนไข</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            categoryColors[faq.category] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {categoryLabels[faq.category] || faq.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg"
                        >
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h4>
                    <p className="text-gray-600 text-sm mb-3">A: {faq.answer}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {faq.views} views
                      </span>
                      <span>อัพเดท {formatDate(faq.updated_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat-questions' && (
        <div>
          {/* Bulk Action Bar */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              {selectedQuestions.length === chatQuestions.length && chatQuestions.length > 0 ? (
                <CheckSquare className="w-5 h-5 text-dental-500" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="text-sm">เลือกทั้งหมด</span>
            </button>
            <div className="flex-1" />
            {selectedQuestions.length > 0 && (
              <>
                <span className="text-sm text-gray-500">เลือก {selectedQuestions.length} รายการ</span>
                <button
                  onClick={handleAddSelectedToFAQ}
                  className="px-4 py-2 bg-dental-500 text-white rounded-lg text-sm font-medium hover:bg-dental-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มเป็น FAQ
                </button>
                <button
                  onClick={handleDeleteChatQuestions}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  ลบ
                </button>
              </>
            )}
          </div>

          {/* Chat Questions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {chatQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ไม่มีคำถามจากแชท</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {chatQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      selectedQuestions.includes(question.id) ? 'bg-dental-50' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleQuestionSelection(question.id)}
                      className="flex-shrink-0"
                    >
                      {selectedQuestions.includes(question.id) ? (
                        <CheckSquare className="w-5 h-5 text-dental-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">"{question.question}"</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{question.customer_name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            channelColors[question.channel] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {question.channel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(question.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-orange-600">
                        {question.frequency} ครั้ง
                      </span>
                      <p className="text-xs text-gray-400">ถูกถาม</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChatQuestion(question);
                        setFormQuestion(question.question);
                        setFormAnswer('');
                        setFormCategory('price');
                        setShowAddFromChatModal(true);
                      }}
                      className="flex-shrink-0 px-3 py-1.5 bg-dental-50 text-dental-600 rounded-lg text-sm font-medium hover:bg-dental-100"
                    >
                      เพิ่มเป็น FAQ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          {/* Category Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">หมวดหมู่ FAQ</h3>
            <div className="space-y-2 mb-4">
              {settingsCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ชื่อหมวดหมู่ใหม่"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-dental-500 text-white rounded-lg font-medium hover:bg-dental-600"
              >
                เพิ่ม
              </button>
            </div>
          </div>

          {/* Intro Message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อความ FAQ สำหรับแชท</h3>
            <p className="text-sm text-gray-500 mb-3">
              ข้อความนี้จะแสดงก่อนรายการ FAQ เมื่อส่งให้ลูกค้า
            </p>
            <textarea
              rows={3}
              value={introMessage}
              onChange={(e) => setIntroMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
            />
            <button
              onClick={handleSaveSettings}
              className="mt-3 px-4 py-2 bg-dental-500 text-white rounded-lg font-medium hover:bg-dental-600"
            >
              บันทึก
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ตัวอย่าง FAQ ในแชท</h3>
            <p className="text-sm text-gray-500 mb-3">คลิกที่ link เพื่อดูตัวอย่างการตอบกลับอัตโนมัติ</p>
            <div className="bg-gray-100 rounded-xl p-4 space-y-3">
              {/* Bot message with FAQ links */}
              <div className="flex justify-start">
                <div className="bg-dental-500 text-white rounded-2xl rounded-bl-none p-4 max-w-sm">
                  <p className="text-sm mb-3">{introMessage || 'ยินดีต้อนรับค่ะ'}</p>
                  <p className="text-xs font-semibold text-dental-100 mb-2">FAQ</p>
                  <div className="space-y-1">
                    {faqs.slice(0, 4).map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => setPreviewClickedFaq(faq)}
                        className="block text-left text-sm text-white underline hover:text-dental-100 transition-colors"
                      >
                        {faq.question}
                      </button>
                    ))}
                    <button
                      onClick={() => window.open('/faq-all', '_blank')}
                      className="block text-left text-sm text-white underline hover:text-dental-100 transition-colors font-medium"
                    >
                      FAQ ทั้งหมด
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer clicks a link */}
              {previewClickedFaq && (
                <>
                  {/* Customer message (clicked link) */}
                  <div className="flex justify-end">
                    <div className="bg-white rounded-2xl rounded-br-none p-3 max-w-xs shadow-sm">
                      <p className="text-sm text-gray-800">{previewClickedFaq.question}</p>
                    </div>
                  </div>

                  {/* Bot auto-reply */}
                  <div className="flex justify-start">
                    <div className="bg-dental-500 text-white rounded-2xl rounded-bl-none p-3 max-w-sm">
                      <p className="text-sm">{previewClickedFaq.answer}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Second bot message - not found option */}
              <div className="flex justify-start">
                <div className="bg-dental-500 text-white rounded-2xl rounded-bl-none p-4 max-w-sm">
                  <p className="text-sm mb-3">หากยังไม่พบคำตอบที่ต้องการ สามารถกดปุ่มด้านล่างเพื่อส่งคำถามให้ทีมงานตอบกลับค่ะ</p>
                  <button className="w-full px-4 py-2 bg-white text-dental-600 rounded-xl text-sm font-medium hover:bg-dental-50 transition-colors">
                    ยังไม่พบคำตอบ
                  </button>
                </div>
              </div>
            </div>
            {previewClickedFaq && (
              <button
                onClick={() => setPreviewClickedFaq(null)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                รีเซ็ต preview
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">เพิ่ม FAQ ใหม่</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">คำถาม</label>
                <input
                  type="text"
                  placeholder="พิมพ์คำถาม..."
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                >
                  {settingsCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">คำตอบ</label>
                  <button
                    onClick={handleAIGenerate}
                    disabled={!formQuestion.trim() || isGeneratingAI}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingAI ? 'กำลังสร้าง...' : 'AI ช่วยกรอก'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="พิมพ์คำตอบ..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddFAQ}
                disabled={!formQuestion.trim() || !formAnswer.trim() || loading}
                className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {showEditModal && editingFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">แก้ไข FAQ</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFaq(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">คำถาม</label>
                <input
                  type="text"
                  placeholder="พิมพ์คำถาม..."
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                >
                  {settingsCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">คำตอบ</label>
                  <button
                    onClick={handleAIGenerate}
                    disabled={!formQuestion.trim() || isGeneratingAI}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingAI ? 'กำลังสร้าง...' : 'AI ช่วยกรอก'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="พิมพ์คำตอบ..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFaq(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleEditFAQ}
                disabled={!formQuestion.trim() || !formAnswer.trim() || loading}
                className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add from Chat Modal */}
      {showAddFromChatModal && selectedChatQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">เพิ่มคำถามเป็น FAQ</h3>
              <button
                onClick={() => {
                  setShowAddFromChatModal(false);
                  setSelectedChatQuestion(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">จากแชท:</p>
                <p className="text-gray-800">"{selectedChatQuestion.question}"</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{selectedChatQuestion.customer_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      channelColors[selectedChatQuestion.channel] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedChatQuestion.channel}
                  </span>
                  <span>ถูกถาม {selectedChatQuestion.frequency} ครั้ง</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">คำถาม (แก้ไขได้)</label>
                <input
                  type="text"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                >
                  {settingsCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">คำตอบ</label>
                  <button
                    onClick={handleAIGenerate}
                    disabled={!formQuestion.trim() || isGeneratingAI}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingAI ? 'กำลังสร้าง...' : 'AI ช่วยกรอก'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="พิมพ์คำตอบ..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddFromChatModal(false);
                  setSelectedChatQuestion(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddFromChat}
                disabled={!formQuestion.trim() || !formAnswer.trim() || loading}
                className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังเพิ่ม...' : 'เพิ่มเป็น FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
