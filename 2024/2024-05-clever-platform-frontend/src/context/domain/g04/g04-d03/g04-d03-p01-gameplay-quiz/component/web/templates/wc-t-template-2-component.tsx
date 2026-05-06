import { Alignment, GameConfig, HandleChange } from '../../../type';
import AnswerContainerComponent from '../molecules/wc-m-answer-container-component';
import LayoutContainerComponent from '../organisms/wc-o-layout-container-component';
import QuestionAndAnswerComponent from '../organisms/wc-o-question-and-answer-component';

const Template2C = ({
  draggable,
  handleZoom,
  handleHint,
  gameConfig,
  handleChange,
}: {
  draggable?: boolean;
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  handleChange?: HandleChange;
}) => {
  return (
    <LayoutContainerComponent
      alignment={gameConfig.position === '1' ? Alignment.Horizontal : Alignment.Vertical}
      flex={(gameConfig.layout ? gameConfig.layout.split(':') : ['1', '1']).map(
        (item: string) => parseInt(item),
      )}
      className="gap-7 px-4 pt-5 pb-2"
    >
      <QuestionAndAnswerComponent
        gameConfig={gameConfig}
        handleHint={handleHint}
        handleZoom={handleZoom}
        handleChange={handleChange}
      />
      <AnswerContainerComponent
        draggable={draggable}
        answerType={gameConfig.answerType}
        pattern={gameConfig.patternAnswer}
        dataList={gameConfig.answerList}
        handleZoom={handleZoom}
        handleChange={handleChange}
      />
    </LayoutContainerComponent>
  );
};

export default Template2C;
