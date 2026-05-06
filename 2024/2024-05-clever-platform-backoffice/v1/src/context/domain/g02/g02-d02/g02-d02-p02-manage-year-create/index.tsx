import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { IManageYear } from '../local/type';
import API from '../local/api';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import showMessage from '@global/utils/showMessage';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWYearFormLayout from '../local/components/cw-year-form-layout';

const DomainJSX = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { platformId } = useParams({ strict: false });
  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );
  const pathname = `/content-creator/course/platform/${platformId}/year`;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  function onSubmit(record: Pick<IManageYear, 'seed_year_id' | 'status'>) {
    API.manageYear
      .Create({
        curriculum_group_id: curriculumData.id,
        platform_id: +platformId,
        seed_year_id: record.seed_year_id,
        status: record.status,
      })
      .then((res) => {
        if (res.status_code === 201) {
          showMessage('บันทึกสําเร็จ');
          navigate({
            to: pathname,
          });
        } else if (res.status_code == 409) {
          showMessage('ไม่สามารถสร้างได้ มีการสร้างชั้นปีนี้อยู่แล้ว', 'warning');
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  return <CWYearFormLayout onSubmit={onSubmit} />;
};

export default DomainJSX;
