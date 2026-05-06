import MyQrCode from '../../organism/cw-o-my-qr-code';

const MyQrCodeTemplate = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mt-12 text-center font-noto-sans-thai text-base font-medium text-black">
        แสกนคิวอาร์เพื่อเพิ่มสมาชิก
      </div>

      <MyQrCode />
    </div>
  );
};

export default MyQrCodeTemplate;
