import { RefObject, useRef, useState, useEffect } from 'react';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface ProfileNavProps {
  menuRef: RefObject<HTMLDivElement>;
  navItems: { label: string; key: string }[];
  activeItem: string;
  onItemClick: (item: string) => void;
  scrollRight?: () => void;
  scrollLeft?: () => void;
}

interface CoreSidebarMenuDownloadProps {
  defaultPath?: 'announcement' | 'banner' | 'faq' | 'cover' | 'approve' | 'download';
}

export default function CoreSidebarMenuDownload({
  defaultPath,
}: CoreSidebarMenuDownloadProps) {
  const navItems = [
    { label: 'แก้ไขประกาศ', key: 'announcement' },
    { label: 'แก้ไขโฆษณา', key: 'banner' },
    { label: 'แก้ไขคำถามที่พบบ่อย', key: 'faq' },
    { label: 'ปกหนังสือพิมพ์', key: 'cover' },
    { label: 'อนุมัติหนังสือพิมพ์', key: 'approve' },
    { label: 'ดาวน์โหลดใบแจ้งหนี้และใบเสร็จ', key: 'download' },
  ];

  const menuRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<'announcement' | 'banner' | string>(
    defaultPath ?? 'announcement',
  );
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (menuRef.current) {
      const activeItemElement = menuRef.current.querySelector(
        `.active-menu`,
      ) as HTMLElement;
      if (activeItemElement) {
        activeItemElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
    checkIfAtEnd();
    checkIfAtStart();
  }, [activeItem]);

  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: 250, behavior: 'smooth' });
      setTimeout(checkIfAtEnd, 300);
      setTimeout(checkIfAtStart, 300);
    }
  };

  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      setTimeout(checkIfAtStart, 300);
      setTimeout(checkIfAtEnd, 300);
    }
  };

  const checkIfAtEnd = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const checkIfAtStart = () => {
    if (menuRef.current) {
      setAtStart(menuRef.current.scrollLeft <= 0);
    }
  };

  return (
    <aside>
      <div className="w-full flex items-center justify-center mb-[38px] md:mb-10">
        <h3 className="text-gray-700 font-semibold text-2xl dark:text-white">ADMIN</h3>
      </div>

      <ProfileNav
        menuRef={menuRef}
        navItems={navItems}
        activeItem={activeItem}
        onItemClick={(item) => setActiveItem(item)} 
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        atEnd={atEnd}
        atStart={atStart}
      />
    </aside>
  );
}

<div className="absolute bottom-0 border-b-2 border-b-[#9096A2] w-full z-0" />


const ProfileNav: React.FC<
  ProfileNavProps & { atEnd: boolean; atStart: boolean }
> = ({ menuRef, navItems, activeItem, onItemClick, scrollRight, scrollLeft, atEnd, atStart }) => {
  return (
    
    <div className="w-full flex items-center relative border-b-2 border-b-[#9096A2] ">
      {!atStart && (
        <button onClick={scrollLeft} className="pb-3 md:hidden bg-transparent mr-2">
          <MdChevronLeft size={24} className="text-gray-500 dark:text-white" />
        </button>
      )}
      <nav ref={menuRef} className="flex flex-row overflow-x-auto no-scrollbar whitespace-nowrap w-full">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={`/admin/${item.key}`}
            onClick={() => onItemClick(item.key)}
            className={`flex-shrink-0 pb-[10px] transition-colors duration-200
              ${activeItem === item.key
                ? 'text-[#D9A84E] border-b-2 border-[#D9A84E] z-10 active-menu'
                : 'text-[#9096A2] hover:text-[#D9A84E] dark:hover:text-[#D9A84E]'}`}
          >
            <span className="px-6 py-[10px] text-sm leading-3">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Scroll Right Button */}
      {!atEnd && (
        <button onClick={scrollRight} className="pb-3 md:hidden bg-transparent ml-2">
          <MdChevronRight size={24} className="text-gray-500 dark:text-white" />
        </button>
      )}
    </div>
  );
};
