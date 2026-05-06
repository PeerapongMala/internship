import CWInputSearch from '@component/web/cw-input-search';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWSelect from '@component/web/cw-select';
import SchoolSelectTable from '../../molecule/cw-m-school-select-table';
import { useObserverSelectSchoolListStore } from '@domain/g01/g01-d09/local/stores/observer-school-list';
import API from '@domain/g01/g01-d09/local/api';
import useObserverAccessStore from '@domain/g01/g01-d09/local/stores/observer-access-form';
import { useSchoolAffiliationStore } from '@domain/g01/g01-d09/local/stores/school-affiliation';
import { useState } from 'react';
import useStore from '@domain/g01/g01-d09/local/stores';
import CWMSearchBox from '@domain/g01/g01-d05/local/component/web/molecule/cw-m-search-box';

type AddSchoolModalProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
};
const AddSchoolModal = ({ isOpen, handleCloseModal }: AddSchoolModalProps) => {
  const store = useStore.observerAccessSchoolList();
  const formStore = useStore.observerAccessForm();
  const schoolAffStore = useStore.schoolAffiliation();

  const [selectedSearchSchool, setSelectedSearchSchool] = useState<string>();
  const [selectedFilterGroup, setSelectedFilterGroup] = useState<string>();
  const [selectedFilterSchoolAff, setSelectedFilterSchoolAff] = useState<number>();

  const handleSave = async () => {
    if (!formStore.formData.id) return;

    const result = await API.adminReportPermissionAPI.PutsArpUpdateSchool(
      formStore.formData.id,
      store.selectedSchoolIds,
    );

    store.setSelectedSchoolIds(result);
    setSelectedFilterGroup(undefined);
    setSelectedFilterSchoolAff(undefined);
    setSelectedSearchSchool(undefined);

    handleCloseModal?.();
  };
  return (
    <CWModalCustom
      className="z-10 flex w-full max-w-[1024px] flex-col"
      title="เลือกโรงเรียน"
      open={isOpen}
      onClose={handleCloseModal}
      onOk={handleSave}
      cancelButtonName="ย้อนกลับ"
      buttonName="เลือก"
      buttonWidth="150px"
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <CWMSearchBox
          name="Search School"
          placeholder="ค้นหา"
          className="w-full"
          value={selectedSearchSchool}
          onChange={(e) => setSelectedSearchSchool(e.target.value)}
        />
        <CWSelect
          className="w-full"
          options={schoolAffStore.schoolAffiliationGroups.map((group) => ({
            label: group,
            value: group,
          }))}
          title="กลุ่มสังกัด"
          value={selectedFilterGroup}
          onChange={(value: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedFilterGroup(value.target.value);
            setSelectedFilterSchoolAff(undefined);
          }}
        />
        <CWSelect
          className="w-full"
          options={
            selectedFilterGroup
              ? schoolAffStore.schoolAffiliationList
                  .filter((list) => list.school_affiliation_group === selectedFilterGroup)
                  .map((list) => ({
                    label: list.name,
                    value: list.id,
                  }))
              : schoolAffStore.schoolAffiliationList.map((list) => ({
                  label: list.name,
                  value: list.id,
                }))
          }
          title="สังกัด"
          value={selectedFilterSchoolAff}
          onChange={(value: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedFilterSchoolAff(Number(value.target.value))
          }
          disabled={!selectedFilterGroup}
        />
      </div>

      <SchoolSelectTable
        selectedFilterGroup={selectedFilterGroup}
        selectedFilterSchoolAff={selectedFilterSchoolAff}
        selectedSearchSchool={selectedSearchSchool}
      />
    </CWModalCustom>
  );
};

export default AddSchoolModal;
