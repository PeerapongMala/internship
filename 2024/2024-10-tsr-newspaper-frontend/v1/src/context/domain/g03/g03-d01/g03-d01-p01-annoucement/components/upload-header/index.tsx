interface UploadHeaderProps {
  currentCount: number;
  maxCount: number;
  description: string;
  isRequired?: boolean;
}

const UploadHeader: React.FC<UploadHeaderProps> = (props: UploadHeaderProps) => {
  const { currentCount, maxCount, description, isRequired = false } = props;
  return (
    <div className="flex flex-col text-base font-medium leading-4 gap-y-[18px] md:flex-row md:justify-between dark:text-[#D7D7D7] mb-7">
      <div>
        {description}
        {isRequired && <span className="text-red-600">*</span>}
      </div>
      <div>{`${currentCount}/${maxCount} หน้า`}</div>
    </div>
  );
};

export default UploadHeader;
