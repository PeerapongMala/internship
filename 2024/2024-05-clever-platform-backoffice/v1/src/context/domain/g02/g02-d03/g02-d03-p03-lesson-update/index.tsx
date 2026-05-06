// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { FormEvent, useEffect, useState } from 'react';

import API from '../local/api';
import SidePanel from '../local/components/organisms/Sidepanel';
import InfoLesson from './component/web/template/InfoLesson';
import Settinglesson from './component/web/template/SettingLesson';
import Breadcrumbs from '../local/components/atom/Breadcums';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWTitleGroup from '@component/web/cw-title-group';
import { LessonStatus, SubjectLessons } from '../local/Type';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import CWWhiteBox from '@component/web/cw-white-box';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const subjectId = subjectData?.seed_subject_group_id;
  const userData = StoreGlobalPersist.StateGet(['userData']);
  const userId: string = userData?.userData.id;
  const { lessonId } = useParams({ from: '/content-creator/lesson/$lessonId/edit' });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState<SubjectLessons>();
  const [selectStatus, setSelectStatus] = useState<LessonStatus>();
  const [activeTablist, setActiveTablist] = useState('0');

  const [selectedMap, setSelectedMap] = useState<{
    map_name: string;
    image_path: string;
  } | null>(null);
  const [initialMapFromData, setInitialMapFromData] = useState<{
    image_path: string;
  } | null>(null);

  const [selectFontFamily, setSelectFontFamily] = useState('');
  const [selectFontSize, setSelectFontSize] = useState('');

  useEffect(() => {
    API.Lesson.LessonGetBy.Get(lessonId)
      .then((res) => {
        if (res.status_code === 200) {
          setLessonData(res.data);

          setInitialMapFromData({
            image_path: res.data.background_image_path,
          });
        }
      })
      .catch((err) => console.error(err));
  }, [lessonId]);

  const handleSave = () => {
    if (lessonData?.name === '') {
      showMessage('โปรดกรอกชื่อบทเรียนหลัก', 'warning');
      return;
    }
    // if (!lessonData?.font_name && !selectFontFamily) {
    //   showMessage('โปรดเลือกรูปแบบตัวอักษร', 'warning');
    //   return
    // }
    // if (!lessonData?.font_size && !selectFontSize) {
    //   showMessage('โปรดเลือกขนาดตัวอักษร', 'warning');
    //   return;
    // }
    const finalSelectedMap = selectedMap || initialMapFromData;
    if (!finalSelectedMap || !finalSelectedMap.image_path) {
      showMessage('โปรดเลือกพื้นหลังด่าน', 'warning');
      return;
    }

    API.Lesson.LessonUpdate.Patch(lessonId, {
      name: lessonData?.name,
      font_name: selectFontFamily || lessonData?.font_name,
      font_size: selectFontSize || lessonData?.font_size,
      background_image_path: finalSelectedMap.image_path,
      status: selectStatus || lessonData?.status,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ');
          navigate({
            to: '../../',
          });
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((err) => console.error(err));
  };

  const handleStatusChange = (value: LessonStatus) => {
    setSelectStatus(value);
  };

  const handleMapSelection = (selectedMap: { map_name: string; image_path: string }) => {
    setSelectedMap(selectedMap);
  };
  return (
    <div className="w-full font-noto-sans-thai">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการบทเรียน', href: '/content-creator/lesson' },
          { label: 'บทเรียนหลัก', href: '/content-creator/lesson' },
          { label: 'แก้ไขบทเรียนหลัก', href: '#' },
        ]}
      />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
          subjectData.seed_year_short_name,
          subjectData.seed_subject_group_name,
          subjectData.name,
        ]}
        className="mt-5"
      />
      <div className="w-full">
        <div className="mt-10 flex gap-5">
          <Link to={'/content-creator/lesson'}>
            <IconArrowBackward />
          </Link>
          <h1 className="text-[28px] font-bold">แก้ไขบทเรียนหลัก</h1>
        </div>

        <div className="mb-8 mt-10 flex w-full border-b-[1px] bg-white">
          <div className="flex bg-white">
            <button
              onClick={() => setActiveTablist('0')}
              className={`px-5 py-1 text-[14px] text-black ${activeTablist === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลบทเรียน
            </button>
            <button
              onClick={() => setActiveTablist('1')}
              className={`px-5 py-1 text-black ${activeTablist === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ค่าเริ่มต้นการแสดงผลด่าน
            </button>
          </div>
        </div>

        <div className="gap-8 xl:flex">
          <CWWhiteBox className="">
            <div className="w-full">
              {/* Content */}
              <div className="w-full">
                {activeTablist === '0' ? (
                  <InfoLesson
                    name={lessonData?.name || ''}
                    nameSet={(e: string) =>
                      setLessonData((prevData: any) => ({ ...prevData, name: e }))
                    }
                    fontNameValue={lessonData?.font_name}
                    fontSizeValue={lessonData?.font_size}
                    onSelectedFontFamily={(e) => setSelectFontFamily(e.value)}
                    onSelectedFontSize={(e) => setSelectFontSize(e.value)}
                  />
                ) : (
                  <Settinglesson
                    lessonId={lessonId}
                    mapname={lessonData?.background_image_path}
                    onMapSelect={handleMapSelection}
                    seed_subject_group_id={subjectId}
                  />
                )}
              </div>
            </div>
          </CWWhiteBox>
          <SidePanel
            onClick={handleSave}
            status={handleStatusChange}
            statusValue={lessonData?.status}
            userId={lessonData?.id}
            byAdmin={lessonData?.updated_by}
            time={lessonData?.updated_at}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
