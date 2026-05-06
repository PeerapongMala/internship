import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import { useState, useEffect } from 'react';

interface CWDetailProps {
  petList: { id: number; model_id: string }[];
  avatarList: { id: number; model_id: string; level: number }[];
}

const CWDetail = ({ petList, avatarList }: CWDetailProps) => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [stockType, setStockType] = useState<'จำกัด' | 'ไม่จำกัด'>('จำกัด');
  const [stock, setStock] = useState<number | string>('');

  return (
    <div className="w-full">
      <div className="my-5 w-full">
        <h1 className="text-[24px] font-bold">รายละเอียดคูปอง</h1>

        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <div className="col-span-1 w-full">
            <CWInput name="coupon_code" label="รหัสโค้ดคูปอง" required />
          </div>
        </div>

        <div className="mt-3 grid w-full grid-cols-4 gap-5">
          <div className="col-span-2 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span> วันที่เริ่มเผยแพร่
            </p>
            <div className="grid grid-cols-2 gap-5">
              <WCAInputDateFlat name="start_date" />
              <input
                id="start-time"
                name="start_time"
                type="time"
                className="col-span-1 rounded-md border-[1.5px] border-neutral-300 px-5"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
            </div>
          </div>
          <div className="col-span-2 flex w-full flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span> วันที่หมดอายุ
            </p>
            <div className="grid grid-cols-2 gap-5">
              <WCAInputDateFlat name="end_date" />
              <input
                id="end-time"
                name="end_time"
                type="time"
                className="w-full rounded-md border-[1.5px] border-neutral-300 px-5"
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 w-full gap-5">
          <p>
            <span className="text-red-500">*</span> การใช้คูปอง
          </p>
          <div className="grid w-full grid-cols-2 gap-5">
            <CWSelect
              required
              name="stock_type"
              className="col-span-1"
              value={stockType}
              onChange={(event) => {
                const value = event.target.value as 'จำกัด' | 'ไม่จำกัด';
                setStockType(value);
                if (value === 'ไม่จำกัด') {
                  setStock(-1);
                } else {
                  setStock('');
                }
              }}
              options={[
                { label: 'จำกัด', value: 'จำกัด' },
                { label: 'ไม่จำกัด', value: 'ไม่จำกัด' },
              ]}
            />

            {stockType === 'จำกัด' && (
              <CWInput
                required
                className="col-span-1"
                placeholder="กรอกจำนวนการใช้คูปอง"
                name="stock"
                value={stockType === 'จำกัด' ? stock : ''}
                onChange={(e) => setStock(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <hr />

      <div className="mt-5 w-full">
        <h1 className="text-[18px] font-bold">การแจกไอเทม</h1>
        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWInput
            label="เหรียญทอง"
            name="gold_coin_amount"
            className="col-span-1"
            placeholder="กรอกจำนวนเหรียญทอง"
          />
          <CWInput
            label="เหรียญ arcade"
            name="arcade_coin_amount"
            className="col-span-1"
            placeholder="กรอกจำนวนเหรียญ arcade"
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWInput
            label="น้ำแข็ง"
            name="ice_amount"
            className="col-span-1"
            placeholder="กรอกจำนวนน้ำแข็ง"
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-5">
          <CWSelect
            label="ตัวละคร"
            name="avatar_id"
            className="col-span-1"
            value={selectedAvatar}
            onChange={(event) => setSelectedAvatar(event.target.value)}
            options={[
              ...avatarList.map((avatar) => ({
                label: `${avatar.model_id} (Level ${avatar.level})`,
                value: avatar.id.toString(),
              })),
            ]}
          />
          <CWSelect
            label="สัตว์เลี้ยง"
            name="pet_id"
            className="col-span-1"
            value={selectedPet}
            onChange={(event) => setSelectedPet(event.target.value)}
            options={[
              ...petList.map((pet) => ({
                label: pet.model_id,
                value: pet.id.toString(),
              })),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CWDetail;
