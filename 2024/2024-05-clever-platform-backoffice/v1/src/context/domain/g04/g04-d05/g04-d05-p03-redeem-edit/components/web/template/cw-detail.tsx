import { useState, useEffect } from 'react';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWImageUploadPreview from '@domain/g04/g04-d01/local/component/web/cw-image-upload-preview';
import { BugReport, BugReportStatus } from '@domain/g04/g04-d06/local/type';
import { toDateTH, toDateTimeTH } from '@global/utils/date';
import { Redeem } from '@domain/g04/g04-d05/local/type';

interface DetailProp {
  data?: Redeem;
}

const CWDetail = ({ data }: DetailProp) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="my-5 w-full">
        <h1 className="text-[24px] font-bold">รายละเอียดคูปอง</h1>
        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <div className="col-span-1 w-full">
            <CWInput
              label={'รหัสโค้ดปูปอง'}
              required
              value={data.code} // Display coupon code from data
            />
          </div>
        </div>

        <div className="mt-3 grid w-full grid-cols-4 gap-5">
          <div className="col-span-2 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>วันที่แจ้ง
            </p>
            <div className="flex gap-5">
              <WCAInputDateFlat
                value={data.started_at ? toDateTH(data.started_at) : undefined}
              />{' '}
              {/* Format date */}
              <input
                id="time"
                type="time"
                value={data.started_at ? toDateTimeTH(data.started_at) : undefined} // Extract time from date
                className="w-full rounded-md border-[1.5px] border-neutral-300 px-5"
              />
            </div>
          </div>
          <div className="col-span-2 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>วันที่หมดอายุ
            </p>
            <div className="flex gap-5">
              <WCAInputDateFlat value={toDateTH(data.ended_at)} /> {/* Format date */}
              <input
                id="time"
                type="time"
                value={toDateTimeTH(data.ended_at)} // Extract time from date
                className="w-full rounded-md border-[1.5px] border-neutral-300 px-5"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 w-full gap-5">
          <p>
            <span className="text-red-500">*</span>สถานะ
          </p>
          <div className="grid w-full grid-cols-2 gap-5">
            <CWSelect
              required
              className="col-span-1"
              value={data.show_status} // Display status from data
            />
            <CWInput
              required
              className="col-span-1"
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              value={data.used_count} // Display used coupons from data
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5 w-full">
        <h1 className="text-[18px] font-bold">การแจกไอเทม</h1>

        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWInput
            label={'เหรียญทอง'}
            required
            className="col-span-1"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
          />
          <CWInput
            label={'เหรียญ arcade'}
            required
            className="col-span-1"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWInput
            label={'น้ำแข็ง'}
            required
            className="col-span-1"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
          />
        </div>
        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWSelect label={'ตัวละคร'} required className="col-span-1" />
          <CWSelect label={'สัวต์เลี้ยง'} required className="col-span-1" />
        </div>
      </div>
    </div>
  );
};

export default CWDetail;
