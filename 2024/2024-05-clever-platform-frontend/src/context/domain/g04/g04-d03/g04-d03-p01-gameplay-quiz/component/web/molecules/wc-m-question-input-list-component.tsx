import { useTranslation } from 'react-i18next';
import Latex from 'react-latex-next';
import ConfigJson from '../../../config/index.json';
import { GameConfig, HandleChange, QuestionListProps } from '../../../type';
import AnswerText from '../atoms/wc-a-answer-input-text';
import ButtonMisc from '../atoms/wc-a-button-misc';
import ButtonSoundOn from '../atoms/wc-a-button-sound-on';

interface QuestionAndAnswerProps {
  index: number;
  type: string;
  text: { index: number; text: string }[];
  answerText: string;
  answerInput?: string;
}

const QuestionInputListComponent: React.FC<{
  dataList?: QuestionListProps[];
  gameConfig: GameConfig;
  handleChange?: HandleChange;
}> = ({
  dataList = [
    {
      index: 1,
      text: 'ชีวิต {Ans1} {Ans2} ดีaa',
      answers: [
        {
          index: 1,
          type: 'normal',
          answerInput: '',
          text: [
            {
              index: 1,
              text: 'a',
            },
          ],
        },
        {
          index: 2,
          type: 'regex',
          answerInput: '',
          text: [
            {
              index: 1,
              text: 'b',
            },
          ],
        },
      ],
      speechUrl: '',
    },
    {
      index: 2,
      text: 'ชีวิต2 {Ans4} {Ans5} ดีaa',
    },
  ],
  gameConfig,
  handleChange,
}) => {
    const { t } = useTranslation([ConfigJson.key]);

    const dataList2 = dataList.map((description) => {
      const pattern = /{Ans\d+}/g;
      const answerList = description.text?.match(pattern) || [];
      const splitText = description.text?.split(pattern);
      const result: QuestionAndAnswerProps[] = [];

      for (let i = 0; i < splitText.length; i++) {
        if (splitText[i].trim()) {
          result.push({
            index: -1,
            type: 'text',
            text: [],
            answerText: splitText[i].trim(),
          });
        }
        if (answerList[i] && answerList[i].trim()) {
          const answerItem = description.answers?.find(
            (item) => item.index === i + 1,
          ) as QuestionAndAnswerProps;
          if (answerItem) {
            result.push({
              ...answerItem,
              answerText: answerList[i].trim(),
            });
          }
        }
      }

      // Add any remaining matches
      for (let i = splitText.length; i < answerList.length; i++) {
        if (answerList[i] && answerList[i].trim()) {
          const answerItem = description.answers?.find(
            (item) => item.index === i + 1,
          ) as QuestionAndAnswerProps;
          if (answerItem) {
            result.push({
              ...answerItem,
              answerText: answerList[i].trim(),
            });
          }
        }
      }

      return {
        questionIndex: description.index,
        questionList: result,
        value: description.text || '',
        answerList: description.answers || [],
        speechUrl: description.speechUrl || '',
      };
    });

    console.log('dataList2', dataList2);

    const hinttype = gameConfig.hintType;
    return (
      <div className="flex flex-col gap-4">
        {dataList2.map((item, index) => (
          <div key={index} className="flex gap-2 items-center" >
            {item.speechUrl && (
              <ButtonSoundOn
                className="w-10 h-10"
                sound={item.speechUrl}
                aria-label={t('questionInputList.soundButton', 'ปุ่มเสียง')}
              />
            )}
            {item.questionList.map((question, idx) =>
              question.type !== 'text' ? (
                <div key={idx} className="!w-auto ">
                  <QuestionListHintComponent
                    id={`answer_input_${index}_${idx}`}
                    hinttype={hinttype}
                    questionType={gameConfig.questionType}
                    inputType={gameConfig.inputType}
                    answerCount={question.text?.[0] ? question.text?.[0].text?.length : 0}
                    value={question.answerInput}
                    onClick={() =>
                      handleChange?.(
                        'answerInputClick',
                        `${item.questionIndex}_${question.index}`,
                      )
                    }
                  />
                </div>
              ) : (
                <Latex key={idx}>{question?.answerText}</Latex>
              ),
            )}
          </div>
        ))}
      </div>
    );
  };

const QuestionListHintComponent: React.FC<{
  hinttype?: string | undefined;
  answerCount?: number;
  questionType?: string;
  inputType?: string;
  onClick?: () => void;
  value?: string;
  id?: string;
}> = ({ hinttype, answerCount = 3, questionType, inputType, onClick, value, id }) => {
  const { t } = useTranslation([ConfigJson.key]);

  if (questionType === 'placeholder') {
    if (!hinttype || hinttype === 'none') {
      return <>&nbsp;</>;
    }

    if (hinttype === 'count') {
      return <>&nbsp;({answerCount})&nbsp;</>;
    }
  } else if (questionType === 'input') {
    if (inputType === 'text') {
      // let blankPlaceholder = `_______$\\textcolor{lightgray}{(${answerCount}\\#)}$`;
      let blankPlaceholder = `(${answerCount}#)`;

      if (!hinttype || hinttype === 'none') {
        blankPlaceholder = '';
      }

      return (
        <AnswerText
          id={id}
          className={`h-[3rem] min-w-20
            ${value ? '' : 'tracking-[-0.1em]'}
            `}
          answer={value ? value : blankPlaceholder}
          onClick={onClick}
          aria-label={t('questionInputList.answerField', 'ช่องกรอกคำตอบ')}
        />
      );
    }
    if (inputType === 'speech') {
      return (
        <ButtonMisc
          id={id}
          onClick={onClick}
          value={value}
          aria-label={t('questionInputList.micButton', 'ปุ่มไมโครโฟน')}
        />
      );
    }
  }

  return null;
};

export default QuestionInputListComponent;
