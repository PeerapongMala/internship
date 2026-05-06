import { ReactElement, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import IconPieChart from '@core/design-system/library/component/icon/IconPieChart';
import IconBookmark from '@core/design-system/library/component/icon/IconBookmark';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';

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

  const icons: TIcon[] = [
    {
      id: 1,
      icon: <IconPieChart className={iconSizeClass} />,
      label: 'ภาพรวม',
      path: '/line/student/clever/dashboard',
      matchPattern: ['/dashboard'],
    },
    {
      id: 2,
      icon: <IconBookmark className={iconSizeClass} />,
      label: 'การบ้าน',
      path: '/line/student/clever/homework',
      matchPattern: ['/homework'],
    },
    {
      id: 3,
      icon: <IconSettings className={iconSizeClass} />,
      label: 'ตั้งค่า',
      path: '/line/student/clever/setting',
      matchPattern: ['/bug-report'],
    },
  ];

  useEffect(() => {
    const checkActivePath = () => {
      const currentPath = window.location.pathname;

      // ตรวจสอบจาก path โดยตรงก่อน
      const iconByPath = icons.find((icon) => icon.path === currentPath);
      if (iconByPath) {
        setActiveId(iconByPath.id);
        return;
      }

      // ถ้าไม่พบ path ที่ตรงกันพอดี ให้ตรวจสอบจาก matchPattern
      const activeIcon = icons.find((icon) => {
        if (!icon.matchPattern) return false;
        return icon.matchPattern.some((pattern) => currentPath.includes(pattern));
      });

      if (activeIcon) {
        setActiveId(activeIcon.id);
      } else {
        setActiveId(null);
      }
    };

    checkActivePath();

    window.addEventListener('popstate', checkActivePath);

    return () => {
      window.removeEventListener('popstate', checkActivePath);
    };
  }, []);

  const handleNavigate = (path?: string, context?: string, id?: number) => {
    if (context) localStorage.setItem('studentListContext', context);
    if (path) {
      navigate({ to: path });
      if (id) setActiveId(id);
    }
  };

  return (
    <div className="fixed bottom-0 z-50 flex h-[80px] w-full max-w-[480px] justify-around bg-white shadow-[0_-2px_4px_2px_rgba(0,0,0,0.04),0_-1px_1px_-6px_rgba(0,0,0,0.06)]">
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
