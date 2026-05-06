import { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import IconPieChart from '@core/design-system/library/component/icon/IconPieChart';
import IconBookmark from '@core/design-system/library/component/icon/IconBookmark';
import IconReward from '@core/design-system/library/component/icon/IconReward';
import IconMessageSquare from '@core/design-system/library/component/icon/IconMessageSquare';
import IconVolume from '@core/design-system/library/component/icon/IconVolume';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';

type TIcon = {
  id: number;
  icon: ReactElement;
  label: string;
  path?: string;
  matchPattern?: string[];
};

const FooterMenu = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [isMobile, setIsMobile] = useState(false);
  const iconSizeClass = 'w-[22px] h-[22px]';

  // check responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const icons: TIcon[] = [
    {
      id: 1,
      icon: <IconPieChart className={iconSizeClass} />,
      label: 'ภาพรวม',
      path: '/line/teacher/dashboard',
      matchPattern: ['/dashboard'],
    },
    {
      id: 2,
      icon: <IconBookmark className={iconSizeClass} />,
      label: 'การบ้าน',
      path: '/line/teacher/homework/homework',
      matchPattern: ['/homework'],
    },
    {
      id: 3,
      icon: <IconReward className={iconSizeClass} />,
      label: 'จัดการางวัล',
      path: '/line/teacher/reward',
      matchPattern: ['/reward'],
    },
    {
      id: 4,
      icon: <IconMessageSquare className={iconSizeClass} />,
      label: 'แชท',
      path: '/line/teacher/chat',
      matchPattern: ['/chat'],
    },
    {
      id: 5,
      icon: <IconVolume className={iconSizeClass} />,
      label: 'ประกาศ',
      path: '/line/teacher/announcement',
      matchPattern: ['/announcement'],
    },
    {
      id: 6,
      icon: <IconSettings className={iconSizeClass} />,
      label: 'ตั้งค่า',
      path: '/line/teacher/setting/setting',
      matchPattern: ['/bug-report', 'setting'],
    },
  ];

  const isPathActive = (iconPath?: string, matchPatterns?: string[]) => {
    if (!iconPath) return false;

    // ตรวจสอบถ้า path ตรงกันพอดี
    if (location.pathname === iconPath) return true;

    // ตรวจสอบโดยใช้ matchPattern
    if (matchPatterns) {
      return matchPatterns.some((pattern) => location.pathname.includes(pattern));
    }

    return false;
  };

  const handleNavigate = (path?: string) => {
    if (path && path !== location.pathname) {
      navigate({ to: path });
    }
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-50 flex h-[80px] w-full max-w-[480px] -translate-x-1/2 justify-around bg-white shadow-[0_-2px_4px_2px_rgba(0,0,0,0.04),0_-1px_2px_-6px_rgba(0,0,0,0.06)]">
      {icons.map((item) => {
        const isActive = isPathActive(item.path, item.matchPattern);

        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            className="flex flex-col items-center justify-center pb-3 pt-3"
          >
            <div
              className={`flex h-[50px] w-[50px] items-center justify-center rounded-full hover:bg-gray-100 ${isActive ? 'text-primary' : 'text-gray-600'}`}
            >
              {item.icon}
            </div>
            <span
              className={`mt-1 text-xs ${isActive ? 'text-primary' : 'text-gray-600'}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FooterMenu;
