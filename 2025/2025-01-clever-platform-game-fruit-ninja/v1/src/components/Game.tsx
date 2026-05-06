// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// //import LeaderboardLocalStorage from 'core-utility/src/LeaderboardLocalStorage'; 

// const StartPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [playerName, setPlayerName] = useState('');
//   const [error, setError] = useState('');
//   const leaderboardHandler = new LeaderboardLocalStorage();

//   useEffect(() => {
//     setError(''); // เคลียร์ error ทุกครั้งที่ playerName เปลี่ยน
//   }, [playerName]);

//   const handleStartClick = async () => {
//     if (playerName.trim() === '') {
//       setError('Please enter a valid name.');
//     } else if (await leaderboardHandler.isNameDuplicate(playerName)) { // เช็คชื่อที่ซ้ำกันจาก Local Storage
//       setError('This name is already taken. Please choose a different name.');
//     } else {
//       localStorage.setItem('playerName', playerName); // บันทึกชื่อใน Local Storage
//       navigate('/character-selection', { state: { playerName } });
//     }
//   };

//   return (
//     <div className="start-page">
//       <div className="title-container">
//         <h1 className="title">DooDleJump 3D</h1>
//       </div>
//       <div className="input-container">
//         <input 
//           type="text" 
//           placeholder="Enter your name" 
//           value={playerName} 
//           onChange={(e) => setPlayerName(e.target.value)} 
//           maxLength={10} 
//         />
//         {error && <p className="error">{error}</p>}
//       </div>
//       <div className="button-container text-center">
//         <button className="btn-custom" onClick={handleStartClick}>
//           <i className="fas fa-play"></i> Start Game
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StartPage;