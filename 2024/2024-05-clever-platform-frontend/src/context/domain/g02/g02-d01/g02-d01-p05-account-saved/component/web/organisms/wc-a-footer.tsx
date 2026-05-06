import Button from '@global/component/web/atom/wc-a-button';
import ImageIconAccount from '../../../assets/icon-account.svg';

const Footer = ({
  handleClickAddUser,
  title = 'เพิ่มบัญชี',
}: {
  handleClickAddUser: () => void;
  title?: string;
}) => {
  return (
    <div className="relative flex flex-col w-full pt-4 px-6 gap-4">
      <div className="flex justify-center">
        {/* <ButtonGreen
          onClick={handleClickAddUser}
          suffix={<img src={ImageIconAccount} className="h-10 w-14 mt-2 pr-2" />}
        >
          <div className="h-[54px] w-[22.5rem] pt-[3px]">
            <TextWithStroke
              text={title}
              className="flex w-full h-full text-3xl justify-center items-center"
              strokeColor="#06AB17"
            />
          </div>
        </ButtonGreen> */}

        <Button
          onClick={handleClickAddUser}
          className="h-full w-full"
          variant="success"
          width="28rem"
          height="5rem"
          suffix={<img src={ImageIconAccount} className="h-12 w-16 pr-2 pt-2" />}
        >
          {title}
        </Button>
      </div>
    </div>
  );
};

export default Footer;
