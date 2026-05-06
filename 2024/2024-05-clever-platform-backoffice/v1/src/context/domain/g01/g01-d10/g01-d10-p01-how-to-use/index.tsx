import { useEffect } from 'react';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { CWButtonDownloadDocs } from '@component/web/cw-button-download-docs';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'วิธีการใช้งาน', href: '#' },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-800">วิธีการใช้งาน</h1>
      <CWButtonDownloadDocs
        href="/assets/documents/manuals/clms-complete-manual.pdf"
        label="คู่มือวิธีการใช้งานของระบบ CLMS (ฟีเจอร์แอดมิน, นักวิชาการ, ครู, ผู้ดูแลเกม)"
      />
    </div>
  );
};

export default DomainJSX;
