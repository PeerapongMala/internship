import {
  answerProps,
  GameConfig,
  QuestionSubmitData,
  QuestionSubmitDataDetail,
} from '../type';

const SubmitOnPairing = ({
  gameConfig,
  timer,
}: {
  gameConfig: GameConfig;
  timer: number;
}) => {
  let answerIsCorrect = true;
  let answerIsCorrectText = '';
  let answerFromUserText = '';

  const groupAndAnswerList = generateGroupAndAnswerList(
    gameConfig.groupList,
    gameConfig.answerList,
  );

  const groupAndAnswerListFromUser = generateGroupAndAnswerListFromUser(
    gameConfig.groupList,
  );

  // compare groupAndAnswerList and groupAndAnswerListFromUser
  groupAndAnswerList.forEach((group, index) => {
    if (group.answers.length !== groupAndAnswerListFromUser[index].answers.length) {
      answerIsCorrect = false;
    }
    group.answers.forEach((answer, i) => {
      if (answer !== groupAndAnswerListFromUser[index].answers[i]) {
        answerIsCorrect = false;
      }
    });
  });

  // generate answerIsCorrectText
  groupAndAnswerList.forEach((group, index) => {
    answerIsCorrectText += `กลุ่ม ${group.groupName} ประกอบด้วย [${group.answers.join(', ')}] `;
  });

  groupAndAnswerListFromUser.forEach((group, index) => {
    answerFromUserText += `กลุ่ม ${group.groupName} ประกอบด้วย [${group.answers.join(', ')}] `;
  });

  console.log('groupAndAnswerList', groupAndAnswerList);
  console.log('groupAndAnswerListFromUser', groupAndAnswerListFromUser);

  console.log('answerIsCorrect', answerIsCorrect);
  console.log('answerIsCorrectText', answerIsCorrectText);

  const data: QuestionSubmitDataDetail[] = [];
  groupAndAnswerListFromUser.forEach((group, groupIndex) => {
    group.answers.forEach((answer, answerIndex) => {
      const originalAnswer = gameConfig.answerList?.find((a) => a.choice === answer);
      if (originalAnswer) {
        data.push({
          question_group_choice_id: originalAnswer.id,
          // question_group_group_id: group.groupIndex,
          question_group_group_id: group.groupID,
        });
      }
    });
  });

  const answerObject: QuestionSubmitData = {
    question_id: gameConfig.questionId,
    question_type: gameConfig.questionType as Required<GameConfig>['questionType'],
    is_correct: answerIsCorrect,
    time_used: timer,
    data,
  };

  return {
    answerIsCorrect: answerIsCorrect,
    answerIsCorrectText: answerIsCorrectText || '',
    answerFromUserText: answerFromUserText || '',
    answerObject,
  };
};

const generateGroupAndAnswerList = (
  groupList: GameConfig['groupList'],
  answerList: GameConfig['answerList'],
) => {
  const groupListAnswer: { groupName: string; groupIndex: number; answers: string[] }[] =
    [];

  groupList?.forEach((group, index) => {
    const groupIndexe = group.index;
    groupListAnswer.push({
      groupName: group.groupName,
      groupIndex: groupIndexe,
      answers: [],
    });
    answerList?.forEach((answer: answerProps) => {
      if (answer.group_indexes?.includes(groupIndexe)) {
        groupListAnswer[index].answers.push(answer.choice || '');
      }
    });
    groupListAnswer[index].answers.sort((a, b) => a.localeCompare(b));
  });
  return groupListAnswer;
};

const generateGroupAndAnswerListFromUser = (groupList: GameConfig['groupList']) => {
  const groupListAnswer: { groupID: number; groupName: string; groupIndex: number; answers: string[] }[] =
    [];

  groupList?.forEach((group, index) => {
    const groupIndexe = group.index;
    groupListAnswer.push({
      groupID: group.id,
      groupName: group.groupName,
      groupIndex: groupIndexe,
      answers: group.groupDetails,
    });
    groupListAnswer[index].answers.sort((a, b) => a.localeCompare(b));
  });
  return groupListAnswer;
};

export default SubmitOnPairing;
