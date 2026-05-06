import { Link } from '@tanstack/react-router';

interface BreadcrumbsProps {
  links: { label: string; href: string }[];
}

export default function Breadcrumbs({ links }: BreadcrumbsProps) {
  return (
    <div className="flex list-none font-normal">
      {links.map((item, i) => {
        if (i === 0) {
          return (
            <li key={i}>
              <Link to={item.href}>
                <button type="button" className="text-[#4361EE]">
                  {item.label}
                </button>
              </Link>
            </li>
          );
        }
        return (
          <li key={i} className="before:px-1.5 before:content-['/']">
            <Link to={item.href}>
              <button
                className={i === links.length - 1 ? 'text-black' : 'text-[#4361EE]'}
              >
                {item.label}
              </button>
            </Link>
          </li>
        );
      })}
    </div>
  );
}
