import ReportPermissionHeader from '@context/domain/g01/g01-d09/local/component/web/molecule/cw-m-report-permission-header';
import TableMenuTab from '@context/domain/g01/g01-d09/local/component/web/organism/cw-o-table-menu-tab';
import AccessInfoTemplate from './component/web/template/cw-t-access-info';
import { useEffect, useState } from 'react';
import SchoolListTemplate from './component/web/template/cw-t-school-list';
import useStore from '../local/stores';
import { useSearch } from '@tanstack/react-router';

const DomainJSX = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const saStore = useStore.schoolAffiliation();
  const schoolLaoStore = useStore.schoolLaoAffiliation();
  const obsFormStore = useStore.observerAccessForm();
  const { id } = useSearch({ from: '/admin/report-permission/info' });

  useEffect(() => {
    saStore.fetchData();
    schoolLaoStore.fetchData();

    if (obsFormStore.formData.id || id)
      obsFormStore.fetchAdminReportPermission(obsFormStore.formData.id ?? Number(id));

    return () => {
      obsFormStore.reset();
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <ReportPermissionHeader href={'/admin/report-permission'} />
      <TableMenuTab handleOnSwitchTab={setSelectedTab} />
      {selectedTab === 0 && (
        <AccessInfoTemplate
          formData={obsFormStore.formData}
          handleFormDataChange={obsFormStore.updateField}
        />
      )}
      {selectedTab === 1 && <SchoolListTemplate />}
    </div>
  );
};

export default DomainJSX;
