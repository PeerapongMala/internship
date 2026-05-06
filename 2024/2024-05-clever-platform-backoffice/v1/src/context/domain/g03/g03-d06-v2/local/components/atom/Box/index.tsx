const Box = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={'w-full rounded-md bg-white p-5 shadow-md'}>{children}</div>;
};

export default Box;
