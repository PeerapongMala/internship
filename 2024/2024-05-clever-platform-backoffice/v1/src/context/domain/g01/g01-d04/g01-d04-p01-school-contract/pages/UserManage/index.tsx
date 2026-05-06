import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useEffect, useState } from 'react';
import SchoolStudent from '@domain/g01/g01-d04/g01-d04-p03-school-student';
import SchoolTeacher from '@domain/g01/g01-d04/g01-d04-p04-school-teacher';
import SchoolObserver from '@domain/g01/g01-d04/g01-d04-p05-school-observer';
import SchoolAnnouncer from '@domain/g01/g01-d04/g01-d04-p07-school-announcer';
import { useSearch, useNavigate } from '@tanstack/react-router';

const UserManage = () => {
  const search = useSearch({ from: '/admin/school/$schoolId' });
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('student');

  const tabsList = [
    { key: 'student', label: 'นักเรียน' },
    { key: 'teacher', label: 'ครู' },
    { key: 'observer', label: 'ผู้สังเกตการณ์' },
    { key: 'broadcaster', label: 'ผู้ประกาศ' },
  ];

  useEffect(() => {
    const tablistFromUrl = (search as any).tablist;
    if (tablistFromUrl && tabsList.some((tab) => tab.key === tablistFromUrl)) {
      setSelectedTab(tablistFromUrl);
    }
  }, [(search as any).tablist]);

  const handleTabClick = (index: number) => {
    const newTab = tabsList[index].key;
    setSelectedTab(newTab);
    navigate({
      search: { tab: 'user-management', tablist: newTab } as any,
    });
  };

  const tabComponents: Record<string, JSX.Element> = {
    student: <SchoolStudent />,
    teacher: <SchoolTeacher />,
    observer: <SchoolObserver />,
    broadcaster: <SchoolAnnouncer />,
  };

  return (
    <div>
      <CWMTabs
        items={tabsList.map((t) => t.label)}
        currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
        onClick={handleTabClick}
      />
      {tabComponents[selectedTab]}
    </div>
  );
};

export default UserManage;
