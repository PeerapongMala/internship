export interface TitleGroupProps {
  listText: string[];
  className?: string;
  subtitle?: { totalNumber: number; title: string }[];
}

const TitleGroup = ({ listText, className, subtitle }: TitleGroupProps) => {
  return (
    <div
      className={`flex h-auto w-full flex-col justify-center rounded-md bg-neutral-100 px-[10px] py-3 text-neutral-900 ${className}`}
    >
      <div className={`flex items-center text-xl font-bold`}>
        {listText.map((text, index) => {
          return index !== listText.length - 1 ? (
            <p>
              <span className="underline">{text}</span>
              <span className="mx-2">/</span>
            </p>
          ) : (
            <p>{text}</p>
          );
        })}
      </div>

      {subtitle && subtitle.length > 0 && (
        <div className="mt-2">
          {subtitle.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span>{item.totalNumber}</span> <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TitleGroup;
