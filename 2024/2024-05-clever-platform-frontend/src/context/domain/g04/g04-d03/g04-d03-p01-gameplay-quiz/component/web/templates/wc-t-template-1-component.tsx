import { Alignment, GameConfig, HandleChange } from '../../../type';
import LayoutContainerComponent from '../organisms/wc-o-layout-container-component';
import QuestionAndAnswerComponent from '../organisms/wc-o-question-and-answer-component';

const Template1C = ({
  draggable,
  handleZoom,
  handleHint,
  gameConfig,
  handleChange,
  learnItems,
  currentLearnIndex,
  onLearnItemClick,
  onSubmit
}: {
  draggable?: boolean;
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  handleChange?: HandleChange;
  learnItems?: any[];
  currentLearnIndex?: number;
  onLearnItemClick?: (index: number) => void;
  onSubmit?: () => void;

}) => {
  return (
    <LayoutContainerComponent
      alignment={
        gameConfig.position === '1' ? Alignment.Horizontal : Alignment.Vertical
      }
      flex={['1'].map((item: string) => parseInt(item))}
      className="gap-7 px-4 pt-5 pb-2"
    >
      <QuestionAndAnswerComponent
        gameConfig={gameConfig}
        handleHint={handleHint}
        handleZoom={handleZoom}
        handleChange={handleChange}
        learnItems={learnItems}
        currentLearnIndex={currentLearnIndex}
        onLearnItemClick={onLearnItemClick}
        onSubmit={onSubmit}
      />
    </LayoutContainerComponent>
  );
};

export default Template1C;
