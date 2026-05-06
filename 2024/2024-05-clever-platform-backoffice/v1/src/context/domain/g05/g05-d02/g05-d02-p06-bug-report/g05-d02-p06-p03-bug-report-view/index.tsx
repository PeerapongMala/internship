import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { useNavigate, useParams } from '@tanstack/react-router';
import TitleGroup from '../local/components/web/organism/cw-o-title-group';
import DetailProblem from '../local/components/web/organism/cw-o-detail-problem';
import UploadPicture from '../local/components/web/organism/cw-o-upload-picture';
import SavePanel from '../local/components/web/organism/cw-o-save-panel';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import { useEffect, useState } from 'react';
import { TBugReport } from '../../local/types/bug-report';
import showMessage from '@global/utils/showMessage';
import API from '../../local/api';
import { TPagination } from '../../local/types';
import StoreGlobal from '@store/global';
import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  const search = useParams({ strict: false });
  const navigate = useNavigate();
  const goBack = () => {
    navigate({ to: '../../' });
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<TBugReport>();
  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    fetchData();
  }, [pagination.page]);
  const fetchData = async () => {
    setFetching(true);
    try {
      setFetching(true);
      const res = await API.BugReport.BugGet(search.bugId, {});
      if (res?.status_code === 200) {
        setRecords(res.data);
      }
    } catch (error: any) {
      console.error('Fetch error', error);
      showMessage(error, 'error');
    } finally {
      setFetching(false);
    }
  };
  return (
    <ScreenTemplate
      className="mb-20 items-center"
      headerTitle="ปัญหาการใช้งาน"
      header={false}
    >
      <div className="mb-5 flex w-full flex-col px-5">
        <div className="relative mt-5 flex items-center justify-center">
          <button onClick={goBack}>
            <IconArrowBackward className="absolute left-3 top-2" />
          </button>
          <p className="text-2xl font-bold">ปัญหาการใช้งาน</p>
        </div>
        <div className="mb-5 mt-5">
          <TitleGroup bug_id={search.bugId} />
        </div>
        <DetailProblem data={records} />
        <UploadPicture imageUrls={records?.image_urls} allowUpload={false} />
        <SavePanel
          problemId={records?.bug_id}
          lastUpdated={records?.edited_at}
          lastUpdatedBy={records?.edited_by}
          status={records?.status}
        />
        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
