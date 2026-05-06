import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PUBLIC_ASSETS_LOCATION } from "@/assets/public-assets-locations";
import { AvailableCardInfo, CardInfo } from "./available-card";
import { SkillName } from "@/store/skillStore";
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

const UpgradeCards = (
  props: {
    onUpgradeClick: (skill: SkillName) => void;
  } = {
      onUpgradeClick: function (): void {
        throw new Error('Function not implemented.');
      }
    },
) => {
  const [order, setOrder] = useState([0, 1, 2]);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const cards: CardInfo[] = useRef([]).current;
  const getRandomized3Cards = () => {
    if (cards.length === 3) return cards;

    const initialCards = randomNewAvilable3Cards();
    initialCards.forEach((card, index) => {
      cards[index] = card;
    });
    return cards;
  };

  useEffect(() => {
    getRandomized3Cards();
    return () => { cards.splice(0, cards.length); };
  }, []);

  const randomNewAvilable3Cards = () => {
    const itemMaxLevel = 5;
    const avilableCards: CardInfo[] = [];
    Object.entries(AvailableCardInfo).forEach(([_key, card]) => {
      if (card.baseSkillId) {
        // This is for advanced skill cards
        if (AvailableCardInfo[card.baseSkillId].level === itemMaxLevel) {
          const availableCard = AvailableCardInfo[card.skillId];
          availableCard.label = '';
          avilableCards.push(availableCard);
        }
      } else if (AvailableCardInfo[card.skillId].level < itemMaxLevel) {
        // This is for base skill cards
        const availableCard = AvailableCardInfo[card.skillId];
        availableCard.label = '';
        avilableCards.push(availableCard);
      }
    });

    const shuffled = avilableCards.sort(() => 0.5 - Math.random());
    if (shuffled.length < 3) return shuffled;
    else return shuffled.slice(0, 3);
  };

  const rotatePrev = () => {
    setDirection("right");
    setOrder(([a, b, c]) => [c, a, b]);
  };

  const rotateNext = () => {
    setDirection("left");
    setOrder(([a, b, c]) => [b, c, a]);
  };

  const positions = {
    left: {
      scale: 0.9,
      x: -250,
      opacity: 1,
      zIndex: direction === "left" ? 2 : 1,
    },
    center: {
      scale: 1.2,
      x: 0,
      opacity: 1,
      zIndex: 3,
    },
    right: {
      scale: 0.9,
      x: 250,
      opacity: 1,
      zIndex: direction === "right" ? 2 : 1,
    },
    hiddenLeft: { x: -500, opacity: 0, scale: 0.7 },
    hiddenRight: { x: 500, opacity: 0, scale: 0.7 },
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        height: "400px",
      }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          height: "400px",
        }}
      >
        <div style={{ position: "relative", width: 250, height: 400 }}>
          <AnimatePresence initial={false}>
            {order.map((idx, i) => {
              const pos = i === 0 ? "left" : i === 1 ? "center" : "right";
              const cardArray = getRandomized3Cards();
              if (!cardArray || cardArray.length < 3) return null;
              const card = cardArray[idx];
              /// TEST
              // alert(`order.length: ${order.length}, card[${idx}] = ${card.title}`);
              return (
                <motion.div
                  className="animation-idlebutton absolute hover:scale-110"
                  key={`${card.skillId}-${direction}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={positions[pos]}
                  exit={pos === "left" ? positions.hiddenLeft : positions.hiddenRight}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: "absolute",
                    width: 256,
                    height: 346.5,
                    borderRadius: 10,
                    // overflow: "hidden",
                    // backgroundColor: "#222",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                    cursor: "pointer",
                  }}
                  onClick={() => props.onUpgradeClick(card.skillId)}
                  onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
                >
                  <img
                    src={card.bg}
                    alt="bg"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: -1,
                    }}
                  />
                  <h3 className="font-kanit absolute top-4">{card.title}</h3>
                  <img
                    src={card.image}
                    className="absolute w-[100px] items-center justify-center"
                    style={{
                      top: '5%',
                      transform: 'translateY(50%)',
                    }}
                  />
                  <p className="font-kanit text-center text-[14px] absolute top-[60%] px-5">{card.desc}</p>
                  <span
                    style={{
                      fontFamily: "Kanit, sans-serif",
                      fontSize: 24,
                      textAlign: "right",
                      textShadow: "0 0 4px rgba(0, 0, 0, 1)",
                      // backgroundColor: "#ffc823",
                      color: "#ffc823",
                      padding: "0px 8px",
                      // borderRadius: 4,
                      fontWeight: "bold",
                      position: "absolute",
                      top: -15,
                      right: -5,
                    }}
                  >
                    {card.label}
                  </span>
                  <div className="absolute bottom-[15.5px] content-stretch flex gap-[10px] items-center">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-[21px] shrink-0 w-[22px]">
                        {/* <div className="inset-[6.05%_5.15%_4.04%_5.17%]" style={{ "--fill-0": i <= card.level ? "rgba(246, 188, 12, 1)" : "rgba(22, 26, 41, 1)" } as React.CSSProperties}> */}
                        <img
                          className="block max-w-none size-full"
                          src={
                            i < card.level ?
                              PUBLIC_ASSETS_LOCATION.image.special.level.star_active :
                              PUBLIC_ASSETS_LOCATION.image.special.level.star_inactive
                          }
                        />
                        {/* </div> */}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <button
          className="animation-idlebutton absolute hover:scale-110"
          onClick={rotatePrev}
          onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
          style={{
            position: "absolute", left: 0, fontSize: "48px", opacity: 0.5,
            pointerEvents: "auto"
          }}
        >
          <img
            src={PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame}
            style={{ width: 48, height: 48 }}
          />
          {/* <span>{'<'}</span> */}
        </button>

        <button
          className="animation-idlebutton absolute hover:scale-110"
          onClick={rotateNext}
          onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
          style={{
            position: "absolute", right: 0, fontSize: "48px", opacity: 0.5,
            pointerEvents: "auto"
          }}
        >
          <img
            src={PUBLIC_ASSETS_LOCATION.image.special.collection.weaponFrame}
            style={{ width: 48, height: 48 }}
          />
          {/* <span>{'>'}</span> */}
        </button>
      </div>
    </div>
  );
};

export default UpgradeCards;
