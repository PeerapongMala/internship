import { Link } from '@tanstack/react-router';

interface CWBreadcrumbItemProps {
  className?: string;
  label: string;
  href?: string;
}

const CWBreadcrumbItem = ({ className, label, href }: CWBreadcrumbItemProps) => {
  if (href) {
    return (
      <Link to={href} className={`text-sm hover:underline ${className}`}>
        {label}
      </Link>
    );
  }

  return <span className={`text-sm ${className}`}>{label}</span>;
};

export default CWBreadcrumbItem;
