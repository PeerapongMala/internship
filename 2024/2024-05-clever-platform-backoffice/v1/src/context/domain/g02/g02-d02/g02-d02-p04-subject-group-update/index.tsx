import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import IManageYearHeader from './component/web/template/wc-t-header';
import API from '../local/api';
import StoreGlobalVolatile from '@store/global/volatile';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { ISeedSubjectGroup, ISubjectGroup } from '../local/type';
import showMessage from '@global/utils/showMessage';
import CWSubjectGroupFormLayout from '../local/components/cw-subject-group-form-layout';

const DomainJSX = () => {
  const { t } = useTranslation();
  const { platformId, yearId, subjectGroupId } = useParams({ strict: false });
  const [subjectGroup, setSubjectGroup] = useState<ISubjectGroup>();
  const [fetching, setFetching] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    setFetching(true);
    API.manageYear
      .GetById(yearId)
      .then(async (res) => {
        if (res.status_code === 200) {
          StoreGlobalVolatile.MethodGet().setYearData(res.data);
        } else if (res.status_code === 401) {
          navigator({ to: '/' });
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  useEffect(() => {
    API.subjectGroup.GetById(subjectGroupId).then((res) => {
      if (res.status_code == 200) {
        setSubjectGroup(res.data);
      }
    });
  }, [subjectGroupId]);

  const handleSave = (
    record: Pick<ISubjectGroup, 'seed_subject_group_id' | 'status'>,
  ) => {
    API.subjectGroup
      .Update(subjectGroupId, {
        seed_subject_group_id: record.seed_subject_group_id,
        status: record.status,
        id: +subjectGroupId,
      })
      .then(async (res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ');
          navigator({
            to: '/content-creator/course/platform/$platformId/year/$yearId/subject-group',
          });
        } else if (
          res.message === 'Cannot change status from disabled to draft' ||
          'Cannot change status from enabled to draft'
        ) {
          showMessage('ไม่สามารถตั้งสถานะแบบร่างได้', 'warning');
        } else if (res.status_code === 401) {
          showMessage('กรุณาเข้าสู่ระบบ', 'error');
          navigator({ to: '/' });
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  return fetching ? (
    <div>กำลังโหลด...</div>
  ) : subjectGroup ? (
    <CWSubjectGroupFormLayout onSubmit={handleSave} subjectGroup={subjectGroup} />
  ) : (
    <div>ไม่พบข้อมูล</div>
  );
};

export default DomainJSX;
