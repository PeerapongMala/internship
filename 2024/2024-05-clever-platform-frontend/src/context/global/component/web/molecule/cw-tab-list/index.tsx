interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

function CWTabList({ children, className = '' }: TabListProps) {
  return <div className={`flex items-stretch ${className}`}>{children}</div>;
}

export default CWTabList;
