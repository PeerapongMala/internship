// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { FormEvent, useEffect, useState } from 'react';
import Box from '../local/components/atom/Box';
import API from '../local/api';
import SidePanel from '../local/components/organisms/Sidepanel';
import Infolesson from './component/web/template/InfoLesson';
import Settinglesson from './component/web/template/SettingLesson';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWTitleGroup from '@component/web/cw-title-group';
import StoreGlobalPersist from '@store/global/persist';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { LessonStatus } from '../local/Type';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import { ISubject } from '@domain/g02/g02-d02/local/type';

const DomainJSX = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);
  const userId: string = userData?.id;
  const role = userData?.roles;
  const subjectID = useParams({ strict: false });
  const navigate = useNavigate();
  const [selectStatus, setSelectStatus] = useState<LessonStatus>();
  const [name, setName] = useState<string>('');

  const [selectFontFamily, setSelectFontFamily] = useState('');
  const [selectFontSize, setSelectFontSize] = useState('');
  const [selectExtra, setSelectExtra] = useState('');

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  useEffect(() => {
    if (role.length === 1 && role[0] === 2) {
      setSelectStatus(LessonStatus.DRAFT);
    }
  }, [role]);

  const handleSave = () => {
    if (!name) {
      showMessage('โปรดกรอกข้อมูล', 'warning');
      return;
    }
    if (!selectFontFamily) {
      showMessage('โปรดเลือกรูปแบบตัวอักษร', 'warning');
      return;
    }
    if (!selectFontSize) {
      showMessage('โปรดเลือกขนาดตัวอักษร', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('โปรดเลือกสถานะ', 'warning');
      return;
    }

    const subjectIDValue = subjectID?.subjectID || subjectID;

    API.Lesson.LessonCreate.Post({
      subject_id: Number(subjectIDValue),
      name: name + ' ' + selectExtra,
      font_name: selectFontFamily,
      font_size: selectFontSize,
      status: selectStatus,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ', 'success');
          navigate({
            to: '../../',
          });
        }
      })
      .catch((err) => console.error(err));
  };
  const handleStatusChange = (value: LessonStatus) => {
    setSelectStatus(value);
  };
  const [activeTablist, setActiveTablist] = useState('0');

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการบทเรียน', href: '/content-creator/lesson' },
          { label: 'บทเรียนหลัก', href: '/content-creator/lesson' },
          { label: 'เพิ่มบทเรียนหลัก', href: '/content-creator/lesson/create' },
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
          <h1 className="text-[28px] font-bold">เพิ่มบทเรียนหลัก</h1>
        </div>

        <div className="mb-8 mt-10 flex w-full border-b-[1px] bg-white">
          <div className="flex bg-white">
            <button
              onClick={() => setActiveTablist('0')}
              className={`px-5 py-1 text-[14px] text-black ${activeTablist === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลทบทเรียน
            </button>
            <button
              onClick={() => setActiveTablist('1')}
              disabled
              className={`cursor-not-allowed px-5 py-1 text-black ${activeTablist === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ค่าเริ่มต้นการแสดงผลด่าน
            </button>
          </div>
        </div>

        <div className="gap-8 xl:flex">
          <Box className="">
            <div className="w-full">
              {/* Content */}
              <div className="w-full">
                {activeTablist === '0' ? (
                  <Infolesson
                    nameSet={(e: string) => setName(e)}
                    fontNameValue={selectFontFamily}
                    fontSizeValue={selectFontSize}
                    extraValue=""
                    onSelectedFontFamily={(e) => setSelectFontFamily(e.value)}
                    onSelectedFontSize={(e) => setSelectFontSize(e.value)}
                    onSelectedExtra={(e) => setSelectExtra(e.value)}
                  />
                ) : (
                  <div className="pointer-events-none opacity-50">
                    <Settinglesson />
                  </div>
                )}
              </div>
            </div>
          </Box>
          <SidePanel
            onClick={handleSave}
            status={handleStatusChange}
            statusValue={selectStatus}
            role={role}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
