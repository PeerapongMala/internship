import CWSwitchTabs from '@component/web/cs-switch-taps';
import CWSchoolCard from '@component/web/cw-school-card';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import EvaluateList from './component/web/template/evaluation-list';
import GeneralEvaList from './component/web/template/generalEva-list';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { templateTabs } from './component/web/option';

const DomainJSX = () => {
  const { tab: urlTab }: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate({
    from: 'grade-system/template',
  });


  const [selectedTab, setSelectedTab] = useState<string>(() => {
    return urlTab && templateTabs.some(tab => tab.id === urlTab)
      ? urlTab
      : templateTabs[0].id;
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    navigate({
      search: { tab: tabId },
    });
  };
  const SwitchTabs = templateTabs.map((tab, index) => ({
    id: tab.id,
    label: tab.th_name,
    content: index === 0 ? <GeneralEvaList /> : <EvaluateList />,
    onClick: () => handleTabChange(tab.id),
  }));


  useEffect(() => {
    if (urlTab) {
      if (templateTabs.some(tab => tab.id === urlTab) && urlTab !== selectedTab) {
        setSelectedTab(urlTab);
      }
    } else {
      if (selectedTab !== templateTabs[0].id) {
        setSelectedTab(templateTabs[0].id);
        navigate({
          search: { tab: templateTabs[0].id },
        });
      }
    }
  }, [urlTab]);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName
        links={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'ระบบตัดเกรด (ปพ.)', href: '/', disabled: true },
          { label: 'จัดการ Template', href: '/' },
        ]}
      />
      <CWSchoolCard
        name="โรงเรียนสาธิตมัธยม"
        code="000000001"
        subCode="AA109"
        className="mt-5"
      />
      <div className="w-full">
        <div className="my-7">
          <h1 className="text-[28px] font-bold">จัดการ Template</h1>
        </div>
        <CWSwitchTabs tabs={SwitchTabs} initialTabId={selectedTab?.toString()} />
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;
