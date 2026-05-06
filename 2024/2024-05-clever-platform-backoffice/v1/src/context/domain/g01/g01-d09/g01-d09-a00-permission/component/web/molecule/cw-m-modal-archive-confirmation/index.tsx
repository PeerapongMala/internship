import IconClose from '@core/design-system/library/component/icon/IconClose';
import API from '@domain/g01/g01-d09/local/api';
import { EAdminReportPermissionStatus } from '@domain/g01/g01-d09/local/enums/admin-permission';

type DeleteConfirmationModalProps = {
  selectedId: number;
  handleClose?: () => void;
};

const ArchiveConfirmationModal = ({
  selectedId,
  handleClose,
}: DeleteConfirmationModalProps) => {
  const handleArchive = async () => {
    await API.adminReportPermissionAPI.BulkEditAdminReportPermission([
      {
        observer_access_id: selectedId,
        status: EAdminReportPermissionStatus.DISABLE,
      },
    ]);

    handleClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex w-[384-px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm overflow-hidden rounded-[7px] bg-white shadow-lg">
        <div className="flex gap-5 bg-neutral-100 px-5 py-3">
          <h2 className="flex-1 text-xl font-semibold">จัดเก็บ</h2>
          <button onClick={handleClose}>
            <IconClose />
          </button>
        </div>
        <div className="whitespace-pre-wrap p-5 text-sm">
          <p>ข้อมูลจะถูกซ่อน และสำรองไว้ในฐานข้อมูล</p>
          <p>คุณไม่สามารถเรียกใช้รายการที่จัดเก็บหรืออยู่ในสถานะไม่ใช้งาน</p>
        </div>

        <div className="flex justify-center space-x-4 px-5 pb-5">
          <button
            onClick={handleClose}
            className="w-full rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleArchive}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmationModal;
