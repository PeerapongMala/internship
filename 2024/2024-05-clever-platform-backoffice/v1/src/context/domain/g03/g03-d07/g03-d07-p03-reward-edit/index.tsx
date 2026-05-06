import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import { Curriculum, SpecialRewardInside, Status } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import SidePanel from '../local/components/web/organism/Sidepanel';
import CWModalSelectStudent from '../local/components/web/modal/ModalSelectStudent';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const modalselectStudent = useModal();

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การให้รางวัลโดยครู', href: '#' },
          { label: 'ให้รางวัล', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="แก้ไขให้รางวัล" href="../../" />
      </div>
      <div className="flex gap-5">
        <CWWhiteBox className="w-[70%]">
          <div className="w-full">
            <h1 className="text-xl font-bold">เลือกนักเรียน</h1>
            <div className="relative mt-5 flex w-full items-center gap-3">
              <CWInputSearch
                label={'ค้นหาจากรหัสนักเรียน'}
                required
                placeholder="00000001"
              />
              <CWButton
                title="รายชื่อนักเรียนทั้งหมด"
                className="absolute top-[12px] h-[35px]"
                onClick={modalselectStudent.open}
              />
            </div>

            <CWNeutralBox className="my-5">
              <div className="flex flex-col">
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    รหัสนักเรียน:
                  </label>
                  <p className="w-full">-</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ชื่อสกุล:
                  </label>
                  <p className="w-full">-</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ชั้นปี:
                  </label>
                  <p className="w-full">-</p>
                </div>
                <div className="mb-3 flex items-center">
                  <label className="mb-2 block w-[30%] text-sm font-bold text-gray-700">
                    ห้อง:
                  </label>
                  <p className="w-full">-</p>
                </div>
              </div>
            </CWNeutralBox>
            <hr />
            <div className="mt-5 flex flex-col">
              <CWSelect label="วิชา" required title="คณิตศาสตร์" />
              <h1 className="my-5 text-xl font-bold">เลือกรางวัล</h1>
              <div className="grid w-full grid-cols-2 gap-5">
                <CWSelect
                  label="เลือกรางวัล"
                  required
                  title="คณิตศาสตร์"
                  className="col-span-1"
                />
                <CWInput label="จำนวน" required placeholder="1" className="col-span-1" />
              </div>
              <CWNeutralBox className="mt-5">
                <div className="flex w-full items-center gap-5">
                  <div className="size-16 bg-white">
                    <img src="#" alt="#" />
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold">ชื่อกรอบรูป</h1>
                    <p>รหัสไอเทม: 00000000001 - คำอธิบาย Lorem ipsum dolor sit amet</p>
                  </div>
                </div>
              </CWNeutralBox>
            </div>
          </div>
          {/* <CWModalSelectStudent
            open={modalselectStudent.isOpen} onClose={modalselectStudent.close}
          /> */}
        </CWWhiteBox>

        <SidePanel titleName="รหัสไอเทม" />
      </div>
    </div>
  );
};

export default DomainJSX;
