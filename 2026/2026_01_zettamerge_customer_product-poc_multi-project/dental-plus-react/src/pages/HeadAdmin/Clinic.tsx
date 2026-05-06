import { Building2 } from 'lucide-react';

export function Clinic() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-dental-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-dental-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clinic Management</h1>
          <p className="text-sm text-gray-500">จัดการคลินิก</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500">Clinic Management content will be implemented in Phase 2</p>
      </div>
    </div>
  );
}
