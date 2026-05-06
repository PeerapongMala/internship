import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { StoreItem, StoreTransaction, StoreTransactionStatus } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWShopHistory, {
  CWShopHistoryProps,
} from '../local/component/web/cw-shop-history';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { itemType, storeItemId }: { itemType: ItemType; storeItemId: string } =
    useParams({
      strict: false,
    });

  if (itemType != 'frame' && itemType != 'badge' && itemType != 'coupon') {
    navigate({ to: '/gamemaster/shop/$itemType/$storeItemId/history' });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [storeItem, setStoreItem] = useState<StoreItem>();
  const [reload, setReload] = useState(false);

  function onReclaim(record: any) {
    API.transaction.UpdateStatus(record.id, 'recalled').then((res) => {
      if (res.status_code == 200) {
        showMessage('เรียกคืนสำเร็จ', 'success');
        setReload((prev) => !prev);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  useEffect(() => {
    API.store.GetById(+storeItemId).then((res) => {
      if (res.status_code == 200) {
        setStoreItem(res.data);
      }
    });
  }, []);

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
        page,
        limit,
        search_text: searchText,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  };

  function onBulkEdit(
    status: StoreTransactionStatus,
    records: StoreTransaction[],
  ): Promise<any> {
    return new Promise<boolean>((resolve) => {
      API.transaction
        .BulkEdit(
          records
            .filter((record) => record.status == 'enabled')
            .map((record) => ({
              id: record.id,
              status,
            })),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('เรียกคืนสำเร็จ', 'success');
            setReload((prev) => !prev);
            resolve(true);
          } else {
            showMessage(res.message, 'error');
            resolve(false);
          }
        });
    });
  }

  return (
    <CWShopHistory
      translationKey={ConfigJson.key}
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
          label: 'ประวัติการซื้อ',
          href: '#',
        },
      ]}
      itemType={itemType}
      onBulkEdit={onBulkEdit}
      onDataLoad={fetchRecords}
      onReclaim={onReclaim}
      item={storeItem}
      reload={reload}
    />
  );
};

export default DomainJSX;
