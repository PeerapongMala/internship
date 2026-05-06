import ButtonText from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-button-text';
import { API } from '@domain/g05/g05-d02/local/api';
import { EManageFamilyType } from '@domain/g05/g05-d02/local/enums/family';
import { TFamily } from '@domain/g05/g05-d02/local/types/family';
import { api } from '@domain/g06/g06-d06/local/api';
import showMessage from '@global/utils/showMessage';
import { useNavigate } from '@tanstack/react-router';
import isMobile from 'is-mobile';
import { useEffect, useRef, useState } from 'react';

const FamilyCreatePanel = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [family, setFamily] = useState<TFamily>();
  const [isFetchFamily, setIsFetchFamily] = useState(false);

  useEffect(() => {
    fetchFamily();
  }, []);
  const fetchFamily = async () => {
    setIsFetchFamily(true);

    try {
      const response = await API.Family.GetFamily({});
      if (response?.data?.data?.family_id) {
        setFamily(response.data.data);
      }
    } catch (error) {
      showMessage((error as Error).message, 'error');
    } finally {
      setIsFetchFamily(false);
    }
  };

  const handleCreateFamily = async () => {
    try {
      const response = await API.Family.PostUpdateData({
        Body: { users: [], manage_family: EManageFamilyType.CREATE },
      });

      showMessage('สร้างครอบครัวสำเร็จ');
    } catch (error) {
      showMessage((error as Error).message, 'error');
      throw error;
    }

    fetchFamily();
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* // ? this for user to select qrcode to upload */}
      {/* <InputQrCode inputRef={inputRef} onQrCodeResult={handleOnScanQrCode} /> */}
      {family?.family_id ? (
        <ButtonText
          onClick={() =>
            navigate({
              to: `/line/parent/family/${family.family_id}/management?is_edit=true`,
            })
          }
          label="เข้าสู่ครอบครัว"
          className="mt-[50%] sm:mt-[20%]"
        />
      ) : (
        <ButtonText onClick={handleCreateFamily} label="สร้างครอบครัว" />
      )}
    </div>
  );
};

export default FamilyCreatePanel;
