import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ConfirmModal from '../confirm-modal';
import { Announcement, EStatusAnnouncement } from '../../../local/api/restapi/annoucement';
import RenderContentApproved from '../render-content-approved';
import RenderWaitingApproval from '../render-waiting-approval';

interface StatusUpdate {
  id: number;
  status: EStatusAnnouncement;
}

interface StatusChangeItem {
  id: number;
  oldStatus: EStatusAnnouncement;
  newStatus: EStatusAnnouncement;
}

interface ApproveListProps {
  isLoading: boolean;
  announcements: Announcement[];
  setAnnouncements: Dispatch<SetStateAction<Announcement[]>>;
  onStatusUpdates: Dispatch<SetStateAction<StatusUpdate[]>>;
}

const ApproveList: React.FC<ApproveListProps> = (props) => {
  const { isLoading, announcements, setAnnouncements, onStatusUpdates } = props;

  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusChanges, setStatusChanges] = useState<StatusChangeItem[]>([]);

  useEffect(() => {
    const updates = statusChanges.map((change) => ({
      id: change.id,
      status: change.newStatus,
    }));
    onStatusUpdates(updates);
  }, [statusChanges]);

  const handleApprove = () => {
    selectedId.forEach((id) => {
      const announcement = announcements.find((doc) => doc.id === id);
      if (!announcement) return;

      const existingChange = statusChanges.find((change) => change.id === id);
      if (existingChange?.oldStatus === EStatusAnnouncement.Approved) {
        removeStatusChange(id);
        return;
      }

      setStatusChanges((prev) => [
        ...prev,
        {
          id,
          oldStatus: announcement.status,
          newStatus: EStatusAnnouncement.Approved,
        },
      ]);
    });

    setAnnouncements((current) => updateAnnouncementStatus(selectedId, current));
    setSelectedId([]);
  };

  const removeStatusChange = (id: number) => {
    setStatusChanges((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAnnouncementStatus = (
    selectedId: number[],
    current: Announcement[],
  ): Announcement[] => {
    return current.map((doc) =>
      selectedId.includes(doc.id)
        ? { ...doc, status: EStatusAnnouncement.Approved }
        : doc,
    );
  };

  const handleConfirmUnapprove = () => {
    if (!selectedDocId) return;

    setStatusChanges((prev) => {
      const existingChange = prev.find((item) => item.id === selectedDocId);
      if (existingChange) {
        return prev.filter((item) => item.id !== selectedDocId);
      }

      return [
        ...prev,
        {
          id: selectedDocId,
          oldStatus: EStatusAnnouncement.Approved,
          newStatus: EStatusAnnouncement.WaitingApproval,
        },
      ];
    });

    setAnnouncements((current) =>
      current.map((doc) =>
        doc.id === selectedDocId
          ? { ...doc, status: EStatusAnnouncement.WaitingApproval }
          : doc,
      ),
    );
    setSelectedDocId(undefined);
    setIsModalOpen(false);
  };

  const handleUnapprove = (id: number) => {
    setSelectedDocId(id);
    setIsModalOpen(true);
  };

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  return (
    <div>
      <div className="w-full max-w-[988px] h-[314px] mt-20 px-[34px] py-8 bg-white dark:bg-[#414141] rounded-[20px] shadow-md">
        <h2 className="text-[#D83636] text-xl font-semibold mb-5">ยังไม่อนุมัติ</h2>

        <RenderWaitingApproval
          announcements={announcements}
          backendUrl={BACKEND_URL}
          isLoading={isLoading}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      <div className="my-[18px] w-full flex justify-end gap-x-[18px]">
        <button
          className="w-[88px] h-[38px] bg-[#D9A84E] text-white rounded-md disabled:opacity-50"
          onClick={handleApprove}
          disabled={selectedId.length === 0}
        >
          <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
            อนุมัติ
            {selectedId.length > 0 && <span>{` (${selectedId.length})`}</span>}
          </p>
        </button>
      </div>

      <div className="w-full max-w-[988px] h-[314px] px-[34px] py-8 bg-white dark:bg-[#414141] rounded-[20px] shadow-md">
        <h2 className="text-[#D9A84E] text-xl font-semibold mb-5">อนุมัติแล้ว</h2>
        <RenderContentApproved
          isLoading={isLoading}
          announcements={announcements}
          onUnapprove={handleUnapprove}
          backendUrl={BACKEND_URL}
        />
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUnapprove}
      />
    </div>
  );
};

export default ApproveList;
