import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';

const Header = ({
  title,
  handleClickBack,
}: {
  title?: string;
  handleClickBack: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const defaultTitle = t('choose_account');

  return (
    <div className="flex relative justify-center w-full border-b-2 border-dashed border-secondary">
      <ButtonBack
        className="absolute h-[77px] w-[4rem] pt-4 pl-1 left-6"
        onClick={handleClickBack}
      />
      <div className="text-3xl font-semibold pt-8 pb-4">{defaultTitle}</div>
    </div>
  );
};

export default Header;
