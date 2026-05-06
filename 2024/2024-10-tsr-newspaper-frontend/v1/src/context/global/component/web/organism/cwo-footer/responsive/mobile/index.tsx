import { Link } from '@tanstack/react-router';
import { FooterData } from '../..';

type FooterProps = {
  footerData: FooterData;
};

const FooterResponsiveMobile: React.FC<FooterProps> = ({ footerData }) => {
  return (
    <div>
      <div className=" px-6 py-8 flex flex-col gap-12 text-[16px] font-light">
        {/* โลโก้และข้อมูลบริษัท */}
        <div className="flex flex-col items-start gap-7 ">
          <img
            src={footerData.companyInfo.logo}
            alt="Company Logo"
            className="w-[248px] h-[104px]"
          />
          <div className=" flex flex-col h-[132px]   leading-[44px]">
            <p className="">{footerData.companyInfo.name}</p>
            <a
              href={footerData.companyInfo.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:underline">{footerData.companyInfo.license}</p>
            </a>
          </div>
        </div>

        {/* ไอคอนโซเชียลมีเดีย */}
        <div className="flex gap-4">
          {footerData.socialMedia.map((media, index) => (
            <a
              key={index}
              href={media.link}
              target="_blank"
              rel="noopener noreferrer"
              className=" w-12 h-12 flex items-start justify-start"
            >
              <div className="w-6 h-6">{media.icon}</div>
            </a>
          ))}
        </div>

        {/* ลิงก์ */}
        <div className="flex flex-col  flex-shrink-0 gap-2 leading-[54px] ">
          {footerData.links.map((link, index) => (
            <Link key={index} to={link.link} className="text-sm hover:underline h-12">
              {link.label}
            </Link>
          ))}
        </div>

        {/* ข้อมูลการติดต่อ */}
        <div className="flex flex-col  items-start text-sm gap-2">
          <p className="font-semibold h-12">ติดต่อเรา</p>
          {/* <p className='h-12'>โทร: {footerData.contactInfo.phone}</p> */}
          <p className="h-12">
            อีเมล:{' '}
            <a
              href={`mailto:${footerData.contactInfo.email}`}
              className="hover:underline"
            >
              {footerData.contactInfo.email}
            </a>
          </p>
          <p className="h-12">{footerData.contactInfo.workingHours}</p>
        </div>
      </div>
      <div className="bg-black text-center text-sm text-opacity-50">
        Prakardkhaodee Co., Ltd. All Right Reserved.
      </div>
    </div>
  );
};

export default FooterResponsiveMobile;
