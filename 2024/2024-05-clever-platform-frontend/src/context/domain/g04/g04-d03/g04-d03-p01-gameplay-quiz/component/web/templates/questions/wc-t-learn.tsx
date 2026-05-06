import {
  AnswerPlaceholderProps,
  GameConfig,
  QuestionListProps
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import Template1C from '../wc-t-template-1-component';

const QuestionLearn = ({
  handleZoom,
  handleHint,
  gameConfig,
  learnItems,
  currentLearnIndex,
  onLearnItemClick,
  onSubmit
}: {
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  gameConfig: GameConfig;
  handleShowInput: (question: QuestionListProps, answer: AnswerPlaceholderProps) => void;
  learnItems?: any[];
  currentLearnIndex?: number;
  onLearnItemClick?: (index: number) => void;
  onSubmit?: () => void;
}) => {
  return (
    <Template1C
      gameConfig={gameConfig}
      handleZoom={handleZoom}
      handleHint={handleHint}
      learnItems={learnItems}
      currentLearnIndex={currentLearnIndex}
      onLearnItemClick={onLearnItemClick}
      onSubmit={onSubmit}
    />
  );
};

export default QuestionLearn;
