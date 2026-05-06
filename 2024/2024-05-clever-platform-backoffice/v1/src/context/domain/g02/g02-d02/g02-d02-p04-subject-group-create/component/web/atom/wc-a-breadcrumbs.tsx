interface BreadcrumbsProps {
  links: { label: string; href: string }[];
  variant?: 'default' | 'bold'; // เพิ่ม prop variant สำหรับระบุรูปแบบ
}

export default function Breadcrumbs({ links, variant = 'default' }: BreadcrumbsProps) {
  return (
    <ol
      className={`flex font-noto-sans-thai ${
        variant === 'bold' ? 'bg-gray-100 p-4' : 'font-normal'
      }`}
    >
      {links.map((item, i) => (
        <li
          key={i}
          className={
            i !== 0
              ? `before:px-1.5 before:content-['/'] ${
                  variant === 'bold' ? 'before:text-2xl' : ''
                }`
              : ''
          }
        >
          <a
            href={item.href}
            title={item.label}
            className={
              variant === 'bold'
                ? 'text-2xl font-bold text-black' // เพิ่ม text-2xl สำหรับขนาดตัวอักษรที่ใหญ่ขึ้น
                : i === links.length - 1
                  ? 'text-black'
                  : 'text-[#4361EE]'
            }
            aria-current={i === links.length - 1 ? 'page' : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
