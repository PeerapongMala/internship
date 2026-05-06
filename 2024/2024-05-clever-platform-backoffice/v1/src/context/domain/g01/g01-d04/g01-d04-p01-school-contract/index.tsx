import CWMTabs from '@component/web/molecule/cw-n-tabs';
import UserManage from '@domain/g01/g01-d04/g01-d04-p01-school-contract/pages/UserManage';
import SchoolSubject from '@domain/g01/g01-d04/g01-d04-p02-school-subject';
import API from '@domain/g01/g01-d04/local/api';
import ClassroomManage from '@domain/g01/g01-d05/g01-d05-p00-classroom/page/ClassroomManage';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import SubjectTeacherManagement from '@domain/g01/g01-d06/g01-d06-p00-subject-teacher/pages/SubjectTeacherManagement';
import StoreGlobal from '@global/store/global';
import {
  useNavigate,
  UseNavigateResult,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';

import ContractManage from './pages/contract-manage';
import InfoSchool from './pages/InfoSchool';
import router from '@global/utils/router-global';

const AdminSchoolContract: () => JSX.Element = () => {
  // Side bar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  // Navigation and search hooks
  const navigate: UseNavigateResult<string> = useNavigate();
  const searchParams = useSearch({
    from: '',
  });

  // Get school ID from URL parameters
  const { schoolId } = useParams({ from: '' });

  // Mode Create and Edit
  const isCreateMode = schoolId === 'create';
  const isEditMode = !isCreateMode && schoolId && Number.isInteger(Number(schoolId));

  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (isCreateMode) return;

    if (!isEditMode) {
      setError('Invalid school ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await API.school.GetById(schoolId);
      if (!data || Object.keys(data).length === 0) {
        throw new Error('School not found in the system.');
      }
      setSchoolData(data);
    } catch (error) {
      console.error('Failed to fetch school data:', error);
      setError('Failed to load school data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const initialTab = searchParams?.tab || 'school-info';
  const tabKeys: string[] = useMemo(
    () => [
      'school-info',
      'contract-management',
      'curriculum-management',
      'user-management',
      'classroom-management',
      'teacher-management',
    ],
    [],
  );

  const initialIndex: number = tabKeys.indexOf(initialTab);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0,
  );

  const tabsList: { key: string; label: string }[] = useMemo(
    () => [
      { key: 'school-info', label: 'ข้อมูลโรงเรียน' },
      { key: 'contract-management', label: 'จัดการสัญญา' },
      { key: 'curriculum-management', label: 'จัดการหลักสูตร' },
      { key: 'user-management', label: 'จัดการผู้ใช้งาน' },
      { key: 'classroom-management', label: 'จัดการห้องเรียน' },
      { key: 'teacher-management', label: 'จัดการครูประจำวิชา' },
    ],
    [],
  );

  const tabComponents: JSX.Element[] = [
    <InfoSchool key="school-info" />,
    <ContractManage key="contract-management" />,
    <SchoolSubject key="curriculum-management" />,
    <UserManage key="user-management" />,
    <ClassroomManage key="classroom-management" />,
    <SubjectTeacherManagement key="teacher-management" />,
  ];

  const handleTabClick = (index: number): void => {
    setCurrentIndex(index);
    navigate({
      search: {
        tab: tabKeys[index],
      } as any,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/admin/school' },
        {
          text: schoolData?.name || 'สร้างโรงเรียนใหม่',
          href: '/admin/school/create',
        },
      ]}
    >
      <div className="gap-2.5 rounded-md bg-neutral-100 p-2.5 dark:bg-black">
        <ol className="flex text-left text-xl font-bold text-neutral-900 dark:text-neutral-500">
          {isCreateMode ? (
            <li className="flex items-center gap-2.5">
              <div
                className="cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.history.back()}
              >
                <IconArrowBackward />
              </div>
              <span>สร้างโรงเรียนใหม่</span>
            </li>
          ) : (
            <>
              <div
                className="cursor-pointer rounded-md px-2 pt-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  navigate({ to: '/admin/school' });
                }}
              >
                <IconArrowBackward />
              </div>
              <li>
                <span className="underline">
                  {schoolData?.school_affiliation_name || '-'}
                </span>
              </li>
              <li className="before:px-1.5 before:content-['/']">
                <span className="underline">
                  {schoolData?.school_affiliation_type || '-'}
                </span>
              </li>
              <li className="before:px-1.5 before:content-['/']">
                <span className="underline">{schoolData?.name || '-'}</span>
              </li>
            </>
          )}
        </ol>
        {isEditMode && (
          <p className="mt-3 pl-2 text-sm font-normal">
            รหัสโรงเรียน: {schoolData?.code} (ตัวย่อ:{' '}
            {schoolData?.school_affiliation_short_name || '-'})
          </p>
        )}
      </div>

      <div className="flex h-full w-full flex-col gap-4">
        {!isCreateMode && (
          <CWMTabs
            items={tabsList.map((t) => t.label)}
            currentIndex={currentIndex}
            onClick={handleTabClick}
          />
        )}
        {tabComponents[currentIndex]}
      </div>
    </CWTLayout>
  );
};

export default AdminSchoolContract;
