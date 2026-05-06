import StoreGame from '@global/store/game';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import {
  AnswerPlaceholderProps,
  answerProps,
  GameConfig,
  QuestionListProps,
} from '../../../type';
import QuestionInput from '../templates/questions/wc-t-input';
import QuestionMultipleChoices from '../templates/questions/wc-t-multiple-choices';
import QuestionPairing from '../templates/questions/wc-t-pairing';
import QuestionPlaceholder from '../templates/questions/wc-t-placeholder';
import QuestionSorting from '../templates/questions/wc-t-sorting';
import QuestionLearn from './questions/wc-t-learn';

const PageGameplay = ({
  gameConfig,
  setGameConfig,
  handleZoom,
  handleHint,
  handleGroup,
  handleShowInput,
  setSelectedAnswer,
  setOrderIndex,
  learnItems,
  currentLearnIndex,
  onLearnItemClick,
  onSubmit
}: {
  gameConfig: GameConfig;
  setGameConfig: (value: GameConfig) => void;
  handleZoom: (img: string) => void;
  handleHint: (question: string) => void;
  handleGroup: (groupIndex: number) => void;
  handleShowInput: (question: QuestionListProps, answer: AnswerPlaceholderProps) => void;
  setSelectedAnswer: (answer: answerProps) => void;
  setOrderIndex: (orderIndex: number[]) => void;
  learnItems?: any[];
  currentLearnIndex?: number;
  onLearnItemClick?: (index: number) => void;
  onSubmit?: () => void;

}) => {
  const { t } = useTranslation([ConfigJson.id]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    // StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
  }, []);

  return (
    <>
      {gameConfig.questionType === 'sorting' && (
        <QuestionSorting
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
          setOrderIndex={setOrderIndex}
        />
      )}
      {gameConfig.questionType === 'pairing' && (
        <QuestionPairing
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
          setGameConfig={setGameConfig}
          handleGroup={handleGroup}
        />
      )}
      {gameConfig.questionType === 'multiple-choices' && (
        <QuestionMultipleChoices
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
          setSelectedAnswer={setSelectedAnswer}
        />
      )}
      {gameConfig.questionType === 'placeholder' && (
        <QuestionPlaceholder
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
        />
      )}
      {gameConfig.questionType === 'input' && (
        <QuestionInput
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
          handleShowInput={handleShowInput}
        />
      )}
      {gameConfig.questionType === 'learn' && (
        <QuestionLearn
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleHint={handleHint}
          handleShowInput={handleShowInput}
          learnItems={learnItems}
          currentLearnIndex={currentLearnIndex}
          onLearnItemClick={onLearnItemClick}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default PageGameplay;
