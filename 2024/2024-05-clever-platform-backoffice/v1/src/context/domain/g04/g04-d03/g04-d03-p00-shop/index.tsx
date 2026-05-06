import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

import ConfigJson from './config/index.json';
import CWShopRecords, {
  CWShopRecordsProps,
} from '../local/component/web/cw-shop-records';
import { StoreItem } from '../local/api/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { itemType }: { itemType: 'frame' | 'badge' | 'coupon' } = useParams({
    strict: false,
  });
  const navigate = useNavigate();

  if (itemType != 'frame' && itemType != 'badge' && itemType != 'coupon') {
    navigate({ to: '/gamemaster/shop/frame' });
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [reload, setReload] = useState(false);

  function onArchive(record: StoreItem) {
    const status = record.status == 'expired' ? 'enabled' : 'expired';
    API.store.UpdateStatus(record.id, status).then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('แก้ไขสำเร็จ', 'success');
        setReload((prev) => !prev);
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
            showMessage('แก้ไขสำเร็จ', 'success');
            setReload((prev) => !prev);
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
      .Get({
        limit,
        page,
        status: status || undefined,
        search_text: searchText,
        type: itemType,
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
    <CWShopRecords
      itemHref={`/gamemaster/item/${itemType}`}
      translationKey={ConfigJson.key}
      breadcrumbs={[
        {
          label: 'ระบบเกม',
          href: '/gamemaster',
        },
        {
          label: 'จัดการร้านค้า',
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
      reload={reload}
    />
  );
};

export default DomainJSX;
