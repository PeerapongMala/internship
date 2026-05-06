interface TabsListProps {
  children: React.ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div
      id="tabs"
      className="flex items-center w-full items-end border-inset border-b-2 border-[#fcd401] border-dashed"
    >
      {children}
    </div>
  );
}

export default TabsList;
