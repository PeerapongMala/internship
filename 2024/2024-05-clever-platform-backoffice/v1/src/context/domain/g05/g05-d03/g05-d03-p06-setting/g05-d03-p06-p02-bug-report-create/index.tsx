import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { useNavigate, useParams } from '@tanstack/react-router';
import TitleGroup from '../local/components/web/organism/cw-o-title-group';
import DetailProblem from '../local/components/web/organism/cw-o-detail-problem';

import SavePanel from '../local/components/web/organism/cw-o-save-panel';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import UploadPicture from '../local/components/web/organism/cw-o-upload-picture';
import { useState } from 'react';

import API from '../../local/api';
import showMessage from '@global/utils/showMessage';
import { TBugReport } from '../../local/types/bug-report';
const DomainJsx = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate({ to: '../' });
  };
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
      className="mb-24 mt-5 items-center"
      headerTitle="ปัญหาการใช้งาน"
      header={false}
    >
      <div className="mb-5 w-full px-5">
        <div className="relative mb-5 flex items-center justify-center">
          <button onClick={goBack}>
            <IconArrowBackward className="absolute left-3 top-2" />
          </button>
          <p className="text-2xl font-bold">แจ้งปัญหาการใช้งาน</p>
        </div>

        <DetailProblem data={formData} mode="create" onChange={handleChange} />
        <UploadPicture
          allowUpload={true}
          onFilesChange={handleFilesChange}
          maxFiles={5}
        />
        <SavePanel mode={'create'} onSave={handleCreateBugReport} />
        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
