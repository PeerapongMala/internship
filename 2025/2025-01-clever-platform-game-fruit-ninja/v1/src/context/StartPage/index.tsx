import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../css/style.css";
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
    navigate("/game", {});
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 gap-8">
      <img
        src="/image/Game_Logo.png"
        alt="Last wars game logo"
        className="w-350px h-350px object-center mb-8 animate-scale"
      />
      {/* Title Section */}
      <section
        className="flex flex-col items-center justify-center text-center mb-8 custom-section mb-8 position-relative"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {showLoading ? (
          <div className="absolute text-20 text-white-500 font-Digitalt tracking-wide drop-shadow-md digitalt-font opacity-35 object-center">
            LOADING...
          </div>
        ) : (
          <button
            onClick={handleStartClick}
            className="hover:scale-110 transition duration-300"
            style={{
              // background: "transparent",
              border: "none",
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
