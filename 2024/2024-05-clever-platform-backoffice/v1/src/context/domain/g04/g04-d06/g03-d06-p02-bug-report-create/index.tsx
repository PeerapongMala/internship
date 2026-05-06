import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import { BugReportStatus, Curriculum } from '../local/type';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInput from '@component/web/cw-input';
import SidePanel from '../local/components/web/organism/Sidepanel';
import CWDetail from './components/web/template/cw-detail';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const [status, setStatus] = useState<BugReportStatus | undefined>(
    BugReportStatus.WAITING,
  );

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'ปัญหาการใช้งาน', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="ปัญหาการใช้งาน" href="../" />
      </div>
      <div className="flex gap-5">
        <CWWhiteBox className="flex w-[70%] flex-col gap-5">
          <div className="w-full">
            <CWDetail />
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
