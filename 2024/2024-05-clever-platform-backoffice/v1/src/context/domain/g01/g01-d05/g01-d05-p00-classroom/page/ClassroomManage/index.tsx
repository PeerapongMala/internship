import { useTranslation } from 'react-i18next';
import ConfigJson from '../../config/index.json';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d05/local/api';
import CWMBreadcrumbs from '@domain/g01/g01-d05/local/component/web/molecule/cw-m-breadcrumbs';
import { Classroom, ClassroomBase } from '@domain/g01/g01-d05/local/api/type';
import { ClassroomFilterQueryParams } from '@domain/g01/g01-d05/local/api/repository/classroom';
import { useNavigate, useParams } from '@tanstack/react-router';
import downloadCSV from '@global/utils/downloadCSV';
import { Modal } from '@component/web/cw-modal';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { fromISODateToYYYYMMDD, toDateTimeTH } from '@global/utils/date';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { getDateTime, toOptions } from '@domain/g01/g01-d05/local/utils';
import showMessage from '@global/utils/showMessage';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import IconCopy from '@core/design-system/library/vristo/source/components/Icon/IconCopy';
import CWAcademicYearModalButton from '@domain/g01/g01-d05/local/component/web/cw-academic-year-modal-button';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import usePagination from '@global/hooks/usePagination';
import CWButton from '@component/web/cw-button';
import MoveStudentModalButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-move-student-modal-button';

function ClassroomManage() {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { schoolId }: { schoolId: string } = useParams({ strict: false });
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);
  const [records, setRecords] = useState<Classroom[]>([]);

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [selectedRecord, setSelectedRecord] = useState<Classroom | undefined>(undefined);
  const [selectedRecords, setSelectedRecords] = useState<Classroom[]>([]);
  const [statusIndex, setStatusIndex] = useState(0);

  const [academicYearsOptions, setAcademicYears] = useState<
    { label: string; value: string }[]
  >([]);
  const [yearsOptions, setYearOptions] = useState<{ label: string; value: string }[]>([]);

  const [modalState, setModalState] = useState<'' | 'copy' | 'archive' | 'recall'>('');
  const [formDataModal, setFormDataModal] = useState<ClassroomBase>({
    school_id: +schoolId,
    academic_year: 0,
    year: '',
    name: '',
  });

  const [filter, setFilter] = useState<ClassroomFilterQueryParams>({});

  async function onDownload(data: { dateFrom: string; dateTo: string }) {
    API.classroom
      .DownloadCSV(+schoolId, {
        limit: totalRecords,
        start_updated_at: data.dateFrom,
        end_updated_at: data.dateTo,
      })
      .then((res) => {
        try {
          downloadCSV(res, `${getDateTime()}_classrooms`);
        } catch (err) {
          showMessage('Download failed', 'error');
        }
      });
  }

  async function onUpload(file?: File) {
    if (file) {
      API.classroom.UploadCSV(+schoolId, file, {}).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          fetchRecords();
          showMessage('อัปโหลดสำเร็จ', 'success');
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  async function onCopy(id: number, data: Record<string, any>) {
    API.classroom.Clone(id, data).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage('คัดลอกห้องเรียนสำเร็จ', 'success');
        fetchRecords();
        setSelectedRecord(undefined);
        resetFormDataModal();
      } else {
        showMessage(res.message, 'error');
      }
    });
    closeModal();
  }

  async function onArchive(status: 'enabled' | 'disabled', record: Record<string, any>) {
    const data = {
      academic_year: record.academic_year,
      year: record.year,
      name: record.name,
      status,
    };
    API.classroom.Update(record.id, data).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage('บันทึกสำเร็จ', 'success');
        fetchRecords();
        setSelectedRecord(undefined);
      } else {
        showMessage(res.message, 'error');
      }
    });
    closeModal();
  }

  async function onBulkUpdate(
    status: 'enabled' | 'disabled',
    records: Record<string, any>[],
  ) {
    const data = records.map((record) => ({
      class_room_id: record.id,
      academic_year: record.academic_year,
      year: record.year,
      name: record.name,
      status,
    }));
    API.classroom.BulkEdit(+schoolId, data).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage(
          status == 'enabled' ? 'เปิดใช้งานสำเร็จ' : 'ปิดใช้งานสำเร็จ',
          'success',
        );
        fetchRecords();
        setSelectedRecords([]);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  const statusTabs = [
    { value: '', label: 'ทั้งหมด' },
    {
      value: 'draft',
      label: 'แบบร่าง',
      className: 'badge-outline-dark',
    },
    {
      value: 'enabled',
      label: 'ใช้งาน',
      className: 'badge-outline-success',
    },
    {
      value: 'disabled',
      label: 'ไม่ใช้งาน',
      className: 'badge-outline-danger',
    },
  ];

  // for display
  const [users, setUsers] = useState<Record<string, string>>({});

  function closeModal() {
    setModalState('');
    resetFormDataModal();
  }

  function resetFormDataModal() {
    setFormDataModal({
      academic_year: 0,
      year: '',
      name: '',
      school_id: +schoolId,
    });
  }

  function onFilterChange(key: keyof ClassroomFilterQueryParams, value: any) {
    setFilter((prev) => ({
      ...prev,
      [key]: value ? value : undefined,
    }));
  }

  function fetchRecords() {
    setFetching(true);
    API.classroom
      .Get(+schoolId, {
        ...filter,
        page: page,
        limit: limit,
        status: statusTabs[statusIndex]?.value
          ? statusTabs[statusIndex].value
          : undefined,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);

          for (let classroom of res.data) {
            const userId = classroom.updated_by;
            if (userId && !users[userId]) {
              API.other.User.GetById(userId).then((res) => {
                if (res.status_code == 200) {
                  setUsers((prev) => ({
                    ...prev,
                    [userId]: `${res.data.first_name} ${res.data.last_name}`,
                  }));
                }
              });
            }
          }
        } else {
          showMessage(res.message, 'error');
        }
        setFetching(false);
      });
  }

  useEffect(() => {
    fetchRecords();
  }, [page, limit, statusIndex, filter]);

  useEffect(() => {
    API.classroom.GetAcademicYears(+schoolId).then((res) => {
      if (res.status_code == 200) {
        setAcademicYears(
          res.data.map((year) => ({
            label: `ปีการศึกษา ${year}`,
            value: year.toString(),
          })),
        );
      } else {
        showMessage(res.message, 'error');
      }
    });
    API.other.SchoolAffiliation.GetSeedYears().then((res) => {
      if (res.status_code == 200) {
        setYearOptions(toOptions(res.data, 'short_name', 'short_name'));
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [schoolId]);

  return (
    <>
      <CWTableTemplate
        header={{
          bulkEditDisabled: selectedRecords.length == 0,
          bulkEditActions: [
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconArchive />
                  {'จัดเก็บ'}
                </div>
              ),
              onClick: () => {
                onBulkUpdate('disabled', selectedRecords);
              },
            },
          ],
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มห้องเรียน',
          onBtnClick: () => {
            navigate({ to: `${location.pathname}/classroom/create` });
          },
          onSearchChange: (e) => onFilterChange('search', e.currentTarget.value),
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
          onUpload: onUpload,
        }}
        filters={[
          {
            key: 'academic_year',
            placeholder: 'ปีการศึกษา',
            type: 'component',
            value: filter.academic_year,
            component: (
              <CWAcademicYearModalButton
                schoolId={+schoolId}
                type="button"
                className="min-w-48"
                placeholder="เลือกปีการศึกษา"
                onDataChange={(value) => {
                  onFilterChange('academic_year', value?.name);
                }}
              />
            ),
          },
          {
            key: 'updated_at',
            value: [filter.start_updated_at, filter.end_updated_at],
            placeholder: 'ชั้นปี',
            type: 'date-range',
            onChange: (value) => {
              const date: Date[] = value;
              onFilterChange(
                'start_updated_at',
                date[0] ? fromISODateToYYYYMMDD(date[0]?.toISOString()) : undefined,
              );
              onFilterChange(
                'end_updated_at',
                date[1] ? fromISODateToYYYYMMDD(date[1]?.toISOString()) : undefined,
              );
            },
          },
          {
            key: 'year',
            value: filter.year,
            placeholder: 'ชั้นปี',
            options: yearsOptions,
            onChange: (value) => onFilterChange('year', value),
          },
          {
            parentClassName: 'ml-auto',
            key: 'moveStudent',
            placeholder: 'Move Student',
            type: 'component',
            value: filter.academic_year,
            component: <MoveStudentModalButton />,
          },
        ]}
        tabs={{
          tabIndex: statusIndex,
          onTabChange: setStatusIndex,
          items: statusTabs.map((status) => status.label),
        }}
        table={{
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: (limit) => {
            setPage(1);
            setLimit(limit);
          },
          totalRecords,
          records: records,
          fetching,
          minHeight: 400,
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
          columns: [
            {
              accessor: '_',
              title: '#',
              render(_, index) {
                return (page - 1) * limit + index + 1;
              },
              width: 40,
            },
            {
              accessor: 'id',
              title: 'รหัสห้องเรียน',
            },
            {
              accessor: 'academic_year',
              title: 'ปีการศึกษา',
            },
            {
              accessor: 'year',
              title: 'ชั้นปี',
            },
            {
              accessor: 'name',
              title: 'ชื่อห้อง',
            },
            {
              accessor: 'updated_at',
              title: 'แก้ไขล่าสุด',
              render(record) {
                return record.updated_at ? toDateTimeTH(record.updated_at) : '-';
              },
            },
            {
              accessor: 'updated_by',
              title: 'แก้ไขล่าสุดโดย',
              render(record) {
                return record.updated_by ? (users[record.updated_by] ?? '-') : '-';
              },
            },
            {
              accessor: 'status',
              title: 'สถานะ',
              render(record) {
                const status = statusTabs.find((status) => status.value == record.status);
                return (
                  <span className={`badge text-nowrap ${status?.className}`}>
                    {status?.label}
                  </span>
                );
              },
            },
            {
              accessor: 'seeBtn',
              title: 'รายละเอียด',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 100,
              render(record) {
                return (
                  <button
                    onClick={() => {
                      navigate({
                        to: `${location.pathname}/classroom/${record.id}/teacher`,
                      });
                    }}
                  >
                    <IconSearch />
                  </button>
                );
              },
            },
            {
              accessor: 'copyBtn',
              title: 'คัดลอก',
              cellsClassName: 'text-center',
              width: 80,
              render(record) {
                return (
                  <button
                    onClick={() => {
                      setModalState('copy');
                      setSelectedRecord(record);
                      setFormDataModal({
                        academic_year: record.academic_year,
                        year: record.year,
                        name: record.name,
                        school_id: +schoolId,
                      });
                    }}
                  >
                    <IconCopy duotone={false} />
                  </button>
                );
              },
            },
            {
              accessor: 'editBtn',
              title: 'แก้ไข',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record) {
                const isDisabled = record.status === 'disabled';
                return (
                  <button
                    onClick={() => {
                      navigate({
                        to: `${location.pathname}/classroom/${record.id}`,
                      });
                    }}
                    className={isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                    disabled={isDisabled}
                  >
                    <IconPencil duotone={false} />
                  </button>
                );
              },
            },
            {
              accessor: 'archiveBtn',
              title: 'จัดเก็บ',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record) {
                return record.status == 'disabled' ? (
                  <button
                    onClick={() => {
                      setModalState('recall');
                      setSelectedRecord(record);
                    }}
                    className="cursor-not-allowed opacity-50"
                    disabled
                  >
                    <IconCornerUpLeft />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setModalState('archive');
                      setSelectedRecord(record);
                    }}
                  >
                    <IconArchive />
                  </button>
                );
              },
            },
          ],
        }}
      />
      <CWModalArchive
        open={modalState == 'archive'}
        onClose={() => {
          setSelectedRecord(undefined);
          setModalState('');
        }}
        onOk={() => {
          if (selectedRecord) {
            onArchive('disabled', selectedRecord);
          }
        }}
      />
      {/* <CWModalArchiveRecall
        open={modalState == 'recall'}
        onClose={() => {
          setSelectedRecord(undefined);
          setModalState('');
        }}
        onOk={() => {
          if (selectedRecord) {
            onArchive('enabled', selectedRecord);
          }
        }}
      /> */}
      <Modal
        open={modalState == 'copy'}
        onClose={closeModal}
        title={'คัดลอกห้องเรียน'}
        className="w-96"
      >
        <div className="flex flex-col gap-4">
          <CWMBreadcrumbs
            breadcrumbs={[
              {
                label: `${'ปีการศึกษา'}: ${selectedRecord?.academic_year}`,
              },
              { label: selectedRecord?.year || '' },
              { label: selectedRecord?.name || '' },
            ]}
          />
          {(
            [
              {
                name: 'academic_year',
                type: 'component',
                component: (
                  <div className="flex flex-col gap-1.5">
                    <CWAcademicYearModalButton
                      type="button"
                      className="w-full"
                      schoolId={+schoolId}
                      onDataChange={(value) => {
                        if (value) {
                          setFormDataModal((prev) => ({
                            ...prev,
                            academic_year: +value.name,
                          }));
                        }
                      }}
                      academicYear={formDataModal?.academic_year}
                    />
                  </div>
                ),
              },
              {
                name: 'year',
                label: 'ชั้นปี',
                type: 'select',
                options: yearsOptions,
                required: true,
                value: formDataModal?.year,
              },
              {
                name: 'name',
                type: 'text',
                label: 'ห้อง',
                required: true,
                value: formDataModal?.name,
              },
            ] as const
          ).map((config, index) => (
            <div key={`${config.name}-${index}`} className="flex flex-col gap-1">
              {config.type == 'component' ? (
                config.component
              ) : config.type == 'select' ? (
                <>
                  <CWSelect
                    label={config.label}
                    options={config.options}
                    required={config.required}
                    value={formDataModal[config.name]}
                    onChange={(event) => {
                      setFormDataModal((prev) => {
                        return {
                          ...prev,
                          [config.name]: event.currentTarget.value ?? '',
                        };
                      });
                    }}
                  />
                </>
              ) : (
                <CWInput
                  label={config.label}
                  required={config.required}
                  value={formDataModal[config.name]}
                  onChange={(e) => {
                    setFormDataModal((prev) => {
                      return {
                        ...prev,
                        [config.name]: e.currentTarget.value ?? '',
                      };
                    });
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex w-full gap-2 *:flex-1">
          <button className="btn btn-outline-dark" onClick={closeModal}>
            {'ยกเลิก'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (selectedRecord && formDataModal.academic_year) {
                onCopy(selectedRecord.id, formDataModal);
              } else {
                showMessage('กรุณาเลือกปีการศึกษา', 'warning');
              }
            }}
          >
            {'คัดลอก'}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ClassroomManage;
