import { useEffect, useState } from 'react';
import CWWhiteBox from '@global/component/web/cw-white-box';
import TableActionMenu from '@context/domain/g01/g01-d09/g01-d09-a01-permission-info/component/web/molecule/cw-m-table-action-menu';
import SchoolListDataTable from '../../molecule/cw-m-school-list-data-table';
import AddSchoolModal from '../../organism/cw-o-school-list-add-school-modal';
import { useObserverSelectSchoolListStore } from '@domain/g01/g01-d09/local/stores/observer-school-list';
import useObserverAccessStore from '@domain/g01/g01-d09/local/stores/observer-access-form';
import { TObServerAccessSchool } from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';
import useStore from '@domain/g01/g01-d09/local/stores';

const SchoolListTemplate = () => {
  const [searchText, setSearchText] = useState({
    key: 'code',
    value: '',
  });
  const [isOpenAddSchool, setIsOpenAddSchool] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<TObServerAccessSchool[]>([]);
  const obsSchoolStore = useStore.observerAccessSchool();
  const obServerSchoolStore = useObserverSelectSchoolListStore();
  const formStore = useObserverAccessStore();

  // useEffect(() => {
  //   fetchAllSchoolSelection();
  //   // return () => {
  //   //   obServerSchoolStore.selectedClearSelectedSchools();
  //   // };
  // }, [searchText]);

  const onSearchTextChange = (search: { key: string; value: string }) => {
    setSearchText(search);
  };

  useEffect(() => {
    if (formStore.formData.id) {
      const params = {
        page: obsSchoolStore.pagination.page,
        limit: obsSchoolStore.pagination.limit,
        [searchText.key]: searchText.value,
      };
      obsSchoolStore.fetchData(formStore.formData.id, params);
    }
  }, [searchText, formStore.formData.id]);

  // ... ส่วนอื่นๆ เหมือนเดิม

  return (
    <CWWhiteBox>
      <TableActionMenu
        handleOpenModal={() => setIsOpenAddSchool(true)}
        searchText={searchText}
        handleSetSearchText={onSearchTextChange}
        selectedRecords={selectedRecords}
        onDeleteBulkEdit={() => setSelectedRecords([])}
      />
      <SchoolListDataTable
        selectedRecords={selectedRecords}
        onSelectedRecord={(records) => setSelectedRecords(records)}
        searchText={searchText}
      />
      <AddSchoolModal
        isOpen={isOpenAddSchool}
        handleCloseModal={() => setIsOpenAddSchool(false)}
      />
    </CWWhiteBox>
  );
};

export default SchoolListTemplate;
