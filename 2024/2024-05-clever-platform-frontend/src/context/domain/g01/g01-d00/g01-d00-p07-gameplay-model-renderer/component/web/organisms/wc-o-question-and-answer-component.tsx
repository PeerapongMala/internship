import React from 'react';
import Latex from 'react-latex-next';
import { GameConfig, HandleChange, QuestionAndAnswerProps } from '../../../type';
import QuestionImage from '../atoms/wc-a-question-image';
import QuestionComponent from '../molecules/wc-m-question-component';
import QuestionInputListComponent from '../molecules/wc-m-question-input-list-component';
import QuestionPlaceholderListComponent from '../molecules/wc-m-question-placeholder-list-component';

const QuestionAndAnswerComponent: React.FC<QuestionAndAnswerProps> = ({
  gameConfig,
  handleHint,
  handleZoom,
  handleChange,
}) => {
  return (
    <QuestionComponent
      title={gameConfig.topic || ''}
      onHintClick={() => handleHint('Q1')}
      disableHint={!gameConfig.hint && !gameConfig.hintImage}
      useSoundDescriptionOnly={gameConfig.useSoundDescriptionOnly}
      descriptionSoundUrl={gameConfig.questionSound || ''}
    >
      <RenderQuestionContent
        gameConfig={gameConfig}
        handleZoom={handleZoom}
        handleChange={handleChange}
      />
    </QuestionComponent>
  );
};

const RenderQuestionContent = ({
  gameConfig,
  handleZoom,
  handleChange,
}: {
  gameConfig: GameConfig;
  handleZoom: (img: string) => void;
  handleChange?: HandleChange;
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
    </>
  );
};

export default QuestionAndAnswerComponent;
