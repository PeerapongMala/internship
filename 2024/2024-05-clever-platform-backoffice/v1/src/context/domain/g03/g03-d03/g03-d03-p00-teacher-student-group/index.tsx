// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';

import CWSelect from '@component/web/cw-select';
import CWSchoolCard from '@component/web/cw-school-card';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWTabStatusStudentGroup from './component/web/template/cw-tab-status-studentgroup'; //'./components/web/template/cw-tab-status-studentgroup';
import API from '../local/api';
import { SchoolHeader, StudentGroup } from '../local/type';
import showMessage from '@global/utils/showMessage';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import CWInput from '@component/web/cw-input';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import { getClassData } from '@global/utils/store/get-class-data';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);
  if (!userData) {
    navigate({ to: `/` });
  }
  const schoolId = userData?.school_id ?? targetData?.school_id;
  const subjectData = getUserSubjectData();
  const [school, setSchool] = useState<SchoolHeader>();
  const [records, setRecords] = useState<StudentGroup[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<StudentGroup[]>([]);
  const [filters, setFilters] = useState<
    Partial<{
      study_group_name: string;
    }>
  >({});
  const classDataFilter = getClassData();
  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();
  const [fetching, setFetching] = useState(false);
  const [reload, setReload] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const classData = getClassData();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...classData }));
  }, [classData]);

  function onBulkEdit(status: 'enabled' | 'disabled', records: StudentGroup[]) {
    API.studentGroup
      .BulkEdit(
        records.map((record) => ({
          id: +record.id,
          status,
        })),
      )
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setReload((prev) => !prev);
          setSelectedRecords([]);
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onArchive(status: 'enabled' | 'disabled', record: StudentGroup) {
    onBulkEdit(status, [record]);
  }

  useEffect(() => {
    if (!schoolId) return;
    setFetching(true);
    API.studentGroup
      .Get(+schoolId, {
        study_group_name: filters.study_group_name,
        ...classDataFilter,
        status: 'enabled',
        page: page,
        limit: limit,
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
  }, [schoolId, filters, statusTabIndex, reload, page, limit, classDataFilter]);

  const statuses = [
    {
      value: '',
      label: 'ทั้งหมด',
    },
    {
      value: 'enabled',
      label: 'ใช้งาน',
    },
    {
      value: 'disabled',
      label: 'ไม่ใช้งาน',
    },
    {
      value: 'draft',
      label: 'แบบร่าง',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'การเรียนการสอน',
            href: '/',
            disabled: true,
          },
          {
            label: 'กลุ่มเรียน',
          },
        ]}
      />

      <CWSchoolCard
        name={school?.school_name || '-'}
        code={school?.school_id.toString() || '-'}
        subCode={school?.school_code || '-'}
        image={school?.shool_image_url || '-'}
      />

      <div>
        <h1 className="text-2xl font-bold">
          <div>
            <h1 className="text-2xl font-bold">
              <div>
                <h1 className="text-2xl font-bold">กลุ่มเรียนทั้งหมด</h1>
              </div>
            </h1>
          </div>
        </h1>
        <h2 className="">{totalRecords} กลุ่ม</h2>
      </div>

      <div className="panel flex flex-col gap-5">
        <div className="mb-5 flex justify-between">
          <div className="flex">
            {/* <div className="dropdown">
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
                        จัดเก็บ
                      </div>
                    ),
                    onClick: () => {
                      onBulkEdit('disabled', selectedRecords);
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
                      onBulkEdit('enabled', selectedRecords);
                    },
                  },
                ]}
              ></CWMDropdown>
            </div> */}
            <div>
              <CWButton
                variant={'primary'}
                title={'เพิ่มกลุ่มเรียน'}
                onClick={() => {
                  navigate({ to: `./create` });
                }}
                icon={<IconPlus />}
              />
            </div>

            <span className="ml-2 mr-2 h-full !w-px bg-neutral-300" />

            <div className="w-fit">
              <CWInputSearch
                placeholder="ค้นหา"
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setFilters((prev) => ({
                    ...prev,
                    study_group_name: value,
                  }));
                  setPage(1);
                }}
              />
            </div>
          </div>
          <div className="flex h-fit gap-2.5"></div>
        </div>
        <div className="grid w-full gap-2 xl:grid-cols-4">
          <CWClassSelector classes={classDataFilter} />

          {/* <CWSelect
            className="min-w-48"
            title="ปีการศึกษา"
            options={academicYears.map((year) => {
              const currentYear = new Date().getUTCFullYear();
              let label = year.toString();
              if (currentYear == year) label = `ข้อมูลปัจจุบัน (${year})`;
              return {
                label,
                value: year.toString(),
              };
            })}
            value={filters.academicYear}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setFilters((prev) => ({
                ...prev,
                academicYear: value,
              }));
              setPage(1);
            }}
          /> */}

          <CWInput value={subjectData.name} readOnly disabled />
        </div>
        {/* <CWMTabs
          currentIndex={statusTabIndex}
          onClick={(value) => {
            setStatusTabIndex(value);
            setPage(1);
          }}
          items={statuses.slice(0, 3).map((status) => status.label)}
        /> */}
        <CWTabStatusStudentGroup
          fetching={fetching}
          records={records}
          limit={limit}
          page={page}
          selectedRecords={selectedRecords}
          setLimit={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          setPage={setPage}
          setSelectedRecords={setSelectedRecords}
          totalRecords={totalRecords}
          onEnabled={(record) => {
            onArchive('enabled', record);
          }}
          onDisabled={(record) => {
            onArchive('disabled', record);
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
