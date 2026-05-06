import React from 'react';

// กำหนดประเภทของ props สำหรับ DebugOverlay
interface DebugOverlayProps {
  debugInfo: { [key: string]: any }; // ข้อมูล debug ที่จะถูกแสดง
}

// คอมโพเนนต์ DebugOverlay สำหรับแสดงข้อมูล debug บนหน้าจอ
const DebugOverlay: React.FC<DebugOverlayProps> = ({ debugInfo }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '100px', 
      left: '10px', 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      color: 'white',
      padding: '10px', 
      borderRadius: '5px', 
      zIndex: 1000 
    }}>
      {/* แสดงข้อมูล debug โดยการวนลูปผ่าน key แต่ละตัว */}
      {Object.keys(debugInfo).map((key) => (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(debugInfo[key])}
        </div>
      ))}
    </div>
  );
};

export default DebugOverlay;