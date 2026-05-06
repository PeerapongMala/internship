import Button from '@global/component/web/atom/wc-a-button';
import ImageArrowRight from '../../../assets/arrow-glyph-right.svg';

const Footer = ({
  handleClickStart,
  title = 'เริ่มใช้งาน',
}: {
  handleClickStart: any;
  title?: string;
}) => {
  return (
    <div className="relative flex flex-col w-full pt-4 px-6 gap-4">
      <div className="flex justify-center">
        <Button
          suffix={<img src={ImageArrowRight} className="w-16 pt-1 pr-3" />}
          onClick={handleClickStart}
          variant="success"
          width="30rem"
          height="5rem"
        >
          {title}
        </Button>
      </div>
    </div>
  );
};

export default Footer;
