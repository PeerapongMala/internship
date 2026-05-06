import React, { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import "./style/index.css";
import {
  AutherizeArcadeSession,
  SendGameSessionInfo,
} from "../../Utilities/ArcadeGameAPI";

const StartPage = () => {
  const navigate = useNavigate();
  const [ArcadeConfig, setArcadeConfig] = useState(null);
  const { parameter } = useParams();

  useEffect(() => {
    const AracdeToken = parameter?.split("&Token=")[0];
    const LoginToken = parameter?.split("&Token=")[1];
    AutherizeArcadeSession(AracdeToken, LoginToken)
      .then((response) => {
        setArcadeConfig(response);
      })
      .then(() => {
        /*
        SendGameSessionInfo(80, 60).then((response) => {
          console.log(response);
        });*/
      });
  }, []);

  const handleStart = () => {
    navigate("/game");
  };

  return (
    <div className="start-page">
      {ArcadeConfig && ArcadeConfig !== "NO ACCESS" ? (
        <>
          <h1>SURVIVOR.IO</h1>
          <img
            src="image/Survivor-IO-codes.jpg"
            alt="Survivor IO"
            className="start-image"
          />
          <button onClick={handleStart}>START</button>
        </>
      ) : (
        <p>NO ACCESS</p>
      )}
    </div>
  );
};

export default StartPage;
