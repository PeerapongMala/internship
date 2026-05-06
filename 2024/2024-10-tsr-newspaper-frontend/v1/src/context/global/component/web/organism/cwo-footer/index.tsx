import { link } from 'fs';
import StoreGlobal from '../../../../store/global';
import FooterResponsiveFreesize from './responsive/freesize';
import FooterResponsiveMobile from './responsive/mobile';
import TSRFooterLogo from '@asset/Logo/text-about-us-dark.png'; 


export type FooterData = {
  companyInfo: {
    name: string;
    license: string;
    logo: string;
    link: string;
  };
  contactInfo: {
    // phone: string;
    email: string;
    workingHours: string;
  };
  links: {
    label: string;
    link: string;
  }[];
  socialMedia: {
    platform: string;
    icon: any;
    link: string;
  }[];
};

const Footer = (props: {}) => {
  const footerData = {
    companyInfo: {
      name: 'บริษัท ประกาศข่าวดี จำกัด',
      license: 'เลขที่ใบอนุญาต ISSN 3057-1405 (Online)',
      logo: TSRFooterLogo,
      link: 'https://e-service.nlt.go.th/ISSNReq/Detail/6156',
    },
    contactInfo: {
      // phone: '',
      email: 'hello@prakardkhao.com',
      workingHours: 'เวลาติดต่อ 09:00 - 18:00 น.',
    },
    links: [
      {
        label: 'ลงประกาศ',
        link: '/post',
      },
      {
        label: 'ดาวน์โหลดหนังสือพิมพ์',
        link: '/download',
      },
      {
        label: 'เกี่ยวกับเรา',
        link: '/about-us',
      },
      {
        label: 'คําถามที่พบบ่อย',
        link: '/faq',
      },
    ],
    socialMedia: [
      {
        platform: 'Email',
        icon: (
          <svg
            width="45"
            height="46"
            viewBox="0 0 45 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="0.5"
              width="45"
              height="45"
              rx="5.45455"
              fill="white"
              fill-opacity="0.6"
            />
            <path
              d="M8.5 16C8.5 15.2044 8.81607 14.4413 9.37868 13.8787C9.94129 13.3161 10.7044 13 11.5 13H32.5C33.2956 13 34.0587 13.3161 34.6213 13.8787C35.1839 14.4413 35.5 15.2044 35.5 16V31C35.5 31.7956 35.1839 32.5587 34.6213 33.1213C34.0587 33.6839 33.2956 34 32.5 34H11.5C10.7044 34 9.94129 33.6839 9.37868 33.1213C8.81607 32.5587 8.5 31.7956 8.5 31V16Z"
              fill="#262626"
            />
            <path d="M8.5 16L22 25L35.5 16" fill="#262626" />
            <path
              d="M8.5 16C8.5 15.2044 8.81607 14.4413 9.37868 13.8787C9.94129 13.3161 10.7044 13 11.5 13H32.5C33.2956 13 34.0587 13.3161 34.6213 13.8787C35.1839 14.4413 35.5 15.2044 35.5 16M8.5 16V31C8.5 31.7956 8.81607 32.5587 9.37868 33.1213C9.94129 33.6839 10.7044 34 11.5 34H32.5C33.2956 34 34.0587 33.6839 34.6213 33.1213C35.1839 32.5587 35.5 31.7956 35.5 31V16M8.5 16L22 25L35.5 16"
              stroke="#A8A8A8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
        link: 'mailto:hello@prakardkhao.com',
      },
      
      {
        platform: 'YouTube',
        icon: (
          <svg
            width="45"
            height="46"
            viewBox="0 0 45 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="0.5"
              width="45"
              height="45"
              rx="5.45455"
              fill="white"
              fill-opacity="0.6"
            />
            <g clip-path="url(#clip0_4607_31689)">
              <path
                d="M35.3771 15.3946C36.0003 17.8246 36.0003 22.8974 36.0003 22.8974C36.0003 22.8974 36.0003 27.9701 35.3771 30.4001C35.0307 31.7433 34.0175 32.8001 32.7344 33.1574C30.4039 33.8065 22.3639 33.8065 22.3639 33.8065C22.3639 33.8065 14.328 33.8065 11.9934 33.1574C10.7048 32.7946 9.69299 31.7392 9.35072 30.4001C8.72754 27.9701 8.72754 22.8974 8.72754 22.8974C8.72754 22.8974 8.72754 17.8246 9.35072 15.3946C9.69708 14.0515 10.7103 12.9946 11.9934 12.6374C14.328 11.9883 22.3639 11.9883 22.3639 11.9883C22.3639 11.9883 30.4039 11.9883 32.7344 12.6374C34.023 13.0001 35.0348 14.0556 35.3771 15.3946ZM19.6366 27.6701L27.8184 22.8974L19.6366 18.1246V27.6701Z"
                fill="#262626"
              />
            </g>
            <defs>
              <clipPath id="clip0_4607_31689">
                <rect
                  width="32.7273"
                  height="32.7273"
                  fill="white"
                  transform="translate(6 6.53369)"
                />
              </clipPath>
            </defs>
          </svg>
        ),
        link: 'https://youtube.com/@prakardkhao', // ใส่ลิงก์ YouTube
      },
    ],
  };

  const { responsiveEvent } = StoreGlobal.StateGet(['responsiveEvent']);

  return (
    <header className="bg-[#262626] text-white text-opacity-60 ">
      {responsiveEvent.mobileIs ? (
        <FooterResponsiveMobile footerData={footerData} />
      ) : (
        <FooterResponsiveFreesize footerData={footerData} />
      )}
    </header>
  );
};

export default Footer;
