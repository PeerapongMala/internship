import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWImageUploadPreview from '../cw-image-upload-preview';

const CWDetail = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-[24px] font-bold">แจ้งโดย</h1>
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center">
          <label className="mb-2 block w-[30%] text-sm text-gray-700">รหัสบัญชี:</label>
          <p className="w-full">-</p>
        </div>
        <div className="flex items-center">
          <label className="mb-2 block w-[30%] text-sm text-gray-700">ชื่อ-สกุล:</label>
          <p className="w-full">-</p>
        </div>
        <div className="flex items-center">
          <label className="mb-2 block w-[30%] text-sm text-gray-700">ตำแหน่ง:</label>
          <p className="w-full">-</p>
        </div>
      </div>
      <hr />
      <div className="mt-5 w-full">
        <h1 className="text-[18px] font-bold">รายละเอียดปัญหา</h1>
        <div className="mt-5 grid w-full grid-cols-3 gap-6">
          <CWInput label={'ระบบปฎิบัติการ:'} required placeholder="เช่น Android 11" />

          <CWInput
            label={'เบราว์เซอร์:'}
            required
            placeholder="เช่น Chrome 132 (www.whatsmybrowser.org/)"
          />

          <CWSelect label={'ประเภทปัญหา:'} required />

          <CWSelect label={'บริการ:'} required />

          <CWSelect label={'เวอร์ชั่น:'} required />

          <CWSelect label={'ระดับความสำคัญ:'} required />
        </div>

        <div className="mt-5 flex min-h-[383px] w-full flex-col gap-2">
          <div className="flex w-full items-center">
            <CWInput
              label={'URL ที่พบปัญหา:'}
              role="3"
              placeholder="เช่น https://example.com/page-with-issue"
              className="w-full"
            />
          </div>

          <div className="flex w-full items-center">
            <CWInput
              label={'ปัญหา:'}
              role="3"
              required
              placeholder="เช่น https://example.com/page-with-issue"
              className="min-h-[95px] w-full"
            />
          </div>

          <div className="flex h-fit w-full flex-col gap-1">
            <p className="">
              <span className="text-red-500">*</span>รูปภาพ:
            </p>
            <CWImageUploadPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CWDetail;
