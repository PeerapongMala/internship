// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import Box from '../local/components/atom/Box';
import { Select, Table } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import HeaderPage from '../local/components/atom/HeaderPage';
import SidePanel from '../local/components/organisms/Sidepanel';
import Infolesson from './component/web/template/InfoLesson';
import Breadcrumbs from '../local/components/atom/Breadcums';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import API from '../local/api';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';

import VolatileStore from '@store/global/volatile';
import showMessage from '@global/utils/showMessage';
import { Curriculum, Indicator } from '../local/api/type';
import StoreGlobalPersist from '@store/global/persist';
import { LessonStatus } from '../local/Type';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  // const { lessonId } = useParams({ from: '/content-creator/sublesson/create/$lessonId' });
  // const { lessonId }: { lessonId: number } = VolatileStore.StateGet(['lessonId'])
  const { lessonId } = useParams({ from: '/content-creator/sublesson/$lessonId/create' });
  console.log({ lessonId: lessonId });
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const curriculumId = curriculumData?.id;
  const userCreate = curriculumData?.created_by;
  const userUpdate = curriculumData?.updated_by;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const [fetching, setFetching] = useState<boolean>(false);
  const [indicatorData, setIndicatorData] = useState<Indicator[]>([]);
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<LessonStatus>();
  const [indicatorId, setIndicatorId] = useState<number | undefined>(undefined);
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };
  const modalSuccess = useModal();

  useEffect(() => {
    setFetching(true);
    API.Sublesson.Indicator.List(Number(curriculumId))
      .then((res) => {
        if (res.status_code === 200) {
          setIndicatorData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const handleClick = () => {
    if (name === '' || Number(indicatorId) === null) {
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }
    // if (status === 'draft') {
    //   showMessage('ไม่สามารถกำหนดแบบร่างได้', 'warning');
    //   return;
    // }
    API.Sublesson.SubLessonCreate.Post({
      lesson_id: Number(lessonId),
      indicator_id: Number(indicatorId),
      name: name,
      status: status,
      created_by: userCreate,
      updated_by: userCreate,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ');
          navigate({ to: '../' });
        }
        if (res.status_code === 409) {
          showMessage('เกิดข้อผิดพลาด');
        }
      })
      .catch((err) => {
        showMessage(err.message, 'error');
      });
  };
  const handleStatusChange = (value: LessonStatus) => {
    setStatus(value);
  };
  return (
    <div className="w-full">
      <Breadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการบทเรียน', href: '/content-creator/lesson' },
          { label: 'บทเรียนย่อย', href: '/content-creator/sublesson/' + lessonId },
          {
            label: 'เพิ่มบทเรียนย่อย',
            href: '/content-creator/sublesson/create/' + lessonId,
          },
        ]}
      />
      <HeaderPage />

      <div className="w-full">
        <div className="mt-10 flex gap-5">
          <Link to={'../'}>
            <IconArrowBackward />
          </Link>
          <h1 className="text-[28px] font-bold">เพิ่มบทเรียนย่อย</h1>
        </div>

        <div className="mt-10 gap-8 xl:flex">
          <Box className="">
            {/* Content */}
            <div className="w-full">
              <Infolesson
                nameSet={(e: string) => setName(e)}
                indicatorSet={(e: number) => setIndicatorId(e)}
                indicatorData={indicatorData}
              />
            </div>
          </Box>
          <SidePanel statusSet={handleStatusChange} onClick={handleClick} />
        </div>
        <CWModalPopupSaveComplete
          open={modalSuccess.isOpen}
          onClose={() => {
            modalSuccess.close();
            window.location.href = '/content-creator/sublesson';
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
