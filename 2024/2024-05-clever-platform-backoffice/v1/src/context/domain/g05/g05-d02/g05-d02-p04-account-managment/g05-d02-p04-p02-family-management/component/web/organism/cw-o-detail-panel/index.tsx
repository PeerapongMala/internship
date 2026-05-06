import IconScan from '@core/design-system/library/component/icon/IconScan';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import FamilyInfo from '../../molecule/cw-m-family-info';

import IconEdit3 from '@core/design-system/library/component/icon/IconEdit3';
import { useFamilyEditStore } from '@domain/g05/g05-d02/local/stores/family-store';
import { TFamily } from '@domain/g05/g05-d02/local/types/family';
import { useNavigate, useParams } from '@tanstack/react-router';

import { useState } from 'react';
import Swal from 'sweetalert2';
import DropdownScanMethod from '../../molecule/cw-m-dropdown-scan-method';
import QRCodeScannerModal from '../../molecule/cw-m-camera-scanner-modal';
import ButtonIcon from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-button-icon';
import {
  convertQrDataToObject,
  isValidISODate,
} from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/helpers/qrcode';
import { TFamilyQrCodeData } from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/types/family';
import dayjs from 'dayjs';
import API from '@domain/g05/g05-d02/local/api';
import showMessage from '@global/utils/showMessage';
import { EManageFamilyType } from '@domain/g05/g05-d02/local/enums/family';
import { AxiosError } from 'axios';
import { TBaseErrorResponse } from '@domain/g06/g06-d02/local/types';

type FamilyDetailsPanelProps = {
  family?: TFamily;
  ownerName: string;

  onAddMemberSuccess?: () => void;
};

const FamilyDetailsPanel = ({
  family,
  ownerName,
  onAddMemberSuccess,
}: FamilyDetailsPanelProps) => {
  const editStore = useFamilyEditStore((state) => state);
  const [isEdit, setIsEdit] = [editStore.isEdit, editStore.setEdit];
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpenCameraModal, setIsOpenCameraModal] = useState(false);

  const navigate = useNavigate();
  const params: { family_id: string } = useParams({ strict: false });

  const handleClickScan = () => {
    // navigate({ to: '/line/family/management/add' });
    setIsOpenDropdown(true);
    // if (isMobile()) {
    //   navigate({ to: '/line/parent/management/add' });
    //   return;
    // }
  };

  const handlePCScanQrCode = () => {
    alert('User add to XD');
  };

  const confirmDeleteFamily = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this family? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDeleteFamily();
        Swal.fire('Deleted!', 'The family has been deleted.', 'success').then(() => {
          navigate({ to: '/line/parent/family' });
        });
      }
    });
  };

  const handleDeleteFamily = async () => {
    API.Family.PostUpdateData({
      Body: { family_id: family?.family_id, manage_family: EManageFamilyType.DELETE },
    });
  };

  const handleDataScanned = (dataString: string) => {
    try {
      const url = new URL(dataString);

      if (url.pathname !== '/line/parent/family/add/member') {
        Swal.fire('Invalid QR Code Path');
        return;
      }

      const user_id = url.searchParams.get('user_id');
      const expired_at = url.searchParams.get('expired_at');

      if (!user_id) {
        Swal.fire('Invalid user_id');
        return;
      }

      if (!expired_at || !isValidISODate(expired_at)) {
        Swal.fire('Invalid expired_at format');
        return;
      }

      if (dayjs().isAfter(dayjs(expired_at))) {
        Swal.fire('QR Code Expired');
        return;
      }

      // ✅ All checks passed
      handleAddMember(user_id);
    } catch (err) {
      Swal.fire((err as Error).message);
      setIsOpenCameraModal(false);
      throw err;
    }
  };

  const handleAddMember = async (userID: string) => {
    if (!family?.family_id || isNaN(Number(family?.family_id))) {
      showMessage('Invalid Family ID', 'error');
    }

    try {
      await API.Family.AddFamilyMember({
        user_id: userID,
        family_id: Number(family?.family_id),
      });
    } catch (error) {
      showMessage(
        (error as AxiosError<TBaseErrorResponse>).response?.data?.message ??
          (error as Error).message,
        'error',
      );
      throw error;
    }

    setIsOpenCameraModal(false);

    onAddMemberSuccess?.();
  };

  return (
    <div className="flex gap-2 p-5">
      {family && (
        <FamilyInfo
          className="flex-1"
          familyId={family?.family_id}
          ownerName={ownerName}
        />
      )}
      {isEdit ? (
        <>
          <div className="">
            <ButtonIcon
              icon={<IconScan className="h-5 w-5" />}
              onClick={handleClickScan}
            />
            <DropdownScanMethod
              isOpen={isOpenDropdown}
              familyID={Number(params.family_id)}
              handleCloseDropdown={() => setIsOpenDropdown(false)}
              onSelectCameraClick={() => setIsOpenCameraModal(true)}
              onQrCodeResult={handleDataScanned}
              onAddMemberSuccess={onAddMemberSuccess}
            />

            {isOpenCameraModal && (
              <QRCodeScannerModal
                isOpen={isOpenCameraModal}
                handleCloseModal={() => setIsOpenCameraModal(false)}
                onResult={handleDataScanned}
              />
            )}
          </div>
        </>
      ) : (
        <ButtonIcon
          icon={<IconEdit3 className="h-5 w-5 text-gray-600" />}
          onClick={() => setIsEdit(true)}
        />
      )}

      <ButtonIcon
        icon={<IconTrash className="h-5 w-5 text-gray-600" />}
        onClick={confirmDeleteFamily}
      />
    </div>
  );
};

export default FamilyDetailsPanel;
