// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import Box from '../local/components/atom/Box';

import HeaderPage from '../local/components/atom/HeaderPage';
import SidePanel from '../local/components/organisms/Sidepanel';
import Infolesson from './component/web/template/InfoLesson';
import Breadcrumbs from '../local/components/atom/Breadcums';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import API from '../local/api';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';
import useModal from '@global/utils/useModal';
import { Curriculum, SubjectSubLessons, SubLessonData } from '../local/api/type';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { LessonStatus } from '../local/Type';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const curriculumId = curriculumData?.id;
  const userCreate = curriculumData?.created_by;

  //modal
  const modalSuccess = useModal();
  const { sublessonId } = useParams({
    from: '/content-creator/sublesson/$lessonId/$sublessonId/edit',
  });
  const [indicator, setIndicator] = useState<number | null>(1);
  const [status, setStatus] = useState<LessonStatus>();
  const [name, setName] = useState<string>('');
  const [sublessonData, setSublessonData] = useState<SubLessonData[]>([]);

  useEffect(() => {
    fetchSubLesson();
  }, [sublessonId]);
  const fetchSubLesson = () => {
    API.Sublesson.SubLessonGet.Get(Number(sublessonId))
      .then((res) => {
        if (res.status_code === 200) {
          setSublessonData([res.data]);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleClick = () => {
    API.Sublesson.SubLessonUpdate.Patch(sublessonId, {
      indicator_id: Number(indicator),
      name: name,
      status: status,
      updated_by: userCreate,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ', 'success');
          navigate({ to: '../../' });
        } else {
          showMessage('เกิดข้อผิดพลาด', 'error');
        }
      })
      .catch((err) => console.error(err));
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
          { label: 'บทเรียนย่อย', href: '/content-creator/sublesson/' + 'xxx' },
          {
            label: 'แก้ไขบทเรียนย่อย',
            href: '/content-creator/sublesson/create/' + 'xxx',
          },
        ]}
      />
      <HeaderPage />

      <div className="w-full">
        <div className="mt-10 flex gap-5">
          <Link to={'../../'}>
            <IconArrowBackward />
          </Link>
          <h1 className="text-[28px] font-bold">แก้ไขบทเรียนย่อย</h1>
        </div>

        <div className="mt-10 gap-8 xl:flex">
          <Box className="">
            {/* Content */}
            <div className="w-full">
              <Infolesson
                nameSet={(e: string) => setName(e)}
                data={sublessonData}
                indicatorSet={(e: number) => setIndicator(e)}
              />
            </div>
          </Box>
          <SidePanel
            id={sublessonData?.[0]?.id}
            time={sublessonData?.[0]?.updated_at}
            byAdmin={sublessonData?.[0]?.updated_by}
            statusSet={handleStatusChange}
            statusValue={sublessonData?.[0]?.status}
            fileUpdatedAt={sublessonData[0]?.file_updated_at}
            fileIsUpdated={sublessonData[0]?.file_is_updated}
            onClick={handleClick}
            onFileUpdateSuccess={fetchSubLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
