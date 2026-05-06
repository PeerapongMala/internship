import {
  GameConfig,
  QuestionSubmitData,
  QuestionSubmitDataDetail
} from '../type';

const SubmitOnPlaceholder = ({
  gameConfig,
  timer,
}: {
  gameConfig: GameConfig;
  timer: number;
}) => {
  console.log('gameConfig', gameConfig);
  console.log('timer', timer);

  let answerIsCorrect = checkAnswer(gameConfig.questionList, gameConfig.answerList);
  const { answerIsCorrectText, answerFromUserText } = generateAnswerTexts(
    gameConfig.questionList,
    gameConfig.answerList,
  );

  console.log('answerIsCorrect', answerIsCorrect);
  console.log('answerIsCorrectText', answerIsCorrectText);

  const data: QuestionSubmitDataDetail[] = generateData(
    gameConfig.questionList,
    gameConfig.answerList,
  );

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

const checkAnswer = (
  questionList: GameConfig['questionList'],
  answerList: GameConfig['answerList'],
) => {

  /**
  * 1. คำตอบที่ผู้ใช้เลือกต้องมี isCorrect: true
  * 2. `index` ของคำตอบที่เลือกต้องตรงกับ choice_index ที่กำหนดไว้ในช่องนั้น
  */
  let answerIsCorrect = true;

  questionList?.forEach((question) => {

    question.answers?.forEach((answerSlot) => {
      if (!answerSlot.answerInput) {
        // ถ้าไม่ได้กรอก
        answerIsCorrect = false;
        return;
      }

      const userAnswerId = parseInt(answerSlot.answerInput, 10);
      //  find ผู้ใช้เลือกจาก answerList ตาม id
      const userAnswer = answerList?.find(ans => ans.id === userAnswerId);

      console.log(answerSlot.answerInput);
      console.log(
        '!user answer', !userAnswer,
        '!useranswer.isCorrect', !userAnswer?.isCorrect,
      );

      //  ถ้าไม่พบคำตอบที่ตรงกับ id ที่ userเลือก ผิด
      if (!userAnswer) {
        answerIsCorrect = false;
        return;
      }

      //  choice_index ชี้ไปที่ field index // ของ answerList
      const expectedChoices = answerSlot.text.map(t => t.choice_index);


      //  index ของคำตอบต้องอยู่ในรายการที่ช่องนี้
      const isIndexMatch = expectedChoices.includes(userAnswer.index);

      //   isCorrect: true
      const isCorrectAnswer = userAnswer.isCorrect;

      console.log({ isIndexMatch: isIndexMatch })
      console.log({ isCorrectAnswer: isCorrectAnswer })

      //  อย่างใดอย่างหนึ่งไม่ผ่าน
      if (!isCorrectAnswer || !isIndexMatch) {
        answerIsCorrect = false;
      }
    });
  });
  return answerIsCorrect;
};

const generateAnswerIsCorrectText = (
  questionList: GameConfig['questionList'],
  answerList: GameConfig['answerList'],
) => {
  // "questionList": [
  // {
  //   "index": 1,
  //   "text": "Ey{Ans1}",
  //   "answers": [
  //     {
  //       "id": 16,
  //       "index": 1,
  //       "text": [
  //         {
  //           "index": 1,
  //           "choice_index": 1
  //         },
  //         {
  //           "index": 2,
  //           "choice_index": 2
  //         }
  //       ],
  //       "answerInput": "34"
  //     }
  //   ],
  //   "speechUrl": ""
  // }
  // ]

  // "answerList": [
  //   {
  //     "id": 35,
  //     "index": 2,
  //     "answer": "a",
  //     "isCorrect": true,
  //     "group_indexes": [],
  //     "answer_indexes": [],
  //     "choice": "A",
  //     "disabled": false
  //   },
  //   {
  //     "id": 36,
  //     "index": 1,
  //     "answer": "t",
  //     "isCorrect": false,
  //     "group_indexes": [],
  //     "answer_indexes": [],
  //     "choice": "B",
  //     "disabled": false
  //   },
  //   {
  //     "id": 34,
  //     "index": 1,
  //     "answer": "e",
  //     "isCorrect": true,
  //     "group_indexes": [],
  //     "answer_indexes": [],
  //     "choice": "C",
  //     "disabled": true
  //   },
  //   {
  //     "id": 35,
  //     "index": 2,
  //     "answer": "es",
  //     "isCorrect": true,
  //     "group_indexes": [],
  //     "answer_indexes": [],
  //     "choice": "D",
  //     "disabled": true
  //   }
  // ]

  //  return "[ 1. Ey(e/es) ]"
  let answerIsCorrectText = '';

  const answerListCorrect = answerList?.filter((ans) => ans.isCorrect);

  questionList?.forEach((question, qIndex) => {
    let questionText = question.text || '';
    const pattern = /{Ans\d+}/g;
    const matches = questionText.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const answerIndex = parseInt(match.replace(/\D/g, ''), 10);
        const answer = question.answers?.find((ans) => ans.index === answerIndex);
        if (answer) {
          const answerTexts = answer.text
            .map((t) => {
              const answerItem = answerListCorrect?.find(
                (ans) => ans.index === t.choice_index,
              );
              return answerItem ? answerItem.answer : '';
            })
            .join('/');
          questionText = questionText.replace(match, `(${answerTexts})`);
        }
      });
    }

    answerIsCorrectText += `[ ${qIndex + 1}. ${questionText} ] `;
  });

  return answerIsCorrectText.trim();
};

const generateData = (
  questionList: GameConfig['questionList'],
  answerList: GameConfig['answerList'],
) => {
  const data: QuestionSubmitDataDetail[] = [];

  const answerListCorrect = answerList?.filter((ans) => ans.isCorrect);

  questionList?.forEach((question) => {
    question.answers?.forEach((answer) => {
      if (answer.answerInput) {
        const findAnswer = answerListCorrect?.find(
          (ans) => ans.id === parseInt(answer?.answerInput || '-1'),
        );
        if (findAnswer) {
          data.push({
            question_placeholder_answer_id: answer.id,
            question_placeholder_text_choice_id: findAnswer.id,
          });
        }
      }
    });
  });

  return data;
};

const generateAnswerTexts = (
  questionList: GameConfig['questionList'],
  answerList: GameConfig['answerList'],
) => {
  let answerIsCorrectText = '';
  let answerFromUserText = '';

  const answerListCorrect = answerList?.filter((ans) => ans.isCorrect);

  questionList?.forEach((question, qIndex) => {
    let questionText = question.text || '';
    let userAnswerText = question.text || '';
    const pattern = /{Ans\d+}/g;
    const matches = questionText.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const answerIndex = parseInt(match.replace(/\D/g, ''), 10);
        const answer = question.answers?.find((ans) => ans.index === answerIndex);

        if (answer) {
          // Correct answers for `answerIsCorrectText`
          const correctAnswerTexts = answer.text
            .map((t) => {
              const answerItem = answerListCorrect?.find(
                (ans) => ans.index === t.choice_index,
              );
              return answerItem ? answerItem.answer : '';
            })
            .join('/');

          // User's input for `answerFromUserText`
          const userAnswer = answerList?.find(
            (ans) => ans.id === parseInt(answer.answerInput || '-1'),
          );

          questionText = questionText.replace(match, `(${correctAnswerTexts})`);
          userAnswerText = userAnswer
            ? userAnswerText.replace(match, `(${userAnswer.answer})`)
            : userAnswerText.replace(match, '(-)');
        }
      });
    }

    answerIsCorrectText += `[ ${qIndex + 1}. ${questionText} ] `;
    answerFromUserText += `[ ${qIndex + 1}. ${userAnswerText} ] `;
  });

  return {
    answerIsCorrectText: answerIsCorrectText.trim(),
    answerFromUserText: answerFromUserText.trim(),
  };
};

export default SubmitOnPlaceholder;
