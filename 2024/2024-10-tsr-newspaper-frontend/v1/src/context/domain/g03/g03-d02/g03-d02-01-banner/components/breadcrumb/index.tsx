interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="w-full text-left mb-[18px]">
      <nav aria-label="breadcrumb" className="block w-full">
        <ol className="flex w-full flex-wrap items-center">
          {items.map((item, index) => (
            <li
              key={item.label}
              className={`flex items-center text-sm font-normal leading-normal ${
                item.href
                  ? 'cursor-pointer text-[#D9A84E] hover:text-pink-500 antialiased transition-colors duration-300'
                  : 'text-[#9096A2]'
              }`}
            >
              {item.href ? (
                <>
                  <a href={item.href}>
                    <span>{item.label}</span>
                  </a>
                  {index < items.length - 1 && (
                    <span className="pointer-events-none mx-2 select-none text-black dark:text-[#9096A2]">
                      /
                    </span>
                  )}
                </>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
export default Breadcrumb;
