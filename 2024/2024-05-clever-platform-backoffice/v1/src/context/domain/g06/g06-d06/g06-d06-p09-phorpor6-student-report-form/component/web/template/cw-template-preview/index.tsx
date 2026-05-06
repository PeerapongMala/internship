import { TDocumentTemplate } from '@domain/g06/g06-d07/local/types/template';
import CWTemplate1 from '../../organism/cw-template-1';
import CWTemplate2 from '../../organism/cw-template-2';
import CWTemplate3 from '../../organism/cw-template-3';
import { TTemplateProps } from '@domain/g06/g06-d06/local/types/student-report-form';

import { CWGlobalPdfGenerator } from '@component/web/pdf/cw-global-pdf-generetor';
import CWTemplate1PDF from '@component/web/pdf/cw-template-pdf/cw-template-1-PDF';
import CWTemplate2PDF from '@component/web/pdf/cw-template-pdf/cw-template-2-PDF';
import CWTemplate3PDF from '@component/web/pdf/cw-template-pdf/cw-template-3-PDF';


const CWTemplatePreview = (props: TTemplateProps) => {
    const { templateData } = props;

    const renderTemplateContent = () => {
        switch (templateData?.format_id) {
            case '1':
                return <CWTemplate1 {...props} />;
            case '2':
                return <CWTemplate2 {...props} />;
            case '3':
                return <CWTemplate3 {...props} />;
            default:
                return <div>ไม่พบรูปแบบ Template</div>;
        }
    };

    const renderPDFDocument = () => {
        switch (templateData?.format_id) {
            case '1':
                return <CWTemplate1PDF {...props} />;
            case '2':
                return <CWTemplate2PDF {...props} />;
            case '3':
                return <CWTemplate3PDF {...props} />;
            default:
                return <div>ไม่พบรูปแบบ Template</div>;
        }
    };

    return (
        <div className="w-full ">
            <div className="w-[60%] flex flex-col gap-5 !p-0">
                <div className="flex items-center mb-4">
                    <CWGlobalPdfGenerator
                        document={renderPDFDocument()}
                        fileName={`${props.studentData?.fullname || 'student'}-แบบรายงานประจำตัวนักเรียน.pdf`}
                        downloadButtonText="PDF"
                        previewButtonText="ดูตัวอย่าง"
                        hidePreviewButton={true}
                    />
                </div>
                {renderTemplateContent()}
            </div>

        </div>
    );
};

export default CWTemplatePreview;