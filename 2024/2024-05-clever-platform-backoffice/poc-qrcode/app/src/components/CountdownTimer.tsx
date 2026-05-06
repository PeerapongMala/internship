import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  expiresAt: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiresAt) - +new Date(); // Calculate time difference in milliseconds
    let timeLeft = {
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval when component unmounts
    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div>
      {timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
        <span>Expired</span>
      ) : (
        <span>
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;
