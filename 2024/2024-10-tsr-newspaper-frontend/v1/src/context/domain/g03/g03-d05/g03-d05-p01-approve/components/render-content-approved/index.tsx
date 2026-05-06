import { Announcement, EStatusAnnouncement } from '../../../local/api/restapi/annoucement';
import LoadingSpinner from '@component/web/atom/wc-loading-spinner';
import PreviewPdf from '@component/web/organism/wc-o-preview-pdf';
import { useState, useCallback } from 'react';

interface RenderContentApprovedProps {
  isLoading: boolean;
  announcements: Announcement[];
  onUnapprove: (id: number) => void;
  backendUrl: string;
}

const RenderContentApproved = ({
  isLoading,
  announcements,
  onUnapprove,
  backendUrl,
}: RenderContentApprovedProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPdfData, setSelectedPdfData] = useState<{ src: string }[] | null>(null);

  const handleOpenModal = useCallback(
    (imageUrls: string[]) => {
      const formattedData = imageUrls.map((url) => ({ src: `${backendUrl}/${url}` }));
      setSelectedPdfData(formattedData);
      setShowModal(true);
    },
    [backendUrl]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedPdfData(null);
    setShowModal(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[177px]">
        <LoadingSpinner />
      </div>
    );
  }

  const approvedAnnouncements = announcements.filter(
    (doc) => doc.status === EStatusAnnouncement.Approved
  );

  if (approvedAnnouncements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[177px]">
        <span className="text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-scroll mb-4">
      <div className="flex w-[920px] pb-4 gap-x-4">
        {approvedAnnouncements.map((doc) => (
          <div key={doc.id} className="flex-shrink-0 relative w-[140px] h-[177px]">
            <button
              className="w-5 h-5 flex items-center absolute right-1 top-1 shadow-lg justify-center rounded-sm bg-white"
              onClick={() => onUnapprove(doc.id)}
            >
              ✕
            </button>
            <img
              src={`${backendUrl}/${doc.image_url_list[0]}`}
              alt={doc.title}
              className="w-full h-full cursor-pointer"
              onClick={() => handleOpenModal(doc.image_url_list)} // Open modal on click
            />
          </div>
        ))}
      </div>

      {/* Modal for PDF Preview */}
      {showModal && selectedPdfData && (
        <PreviewPdf data={selectedPdfData} handleOpenModal={handleCloseModal} />
      )}
    </div>
  );
};

export default RenderContentApproved;
