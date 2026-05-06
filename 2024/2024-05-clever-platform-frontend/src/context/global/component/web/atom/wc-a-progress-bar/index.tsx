import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  progress: number;
  title?: string;
  footer?: string;
}

const ProgressBar = ({ progress, title, footer }: ProgressBarProps) => {
  const { t } = useTranslation(['global']);

  // note: uncomment this to use the dot animation for title
  // const [dot, setDot] = useState(3);
  // useEffect(() => {
  //   const titleDotInterval = setInterval(() => {
  //     setDot((prev) => (prev + 1) % 4);
  //   }, 500);
  //   return () => {
  //     clearInterval(titleDotInterval);
  //   };
  // });

  const dot = 3; // note: uncomment this to use the dot animation for title
  const defaultTitle = t('progress_bar_text');
  const finalTitle = (title ?? defaultTitle) + '.'.repeat(dot);

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <div className="text-center text-2xl">{finalTitle}</div>
      <div className="flex gap-2 w-full justify-center items-center">
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-2xl w-4">{progress}%</div>
      </div>
      {footer && <div className="text-end w-full text-2xl">{footer}</div>}
    </div>
  );
};

export default ProgressBar;
