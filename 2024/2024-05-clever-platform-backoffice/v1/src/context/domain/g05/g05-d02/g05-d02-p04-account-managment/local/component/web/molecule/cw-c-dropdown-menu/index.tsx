import IconTripleDot from '@core/design-system/library/component/icon/IconTripleDot';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useFamilyEditStore } from '@domain/g05/g05-d02/local/stores/family-store';

type DropdownMenuProps = HTMLAttributes<HTMLDivElement> & {
  menus: {
    isShow: boolean;
    label: string;
    onClick?: () => void;
  }[];
};

const DropdownMenu = ({ menus, className, ...props }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isEdit] = [useFamilyEditStore((state) => state.isEdit)];

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isEdit) {
    return null;
  }

  return (
    <div {...props} className={cn('flex items-center justify-center', className)}>
      <button className="relative" onClick={() => setIsOpen(true)}>
        <IconTripleDot />
        {isOpen && (
          <div
            ref={divRef}
            className="absolute right-0 top-4 flex w-[181px] flex-col gap-1 bg-white shadow-sm"
          >
            {menus.map(
              (menu, index) =>
                menu.isShow && (
                  <button
                    key={index}
                    className="hover:bg-white-dark"
                    onClick={menu.onClick}
                  >
                    {menu.label}
                  </button>
                ),
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default DropdownMenu;
