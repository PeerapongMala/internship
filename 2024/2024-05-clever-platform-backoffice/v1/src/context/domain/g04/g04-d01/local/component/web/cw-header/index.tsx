interface CWHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
}

const CWHeader: React.FC<CWHeaderProps> = (props) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-2xl font-bold">{props.title}</div>
      <div>{props.description}</div>
    </div>
  );
};

export default CWHeader;
