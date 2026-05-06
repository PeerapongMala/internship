import { useEffect } from 'react';
import CWBreadcrumbs from '@global/component/web/cw-breadcrumbs';
import CWTitleBack from '@global/component/web/cw-title-back';
import StoreGlobal from '@store/global';

const TeacherChatHeader = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="flex-none">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'แชทครู', href: '/teacher/chat' },
        ]}
      />
      <div className="mt-5">
        {/* <CWTitleBack label="แชทครู" href="/teacher/chat/subject" /> */}
        <h1 className="text-[26px] font-bold">แชทครู</h1>
      </div>
    </div>
  );
};

export default TeacherChatHeader;
