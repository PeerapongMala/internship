import {
  answerProps,
  GameConfig,
  QuestionSubmitData,
  QuestionSubmitDataDetail,
} from '../type';

const SubmitOnMultipleChoices = ({
  gameConfig,
  answer,
  timer,
}: {
  gameConfig: GameConfig;
  answer: answerProps | undefined;
  timer: number;
}) => {
  console.log('submit gameConfig', gameConfig);
  console.log('submit answer', answer);
  console.log('submit timer', timer);

  const answerFromUserText = answer?.choice ? answer.choice + '.' : '-';

  const answerIsCorrectList = gameConfig.answerList?.filter((item) => item.isCorrect);
  const answerIsCorrectText =
    answerIsCorrectList?.map((item) => item.choice).join(', ') + '.';

  const data: QuestionSubmitDataDetail[] = [];

  if (answer && answer.id !== -1) {
    if (gameConfig.answerType === 'text-speech' || gameConfig.answerType === 'speech') {
      data.push({
        question_multiple_choice_text_choice_id: answer.id,
      });
    } else if (gameConfig.answerType === 'image') {
      data[0] = {
        question_multiple_choice_image_choice_id: answer.id,
      };
    }
  }

  const answerObject: QuestionSubmitData = {
    question_id: gameConfig.questionId,
    question_type: gameConfig.questionType as Required<GameConfig>['questionType'],
    is_correct: answer?.isCorrect ? true : false,
    time_used: timer,
    data,
  };

  return {
    answerIsCorrect: answer?.isCorrect ? true : false,
    answerIsCorrectText: answerIsCorrectText || '',
    answerFromUserText: answerFromUserText || '',
    answerObject,
  };
};

export default SubmitOnMultipleChoices;
