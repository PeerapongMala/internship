import { ReactNode } from 'react';

type DashboardSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  number?: number;
  passs_number?: number;
  showPassNumber?: boolean;
};

export const DashboardSection = ({
  title,
  subtitle,
  children,
  className = '',
  number,
  passs_number,
  showPassNumber = true,
}: DashboardSectionProps) => (
  <div className={`rounded-md bg-white shadow-md ${className}`}>
    <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
      <div className="flex">
        <h1 className="pr-3 font-bold">{title}</h1>
        {number !== undefined && subtitle && (
          <p className="flex gap-1">
            {showPassNumber && passs_number !== undefined && <p>{passs_number} / </p>}
            {number} {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="p-2">{children}</div>
  </div>
);

type DashboardGridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
};

export const DashboardGrid = ({
  children,
  cols = 2,
  className = '',
}: DashboardGridProps) => (
  <div
    className={`grid w-full ${
      cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : 'grid-cols-3'
    } mt-5 gap-5 ${className}`}
  >
    {children}
  </div>
);
