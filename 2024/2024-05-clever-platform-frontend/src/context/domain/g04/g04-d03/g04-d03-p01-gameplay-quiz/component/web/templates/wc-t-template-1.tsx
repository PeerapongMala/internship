import GameplayStatusBar from '@global/component/web/molecule/wc-m-gameplay-statusbar';
import { useTranslation } from 'react-i18next';
import Image108 from '../../../assets/image-108.png';
import ConfigJson from '../../../config/index.json';
import { Alignment } from '../../../type';
import QuestionImage from '../atoms/wc-a-question-image';
import Answer from '../organisms/wc-a-answer';
import Question from '../organisms/wc-o-question';
import LayoutContainer from './wc-t-layout-container';

const Template1 = ({
  totalTime,
  timeLeft,
  handleZoom,
  handleHint,
}: {
  totalTime: number;
  timeLeft: number;
  handleZoom?: any;
  handleHint?: any;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const questionTitle = t('template1.questionTitle', 'Q1. จัดกลุ่มตามเงื่อนไขที่กำหนด');
  const questionText = t(
    'template1.questionText',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio vitae nunc.',
  );

  return (
    <div className="flex h-full w-full flex-col pl-16 pr-4 pb-6">
      <div className="h-[5.3rem] w-full">
        <GameplayStatusBar totalTime={totalTime} timeLeft={timeLeft} />
      </div>
      <LayoutContainer
        alignment={Alignment.Vertical}
        flex={[6, 2]}
        className="gap-7 px-4 pt-5 pb-2"
      >
        <LayoutContainer alignment={Alignment.Horizontal} flex={[7, 0]} className="gap-4">
          <Question title={questionTitle} onHintClick={() => handleHint('Q1')}>
            <div>{questionText}</div>
            <QuestionImage image={Image108} onZoom={handleZoom} />
          </Question>
        </LayoutContainer>
        <div className="h-full border-[8px] border-white rounded-[34px] p-4 overflow-auto">
          <div className="flex gap-4 font-medium">
            <Answer />
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default Template1;
