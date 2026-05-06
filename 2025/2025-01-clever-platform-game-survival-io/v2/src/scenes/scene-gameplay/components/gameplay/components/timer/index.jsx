import React, { useState, useEffect } from 'react';

const Timer = ({ gameManager }) => {
  const [time, setTime] = useState('00:00');

  const gameEndHandler = (result) => {
    if (result === 'win') {
      console.log('Game Won! You survived for 15 minutes!');
      window.GameManager.gameOver = true;
    }
  };

  const timeUpdateHandler = (formattedTime) => {
    setTime(formattedTime);
  };

  useEffect(() => {
    gameManager.gameEndSignal.add(gameEndHandler);
    gameManager.timeUpdateSignal.add(timeUpdateHandler);

    return () => {
      gameManager.gameEndSignal.remove(gameEndHandler);
      gameManager.timeUpdateSignal.remove(timeUpdateHandler);
    };
  }, [gameManager]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '50%',
        transform: 'translateX(50%)',
        padding: '10px',
        color: 'white',
        borderRadius: '5px',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      {time}
    </div>
  );
};

export default Timer;
