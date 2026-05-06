import { useState } from 'react';
import { Select } from '@core/design-system/library/vristo/source/components/Input';

import Topbox from '@domain/g02/g02-d03/local/components/atom/Topbox';
import { DataTable } from 'mantine-datatable';

import {
  NormalTableMonster,
  PretestTableMonster,
  PosttestTableMonster,
} from '../CheckpointMap/TableMonster';
import ModalCreateMonster from '../../../../../local/components/modal/ModalCreateMonster';
import ModalMap from '@domain/g02/g02-d03/local/components/modal/ModalMap';
import CWNeutralBox from '@component/web/cw-neutral-box';

const Settinglesson = () => {
  const optionFontFamily = [
    { value: 'th', label: 'ภาษาไทย' },
    { value: 'en', label: 'ภาษาอังกฤษ' },
    { value: 'cn', label: 'ภาษาจีน' },
  ];
  const optionFontsize = [
    { value: '14pt', label: '14pt' },
    { value: '16pt', label: '16pt' },
    { value: '20pt', label: '20pt' },
    { value: '24pt', label: '24pt' },
    { value: '40pt', label: '40pt' },
  ];

  const [fontFamily, setFontFamily] = useState(optionFontFamily[0]);
  const [fontSize, setFontSize] = useState(optionFontsize[0]);
  const [selectedMap, setSelectedMap] = useState<{
    map_name: string;
    image_path: string;
  } | null>(null);

  const [showModalMap, setShowModalMap] = useState(false);
  const handleShowModalMap = () => {
    setShowModalMap(true);
  };
  const handleCloseModalMap = () => {
    setShowModalMap(false);
  };

  const handleSelectMap = (selectedMap: { map_name: string; image_path: string }) => {
    setSelectedMap(selectedMap);
    setShowModalMap(false);
  };

  return (
    <div className="w-full">
      <div className="w-full px-2 pt-3">
        <div className="border-b-2 pb-5">
          <h1 className="text-[24px] font-bold">ตั้งค่าตัวอักษร</h1>
          <p className="mt-3 text-gray-500">
            การตั้งค่านี้จะเป็นค่าการแสดงผลเริ่มต้นของด่านทุกด่านที่อยู่ภายใต้บทเรียนหลักนี้{' '}
          </p>
        </div>
        <div>
          <div className="flex gap-10">
            <div className="w-full">
              <Select
                label="เลือกภาษา"
                defaultValue={optionFontFamily[0]}
                options={optionFontFamily}
                value={fontFamily}
                onChange={(e) => setFontFamily(e)}
                required
              />
            </div>
            <div className="w-full">
              <Select
                label="เลือกขนาดตัวอักษร"
                defaultValue={optionFontsize[0]}
                options={optionFontsize}
                value={fontSize}
                onChange={(e) => setFontSize(e)}
                required
              />
            </div>
          </div>
        </div>
        <CWNeutralBox className="mt-4 h-auto">
          <h1
            style={{ fontFamily: fontFamily.value, fontSize: fontSize.value }}
            className="py-3"
          >
            "test text {fontSize.value} size"
          </h1>
        </CWNeutralBox>
      </div>

      <div className="mt-10">
        <div className="border-b-2 pb-5">
          <h1 className="text-[24px] font-bold">ตั้งค่ามอนเตอร์</h1>
          <p className="mt-3 text-gray-500">
            การตั้งค่านี้จะเป็นค่าการแสดงผลเริ่มต้นของด่านทุกด่านที่อยู่ภายใต้บทเรียนหลักนี้{' '}
          </p>
        </div>
        {/** Table */}
        <div className="my-5 flex flex-col gap-5">
          <NormalTableMonster />
          <PretestTableMonster />
          <PosttestTableMonster />
        </div>

        <div className="border-b-2 pb-5">
          <h1 className="text-[24px] font-bold">ตั้งค่าพื้นหลังด่าน</h1>
          <p className="my-3">ฉากพื้นหลัง </p>
          <div className="flex w-[40%]">
            <input
              type="text"
              className="form-input"
              disabled
              value={selectedMap?.map_name}
              required
            />
            <button className="btn btn-outline-primary w-40" onClick={handleShowModalMap}>
              เปลี่ยน
            </button>
            <ModalMap
              open={showModalMap}
              onClose={handleCloseModalMap}
              onSelectMap={handleSelectMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settinglesson;
