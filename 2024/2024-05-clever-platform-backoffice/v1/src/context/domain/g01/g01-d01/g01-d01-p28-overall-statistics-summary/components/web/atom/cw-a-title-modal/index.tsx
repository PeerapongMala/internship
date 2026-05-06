type TitleDownloadModalProps = {
  description?: string;
};

const TitleDownloadModal = ({ description }: TitleDownloadModalProps) => {
  return (
    <div className="flex flex-col">
      ส่งออกข้อมูล
      <span className="text-sm font-normal">{description}</span>
    </div>
  );
};

export default TitleDownloadModal;
