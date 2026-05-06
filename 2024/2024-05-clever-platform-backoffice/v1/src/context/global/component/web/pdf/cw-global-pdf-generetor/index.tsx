import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import IconEye from '@core/design-system/library/component/icon/IconEye';

interface GlobalPdfGeneratorProps<T> {
  document: React.ReactElement;
  fileName: string;
  downloadButtonText?: string;
  previewButtonText?: string;
  hidePreviewButton?: boolean;
}

export const CWGlobalPdfGenerator = <T,>({
  document,
  fileName,
  downloadButtonText = 'PDF',
  previewButtonText = 'ดูตัวอย่าง',
  hidePreviewButton = false,
}: GlobalPdfGeneratorProps<T>) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex gap-2">
      <PDFDownloadLink document={document} fileName={fileName}>
        {({ loading }) => (
          <CWButton
            icon={<IconDownload />}
            title={loading ? 'กำลังสร้าง...' : downloadButtonText}
            disabled={loading}
          />
        )}
      </PDFDownloadLink>

      {hidePreviewButton && (
        <>
          <CWButton
            icon={<IconEye />}
            title={showPreview ? 'ซ่อนตัวอย่าง' : previewButtonText}
            onClick={() => setShowPreview(!showPreview)}
          />

          {showPreview && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => setShowPreview(false)}
            >
              <div
                style={{
                  width: '60%',
                  height: '90%',
                  backgroundColor: 'white',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <PDFViewer width="100%" height="100%">
                  {document}
                </PDFViewer>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: '-30%',
                    padding: '5px 10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <IconX />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
