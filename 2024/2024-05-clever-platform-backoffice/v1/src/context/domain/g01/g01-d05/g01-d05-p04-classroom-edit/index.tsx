import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import API from '../local/api';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWTClassroomForm from '../local/component/web/template/cw-t-classroom-form';
import { Classroom } from '../local/api/type';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { schoolId, classroomId } = useParams({ strict: false });
  const navigate = useNavigate();
  const prevPath = `/admin/school/${schoolId}?tab=classroom-management`;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  function onSubmit(formData: Record<string, any>) {
    const data = {
      academic_year: +formData.academic_year,
      year: formData.year,
      name: formData.name,
      status: formData.status,
    };
    API.classroom.Update(classroomId, data).then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('บันทึกห้องเรียนสำเร็จ', 'success');
        navigate({ to: prevPath });
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  const [classroom, setClassroom] = useState<Classroom | undefined>();

  useEffect(() => {
    API.classroom.GetById(classroomId).then((res) => {
      if (res.status_code == 200) {
        setClassroom(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [classroomId]);

  return (
    <>
      {classroom && (
        <CWTClassroomForm
          backTo={prevPath}
          onSubmit={onSubmit}
          schoolId={schoolId}
          classroom={classroom}
        />
      )}
    </>
  );
};

export default DomainJSX;
