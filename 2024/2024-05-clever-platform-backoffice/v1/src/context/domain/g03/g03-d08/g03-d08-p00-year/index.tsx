import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

import ConfigJson from './config/index.json';
import { useNavigate } from '@tanstack/react-router';
import CWYearRecords, {
  CWYearRecordsProps,
} from '../local/component/web/cw-year-records';
import { School } from '@domain/g01/g01-d05/local/api/type';
import { SchoolHeader, Subject } from '../local/api/type';
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

  function onEdit(record: Subject) {
    navigate({ to: `./${record?.id}/coupon` });
  }

  const fetchRecords: CWYearRecordsProps['onDataLoad'] = ({
    limit,
    page,
    setFetching,
    setRecords,
    setTotalRecords,
  }) => {
    setFetching(true);
    API.item
      .GetGroup({
        page,
        limit,
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
