import { useState } from 'react';
import { LevelType, Monster } from '../../../Type';
import { MonsterData } from '../../option';
import { Modal, ModalProps } from '@core/design-system/library/component/web/Modal';
import API from '../../../api';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import { DataTable } from 'mantine-datatable';
import CWPagination from '@component/web/cw-pagination';
import { IPlatform } from '@domain/g02/g02-d02/local/type';
import WCADropdown from '../../organisms/WCADropdown';

interface ModalSelectSubjectProps extends ModalProps {
  title: string;
  onOk: () => void;
  size?: string;
  buttonName: string;
  disableOk: boolean;
  cancelButtonName: string;
  onClose: () => void;
  open: boolean;
  platformList: IPlatform[];
  yearList: any[];
  subjectGroupList: any[];
  subjectList: any[];
  selectPlatform: any;
  selectYear: any;
  selectSubjectGroup: any;
  selectSubjectInModal: any;
  setSelectPlatform: (platform: any) => void;
  setSelectYear: (year: any) => void;
  setSelectSubjectGroup: (subjectGroup: any) => void;
  setSelectSubjectInModal: (subject: any) => void;
  paginationSubject: any;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

const ModalSelectSubject = ({
  title,
  onOk,
  size = 'large',
  buttonName,
  disableOk,
  cancelButtonName,
  onClose,
  open,
  platformList,
  yearList,
  subjectGroupList,
  subjectList,
  selectPlatform,
  selectYear,
  selectSubjectGroup,
  selectSubjectInModal,
  setSelectPlatform,
  setSelectYear,
  setSelectSubjectGroup,
  setSelectSubjectInModal,
  paginationSubject,
  handlePageChange,
  handlePageSizeChange,
  ...rest
}: ModalSelectSubjectProps) => {
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const onRowClick = (item: any) => {
    setSelectedRow(item);
    setSelectSubjectInModal(item);
  };
  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={onClose}
      title={title}
      {...rest}
    >
      <div className="modal-body">
        <div className="grid grid-cols-3 gap-5">
          <WCADropdown
            placeholder={
              selectPlatform ? selectPlatform.seed_platform_name : 'เลือก Platform'
            }
            options={platformList.map((item) => ({
              label: item.seed_platform_name,
              value: item.id.toString(),
            }))}
            onSelect={(value) => {
              const selectedPlatformId = Number(value);
              const selectedPlatform = platformList.find(
                (item) => item.id === selectedPlatformId,
              );
              setSelectPlatform(selectedPlatform);
              setSelectYear(undefined);
              setSelectSubjectGroup(undefined);
            }}
            disabled={false}
          />

          <WCADropdown
            placeholder={selectYear ? selectYear.seed_year_name : 'เลือกชั้นปี'}
            options={yearList.map((item) => ({
              label: item.seed_year_name,
              value: item.id.toString(),
            }))}
            onSelect={(value) => {
              const selectedYearId = Number(value);
              const selectedYear = yearList.find((item) => item.id === selectedYearId);
              setSelectYear(selectedYear);
              setSelectSubjectGroup(undefined);
            }}
            disabled={!selectPlatform}
          />

          <WCADropdown
            placeholder={
              selectSubjectGroup
                ? selectSubjectGroup.seed_subject_group_name
                : 'เลือกกลุ่มวิชา'
            }
            options={subjectGroupList.map((item) => ({
              label: item.seed_subject_group_name,
              value: item.id.toString(),
            }))}
            onSelect={(value) => {
              const selectedSubjectGroupId = Number(value);
              const selectedSubjectGroup = subjectGroupList.find(
                (item) => item.id === selectedSubjectGroupId,
              );
              setSelectSubjectGroup(selectedSubjectGroup);
            }}
            disabled={!selectYear}
          />
        </div>

        <hr className="my-5" />

        <div className="mt-5 w-full overflow-x-auto">
          <div className="h-[550px] w-full rounded-md bg-white">
            <div className="w-full">
              {subjectList.length === 0 ? (
                <p className="py-4 pt-[250px] text-center">ไม่พบข้อมูล</p>
              ) : (
                <>
                  {subjectList.map((item) => (
                    <div
                      key={item.id}
                      className={`mb-3 flex cursor-pointer gap-[50%] rounded-md border-[1.5px] hover:bg-gray-200 ${selectedRow?.id === item.id ? 'rounded-md border-2 border-primary bg-blue-100' : ''}`}
                      onClick={() => onRowClick(item)}
                    >
                      <p className="px-4 py-2">{item.id}</p>
                      <p className="px-4 py-2">{item.name}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {subjectList.length > 0 && (
          <div className="mt-4 flex justify-center">
            <CWPagination
              currentPage={paginationSubject.page}
              totalPages={Math.ceil(paginationSubject.total_count / paginationSubject.limit)}
              onPageChange={handlePageChange}
              pageSize={paginationSubject.limit}
              setPageSize={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      <div className="flex w-full justify-between gap-5 px-5 py-5">
        <button className="btn btn-outline-primary w-32" onClick={onClose}>
          {cancelButtonName}
        </button>
        <button
          onClick={onOk}
          disabled={disableOk}
          className={`btn btn-primary flex w-32 gap-2 ${!selectedRow ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {buttonName}
        </button>
      </div>
    </Modal>
  );
};

export default ModalSelectSubject;
