import React, { useState, useEffect } from "react";

const ExpBar = ({ gameManager }) => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);

  useEffect(() => {
    // ฟังสัญญาณเมื่อ Exp เพิ่มขึ้น
    const handleExpIncreased = (newExp) => {
      setExp(newExp);
    };

    // ฟังสัญญาณเมื่อเลเวลอัพ
    const handleLevelIncreased = (newLevel) => {
      setLevel(newLevel);
      setExp(0); // รีเซ็ต Exp
      setExpToNextLevel(100 + 10 * newLevel); // กำหนด Exp ที่ต้องการสำหรับเลเวลถัดไป
    };

    gameManager.expIncreased.add(handleExpIncreased);
    gameManager.levelIncreased.add(handleLevelIncreased);

    // ทำความสะอาดเมื่อคอมโพเนนท์ถูกทำลาย
    return () => {
      gameManager.expIncreased.remove(handleExpIncreased);
      gameManager.levelIncreased.remove(handleLevelIncreased);
    };
  }, [gameManager]);

  const expPercentage = (exp / expToNextLevel) * 100;

  return (
    <div
      style={{
        border: "1px solid #000",
        width: "300px",
        height: "30px",
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        style={{
          backgroundColor: "#4caf50",
          width: `${expPercentage}%`,
          height: "100%",
          transition: "width 0.3s",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
        }}
      >
        Level {level}
      </span>
    </div>
  );
};

export default ExpBar;
