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
}) => {
  return (
    <Question
      title={title}
      onHintClick={onHintClick}
      disableHint={disableHint}
      useSoundDescriptionOnly={useSoundDescriptionOnly}
      descriptionSoundUrl={descriptionSoundUrl}
    >
      {children}
    </Question>
  );
};

export default QuestionComponent;
