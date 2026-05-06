import CWButton from '@component/web/cw-button';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWInputSearch from '@component/web/cw-input-search';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import API from '@domain/g06/g06-d01/local/api';
import { TemplateFilterQueryParams } from '@domain/g06/g06-d01/local/api/repository';
import { EStatusTemplate, GradeTemplateRecord } from '@domain/g06/g06-d01/local/api/type';
import SelectYear from '@domain/g06/local/components/web/molecule/cw-m-select-year';
import usePagination from '@global/hooks/usePagination';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import { useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

const tabsList = [
  { label: 'ทั้งหมด', value: undefined },
  { label: 'แบบร่าง', value: EStatusTemplate.draft },
  { label: 'เผยแพร่', value: EStatusTemplate.published },
  { label: 'ยกเลิก', value: EStatusTemplate.cancel },
];

const EvaluateList: React.FC = () => {
  const userData = getUserData();

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<GradeTemplateRecord[]>([]);

  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [filterSearch, setFilterSearch] = useState<TemplateFilterQueryParams>({
    search_text: undefined,
    year: undefined,
    status: undefined,
  });

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const [selectArchive, setSelectArchive] = useState<GradeTemplateRecord>({
    id: 0,
    status: EStatusTemplate.published,
    template_name: '',
  });

  const modalArchive = useModal();

  const navigate = useNavigate();

  const columnDefs = useMemo<DataTableColumn<GradeTemplateRecord>[]>(() => {
    const columns: DataTableColumn<GradeTemplateRecord>[] = [
      {
        accessor: 'view',
        title: 'ดู',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 60,
        render: (record, index: number) => (
          <div className="flex w-full justify-center">
            {record.status === EStatusTemplate.draft ? (
              <button
                type="button"
                onClick={() => {
                  navigate({ to: `/grade-system/template/edit/${record.id}` });
                }}
              >
                <IconPen className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  navigate({ to: `/grade-system/template/info/${record.id}` });
                }}
              >
                <IconEye className="h-5 w-5" />
              </button>
            )}
          </div>
        ),
      },
      {
        accessor: 'active_flag',
        title: 'เปิดใช้งาน',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 90,
        render: (record) => {
          const status = record.status;
          const isCancel = status === EStatusTemplate.cancel;
          return (
            <div className="flex w-full justify-center">
              <CWButtonSwitch
                initialState={record.active_flag}
                onToggle={async (value) => {
                  const res = await API.Templates.Update(record.id, {
                    template: { active_flag: value },
                  });

                  if (res.status_code !== 200) {
                    showMessage(res.message, 'error');
                    return;
                  }

                  showMessage(value ? 'เปิดใช้งานสำเร็จ' : 'ปิดใช้งานสำเร็จ');
                }}
                disabled={isCancel}
              />
            </div>
          );
        },
      },
      {
        accessor: 'archive',
        title: 'จัดเก็บ',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 80,
        render: (record) => {
          const { status } = record;
          return status === EStatusTemplate.cancel ? (
            <div className="flex w-full justify-center">
              <button
                className="text-neutral-300 hover:cursor-not-allowed"
                disabled
                type="button"
                onClick={() => {
                  setSelectArchive({
                    ...record,
                  });
                  modalArchive.open();
                  console.log(selectArchive);
                }}
              >
                <IconCornerUpLeft className="h-5 w-5 text-neutral-300" />
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => {
                  setSelectArchive({
                    ...record,
                  });
                  modalArchive.open();
                }}
              >
                <IconArchive className="h-5 w-5" />
              </button>
            </div>
          );
        },
      },
      // {
      //   accessor: 'index',
      //   title: '#',
      //   titleClassName: 'text-primary',
      //   cellsClassName: 'text-primary',
      //   render: (_, index) => {
      //     return index + 1 + (page - 1) * pageSize;
      //   },
      // },
      {
        accessor: 'id',
        title: 'รหัส Template',

        render: (record) => (
          <button
            type="button"
            onClick={() => {
              if (record.status === EStatusTemplate.draft) {
                navigate({ to: `/grade-system/template/edit/${record.id}` });
              } else {
                navigate({ to: `/grade-system/template/info/${record.id}` });
              }
            }}
            className="cursor-pointer text-blue-600 underline hover:text-blue-800"
          >
            {record.id}
          </button>
        ),
      },

      {
        accessor: 'year',
        title: 'ชั้นปี',
      },
      {
        accessor: 'template_name',
        title: 'ชื่อ Template ใบประเมิน',
        render: (record) => (
          <button
            type="button"
            onClick={() => {
              if (record.status === EStatusTemplate.draft) {
                navigate({ to: `/grade-system/template/edit/${record.id}` });
              } else {
                navigate({ to: `/grade-system/template/info/${record.id}` });
              }
            }}
            className="cursor-pointer text-blue-600 underline hover:text-blue-800"
          >
            {record.template_name}
          </button>
        ),
      },

      {
        accessor: 'subject_count',
        title: 'จำนวนวิชา',
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        titleClassName: 'text-center w-min',
        cellsClassName: 'text-center w-min',
        render: ({ status }) => (
          <span
            className={`badge ${status == EStatusTemplate.published ? 'badge-outline-success' : status == EStatusTemplate.cancel ? 'badge-outline-danger' : 'badge-outline-dark'}`}
          >
            {status == EStatusTemplate.published
              ? 'เผยแพร่'
              : status == EStatusTemplate.cancel
                ? 'ยกเลิก'
                : 'แบบร่าง'}
          </span>
        ),
      },
    ];
    return columns;
  }, [filterSearch, page, pageSize]);

  const handleConfirmToggleArchive = (status: EStatusTemplate) => {
    API.Templates.Update(selectArchive.id, {
      template: { status: status, active_flag: false },
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => showMessage(error.message, 'error'))
      .finally(() => {
        fetchTemplates();
        modalArchive.close();
      });
  };

  const fetchTemplates = () => {
    setFetching(true),
      API.Templates.Gets(Number(userData.school_id), {
        page: page,
        limit: pageSize,
        ...filterSearch,
      })
        .then((res) => {
          if (res.status_code === 200) {
            setRecords(res.data);
            setTotalRecord(res._pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
        })
        .catch((err) => {
          showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
          console.error('Error fetching data:', err);
        })
        .finally(() => {
          setFetching(false);
        });
  };

  useEffect(() => {
    fetchTemplates();
  }, [page, pageSize, filterSearch]);

  return (
    <>
      <CWWhiteBox>
        <div className="col-span-6 mb-5 flex w-full items-center gap-2.5">
          <CWButton
            variant={'primary'}
            title={'เพิ่มรายงานรายปี'}
            onClick={(): void => {
              navigate({ to: `/grade-system/template/create` });
            }}
            disabled={false}
            icon={<IconPlus />}
          />

          <svg className="h-full bg-slate-300" width={2} height={38}>
            <path d="M1 0V38" stroke="#D4D4D4" />
          </svg>

          <CWInputSearch
            onClick={fetchTemplates}
            className="w-[250px]"
            placeholder="ค้นหา"
            value={filterSearch.search_text}
            onChange={(e) =>
              setFilterSearch((prev) => ({ ...prev, search_text: e.target.value }))
            }
          />
        </div>
        <div className="mb-5">
          <SelectYear
            value={filterSearch.year}
            onChange={(value: string) => {
              setFilterSearch((prev) => ({
                ...prev,
                year: value,
              }));
            }}
          />
        </div>

        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.value === filterSearch.status)}
          onClick={(index) =>
            setFilterSearch((prev) => ({ ...prev, status: tabsList[index].value }))
          }
        />
        {records.length > 0 ? (
          <DataTable
            className="table-hover mt-5 whitespace-nowrap"
            records={records}
            columns={columnDefs}
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
            noRecordsText="ไม่พบข้อมูล"
            totalRecords={totalRecord}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            onRecordsPerPageChange={setPageSize}
            recordsPerPageOptions={pageSizeOptions}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
            fetching={fetching}
            loaderType="oval"
            loaderBackgroundBlur={4}
          />
        ) : (
          <DataTable
            className="table-hover mt-5 whitespace-nowrap"
            records={records}
            columns={columnDefs}
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
            noRecordsText="ไม่พบข้อมูล"
            fetching={fetching}
            loaderType="oval"
            loaderBackgroundBlur={4}
          />
        )}
      </CWWhiteBox>

      <CWModalArchive
        open={modalArchive.isOpen}
        onOk={() => handleConfirmToggleArchive(EStatusTemplate.cancel)}
        onClose={() => {
          modalArchive.close();
        }}
        is_forever={true}
      />
    </>
  );
};

export default EvaluateList;
