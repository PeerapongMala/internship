import { useCallback, useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useParams } from '@tanstack/react-router';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWInputSearch from '@component/web/cw-input-search';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWNeutralBox from '@component/web/cw-neutral-box';
import { toDateTimeTH } from '@global/utils/date';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g03/g03-d03/local/api';
import { StudentGroupMember } from '@domain/g03/g03-d03/local/api/group/student-group-member/type';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import { EStudentGroupErrorMsg } from '@domain/g03/g03-d03/local/api/enum/member';
import usePagination from '@global/hooks/usePagination';

const TeacherStudentGroupMember = () => {
  const { studentGroupId } = useParams({ strict: false });
  const [isFetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<StudentGroupMember[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [selectedRecords, setSelectedRecords] = useState<StudentGroupMember[]>([]);
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();

  const [filters, setFilters] = useState<
    Partial<{
      search: string;
    }>
  >({});

  const fetchDataList = useCallback(() => {
    setFetching(true);
    API.studentGroupMember
      .GetStudentGroupMember({
        page: pagination?.page,
        limit: pagination?.limit,
        student_group_id: studentGroupId,
        search: filters.search,
      })

      .then((res) => {
        if (res.status_code === 200) {
          const dataWithUniqueIds: StudentGroupMember[] = res.data.map((item, index) => ({
            ...item,
            id: item.id || new Date().getTime() + index,
          }));
          setRecords(dataWithUniqueIds);
          setPagination({
            page: res._pagination.page,
            limit: res._pagination.limit,
            total_count: res._pagination.total_count,
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          setFetching(false);
        }, 200);
      });
  }, [
    pagination?.page,
    pagination?.limit,
    pagination?.total_count,
    studentGroupId,
    filters.search,
  ]);

  useEffect(() => {
    setFetching(true);
    fetchDataList();
  }, [
    pagination?.page,
    pagination?.limit,
    pagination?.total_count,
    studentGroupId,
    filters.search,
  ]);

  useEffect(() => {
    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code == 200) {
        let data: StudentGroupInfo = res.data;
        if (Array.isArray(data)) {
          data = data[0];
        }
        setStudentGroup(data);
      }
    });
  }, []);

  const handleStatusToggle = (record: StudentGroupMember) => {
    const updatedRecords = records.filter((item) => {
      if (item.student_user_uuid === record.student_user_uuid) {
        return item;
      }
    });

    const params = {
      student_group_id: studentGroupId,
      bulk_edit_list: [
        {
          student_user_uuid: updatedRecords[0].student_user_uuid,
          is_member: !updatedRecords[0].is_member,
        },
      ],
    };
    API.studentGroupMember
      .UpdateStudentGroupMember(params)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('แก้ไขสมาชิกสำเร็จ', 'success');
          // navigate({ to: '/teacher/student-group' });
          fetchDataList();
        } else if (
          res.status_code == 409 &&
          res.message == EStudentGroupErrorMsg.ERR_G03_D03_02_1
        ) {
          // This prevent concurrency conflict
          showMessage('นักเรียนคนนี้เป็นสมาชิกของกลุ่มอื่นอยู่แล้ว', 'warning');
          fetchDataList();
        } else {
          showMessage('แก้ไขสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch(() => {
        showMessage('แก้ไขสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  };

  const onBulkEdit = useCallback(
    async (status: 'enabled' | 'disabled') => {
      if (selectedRecords.length === 0) {
        showMessage(`No records selected for bulk edit `, 'error');
        return Promise.reject(new Error('No records selected'));
      }

      const params = {
        student_group_id: studentGroupId,
        bulk_edit_list: selectedRecords.map((record) => ({
          student_user_uuid: record.student_user_uuid,
          is_member: status === 'enabled',
        })),
      };

      API.studentGroupMember
        .UpdateStudentGroupMember(params)
        .then((res) => {
          if (res.status_code === 200) {
            setSelectedRecords([]);
            showMessage('แก้ไขสมาชิกสำเร็จ', 'success');
            setFetching(true);
            fetchDataList();
          } else if (
            res.status_code == 409 &&
            res.message == EStudentGroupErrorMsg.ERR_G03_D03_02_1
          ) {
            // This prevent concurrency conflict
            showMessage('นักเรียนคนนี้เป็นสมาชิกของกลุ่มอื่นอยู่แล้ว', 'warning');
            fetchDataList();
          } else {
            showMessage('แก้ไขสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch(() => {
          showMessage('แก้ไขสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        });
    },
    [selectedRecords],
  );

  const rowColumns: DataTableColumn<StudentGroupMember>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_, index) => index + 1,
    },
    // {
    //   title: 'ปีการศึกษา',
    //   accessor: 'academic_year',
    // },
    // {
    //   title: 'ชั้นปี',
    //   accessor: 'year',
    // },
    // {
    //   title: 'ห้อง',
    //   accessor: 'room',
    // },
    {
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
    },
    {
      title: 'คำนำหน้า',
      accessor: 'title',
      render: ({ title }) => {
        return title ? title : '-';
      },
    },
    {
      title: 'ชื่อ',
      accessor: 'first_name',
      render: ({ first_name }) => {
        return first_name ? first_name : '-';
      },
    },
    {
      title: 'สกุล',
      accessor: 'last_name',
      render: ({ last_name }) => {
        return last_name ? last_name : '-';
      },
    },

    {
      title: 'ใช้งานล่าสุด',
      accessor: 'latest_login_at',
      width: 150,
      render: ({ latest_login_at }) => {
        return latest_login_at ? toDateTimeTH(latest_login_at) : '-';
      },
    },

    {
      title: 'กลุ่มเรียน',
      accessor: 'study_groups',
      render: (record) =>
        record.study_groups?.length > 0
          ? record.study_groups.map((sg) => sg.name).join(', ')
          : '-',
    },

    {
      title: 'เป็นสมาชิก',
      accessor: 'status',

      render: (record) => (
        <CWButtonSwitch
          // disable when this student is in other group
          // first is check to not disable when student in current group
          disabled={shouldDisableAddMember(record)}
          initialState={record.is_member}
          onToggle={() => handleStatusToggle(record)}
        />
      ),
    },
  ];

  const shouldDisableAddMember = (record: StudentGroupMember): boolean => {
    return !record.is_member && record.study_groups?.length > 0;
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <CWNeutralBox>
          <h1 className="text-2xl font-bold">
            <div>
              <h1 className="text-2xl font-bold">
                <div>
                  <h1 className="text-2xl font-bold">{studentGroup?.name}</h1>
                </div>
              </h1>
            </div>
          </h1>
          <h2>
            {`ปีการศึกษา: ${studentGroup?.class_academic_year} / ${studentGroup?.subject_name} / ${studentGroup?.class_year} / ห้อง ${studentGroup?.class_name}`}
          </h2>
        </CWNeutralBox>
        <div className="bg-white p-5 shadow-sm">
          <div className="mb-5 flex justify-between">
            <div className="flex">
              <div className="dropdown">
                <CWMDropdown
                  className="btn btn-primary dropdown-toggle gap-1"
                  label={
                    <>
                      Bulk Edit
                      <IconCaretDown />
                    </>
                  }
                  disabled={!selectedRecords.length}
                  items={[
                    {
                      label: (
                        <div className="flex gap-3">
                          <IconArchive />
                          ปิดใช้งาน
                        </div>
                      ),
                      onClick: () => {
                        onBulkEdit('disabled');
                      },
                    },
                    {
                      label: (
                        <div className="flex gap-3">
                          <IconArrowBackward duotone={false} />
                          เปิดใช้งาน
                        </div>
                      ),
                      onClick: () => {
                        onBulkEdit('enabled');
                      },
                    },
                  ]}
                ></CWMDropdown>
              </div>
              <span className="ml-2 mr-2 h-full !w-px bg-neutral-300" />
              <div className="w-fit">
                <CWInputSearch
                  placeholder="ค้นหา"
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                  }}
                  value={filters.search}
                  onClick={() => fetchDataList()}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="datatables">
              <DataTable
                striped
                className="table-hover whitespace-nowrap"
                records={records}
                columns={rowColumns}
                idAccessor="id"
                getRecordSelectionCheckboxProps={(record) =>
                  shouldDisableAddMember(record)
                    ? {
                        className: 'bg-neutral-100',
                      }
                    : {}
                }
                isRecordSelectable={(record) => !shouldDisableAddMember(record)}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                highlightOnHover
                withTableBorder
                withColumnBorders
                height={'calc(100vh - 350px)'}
                fetching={isFetching}
                noRecordsText={
                  !isFetching && records.length === 0 ? 'ไม่พบข้อมูล' : undefined
                }
                totalRecords={records.length > 0 ? pagination.total_count : 0}
                recordsPerPage={pagination.limit}
                page={pagination.page}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                onRecordsPerPageChange={(limit) =>
                  setPagination({
                    page: 1,
                    limit,
                    total_count: pagination.total_count,
                  })
                }
                recordsPerPageOptions={pageSizeOptions}
                paginationText={
                  records.length > 0
                    ? ({ from, to, totalRecords }) => {
                        const currentPage = Math.ceil(from / pagination.limit);
                        const totalPage = Math.ceil(totalRecords / pagination.limit);
                        return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherStudentGroupMember;
