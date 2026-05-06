import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  BugReport,
  BugReportStatus,
  CouponStatus,
  Curriculum,
  Redeem,
} from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';

import SidePanel from '../local/components/web/organism/Sidepanel';
import CWDetail from './components/web/template/cw-detail';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const mockData: Redeem[] = [
  {
    id: 1,
    started_at: '2024-11-18T17:25:19.821779Z',
    ended_at: '2024-11-18T17:25:19.821779Z',
    code: 'ABC-0001',
    date_remaining: '2024-11-18T17:25:19.821779Z',
    used_count: 10,
    initial_stock: 100,
    show_status: CouponStatus.WAITING,
    status: 'enabled',
    created_at: '2024-11-18T17:25:19.821779Z',
    created_by: 'Admin',
    updated_at: '2024-11-18T17:25:19.821779Z',
    updated_by: 'Admin',
  },
  {
    id: 2,
    started_at: '2024-11-18T17:25:19.821779Z',
    ended_at: '2024-11-18T17:25:19.821779Z',
    code: 'ABC-0001',
    date_remaining: '2024-11-18T17:25:19.821779Z',
    used_count: 10,
    initial_stock: 100,
    show_status: CouponStatus.PUBLISH,
    status: 'enabled',
    created_at: '2024-11-18T17:25:19.821779Z',
    created_by: 'Admin',
    updated_at: '2024-11-18T17:25:19.821779Z',
    updated_by: 'Admin',
  },
  {
    id: 3,
    started_at: '2024-11-18T17:25:19.821779Z',
    ended_at: '2024-11-18T17:25:19.821779Z',
    code: 'ABC-0001',
    date_remaining: '2024-11-18T17:25:19.821779Z',
    used_count: 10,
    initial_stock: 'ไม่จำกัด',
    show_status: CouponStatus.PUBLISH,
    status: 'enabled',
    created_at: '2024-11-18T17:25:19.821779Z',
    created_by: 'Admin',
    updated_at: '2024-11-18T17:25:19.821779Z',
    updated_by: 'Admin',
  },
];
const DomainJSX = () => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { redeemId } = useParams({ strict: false });

  const [record, setRecord] = useState<Redeem>();

  const [status, setStatus] = useState<CouponStatus | undefined>(CouponStatus.WAITING);

  useEffect(() => {
    const fetchData = () => {
      console.log('redeemId:', redeemId);
      const report = mockData.find((report) => report.id.toString() === redeemId);
      if (report) {
        setRecord(report);
      }
    };

    fetchData();
  }, [redeemId]);

  useEffect(() => {
    if (record) {
      setStatus(record.show_status);
    }
  }, [record]);

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'แจ้งปัญหาการใช้งาน', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="แก้ไขแจ้งปัญหาการใช้งาน" href="../../" />
      </div>
      <div className="flex gap-5">
        <CWWhiteBox className="flex w-[70%] flex-col gap-5">
          <div className="w-full">
            <CWDetail data={record} />
          </div>
        </CWWhiteBox>
        <SidePanel
          titleName="รหัสปัญหา"
          statusValue={status}
          status={(newStatus) => {
            console.log('New status:', newStatus);
            setStatus(newStatus);
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
