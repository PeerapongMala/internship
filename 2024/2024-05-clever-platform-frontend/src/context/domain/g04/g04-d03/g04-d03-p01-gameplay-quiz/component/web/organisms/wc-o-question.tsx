import { GameConfig } from '../../../type';
import Body from '../molecules/wc-m-question-body';
import Title from '../molecules/wc-m-question-title';

interface QuestionProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  bodyClassName?: string;
  titleClassName?: string;
  disableHint?: boolean;
  showHint?: boolean;
  onHintClick?: () => void;
  useSoundDescriptionOnly?: boolean;
  descriptionSoundUrl?: string;
  gameConfig?: GameConfig;
}

const Question = ({
  className,
  children,
  title,
  bodyClassName,
  titleClassName,
  disableHint,
  showHint,
  onHintClick,
  useSoundDescriptionOnly,
  descriptionSoundUrl,
  gameConfig
}: QuestionProps) => {
  return (
    <div
      className={`flex flex-col h-full w-full bg-white/70 rounded-[40px] p-2 overflow-auto ${className}`}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Title
        title={title}
        className={titleClassName}
        disableHint={disableHint}
        showHint={showHint}
        onHintClick={onHintClick}
        gameConfig={gameConfig}
      />
      <Body
        className={bodyClassName}
        useSoundDescriptionOnly={useSoundDescriptionOnly}
        soundUrl={descriptionSoundUrl}
        gameConfig={gameConfig}
      >
        {children}
      </Body>
    </div>
  );
};

export default Question;
