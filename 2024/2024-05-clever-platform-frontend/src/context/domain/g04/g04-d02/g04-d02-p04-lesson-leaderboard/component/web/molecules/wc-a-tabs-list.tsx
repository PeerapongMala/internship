interface TabsListProps {
  children: React.ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div
      id="tabs"
      className="flex items-center w-full  border-inset  "
    >
      {children}
    </div>
  );
}

export default TabsList;
