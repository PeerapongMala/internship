interface PageContentProps {
  children: React.ReactNode;
  description?: string;
}

const PageContent: React.FC<PageContentProps> = ({ children, description }) => (
  <div className="space-y-6">
    {description && (
      <label className="block text-base font-medium text-[#344054] dark:text-[#D7D7D7] md:mb-[48px]">
        {description}
        <span className="text-red-600">*</span>
      </label>
    )}
    {children}
  </div>
);

export default PageContent;
