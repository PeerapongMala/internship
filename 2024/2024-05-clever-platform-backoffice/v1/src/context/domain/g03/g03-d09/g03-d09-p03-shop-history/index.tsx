import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { StoreItem, StoreTransaction, SubjectShop } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWShopHistory, {
  CWShopHistoryProps,
} from '@domain/g04/g04-d03/local/component/web/cw-shop-history';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const {
    itemType,
    storeItemId,
    subjectId,
  }: { itemType: ItemType; storeItemId: string; subjectId: string } = useParams({
    strict: false,
  });

  if (itemType != 'frame' && itemType != 'badge' && itemType != 'coupon') {
    navigate({ to: '/teacher/shop/$yearId/$itemType/$storeItemId/history' });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [storeItem, setStoreItem] = useState<StoreItem>();
  const [reload, setReload] = useState(false);

  useEffect(() => {
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
