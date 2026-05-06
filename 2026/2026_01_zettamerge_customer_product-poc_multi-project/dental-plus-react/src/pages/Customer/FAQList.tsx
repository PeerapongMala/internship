import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

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

export function FAQList() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(faqs.map(f => f.category))];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-dental-500 text-white px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-dental-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">กลับ</span>
          </button>
          <h1 className="text-2xl font-bold mb-2">คำถามที่พบบ่อย (FAQ)</h1>
          <p className="text-dental-100">ค้นหาคำตอบสำหรับคำถามของคุณ</p>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาคำถาม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-dental-300"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-dental-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'ทั้งหมด' : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>ไม่พบคำถามที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[faq.category] || 'bg-gray-100 text-gray-700'}`}>
                        {categoryLabels[faq.category] || faq.category}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{faq.question}</p>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedId === faq.id && (
                  <div className="px-5 pb-4 pt-0">
                    <div className="bg-dental-50 rounded-lg p-4 text-gray-700 text-sm whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-3">ยังไม่พบคำตอบที่ต้องการ?</p>
          <button
            onClick={() => navigate('/chat-task-management')}
            className="px-6 py-3 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 transition-colors"
          >
            ติดต่อเจ้าหน้าที่
          </button>
        </div>
      </div>
    </div>
  );
}
