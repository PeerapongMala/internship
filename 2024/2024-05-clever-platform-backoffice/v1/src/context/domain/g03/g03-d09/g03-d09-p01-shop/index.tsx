import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { StoreItem, SubjectShop } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWShopRecords, {
  CWShopRecordsProps,
} from '@domain/g04/g04-d03/local/component/web/cw-shop-records';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { itemType, subjectId }: { itemType: 'coupon'; subjectId: string } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);

  const schoolId = userData?.school_id ?? targetData?.school_id;
  if (itemType != 'coupon') {
    navigate({ to: `/teacher/shop/${subjectId}/coupon` });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [reload, setReload] = useState(false);
  const [subject, setSubject] = useState<SubjectShop>();

  function triggerReload() {
    setReload((prev) => !prev);
  }

  function onArchive(record: StoreItem) {
    const status: StoreItem['status'] =
      record.status == 'expired' ? 'enabled' : 'expired';
    API.store.UpdateStatus(record.id, status).then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('บันทึกสำเร็จ', 'success');
        triggerReload();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function onBulkEdit(status: 'expired' | 'enabled', records: StoreItem[]) {
    return new Promise<boolean>((resolve) => {
      API.store
        .BulkEdit(
          records.map((record) => ({
            id: record.id,
            status,
          })),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('บันทึกสำเร็จ', 'success');
            triggerReload();
            resolve(true);
          } else {
            showMessage(res.message, 'error');
            resolve(false);
          }
        });
    });
  }

  const fetchRecords: CWShopRecordsProps<StoreItem>['onDataLoad'] = function ({
    setFetching,
    limit,
    page,
    setRecords,
    setTotalRecords,
    searchText,
    status,
  }) {
    setFetching(true);
    API.store
      .Get(+subjectId, {
        type: itemType,
        page,
        limit,
        search_text: searchText || undefined,
        status: status || undefined,
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

  useEffect(() => {
    API.subject.GetById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        setSubject(res.data);
      } else {
        navigate({ to: '/teacher/shop' });
      }
    });
  }, []);

  return (
    <CWShopRecords
      itemHref={`/teacher/item/${subjectId}/${itemType}`}
      translationKey={ConfigJson.key}
      reload={reload}
      breadcrumbs={[
        {
          label: 'ระบบเกม',
          href: '#',
        },
        {
          label: 'จัดการร้านค้า',
          href: '#',
        },
        {
          label: subject?.short_year.toString() ?? '',
          href: '#',
        },
        {
          label: subject?.subject_name ?? '',
          href: '#',
        },
      ]}
      type={itemType}
      onDataLoad={fetchRecords}
      onArchive={onArchive}
      onBulkEditEnable={function (records: StoreItem[]) {
        return onBulkEdit('enabled', records);
      }}
      onBulkEditDisable={function (records: StoreItem[]) {
        return onBulkEdit('expired', records);
      }}
      userType="teacher"
    />
  );
};

export default DomainJSX;
