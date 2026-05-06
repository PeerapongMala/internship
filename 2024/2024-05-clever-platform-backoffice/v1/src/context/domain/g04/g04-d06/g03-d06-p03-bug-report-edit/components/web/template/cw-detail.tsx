import CWImageUploadPreview from '@domain/g04/g04-d01/local/component/web/cw-image-upload-preview';
import { toDateTimeTH } from '@global/utils/date';
import { IBugReportDetailProps } from '@domain/g04/g04-d05/local/type';
import { platfroms, priority, type } from '@domain/g04/g04-d06/local/components/option';

interface DetailProp {
  data?: IBugReportDetailProps | null;
}

const CWDetail = ({ data }: DetailProp) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-[24px] font-bold">แจ้งโดย</h1>
      <div className="mt-5 flex flex-col gap-3 pb-5">
        <div className="flex items-center">
          <p className="mb-2 block w-[30%] text-sm text-[#0E1726]">รหัสบัญชี:</p>
          <p className="w-full">{data?.creator_id}</p>
        </div>
        <div className="flex items-center">
          <p className="mb-2 block w-[30%] text-sm text-[#0E1726]">ชื่อ-สกุล:</p>
          <p className="w-full">{data?.created_by}</p>
        </div>
        <div className="flex items-center">
          <p className="mb-2 block w-[30%] text-sm text-[#0E1726]">ตำแหน่ง:</p>
          <p className="w-full">{data?.role}</p>
        </div>
      </div>
      <hr />
      <div className="mt-5 w-full">
        <h1 className="text-[18px] font-bold">รายงาน</h1>
        <div className="mt-5 grid w-full grid-cols-3 gap-5">
          <div className="col-span-3 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>วันที่แจ้ง
            </p>
            <p className="px-4">
              {data?.created_at ? toDateTimeTH(new Date(data.created_at)) : '-'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ระบบปฏิบัติการ
            </p>
            <p className="px-4">{data?.os || '-'}</p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>เบราว์เซอร์
            </p>
            <p className="px-4">{data?.browser || '-'}</p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ประเภทปัญหา
            </p>
            <p className="px-4">
              {(() => {
                const _type = type.find((type) => type.value == data?.type);
                return _type?.label ?? data?.type;
              })()}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ประเภทบริการ
            </p>
            <p className="px-4">
              {(() => {
                const _platform = platfroms.find(
                  (platform) => platform.value == data?.platform,
                );
                return _platform?.label ?? data?.platform;
              })()}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>เวอร์ชั่น
            </p>
            <p className="px-4">{data?.version}</p>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ความสำคัญ
            </p>
            <p className="px-4">
              {(() => {
                const _priority = priority.find(
                  (priority) => priority.value == data?.priority,
                );
                return _priority?.label ?? data?.priority;
              })()}
            </p>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>URL ที่พบปัญหา
            </p>
            <p className="px-4">{data?.url || '-'}</p>
          </div>
          <div className="col-span-3 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ปัญหา
            </p>
            <p className="px-4">{data?.description}</p>
          </div>
          {data?.images && data?.images.length > 0 && (
            <div className="col-span-3 flex w-full flex-col gap-1.5">
              <p>
                <span className="text-red-500">*</span>รูปภาพ
              </p>
              <div className="flex gap-1">
                {data?.images?.map((image, index) => {
                  return (
                    <CWImageUploadPreview
                      key={index}
                      value={image}
                      disabled={true}
                      className="h-auto w-auto max-w-full"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CWDetail;
