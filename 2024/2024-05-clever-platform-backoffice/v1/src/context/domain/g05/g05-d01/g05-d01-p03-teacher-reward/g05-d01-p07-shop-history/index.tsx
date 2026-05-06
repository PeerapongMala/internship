import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import {
  NewStoreItem,
  StoreItem,
  StoreTransaction,
  SubjectShop,
} from '../local/api/types/shop';
import { useNavigate, useParams } from '@tanstack/react-router';

import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import CWShopHistory, {
  CWShopHistoryProps,
} from '../local/components/web/template/cw-shop-history';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { itemType, storeItemId }: { itemType: ItemType; storeItemId: string } =
    useParams({
      strict: false,
    });

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };
  const schoolId = userData?.school_id ?? targetData?.school_id;
  const subjectId =
    Array.isArray(targetData?.subject) && targetData.subject.length > 0
      ? targetData.subject[0].id
      : Array.isArray(userData?.subject) && userData.subject.length > 0
        ? userData.subject[0].id
        : undefined;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      if (
        isMobile &&
        window.location.pathname !== '/teacher/reward/store/coupon/$storeItemId/history'
      ) {
        navigate({ to: '/teacher/reward/store/coupon/$storeItemId/history' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [storeItem, setStoreItem] = useState<NewStoreItem>();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!subjectId) return;
    if (storeItemId) {
      API.store.GetById(+subjectId, +storeItemId).then((res) => {
        if (res.status_code == 200) {
          setStoreItem(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [storeItemId]);

  function onReclaim(record: StoreTransaction) {
    API.transaction.UpdateStatus(record.id, 'recalled').then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('บันทึกสำเร็จ', 'success');
        setReload((prev) => !prev);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  const fetchRecords: CWShopHistoryProps['onDataLoad'] = ({
    limit,
    page,
    searchText,
    setFetching,
    setRecords,
    setTotalRecords,
  }) => {
    setFetching(true);
    API.transaction
      .Get(+storeItemId, {
        limit,
        page,
        search_text: searchText || undefined,
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

  async function onBulkEdit(
    status: StoreTransaction['status'],
    records: StoreTransaction[],
  ) {
    return new Promise((resolve) => {
      API.transaction
        .BulkEdit(
          records.map((record) => ({
            id: record.id,
            status,
          })),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            if (res.status_code == 200 || res.status_code == 201) {
              showMessage('บันทึกสำเร็จ', 'success');
              setReload((prev) => !prev);
              resolve(true);
            } else {
              showMessage(res.message, 'error');
              resolve(false);
            }
          }
        });
    });
  }

  const [subject, setSubject] = useState<SubjectShop>();
  useEffect(() => {
    if (!subjectId) return;
    API.subject.GetById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        setSubject(res.data);
      } else {
        navigate({ to: '/teacher/shop' });
      }
    });
  }, []);

  return (
    <CWShopHistory
      translationKey={ConfigJson.key}
      reload={reload}
      breadcrumbs={[
        {
          label: 'การเรียนการสอน',
          href: '#',
        },
        {
          label: 'จัดการรางวัล',
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
        {
          label: storeItem?.id.toString() ?? storeItemId,
          href: '#',
        },
        {
          label: 'ประวัติการซื้อ',
          href: '#',
        },
      ]}
      itemType={itemType}
      onBulkEdit={onBulkEdit}
      onDataLoad={fetchRecords}
      onReclaim={onReclaim}
      item={storeItem}
    />
  );
};

export default DomainJSX;
