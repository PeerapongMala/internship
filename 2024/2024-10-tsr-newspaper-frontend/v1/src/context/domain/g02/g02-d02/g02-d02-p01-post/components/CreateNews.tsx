import { th } from 'date-fns/locale/th';
import { useEffect, useState } from 'react';
import DatePicker, {
  ReactDatePickerCustomHeaderProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { renderDate, useFileStore } from '../../context';
import { imageToFile } from '../service/helper';
import { BinIcon, CameraIcon, ClockIcon, DatePickIcon, PdfIcon } from './Icons';
import { Link } from '@tanstack/react-router';
import AlertFailed from './AlertFailed';
import DateRangeSelector from '../../local/component/DateRangeSelector';

registerLocale('th', th);

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function CreateNews(props: { userRole: string | null }) {
  const fileUpload = useFileStore();
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const [disableUpload, setDisableUpload] = useState<boolean>(false);
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.PNG', '.png'],
      'image/jpg': ['.jpeg', '.jpg', '.JPEG', '.JPG'],
    },
    multiple: false,
    maxFiles: 1,
    onDropAccepted(files: File[], event) {
      const totalSize = fileUpload.file.reduce((partial, next) => partial + next.size, 0);

      if (totalSize + files[0].size > 5 * 1024 * 1024) {
        setIsShowAlert(true);
        return;
      }

      fileUpload.setFilesName(files[0].name);
      if (files[0].type === 'application/pdf') {
        setDisableUpload(true);
        try {
          const fileReader = new FileReader();
          fileReader.onload = async () => {
            const pdfData = fileReader.result;

            if (pdfData && typeof pdfData !== 'string') {
              const pdfDoc = await pdfjs.getDocument(new Uint8Array(pdfData)).promise;

              const imageList: File[] = [];
              for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                if (context) {
                  const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                  };

                  await page.render(renderContext).promise;
                  const imageFile = await imageToFile(
                    canvas,
                    `${files[0].name.replace('.', '-')}-page-${i}.png`,
                  );
                  imageList.push(imageFile);
                }
              }
              fileUpload.addFile(imageList);
            }
          };

          fileReader.readAsArrayBuffer(files[0]);
        } catch (err) {
          console.error(err);
        }
      } else {
        setDisableUpload(false);
        fileUpload.addFile(files);
      }
    },
  });

  return (
    <div className="flex justify-center py-20 px-4 lg:px-20 mb-20">
      <div className="bg-white dark:bg-[#262626] py-[55px] md:px-[52px] px-[27px] rounded-[20px] flex flex-col gap-[58px] w-full max-w-[760px] items-center drop-shadow">
        <p className="font-semibold text-[24px] sm:text-[40px] leading-[40px] text-[#101828] dark:text-white">
          ลงประกาศหนังสือพิมพ์
        </p>
        <div className="flex flex-col gap-[48px] w-full">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-[16px] leading-4 text-[#414141] dark:text-[#D7D7D7]">
              ลงประกาศ <span className="text-[#FF0000]">*</span>
            </p>
            {fileUpload.file.length === 0 ? (
              <div
                {...getRootProps()}
                onClick={open}
                className={`w-full h-[267px] border-dashed border-4 border-secondary rounded-[12px] flex flex-col justify-center items-center gap-2 ${
                  props.userRole === null ? 'cursor-not-allowed' : 'hover:cursor-pointer'
                }`}
              >
                <div className="flex gap-[10px]">
                  <CameraIcon /> <PdfIcon />
                </div>
                <p className="text-secondary text-center text-[14px] leading-[20px]">
                  อัปโหลดไฟล์
                  <br /> Resolution: 1240 × 1754px <br />
                  format: .pdf, .jpg, .png | ขนาดไม่เกิน 5 MB
                </p>
                <input
                  {...getInputProps({})}
                  className="hidden"
                  disabled={props.userRole === null}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-[48px]">
                <img
                  src={URL.createObjectURL(fileUpload.file[0])}
                  className="h-[158px] w-[110.99px] object-cover border-[2px] border-black"
                />

                <div className="text-[#414141] dark:text-[#D7D7D7] text-[16px] leading-4 flex flex-col gap-2">
                  {fileUpload.filesName.map((item) => (
                    <p>{item}</p>
                  ))}
                </div>
                <button
                  className="text-[#414141] dark:text-[#D7D7D7] text-[14px] leading-[14px] border-[1px] border-[#737373] px-[23px] py-[17px] rounded-md w-fit"
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                >
                  อัปโหลดไฟล์
                </button>
                <input
                  {...getInputProps({})}
                  className="hidden"
                  disabled={props.userRole === null}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[16px] leading-4 text-[#414141] dark:text-[#D7D7D7]">
              วันที่ลงประกาศ <span className="text-[#FF0000]">*</span>
            </p>
            <div className="relative w-[150px]">
              <DateRangeSelector
                label="ตั้งแต่วันที่"
                value={fileUpload.date}
                onChange={(date) => fileUpload.setDate(date as Date)}
                minDate={tomorrow}
              />
            </div>
            <p className="text-red-600 pt-5 max-w-[610px]">
              หากต้องการเผยแพร่ประกาศในวันทำการถัดไป โปรดอัปโหลดเนื้อหาและชำระเงินภายใน
              18.00 น. ของวันนี้
            </p>
            <p className="text-red-600 pt-5">
              กรณีเร่งด่วน กรุณาติดต่อเจ้าหน้าที่ทางอีเมล{' '}
              <a href="mailto:hello@prakardkhao.com" className="text-secondary">
                hello@prakardkhao.com
              </a>{' '}
              ภายใน 21.00 น.
            </p>
            <div className="flex flex-col gap-[15px] max-w-[620px] pt-5">
              <Link to="/faq">
                <p className="max-w-[560px] font-normal text-[12px] leading-6 text-[#262626] dark:text-[#D7D7D7] ">
                  <span className="font-semibold">หมายเหตุ : </span>{' '}
                  เนื้อหาที่ลงประกาศต้องเป็นไปตาม "ข้อกําหนดการใช้งาน" ซึ่งตรวจสอบได้จาก{' '}
                  <Link className="text-secondary font-semibold underline" to="/faq">
                    คําถามที่พบบ่อย{' '}
                  </Link>
                  ทั้งนี้บริษัทขอสงวนสิทธิ์ในการพิจารณานําออกเผยแพร่
                </p>
              </Link>
            </div>
          </div>
        </div>
        <Link
          to={'/post/verify'}
          disabled={props.userRole === null || fileUpload.file.length === 0}
          className={`w-[152px] h-[38px] rounded-[6px] px-[12px] gap-[16px] flex items-center justify-center ${props.userRole === null || fileUpload.file.length === 0 ? 'bg-[#D7D7D8] hover:cursor-not-allowed' : 'bg-secondary'}`}
        >
          <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
            ตรวจสอบประกาศ
          </p>
        </Link>
      </div>
      {isShowAlert && <AlertFailed onClose={() => setIsShowAlert(false)} />}
    </div>
  );
}

export default CreateNews;
