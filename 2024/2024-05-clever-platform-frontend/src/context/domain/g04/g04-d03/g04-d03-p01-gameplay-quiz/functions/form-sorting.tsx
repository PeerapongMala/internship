import {
  answerProps,
  GameConfig,
  QuestionSubmitData,
  QuestionSubmitDataDetail,
} from '../type';

const SubmitOnSorting = ({
  gameConfig,
  timer,
  orderIndex,
}: {
  gameConfig: GameConfig;
  timer: number;
  orderIndex: number[];
}) => {
  console.log('gameConfig', gameConfig);
  console.log('timer', timer);

  let answerIsCorrect = true;
  let answerIsCorrectText = '';
  let answerFromUserText = '';

  const answerList = generateAnswerList(gameConfig.answerList);
  const answerListFromUser = generateAnswerListFromUser(
    gameConfig.answerList,
    orderIndex,
  );

  // compare answerList and answerListFromUser
  answerList.forEach((item, index) => {
    if (item !== answerListFromUser[index]) {
      answerIsCorrect = false;
    }
  });

  // generate answerIsCorrectText
  answerList.forEach((item, index) => {
    answerIsCorrectText += `${item} `;
  });

  answerListFromUser.forEach((item, index) => {
    answerFromUserText += `${item} `;
  });

  console.log('answerList', answerList);
  console.log('answerListFromUser', answerListFromUser);

  console.log('answerIsCorrect', answerIsCorrect);
  console.log('answerIsCorrectText', answerIsCorrectText);

  const data: QuestionSubmitDataDetail[] = orderIndex.map((index, i) => {
    const answer = gameConfig.answerList?.find((item) => item.index === index);
    return {
      question_sort_text_choice_id: answer?.id || 0,
      index: i + 1,
    };
  });

  const answerObject: QuestionSubmitData = {
    question_id: gameConfig.questionId,
    question_type: gameConfig.questionType as Required<GameConfig>['questionType'],
    is_correct: answerIsCorrect,
    time_used: timer,
    data,
  };

  if (answerListFromUser.length === 0) {
    answerObject.data = [];
  }

  return {
    answerIsCorrect: answerIsCorrect,
    answerIsCorrectText: answerIsCorrectText || '',
    answerFromUserText: answerFromUserText || '',
    answerObject: answerObject,
  };
};

const generateAnswerList = (answerList: GameConfig['answerList']) => {
  const answerListText: string[] = [];

  answerList?.forEach((item) => {
    item.answer_indexes?.forEach((index) => {
      answerListText[index - 1] = item.answer; // Adjusting for 0-based index
    });
  });

  return answerListText;
};

const generateAnswerListFromUser = (
  answerList: GameConfig['answerList'],
  orderIndex: number[],
) => {
  const answerListText: string[] = [];

  orderIndex?.forEach((index) => {
    const findAnswer = answerList?.find((item) => item.index === index);
    if (findAnswer) {
      answerListText.push(findAnswer.answer);
    }
  });

  return answerListText;
};

export default SubmitOnSorting;
