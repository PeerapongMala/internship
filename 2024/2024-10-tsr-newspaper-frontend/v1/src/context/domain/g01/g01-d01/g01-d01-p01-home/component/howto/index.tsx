import useto1 from '@asset/illustation_Icon/use1.png';
import useto2 from '@asset/illustation_Icon/use2.png';
import useto3 from '@asset/illustation_Icon/use3.png';
import useto4 from '@asset/illustation_Icon/use4.png';

const methodSteps = [
  {
    title: 'สมัครสมาชิก',
    step: '1',
    description: [
      <>
        คลิกเข้าสู่ระบบ เลือก <strong> &apos;สมัครสมาชิก &apos;</strong>
        และกรอกข้อมูลให้ครบถ้วน
      </>,
    ],
    image: useto1,
  },
  {
    title: 'ลงประกาศ',
    step: '2',
    description: [
      ' เลือกอัปโหลดไฟล์ที่จะลงประกาศได้ 2 รูปแบบคือ ไฟล์ PDF และ ไฟล์รูปภาพประเภท JPEG และ PNG',
    ],
    image: useto2,
  },
  {
    title: 'ชำระเงิน',
    step: '3',
    description: [
      'สามารถชำระได้หลากหลายช่องทาง ได้แก่ คิวอาร์โค้ด (QR Payment) / บัตรเครดิตและบัตรเดบิต (Credit, Debit Card) และอื่น ๆ',
    ],
    image: useto3,
  },
  {
    title: 'ดาวน์โหลด',
    step: '4',
    description: ['รับชมและดาวน์โหลดเนื้อหาผ่านเว็บไซต์'],
    image: useto4,
  },
];
interface MethodOfUseProps {
  responsiveEvent: any; // Adjust the type as per your StoreGlobal definition
}
const MethodOfUse: React.FC<MethodOfUseProps> = ({ responsiveEvent }) => {
  return (
    <div
      className={`relative flex ${responsiveEvent.mobileIs
          ? 'flex-col gap-6 px-4'
          : 'flex-col items-center gap-[40px]'
        }`}
    >
      {/* Background Section */}
      <div
        className={`absolute bg-[#D9A84E] left-0 right-0 z-0 ${responsiveEvent.mobileIs ? 'top-[294px] h-[1400px]' : 'top-[266px] h-[351px]'
          }`}
      ></div>

      {/* Title */}
      <div
        className={`text-text mx-auto ${responsiveEvent.mobileIs ? 'text-[28px]' : 'text-[34px] md:text-[40px]'
          } font-semibold`}
      >
        ลงประกาศง่าย ๆ เพียงไม่กี่ขั้นตอน
      </div>

      {/* Steps Container */}
      <div
        className={`flex ${responsiveEvent.mobileIs
            ? 'flex-col w-full gap-8'
            : 'flex-row max-w-[1170px] gap-[25px]'
          } h-auto z-10`}
      >
        {methodSteps.map(({ title, step, description, image }, index) => (
          <div
            key={index}
            className={`relative ${responsiveEvent.mobileIs
                ? 'w-full max-w-[80%] mx-auto h-[441px] p-6 '
                : 'p-8 w-[500px] h-[586px]'
              } text-text bg-white border border-gray-200 rounded-3xl shadow dark:bg-[#414141] dark:border-[#414141]`}
          >
            {/* Step Number */}

            <h1
              className={`absolute ${responsiveEvent.mobileIs
                  ? 'top-[35px] text-[64px]'
                  : 'top-[65px] text-[96px]'
                } text-secondary text-center font-anuphan font-bold leading-[54px]`}
            >
              {step}
            </h1>
            <p
              className={`absolute ${responsiveEvent.mobileIs
                  ? 'top-[110px] text-[22px]'
                  : 'top-[146px] text-[24px]'
                } text-center font-medium leading-[54px]`}
            >
              {title}
            </p>
            <ul
              className={`absolute ${responsiveEvent.mobileIs
                  ? 'top-[160px] left-6 text-[20px]'
                  : 'top-[193px] left-[36.69px]'
                }text-[#5C5C5C] dark:text-[#B9BCC2]  `}
            >
              {description.map((desc, i) => (
                <p
                  key={i}
                  className={`${responsiveEvent.mobileIs
                      ? 'text-base leading-[22px] mr-4'
                      : 'text-sm leading-[30px]  mr-5'
                    }  font-light list-disc list-inside`}
                >
                  {desc}
                </p>
              ))}
            </ul>
            <div
              className={`absolute ${responsiveEvent.mobileIs ? 'top-[210px]' : 'top-[310px] w-full'
                } left-1/2 transform -translate-x-1/2 flex justify-center`}
            >
              <img
                src={image}
                alt={`${title} Illustration`}
                className={`${responsiveEvent.mobileIs
                    ? ' w-[153px] h-[186px] mt-11'
                    : 'w-[197px] h-[240px]'
                  } object-cover `}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MethodOfUse;
