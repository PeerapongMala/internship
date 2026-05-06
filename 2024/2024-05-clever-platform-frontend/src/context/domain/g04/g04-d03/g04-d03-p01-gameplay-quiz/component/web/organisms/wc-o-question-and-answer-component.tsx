import React from 'react';
import Latex from 'react-latex-next';
import { GameConfig, HandleChange, QuestionAndAnswerProps } from '../../../type';
import QuestionImage from '../atoms/wc-a-question-image';
import QuestionComponent from '../molecules/wc-m-question-component';
import QuestionInputListComponent from '../molecules/wc-m-question-input-list-component';
import QuestionLearnComponent from '../molecules/wc-m-question-learn';
import QuestionPlaceholderListComponent from '../molecules/wc-m-question-placeholder-list-component';

const QuestionAndAnswerComponent: React.FC<QuestionAndAnswerProps & {
  learnItems?: any[];
  currentLearnIndex?: number;
  onLearnItemClick?: (index: number) => void;
  onSubmit?: () => void;

}> = ({
  gameConfig,
  handleHint,
  handleZoom,
  handleChange,
  learnItems,
  currentLearnIndex,
  onLearnItemClick,
  onSubmit
}) => {
    return (
      <QuestionComponent
        title={gameConfig.topic || ''}
        onHintClick={() => handleHint('Q1')}
        disableHint={!gameConfig.hint && !gameConfig.hintImage}
        useSoundDescriptionOnly={gameConfig.useSoundDescriptionOnly}
        descriptionSoundUrl={gameConfig.questionSound || ''}
        gameConfig={gameConfig}
      >
        <RenderQuestionContent
          gameConfig={gameConfig}
          handleZoom={handleZoom}
          handleChange={handleChange}
          learnItems={learnItems}
          currentLearnIndex={currentLearnIndex}
          onLearnItemClick={onLearnItemClick}
          onSubmit={onSubmit}
        />
      </QuestionComponent>
    );
  };

const RenderQuestionContent = ({
  gameConfig,
  handleZoom,
  handleChange,
  learnItems,
  currentLearnIndex,
  onLearnItemClick,
  onSubmit
}: {
  gameConfig: GameConfig;
  handleZoom: (img: string) => void;
  handleChange?: HandleChange;
  learnItems?: any[];
  currentLearnIndex?: number;
  onLearnItemClick?: (index: number) => void;
  onSubmit?: () => void;

}) => {
  return (
    <>
      <Latex>{gameConfig.question || ''}</Latex>
      {gameConfig.questionImage && (
        <QuestionImage image={gameConfig.questionImage} onZoom={handleZoom} />
      )}
      {gameConfig.questionType === 'input' && (
        <QuestionInputListComponent
          gameConfig={gameConfig}
          dataList={gameConfig.questionList}
          handleChange={handleChange}
        />
      )}
      {gameConfig.questionType === 'placeholder' && (
        <QuestionPlaceholderListComponent
          gameConfig={gameConfig}
          dataList={gameConfig.questionList}
          handleChange={handleChange}
        />
      )}
      {gameConfig.questionType === 'learn' && (
        <QuestionLearnComponent
          gameConfig={gameConfig}
          learnItems={learnItems}
          currentIndex={currentLearnIndex}
          onItemClick={onLearnItemClick}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default QuestionAndAnswerComponent;
