import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";

const GameSummary: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const { gameCurrentScore, gameTotalTimeUsed } = useGameStore();
  useEffect(() => {
    setError(""); // เคลียร์ error ทุกครั้งที่ playerName เปลี่ยน
  }, [playerName]);

  const handleStartClick = async () => {
    navigate("/", {});
  };

  // later in your animation loop or update function:
  let elapsedMs = performance.now() - gameTotalTimeUsed;

  // Convert to total seconds
  let totalSeconds = Math.floor(elapsedMs / 1000);

  // Get minutes and seconds
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Pad with zeros
  let timeFormatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div style={{ position: "relative" }}>
        <img
          src={"/image/result.png"}
          alt="Last wars game logo"
          className="w-600px h-600px object-center mb-8"
        />
        <a href="#" onClick={handleStartClick}>
          <img
            src={"/image/return_btn.png"}
            alt="Return button"
            className="w-600px h-600px object-center mb-8"
            style={{
              position: "absolute",
              top: "85%", // Adjust as needed
              left: "50%", // Adjust as needed
              transform: "translate(-50%, -50%)", // Center the image
            }}
          />
        </a>

        {/*Score DISPLAY*/}
        <span
          style={{
            position: "absolute",
            top: "45%", // Adjust as needed
            left: "50%",
            transform: "translateX(-50%)",
            color: "#60CFFF", // Adjust text color as needed
          }}
          className="font-Digitalt digitalt-font"
        >
          <img
            src={"/image/finalScore_Tag.png"}
            alt="Last wars game logo"
            className="w-600px h-600px object-center mb-8 scale-53"
          />
        </span>
        <span
          style={{
            position: "absolute",
            top: "38%", // Adjust as needed
            left: "50%",
            transform: "translateX(-50%)",
            color: "#60CFFF", // Adjust text color as needed
            fontSize: "2.5rem", // Adjust font size as needed
            textAlign: "center", // Adjust text alignment as needed
          }}
          className="font-Digitalt digitalt-font"
        >
          SCORE
        </span>
        <span
          style={{
            position: "absolute",
            top: "45%", // Adjust as needed
            left: "50%",
            transform: "translateX(-50%)",
            color: "#228AED", // Adjust text color as needed
            fontSize: "3rem", // Adjust font size as needed
            textAlign: "center", // Adjust text alignment as needed
          }}
          className="font-Digitalt digitalt-font"
        >
          {gameCurrentScore}
        </span>

        {/*TIME DISPLAY*/}
        <span
          style={{
            position: "absolute",
            top: "58%", // Adjust as needed
            left: "50%",
            transform: "translateX(-50%)",
            color: "#60CFFF", // Adjust text color as needed
            fontSize: "2.5rem", // Adjust font size as needed
            textAlign: "center", // Adjust text alignment as needed
          }}
          className="font-Digitalt digitalt-font"
        >
          TIME
        </span>
        <span
          style={{
            position: "absolute",
            top: "63%", // Adjust as needed
            left: "50%",
            transform: "translateX(-50%)",
            color: "#228AED", // Adjust text color as needed
            fontSize: "3rem", // Adjust font size as needed
            textAlign: "center", // Adjust text alignment as needed
          }}
          className="font-Digitalt digitalt-font"
        >
          {timeFormatted}
        </span>
      </div>

      {/* ... existing code */}
    </div>
  );
};

// Include the CSS code here
const styles = `
  /* Style for the GAME OVER title */
  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0; /* Adjust the height as needed */
  }
  .title {
    font-size: 6rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.83);
  }

  /* Style for the Your Score text */
  .score {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 1rem;
      color: white;

  }

  /* Style for the Time used text */
  .label {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 0.5rem;
    color: white;
  }
`;

// Apply the CSS styles to the component
const StyledGameSummary = () => (
  <div>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <GameSummary />
  </div>
);

export default StyledGameSummary;
