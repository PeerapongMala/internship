import {
  answerProps,
  GameConfig,
  QuestionSubmitData,
  QuestionSubmitDataDetail,
} from '../type';

const SubmitOnInput = ({
  gameConfig,
  timer,
}: {
  gameConfig: GameConfig;
  timer: number;
}) => {
  console.log('gameConfig', gameConfig);
  console.log('timer', timer);

  let answerIsCorrect = checkAnswer(gameConfig.questionList);
  let answerIsCorrectText = generateAnswerIsCorrectText(gameConfig.questionList);
  const answerFromUserText = generateAnswerFromUserText(gameConfig.questionList);

  console.log('answerIsCorrect', answerIsCorrect);
  console.log('answerIsCorrectText', answerIsCorrectText);

  const data: QuestionSubmitDataDetail[] = generateData(gameConfig.questionList);

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

const checkAnswer = (questionList: GameConfig['questionList']) => {
  // "questionList": [
  //         {
  //             "index": 1,
  //             "text": "ชีวิต {Ans1} {Ans2} ดี",
  //             "answers": [
  //                 {
  //                     "id": 93,
  //                     "index": 1,
  //                     "text": [
  //                         {
  //                             "index": 1,
  //                             "choice_index": 1,
  //                             "text": "a"
  //                         },
  //                         {
  //                             "index": 2,
  //                             "choice_index": 3,
  //                             "text": "c"
  //                         }
  //                     ],
  //                     "answerText": "{Ans1}",
  //                     "answerInput": "2"
  //                 },
  //                 {
  //                     "id": 94,
  //                     "index": 2,
  //                     "text": [
  //                         {
  //                             "index": 1,
  //                             "choice_index": 2,
  //                             "text": "b"
  //                         }
  //                     ],
  //                     "answerText": "{Ans2}"
  //                 }
  //             ]
  //         }
  //     ],

  // if answerInput is in text[index].choice_index, then answer is correct
  // if answerInput is not in text[index].choice_index, then answer is incorrect
  // if answerInput is empty, then answer is incorrect

  let answerIsCorrect = true;

  questionList?.forEach((question) => {
    question.answers?.forEach((answer) => {
      if (answer.answerInput) {
        const findAnswerText = answer.text.find(
          (text) => text.text === answer?.answerInput,
        );

        if (!findAnswerText) {
          answerIsCorrect = false;
        }
      } else {
        answerIsCorrect = false;
      }
    });
  });

  return answerIsCorrect;
};

const generateAnswerIsCorrectText = (questionList: GameConfig['questionList']) => {
  // "questionList": [
  //         {
  //             "index": 1,
  //             "text": "ชีวิต {Ans1} {Ans2} ดี",
  //             "answers": [
  //                 {
  //                     "id": 93,
  //                     "index": 1,
  //                     "text": [
  //                         {
  //                             "index": 1,
  //                             "choice_index": 1,
  //                             "text": "a"
  //                         },
  //                         {
  //                             "index": 2,
  //                             "choice_index": 3,
  //                             "text": "c"
  //                         }
  //                     ],
  //                     "answerText": "{Ans1}",
  //                     "answerInput": "2"
  //                 },
  //                 {
  //                     "id": 94,
  //                     "index": 2,
  //                     "text": [
  //                         {
  //                             "index": 1,
  //                             "choice_index": 2,
  //                             "text": "b"
  //                         }
  //                     ],
  //                     "answerText": "{Ans2}"
  //                 }
  //             ]
  //         }
  //     ],

  //  return "1. ชีวิต (a/c) (b) ดี"
  let answerIsCorrectText = '';

  questionList?.forEach((question, qIndex) => {
    let questionText = question.text || '';
    const pattern = /{Ans\d+}/g;
    const matches = questionText.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const answerIndex = parseInt(match.replace(/\D/g, ''), 10);
        const answer = question.answers?.find((ans) => ans.index === answerIndex);
        if (answer) {
          const answerTexts = answer.text.map((t) => t.text).join('/');
          questionText = questionText.replace(match, `(${answerTexts})`);
        }
      });
    }

    answerIsCorrectText += `[ ${qIndex + 1}. ${questionText} ] `;
  });

  return answerIsCorrectText.trim();
};

const generateAnswerFromUserText = (questionList: GameConfig['questionList']) => {
  let answerFromUserText = '';

  questionList?.forEach((question, qIndex) => {
    let userAnswerText = question.text || '';
    const pattern = /{Ans\d+}/g;
    const matches = userAnswerText.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const answerIndex = parseInt(match.replace(/\D/g, ''), 10);
        const answer = question.answers?.find((ans) => ans.index === answerIndex);

        if (answer) {
          const userAnswer = answer.answerInput || '-'; // Use '(?)' if no input is provided
          userAnswerText = userAnswerText.replace(match, `(${userAnswer})`);
        }
      });
    }

    answerFromUserText += `[ ${qIndex + 1}. ${userAnswerText} ] `;
  });

  return answerFromUserText.trim();
};

const generateData = (questionList: GameConfig['questionList']) => {
  const data: QuestionSubmitDataDetail[] = [];

  questionList?.forEach((question) => {
    question.answers?.forEach((answer) => {
      if (answer.answerInput) {
        data.push({
          question_input_answer_id: answer.id,
          answer_index: answer.index,
          answer: answer.answerInput,
        });
      }
    });
  });

  return data;
};

export default SubmitOnInput;
