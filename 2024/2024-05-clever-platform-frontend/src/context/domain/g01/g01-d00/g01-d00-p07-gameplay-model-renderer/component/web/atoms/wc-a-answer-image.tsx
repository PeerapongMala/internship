import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import StoreLevel from '@store/global/level';

interface IButtonProps {
  id: string;
  choice?: string;
  image?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  onCanceled?: () => void;
}

const AnswerImage = ({
  id,
  choice,
  image,
  className = '',
  onClick,
  disabled,
  selected,
  onCanceled,
}: IButtonProps) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);

  return (
    <div
      id={id}
      className={`relative flex flex-col justify-center items-center rounded-[30px] cursor-pointer h-[123px] select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] 
        bg-white border-b-4 border-slate/50
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        ${selected ? '!bg-secondary-stroke' : ''}
      `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
      onClick={onClick}
    >
      {/* {image && <img src={image} alt="answer" className="h-20" />} */}
      {image && (
        <ImageLessonLocal
          alt="answer"
          src={image || ''}
          query={{
            lessonId: queryId?.lessonId,
            sublessonId: queryId?.sublessonId,
            levelId: queryId?.levelId,
            questionId: queryId?.questionId,
          }}
          className="h-20"
        />
      )}
      <div>{choice}</div>
      {onCanceled && (
        <img
          className="h-8 cursor-pointer px-2"
          src={ImageCancelCircle}
          onClick={onCanceled}
        />
      )}
    </div>
  );
};

export default AnswerImage;
