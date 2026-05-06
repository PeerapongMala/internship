import { Link, useLocation } from '@tanstack/react-router';

interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  context?: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, context, onClick }: NavItemProps) => {
  const handleClick = () => {
    if (context) {
      localStorage.setItem('studentListContext', context);
    }
    if (onClick) {
      onClick();
    }
  };
  return (
    <li className="menu nav-item">
      <Link to={to} className="group" onClick={handleClick}>
        <div className="flex items-center">
          {icon}
          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
            {label}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default NavItem;
