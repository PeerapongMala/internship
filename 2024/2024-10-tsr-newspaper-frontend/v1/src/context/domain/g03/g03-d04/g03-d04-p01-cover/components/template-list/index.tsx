import { SetStateAction, useState, useCallback } from 'react';
import { navCover } from '../cover'; 
import { CoverNewspaper } from '@domain/g03/g03-d04/local/api/restapi/cover-newspaper';
import LoadingSpinner from '@component/web/atom/wc-loading-spinner';
import { formatToThaiDate } from '../../utils/dateFormat'; 
import PreviewPdf from '@component/web/organism/wc-o-preview-pdf';

interface TempleListingProps {
  setCurrentPage: (value: SetStateAction<navCover>) => void;
  coverList: CoverNewspaper[];
  isLoading: boolean;
  isDateRangeSelected: Date | null;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

const TempleListing: React.FC<TempleListingProps> = (props) => {
  const { coverList, isDateRangeSelected, isLoading, setCurrentPage } = props;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPdfData, setSelectedPdfData] = useState<{ src: string }[] | null>(null);

  const handleOpenModal = useCallback(
    (pdfUrls: string[]) => {
      const formattedData = pdfUrls.map((url) => ({ src: `${BACKEND_URL}/${url}` }));
      setSelectedPdfData(formattedData);
      setShowModal(true);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setSelectedPdfData(null);
    setShowModal(false);
  }, []);

  const handleCreateClick = () => {
    setCurrentPage(navCover.ADD);
  };

  const renderContent = () => {
    if (!isDateRangeSelected) {
      return (
        <div className="flex justify-center items-center h-40 text-gray-500 dark:text-[#D7D7D7]">
          กรุณาเลือกช่วงวันที่เพื่อดูรายการ
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      );
    }

    if (coverList.length === 0) {
      return (
        <div className="flex justify-center items-center h-40 text-gray-500 dark:text-[#D7D7D7]">
          ไม่พบรายการในช่วงวันที่ที่เลือก
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[109px] mt-[20px] mb-[51px]">
        {coverList.map((temple) => (
          <div key={temple.ID} className="flex flex-col items-center">
            <div
              className="w-full max-w-[232px] aspect-[3/4] bg-gray-100 rounded-lg cursor-pointer"
              onClick={() =>
                handleOpenModal(
                  temple.PreviewURL ? [temple.PreviewURL] : [] // Assuming PreviewURL is the PDF URL
                )
              }
            >
              <img
                src={`${BACKEND_URL}/${temple.PreviewURL}`}
                className="w-full h-full object-cover rounded-lg"
                alt={`ปกหนังสือพิมพ์วันที่ ${temple.PublicDate}`}
              />
            </div>
            <span className="mt-3 text-sm font-medium dark:text-[#D7D7D7]">
              {formatToThaiDate(temple.PublicDate)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>{renderContent()}</div>
      <button
        className="w-full sm:w-[215px] h-[38px] bg-[#D9A84E] rounded-md text-sm font-bold text-white hover:bg-[#c69746] transition-colors"
        onClick={handleCreateClick}
      >
        สร้างปกหนังสือพิมพ์
      </button>

      {/* Modal for PDF Preview */}
      {showModal && selectedPdfData && (
        <PreviewPdf data={selectedPdfData} handleOpenModal={handleCloseModal} />
      )}
    </div>
  );
};

export default TempleListing;
