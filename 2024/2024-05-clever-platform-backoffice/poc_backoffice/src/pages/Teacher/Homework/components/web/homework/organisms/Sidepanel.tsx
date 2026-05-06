import React from 'react';

interface SidePanelProps {

  time: string;
  byAdmin: string;
  onClick: () => void;
}


const SidePanel: React.FC<SidePanelProps> = ({ time, byAdmin ,onClick}) => {
  return (
    <div className='w-[25%] max-h-[250px] bg-white rounded-lg p-3 shadow-md'>
      <div className='flex items-center mb-3'>
        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">รหัส</label>
        <p className="w-full"></p>
      </div>
      <div className='flex items-center mb-3'>
        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">สถานะ</label>
        <select className='border w-full rounded-lg py-2'>
          <option value="">ใช้งาน</option>
          <option value="">ไม่ใช้งาน</option>
        </select>
      </div>
      <div className='flex items-center mb-3'>
        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขล่าสุด</label>
        <p className="w-full">{time}</p>
      </div>
      <div className='flex items-center mb-3'>
        <label className="block text-gray-700 text-sm font-bold mb-2 w-[50%]">แก้ไขโดย</label>
        <p className="w-full">{byAdmin}</p>
      </div>
      <div className='mt-5'>
        <button className='w-full bg-primary py-2 text-white font-bold shadow-2xl rounded-md' onClick={() => alert("Click")}>บันทึก</button>
      </div>
    </div>
  );
};



export default SidePanel;