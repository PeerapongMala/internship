const TextHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex-1 text-center text-gray-800 text-3xl font-bold">{title}</div>
  );
};

export default TextHeader;
