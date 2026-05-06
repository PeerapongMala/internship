import { Link } from '@tanstack/react-router';
import IconArrowBackward from '../../icon/IconArrowBackward';

interface BreadcrumbsProps {
  label: string;
  href: string;
}

const TitleBack = ({ label, href }: BreadcrumbsProps) => {
  return (
    <div className="flex gap-4">
      <Link to={href}>
        <IconArrowBackward />
      </Link>
      <p className="text-[26px] font-bold">{label}</p>
    </div>
  );
};

export default TitleBack;
