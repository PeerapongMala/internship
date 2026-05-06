import Tabs from '../../local/component/web/molecule/wc-m-tabs';
import { useEffect, useState } from 'react';
import Button from '../../local/component/web/atom/wc-a-button';
import IconArrowDown from '../../local/component/web/atom/wc-a-icon-arrow-down';
import SearchBoxWithSelect from '../../local/component/web/molecule/wc-m-search-box-select';
import Select from '../../local/component/web/atom/wc-a-select';
import Table from '../../local/component/web/organism/wc-o-table';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../config/index.json';
import { Columns } from '../../local/component/web/molecule/wc-m-table-header';
import { AcademicYear, Subject } from '../../local/type';
import CWOHeaderTableButton from '@component/web/organism/cw-o-header-table-button';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '../../local/api';
import showMessage from '@global/utils/showMessage';

function SubjectTeacherManagement() {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { schoolId }: { schoolId: string } = useParams({ strict: false });

  const [fetching, setFetching] = useState(false);
  const [records, setRecords] = useState<Subject[]>([]);
  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [filters, setFilters] = useState<{ key: string; value: string }>({
    key: 'id',
    value: '',
  });

  const statuses = [
    {
      label: 'ทั้งหมด',
      value: '',
      className: '',
    },
    {
      label: 'แบบร่าง',
      value: 'draft',
      className: 'badge-outline-dark',
    },
    {
      label: 'ใช้งาน',
      value: 'enabled',
      className: 'badge-outline-success',
    },
    {
      label: 'ไม่ใช้งาน',
      value: 'disabled',
      className: 'badge-outline-danger',
    },
  ];

  useEffect(() => {
    setFetching(true);
    API.subjectTeacher
      .GetSubjects(+schoolId, {
        page,
        limit,
        [filters.key]: filters.value,
        contract_status: statuses[statusTabIndex]?.value ?? '',
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [schoolId, page, limit, filters, statusTabIndex]);

  return (
    <div>
      <CWTableTemplate
        header={{
          showBulkEditButton: false,
          showDownloadButton: false,
          showUploadButton: false,
          searchDropdownValue: filters.key,
          inputSearchType: 'input-dropdown',
          searchDropdownOptions: [
            {
              label: 'รหัส',
              value: 'id',
            },
            {
              label: 'สังกัดวิชา',
              value: 'curriculum_group',
            },
            {
              label: 'ชั้นปี',
              value: 'year',
            },
            {
              label: 'วิชา',
              value: 'name',
            },
          ],
          onSearchChange(e) {
            setFilters((prev) => ({
              ...prev,
              value: e.currentTarget.value,
            }));
          },
          onSearchDropdownSelect(selected) {
            setFilters((prev) => ({
              ...prev,
              key: selected.toString(),
            }));
          },
        }}
        tabs={{
          items: statuses.map((s) => s.label),
          tabIndex: statusTabIndex,
          onTabChange: setStatusTabIndex,
        }}
        table={{
          records,
          fetching,
          minHeight: 400,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          columns: [
            {
              accessor: 'seeBtn',
              title: 'ดูข้อมูล',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render(record) {
                return (
                  <button
                    onClick={() => {
                      navigate({
                        to: `/admin/school/$schoolId/subject-teacher/${record.id}`,
                      });
                    }}
                  >
                    <IconEye />
                  </button>
                );
              },
            },
            {
              accessor: '#',
              title: '#',
              render(record, index) {
                return index + 1;
              },
            },
            {
              accessor: 'id',
              title: t('word.subjectCode'),
            },
            {
              accessor: 'curriculum_group',
              title: t('word.affiliation'),
            },
            {
              accessor: 'year',
              title: t('word.class'),
            },
            {
              accessor: 'name',
              title: t('word.subject'),
            },
            {
              accessor: 'updated_at',
              title: t('table.body.header.edittedDate'),
              render(record, index) {
                return record.updated_at ? toDateTimeTH(record.updated_at) : '-';
              },
            },
            {
              accessor: 'updated_by',
              title: t('table.body.header.edittedBy'),
              render(record, index) {
                return record.updated_by || '-';
              },
            },
            {
              accessor: 'contract_status',
              title: 'สถานะ',
              render(record, index) {
                const status = statuses.find((s) => s.value == record.contract_status);
                return (
                  <span className={`badge text-nowrap ${status?.className}`}>
                    {status?.label}
                  </span>
                );
              },
            },
          ],
        }}
      />
    </div>
  );
}

export default SubjectTeacherManagement;
