import { useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdChevronRight } from 'react-icons/md';

export default function UserProfileForm() {
  const menuRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันเลื่อนเมนูไปทางขวา
  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <aside className="bg-white dark:bg-[#262626] shadow-md w-full md:w-72 md:h-max lg:w-64 p-4 rounded-t-3xl md:rounded-2xl">
      <div className="flex items-center mb-3">
        <FaUserCircle className="text-gray-400 text-7xl mr-3 mt-1 ml-2" />
        <h3 className="text-gray-700 font-semibold text-2xl mt-2 ml-2 dark:text-white">
          ชื่อผู้ใช้
        </h3>
      </div>

      {/* Horizontal Tab Menu with Scroll Button */}
      <div className="flex items-center justify-between md:flex-col md:items-start md:relative md:mb-12">
        <nav
          ref={menuRef}
          className="flex overflow-x-auto no-scrollbar whitespace-nowrap text-sm pt-2 px-2 space-x-12 md:flex-col md:space-y-4 md:space-x-0"
        >
          <a href="#" className="text-yellow-600 font-normal pb-1">
            ข้อมูลส่วนตัว
          </a>
          <a
            href="#"
            className="text-gray-600 font-normal hover:text-yellow-600 pb-1 dark:text-white"
          >
            เปลี่ยนรหัสผ่าน
          </a>
          <a
            href="#"
            className="text-gray-600 font-normal hover:text-yellow-600 pb-1 dark:text-white"
          >
            ประวัติการเข้าใช้งาน
          </a>
          <a
            href="#"
            className="text-gray-600 font-normal hover:text-yellow-600 pb-1 dark:text-white"
          >
            ประกาศของฉัน
          </a>
          <a
            href="#"
            className="text-gray-600 font-normal hover:text-yellow-600 pb-1 dark:text-white"
          >
            ออกจากระบบ
          </a>
        </nav>

        {/* ปุ่มเลื่อนขวา (เฉพาะใน mobile) */}
        <button
          onClick={scrollRight}
          className="p-1 rounded-full shadow md:hidden bg-transparent"
        >
          <MdChevronRight size={24} className="text-gray-500 dark:text-white" />
        </button>
      </div>
    </aside>
  );
}
