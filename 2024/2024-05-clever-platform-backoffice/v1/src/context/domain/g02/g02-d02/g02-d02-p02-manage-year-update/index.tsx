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
  const { platformId, yearId } = useParams({ strict: false });
  const pathname = `/content-creator/course/platform/${platformId}/year`;

  const [year, setYear] = useState<IManageYear>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  function onSubmit(record: Pick<IManageYear, 'seed_year_id' | 'status'>) {
    API.manageYear
      .Update(yearId, {
        seed_year_id: record.seed_year_id,
        status: record.status,
      })
      .then((res) => {
        if (res.status_code === 200 || res.status_code == 201) {
          showMessage('บันทึกสําเร็จ');
          navigate({ to: '../' });
          fetchRecord();
        } else if (
          res.message === 'Cannot change status from disabled to draft' ||
          'Cannot change status from enabled to draft'
        ) {
          showMessage('ไม่สามารถตั้งสถานะแบบร่างได้', 'warning');
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function fetchRecord() {
    setFetching(true);
    API.manageYear
      .GetById(yearId)
      .then((res) => {
        if (res.status_code == 200) {
          setYear(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }

  useEffect(() => {
    fetchRecord();
  }, [yearId]);

  return (
    <>
      {fetching ? (
        <div>กำลังโหลด</div>
      ) : year ? (
        <CWYearFormLayout year={year} onSubmit={onSubmit} />
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </>
  );
};

export default DomainJSX;
