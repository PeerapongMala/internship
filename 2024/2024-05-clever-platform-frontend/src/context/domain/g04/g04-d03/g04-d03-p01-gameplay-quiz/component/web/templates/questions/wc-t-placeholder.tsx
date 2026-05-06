import {
  answerProps,
  GameConfig,
  HandleChange,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import Template2C from '../wc-t-template-2-component';
import { useEffect, useState } from 'react';

const QuestionPlaceholder = ({
  handleZoom,
  handleHint,
  gameConfig,
  setGameConfig,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  setGameConfig?: (gameConfig: GameConfig) => void;
}) => {
  const handleChange: HandleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (false) {
    } else {
      switch (key) {
        case 'answerDropGroup':
          const [questionIndex, answerIndex, answerSelectedId] = value.split('_');
          const questionIndexInt = parseInt(questionIndex);
          const answerIndexInt = parseInt(answerIndex);
          const answerSelectedIdInt = parseInt(answerSelectedId);

          const newQuestionList = [...(gameConfig.questionList || [])];
          const findQuestion = newQuestionList?.find(
            (question) => question.index === questionIndexInt,
          );

          if (findQuestion) {
            const findAnswer = findQuestion.answers?.find(
              (answer) => answer.index === answerIndexInt,
            );

            if (findAnswer) {
              const findAnswerSelected = gameConfig.answerList?.find(
                (answer) => answer.id === answerSelectedIdInt,
              );

              if (findAnswerSelected) {
                findAnswer.answerInput = findAnswerSelected.id.toString();
                const choiceInUse = newQuestionList
                  ?.map((question) =>
                    question.answers?.map((answer) => answer.answerInput),
                  )
                  .flat();
                let newAnswerList = gameConfig.answerList?.map((item) => {
                  return {
                    ...item,
                    selected: choiceInUse?.includes(item.id.toString()),
                    disabled: !gameConfig.canReuseChoice && choiceInUse?.includes(item.id.toString()),
                  };
                });

                setGameConfig?.({
                  ...gameConfig,
                  questionList: newQuestionList,
                  answerList: newAnswerList,
                });
              }
            }
          }
          break;
        default:
          break;
      }
    }
  };
  return (
    <Template2C
      gameConfig={gameConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      handleChange={handleChange}
    />
  );
};

export default QuestionPlaceholder;
