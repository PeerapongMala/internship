interface WCBreadcrumbProps {
  items: { label: string }[];
}

export const WCBreadcrumb = ({ items }: WCBreadcrumbProps) => {
  return (
    <nav className="flex text-black text-lg">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span>{item.label}</span>
          {index < items.length - 1 && <span className="mx-2">{'>'}</span>}
        </span>
      ))}
    </nav>
  );
};
