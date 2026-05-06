import { Link } from '@tanstack/react-router';
import ArrowLeftward from '@global/asset/icon/Arrow-Leftward.svg';

interface SubBreadcrumbsProps {
  title: string;
  links: { label: string; href: string }[];
  description: string;
}

export default function SubBreadcrumbs(prop: SubBreadcrumbsProps) {
  return (
    <>
      <div className="flex py-5">
        <h1 className="text-2xl font-bold">{prop.title}</h1>
      </div>
      <div className="rounded-md bg-gray-100 p-5">
        <div className="flex gap-2">
          <button>
            <ArrowLeftward />
          </button>

          <div className="flex list-none text-xl font-bold">
            {prop.links.map((item, i) => {
              if (i === 0) {
                return (
                  <li key={i}>
                    <Link to={item.href}>
                      <button type="button" className="underline">
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
                      className={i === prop.links.length - 1 ? 'text-black' : 'underline'}
                    >
                      {item.label}
                    </button>
                  </Link>
                </li>
              );
            })}
          </div>
        </div>
        <p className="mt-3">{prop.description}</p>
      </div>
    </>
  );
}
