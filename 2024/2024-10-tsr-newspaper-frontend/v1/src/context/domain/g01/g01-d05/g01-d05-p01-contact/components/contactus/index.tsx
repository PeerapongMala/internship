import PreviewContactUs from './../image/new-contact-us.png';
import TextContactUs from './../image/text-contact-us.png';
import TextContactUsDark from './../image/text-contact-us-dark.png';
import {
  ClockIcon,
  LineIcon,
  MailIcon,
  MapIcon,
  PhoneIcon,
  LineIconDark,
  MailIconDark,
} from '../../../local/icon/icon/index';

type contactItems = {
  icon: JSX.Element;
  darkIcon: JSX.Element;
  text: string;
  key: number;
};

const ContactUs = () => {
  const contactItems: contactItems[] = [
    {
      key: 1,
      icon: <MapIcon />,
      darkIcon: <MapIcon />,
      text: `บริษัท ประกาศข่าวดี จำกัด ทะเบียนนิติบุคคลเลขที่ 0105568017572`,
    },
    // {
    //   icon: <PhoneIcon />,
    //   darkIcon: <PhoneIcon />,

    //   text: '',
    // },
    {
      key: 2,
      icon: <ClockIcon />,
      darkIcon: <ClockIcon />,
      text: 'เวลาติดต่อ 09:00 - 18:00 น.',
    },
    {
      key: 3,
      icon: <MailIcon />,
      darkIcon: <MailIconDark />,
      text: 'hello@prakardkhao.com',
    },
  ];

  return (
    <div className="flex justify-center px-4 lg:px-20">
      <div className="shadow-md rounded-[20px] w-full bg-white dark:bg-dark lg:max-w-[1184px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[84.84px]  lg:max-h-[684px] mx-[15px] md:mx-[128px] xl:mx-auto pt-[56px] pb-[96px] px-6 lg:px-[63px]">
        <div className="lg:w-[534px] flex flex-col gap-10 lg:gap-y-4 justify-center">
          <div className="text-center font-bold text-2xl leading-[54px] lg:font-semibold lg:text-left lg:text-[40px] lg:leading-10 dark:text-[#D7D7D7]">
            ติดต่อเรา
          </div>
          <div className="w-[200px] h-[100px]">
            <img className="w-full h-full dark:hidden" src={TextContactUs} alt="Logo" />
            <img
              className="w-full h-full hidden dark:block"
              src={TextContactUsDark}
              alt="Logo-contact-dark"
            />
          </div>
          <div className="flex flex-col gap-3">
            {contactItems.map((item, index) => (
              <ContactItem
                key={index}
                icon={item.icon}
                darkIcon={item.darkIcon}
                text={item.text}
              />
            ))}
          </div>
        </div>
        <div className="w-[350px] lg:w-[439px] pt-20">
          <img className="w-full h-full" src={PreviewContactUs} alt="preview-contact" />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

const ContactItem = ({ icon, text, darkIcon, key }: contactItems) => (
  <div className="flex gap-x-3">
    <div className="w-9 h-9 dark:hidden">{icon}</div>
    <div className="w-9 h-9 hidden dark:block">{darkIcon}</div>
    <p className="text-gray-custom text-base content-center leading-5 font-medium max-w-[271px] xl:max-w-[396px] dark:text-[#D7D7D7] break-words xl:whitespace-pre">
      {text === 'hello@prakardkhao.com' ? (
        <a
          href="mailto:hello@prakardkhao.com"
          className=""
        >
          hello@prakardkhao.com
        </a>
      ) : (
        <>{text}</>
      )}
    </p>
  </div>
);

/**
 * 
 *   <div className="flex justify-center px-4 lg:px-20">
      <div className="shadow-md rounded-[20px] bg-white dark:bg-dark xl:max-w-[1184px] flex flex-col xl:flex-row items-center justify-between xl:max-h-[684px] mx-[15px] md:mx-[128px] xl:mx-auto pt-[56px] pb-[55px] xl:py-[77px] xl:px-[123px]">
        <div className="relative w-[360px] h-fit xl:w-[938px] xl:h-[411px] flex flex-col gap-10 xl:gap-0">
          <div className="z-10 text-center font-bold text-2xl leading-[54px] xl:font-semibold xl:text-left xl:text-[40px] xl:leading-10 dark:text-[#D7D7D7]">
            ติดต่อเรา
          </div>
          <div className="z-10 w-[312px] h-[51px] mx-auto xl:mx-0 xl:w-[376px] xl:h-[60px] xl:mt-[15px] xl:mb-[31px]">
            <img
              className="z-10 w-full h-full dark:hidden"
              src={TextContactUs}
              alt="preview-contact"
            />
            <img
              className="z-10 w-full h-full dark:block"
              src={TextContactUsDark}
              alt="preview-contact-dark"
            />
          </div>
          <div className="z-10 w-[312px] h-[318px] xl:h-[263px] mx-auto xl:mx-0 sm:h-auto flex flex-col gap-y-3">
            {contactItems.map((item, index) => (
              <ContactItem
                key={index}
                icon={item.icon}
                darkIcon={item.darkIcon}
                text={item.text}
              />
            ))}
          </div>
          <div className="w-[360px] h-[253px] xl:absolute xl:right-0 xl:w-[581px] xl:h-[409px]">
            <img className="w-full h-full" src={PreviewContactUs} alt="preview-contact" />
          </div>
        </div>
      </div>
    </div>
 */
