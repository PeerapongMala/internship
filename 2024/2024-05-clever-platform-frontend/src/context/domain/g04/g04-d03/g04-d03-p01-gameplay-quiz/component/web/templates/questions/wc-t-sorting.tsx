import {
  answerProps,
  GameConfig,
  HandleChange,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import { useEffect, useState } from 'react';
import Template3C from '../wc-t-template-3-component';

const QuestionSorting = ({
  handleZoom,
  handleHint,
  gameConfig,
  setOrderIndex,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  setOrderIndex: (orderIndex: number[]) => void;
}) => {
  const [newConfig, setNewConfig] = useState(gameConfig);
  const [selectedAnswer, setSelectedAnswer] = useState<answerProps>({
    id: -1,
    index: 0,
    choice: '',
    answer: '',
  });
  const [answerListSort, setAnswerListSort] = useState<answerProps[]>([]);

  const handleChange: HandleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (false) {
    } else {
      switch (key) {
        case 'answerDragged':
          const index = parseInt(value);
          const newAnswerList = newConfig.answerList?.map((item) => {
            return {
              ...item,
              // disabled: item.index === index,
            };
          });
          const findAnswer = newAnswerList?.find((item) => item.index === index);
          if (findAnswer) {
            setSelectedAnswer(findAnswer);
          }
          setNewConfig({ ...newConfig, answerList: newAnswerList });
          break;
        case 'orderIndex':
          const orderIndex = value.split(',').map((item) => parseInt(item));
          setOrderIndex(orderIndex);

          if (!gameConfig.canReuseChoice) {
            const newAnswerList = gameConfig.answerList?.map((item, index) => {
              return {
                ...item,
                disabled: orderIndex.includes(item.index),
              };
            });
            setNewConfig({
              ...newConfig,
              answerList: newAnswerList,
            });
          }
          break;
        default:
          break;
      }
    }
  };

  const handleTouchEnd = (position: { x: number; y: number }) => {
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: position.x,
      clientY: position.y,
    });
    const element = document.elementFromPoint(position.x, position.y);
    if (element) {
      element.dispatchEvent(event);
    }
  };

  useEffect(() => {
    const newAnswerList = gameConfig.answerList
      ?.sort(() => Math.random() - 0.5)
      .map((item, index) => {
        return {
          ...item,
          // choice: String.fromCharCode(65 + index),
        };
      });
    const newGroupList = gameConfig.groupList?.map((item, index) => {
      return {
        ...item,
        index,
        groupDetails: [],
      };
    });
    setNewConfig({ ...gameConfig, answerList: newAnswerList, groupList: newGroupList });
    // const newAnswerListSort = newAnswerList?.filter((item) => item.index !== 1 && item.index !== 2);
    // setAnswerListSort(newAnswerListSort || []);
  }, [gameConfig]);

  return (
    <Template3C
      gameConfig={newConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      handleChange={handleChange}
      handleTouchEnd={handleTouchEnd}
      answerListSort={answerListSort}
    />
  );
};

export default QuestionSorting;
