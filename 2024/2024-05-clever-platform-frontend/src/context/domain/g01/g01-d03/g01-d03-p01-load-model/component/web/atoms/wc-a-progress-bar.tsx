const ProgressBar = ({
  progress,
  title = 'อัพเดทเนื้อหาใหม่...',
  footer = '2,000 KB/5,000 KB',
}: {
  progress: number;
  title?: string;
  footer?: string;
}) => {
  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="text-center text-2xl">{title}</div>
      <div className="flex gap-2 w-full justify-center items-center">
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-2xl pt-1">{progress}%</div>
      </div>
      <div className="text-end w-full text-2xl">{footer}</div>
    </div>
  );
};

export default ProgressBar;
