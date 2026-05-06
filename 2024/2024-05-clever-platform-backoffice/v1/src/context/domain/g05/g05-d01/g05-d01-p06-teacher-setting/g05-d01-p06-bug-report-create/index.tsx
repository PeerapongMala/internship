import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { useNavigate, useParams } from '@tanstack/react-router';
import TitleGroup from '../local/components/web/organism/cw-o-title-group';
import DetailProblem from '../local/components/web/organism/cw-o-detail-problem';

import SavePanel from '../local/components/web/organism/cw-o-save-panel';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import UploadPicture from '../local/components/web/organism/cw-o-upload-picture';
import { useEffect, useState } from 'react';
import { TBugReport } from '../local/types/bug-report';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobal from '@store/global';
const DomainJsx = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate({ to: '../' });
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);

      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  const [formData, setFormData] = useState<Partial<TBugReport>>({});

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleCreateBugReport = async () => {
    try {
      if (!formData.created_at) {
        showMessage('กรุณาระบุ วันที่แจ้ง', 'warning');
        return;
      }
      if (!formData.os) {
        showMessage('กรุณาระบุ ระบบปฏิบัติการ', 'warning');
        return;
      }
      if (!formData.browser) {
        showMessage('กรุณาระบุ เบราว์เซอร์', 'warning');
        return;
      }
      if (!formData.type) {
        showMessage('กรุณาเลือก ประเภทปัญหา', 'warning');
        return;
      }
      if (!formData.platform) {
        showMessage('กรุณาเลือก ประเภทบริการ', 'warning');
        return;
      }
      if (!formData.version) {
        showMessage('กรุณาเลือก เวอร์ชั่น', 'warning');
        return;
      }
      if (!formData.priority) {
        showMessage('กรุณาเลือก ระดับความสำคัญ', 'warning');
        return;
      }
      if (!formData.description) {
        showMessage('กรุณาระบุ คำอธิบายปัญหา', 'warning');
        return;
      }
      const formDataToSend = new FormData();

      formDataToSend.append('created_at', formData.created_at || '');
      formDataToSend.append('os', formData.os || '');
      formDataToSend.append('browser', formData.browser || '');
      formDataToSend.append('type', formData.type || '');
      formDataToSend.append('platform', formData.platform || '');
      formDataToSend.append('version', formData.version || '');
      formDataToSend.append('priority', formData.priority || '');
      formDataToSend.append('url', formData.url || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('status', 'pending');

      uploadedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const res = await API.BugReport.Create(formDataToSend);

      if (res.status_code === 200) {
        showMessage('เพิ่มข้อมูลสำเร็จ', 'success');
        navigate({ to: '../' });
      } else {
        showMessage(`${res.message} เกิดข้อผิดพลาด`, 'error');
      }
    } catch (error: any) {
      console.error('Fetch error', error);
      showMessage(error.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล', 'error');
    }
  };

  const handleChange = (field: keyof TBugReport, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  return (
    <ScreenTemplate
      className="mb-24 items-center"
      headerTitle="ปัญหาการใช้งาน"
      header={false}
      bg_white={isMobile}
      footer={isMobile}
    >
      <div className={`mb-5 mt-5 w-full`}>
        <div className="relative flex items-center justify-center md:mt-0 md:justify-start">
          <button onClick={goBack}>
            <IconArrowBackward className="absolute left-3 top-2" />
          </button>
          <p className="text-2xl font-bold md:ml-10">แจ้งปัญหาการใช้งาน</p>
        </div>
        <div className="mt-5 flex w-full flex-col gap-0 sm:flex-row md:gap-10">
          <div
            className={`w-full rounded-md md:w-[70%] md:p-5 ${isMobile ? '' : 'bg-white'}`}
          >
            <DetailProblem data={formData} mode="create" onChange={handleChange} />
            <UploadPicture
              allowUpload={true}
              onFilesChange={handleFilesChange}
              maxFiles={5}
            />
          </div>
          <div className="w-full md:w-[30%]">
            <SavePanel mode={'create'} onSave={handleCreateBugReport} />
          </div>
        </div>

        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
