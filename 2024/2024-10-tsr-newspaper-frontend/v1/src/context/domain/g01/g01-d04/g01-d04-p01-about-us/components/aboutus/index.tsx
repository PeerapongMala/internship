import PreviewAbout from '../../../local/asset/About_Us.png';
import TextAboutUs from './../image//text-about-us.png';
import TextAboutUsDark from './../image/text-about-us-dark.png';

const AboutUs = () => {
  return (
    <div className="flex justify-center px-4 lg:px-20">
      <div className="shadow-md rounded-[20px]  bg-white dark:bg-dark lg:max-w-[1184px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[84.84px]  lg:max-h-[684px] mx-[15px] md:mx-[128px] xl:mx-auto pt-[56px] pb-[96px] px-6 lg:px-[63px]">
        <div className=" lg:w-[534px] flex flex-col gap-10 lg:gap-y-4 justify-center">
          <div className="text-center font-bold text-2xl leading-[54px] lg:font-semibold lg:text-left lg:text-[40px] lg:leading-10 dark:text-[#D7D7D7]">
            เกี่ยวกับเรา
          </div>
          <div className="w-[200px] h-[100px]">
            <img src={TextAboutUs} alt="Logo" className="w-full h-full dark:hidden" />
            <img
              src={TextAboutUsDark}
              alt="Logo-contact-dark"
              className="w-full h-full hidden dark:block"
            />
          </div>
          <div className="h-[368px] sm:h-fit">
            <p className="text-[#414141] font-medium text-[15.5px] leading-8 dark:text-[#D7D7D7] whitespace-pre-line break-words">
              {`บริษัท ประกาศข่าวดี จำกัด จัดตั้งเพื่อทำหนังสือพิมพ์ เว็บประกาศข่าว `}
              <br />
              <a
                href="https://e-service.nlt.go.th/ISSNReq/Detail/6156"
                className="text-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                เลขที่ใบอนุญาต ISSN 3057-1405 (Online)
              </a>

              <br />
              <br />
              <br className="block sm:hidden" />
              {` เป็นหนังสือพิมพ์รายวันท้องถิ่นที่มีวัตถุประสงค์เพื่อเผยแพร่ข่าวสารด้านบัญชี ภาษีอากร และข้อความประกาศต่างๆ ที่จำเป็นสำหรับการดำเนินไปตามปกติแห่งธุรกิจการค้า เช่น การประกาศบอกกล่าวเรียกประชุมใหญ่ผู้ถือหุ้นของนิติบุคคล`}
              <br className="hidden md:block" />
              {`  ตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 1175 หรือประกาศข้อความตามกฎหมายอื่นๆ เช่น การแปรสภาพห้างหุ้นส่วน, การเพิ่มทุน ลดทุน, การบังคับจำนอง, การแจ้งให้ชำระหนี้ การเลิกบริษัท ฯลฯ ทั้งนี้เพื่อความครบถ้วนถูกต้องตามที่กฎหมายกำหนด ซึ่งหากฝ่าฝืนต้องระวางโทษปรับตามกฎหมาย`}
            </p>
          </div>
        </div>
        <br></br>
        <div className="w-[282px] h-[439px] lg:w-[439px] lg:h-[529px]">
          <img
            className="w-full h-full object-contain"
            src={PreviewAbout}
            alt="preview-about"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
