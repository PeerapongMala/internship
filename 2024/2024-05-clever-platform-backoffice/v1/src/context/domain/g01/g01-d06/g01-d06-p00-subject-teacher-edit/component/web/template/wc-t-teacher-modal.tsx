import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { useTranslation } from 'react-i18next';
import ConfigJson from '@domain/g01/g01-d06/g01-d06-p00-subject-teacher-edit/config/index.json';
import SearchBox from '@domain/g01/g01-d06/local/component/web/molecule/wc-m-search-box';
import { useEffect, useRef, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  AcademicYear,
  CreateSubjectTeacher,
  SchoolTeacher,
} from '@domain/g01/g01-d06/local/type';
import CWSelect from '@component/web/cw-select';
import CWInputSearch from '@component/web/cw-input-search';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import API from '@domain/g01/g01-d06/local/api';
import showMessage from '@global/utils/showMessage';
import CWButton from '@component/web/cw-button';
import CWPagination from '@component/web/cw-pagination';
import CWAcademicYearModalButton from '@domain/g01/g01-d05/local/component/web/cw-academic-year-modal-button';
import CWInput from '@component/web/cw-input';

interface TableProps {
  open: boolean;
  onClose: () => void;
  academicYears: AcademicYear[];
  onSubmit(data: { teacher_ids: string[]; academic_year: number }): void;
}

export default function AddTeacherModal(props: TableProps) {
  const { t } = useTranslation([ConfigJson.key]);
  const { schoolId }: { schoolId: string } = useParams({ strict: false });

  const [records, setRecords] = useState<SchoolTeacher[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ key: string; value: string }>({
    key: '',
    value: '',
  });
  const [academicYear, setAcademicYear] = useState('');

  function toggleSelectedId(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pId) => pId !== id);
      return [...prev, id];
    });
  }

  useEffect(() => {
    setSelectedIds([]);
    API.subjectTeacher
      .GetTeachers(+schoolId, {
        page,
        limit,
        [filters.key]: filters.value,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      });
  }, [page, limit, filters]);

  useEffect(() => {
    setSelectedIds([]);
    setAcademicYear('');
    setFilters({
      key: '',
      value: '',
    });
  }, [props.open]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={t('modal.header.selectTeacher')}
      className="w-[75vw]"
    >
      <div className="flex flex-col gap-4">
        <form className="flex gap-2" ref={formRef}>
          <div className="flex flex-col gap-1.5">
            <div>
              <span className="text-danger">*</span>กรุณาเลือกปีการศึกษา
            </div>
            <div className="flex gap-2">
              <CWAcademicYearModalButton
                displaySelectedValue={false}
                placeholder="เลือกปีการศึกษา"
                type="button"
                className="min-w-52"
                schoolId={+schoolId}
                onDataChange={(value) => {
                  setAcademicYear(value?.name || '');
                }}
              />
              <CWInput value={academicYear} disabled />
            </div>
          </div>
          <div className="flex-1"></div>
        </form>
        <div className="flex">
          <div className="flex-auto">
            <CWInputSearch
              className="!rounded-e-none *:w-full"
              placeholder="ค้นหา"
              onChange={(e) => {
                const value = e.currentTarget?.value ?? '';
                setFilters((prev) => ({
                  ...prev,
                  value,
                }));
              }}
            />
          </div>
          <CWSelect
            value={filters.key}
            className="w-32 *:!rounded-s-none *:!border-l-0"
            options={[
              {
                label: 'รหัส',
                value: 'id',
              },
              {
                label: 'คำนำหน้า',
                value: 'title',
              },
              {
                label: 'ชื่อ',
                value: 'first_name',
              },
              {
                label: 'สกุล',
                value: 'last_name',
              },
            ]}
            onChange={(e) => {
              const value = e.currentTarget?.value ?? '';
              setFilters((prev) => ({
                ...prev,
                key: value,
              }));
            }}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="border-b border-neutral-200"></div>
          <div className="flex max-h-96 flex-col gap-2.5 overflow-auto">
            {records.map((record) => {
              return (
                <div className="flex gap-2" key={record.id}>
                  <CWInputCheckbox
                    id={`${record.id}-checkbox`}
                    onChange={(evt) => {
                      toggleSelectedId(record.id);
                    }}
                    checked={selectedIds.includes(record.id)}
                  />
                  <label
                    htmlFor={`${record.id}-checkbox`}
                    className={`flex w-full gap-4 rounded border px-4 py-2 font-normal ${selectedIds.includes(record.id) && 'border-primary'}`}
                  >
                    <div className="flex-1">{record.id}</div>
                    <div className="flex-1">{record.title}</div>
                    <div className="flex-1">{record.first_name}</div>
                    <div className="flex-1">{record.last_name}</div>
                  </label>
                </div>
              );
            })}
          </div>
          <CWPagination
            currentPage={page}
            pageSize={limit}
            totalPages={Math.ceil(totalRecords / limit)}
            onPageChange={setPage}
            setPageSize={setLimit}
          />

          <div className="flex w-[100%] flex-row justify-between">
            <CWButton
              className="w-[15%] !bg-transparent !text-primary"
              title="ย้อนกลับ"
              onClick={props.onClose}
            />
            <CWButton
              className="w-[15%]"
              title="เลือก"
              onClick={() => {
                if (academicYear && selectedIds.length) {
                  props.onSubmit({
                    teacher_ids: selectedIds,
                    academic_year: +academicYear,
                  });
                } else {
                  showMessage('กรุณาเลือกปีการศึกษาและครู', 'warning');
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
