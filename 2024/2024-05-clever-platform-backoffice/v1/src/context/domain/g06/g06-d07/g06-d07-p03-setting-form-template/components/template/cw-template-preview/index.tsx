import { TDocumentTemplate } from '@domain/g06/g06-d07/local/types/template';
import CWTemplate1 from '../../organism/cw-template-1';
import CWTemplate2 from '../../organism/cw-template-2';
import CWTemplate3 from '../../organism/cw-template-3';

type TemplatePreviewProps = {
    templateData: TDocumentTemplate;
};

const CWTemplatePreview = ({ templateData }: TemplatePreviewProps) => {
    const renderTemplateContent = () => {
        switch (templateData.format_id) {
            case '1':
                return <CWTemplate1 templateData={templateData} />;
            case '2':
                return <CWTemplate2 templateData={templateData} />;
            case '3':
                return <CWTemplate3 templateData={templateData} />;
            default:
                return <div>ไม่พบรูปแบบ Template</div>;
        }
    };

    return (
        <div className="sticky top-[70px]">
            <div className="bg-white p-5 shadow-md border">
                <h3 className="text-lg font-bold mb-4">ตัวอย่าง Template</h3>
                {/* <div className="mt-4 space-y-2">
                    <p><span className="font-medium">รูปแบบ:</span> Template {templateData.format_id}</p>
                    <p><span className="font-medium">ชื่อ Template:</span> {templateData.name || '-'}</p>
                    <div className="flex flex-col  gap-2">
                        <div className='flex items-center gap-2'>
                            <span className="font-medium">สีเอกสาร:</span>
                            <div
                                className="w-4 h-4 rounded-full inline-block"
                                style={{ backgroundColor: templateData.colour_setting?.position1 || '' }}
                            />
                            <p>{templateData.colour_setting?.position1}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="font-medium">สีพื้นหลังท้ายเอกสาร:</span>
                            <div
                                className="w-4 h-4 rounded-full inline-block"
                                style={{ backgroundColor: templateData.colour_setting?.position2 || '' }}
                            />
                            <p>{templateData.colour_setting?.position2}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="font-medium">สีพื้นหลังหัวข้อเอกสาร:</span>
                            <div
                                className="w-4 h-4 rounded-full inline-block"
                                style={{ backgroundColor: templateData.colour_setting?.position3 || '' }}
                            />
                            <p>{templateData.colour_setting?.position3}</p>
                        </div>
                    </div>
                </div> */}
                <div
                    className="w-full border relative overflow-hidden mb-4 mt-5"
                    style={{
                        backgroundColor: templateData.colour_setting?.position1 || '#ffffff',
                        minHeight: '400px',
                    }}
                >
                    <div className="p-2">
                        {renderTemplateContent()}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CWTemplatePreview;