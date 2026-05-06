import { Link } from '@tanstack/react-router';

import { FooterData } from '../..';

type FooterProps = {
  footerData: FooterData;
};

const FooterResponsiveFreesize: React.FC<FooterProps> = ({ footerData }) => {
  return (
    <div>
      <div className="flex flex-row bg-[#262626] text-white text-opacity-60 px-6 py-12 justify-center gap-28 text-[16px]">
        {/* ส่วนโลโก้และข้อมูลบริษัท */}
        <div className="flex flex-col gap-7">
          {/* โลโก้ */}
          <img
            src={footerData.companyInfo.logo}
            alt="Company Logo"
            className="w-[248px] h-[104px]"
          />
          {/* ข้อมูลบริษัท */}
          <div className="flex flex-col gap-2 font-normal leading-[28px] text-opacity-60">
            <p>{footerData.companyInfo.name}</p>
            <a
              href={footerData.companyInfo.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:underline">{footerData.companyInfo.license}</p>
            </a>         </div>
        </div>

        {/* ส่วนลิงก์และโซเชียลมีเดีย */}
        <div className="flex justify-between  gap-16">
          {/* ไอคอนโซเชียลมีเดีย */}
          <div className="flex flex-col  gap-4">
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
          <div className="flex flex-col gap-2 font-medium text-opacity-80 leading-[24px]">
            {footerData.links.map((link, index) => (
              <Link key={index} to={link.link} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>

          {/* ข้อมูลการติดต่อ */}
          <div className="flex flex-col gap-2 font-normal text-opacity-60 leading-[24px]">
            <p className="font-semibold">ติดต่อเรา</p>
            {/* <p>โทร: {footerData.contactInfo.phone}</p> */}
            <p>
              อีเมล:{' '}
              <a
                href={`mailto:${footerData.contactInfo.email}`}
                className="hover:underline"
              >
                {footerData.contactInfo.email}
              </a>
            </p>
            <p>{footerData.contactInfo.workingHours}</p>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="bg-black text-center text-sm text-opacity-50">
        Prakardkhaodee Co., Ltd. All Right Reserved.
      </div>
    </div>
  );
};

export default FooterResponsiveFreesize;
