import {
  AnswerPlaceholderProps,
  answerProps,
  GameConfig,
  HandleChange,
  QuestionListProps,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import Template1C from '../wc-t-template-1-component';
import { useEffect, useState } from 'react';

const QuestionInput = ({
  handleZoom,
  handleHint,
  gameConfig,
  handleShowInput,
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  handleShowInput: (question: QuestionListProps, answer: AnswerPlaceholderProps) => void;
}) => {
  const handleChange: HandleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (false) {
    } else {
      switch (key) {
        case 'answerInputClick':
          // value = `${item.questionIndex}_${question.index}
          const [questionIndex, answerIndex] = value.split('_');
          const findQuestion = gameConfig.questionList?.find(
            (item) => item.index === parseInt(questionIndex),
          );
          if (findQuestion) {
            const findAnswer = findQuestion.answers?.find(
              (item) => item.index === parseInt(answerIndex),
            );
            if (findAnswer) {
              handleShowInput(findQuestion, findAnswer);
            }
          }

          break;
        default:
          break;
      }
    }
  };
  return (
    <Template1C
      gameConfig={gameConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      handleChange={handleChange}
    />
  );
};

export default QuestionInput;
