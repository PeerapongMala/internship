import { ReactNode, useState } from 'react';
import { LeftIcon, RightIcon, XIcon } from '../../../local/icon/icon-pdf';
import { downloadProp } from '../../../local/type';
import { toDateTH } from '@global/helper/uh-date-time';
type Props = {
  data: {
    image_url_list: string[];
    preview_url: string;
    index: number;
    public_date: string
  }[];
  handleOpenModal: (input: boolean) => void;
};

function PreviewPdf({ data, handleOpenModal }: Props) {

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPreviewPage, setIsPreviewPage] = useState<boolean>(true);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[1000] flex justify-center items-center text-white"
        onClick={() => handleOpenModal(false)}
      >
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          ไม่มีข้อมูลสำหรับแสดง
        </div>
      </div>
    );
  }

  const handleSlide = (direction: 'left' | 'right') => {
    setCurrentIndex((prevIndex) => {
      const totalImages = data[0].image_url_list.length;

      if (isPreviewPage) {
        if (direction === 'right') {
          setIsPreviewPage(false);
          return 0;
        }
        return prevIndex;
      }

      let newIndex = direction === 'right' ? prevIndex + 4 : prevIndex - 4;
      if (newIndex >= totalImages) {
        setIsPreviewPage(true);
        return 0;
      }
      if (newIndex < 0) {
        if (prevIndex === 0) {
          setIsPreviewPage(true);
          return prevIndex;
        }
        return Math.max(totalImages - 4, 0);
      }

      return newIndex;
    });
  };




  const currentImages = isPreviewPage
    ? [{ src: data[0].preview_url, isPreview: true }]
    : data[0].image_url_list
      .slice(currentIndex, currentIndex + 4)
      .map((img) => ({ src: img, isPreview: false }));
  const isLeftDisabled = isPreviewPage && currentIndex === 0;
  const isRightDisabled =
    (!isPreviewPage && currentIndex + 4 >= data[0].image_url_list.length);

  const pageNumber = Math.floor(currentIndex / 4) + 2;

  return (
    <dialog
      open
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[1000] overflow-auto flex justify-center items-center"
    >
      <button className="absolute top-4 right-2" onClick={() => handleOpenModal(false)}>
        <XIcon />
      </button>
      <button
        className={`absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 ${isLeftDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={() => handleSlide('left')}
        disabled={isLeftDisabled}
      >
        <LeftIcon />
      </button>

      <button
        className={`absolute right-2 md:right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 ${isRightDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={() => handleSlide('right')}
        disabled={isRightDisabled}
      >
        <RightIcon />
      </button>
      <div className="flex items-center justify-center w-[250px] h-[400px] md:h-[650px] md:w-[400px] xl:p-0 xl:w-[480px] 2xl:w-[595px]  lg:h-[550px]  xl:h-[700px] 2xl:h-[842px]  ">
        <div className="flex  justify-center w-full h-full bg-white">
          {isPreviewPage ? (
            <div className="flex justify-center items-center w-full h-full">
              <img
                className="object-fit w-full h-full"
                src={data[0].preview_url}
                alt="Preview Full"
              />
            </div>
          ) : (

            <div className='w-full h-full flex flex-col'>
              <div className='flex justify-between items-center px-5 font-semibold pt-5 text-[8px] md:text-[12px] xl:text-[16px]'>
                <p>เว็บประกาศข่าว</p>
                <p className="xl:pl-10 pl-5 ">หน้าที่ {pageNumber}</p>
                <p>วันที่ {toDateTH(data[0].public_date)}</p>
              </div>

              <div
                className={`w-full  grid  px-5 py-3 xl:py-5  ${currentImages.length === 0 ? '' : 'grid-cols-2'}  `}
              >
                {currentImages.map((item, index) => (
                  <div key={index} className="w-full flex justify-center px border-[0.1px] border-[#888787] ">
                    <img
                      className="object-cover xl:h-[300px] 2xl:h-[352px] xl:w-full w-[130px] h-[150px] md:w-[150px] md:h-[250px]"
                      src={item.src}
                      alt={`Image ${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>

          )}
        </div>
      </div>
    </dialog>
  );
}

export default PreviewPdf;
