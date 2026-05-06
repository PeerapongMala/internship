import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import API from '../local/api';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWTClassroomForm from '../local/component/web/template/cw-t-classroom-form';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { schoolId } = useParams({ strict: false });
  const navigate = useNavigate();
  const prevPath = `/admin/school/${schoolId}?tab=classroom-management`;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  function onSubmit(formData: Record<string, any>) {
    const data = {
      school_id: Number(formData.school_id),
      academic_year: +formData.academic_year,
      year: formData.year,
      name: formData.name,
      status: formData.status,
    };
    API.classroom.Create(data).then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('สร้างห้องเรียนสำเร็จ', 'success');
        navigate({ to: prevPath });
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  return <CWTClassroomForm backTo={prevPath} onSubmit={onSubmit} schoolId={schoolId} />;
};

export default DomainJSX;
