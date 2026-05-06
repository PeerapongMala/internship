import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/style.css';
const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Reset game state when returning to menu

    // Set a timer to hide the loading text after 1 second
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const handleStartClick = async () => {
    navigate('/game', {});
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 p-8">
      <img
        src="/image/Game_Logo.png"
        alt="Last wars game logo"
        className="w-350px h-350px animate-scale mb-8 object-center"
      />
      {/* Title Section */}
      <section
        className="custom-section position-relative mb-8 flex flex-col items-center justify-center text-center"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {showLoading ? (
          <div className="text-20 text-white-500 font-Digitalt digitalt-font absolute object-center tracking-wide opacity-35 drop-shadow-md">
            LOADING...
          </div>
        ) : (
          <button
            onClick={handleStartClick}
            className="transition duration-300 hover:scale-110"
            style={{
              // background: "transparent",
              border: 'none',
            }}
          >
            <img
              src="/image/play_btn.png"
              alt="Last wars game logo"
              className="w-150px h-150px object-center"
            />
          </button>
        )}
      </section>
    </div>
  );
};

export default StartPage;
