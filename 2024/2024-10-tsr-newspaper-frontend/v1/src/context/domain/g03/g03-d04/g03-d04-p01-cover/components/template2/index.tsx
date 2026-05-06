import { NewspaperTemplateProps } from '../cover';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import PreviewModal from '../preview-modal';
import { toDateTH } from '@global/helper/uh-date-time';
import getDailyNewspaperNumber from '@domain/g03/g03-d04/local/component/web/atom/get-daily-newspaper-number';

const Template2: React.FC<NewspaperTemplateProps> = (props) => {
  const { stateForm, onSave, onCancel } = props;
  const { title, content, content2, images, public_date } = stateForm;
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const templateRef = useRef<HTMLDivElement>(null);

  const templateA4 = {
    width: '595px',
    height: '845px',
  };

  const fixedContent = content.replace(/\\n/g, '\n');

  const handleSaveClick = async () => {
    await handleSave();
  };

  const handleSave = async () => {
    if (templateRef.current) {
      try {
        // สร้าง div ชั่วคราวสำหรับ capture
        const templateContent = templateRef.current;
        const clonedTemplate = templateContent.cloneNode(true) as HTMLElement;

        clonedTemplate.style.width = templateA4.width;
        clonedTemplate.style.height = templateA4.height;

        document.body.appendChild(clonedTemplate);

        const canvas = await html2canvas(clonedTemplate, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          removeContainer: true,
          imageTimeout: 0,
        });

        document.body.removeChild(clonedTemplate);

        const image = canvas.toDataURL('image/png', 1.0);
        setPreviewImage(image);
        setShowPreview(true);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `newspaper-${new Date().toISOString()}.png`;
    link.href = previewImage;
    link.click();
  };

  const handleConfirm = () => {
    setShowPreview(false);
    onSave(previewImage);
  };

  return (
    <div>
      <div className="flex gap-4 mb-20 mt-12">
        <button
          onClick={handleSaveClick}
          className="px-6 py-2 bg-[#D9A84E] text-white rounded-md hover:bg-[#c69746] transition-colors w-[148px] h-[38px] text-sm leading-[14px] font-semibold"
        >
          บันทึก
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-[90px] h-[38px] text-sm leading-[14px] font-semibold"
        >
          แก้ไข
        </button>
      </div>

      {/* Template content */}
      <div className="w-full md:h-[70vh] h-[60vh] flex justify-center items-center p-5  border border-[#B4B4B4] rounded-lg bg-white  overflow-scroll  dark:bg-[#626161] dark:border-none">
        <div
          ref={templateRef}
          className="transform scale-[0.5]  md:scale-100  min-w-[7in] h-[9.25in] md:origin-top origin-center mt-[100px]  md:mt-[500px]  border "
        >
          <div className=" bg-custom-gradient text-white h-[20%] pb-[10px] relative border border-[#000000] border-b-0">
            <div className="top-6 left-5 absolute w-[200px] h-[120px] border border-black bg-white flex items-center justify-center">
              {images[0] && (
                <img
                  src={URL.createObjectURL(images[0])}
                  className=" w-full h-full object-fill"
                  alt="images-1"
                />
              )}
            </div>
            <div className="flex flex-col relative right-10 text-black">
              <p className="absolute right-0 top-5">
                เลขที่ใบอนุญาต ISSN 3057-1405 (Online)
              </p>
              {/* <p className='absolute right-[240px] top-10' >หนังสือพิมพ์</p> */}
              <h1 className="absolute right-0 top-14  font-bold text-black text-[42px]">
                เว็บประกาศข่าว
              </h1>
              <p className="absolute right-0 top-[130px] ">
                ปีที่ {new Date(public_date).getFullYear() - 2024}{' '}
                ฉบับที่ {getDailyNewspaperNumber(new Date(public_date))}{' '}
                วันที่{' '}{toDateTH(public_date)}
              </p>
            </div>
          </div>
          <div className="grid h-[80%] px-5 py-3 dark:bg-white border border-[#000000]">
            <div className="grid  grid-cols-6 grid-rows-8 gap-2 ">
              <div className="col-span-4 row-span-1 border border-black flex items-center justify-center">
                <p className="text-center text-xl font-semibold leading-[25px] line-clamp-1">
                  {title}
                </p>
              </div>
              <div className="col-span-2 row-span-2 border border-black flex items-center justify-center">
                {images[1] && (
                  <img
                    src={URL.createObjectURL(images[1])}
                    className="w-full h-full object-fill"
                    alt="images-2"
                  />
                )}
              </div>

              <div className="col-span-4 row-span-3 border border-black  flex items-start justify-start">
                <p className="line-clamp-[9]  text-[14px]  font-normal leading-[25px] px-4 pt-2">{content}</p>
              </div>
              <div className="col-span-2 row-span-2  border border-black flex items-center justify-center">
                {images[2] && (
                  <img
                    src={URL.createObjectURL(images[2])}
                    className="w-full h-full object-fill"
                    alt="images-3"
                  />
                )}
              </div>

              <div className="min-h-[200px] col-span-6 row-span-4  border border-black flex items-start justify-start">
                <p className="line-clamp-[12] text-[14px] font-normal leading-[25px] px-5 pt-2">
                  {content2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        imageUrl={previewImage}
        onDownload={handleDownload}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Template2;
