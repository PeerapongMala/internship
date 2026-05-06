import { useEffect, useState, useCallback } from 'react';
import { BugReport, BugReportStatus, Curriculum } from '../local/type';
import { useNavigate, useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';

import SidePanel from '../local/components/web/organism/Sidepanel';
import CWDetail from './components/web/template/cw-detail';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { IBugReportDetailProps } from '@domain/g04/g04-d05/local/type';

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

  const { reportId } = useParams({ strict: false });

  const [useBugDetailData, setBugDetailData] = useState<IBugReportDetailProps | null>(
    null,
  );
  const [useUpdateBugData, setUpdateBugData] = useState<{
    status: BugReportStatus | '';
    message: string;
  }>({
    status: '',
    message: '',
  });

  const [reload, setReload] = useState(false);

  const handleClickUpdateBugStatus = useCallback(async () => {
    try {
      const res = await API.bugReport.PostG04D06A04({
        bug_id: Number(reportId),
        status: useUpdateBugData?.status || '',
        message: useUpdateBugData?.message || '',
      });
      if (res.status_code === 200) {
        showMessage('Update bug report success', 'success');
        setUpdateBugData({
          status: '',
          message: '',
        });
        setReload((prev) => !prev);
      } else {
        showMessage(res.message, 'error');
      }
    } catch (error) {
      showMessage(`Failed to update bug report: ${error}`, 'error');
    }
  }, [useUpdateBugData]);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        const res = await API.bugReport.GetG04D06A02(reportId);
        if (res.status_code === 200) {
          setBugDetailData(res.data);
        }
      } catch (error) {
        showMessage(`Failed to bug detail : ${error}`, 'error');
      }
    };
    fetchMockData();
  }, [reportId, reload]);

  return (
    <div className="h-full w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'แจ้งปัญหาการใช้งาน', href: '#' },
        ]}
      />
      <div className="my-5">
        <CWTitleBack label="ปัญหาการใช้งาน" href="../../" />
      </div>
      <div className="flex gap-5">
        <CWWhiteBox className="flex h-fit w-[70%] flex-col gap-5">
          <div className="h-fit w-full">
            <CWDetail data={useBugDetailData} />
          </div>
        </CWWhiteBox>
        <SidePanel
          reload={reload}
          data={useBugDetailData}
          reportId={reportId}
          titleName="รหัสปัญหา"
          statusValue={useUpdateBugData?.status || useBugDetailData?.status}
          status={(newStatus) => {
            setUpdateBugData((prev) => ({ ...prev, status: newStatus }));
          }}
          mode="edit"
          onClick={handleClickUpdateBugStatus}
          textAreaValue={useUpdateBugData?.message}
          onChangeTextArea={(value) => {
            setUpdateBugData((prev) => ({ ...prev, message: value }));
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
