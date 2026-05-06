import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWSchoolCard from '@component/web/cw-school-card';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWSelect from '@component/web/cw-select';
import { DataTable } from 'mantine-datatable';
import { HistoryState, Link, useNavigate, useSearch } from '@tanstack/react-router';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import APIG06D03 from '@domain/g06/g06-d03/local/api';
import { ETypeTab, IGetSheetList, TPagination } from '../local/type';
import { getUserData } from '@global/utils/store/getUserData';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import usePagination from '@global/hooks/usePagination';

const gradeSystemTabs = [
  {
    id: 'subject-scores',
    en_name: 'Subject Scores',
    th_name: 'คะแนนรายวิชา',
  },
  {
    id: 'learning-hours',
    en_name: 'Learning Hours',
    th_name: 'เวลาเรียน',
  },
  {
    id: 'desirable-characteristics',
    en_name: 'Desirable Characteristics',
    th_name: 'คุณลักษณะอันพึงประสงค์',
  },
  {
    id: 'competencies',
    en_name: 'Competencies',
    th_name: 'สมรรถนะ',
  },
  {
    id: 'student-activities',
    en_name: 'Student Activities',
    th_name: 'กิจกรรมพัฒนาผู้เรียน',
  },
  {
    id: 'nutrition',
    en_name: 'Nutrition',
    th_name: 'ภาวะโภชนาการ',
  },
];

const statusTab = {
  [0]: 'all',
  [1]: 'draft',
  [2]: 'enabled',
  [3]: 'sent',
  [4]: 'approve',
  [5]: 'disabled',
};

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const { tab: urlTab }: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate({
    from: '/grade-system/data-entry',
  });
  const userData = getUserData();

  const schoolID: number = Number(userData.school_id);

  const [seedYearList, setSeedYearList] = useState<string[]>([]);
  const [selectSeedYear, setSelectSeedYear] = useState<string>('');
  const [academicYearList, setAcademicYearList] = useState<number[]>([]);
  const [selectAcademicYear, setSelectAcademicYear] = useState<number>(0);
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [selectSubject, setSelectSubject] = useState<string>('');
  const [classList, setClassList] = useState<string[]>([]);
  const [selectClass, setSelectClass] = useState<string>('');

  const [selectedTab, setSelectedTab] = useState<number>(() => {
    const tabIndex = gradeSystemTabs.findIndex((tab) => tab.id === urlTab);
    return tabIndex !== -1 ? tabIndex : 0;
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [sheetList, setSheetlist] = useState<IGetSheetList[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [selectStatusTab, setSelectStatusTab] = useState<number>(0);

  const updateUrlParams = (tabIndex: number) => {
    navigate({
      search: {
        tab: gradeSystemTabs[tabIndex].id,
      },
    });
  };

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    updateUrlParams(index);
  };

  const fetchSeedYearList = () => {
    APIG06D03.dropdown.GetSeedYearList().then((res) => {
      if (res.status_code === 200) {
        setSeedYearList(res.data);
      }
    });
  };

  const fetchSeedAcademicYears = () => {
    APIG06D03.dropdown.GetSeedAcaDemicYearList().then((res) => {
      if (res.status_code === 200) {
        setAcademicYearList(res.data);
      }
    });
  };

  const fetchSubjectList = () => {
    APIG06D03.dropdown.GetSubjectList(schoolID, selectAcademicYear).then((res) => {
      if (res.status_code === 200) {
        setSubjectList(res.data);
      }
    });
  };

  const fetchClassList = () => {
    if (!selectSeedYear) return;

    APIG06D03.dropdown
      .GetClassList(schoolID, selectSeedYear, selectAcademicYear.toString())
      .then((res) => {
        if (res.status_code === 200) {
          setClassList(res.data);
        }
      });
  };

  useEffect(() => {
    fetchClassList();
    fetchSeedAcademicYears();
    fetchSubjectList();
  }, [
    selectStatusTab,
    selectedTab,
    selectAcademicYear,
    selectSeedYear,
    selectSubject,
    selectClass,
  ]);

  useEffect(() => {
    fetchSheetList();
  }, [
    selectStatusTab,
    selectedTab,
    selectAcademicYear,
    selectSeedYear,
    selectSubject,
    selectClass,
    pagination.page,
    pagination.limit,
  ]);

  const fetchSheetList = () => {
    const currentTab = gradeSystemTabs[selectedTab];
    const thaiTab = currentTab.th_name as ETypeTab;

    setLoading(true);
    APIG06D03.sheet
      .GetSheetList(
        schoolID,
        thaiTab,
        selectStatusTab === 0
          ? undefined
          : statusTab[selectStatusTab as keyof typeof statusTab],
        selectAcademicYear,
        selectSeedYear,
        selectClass,
        selectSubject,
        pagination.page,
        pagination.limit,
      )
      .then((res) => {
        if (res.status_code === 200) {
          setSheetlist(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res?._pagination?.total_count || res?.data?.length,
          }));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (urlTab) {
      const tabIndex = gradeSystemTabs.findIndex((tab) => tab.id === urlTab);
      if (tabIndex !== -1 && tabIndex !== selectedTab) {
        setSelectedTab(tabIndex);
      }
    } else {
      setSelectedTab(0);
      navigate({
        search: { tab: gradeSystemTabs[0].id },
      });
    }
  }, [urlTab]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [
    selectStatusTab,
    selectedTab,
    selectAcademicYear,
    selectSeedYear,
    selectSubject,
    selectClass,
  ]);

  useEffect(() => {
    fetchSeedYearList();
  }, []);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        links={[
          {
            href: '/',
            label: 'การเรียนการสอน',
            disabled: true,
          },
          {
            href: '/',
            label: 'ระบบตัดเกรด (ปพ.)',
            disabled: true,
          },
          {
            href: '/grade-system/data-entry',
            label: 'ใบตัดเกรดของฉัน',
          },
        ]}
      />

      <CWSchoolCard
        code="0000001"
        name="โรงเรียนเกษม"
        subCode="xxx"
        image="/public/logo192.png"
        className="my-5"
      />

      <h2 className="my-5 text-xl font-bold">ใบประเมิน</h2>

      <CWMTabs
        items={gradeSystemTabs.map((tab) => tab.th_name)}
        currentIndex={selectedTab}
        onClick={handleTabChange}
      />

      <div className="my-3 grid grid-cols-6 gap-2">
        <CWSelect
          title="ปีการศึกษา"
          className="col-span-1 min-w-[180px]"
          value={selectAcademicYear}
          onChange={(e) => {
            setSelectAcademicYear(e.target.value);
            setSelectSubject('');
            setSelectSeedYear('');
            setSelectClass('');
          }}
          options={academicYearList.map((item) => ({
            label: item.toString(),
            value: item.toString(),
          }))}
        />
        <CWSelect
          title="วิชา"
          className="col-span-1 min-w-[180px]"
          value={selectSubject}
          onChange={(e) => {
            setSelectSubject(e.target.value);
            setSelectSeedYear('');
            setSelectClass('');
          }}
          options={subjectList.map((item) => ({
            label: item,
            value: item,
          }))}
          disabled={!selectAcademicYear}
        />
        <CWSelect
          title="ชั้นปี"
          className="col-span-1 min-w-[180px]"
          value={selectSeedYear}
          onChange={(e) => {
            setSelectSeedYear(e.target.value);
            setSelectClass('');
          }}
          options={seedYearList.map((item) => ({
            label: item,
            value: item,
          }))}
          disabled={!selectSubject}
        />
        <CWSelect
          title="ห้อง"
          className="col-span-1 min-w-[180px]"
          value={selectClass}
          onChange={(e) => setSelectClass(e.target.value)}
          options={classList.map((item) => ({
            label: item,
            value: item,
          }))}
          disabled={!selectSeedYear}
        />
      </div>

      <CWMTabs
        items={[
          'ทั้งหมด',
          'แบบร่าง',
          'ใช้งาน',
          'ส่งข้อมูลแล้ว',
          'ออกรายงานแล้ว',
          'ไม่ใช้งาน',
        ]}
        currentIndex={selectStatusTab}
        onClick={(index) => setSelectStatusTab(index)}
      />

      <div className="mt-5 w-full">
        {!loading && sheetList.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <p className="text-base font-semibold">ไม่มีข้อมูลใบประเมิน</p>
            <p className="text-sm">กรุณาเลือกเงื่อนไขอื่น หรือสร้างใบประเมินใหม่</p>
            <div className="mt-4">
              <Link
                to="/your-create-evaluation-form-url"
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <IconPencil />
                สร้างใบประเมิน
              </Link>
            </div>
          </div>
        ) : (
          <DataTable
            className="table-hover whitespace-nowrap"
            minHeight={200}
            records={sheetList}
            columns={[
              {
                accessor: 'view',
                title: 'ดู',
                titleClassName: 'text-center px-1 py-0.5',
                cellsClassName: 'text-center px-1 py-0.5',

                render: (record) => (
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      to={`./${record.id}`}
                      state={
                        {
                          fromTab: gradeSystemTabs[selectedTab].id,
                        } as unknown as HistoryState
                      }
                    >
                      <IconEye />
                    </Link>
                  </div>
                ),
              },
              // {
              //   accessor: 'index',
              //   render: (record, index) => (
              //     <div className="flex items-center gap-1">
              //       <span className="text-blue-500">{index + 1}</span>
              //     </div>
              //   ),
              //   title: <span className="text-blue-500">#</span>,
              // },
              {
                accessor: 'id',
                title: 'รหัสใบประเมิน',
              },
              {
                accessor: 'academic_year',
                title: 'ปีการศึกษา',
              },
              {
                accessor: selectedTab === 0 ? 'subject_name' : 'general_name',
                title: selectedTab === 0 ? 'ชื่อวิชา' : 'คุณลักษณะ',
                render: (record) => (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`./${record.id}`}
                      state={
                        {
                          fromTab: gradeSystemTabs[selectedTab].id,
                        } as unknown as HistoryState
                      }
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <span>
                        {selectedTab === 0 ? record.subject_name : record.general_name}
                      </span>
                    </Link>
                  </div>
                ),
              },

              {
                accessor: 'year',
                title: 'ชั้นปี',
              },
              {
                accessor: 'school_room',
                title: 'ห้อง',
              },
              {
                accessor: 'status',
                render: ({ status }) => {
                  if (status === 'approve')
                    return (
                      <span className="badge badge-outline-info">ออกรายงานแล้ว</span>
                    );
                  else if (status === 'enabled')
                    return <span className="badge badge-outline-success">ใช้งาน</span>;
                  else if (status === 'disabled')
                    return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
                  else if (status === 'draft')
                    return <span className="badge badge-outline-dark">แบบร่าง</span>;
                  else if (status === 'sent')
                    return (
                      <span className="badge badge-outline-warning">ส่งข้อมูลแล้ว</span>
                    );
                },
                title: 'สถานะ',
              },
            ]}
            totalRecords={pagination.total_count}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(page) => {
              setPagination((prev) => ({
                ...prev,
                page,
              }));
            }}
            onRecordsPerPageChange={(limit: number) => {
              setPagination((prev) => ({
                ...prev,
                limit,
                page: 1,
              }));
            }}
            recordsPerPageOptions={pageSizeOptions}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
            fetching={loading}
          />
        )}
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;
