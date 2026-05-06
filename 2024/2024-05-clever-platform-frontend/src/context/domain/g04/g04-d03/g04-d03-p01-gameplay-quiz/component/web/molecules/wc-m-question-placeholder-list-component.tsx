import { ReactSortable } from 'react-sortablejs';
import styles from '../../../index.module.css';
import { answerProps, GameConfig, HandleChange } from '../../../type';
import AnswerText from '../atoms/wc-a-answer-text';
import ButtonSoundOn from '../atoms/wc-a-button-sound-on';

import Latex from 'react-latex-next';

const QuestionPlaceholderListComponent: React.FC<{
  dataList?: GameConfig['questionList'];
  gameConfig: GameConfig;
  handleChange?: HandleChange;
}> = ({
  // dataList = [
  //   {
  //     index: 1,
  //     text: 'ชีวิต {Ans1} {Ans2} ดี',
  //     answers: [
  //       {
  //         id: 93,
  //         index: 1,
  //         text: [{ index: 1, choice_index: 1, text: '' }],
  //         answerInput: '',
  //         answerText: '{Ans1}',
  //       },
  //       {
  //         id: 94,
  //         index: 2,
  //         text: [{ index: 1, choice_index: 3, text: '' }],
  //         answerInput: '',
  //         answerText: '{Ans2}',
  //       },
  //     ],
  //   },
  // ],
  dataList,
  gameConfig,
  handleChange,
}) => {
    // console.log('Data list:', dataList);

    const transformedAnswerList = (gameConfig.answerList || []).map((item) => ({
      ...item,
      answers: [
        {
          text: [
            {
              index: item.index,
              choice_index: item.index,
              text: item.answer,
            },
          ],
        },
      ],
    }));

    const dataList2 = dataList?.map((description) => {
      const pattern = /{Ans\d+}/g;
      const answerList = description.text?.match(pattern) || [];
      const splitText = description.text?.split(pattern);
      const result = [];

      for (let i = 0; i < splitText.length; i++) {
        if (splitText[i].trim()) {
          result.push({
            index: -1,
            type: 'text',
            text: [],
            answerText: splitText[i].trim(),
            answerInput: '',
          });
        }
        if (answerList[i] && answerList[i].trim()) {
          const answerItem = description.answers?.find((item) => item.index === i + 1);
          if (answerItem) {
            result.push({
              ...answerItem,
              type: 'answer',
            });
          }
        }
      }

      description.answers?.forEach((answer) => {
        answer.text?.forEach((text) => {
          const found = transformedAnswerList.find(
            (item) => item.index === text.choice_index,
          );
          if (found) {
            text.text = found.answer;
          }
        });
      });

      return {
        index: description.index,
        questionList: result,
        value: description.text || '',
        answerList: description.answers || [],
        speechUrl: description.speechUrl || '',
      };
    });

    const hinttype = gameConfig.hintType;

    return (
      <div className="flex flex-col gap-4">
        {/* <NewQuestionPlaceholderListComponent
        id="new-placeholder"
        hinttype={hinttype}
        answerCount={3}
        questionType={gameConfig.questionType}
        inputType={gameConfig.inputType}
        handleChange={handleChange}
        gameConfig={gameConfig}
        dataList={dataList}
      /> */}
        {dataList2?.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {item.speechUrl && (
              <ButtonSoundOn className="w-10 h-10 shrink-0" sound={item.speechUrl} />
            )}
            <div className="inline-flex flex-wrap items-center gap-2 w-full">
              {item.questionList.map((question, idx) =>
                question.type !== "text" ? (
                  <span key={idx} className="inline-flex align-middle">
                    <QuestionListHintComponent
                      id={`${item.index}_${question.index}`}
                      hinttype={hinttype}
                      gameConfig={gameConfig}
                      questionType={gameConfig.questionType}
                      inputType={gameConfig.inputType}
                      answerCount={
                        question.text?.[0] ? question.text?.[0].text?.length : 0
                      }
                      handleChange={handleChange}
                      value={question.answerInput}
                    />
                  </span>
                ) : (
                  <span
                    key={idx}
                    className="inline-flex break-words align-middle"
                  >
                    <Latex>{question?.answerText || ""}</Latex>
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

const QuestionListHintComponent: React.FC<{
  id: string;
  hinttype?: string | undefined;
  answerCount?: number;
  questionType?: string;
  inputType?: string;
  handleChange?: HandleChange;
  gameConfig?: GameConfig;
  value?: string;
}> = ({
  id,
  hinttype,
  answerCount = 3,
  questionType,
  inputType,
  handleChange,
  gameConfig,
  value,
}) => {
    let answer: answerProps = {
      id: -1,
      index: -1,
      answer: '',
      choice: '',
      disabled: false,
    };

    if (value) {
      const answerIndex = parseInt(value);
      const findAnswer = gameConfig?.answerList?.find((item) => item.id === answerIndex);
      if (findAnswer) {
        answer = findAnswer;
      }
    }

    return (
      <div className="relative w-full h-full">
        {(value || !value) && (
          <ReactSortable
            list={[]}
            setList={() => { }}
            className={`w-auto h-full flex`}
            group={{
              name: 'shared',
              pull: false,
              put: true,
            }}
            sort={false}
            onAdd={(evt) => {
              const eItem = evt.clone;
              const dataId = eItem.getAttribute('data-id');
              if (dataId) {
                handleChange?.('answerDropGroup', `${id}_${dataId}`);
              }
            }}
            ghostClass={styles['ghost-placeholder-list']}
          // handle={'.handle'}
          >
            <AnswerText
              disabled
              className="mx-1 !w-auto !brightness-100"
              id={`answer-${answer.index}`}
              // choice={answer.choice}
              answer={
                answer.answer ? (
                  <div className="flex relative overflow-x-hidden overflow-y-hidden h-full">
                    {answer.answer}
                    {/* <AutoScroll
                      animationDuration={answer.answer.length < 6 ? 0 : 10}
                      className="max-w-16 w-fit"
                    >
                      {answer.answer}
                    </AutoScroll> */}
                  </div>
                ) : (
                  <UnderlineComponent
                    answerCount={hinttype === 'count' ? answerCount : 0}
                  />
                )
              }
              // disabled={answer.disabled}
              onClick={() => handleChange?.('answerSelected', answer.index.toString())}
            />
          </ReactSortable>
        )}
      </div>
    );
  };

const UnderlineComponent = ({ answerCount }: { answerCount?: number }) => {
  return (
    <div className="min-w-[40px] h-1 pb-8 px-2">
      <div className=" text-black/20">
        {answerCount ? answerCount : <>&nbsp;</>}
      </div>
    </div>
  );
};

// import { createRoot } from 'react-dom/client';
// import katex from 'katex';

// const NewQuestionPlaceholderListComponent: React.FC<{
//   id: string;
//   hinttype?: string | undefined;
//   answerCount?: number;
//   questionType?: string;
//   inputType?: string;
//   handleChange?: HandleChange;
//   gameConfig?: GameConfig;
//   dataList: GameConfig['questionList'];
// }> = ({
//   id,
//   hinttype,
//   answerCount = 3,
//   questionType,
//   inputType,
//   handleChange,
//   gameConfig,
//   dataList,
// }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const pattern = /{Ans\d+}/g;

//   console.log('NewQuestionPlaceholderListComponent', dataList);

//   useEffect(() => {
//     const testData = dataList?.[0].text;

//     if (testData && containerRef.current) {
//       console.log('Render katex', testData);

//       // convert {Ans1} to \htmlId{ans-1}{Ans1}
//       const convertedText = testData.replace(pattern, (match) => {
//         const index = parseInt(match.replace(/{|}/g, '').replace('Ans', ''));
//         return `\\htmlId{ans-${index}}${match}`;
//       });
//       console.log('Converted text:', convertedText);

//       katex.render(convertedText, containerRef.current, {
//         trust: true,
//         displayMode: true,
//       });
//       // // Replace element with id 'ans-1'
//       // const ansElement = document.getElementById('ans-1');
//       // if (ansElement) {
//       //   const root = createRoot(ansElement);
//       //   root.render(
//       //     <NewQuestionListHintComponent
//       //       id="ans-1"
//       //       hinttype={hinttype}
//       //       gameConfig={gameConfig}
//       //       questionType={questionType}
//       //       inputType={inputType}
//       //       answerCount={answerCount}
//       //       handleChange={handleChange}
//       //       // value="New Answer 1"
//       //     />,
//       //   );
//       // }
//     }
//   }, [dataList, containerRef]);

//   return <div ref={containerRef} />;
// };

// const NewQuestionListHintComponent: React.FC<{
//   id: string;
//   hinttype?: string | undefined;
//   answerCount?: number;
//   questionType?: string;
//   inputType?: string;
//   handleChange?: HandleChange;
//   gameConfig?: GameConfig;
//   value?: string;
// }> = ({
//   id,
//   hinttype,
//   answerCount = 3,
//   questionType,
//   inputType,
//   handleChange,
//   gameConfig,
//   value,
// }) => {
//   // if (!hinttype || hinttype === 'none') {
//   //   return <>&nbsp;</>;
//   // }

//   let answer: answerProps = {
//     id: -1,
//     index: -1,
//     answer: '',
//     choice: '',
//     disabled: false,
//   };

//   if (value) {
//     const answerIndex = parseInt(value);
//     const findAnswer = gameConfig?.answerList?.find((item) => item.id === answerIndex);
//     if (findAnswer) {
//       answer = findAnswer;
//     }
//   }

//   return (
//     <div className="flex w-5 h-5 bg-red-300">
//       {(value || !value) && (
//         <ReactSortable
//           list={[]}
//           setList={() => {}}
//           className={`w-40 h-full px-2 flex items-center justify-center`}
//           group={{
//             name: 'shared',
//             pull: false,
//             put: true,
//           }}
//           sort={false}
//           onAdd={(evt) => {
//             const eItem = evt.clone;
//             const dataId = eItem.getAttribute('data-id');
//             if (dataId) {
//               handleChange?.('answerDropGroup', `${id}_${dataId}`);
//             }
//           }}
//           ghostClass={styles['ghost-placeholder-list']}
//           // handle={'.handle'}
//         >
//           {value && (
//             <AnswerText
//               className="w-full h-full top-0 left-0"
//               id={`answer-${answer.index}`}
//               choice={answer.choice}
//               answer={answer.answer}
//               // disabled={answer.disabled}
//               onClick={() => handleChange?.('answerSelected', answer.index.toString())}
//             />
//           )}
//         </ReactSortable>
//       )}
//     </div>
//   );
// };

export default QuestionPlaceholderListComponent;
