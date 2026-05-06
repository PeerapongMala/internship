import CWButton from '@component/web/cw-button';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWInputSearch from '@component/web/cw-input-search';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWWhiteBox from '@component/web/cw-white-box';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import API from '@domain/g06/g06-d01/local/api';
import { GeneralTemplatesQueryParams } from '@domain/g06/g06-d01/local/api/repository';
import { EStatusTemplate, GeneralTemplates } from '@domain/g06/g06-d01/local/api/type';
import usePagination from '@global/hooks/usePagination';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import useModal from '@global/utils/useModal';
import { useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';

const tabsList = [
  { label: 'ทั้งหมด', value: undefined },
  { label: 'แบบร่าง', value: EStatusTemplate.draft },
  { label: 'เผยแพร่', value: EStatusTemplate.published },
  { label: 'ยกเลิก', value: EStatusTemplate.cancel },
];

const GeneralEvaList: React.FC = () => {
  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();
  const userData = getUserData();
  const modalArchive = useModal();
  const navigate = useNavigate();

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<GeneralTemplates[]>([]);
  const [filterSearch, setFilterSearch] = useState<GeneralTemplatesQueryParams>({
    search_text: undefined,
    status: undefined,
  });

  const [selectArchive, setSelectArchive] = useState<
    Pick<GeneralTemplates, 'id' | 'status' | 'template_name'>
  >({
    id: 0,
    status: EStatusTemplate.published,
    template_name: '',
  });

  const columnDefs = useMemo<DataTableColumn<GeneralTemplates>[]>(() => {
    const columns: DataTableColumn<GeneralTemplates>[] = [
      {
        accessor: 'view',
        title: 'ดู',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 60,
        render: (record: any, index: number) => (
          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => {
                navigate({ to: `/grade-system/template/general/edit/${record.id}` });
              }}
            >
              <IconEye className="h-5 w-5" />
            </button>
          </div>
        ),
      },
      {
        accessor: 'activate',
        title: 'เปิดใช้งาน',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 90,
        render: (record: any, index: number) => (
          <div className="flex w-full justify-center">
            <CWButtonSwitch
              initialState={record.active_flag}
              onToggle={(newState) => updateTemplateActivate(record.id, newState)}
            />
          </div>
        ),
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
                type="button"
                onClick={() => {
                  setSelectArchive({
                    ...record,
                    status: EStatusTemplate.published,
                  });
                  modalArchive.open();
                }}
              >
                <IconCornerUpLeft className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => {
                  setSelectArchive({
                    ...record,
                    status: EStatusTemplate.cancel,
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
      //   render: (records, index) => {
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
              navigate({ to: `/grade-system/template/general/edit/${record.id}` });
            }}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {record.id}
          </button>
        ),
      },
      {
        accessor: 'template_name',
        title: 'ชื่อแบบประเมินทั่วไป',
        render: (record) => (
          <button
            type="button"
            onClick={() => {
              navigate({ to: `/grade-system/template/general/edit/${record.id}` });
            }}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {record.template_name}
          </button>
        ),
      },

      {
        accessor: 'template_type',
        title: 'ประเภท',
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

  const confirmArchive = async () => {
    modalArchive.close();
    if (!selectArchive.id) {
      showMessage('โปรดเลือกไอดี', 'warning');
      return;
    }
    try {
      const res = await API.GeneralTemplates.Update(selectArchive.id as number, {
        ...selectArchive,
      });
      if (res.status_code === 200) {
        showMessage('บันทึกสำเร็จ', 'success');
        await fetchGeneralTemplates();
      } else {
        showMessage(res.message || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error: any) {
      showMessage(error.message, 'error');
    }
  };

  const fetchGeneralTemplates = () => {
    setFetching(true);
    API.GeneralTemplates.Gets(Number(userData?.school_id), {
      page: page,
      limit: pageSize,
      ...filterSearch,
    })
      .then((res) => {
        if (res.status_code == 200) {
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

  const updateTemplateActivate = async (id: number, activeFlag: boolean) => {
    try {
      const res = await API.GeneralTemplates.Update(id, {
        active_flag: activeFlag,
      });

      if (res.status_code === 200) {
        showMessage('อัปเดตสถานะสำเร็จ', 'success');
        fetchGeneralTemplates();
      } else {
        showMessage(res.message, 'error');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ:', error);
      showMessage('เกิดข้อผิดพลาด', 'error');
    }
  };

  useEffect(() => {
    fetchGeneralTemplates();
  }, [page, pageSize, filterSearch]);

  return (
    <>
      <CWWhiteBox>
        <div className="col-span-6 mb-5 flex w-full items-center gap-2.5">
          <CWButton
            variant={'primary'}
            title={'เพิ่ม'}
            onClick={(): void => {
              navigate({ to: `/grade-system/template/general/create` });
            }}
            disabled={false}
            icon={<IconPlus />}
          />

          <svg className="h-full bg-slate-300" width={2} height={38}>
            <path d="M1 0V38" stroke="#D4D4D4" />
          </svg>

          <CWInputSearch
            onClick={fetchGeneralTemplates}
            className="w-[250px]"
            placeholder="ค้นหา"
            value={filterSearch.search_text}
            onChange={(e) =>
              setFilterSearch((prev) => ({ ...prev, search_text: e.target.value }))
            }
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
        onOk={confirmArchive}
        onClose={() => {
          modalArchive.close();
        }}
      />
    </>
  );
};

export default GeneralEvaList;
