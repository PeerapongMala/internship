import { useState, useEffect } from 'react';
import { FileWithPreview } from '../file-upload';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '../create-crop-image';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  prevFiles: FileWithPreview | undefined;
  handleClose: () => void;
  handleCrop: (croppedFile: File) => void;
}

const ImagePreviewDialog = (props: ImagePreviewDialogProps) => {
  const { isOpen, prevFiles, handleClose, handleCrop } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [inputValue, setInputValue] = useState<number>(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!prevFiles?.file) return;

    const url = URL.createObjectURL(prevFiles.file);
    setImagePreviewUrl(url);

    //cleanup ImagePreview
    return () => {
      URL.revokeObjectURL(url);
      setImagePreviewUrl('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setInputValue(0);
      setCroppedAreaPixels(null);
    };
  }, [prevFiles]);

  const onCropComplete = async (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    if (!imagePreviewUrl || !croppedAreaPixels || !prevFiles?.file || isProcessing)
      return;

    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imagePreviewUrl, croppedAreaPixels);
      const base64Response = await fetch(croppedImage as string);
      const blob = await base64Response.blob();
      const croppedFile = new File([blob], prevFiles.file.name, {
        type: prevFiles.file.type,
      });

      handleCrop(croppedFile);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value);
    setZoom(Math.min(Math.max(newZoom, 1), 3));
    setInputValue(+event.target.value);
  };

  const handleButtonClick = () => {
    setInputValue(inputValue + 0.1);
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="relative m-4 rounded-lg bg-white dark:bg-[#414141] shadow-sm"
          role="dialog"
        >
          <div className="flex items-center justify-between p-4">
            <p className="text-xl font-semibold leading-5 mt-5 dark:text-[#D7D7D7]">
              Edit image
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md bg-white border border-transparent shadow-lg text-center hover:border-[#0000001A] text-sm text-black transition-all hover:shadow-md w-[16px] h-[16px] md:w-[28px] md:h-[28px]"
                type="button"
                onClick={handleClose}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.4031 7.25586L7.01465 20.6443M7.01465 7.25586L20.4031 20.6443"
                      stroke="#000000"
                      strokeWidth="2.23141"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div>
            {imagePreviewUrl && (
              <div className="relative md:mx-[18px] p-0 w-[320px] h-[163px] md:w-[639px] md:h-[295px] bg-[#background: #00000033;]">
                <Cropper
                  image={imagePreviewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1440 / 632}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            )}
          </div>

          <div className="mt-9">
            <div className="w-[318px] md:w-[638px] flex justify-center items-center gap-x-[11px]">
              <div className="w-[264px] flex">
                <input
                  id="default-range"
                  type="range"
                  value={inputValue}
                  min={1}
                  step={0.1}
                  max={3}
                  className="w-full h-2 bg-[#D9D9D9] dark:bg-[#FFFFFF] rounded-[4px] appearance-none cursor-pointer"
                  onInput={handleInputChange}
                />
              </div>
              <div>
                <button className="flex items-center mx-auto" onClick={handleButtonClick}>
                  <svg
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4063 8.17822H1M7.20312 1.9751V14.3813"
                      stroke="#262626"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 items-center justify-end p-4 text-blue-gray-500">
            <button
              className="flex items-center rounded-md border border-[#9096A2] py-2 px-4 text-center text-sm transition-all font-bold shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:bg-[#9096A2] dark:text-[#D7D7D7]"
              type="button"
              onClick={handleClose}
            >
              ยกเลิก
            </button>
            <button
              className="flex items-center rounded-md border-2 bg-[#D9A84E] border-[#D9A84E] py-2 px-4 text-center text-sm transition-all font-bold hover:shadow-lg text-[#FBFBFB] hover:text-[#D9A84E] hover:border-[#D9A84E] hover:border-2 hover:bg-[#FBFBFB] focus:text-[#D9A84E] focus:bg-[#FBFBFB] focus:border-[#D9A84E] active:border-[#D9A84E] active:text-[#D9A84E] active:bg-[#FBFBFB] disabled:pointer-events-none"
              type="button"
              onClick={showCroppedImage}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewDialog;
