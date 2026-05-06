import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import Button from '@global/component/web/atom/wc-a-button';
import StoreLevel from '@store/global/level';
import ImageIconZoomIn from '../../../assets/icon-zoom-in.svg';

interface QuestionImageProps {
  image?: string;
  disabledZoom?: boolean;
  onZoom?: (image: string) => void;
}

const QuestionImage = ({ image, disabledZoom, onZoom }: QuestionImageProps) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);

  return (
    <div className="relative w-full bg-white rounded-3xl aspect-w-16 aspect-h-9">
      <ImageLessonLocal
        src={image || ''}
        query={{
          lessonId: queryId?.lessonId,
          sublessonId: queryId?.sublessonId,
          levelId: queryId?.levelId,
          questionId: queryId?.questionId,
        }}
        className="w-full h-full object-cover rounded-3xl"
      />
      {!disabledZoom && (
        <div className="absolute bottom-0 right-0 ">
          <Button
            className={`rounded-none rounded-tl-[27px] rounded-br-[24px]`}
            onClick={() => onZoom && onZoom(image || '')}
            variant="secondary"
            width="43px"
            height="43px"
            style={{
              boxShadow: 'none',
            }}
          >
            <img
              src={ImageIconZoomIn}
              className="inline-block w-[25px] h-[25px] my-[6px] pt-[2px]"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionImage;
