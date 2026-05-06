import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useRef, useState } from 'react';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import { useNavigate } from '@tanstack/react-router';
import CellProgressbar from '../local/component/web/molecule/wc-m-cell-progressbar';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import {
  AffiliationTabsOption,
  SchoolStatFilter,
} from '@domain/g01/g01-d01/local/api/group/school-stat/type';
import SelectInspectArea from './components/web/molecule/cw-m-select-inspect-area';
import SelectInspectAreaOffice from './components/web/molecule/cw-m-select-inspect-area-office';
import SchoolStatRootTemplate from '../local/component/web/template/wc-t-school-stat-root';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from 'dayjs';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import SelectDistrictGroup from '@domain/g01/g01-d09/g01-d09-a01-permission-info/component/web/molecule/cw-m-select-district-group';
import SelectDistrict from '@domain/g01/g01-d09/g01-d09-a01-permission-info/component/web/molecule/cw-m-select-district';
import CWSelect from '@component/web/cw-select';
import {
  useProvinceLocation,
  useDistrictLocationByName,
} from '@global/utils/geolocation';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

const SchoolStat = () => {
  const navigate = useNavigate();
  const { startDate, endDate, setStartDate, setEndDate } = useSchoolStatDateRangeStore();

  const affiliationTabs: AffiliationTabsOption[] = [
    {
      id: 'obec',
      label: 'สพฐ',
      onClick: () =>
        setFilter((prev) => ({
          ...prev,
          school_affiliation_group: 'สพฐ',
          district_group: undefined,
          district_zone: undefined,
          district: undefined,
          province: undefined,
          lao_district: undefined,
        })),
    },
    {
      id: 'doe',
      label: 'สนศ. กทม.',
      onClick: () =>
        setFilter((prev) => ({
          ...prev,
          school_affiliation_group: 'สนศ. กทม.',
          area_office: undefined,
          inspection_area: undefined,
          district_group: undefined,
          province: undefined,
          lao_district: undefined,
        })),
    },
    {
      id: 'lao',
      label: 'อปท.',
      onClick: () =>
        setFilter((prev) => ({
          ...prev,
          school_affiliation_group: 'อปท',
          province: undefined,
          lao_district: undefined,
        })),
    },
    {
      id: 'opec',
      label: 'สช.',
      onClick: () =>
        setFilter((prev) => ({
          ...prev,
          school_affiliation_group: 'สช',
        })),
    },
    {
      id: 'other',
      label: 'อื่นๆ',
      onClick: () =>
        setFilter((prev) => ({
          ...prev,
          school_affiliation_group: 'อื่นๆ',
        })),
    },
  ];

  const filterableFields = [
    {
      label: 'ID',
      value: 'school_id',
    },
    {
      label: 'รหัสย่อโรงเรียน',
      value: 'school_code',
    },
    {
      label: 'ชื่อโรงเรียน',
      value: 'school_name',
    },
  ];

  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(false);

  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<SchoolStatFilter>({
    school_affiliation_group: affiliationTabs[0].label,
    inspection_area: undefined,
    area_office: undefined,
    start_date: startDate,
    end_date: endDate,
    search_value: '',
    search_field: filterableFields[0].value,
    district_group: undefined,
    district: undefined,
    province: undefined,
    lao_district: undefined,
  });
  const prevFilter = useRef(filter).current;

  const provinces = useProvinceLocation({});
  const districts = useDistrictLocationByName({
    provinceNameTH: filter.province,
  });

  const fetchSchoolTable = async (abortController?: AbortController) => {
    try {
      setFetching(true);
      const res = await API.SchoolStat.GetSchoolTable(
        {
          page: pagination.page,
          limit: pagination.limit,
          inspection_area: filter.inspection_area,
          area_office: filter.area_office,
          school_affiliation_group: filter.school_affiliation_group,
          start_date: startDate,
          end_date: endDate,
          district_group: filter.district_group,
          district: filter.district,
          province: filter.province,
          lao_district: filter.lao_district,
          ...toSearchKey(filter),
        },
        { signal: abortController?.signal },
      );
      if (res.status_code === 200) {
        const reports = res.data;
        setRecords(reports);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      if (error instanceof Error && error.name == 'AbortError') {
        return;
      }
      showMessage(`Failed to fetch: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  };

  const downloadCSVSchoolTable = async (): Promise<void> => {
    try {
      await API.SchoolStat.DownloadSchoolCSV({
        start_date: startDate,
        end_date: endDate,
      });
      showMessage('ดาวน์โหลด CSV สำเร็จ');
    } catch (error) {
      showMessage(`การดาวน์โหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const toSearchKey = (filter: SchoolStatFilter) => {
    const obj: {
      [key: string]: any;
    } = {};
    if (filter.search_field) {
      obj[filter.search_field] = filter.search_value;
    }
    return obj;
  };

  const rowColumns: DataTableColumn<any>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: 'seeBtn',
      width: 80,
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render: ({ school_id }) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/report/school-stat/school/${school_id}`,
            });
          }}
        >
          <IconEye />
        </button>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      title: 'รหัสโรงเรียน',
      accessor: 'school_id',
    },
    {
      title: 'รหัสย่อโรงเรียน',
      accessor: 'school_code',
    },
    {
      title: 'ชื่อโรงเรียน',
      accessor: 'school_name',
    },
    {
      title: 'จำนวนห้องเรียน', //
      accessor: 'class_count',
    },
    {
      title: 'จำนวนนักเรียน', //
      accessor: 'student_count',
    },
    {
      title: 'ด่านที่ผ่าน', //
      accessor: 'stage_pass_avg',
      cellsClassName: 'text-right',
      render: ({ average_passed_level, total_levels_count }) => (
        <p>{average_passed_level ? parseFloat(average_passed_level.toFixed(2)) : 0}</p>
      ),
    },
    {
      title: 'คะแนนรวม', //
      accessor: 'average_score',
      cellsClassName: 'text-right',
      render: ({ average_score, total_score }) => (
        <p>{average_score ? parseFloat(average_score.toFixed(2)) : 0}</p>
      ),
    },

    {
      title: 'ทำข้อสอบเฉลี่ย (ครั้ง)', //
      accessor: 'play_count',
      render: ({ play_count }) =>
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(play_count),
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ', //
      accessor: 'average_time_used',
      render: ({ average_time_used }) => formatTimeString(average_time_used),
    },
  ];

  useEffect(() => {
    const controller = new AbortController();
    fetchSchoolTable(controller);

    return () => {
      controller.abort();
    };
  }, [
    pagination.limit,
    pagination.page,
    filter.school_affiliation_group,
    filter.inspection_area,
    filter.district_group,
    filter.area_office,
    filter.province,
    filter.district,
    filter.lao_district,
    startDate,
    endDate,
  ]);
  useEffect(() => {
    const controller = new AbortController();

    if (prevFilter.search_value != '' || filter.search_value != '') {
      fetchSchoolTable(controller);
    }
    return () => {
      controller.abort();
      prevFilter.search_value = filter.search_value;
    };
  }, [filter.search_field, filter.search_value]);

  return (
    <SchoolStatRootTemplate showBackButton={false}>
      <div className="flex w-fit flex-col gap-3">
        <WCAInputDateFlat
          options={{
            mode: 'range',
            dateFormat: 'd/m/Y',
          }}
          onChange={(date) => {
            setStartDate(dayjs(date[0]).startOf('day').toISOString());
            setEndDate(dayjs(date[1]).endOf('day').toISOString());
          }}
          //value={[startDate, endDate]}
        />
        <CWSwitchTabs tabs={affiliationTabs} />
      </div>

      <div className="panel mt-4 flex flex-col gap-5">
        <div className="flex flex-1 justify-between">
          <WCAInputDropdown
            inputPlaceholder={'ค้นหา'}
            onInputChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                search_value: event.target.value,
              }))
            }
            dropdownPlaceholder={filterableFields[0].label}
            onDropdownSelect={(selected) =>
              setFilter((prev) => ({
                ...prev,
                search_field: selected,
              }))
            }
            inputValue={filter.search_value}
            dropdownOptions={filterableFields}
            disabled={false}
          />
          <CWButton
            className="gap-2 !px-3 !font-bold"
            onClick={() => downloadCSVSchoolTable()}
            icon={<IconDownload />}
            title="Download"
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {/* สพฐ. */}
          {filter.school_affiliation_group == 'สพฐ' && (
            <>
              <SelectInspectArea
                value={filter.inspection_area}
                onChange={(inspectArea) =>
                  setFilter((prev) => ({
                    ...prev,
                    inspection_area: inspectArea,
                    area_office: undefined,
                  }))
                }
              />

              <SelectInspectAreaOffice
                value={filter.area_office}
                inspectArea={filter.inspection_area}
                onChange={(inspectAreaOffice) =>
                  setFilter((prev) => ({
                    ...prev,
                    area_office: inspectAreaOffice,
                  }))
                }
                disabled={!filter.inspection_area}
              />
            </>
          )}
          {/* สนศ. กทม. */}
          {filter.school_affiliation_group == 'สนศ. กทม.' && (
            <>
              <SelectDistrictGroup
                value={filter.district_group}
                onChange={(districtGroup) =>
                  setFilter((prev) => ({
                    ...prev,
                    district_group: districtGroup,
                    district: undefined,
                  }))
                }
              />
              <SelectDistrict
                value={filter.district}
                districtGroup={filter.district_group}
                onChange={(district) =>
                  setFilter((prev) => ({
                    ...prev,
                    district: district,
                  }))
                }
                disabled={!filter.district_group}
              />
            </>
          )}
          {/* อปท. */}
          {filter.school_affiliation_group == 'อปท' && (
            <>
              <CWSelect
                title="จังหวัด"
                options={provinces.map((d) => ({
                  label: d.provinceNameTh,
                  value: d.provinceNameTh,
                }))}
                value={filter.province}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    province: e.target.value,
                    lao_district: undefined,
                  }))
                }
              />
              <CWSelect
                title="อำเภอ"
                options={districts.map((d) => ({
                  label: d.districtNameTh,
                  value: d.districtNameTh,
                }))}
                value={filter.lao_district}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    lao_district: e.target.value,
                  }))
                }
                disabled={!filter.province}
              />
            </>
          )}
        </div>

        <DataTable
          fetching={fetching}
          className="table-hover whitespace-nowrap"
          records={records}
          columns={rowColumns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height="calc(100vh - 350px)"
          noRecordsText="ไม่พบข้อมูล"
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              page,
            }));
          }}
          onRecordsPerPageChange={(recordsPerPage: number) =>
            setPagination((prev) => ({
              ...prev,
              limit: recordsPerPage,
              page: 1,
            }))
          }
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </div>
    </SchoolStatRootTemplate>
  );
};

export default SchoolStat;
