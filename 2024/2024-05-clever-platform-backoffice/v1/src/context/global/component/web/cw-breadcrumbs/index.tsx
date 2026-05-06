import CWBreadcrumbItem from '../atom/wc-a-breadcrumb-item';
import StoreGlobalPersist from '@store/global/persist';

export type BreadcrumbItem = {
  href?: string;
  label: string;
  disabled?: boolean;
};

interface BreadcrumbsProps {
  showSchoolName?: boolean;
  links: BreadcrumbItem[];
}

export default function CWBreadcrumbs({
  links,
  showSchoolName = true,
}: BreadcrumbsProps) {
  const { userData, targetData } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
  ]);
  const school_name = userData?.school_name ?? targetData?.school_name;

  const breadcrumbLinks: BreadcrumbItem[] =
    showSchoolName && school_name
      ? [{ label: school_name, href: undefined, disabled: true }, ...links]
      : links;

  return (
    <div className="flex list-none font-normal">
      {breadcrumbLinks.map((item, i) => {
        const isLast = i === breadcrumbLinks.length - 1;

        const className = `${i !== 0 ? "before:px-1.5 before:content-['/']" : ''} ${
          isLast ? 'text-black' : 'text-primary'
        }`;

        return (
          <CWBreadcrumbItem
            key={`breadcrumb-${i}`}
            className={className}
            label={item.label}
            href={!isLast && !item.disabled ? item.href : undefined}
          />
        );
      })}
    </div>
  );
}
