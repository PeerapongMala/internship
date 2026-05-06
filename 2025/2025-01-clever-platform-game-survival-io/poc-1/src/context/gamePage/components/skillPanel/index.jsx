import React, { useState, useEffect } from "react";
import "./style/index.css";
import { useSkillStore } from "../../../../store/skillStore";
import { useGameStore } from "../../../../store/gameStore";

function SkillPanel({ isVisible, onClose }) {
  const {
    currentFireballLevel,
    currentIceBallLevel,
    currentRPGLevel,
    currentDroneLevel,
    currentMolotovLevel,
    setMolotovLevel,
    setFireballLevel,
    setIceBallLevel,
    setRPGLevel,
    setDroneLevel,
  } = useSkillStore();

  const { closeSkillPanel } = useGameStore();

  const handleUpgradeClick = (skill) => {
    switch (skill) {
      case "iceball":
        if (currentIceBallLevel == 0) {
          window.createIceball();
        }
        setIceBallLevel(currentIceBallLevel + 1);

        break;
      case "rpg":
        setRPGLevel(currentRPGLevel + 1);
        break;
      case "fireball":
        setFireballLevel(currentFireballLevel + 1);
        break;
      case "drone":
        if (currentDroneLevel == 0) {
          window.createDrone();
        }
        setDroneLevel(currentDroneLevel + 1);
        break;
      case "molotov":
        setMolotovLevel(currentMolotovLevel + 1);

        break;
      default:
        break;
    }
    closeSkillPanel();
  };

  useEffect(() => {
    /*
    if (isVisible) {
      console.log("SkillPanel is visible, pausing game.");
      //window.GameManager.pauseGame();
      closeSkillPanel();
    } else {
      console.log("SkillPanel is not visible, resuming game.");
      //window.GameManager.resumeGame();
      closeSkillPanel();
    }*/
  }, [isVisible]);

  if (!isVisible) return null; // ไม่แสดง panel ถ้าไม่เปิดอยู่

  return (
    <div className="panel">
      <img src="image/image (1).png" alt="Header" className="panel-header" />
      <div className="header-choice">SKILL CHOICE</div>
      <div className="image-row">
        <div className="image-column">
          <div className="text-first">FIREBALL</div>
          <img src="image/4.png" alt="Image 1" className="grid-image" />
          <img src="image/7047925.png" alt="Image 1" className="icon-first" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-upf">Lv {currentFireballLevel}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptionf"
            onClick={() => handleUpgradeClick("fireball")}
          />
        </div>
        <div className="image-column">
          <div className="text-first">ICEBALL</div>
          <img src="image/4.png" alt="Image 2" className="grid-image" />
          <img src="image/shuriken.png" alt="Image 1" className="icon-first" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-upf">Lv {currentIceBallLevel}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptionf"
            onClick={() => handleUpgradeClick("iceball")}
          />
        </div>
        <div className="image-column">
          <div className="text-first">DRONE</div>
          <img src="image/4.png" alt="Image 3" className="grid-image" />
          <img src="image/drone.png" alt="Image 1" className="icon-first" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-upf">Lv {0}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptionf"
            onClick={() => handleUpgradeClick("drone")}
          />
        </div>
      </div>
      <div className="image-row second-row">
        <div className="image-column">
          <div className="text-second">RPG</div>
          <img src="image/4.png" alt="Image 4" className="grid-image" />
          <img src="image/RPG.png" alt="Image 1" className="icon-Second" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-ups">Lv {currentRPGLevel}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptions"
            onClick={() => handleUpgradeClick("rpg")}
          />
        </div>
        <div className="image-column">
          <div className="text-second">MOLOTOV</div>
          <img src="image/4.png" alt="Image 5" className="grid-image" />
          <img src="image/molotov.png" alt="Image 1" className="icon-Second" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-ups">Lv {currentMolotovLevel}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptions"
            onClick={() => handleUpgradeClick("molotov")}
          />
        </div>
        <div className="image-column">
          <div className="text-second">LASER</div>
          <img src="image/4.png" alt="Image 6" className="grid-image" />
          <img src="image/Laser.png" alt="Image 1" className="icon-Second" />
          <div className="des-first">DESCRIPTION</div>
          <div className="lv-ups">Lv {0}</div>
          <img
            src="image/Upgrade.png"
            alt="Upgrade"
            className="icon-descriptions"
            onClick={() => handleUpgradeClick("laser")}
          />
        </div>
      </div>
    </div>
  );
}

export default SkillPanel;
