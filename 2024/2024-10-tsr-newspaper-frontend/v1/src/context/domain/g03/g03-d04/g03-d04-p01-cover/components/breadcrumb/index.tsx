import { Fragment } from 'react/jsx-runtime';
import { navCover } from '../cover';

interface BreadcrumbProps {
  currentPage: navCover;
  onNavigate: (page: navCover) => void;
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage, onNavigate }) => {
  const getBreadcrumbs = () => {
    const items = [
      { label: 'ADMIN', page: null },
      { label: 'ปกหนังสือพิมพ์', page: navCover.HOME },
    ];

    if (currentPage === navCover.ADD) {
      items.push({ label: 'สร้างปกหนังสือพิมพ์', page: navCover.ADD });
    }

    if (currentPage === navCover.EDIT) {
      items.push(
        { label: 'สร้างปกหนังสือพิมพ์', page: navCover.ADD },
        { label: 'กรอกข้อมูล', page: navCover.EDIT },
      );
    }
    if (currentPage === navCover.PREVIEW) {
      items.push(
        { label: 'สร้างปกหนังสือพิมพ์', page: navCover.ADD },
        { label: 'กรอกข้อมูล', page: navCover.EDIT },
        { label: 'แสดงตัวอย่าง', page: navCover.PREVIEW },
      );
    }

    return items;
  };

  return (
    <nav
      aria-label="breadcrumb"
      className="w-full mb-4 md:mb-6 overflow-x-auto mt-[80px]"
    >
      <ol className="flex flex-wrap items-center gap-2 whitespace-pre-wrap">
        {getBreadcrumbs().map((item, index) => (
          <Fragment key={item.label}>
            <li className="flex items-center">
              {item.label === 'ADMIN' ? (
                <span className="text-sm text-[#D9A84E]">{item.label}</span>
              ) : item.page && currentPage !== item.page ? (
                <button
                  onClick={() => onNavigate(item.page)}
                  className="text-sm text-[#D9A84E] hover:text-[#c69746] transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-sm text-gray-500 dark:text-[#9096A2]">
                  {item.label}
                </span>
              )}
            </li>
            {index < getBreadcrumbs().length - 1 && (
              <span className="text-gray-500 dark:text-[#9096A2]">/</span>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
