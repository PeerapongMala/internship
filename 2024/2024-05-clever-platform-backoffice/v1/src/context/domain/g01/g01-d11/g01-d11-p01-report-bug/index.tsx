import CWReportBug from '@global/component/web/page/cw-p-report-bug';
import StoreGlobal from '@store/global';
import { useEffect } from 'react';

const ReportBugPage = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="w-full">
      <CWReportBug mode="create" />
    </div>
  );
};

export default ReportBugPage;
