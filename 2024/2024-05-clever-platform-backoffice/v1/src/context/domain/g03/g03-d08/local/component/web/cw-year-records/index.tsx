import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { School } from '@domain/g01/g01-d05/local/api/type';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import { useNavigate } from '@tanstack/react-router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SchoolHeader, Subject } from '../../../api/type';
import CWSchoolCard from '@component/web/cw-school-card';
import { SubjectShop } from '@domain/g03/g03-d09/local/api/type';
import usePagination from '@global/hooks/usePagination';

export interface CWYearRecordsProps {
  translationKey: string;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  school?: SchoolHeader;
  onDataLoad(params: {
    setRecords: Dispatch<SetStateAction<(Subject | SubjectShop)[]>>;
    setTotalRecords: (total: number) => void;
    setFetching: Dispatch<SetStateAction<boolean>>;
    page: number;
    limit: number;
  }): void;
  onEdit(record: Subject | SubjectShop): void;
  title?: string;
}

const CWYearRecords = function ({
  breadcrumbs,
  onDataLoad,
  school,
  translationKey,
  onEdit,
  title,
}: CWYearRecordsProps) {
  const { t } = useTranslation([translationKey]);
  const navigate = useNavigate();

  const [records, setRecords] = useState<(Subject | SubjectShop)[]>([]);

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    onDataLoad({
      limit,
      page,
      setFetching,
      setRecords,
      setTotalRecords,
    });
  }, [page, limit]);

  return (
    <div className="flex flex-col gap-4">
      <CWBreadcrumbs links={breadcrumbs} />

      <CWSchoolCard
        code={school?.school_id?.toString() ?? '-'}
        name={school?.school_name ?? '-'}
        subCode={school?.school_code ?? '-'}
        image={school?.shool_image_url ?? ''}
      />

      <div className="text-2xl font-bold">{title ?? 'ไอเทมครู'}</div>

      <CWTableTemplate
        table={{
          records,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          fetching,
          columns: [
            {
              accessor: 'id',
              title: '#',
              render(record, index) {
                return 'subject_id' in record ? record['subject_id'] : record['id'];
              },
            },
            {
              accessor: 'year',
              title: 'ชั้นปี',
            },
            {
              accessor: 'subject',
              title: 'วิชา',
              render(record, index) {
                return 'subject_name' in record
                  ? record['subject_name']
                  : record['subject'];
              },
            },
            {
              accessor: 'update_at',
              title: 'แก้ไขล่าสุด',
              render(record, index) {
                return record.update_at ? toDateTimeTH(record.update_at) : '-';
              },
            },
            {
              accessor: 'update_by',
              title: 'แก้ไขล่าสุดโดย',
            },
            {
              accessor: 'editBtn',
              title: 'แก้ไข',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record) {
                return (
                  <button
                    onClick={() => {
                      onEdit(record);
                    }}
                  >
                    <IconPen />
                  </button>
                );
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default CWYearRecords;
