import React from "react";
import { Route, Routes } from "react-router-dom";
import StartPage from "./src/context/startPage";
import GamePage from "./src/context/gamePage";

const App = () => {
  window.entities = [];
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/:parameter" element={<StartPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
};

export default App;
