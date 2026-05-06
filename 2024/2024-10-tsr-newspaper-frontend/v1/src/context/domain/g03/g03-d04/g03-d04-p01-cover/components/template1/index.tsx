import { toDateTH } from '@global/helper/uh-date-time';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { NewspaperTemplateProps } from '../cover';
import PreviewModal from '../preview-modal';
import getDailyNewspaperNumber from '@domain/g03/g03-d04/local/component/web/atom/get-daily-newspaper-number';
const templateA4 = {
  width: '595px',
  height: '825px',
};

const Template1: React.FC<NewspaperTemplateProps> = ({ stateForm, onSave, onCancel }) => {
  const { title, content, images, public_date } = stateForm;
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState(true);
  const templateRef = useRef<HTMLDivElement>(null);

  const fixedContent = content.replace(/\\n/g, '\n');

  useEffect(() => {
    generatePreview();
  }, []);

  const generatePreview = async () => {
    if (templateRef.current) {
      try {
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
        setIsGenerating(false);
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

  const handleSaveClick = async () => {
    setShowPreview(true);
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
      <div className="w-full md:h-[70vh] h-[60vh] flex justify-center py-10 px-[33px] md:p-20 border border-[#B4B4B4] rounded-lg bg-white overflow-scroll dark:bg-[#626161] dark:border-none">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="mt-4 text-gray-500">กำลังสร้างภาพ...</p>
          </div>
        ) : (
          <div className="min-w-[293px] min-h-[414px] md:w-[595px] md:h-[825px]">
            <img src={previewImage} alt="Preview" className="w-full h-full" />
          </div>
        )}
      </div>

      {/* ซ่้อน template หลังจาก html2canvas */}
      <div className="hidden">
        <div
          ref={templateRef}
          className={`w-[${templateA4.width}] h-[${templateA4.height}]`}
        >
          <div className="bg-custom-gradient relative flex items-center justify-center">
            <div>
              <p className="text-[#281E0B] font-semibold text-[52.01px] font-[Anuphan]">
                เว็บประกาศข่าว
              </p>
            </div>
            <div className="absolute right-[14.36px] bottom-[10px]">
              {/* <p className="text-[15.6px] font-[Anuphan] font-semibold">ราคา 10 บาท</p> */}
            </div>
          </div>

          <div className="h-[32px] flex items-center justify-between border border-b-[#B4B4B4] border-t-0 border-[#000000] border-solid font-normal text-sm">
            <div className="flex items-start gap-x-[5px] px-[14px]">
              <p className="w-full line-clamp-1">
                ปีที่ {new Date(public_date).getFullYear() - 2024}{' '}
                ฉบับที่ {getDailyNewspaperNumber(new Date(public_date))}{' '}
                วันที่ {toDateTH(public_date)}
              </p>
            </div>
            <div className="w-[290px] line-clamp-1">
              <p>เลขที่ใบอนุญาต ISSN 3057-1405 (Online)</p>
            </div>
          </div>

          <div className="flex p-4 gap-4 border border-t-0 border-black h-[715px]">
            <div className="flex flex-col w-[60%] h-full gap-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="aspect-square h-[calc((100%-32px)/3)] border border-black flex items-center justify-center dark:bg-white overflow-hidden"
                >
                  {images[item] ? (
                    <img
                      src={URL.createObjectURL(images[item])}
                      className="w-full h-full object-cover"
                      alt="images-1"
                    />
                  ) : (
                    <span className="text-sm">พื้นที่โฆษณา</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col w-full h-full overflow-hidden">
                <div className="h-full w-full flex flex-col items-start justify-start  overflow-hidden">
                  <p className="w-full text-xl font-bold leading-[30px] break-words max-w-full overflow-hidden">
                    {title}
                  </p>
                <p className="text-[14px] w-full font-normal leading-[25px] break-words pt-2 whitespace-pre-wrap overflow-hidden max-w-full">
                    {fixedContent.split('\n').map((line, index) => (
                      <span key={index} className="inline-block w-full">
                        {line}
                        {index < fixedContent.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
          <div className="h-10" />
        </div>
      </div>
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

export default Template1;
