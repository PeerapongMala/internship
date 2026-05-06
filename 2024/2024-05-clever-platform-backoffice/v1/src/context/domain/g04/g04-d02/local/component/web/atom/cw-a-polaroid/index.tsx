import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';

interface CWAPolaroidProps {
  className?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
}

const CWAPolaroid: React.FC<CWAPolaroidProps> = function (props) {
  const { t } = useTranslation(ConfigJson.key);

  return (
    <div className={`flex w-fit flex-col gap-4 border-2 p-2 ${props.className ?? ''}`}>
      <div
        className={`flex h-48 w-80 items-center justify-center bg-dark-light dark:bg-dark-dark-light ${props.headerClassName ?? ''}`}
      >
        {props.header}
      </div>
      <div className={`min-h-5 text-center ${props.bodyClassName ?? ''}`}>
        {props.body}
      </div>
    </div>
  );
};

export default CWAPolaroid;
