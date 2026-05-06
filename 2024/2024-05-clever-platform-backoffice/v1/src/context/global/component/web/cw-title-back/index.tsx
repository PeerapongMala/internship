import { Link } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

interface BreadcrumbsProps {
  label: string;
  /**
   * choose 1 between href and onClick
   */
  href?: string;
  /**
   * choose 1 between href and onClick
   */
  onClick?: () => void;
}

const CWTitleBack = ({ label, href, onClick }: BreadcrumbsProps) => {
  return (
    <div className="flex gap-4">
      <Link
        onClick={(e) => {
          if (!href) {
            e.preventDefault(); // Prevent navigation if href is undefined
            onClick?.();
          } else {
            onClick?.();
          }
        }}
        to={href}
      >
        <IconArrowBackward />
      </Link>
      <p className="text-[26px] font-bold">{label}</p>
    </div>
  );
};

export default CWTitleBack;
