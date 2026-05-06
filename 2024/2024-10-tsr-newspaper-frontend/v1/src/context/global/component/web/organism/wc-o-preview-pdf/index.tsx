import { useState } from 'react';
import { LeftIcon, RightIcon, XIcon } from '../../../../../domain/g02/g02-d02/g02-d02-p02-verify/components/Icons';

type Props = {
  data: { src: string }[];
  handleOpenModal: (input: boolean) => void;
};

function PreviewPdf({ data, handleOpenModal }: Props) {
  const [preview, setPreview] = useState<number>(0);

  const handleClickSlide = (direction: 'left' | 'right') => {
    setPreview((prevIndex) =>
      direction === 'right'
        ? (prevIndex + 1) % data.length
        : (prevIndex - 1 + data.length) % data.length
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleOpenModal(false); // ปิด modal เมื่อคลิก overlay
    }
  };

  return (
    <div
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[1000] flex justify-center items-center "
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-md shadow-lg -top-20 ">
        <button
          className="fixed top-4 right-4"
          onClick={() => handleOpenModal(false)}
          aria-label="Close"
        >
          <XIcon />
        </button>

        {data.length > 1 && (
          <>
            <button
              className="fixed md:left-8 sm:left-6 left-4 top-1/4 w-40 h-1/2 flex justify-start items-center"
              onClick={() => handleClickSlide('left')}
              aria-label="Previous"
            >
              <div className='w-12 h-12 left-0'>
                <LeftIcon />
              </div>

            </button>
            <button
              className="fixed md:right-8 sm:right-6 right-4 top-1/4 w-40 h-1/2 flex justify-end items-center"
              onClick={() => handleClickSlide('right')}
              aria-label="Next"
            >
              <div className='w-12 h-12 right-0'>
                <RightIcon />
              </div>

            </button>
          </>
        )}

        <div className="flex w-full h-full items-center justify-center">
          <div className="md:max-w-[500px] sm:max-w-[400px] max-w-[300px]">
            <img src={data[preview].src} alt={`Preview ${preview + 1}`} />
          </div>
        </div>

        {data.length > 1 && (
          <div className="w-full fixed left-0 bottom-0 flex justify-center gap-8 px-5 xl:px-40 pb-10 overflow-x-scroll whitespace-nowrap">
            {data.map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer ${index === preview ? 'border-4 border-secondary' : ''} flex-shrink-0`}
                onClick={() => setPreview(index)}
              >
                <img src={item.src} alt={`Thumbnail ${index + 1}`} className="w-[80px] h-auto" />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default PreviewPdf;
