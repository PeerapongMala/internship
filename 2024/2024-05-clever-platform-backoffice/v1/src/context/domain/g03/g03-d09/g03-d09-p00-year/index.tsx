import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

import ConfigJson from './config/index.json';
import { useNavigate } from '@tanstack/react-router';
import CWYearRecords, {
  CWYearRecordsProps,
} from '@domain/g03/g03-d08/local/component/web/cw-year-records';
import { SchoolHeader, SubjectShop } from '@domain/g03/g03-d09/local/api/type';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [school, setSchool] = useState<SchoolHeader>();

  useEffect(() => {
    API.other.GetSchool().then((res) => {
      if (res.status_code == 200) {
        setSchool(res.data);
      }
    });
  }, []);

  function onEdit(record: SubjectShop) {
    navigate({ to: `./${record.subject_id}/coupon` });
  }

  const fetchRecords: CWYearRecordsProps['onDataLoad'] = ({
    limit,
    page,
    setFetching,
    setRecords,
    setTotalRecords,
  }) => {
    setFetching(true);
    API.subject
      .Get({
        limit,
        page,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return (
    <CWYearRecords
      title="ร้านค้าครู"
      translationKey={ConfigJson.key}
      school={school}
      breadcrumbs={[
        {
          href: '#',
          label: 'ระบบเกม',
        },
        {
          href: '#',
          label: 'จัดการไอเทม',
        },
      ]}
      onDataLoad={fetchRecords}
      onEdit={onEdit}
    />
  );
};

export default DomainJSX;
