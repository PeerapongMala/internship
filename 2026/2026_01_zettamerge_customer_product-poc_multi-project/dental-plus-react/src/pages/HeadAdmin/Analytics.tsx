import { useState, useEffect, useRef } from 'react';
import { BarChart3, Star, X } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { analyticsData, adminPerformance } from '../../data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

type PeriodType = 'this-week' | 'last-week' | 'this-month' | 'last-month';

export function Analytics() {
  const [period, setPeriod] = useState<PeriodType>('this-week');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

  const currentData = analyticsData[period];

  const speedChartData = {
    labels: currentData.labels,
    datasets: [{
      label: 'Response Time (นาที)',
      data: currentData.responseTime,
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  const volumeChartData = {
    labels: currentData.labels,
    datasets: [{
      label: 'เคสที่จัดการ',
      data: currentData.casesHandled,
      backgroundColor: '#14b8a6',
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const handleShowDetail = (name: string) => {
    setSelectedAdmin(name);
    setShowDetailModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-gray-500 mt-1">วิเคราะห์ผลงานทีมและ KPI</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
        >
          <option value="this-week">สัปดาห์นี้</option>
          <option value="last-week">สัปดาห์ที่แล้ว</option>
          <option value="this-month">เดือนนี้</option>
          <option value="last-month">เดือนที่แล้ว</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">ความเร็ว</h3>
          <p className="text-3xl font-bold text-gray-800">{currentData.stats.speed}</p>
          <p className="text-xs text-gray-400 mt-2">ต่อเคส</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">คุณภาพ</h3>
          <p className="text-3xl font-bold text-gray-800">{currentData.stats.quality}</p>
          <p className="text-xs text-gray-400 mt-2">Rating เฉลี่ย</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">ปริมาณ</h3>
          <p className="text-3xl font-bold text-gray-800">{currentData.stats.volume}</p>
          <p className="text-xs text-gray-400 mt-2">ในช่วงเวลาที่เลือก</p>
        </div>
      </div>

      {/* Individual Performance Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Performance รายบุคคล</h2>
          <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="cases">เรียงตาม: จำนวนเคส</option>
            <option value="speed">เรียงตาม: ความเร็ว</option>
            <option value="rating">เรียงตาม: Rating</option>
          </select>
        </div>

        {/* Performance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="pb-3 font-medium">Admin</th>
                <th className="pb-3 font-medium text-center">เคสทั้งหมด</th>
                <th className="pb-3 font-medium text-center">เวลาเฉลี่ย</th>
                <th className="pb-3 font-medium text-center">Rating</th>
                <th className="pb-3 font-medium text-center">Conversion</th>
                <th className="pb-3 font-medium text-center">สถานะ</th>
                <th className="pb-3 font-medium text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminPerformance.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${admin.bgColor} rounded-full flex items-center justify-center`}>
                        <span className={`${admin.textColor} font-semibold`}>{admin.initial}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{admin.name}</p>
                        <p className="text-xs text-gray-400">{admin.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-lg font-bold text-gray-800">{admin.cases}</span>
                    <p className={`text-xs ${admin.caseChange.startsWith('+') ? 'text-green-500' : admin.caseChange.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                      {admin.caseChange}
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`text-lg font-bold ${admin.timeNote ? 'text-blue-600' : 'text-gray-800'}`}>{admin.avgTime}</span>
                    {admin.timeNote && <p className="text-xs text-gray-400">{admin.timeNote}</p>}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg font-bold text-yellow-500">{admin.rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`text-lg font-bold ${parseInt(admin.conversion) >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {admin.conversion}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.status === 'Online' ? 'bg-green-100 text-green-700' :
                      admin.status === 'Away' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleShowDetail(admin.name)}
                      className="px-3 py-1.5 bg-dental-50 text-dental-700 text-xs rounded-lg hover:bg-dental-100"
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
              {/* AI Row */}
              <tr className="hover:bg-gray-50 transition-colors bg-blue-50/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">AI Chatbot</p>
                      <p className="text-xs text-blue-500">Automated</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="text-lg font-bold text-blue-600">892</span>
                  <p className="text-xs text-green-500">+28% จากสัปดาห์ก่อน</p>
                </td>
                <td className="py-4 text-center">
                  <span className="text-lg font-bold text-blue-600">0.3 นาที</span>
                  <p className="text-xs text-gray-400">ทันที</p>
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-yellow-500">4.6</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="text-lg font-bold text-blue-600">65%</span>
                </td>
                <td className="py-4 text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Active 24/7</span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleShowDetail('AI')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100"
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Charts</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <Line data={speedChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'เวลาตอบกลับเฉลี่ย' } } }} />
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <Bar data={volumeChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'จำนวนเคสที่จัดการ' } } }} />
          </div>
        </div>
      </div>

      {/* Admin Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-dental-50">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAdmin === 'AI' ? 'รายละเอียด AI Chatbot' : `รายละเอียด ${selectedAdmin}`}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5">
              {selectedAdmin === 'AI' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">🤖</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">AI Chatbot</p>
                      <p className="text-sm text-blue-600">Automated Response System</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">892</p>
                      <p className="text-xs text-gray-500">เคสที่จัดการ</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">65%</p>
                      <p className="text-xs text-gray-500">อัตรา Conversion</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-600">0.3 นาที</p>
                      <p className="text-xs text-gray-500">เวลาตอบเฉลี่ย</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-yellow-600">4.6</p>
                      <p className="text-xs text-gray-500">Rating เฉลี่ย</p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm font-medium text-green-800 mb-2">สถิติเด่น</p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• ตอบกลับทันทีตลอด 24 ชั่วโมง</li>
                      <li>• จัดการเคสได้มากกว่า Admin รวมกัน 2.6 เท่า</li>
                      <li>• ลดภาระงาน Admin ได้ 73%</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-dental-50 rounded-xl">
                    <div className="w-16 h-16 bg-dental-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{selectedAdmin?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{selectedAdmin}</p>
                      <p className="text-sm text-dental-600">Admin Level 2</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-gray-800">127</p>
                      <p className="text-xs text-gray-500">เคสสัปดาห์นี้</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">78%</p>
                      <p className="text-xs text-gray-500">อัตรา Conversion</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">1.8 นาที</p>
                      <p className="text-xs text-gray-500">เวลาตอบเฉลี่ย</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-yellow-600">4.9</p>
                      <p className="text-xs text-gray-500">Rating เฉลี่ย</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-medium text-blue-800 mb-2">บริการที่ถนัด</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">จัดฟัน</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">ฟอกสีฟัน</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">วีเนียร์</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2.5 bg-dental-500 text-white rounded-xl font-medium hover:bg-dental-600"
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
