import { ReactNode } from 'react';

type DashboardSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  number?: number;
};

export const DashboardSection = ({
  title,
  children,
  className = '',
  number,
}: DashboardSectionProps) => (
  <div className={`rounded-md bg-white shadow-md ${className}`}>
    <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
      <div className="flex">
        <h1 className="font-bold">{title}</h1>
        {number ?? <p>{number}</p>}
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
