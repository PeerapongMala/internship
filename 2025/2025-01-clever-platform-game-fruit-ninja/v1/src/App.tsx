import React from "react";
import { Route, Routes } from "react-router-dom";
import StartPage from "./context/StartPage";
//import GamePage from './components/GamePage';
import GamePage from "./context/GamePage";
import GameSummary from "./context/GameSummary";

// คอมโพเนนต์หลักของแอปพลิเคชัน
const App: React.FC = () => {
  return (
    <Routes>
      {/* กำหนดเส้นทางของแต่ละหน้า */}
      <Route path="/" element={<StartPage />} />{" "}
      {/* เส้นทางสำหรับหน้าเลือกตัวละคร */}
      <Route path="/game" element={<GamePage />} /> {/* เส้นทางสำหรับหน้าเกม */}
      {/* Game Post summary */}
      <Route path="/gamesummary" element={<GameSummary />} />{" "}
    </Routes>
  );
};

export default App;
