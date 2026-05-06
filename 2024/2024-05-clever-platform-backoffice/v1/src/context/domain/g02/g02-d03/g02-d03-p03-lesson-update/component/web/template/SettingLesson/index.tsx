import { useEffect, useState } from 'react';
import {
  NormalTableMonster,
  PretestTableMonster,
  PosttestTableMonster,
} from '../CheckpointMap/TableMonster';
import ModalCreateMonster from '../../../../../local/components/modal/ModalCreateMonster';
import ModalMap from '@domain/g02/g02-d03/local/components/modal/ModalMap';

import {
  optionFontFamily,
  optionFontsize,
  MapData,
} from '@domain/g02/g02-d03/local/components/option';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { LevelType, Monster } from '@domain/g02/g02-d03/local/Type';
import useModal from '@global/utils/useModal';
interface SettingLessonProp {
  lessonId: string;
  mapname?: string;
  onMapSelect: (selectedMap: { map_name: string; image_path: string }) => void;
  seed_subject_group_id?: number;
}

const Settinglesson = ({
  lessonId,
  mapname,
  onMapSelect,
  seed_subject_group_id,
}: SettingLessonProp) => {
  const matchedMap = MapData.find((map) => map.image_path === mapname);
  const mapDisplayName = matchedMap ? matchedMap.map_name : '';

  const modalTest = useModal();
  const modalPreTest = useModal();
  const modalPostTest = useModal();

  const [initialSelectedMap] = useState<{
    id: number;
    map_name: string;
    image_path: string;
  } | null>(
    matchedMap ||
      (seed_subject_group_id
        ? MapData.find((map) => map.seed_subject_group_id === seed_subject_group_id) ||
          null
        : null),
  );
  const [selectedMap, setSelectedMap] = useState<{
    id: number;
    map_name: string;
    image_path: string;
  } | null>(null);

  useEffect(() => {
    const matchedMap = MapData.find((map) => map.image_path === mapname);

    if (matchedMap) {
      setSelectedMap(matchedMap);
    } else if (seed_subject_group_id) {
      const defaultMap = MapData.find(
        (map) => map.seed_subject_group_id === seed_subject_group_id,
      );
      if (defaultMap) {
        setSelectedMap(defaultMap);
        onMapSelect(defaultMap);
      }
    }
  }, [mapname, seed_subject_group_id]);

  const [showModalMap, setShowModalMap] = useState(false);
  const handleShowModalMap = () => {
    setShowModalMap(true);
  };
  const handleCloseModalMap = () => {
    setShowModalMap(false);
  };

  const handleSelectMap = (selectedMap: {
    id: number;
    map_name: string;
    image_path: string;
  }) => {
    setSelectedMap(selectedMap);
    onMapSelect(selectedMap);
    setShowModalMap(false);
  };

  const [fetchPostTestMonsters, setFetchPostTestMonsters] = useState(() => () => {});
  const handleSuccess = (createdMonsters: Monster[]) => {
    if (fetchPostTestMonsters) {
      fetchPostTestMonsters();
    }
  };

  return (
    <div className="w-full">
      <div className="mt-5">
        <div className="border-b-2 pb-5">
          <h1 className="text-[24px] font-bold">ตั้งค่ามอนเตอร์</h1>
          <p className="mt-3 text-gray-500">
            ในแต่ละเกม ระบบจะสุ่มมอนสเตอร์ 1 ตัวจากตัวเลือกของคุณ
          </p>
        </div>
        {/* ด่านธรรมดา */}
        <div className="mt-5 w-full">
          {/** Table */}
          <div className="flex flex-col gap-5">
            <h1 className="relative pl-5 text-[20px] font-bold">
              <span className="absolute left-0 text-[14px]">•</span>
              {'ด่านธรรมดา'}
            </h1>
            <button
              className="btn btn-primary flex h-10 w-[150px] gap-2 px-4 py-1.5"
              onClick={modalTest.open}
            >
              <IconPlus /> เพิ่มมอนเตอร์
            </button>
            <NormalTableMonster onFetch={handleSuccess} lessonId={lessonId} />
          </div>

          <ModalCreateMonster
            open={modalTest.isOpen}
            onClose={modalTest.close}
            levelStatus={LevelType.TEST}
            lessonId={lessonId}
            onSuccess={handleSuccess}
          />
        </div>

        {/* ด่านธรรมดา */}
        <div className="mt-5 w-full">
          {/** Table */}
          <div className="flex flex-col gap-5">
            <h1 className="relative pl-5 text-[20px] font-bold">
              <span className="absolute left-0 text-[14px]">•</span>
              {'ด่าน pre-test'}
            </h1>
            <button
              className="btn btn-primary flex h-10 w-[150px] gap-2 px-4 py-1.5"
              onClick={modalPreTest.open}
            >
              <IconPlus /> เพิ่มมอนเตอร์
            </button>
            <ModalCreateMonster
              open={modalPreTest.isOpen}
              onClose={modalPreTest.close}
              levelStatus={LevelType.PRETEST}
              lessonId={lessonId}
              onSuccess={handleSuccess}
            />
          </div>
          <PretestTableMonster onFetch={handleSuccess} lessonId={lessonId} />
        </div>

        {/* ด่าน post-test */}
        <div className="mt-5 w-full">
          {/** Table */}
          <div className="flex flex-col gap-5">
            <h1 className="relative pl-5 text-[20px] font-bold">
              <span className="absolute left-0 text-[14px]">•</span>
              {'ด่าน post-test'}
            </h1>
            <button
              className="btn btn-primary flex h-10 w-[150px] gap-2 px-4 py-1.5"
              onClick={modalPostTest.open}
            >
              <IconPlus /> เพิ่มมอนเตอร์
            </button>
            <ModalCreateMonster
              open={modalPostTest.isOpen}
              onClose={modalPostTest.close}
              levelStatus={LevelType.POSTTEST}
              lessonId={lessonId}
              onSuccess={handleSuccess}
            />
          </div>
          <PosttestTableMonster onFetch={handleSuccess} lessonId={lessonId} />
        </div>

        <div className="border-b-2 pb-5">
          <h1 className="mt-3 text-[20px] font-bold">ตั้งค่าพื้นหลังด่าน</h1>
          <p className="my-3 text-[14px]">
            <span className="text-red-500">*</span>ฉากพื้นหลัง{' '}
          </p>
          <div className="flex w-[40%]">
            <input
              type="text"
              className="form-input"
              disabled
              value={selectedMap ? selectedMap.map_name : mapDisplayName}
              required
            />
            <button className="btn btn-outline-primary w-40" onClick={handleShowModalMap}>
              เปลี่ยน
            </button>
            <ModalMap
              open={showModalMap}
              onClose={handleCloseModalMap}
              onSelectMap={handleSelectMap}
              MapData={MapData}
              seed_subject_group_id={seed_subject_group_id}
              initialSelectedMapId={initialSelectedMap?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settinglesson;
