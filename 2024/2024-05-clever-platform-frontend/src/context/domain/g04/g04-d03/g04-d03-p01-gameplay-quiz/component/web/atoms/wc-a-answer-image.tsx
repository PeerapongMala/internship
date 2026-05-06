import Button from '@component/web/atom/wc-a-button';
import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import StoreLevel from '@store/global/level';
import ImageIconZoomIn from '../../../assets/icon-zoom-in.svg';
interface IButtonProps {
  id: string;
  choice?: string;
  image?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  onCanceled?: () => void;
  is_openZoom?: boolean;
  disabledZoom?: boolean;
  onZoom?: (image: string) => void;
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
  is_openZoom = false,
  disabledZoom,
  onZoom
}: IButtonProps) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);

  return (
    <div
      id={id}
      className={` relative flex flex-col justify-center items-center rounded-[30px] cursor-pointer h-[123px] select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] 
        bg-white  border-slate/50 z-[9999]
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        ${selected ? 'bg-yellow-300 border-[3px] border-secondary-stroke' : ''}

      `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
      onClick={onClick}
    >

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
          className={`w-full h-full object-contain rounded-[30px]
                

            `}
        />
      )}
      <div className={`absolute top-0.5 right-1 size-[30px] bg-yellow-300 rounded-full flex justify-center items-centers

      `}
      >
        <p className='flex justify-end items-center text-[24px]'>  {choice}</p>

      </div>
      {/* {image && <img src={image} alt="answer" className="h-20" />} */}
      {onCanceled && (
        <img
          className="h-8 cursor-pointer  absolute top-0 left-0"
          src={ImageCancelCircle}
          onClick={onCanceled}
        />
      )}
      {is_openZoom && !disabledZoom && (
        <div className="absolute bottom-0 right-0">
          <Button
            className="rounded-none rounded-tl-[27px] rounded-br-[24px]"
            onClick={() => onZoom && onZoom(image || '')}
            variant="secondary"
            width="35px"
            height="35px"
            style={{ boxShadow: 'none' }}
          >
            <img
              src={ImageIconZoomIn}
              className="inline-block w-[20px] h-[20px] my-[6px] pt-[2px]"
            />
          </Button>
        </div>
      )}


    </div>
  );
};

export default AnswerImage;
