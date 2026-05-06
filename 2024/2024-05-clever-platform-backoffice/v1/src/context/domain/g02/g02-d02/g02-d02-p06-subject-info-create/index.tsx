import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { IPlatform, ISubject } from '../local/type';
import ConfigJson from './config/index.json';
import API from '../local/api';
import StoreGlobalVolatile from '@store/global/volatile';
import showMessage from '@global/utils/showMessage';
import CWSubjectFormLayout from '../local/components/cw-subject-from-layout';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigator = useNavigate();

  const { platformId, yearId, subjectGroupId } = useParams({ strict: false });
  const [platform, setPlatform] = useState<IPlatform>();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);

    API.manageYear.GetById(yearId).then(async (res) => {
      if (res.status_code === 200) {
        StoreGlobalVolatile.MethodGet().setYearData(res.data);
      }
    });

    API.platform.GetById(platformId).then(async (res) => {
      if (res.status_code === 200) {
        setPlatform(res.data);
      }
    });
  }, []);

  function onSubmit(data: Partial<ISubject>) {
    API.subject
      .Create({
        ...data,
        subject_group_id: subjectGroupId,
        project: platform?.seed_platform_name ?? '',
      })
      .then((res) => {
        if (res.status_code === 201) {
          showMessage('บันทึกสําเร็จ');
          navigator({
            to: `/content-creator/course/platform/$platformId/year/$yearId/subject-group/$subjectGroupId/subject-info`,
          });
        } else if (res.status_code == 409) {
          showMessage('ไม่สามารถสร้างได้ ชื่อวิชาซ้ำ', 'warning');
        } else if (res.status_code === 401) {
          navigator({ to: '/' });
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  return <CWSubjectFormLayout onSubmit={onSubmit} />;
};

export default DomainJSX;
