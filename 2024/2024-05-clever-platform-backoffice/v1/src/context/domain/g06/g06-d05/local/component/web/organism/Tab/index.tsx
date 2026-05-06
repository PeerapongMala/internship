import { TabGroup, TabList, Tab } from '@headlessui/react';
import { Link, useParams, useRouterState } from '@tanstack/react-router';
import API from '@domain/g06/g06-d05/local/api';
import { useEffect, useState } from 'react';
import StoreGlobalVolatile from '@store/global/volatile';
import Breadcrumb from '@domain/g06/g06-d06/g06-d06-p01-student-records/component/web/organism/Breadcrumb';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';

interface TabProps {
  name: string;
  to: string;
  id: string | number;
}

interface RouterLocation {
  pathname: string;
  state?: TEvaluationForm;
}

export default () => {
  const params = useParams({
    strict: false,
  });
  const { location } = useRouterState() as { location: RouterLocation };
  const evaluationForm = location.state;
  const evaluationFormId = Number(params.evaluationFormId);
  const pathId = params.path;
  const [courseMainTabId, setCourseMainTabId] = useState<number | null>(null);
  const [mainTabs, setMainTabs] = useState<TabProps[]>([]);
  const [subTabs, setSubTabs] = useState<TabProps[]>([]);
  const [loading, setLoading] = useState(true);

  const isMainTabActive = (tabId: string | number | null) => {
    if (tabId === courseMainTabId && subTabs.some(tab => pathId?.toString() === tab.id.toString())) {
      return true;
    }
    return tabId !== null && pathId?.toString() === tabId.toString();
  };
  const isSubTabActive = (tabId: string | number) => {
    return pathId?.toString() === tabId.toString();
  };

  useEffect(() => {
    if (evaluationFormId) {
      setLoading(true);
      API.GetPhorpor5List(evaluationFormId)
        .then((res) => {
          if (res?.status_code === 200 && Array.isArray(res?.data)) {
            const allTabs = res.data.map((item) => ({
              name: item.name,
              to: `/grade-system/evaluation/report/${evaluationFormId}/phorpor5/${item.id}`,
              id: item.id,
            }));

            const dataMainTab = allTabs.find((tab) => tab.name === 'รายวิชา');
            const courseMainTab = allTabs.find((tab) => tab.name === 'ปก ปพ.5 รายวิชา');
            const classMainTab = allTabs.find((tab) => tab.name === 'ปก ปพ.5 รายชั้น');
            if (classMainTab) {
              setCourseMainTabId(classMainTab.id);
            }
            const mainTabsData = [];
            if (dataMainTab) {
              mainTabsData.push({
                ...dataMainTab,
                name: 'รายวิชา',
              });
            }
            if (courseMainTab) {
              mainTabsData.push({
                ...courseMainTab,
                name: 'ปก ปพ.5 รายวิชา',
              });
            }
            if (classMainTab) {
              mainTabsData.push({
                ...classMainTab,
                name: 'ปก ปพ.5 รายชั้น',
              });
            }

            const classSubTabs = allTabs.filter(
              (tab) => tab.name !== 'รายวิชา' && tab.name !== 'ปก ปพ.5 รายวิชา',
            );

            setMainTabs(mainTabsData);
            setSubTabs(classSubTabs);
            StoreGlobalVolatile.MethodGet().setPhorpor5Tabs(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [evaluationFormId]);

  if (loading) {
    return (
      <div>
        <Breadcrumb evaluationFormID={evaluationFormId} evaluationForm={evaluationForm} />
        <div className="mt-5 p-4">กำลังโหลดแท็บ...</div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb evaluationFormID={evaluationFormId} evaluationForm={evaluationForm} />

      {/* แท็บหลัก */}
      {mainTabs.length > 0 && (
        <TabGroup as="div" className="mb-1 mt-5 bg-white">
          <TabList className="flex whitespace-nowrap border-white-light p-0 py-1.5">
            {mainTabs.map((tab) => (
              <Tab key={`main-tab-${tab.id}`} className="focus:outline-none">
                <Link
                  to={tab.to}
                  className={`px-4 py-1 text-sm font-medium ${isMainTabActive(tab.id)
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                    }`}
                >
                  {tab.name}
                </Link>
              </Tab>
            ))}
          </TabList>
        </TabGroup>
      )}

      {/* แท็บย่อย */}
      {(isMainTabActive(courseMainTabId) ||
        subTabs.some((tab) => isSubTabActive(tab.id))) &&
        subTabs.length > 0 && (
          <TabGroup as="div" className="my-5 bg-white">
            <TabList className="flex whitespace-nowrap border-white-light p-0 py-1.5">
              {subTabs.map((tab) => (
                <Tab key={`sub-tab-${tab.id}`} className="focus:outline-none">
                  <Link
                    to={tab.to}
                    className={`px-4 py-1 text-sm ${isSubTabActive(tab.id)
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-primary'
                      }`}
                  >
                    {tab.name}
                  </Link>
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        )}
    </div>
  );
};
