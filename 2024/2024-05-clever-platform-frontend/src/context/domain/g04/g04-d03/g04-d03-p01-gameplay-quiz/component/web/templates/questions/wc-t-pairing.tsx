import {
  answerProps,
  GameConfig,
  HandleChange,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import { useEffect, useState } from 'react';
import Template3C from '../wc-t-template-3-component';

const QuestionPairing = ({
  handleZoom,
  handleHint,
  handleGroup,
  gameConfig,
  setGameConfig,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  handleGroup: (groupIndex: number) => void;
  gameConfig: GameConfig;
  setGameConfig: (gameConfig: GameConfig) => void;
}) => {
  // const [newConfig, setNewConfig] = useState<GameConfig>({});
  const [dragging, setDragging] = useState(false);

  const handleChange: HandleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (false) {
    } else {
      switch (key) {
        case 'answerDragged':
          setDragging(true);
          // const index = parseInt(value);
          // const newAnswerList = newConfig.answerList?.map((item) => {
          //   return {
          //     ...item,
          //     // disabled: item.index === index,
          //   };
          // });
          // const findAnswer = newAnswerList?.find((item) => item.index === index);
          // if (findAnswer) {
          //   setSelectedAnswer(findAnswer);
          // }
          // setNewConfig({ ...newConfig, answerList: newAnswerList });

          // const element = document.getElementById(`answer-${value}`);
          // if (element) {
          //   setCurrentElement(element);
          // }

          break;
        case 'answerDrop':
          console.log('answerDrop');

          setDragging(false);
          break;
        case 'answerDropGroup':
          setDragging(false);
          // answerDropGroup 0_3
          const groupIndex = parseInt(value.split('_')[0]);
          const answerIdOfArray = parseInt(value.split('_')[1]);

          const findGroup = gameConfig.groupList?.find(
            (item) => item.index === groupIndex,
          );
          const findAnswerInGroup = gameConfig.answerList?.find(
            (answer) => answer.id === answerIdOfArray,
          );

          console.log('findGroup', findGroup);
          console.log('findAnswerInGroup', findAnswerInGroup);

          if (findGroup && findAnswerInGroup) {
            const newGroupDetailList = findGroup.groupDetails;
            if (!newGroupDetailList.includes(findAnswerInGroup.choice || '')) {
              newGroupDetailList.push(findAnswerInGroup.choice || '');
            }
            console.log('newGroupDetailList', newGroupDetailList);

            const filteredGroupDetailList = newGroupDetailList.filter(
              (detail) => detail.trim() !== '',
            );
            const newGroupList = gameConfig.groupList?.map((item) => {
              if (item.index === groupIndex) {
                return {
                  ...item,
                  groupDetails: filteredGroupDetailList,
                };
              }
              return item;
            });

            console.log('newGroupList', newGroupList);

            if (!gameConfig.canReuseChoice) {
              const choiceInUse = newGroupList?.map((group) => group.groupDetails).flat();
              const newAnswerList = gameConfig.answerList?.map((item) => {
                return {
                  ...item,
                  disabled: choiceInUse?.includes(item.choice ?? ''),
                  selected: choiceInUse?.includes(item.choice ?? ''),
                };
              });

              setGameConfig({
                ...gameConfig,
                groupList: newGroupList,
                answerList: newAnswerList,
              });
            } else {
              setGameConfig({ ...gameConfig, groupList: newGroupList });
            }
            // setSelectedAnswer({ index: 0, choice: '', answer: '' });
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

  return (
    <Template3C
      gameConfig={gameConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      handleChange={handleChange}
      handleTouchEnd={handleTouchEnd}
      // currentElementDraging={currentElement}
      handleGroup={handleGroup}
      dragging={dragging}
    />
  );
};

const handleUnSelect = (
  groupIndex: number,
  answerIndex: number,
  gameConfig: GameConfig,
  setGameConfig: (gameConfig: GameConfig) => void,
) => {
  const findGroup = gameConfig.groupList?.find((item) => item.index === groupIndex);
  const findAnswer = gameConfig.answerList?.find((item) => item.index === answerIndex);

  if (findGroup && findAnswer) {
    console.log('handleUnSelect', findGroup, findAnswer);
    const newGroupDetailList = findGroup.groupDetails?.filter(
      (detail) => detail !== findAnswer.choice,
    );
    const newGroupList = gameConfig.groupList?.map((item) => {
      if (item.index === groupIndex) {
        return {
          ...item,
          groupDetails: newGroupDetailList,
        };
      }
      return item;
    });

    if (!gameConfig.canReuseChoice) {
      const newAnswerList = gameConfig.answerList?.map((item) => {
        if (item.index === answerIndex) {
          return {
            ...item,
            disabled: false,
          };
        }
        return item;
      });

      console.log('newAnswerList', newAnswerList);

      setGameConfig({
        ...gameConfig,
        groupList: newGroupList,
        answerList: newAnswerList,
      });
    } else {
      setGameConfig({
        ...gameConfig,
        groupList: newGroupList,
      });
    }
  }
};

export { handleUnSelect };

export default QuestionPairing;
