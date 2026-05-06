import CWButton from '../cw-button';

export interface TitleGroupProps {
  listText: string[] | React.ReactNode[];
  className?: string;
  subtitle?: { totalNumber?: number; title: string }[];
  onClick?: () => void;
  buttonSpecial?: boolean;
  titleButton?: string;
  onClickButton?: () => void;
  iconButton?: React.ReactNode;
}

const CWTitleGroup = ({
  listText,
  className,
  subtitle,
  onClick,
  buttonSpecial,
  titleButton,
  onClickButton,
  iconButton,
}: TitleGroupProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-start justify-between rounded-md bg-neutral-100 p-3 text-neutral-900 sm:flex-row sm:items-center ${className}`}
    >
      <div
        className={`flex flex-wrap items-center text-sm font-bold md:text-lg lg:text-xl`}
      >
        {listText.map((text, index) =>
          index !== listText.length - 1 ? (
            <p key={`listText-${index}`} className="whitespace-nowrap">
              <span className="underline">{text}</span>
              <span className="mx-2">/</span>
            </p>
          ) : (
            <p key={`listText-${index}`}>{text}</p>
          ),
        )}
      </div>

      {/* Subtitle Section */}
      {subtitle && subtitle.length > 0 && (
        <div className="mt-2 flex flex-col sm:ml-5 sm:mt-0 sm:flex-row sm:gap-4">
          {subtitle.map((item) => (
            <div key={item.title} className="flex gap-1">
              <span>{item.totalNumber}</span> <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Button Section */}
      {buttonSpecial && (
        <CWButton
          title={titleButton}
          onClick={onClickButton}
          icon={iconButton}
          className="mt-2 sm:mt-0"
        />
      )}
    </div>
  );
};

export default CWTitleGroup;
