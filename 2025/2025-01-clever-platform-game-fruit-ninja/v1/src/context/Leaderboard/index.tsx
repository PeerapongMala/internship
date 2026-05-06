// // Leaderboard.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Leaderboard.css';
// import { LeaderboardData } from 'core-utility/src/types';
// import LeaderboardLocalStorage from 'core-utility/src/LeaderboardLocalStorage'; // ใช้ Local Storage

// interface LeaderboardProps {
//   latestScore: number;
//   isWin: boolean;
//   latestPlayerName: string;
//   latestCharacter: string;
// }

// const Leaderboard: React.FC<LeaderboardProps> = ({ latestScore, isWin, latestPlayerName, latestCharacter }) => {
//   const navigate = useNavigate();
//   const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
//   const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
//   const leaderboardHandler = new LeaderboardLocalStorage();

//   // ฟังก์ชันสำหรับการนำทางไปยังหน้าเลือกตัวละคร
//   const handleRestart = () => {
//     navigate('/character-selection');
//   };

//   // ฟังก์ชันสำหรับการนำทางไปยังหน้าเริ่มต้น
//   const handleBackToStart = () => {
//     navigate('/');
//   };

//   // ฟังก์ชันสำหรับการรีเซ็ต leaderboard
//   const handleResetLeaderboard = async () => {
//     await leaderboardHandler.resetLeaderboard();
//     const data = await leaderboardHandler.getLeaderboard();
//     setLeaderboard(data);
//   };

//   // useEffect สำหรับการดึงข้อมูล leaderboard และการไฮไลท์สกอร์ล่าสุด
//   useEffect(() => {
//     const fetchData = async () => {
//       // ดึงข้อมูล leaderboard จาก Local Storage
//       const data = await leaderboardHandler.getLeaderboard();
//       console.log('Fetched leaderboard data:', data);

//       // เรียงลำดับข้อมูลจากมากไปน้อยและจัดกลุ่มชื่อที่เหมือนกัน ตัวละครที่เหมือนกัน และคะแนนที่เท่ากันให้อยู่ติดกัน
//       const sortedData = data.sort((a, b) => {
//         if (b.score !== a.score) return b.score - a.score;
//         if (b.name !== a.name) return b.name.localeCompare(a.name);
//         return b.character.localeCompare(a.character);
//       });

//       setLeaderboard(sortedData);

//       // หาตำแหน่งของผู้เล่นที่มีชื่อ, คะแนน, และตัวละครล่าสุดในข้อมูล leaderboard
//       const latestIndex = sortedData.findLastIndex(player => player.score === latestScore && player.name === latestPlayerName && player.character === latestCharacter);
//       setHighlightIndex(latestIndex);
//     };
//     fetchData();
//   }, [latestScore, latestPlayerName, latestCharacter]);

//   return (
//     <div className="leaderboard-overlay">
//       <div className="leaderboard-container">
//         {isWin ? (
//           <div className="win-message">Congratulations! You Win!</div>
//         ) : (
//           <div className="lose-message">Game Over! Try Again!</div>
//         )}
//         <div id="leaderboard">
//           <ul id="leaderboard-list">
//             {leaderboard.map((player, index) => (
//               // ไฮไลท์รายการที่มีข้อมูลตรงกับชื่อ, คะแนน, และตัวละครล่าสุด
//               <li key={index} className={`leaderboard-entry ${index === highlightIndex ? 'highlight' : ''}`}>
//                 <div className="player-index">{index + 1}.</div>
//                 <div className="player-info">{player.name} </div>
//                 <div className="player-character"> - {player.character} </div>
//                 <div className="player-score"> - {player.score} </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button className="btn btn-primary" onClick={handleRestart}>Back to Character Selection</button>
//         <button className="btn btn-secondary" onClick={handleBackToStart}>Back to Start</button>
//         <button className="btn btn-dark" onClick={handleResetLeaderboard}>Reset Leaderboard</button>
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;
