import { Announcement, EStatusAnnouncement } from '../../../local/api/restapi/annoucement';
import LoadingSpinner from '@component/web/atom/wc-loading-spinner';
import PreviewPdf from '@component/web/organism/wc-o-preview-pdf';
import { useCallback, useState } from 'react';

interface RenderWaitingApprovalProps {
  isLoading: boolean;
  announcements: Announcement[];
  selectedId: number[];
  setSelectedId: (ids: number[]) => void;
  backendUrl: string;
}

const RenderWaitingApproval: React.FC<RenderWaitingApprovalProps> = ({
  isLoading,
  announcements,
  selectedId,
  setSelectedId,
  backendUrl,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPdfData, setSelectedPdfData] = useState<{ src: string }[] | null>(null);

  const handleOpenModal = useCallback((pdfUrls: string[]) => {
    const formattedData = pdfUrls.map((url) => ({ src: `${backendUrl}/${url}` }));
    setSelectedPdfData(formattedData);
    setShowModal(true);
  }, [backendUrl]);

  const handleCloseModal = useCallback(() => {
    setSelectedPdfData(null);
    setShowModal(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <LoadingSpinner />
      </div>
    );
  }

  const waitingApprovalAnnouncements = announcements.filter(
    (doc) => doc.status === EStatusAnnouncement.WaitingApproval
  );

  if (waitingApprovalAnnouncements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[177px]">
        <span className="text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</span>
      </div>
    );
  }

  const handleCheckbox = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedId([...selectedId, id]);
    } else {
      setSelectedId(selectedId.filter((currId) => currId !== id));
    }
  };

  return (
    <div className="relative overflow-x-scroll mb-4">
      <div className="flex w-[920px] pb-4 gap-x-4">
        {waitingApprovalAnnouncements.map((doc) => (
          <div key={doc.id} className="flex-shrink-0 relative w-[140px] h-[177px]">
            <input
              type="checkbox"
              className="w-5 h-5 absolute top-2 left-2"
              onChange={(e) => handleCheckbox(doc.id, e.target.checked)}
            />
            <img
              src={`${backendUrl}/${doc.image_url_list[0]}`}
              className="w-full h-full cursor-pointer"
              alt={doc.title}
              onClick={() => handleOpenModal(doc.image_url_list)} // Pass the array of URLs
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

export default RenderWaitingApproval;
