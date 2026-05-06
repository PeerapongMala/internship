import ButtonBack from '@component/web/atom/wc-a-button-back';
import TextHeader from '../atom/wc-a-text-header';

const HeaderJSX = ({
  handleBack = () => {},
  title = 'Title',
}: {
  handleBack: () => void;
  title: string;
}) => {
  return (
    <>
      <ButtonBack onClick={handleBack} />
      <TextHeader title={title} />
    </>
  );
};

export default HeaderJSX;
