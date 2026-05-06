import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonGlobal from '../local/config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';
import API from '../local/api';
import CWItemPage, { CWItemPageProps } from '../local/component/web/cw-item-page';
import showMessage from '@global/utils/showMessage';
import downloadCSV from '@global/utils/downloadCSV';
import { resolve } from 'path';

const DomainJSX = () => {
  const { t: tG } = useTranslation([ConfigJsonGlobal.key]);
  const { t } = useTranslation([ConfigJson.key]);
  const { itemType }: { itemType: ItemType } = useParams({ strict: false });
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  if (!['frame', 'badge', 'coupon'].includes(itemType)) {
    navigate({ to: '/gamemaster/item/frame' });
  }

  const [reload, setReload] = useState(false);

  function triggerReload() {
    setReload(!reload);
  }

  function onArchive(status: 'enabled' | 'disabled', record: Item) {
    API.item
      .Update(record.id, {
        ...record,
        status,
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage(
            `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`,
            'success',
          );
          triggerReload();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onEdit(record: Item) {
    navigate({ to: `/gamemaster/item/$itemType/${record.id}` });
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: Item[]): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      API.item
        .BulkEdit(
          records.map((record) => ({
            id: record.id,
            status,
          })),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage(
              `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`,
              'success',
            );
            triggerReload();
            resolve(true);
          } else {
            showMessage(res.message, 'error');
            resolve(false);
          }
        })
        .catch((err) => {
          showMessage(err.message, 'error');
          resolve(false);
        });
    });
  }

  const fetchRecords: CWItemPageProps['onDataLoad'] = ({
    setFetching,
    limit,
    page,
    setRecords,
    setTotalRecords,
    searchText,
    status,
  }) => {
    setFetching(true);
    API.item
      .Get({
        page,
        limit,
        type: itemType,
        search_text: searchText,
        status,
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
    <CWItemPage
      translationKey={ConfigJson.key}
      itemType={itemType}
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
      onBulkEdit={onBulkEdit}
      onDisabled={(record) => onArchive('disabled', record)}
      onEnabled={(record) => onArchive('enabled', record)}
      onEdit={onEdit}
      reload={reload}
    />
  );
};

export default DomainJSX;
