interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-y-[27px] mb-[28px]">
      <p className="font-semibold text-[28px] leading-[28px] text-[#101828] dark:text-white">
        {title}
      </p>
    </div>
  );
};

export default PageHeader;
