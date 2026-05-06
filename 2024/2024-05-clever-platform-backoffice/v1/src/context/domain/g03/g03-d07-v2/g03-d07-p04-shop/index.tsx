import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';

import ConfigJson from './config/index.json';
import { StoreItem, SubjectShop } from '../local/api/types/shop';
import { useNavigate, useParams } from '@tanstack/react-router';

import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import CWMainLayout from '../local/components/web/template/cw-main-layout';

import { IUserData } from '@domain/g00/g00-d00/local/type';
import CWShopRecords, {
  CWShopRecordsProps,
} from './component/web/template/cw-shop-records';
import { getUserSubjectData } from '@global/utils/store/user-subject';

const DomainJSX = () => {
  const itemType = 'coupon';

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };
  const schoolId = userData?.school_id ?? targetData?.school_id;
  const academic_year = targetData?.academic_year ?? userData?.academic_year;
  // const subjectId =
  //   Array.isArray(targetData?.subject) && targetData.subject.length > 0
  //     ? targetData.subject[0].id
  //     : Array.isArray(userData?.subject) && userData.subject.length > 0
  //       ? userData.subject[0].id
  //       : undefined;
  const subjectData = getUserSubjectData();
  const subjectId = subjectData?.id;

  const navigate = useNavigate();

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/reward/store/coupon') {
        navigate({ to: '/line/teacher/reward/store/coupon' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [reload, setReload] = useState(false);

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
    if (!subjectId) {
      return;
    }

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

  return (
    <div className="w-full">
      <CWMainLayout
        title={`จัดการรางวัล ปีการศึกษา ${academic_year}`}
        breadcrumbItems={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'จัดการรางวัล' },
        ]}
      >
        <CWShopRecords
          itemHref={`/teacher/item/${subjectId}/${itemType}`}
          translationKey={ConfigJson.key}
          reload={reload}
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
      </CWMainLayout>
    </div>
  );
};

export default DomainJSX;
