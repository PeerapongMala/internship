import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import MyQrCode from '../../organism/cw-o-my-qr-code';
import { TFamilyQrCodeData } from '../../../../types/family';

const MyQrCodeTemplate = () => {
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);

  const qrCodeData: TFamilyQrCodeData = { user_id: userData.id };

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
