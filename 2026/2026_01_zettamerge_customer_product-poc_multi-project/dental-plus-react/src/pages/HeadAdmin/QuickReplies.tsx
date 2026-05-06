import { useState } from 'react';
import { Zap, Plus, Pencil, Trash2, X } from 'lucide-react';
import { quickReplies, QuickReply } from '../../data/mockData';

type CategoryType = 'all' | 'greeting' | 'price' | 'booking' | 'promo' | 'closing';

const categoryLabels: Record<string, string> = {
  'all': 'ทั้งหมด',
  'greeting': 'ทักทาย',
  'price': 'ราคา',
  'booking': 'นัดหมาย',
  'promo': 'โปรโมชั่น',
  'closing': 'ปิดการขาย'
};

const categoryColors: Record<string, string> = {
  'greeting': 'bg-green-100 text-green-700',
  'price': 'bg-blue-100 text-blue-700',
  'booking': 'bg-purple-100 text-purple-700',
  'promo': 'bg-orange-100 text-orange-700',
  'closing': 'bg-pink-100 text-pink-700'
};

export function QuickReplies() {
  const [category, setCategory] = useState<CategoryType>('all');
  const [showModal, setShowModal] = useState(false);

  const filteredReplies = category === 'all'
    ? quickReplies
    : quickReplies.filter(r => r.category === category);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quick Replies</h1>
          <p className="text-gray-500 mt-1">จัดการข้อความสำเร็จรูป (พิมพ์ "/" เพื่อเรียกใช้)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          เพิ่มข้อความ
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'greeting', 'price', 'booking', 'promo', 'closing'] as CategoryType[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl font-medium ${
              category === cat
                ? 'bg-dental-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Quick Replies Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredReplies.map((reply) => (
          <div
            key={reply.id}
            className="quick-reply-card bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 ${categoryColors[reply.category]} text-xs rounded-full font-mono`}>
                  {reply.shortcut}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {categoryLabels[reply.category]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <p className="text-gray-800 text-sm mb-3">{reply.message}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>ใช้ไป {reply.usageCount} ครั้ง</span>
              <span>อัพเดท {reply.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">เพิ่มข้อความสำเร็จรูป</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shortcut</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500">/</span>
                  <input
                    type="text"
                    placeholder="shortcut"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500">
                  <option value="greeting">ทักทาย</option>
                  <option value="price">ราคา</option>
                  <option value="booking">นัดหมาย</option>
                  <option value="promo">โปรโมชั่น</option>
                  <option value="closing">ปิดการขาย</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
                <textarea
                  rows={4}
                  placeholder="พิมพ์ข้อความที่ต้องการ..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-500"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">ใช้ [NAME], [DATE], [TIME], [DOCTOR] สำหรับ placeholder</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button className="px-4 py-2 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
