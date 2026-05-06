import { useState } from 'react';

import GameplayStatusBar from '@global/component/web/molecule/wc-m-gameplay-statusbar';
import { useTranslation } from 'react-i18next';
import Image110 from '../../../assets/image-110.png';
import ConfigJson from '../../../config/index.json';
import { Alignment } from '../../../type';
import AnswerInput from '../atoms/wc-a-answer-input';
import AnswerText from '../atoms/wc-a-answer-text';
import ButtonMisc from '../atoms/wc-a-button-misc';
import ButtonSoundOn from '../atoms/wc-a-button-sound-on';
import QuestionImage from '../atoms/wc-a-question-image';
import Question from '../organisms/wc-o-question';
import LayoutContainer from './wc-t-layout-container';

const Template2 = ({
  totalTime,
  timeLeft,
  handleZoom,
  handleHint,
}: {
  totalTime: number;
  timeLeft: number;
  handleZoom: any;
  handleHint: any;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const [dataAnswer, setDataAnswer] = useState([
    { choice: 'A', answer: t('template2.answers.fish', 'Fish'), disabled: false },
    { choice: 'B', answer: t('template2.answers.cat', 'Cat'), disabled: false },
    { choice: 'C', answer: t('template2.answers.dog', 'Dog'), disabled: false },
    {
      choice: 'D',
      answer: t('template2.answers.bird', 'Bird Bird Bird'),
      disabled: false,
    },
  ]);

  const [answerList, setAnswerList] = useState<
    { choice: string; answer: string; disabled: boolean }[]
  >([]);

  const handleAnswer = (index: number) => {
    if (answerList.length === 2) {
      return;
    }
    setAnswerList([...answerList, dataAnswer[index]]);
    setDataAnswer((prev) =>
      prev.map((data, i) => {
        if (i === index) {
          return { ...data, disabled: true };
        }
        return data;
      }),
    );
  };

  const questionTitle = t('template2.questionTitle', 'Q1. จัดกลุ่มตามเงื่อนไขที่กำหนด');
  const firstParagraph = t('template2.firstParagraph', 'Lorem ipsum dolor sit amet,');
  const secondParagraph = t('template2.secondText', 'elit. Donec nec odio vitae nunc.');
  const thirdParagraph = t('template2.thirdText', 'ipsum dolor sit amet,');
  const fourthParagraph = t('template2.fourthText', 'adipiscing elit.');
  const fifthParagraph = t('template2.fifthText', 'vitae');

  return (
    <div className="flex h-full w-full flex-col pl-16 pr-4 pb-6">
      <div className="h-[5.3rem] w-full">
        <GameplayStatusBar totalTime={totalTime} timeLeft={timeLeft} />
      </div>
      <LayoutContainer
        alignment={Alignment.Vertical}
        flex={[6, 1.5]}
        className="gap-7 px-4 pt-5 pb-2"
      >
        <LayoutContainer alignment={Alignment.Horizontal} flex={[5, 6]} className="gap-4">
          <Question title={questionTitle} onHintClick={() => handleHint('Q1')}>
            <QuestionImage image={Image110} onZoom={handleZoom} />
          </Question>
          <Question title={questionTitle} disableHint>
            <div className="flex flex-wrap items-center">
              {firstParagraph}
              <div className="ml-2 p-1 rounded w-32 h-16">
                {answerList?.[0] && (
                  <AnswerText
                    choice={answerList?.[0].choice}
                    answer={answerList?.[0].answer}
                    className="w-min !h-14"
                  />
                )}
              </div>
              <div className="mr-2 rounded h-16">
                <ButtonMisc />{' '}
              </div>{' '}
              {secondParagraph}
            </div>
            <div className="flex flex-wrap items-center">
              <div className="mr-2 rounded h-16">
                <ButtonSoundOn enabledSoundSlow />{' '}
              </div>
              {thirdParagraph}
              <span className="inline-block min-w-[100px] text-center border-b border-black">
                <span id="answer" className="break-words font-medium">
                  {answerList?.[1] ? (
                    answerList?.[1].answer
                  ) : (
                    <span className="inline-block w-full">&nbsp;</span>
                  )}
                </span>
              </span>
              {fourthParagraph}{' '}
              <div className="ml-2 p-1 rounded w-36 h-16">
                <AnswerInput className="w-min h-auto" />
              </div>{' '}
              {fifthParagraph} <ButtonSoundOn />
            </div>
          </Question>
        </LayoutContainer>
        <LayoutContainer alignment={Alignment.Horizontal} flex={[5]}>
          <div className="h-full border-[8px] border-white rounded-full p-4">
            <div className="flex gap-4 font-medium">
              {dataAnswer.map((data, index) => (
                <AnswerText
                  key={index}
                  choice={data.choice}
                  answer={data.answer}
                  className="w-min text-nowrap"
                  onClick={() => handleAnswer(index)}
                  disabled={data.disabled}
                />
              ))}
            </div>
          </div>
        </LayoutContainer>
      </LayoutContainer>
    </div>
  );
};

export default Template2;
