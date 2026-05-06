import { ReactElement, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import IconPieChart from '@core/design-system/library/component/icon/IconPieChart';
import IconBookmark from '@core/design-system/library/component/icon/IconBookmark';
import IconBook from '@core/design-system/library/component/icon/IconBook';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconVolume from '@core/design-system/library/component/icon/IconVolume';
import IconError from '@core/design-system/library/component/icon/IconError';
import { useRouterState } from '@tanstack/react-router';

type TIcon = {
  id: number;
  icon: ReactElement;
  label: string;
  path?: string;
  context?: string;
  matchPattern?: string[];
};

const FooterMenu = () => {
  const navigate = useNavigate();
  const iconSizeClass = 'w-[22px] h-[22px]';
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
      icon: <IconGroup className={iconSizeClass} />,
      label: 'ครอบครัว',
      path: '/line/parent/family',
      matchPattern: ['/family'],
    },
    {
      id: 2,
      icon: <IconPieChart className={iconSizeClass} />,
      label: 'ภาพรวม',
      path: '/line/parent/clever/dashboard/choose-student',
      context: 'dashboard',
      matchPattern: ['/dashboard/choose-student', '/dashboard'],
    },
    {
      id: 3,
      icon: <IconBookmark className={iconSizeClass} />,
      label: 'การบ้าน',
      path: '/line/parent/clever/homework/choose-student',
      context: 'homework',
      matchPattern: ['/homework/choose-student', '/homework'],
    },
    {
      id: 4,
      icon: <IconBook className={iconSizeClass} />,
      label: 'บทเรียน',
      path: '/line/parent/choose-student',
      context: 'lesson',
      matchPattern: ['/choose-student', '/lesson', '/classroom', '/sublesson'],
    },
    {
      id: 5,
      icon: <IconVolume className={iconSizeClass} />,
      label: 'ประกาศ',
      path: '/line/parent/clever/announcement/choose-student',
      context: 'announcement',
      matchPattern: ['/announcement/choose-student', '/announcement'],
    },
    {
      id: 6,
      icon: <IconError className={iconSizeClass} />,
      label: 'รายงาน',
      path: '/line/parent/clever/bug-report',
      matchPattern: ['/bug-report'],
    },
  ];

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    const checkActivePath = () => {
      const currentPath = window.location.pathname;
      const activeIcon = icons.find((icon) =>
        icon.matchPattern?.some((pattern) => currentPath.includes(pattern)),
      );

      if (activeIcon) {
        setActiveId(activeIcon.id);
      } else {
        setActiveId(null);
      }
    };

    checkActivePath();
    window.addEventListener('popstate', checkActivePath);
    return () => window.removeEventListener('popstate', checkActivePath);
  }, [icons]);

  const handleNavigate = (path?: string, context?: string, id?: number) => {
    if (context) localStorage.setItem('studentListContext', context);
    if (path) {
      navigate({ to: path });
      if (id) setActiveId(id);
    }
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 z-50 flex h-[80px] w-full max-w-[480px] justify-around bg-white shadow-[0_-2px_4px_2px_rgba(0,0,0,0.04),0_-1px_2px_-6px_rgba(0,0,0,0.06)]">
      {icons.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path, item.context, item.id)}
            className="flex flex-col items-center justify-center"
          >
            <div
              className={`flex h-[36px] w-[36px] items-center justify-center ${isActive ? 'text-primary' : 'text-gray-600'}`}
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
