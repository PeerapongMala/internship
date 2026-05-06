import {
  answerProps,
  GameConfig,
  HandleChange,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import Template2C from '../wc-t-template-2-component';
import { useEffect, useState } from 'react';

const QuestionMultipleChoices = ({
  handleZoom,
  handleHint,
  gameConfig,
  setSelectedAnswer,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  setSelectedAnswer: (answer: answerProps) => void;
}) => {
  const [newConfig, setNewConfig] = useState(gameConfig);

  const handleChange: HandleChange = (key: string, value: string) => {
    if (false) {
    } else {
      switch (key) {
        case 'answerSelected':
          const index = parseInt(value);
          const newAnswerList = newConfig.answerList?.map((item) => {
            return {
              ...item,
              // disabled: item.index === index,
              selected: item.index === index,
            };
          });
          const findAnswer = newAnswerList?.find((item) => item.index === index);
          if (findAnswer) {
            setSelectedAnswer(findAnswer);
          } else {
            setSelectedAnswer({ id: -1, index: -1, answer: '' });
          }
          setNewConfig({ ...newConfig, answerList: newAnswerList });
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setNewConfig(gameConfig);
  }, [gameConfig]);

  return (
    <Template2C
      gameConfig={newConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      handleChange={handleChange}
      draggable={false}
    />
  );
};

export default QuestionMultipleChoices;
