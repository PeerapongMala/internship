import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonGlobal from '../local/config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWItemPage, {
  CWItemPageProps,
} from '@domain/g04/g04-d02/local/component/web/cw-item-page';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { Subject } from '../local/api/type';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { t: tG } = useTranslation([ConfigJsonGlobal.key]);
  const { t } = useTranslation([ConfigJson.key]);
  const { subjectId, itemType }: { subjectId: string; itemType: ItemType } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);

  const schoolId = userData?.school_id ?? targetData?.school_id;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  if (!['coupon'].includes(itemType)) {
    navigate({ to: '/teacher/item/$subjectId/coupon' });
  }

  const [reload, setReload] = useState(false);
  const [subject, setSubject] = useState<Subject>();

  useEffect(() => {
    API.item.GetGroupById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        console.log({ res: res });
        setSubject(res.data);
      } else {
        navigate({ to: '/teacher/item' });
      }
    });
  }, [subjectId]);

  function onArchive(status: 'enabled' | 'disabled', row: Item) {
    API.item
      .Update(row.id, {
        ...row,
        status,
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setReload((prev) => !prev);
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: Item[]) {
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
            showMessage('บันทึกสำเร็จ', 'success');
            setReload((prev) => !prev);
            resolve(true);
          } else {
            showMessage(res.message, 'error');
            resolve(false);
          }
        });
    });
  }

  function onEdit(record: Item) {
    navigate({ to: `./${record.id}` });
  }

  const fetchRecords: CWItemPageProps['onDataLoad'] = ({
    setFetching,
    limit,
    page,
    setRecords,
    setTotalRecords,
    searchText,
    status,
    filters,
  }) => {
    if (!schoolId) {
      return;
    }
    if (subjectId) {
      setFetching(true);
      API.item
        .Get(+subjectId, {
          school_id: schoolId,
          page,
          limit,
          type: itemType,
          status,
          [filters?.key || '']: filters?.value
            ? filters?.key == 'id'
              ? +filters.value
              : filters.value
            : undefined,
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
    }
  };

  return (
    <CWItemPage
      userType="teacher"
      view="teacher"
      reload={reload}
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
        {
          href: '#',
          label: subject?.year ?? subjectId,
        },
        {
          href: '#',
          label: subject?.subject ?? '',
        },
      ]}
      onDataLoad={fetchRecords}
      onBulkEdit={onBulkEdit}
      onDisabled={(record) => onArchive('disabled', record)}
      onEnabled={(record) => onArchive('enabled', record)}
      onEdit={onEdit}
    />
  );
};

export default DomainJSX;
