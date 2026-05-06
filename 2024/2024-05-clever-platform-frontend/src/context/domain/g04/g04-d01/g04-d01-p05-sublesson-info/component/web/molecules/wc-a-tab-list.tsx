interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return <div className={`flex items-stretch ${className}`}>{children}</div>;
}

export default TabList;
