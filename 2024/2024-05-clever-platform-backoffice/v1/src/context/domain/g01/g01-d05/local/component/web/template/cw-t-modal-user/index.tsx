import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { useEffect, useState } from 'react';
import CWAButton from '../../atom/cw-a-button';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import CWInputSearch from '@component/web/cw-input-search';
import { Student, Teacher } from '@domain/g01/g01-d05/local/api/type';
import API from '@domain/g01/g01-d05/local/api';
import { useParams } from '@tanstack/react-router';
import usePagination from '@global/hooks/usePagination';

interface CWTModalUserProps<T> {
  type: 'teacher' | 'student';
  title: string;
  searchPlaceholder?: string;
  open?: boolean;
  className?: string;
  onClose?: () => void;
  onSubmit?: (rows: T[]) => void;
}

export type Filter =
  | {
      type: 'select';
      name: string;
      options: { label?: any; value: any }[];
    }
  | {
      type: 'search';
      name: string;
      placeholder?: string;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
    };

const CWTModalUser = function (props: CWTModalUserProps<Student | Teacher>) {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { schoolId } = useParams({ strict: false });

  const [searchText, setSearchText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [records, setRecords] = useState<(Student | Teacher)[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<(Student | Teacher)[]>([]);
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  useEffect(() => {
    setFetching(true);
    API[props.type]
      .Get(schoolId, {
        page,
        limit,
        search: searchText,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
          setSelectedRecords([]);
        }
        setFetching(false);
      });
  }, [page, limit, searchText, props.type]);

  useEffect(() => {
    if (!props.open) {
      setPage(1);
      setLimit(10);
      setSelectedRecords([]);
    }
  }, [props.open]);

  return (
    <Modal
      open={props.open ?? false}
      title={props.title}
      className="min-w-[750px]"
      onClose={props.onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <CWInputSearch
            className="flex w-full *:ml-0 *:w-full"
            placeholder={props.searchPlaceholder ?? 'ค้นหา'}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
        </div>
        <div className="border-t-2"></div>
        <CWTableTemplate
          table={{
            minHeight: 200,
            fetching,
            selectedRecords,
            onSelectedRecordsChange: setSelectedRecords,
            records: records,
            limit,
            onLimitChange: setLimit,
            page,
            onPageChange: setPage,
            totalRecords,
            options: {
              noHeader: props.type == 'student' ? true : false,
              highlightOnHover: false,
              rowClassName: `!border-b-0`,
              selectionTrigger: 'cell',
              onRowClick: ({ record }: { record: Student | Teacher }) => {
                setSelectedRecords((prev) => {
                  if (prev.some((r) => r.id == record.id)) {
                    return prev.filter((r) => r.id != record.id);
                  } else {
                    return [...prev, record];
                  }
                });
              },
            },
            columns: [
              {
                accessor: 'user',
                cellsClassName: '!p-0 !py-2',
                title: (
                  <div className="grid grid-cols-5 gap-2">
                    <div>{'รหัสบัญชี'}</div>
                    <div>{'รหัสนักเรียน'}</div>
                    <div>{'คำนำหน้า'}</div>
                    <div>{'ชื่อ'}</div>
                    <div>{'สกุล'}</div>
                  </div>
                ),
                render(record, index) {
                  return (
                    <div
                      className={`grid grid-cols-5 gap-2 rounded-lg border px-4 py-2 hover:cursor-pointer ${selectedRecords.some((r) => r.id == record.id) ? 'broder border-primary' : ''}`}
                    >
                      <div>{record.id}</div>
                      <div>{record.student_id}</div>
                      <div>{record.title}</div>
                      <div>{record.first_name}</div>
                      <div>{record.last_name}</div>
                    </div>
                  );
                },
              },
            ],
          }}
        />
        <div className="flex justify-between">
          <CWAButton
            className="w-32 !bg-transparent !text-primary"
            onClick={props.onClose}
          >
            {'ย้อนกลับ'}
          </CWAButton>
          <CWAButton className="w-32" onClick={() => props.onSubmit?.(selectedRecords)}>
            {'เลือก'}
          </CWAButton>
        </div>
      </div>
    </Modal>
  );
};

export default CWTModalUser;
