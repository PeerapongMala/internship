import CWWhiteBox from '@global/component/web/cw-white-box';
import ProgressSelectTemplate from '../../../organism/cw-o-select-with-data';
import BarChartTemplate from '../../../organism/cw-o-bar-chart';
import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import API from '@domain/g01/g01-d01/local/api';
import { ChildDataType } from '@domain/g01/g01-d01/g01-d01-p01-report-progress-dashboard';
import ProgressSelectorGroup from '../../../organism/ProgressSelectorGroup';
import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import ReportSchoolYear from '../../../organism/cw-o-report-school-year';
// Import the store and hash generator again
import { useLoadingApiStore } from '@store/useLoadingApiStore';
import { generateUniqueHash } from '@global/utils/hash';
import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';
import { useQueries } from '@tanstack/react-query';

export const CHART_ID_PREFIX = 'T_PROGRESS_BARCHART';
export interface ExportProgressDataType {
  title: string;
  chartID: string;
  imgURI?: string;
  progress?: number;
}

type Option = {
  key: string;
  scope: string[];
  scopeName: string[];
  value: string;
  label: string;
};

type FilterOption = {
  id: string;
  name: string;
};

export type ProgressData = {
  labels: string[];
  barData: number[];
  averageProgress: number;
  filterOptions: FilterOption[];
};

type ReportTypeOption = {
  key: string;
  value: string;
  label: string;
  scope: string;
};

type ProgressTemplateProps = {
  reportType?: string;
  startDate: string;
  endDate: string;
  setChildData: Dispatch<SetStateAction<ChildDataType>>;
  setSelectedProgressScope: Dispatch<SetStateAction<any>>;
  reportTypeOptions: ReportTypeOption[];
  selectedReportType: ReportTypeOption;
  onReportTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDownloadPdf: () => void;
  onSelectSchool?: (name: string) => void;
  onFetchSuccess?: () => void;
};

const ProgressTemplate = ({
  reportType,
  startDate,
  endDate,
  setChildData,
  setSelectedProgressScope,
  reportTypeOptions,
  selectedReportType,
  onReportTypeChange,
  onDownloadPdf,
  onSelectSchool,
  onFetchSuccess,
}: ProgressTemplateProps) => {
  const loadingApiStore = useLoadingApiStore();

  const options: Option[] = useMemo(
    () => [
      // ... same options data
      {
        key: 'obec',
        scope: ['inspection-area', 'area-office', 'school', 'year'],
        scopeName: [
          'เขตตรวจราชการ',
          'สํานักงานเขตพื้นที่การศึกษา',
          'โรงเรียน',
          'ระดับชั้น',
        ],
        value: 'สพฐ.',
        label: 'สพฐ.',
      },
      {
        key: 'doe',
        scope: ['district-zone', 'district', 'doe-school', 'year'],
        scopeName: ['กลุ่มเขต', 'เขต', 'โรงเรียน', 'ระดับชั้น'],
        value: 'สนศ. กทม.',
        label: 'สนศ. กทม.',
      },
      {
        key: 'lao',
        scope: ['province', 'lao-school', 'year'],
        scopeName: ['จังหวัด', 'โรงเรียน', 'ระดับชั้น'],
        value: 'อปท.',
        label: 'อปท.',
      },
      {
        key: 'opec',
        scope: ['opec-school', 'year'],
        scopeName: ['โรงเรียน', 'ระดับชั้น'],
        value: 'สช.',
        label: 'สช.',
      },
      {
        key: 'etc',
        scope: ['etc-school', 'year'],
        scopeName: ['โรงเรียน', 'ระดับชั้น'],
        value: 'อื่นๆ',
        label: 'อื่นๆ',
      },
    ],
    [],
  );

  const selectedOption = options.find((option) => option.key === reportType);

  const scopeList = useMemo(() => {
    if (selectedOption?.key === 'opec') {
      return selectedOption.scope;
    }
    return selectedOption?.scope.filter((s) => s !== 'year') || [];
  }, [selectedOption]);

  const scopeNameList = useMemo(() => {
    if (selectedOption?.key === 'opec') {
      return selectedOption.scopeName;
    }
    return (
      selectedOption?.scopeName.filter((_, i) => selectedOption.scope[i] !== 'year') || []
    );
  }, [selectedOption]);

  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array(scopeList.length).fill(''),
  );

  useEffect(() => {
    setSelectedValues(Array(scopeList.length).fill(''));
  }, [scopeList.length]);

  const queryResults = useQueries({
    queries: scopeList.map((scope, index) => {
      const parentScopeValue = index > 0 ? selectedValues[index - 1] : undefined;
      return {
        queryKey: [
          'ProgressTable.GetListProgressTable',
          reportType,
          scope,
          parentScopeValue,
          startDate,
          endDate,
        ],
        queryFn: async (): Promise<ProgressData> => {
          const fetchID = generateUniqueHash();
          try {
            // Add to the global loading store before the request
            loadingApiStore.addLoading(fetchID);
            const queryParams: Record<string, string> = {
              scope,
              report_type: reportType ?? '',
              start_date: startDate,
              end_date: endDate,
            };
            if (parentScopeValue) {
              queryParams.parent_scope = parentScopeValue;
            }
            const res = await API.ProgressTable.GetListProgressTable(queryParams);
            if (res?.status_code === 200 && res.data?.[0]) {
              const { average_progress, progress_reports } = res.data[0];
              onFetchSuccess?.();
              return {
                labels: progress_reports.map((r: any) => r.scope),
                barData: progress_reports.map((r: any) => r.progress),
                averageProgress: average_progress,
                filterOptions: progress_reports.map((r: any) => ({
                  id: r.scope,
                  name: r.scope,
                })),
              };
            }
            return { labels: [], barData: [], averageProgress: 0, filterOptions: [] };
          } finally {
            // Always remove from the global store after the request is finished
            loadingApiStore.removeLoading(fetchID);
          }
        },
        enabled: index === 0 || !!parentScopeValue,
      };
    }),
  });

  useEffect(() => {
    const newSelectedValues = [...selectedValues];
    let changed = false;
    queryResults.forEach((result, index) => {
      if (
        result.isSuccess &&
        result.data &&
        !newSelectedValues[index] &&
        result.data.filterOptions.length > 0
      ) {
        newSelectedValues[index] = result.data.filterOptions[0].id;
        changed = true;
      }
    });

    if (changed) {
      setSelectedValues(newSelectedValues);
    }
  }, [queryResults.map((r) => r.data)]);

  const progressData = useMemo(() => {
    return queryResults.map(
      (result) =>
        result.data ?? { labels: [], barData: [], averageProgress: 0, filterOptions: [] },
    );
  }, [queryResults]);

  useEffect(() => {
    setSelectedProgressScope({ scopeList, scopeNameList, selectedValues });
  }, [scopeList, scopeNameList, selectedValues, setSelectedProgressScope]);

  const getExportData = (selectedOption: any) => {
    if (!selectedOption) return;
    const matchData: Array<ExportProgressDataType> = [];
    for (let i = 0; i < selectedOption.scope.length; i++) {
      if (scopeList.includes(selectedOption.scope[i]) && progressData[i]) {
        matchData.push({
          title: `${selectedOption.scopeName[i]}${selectedValues[i]}`,
          chartID: `${CHART_ID_PREFIX}-${i}`,
          progress: progressData[i].averageProgress,
        });
      }
    }
    setChildData((prev) => ({
      ...prev,
      ProgressTemplateData: matchData,
      ProgressTemplateImg: undefined,
    }));
  };

  useEffect(() => {
    if (selectedOption) {
      getExportData(selectedOption);
    }
  }, [progressData, selectedValues, selectedOption]);

  const handleSelectorChange = (index: number, value: string) => {
    setSelectedValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      for (let i = index + 1; i < prev.length; i++) {
        newValues[i] = '';
      }
      return newValues;
    });
  };

  useEffect(() => {
    const schoolScopeIndex = scopeList.findIndex((scope) => scope.includes('school'));
    if (schoolScopeIndex !== -1) {
      onSelectSchool?.(selectedValues[schoolScopeIndex]);
    }
  }, [selectedValues, scopeList]);

  return (
    <>
      <CWWhiteBox className="sticky top-[-10px] z-[999] mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 pb-3">
            <div className="w-64">
              <CWSelect
                value={selectedReportType.value}
                options={reportTypeOptions}
                onChange={(e) => {
                  onSelectSchool?.('');
                  onReportTypeChange(e);
                }}
              />
            </div>
            <CWButton icon={<IconDownload />} title={'PDF'} onClick={onDownloadPdf} />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <ProgressSelectorGroup
            scopeList={scopeList}
            scopeNameList={scopeNameList}
            selectedValues={selectedValues}
            progressData={progressData}
            onSelectorChange={handleSelectorChange}
          />
        </div>
      </CWWhiteBox>
      <>
        <h2 className="text-xl font-bold">ข้อมูลความคืบหน้าทั้งหมด</h2>
        {scopeList.map((_, index) => (
          <CWWhiteBox
            key={index}
            className="mb-3 gap-5 rounded-md border bg-white px-3 py-5 shadow-md"
          >
            <h2 className="text-lg font-bold">
              {index == 0 && `เขตตรวจราชการ: เขตตรวจ ${selectedValues[index]}`}
              {index == 1 && `เขตพื้นที่: ${selectedValues[index]}`}
              {index == 2 && `โรงเรียน: ${selectedValues[index]}`}
            </h2>
            {index === 0 && progressData[1] && (
              <div className="relative">
                <CWALoadingOverlay visible={loadingApiStore.apiLoadingList.length > 0} />
                <BarChartTemplate
                  data={progressData[1].barData}
                  categories={progressData[1].labels}
                  height={300}
                  id={`${CHART_ID_PREFIX}-${1}`}
                />
              </div>
            )}
            {index == 1 && progressData[2] && (
              <div className="relative">
                <CWALoadingOverlay visible={loadingApiStore.apiLoadingList.length > 0} />
                <BarChartTemplate
                  data={progressData[2].barData}
                  categories={progressData[2].labels}
                  height={300}
                  id={`${CHART_ID_PREFIX}-${2}`}
                />
              </div>
            )}
            {index == 2 && (
              <div className="relative">
                <CWALoadingOverlay visible={loadingApiStore.apiLoadingList.length > 0} />
                <ReportSchoolYear
                  selectedSchool={selectedValues[index]}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            )}
          </CWWhiteBox>
        ))}
      </>
    </>
  );
};

export default ProgressTemplate;
