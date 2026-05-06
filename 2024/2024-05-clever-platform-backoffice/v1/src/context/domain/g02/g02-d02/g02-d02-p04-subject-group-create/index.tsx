import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import API from '../local/api';
import StoreGlobalVolatile from '@store/global/volatile';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ISeedSubjectGroup, ISubjectGroup, ITagGroup } from '../local/type';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWSubjectGroupFormLayout from '../local/components/cw-subject-group-form-layout';

const DomainJSX = () => {
  const { t } = useTranslation();
  const { yearId } = useParams({ strict: false });

  const navigator = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    API.manageYear.GetById(yearId).then(async (res) => {
      if (res.status_code === 200) {
        StoreGlobalVolatile.MethodGet().setYearData(res.data);
      } else if (res.status_code === 401) {
        navigator({ to: '/' });
      }
    });
  }, []);

  const handleSave = (
    record: Pick<ISubjectGroup, 'seed_subject_group_id' | 'status'>,
  ) => {
    API.subjectGroup
      .Create({
        seed_subject_group_id: record.seed_subject_group_id,
        status: record.status,
        year_id: Number(yearId),
      })
      .then(async (res) => {
        if (res.status_code === 201) {
          navigator({
            to: '/content-creator/course/platform/$platformId/year/$yearId/subject-group',
          });
        } else if (res.status_code == 409) {
          showMessage('ไม่สามารถสร้างได้ มีการสร้างกลุ่มวิชานี้อยู่แล้ว', 'warning');
        } else if (res.status_code === 401) {
          showMessage('กรุณาเข้าสู่ระบบ', 'error');
          navigator({ to: '/' });
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  return <CWSubjectGroupFormLayout onSubmit={handleSave} />;
};

export default DomainJSX;
