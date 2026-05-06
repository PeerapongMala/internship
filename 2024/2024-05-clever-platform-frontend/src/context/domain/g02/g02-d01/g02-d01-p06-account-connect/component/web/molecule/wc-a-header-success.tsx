import ButtonBack from '../atom/wc-a-bt-back';
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
