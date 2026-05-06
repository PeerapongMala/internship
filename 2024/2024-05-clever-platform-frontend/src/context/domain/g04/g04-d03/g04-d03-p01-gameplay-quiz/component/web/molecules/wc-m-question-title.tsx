import ButtonHint from '@global/component/web/atom/wc-a-button-hint';
import { useTranslation } from 'react-i18next';
import Latex from 'react-latex-next';
import ConfigJson from '../../../config/index.json';
import { GameConfig } from '../../../type';

const Title = ({
  title,
  className,
  disableHint,
  onHintClick,
  showHint,
  gameConfig
}: {
  title?: string;
  className?: string;
  disableHint?: boolean;
  onHintClick?: () => void;
  showHint?: boolean;
  gameConfig?: GameConfig;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const defaultTitle = t('titles.defaultTitle', '');
  const displayTitle = title || defaultTitle;

  return (
    <div
      className={`relative flex gap-2 w-full items-center p-3 py-4 font-semibold bg-white
    rounded-t-[35px] border-b-2 border-dashed border-secondary
     ${className}`}
      style={{ height: 'auto' }}
    >
      <div className="w-[85%] pl-2 flex flex-wrap items-center">
        {/*Removed position absolute*/}
        {displayTitle ? <Latex>{displayTitle}</Latex> : <span className="">&nbsp;</span>}
      </div>
      {!showHint && gameConfig?.questionType !== 'learn' && (
        <div className="absolute w-28 h-full top-0 right-0">
          <div className="absolute right-0">
            <ButtonHint
              onClick={onHintClick}
              disabled={disableHint}
              aria-label={t('titles.hintButton', 'ปุ่มคำใบ้')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Title;
