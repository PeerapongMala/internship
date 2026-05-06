interface AnnouncementGuidelinesProps {
  responsiveEvent: any;
}

const AnnouncementGuidelines: React.FC<AnnouncementGuidelinesProps> = ({
  responsiveEvent,
}) => {
  return (
    <div
      className={`flex flex-col items-center h-fit  ${
        responsiveEvent.mobileIs ? 'pt-4 pb-5 gap-4 h-[1000px]' : 'pt-6 pb-7 gap-6'
      }`}
    >
      {/* Header */}
      <div
        className={`text-text mx-auto ${
          responsiveEvent.mobileIs ? 'text-[24px]' : 'text-[40px]'
        } font-semibold text-center`}
      >
      ข้อกําหนดราชการในการลงประกาศหนังสือพิมพ์
      </div>

      {/* Cards Section */}
      <div
        className={`flex ${
          responsiveEvent.mobileIs
            ? 'flex-col gap-14 items-center w-full'
            : 'flex-row justify-center gap-8'
        }`}
      >
        {/* General Rules Card */}
        <div
          className={`flex flex-col bg-white border border-gray-200 rounded-3xl shadow dark:bg-[#414141] dark:border-[#414141]  ${
            responsiveEvent.mobileIs
              ? 'p-10 w-full max-w-[85%] rounded-2xl'
              : 'p-6 w-[474px] rounded-xl '
          }`}
        >
          <div
            className={`text-black dark:text-[#D7D7D7]  ${
              responsiveEvent.mobileIs
                ? 'inline text-[14px] leading-[40px]'
                : 'text-[20px] leading-[54px]'
            } font-semibold pb-6`}
          >
            <div>
              <span
                className={`text-secondary ${
                  responsiveEvent.mobileIs ? 'text-[20px]' : 'text-[40px]'
                } pr-1`}
              >
                มติทั่วไป
              </span>{' '}
              ลงประกาศหนังสือพิมพ์ 1 ครั้ง ก่อนวันจัดประชุมไม่น้อยกว่า 7 วัน หรือตามที่กำหนดไว้ในข้อบังคับ ได้แก่
            </div>
             
          </div>
          <ul
            className={`text-[#504F4F] dark:text-[#B9BCC2] ${
              responsiveEvent.mobileIs
                ? 'text-[14px] leading-[36px]'
                : 'text-[16px] leading-[48px]'
            } font-normal list-disc list-inside space-y-2 ${
              responsiveEvent.mobileIs ? 'pl-4' : 'pl-16'
            }`}
          >
            <li>การประชุมสามัญประจําปี (การประชุมงบการเงิน)</li>
            <li>การเชิญประชุมผู้ถือหุ้นประจําปี</li>
            <li>การเปลี่ยนแปลงรายชื่อผู้ถือหุ้น</li>
            <li>การเปลี่ยนแปลงกรรมการหรืออํานาจกรรมการ</li>
            <li>การเปลี่ยนแปลงทรัพย์สินของบริษัท</li>
            <li>การชําระบัญชี</li>
          </ul>
        </div>

        {/* Special Rules Card */}
        <div
          className={`flex flex-col bg-white border border-gray-200 rounded-3xl shadow dark:bg-[#414141] dark:border-[#414141]  ${
            responsiveEvent.mobileIs
              ? 'p-10 w-full max-w-[85%] rounded-2xl'
              : 'p-6 w-[474px] rounded-xl '
          }`}
        >
          <div
            className={`text-black dark:text-[#D7D7D7] ${
              responsiveEvent.mobileIs
                ? 'inline text-[14px] leading-[40px]'
                : 'text-[20px] leading-[54px]'
            } font-semibold pb-6`}
          >
            <div>
              <span
                className={`text-secondary ${
                  responsiveEvent.mobileIs ? 'text-[20px]' : 'text-[40px]'
                } pr-1`}
              >
                มติพิเศษ
              </span>
              การเปลี่ยนแปลงที่กระทบต่อบริคณห์สนธิ ลงประกาศหนังสือพิมพ์ 1 ครั้ง ก่อนวันจัดประชุมไม่น้อยกว่า 14 วัน หรือตามที่กําหนดไว้ในข้อบังคับ ได้แก่
            </div>
             
          </div>
          <ul
            className={`text-[#504F4F] dark:text-[#B9BCC2]  ${
              responsiveEvent.mobileIs
                ? 'text-[14px] leading-[36px]'
                : 'text-[16px] leading-[48px]'
            } font-normal list-disc list-inside space-y-2 ${
              responsiveEvent.mobileIs ? 'pl-4' : 'pl-16'
            }`}
          >
            <li>เปลี่ยนแปลงหนังสือบริคณห์สนธิหรือแก้ไขข้อบังคับ</li>
            <li>การเพิ่มทุนหรือลดทุนจดทะเบียน</li>
            <li>การแก้ไขที่ตั้งสํานักงานใหญ่เฉพาะข้ามจังหวัด</li>
            <li>การแก้ไขชื่อและตราสําคัญบริษัท</li>
            <li>การเปลี่ยนแปลงวัตถุประสงค์</li>
            <li>การเลิกกิจการหรือควบกิจการ</li>
            <li>การแจ้งการจ่ายเงินปันผล</li>
            <li>การแปรสภาพห้างหุ้นส่วนเป็นบริษัท</li>
            <li>การเลิกห้างหุ้นส่วน</li>
            <li>การบังคับจำนอง</li>
            <li>การแจ้งให้ชําระหนี้</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AnnouncementGuidelines;
