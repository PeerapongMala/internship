import { QuestionProps } from '../../../type';
import Question from '../organisms/wc-o-question';

const QuestionComponent: React.FC<QuestionProps> = ({
  title,
  onHintClick,
  children,
  text,
  disableHint,
  useSoundDescriptionOnly,
  descriptionSoundUrl,
  gameConfig
}) => {
  return (
    <Question
      title={title}
      onHintClick={onHintClick}
      disableHint={disableHint}
      useSoundDescriptionOnly={useSoundDescriptionOnly}
      descriptionSoundUrl={descriptionSoundUrl}
      gameConfig={gameConfig}
    >
      {children}
    </Question>
  );
};

export default QuestionComponent;
