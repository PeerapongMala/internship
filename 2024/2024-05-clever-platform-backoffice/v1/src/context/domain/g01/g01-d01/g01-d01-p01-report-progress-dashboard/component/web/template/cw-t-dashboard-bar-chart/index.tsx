import CWWhiteBox from '@global/component/web/cw-white-box';
import BarChartTemplate from '../../../organism/cw-o-bar-chart';
// Import useQuery and useMemo
import { useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import API from '@domain/g01/g01-d01/local/api';
import { ChildDataType } from '@domain/g01/g01-d01/g01-d01-p01-report-progress-dashboard';
import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';
import { useQuery } from '@tanstack/react-query';
import showMessage from '@global/utils/showMessage';

const CHART_ID_PREFIX = 'T_DASHBOARD_BARCHART';

interface ProgressReport {
  scope: string;
  progress: number;
}

interface ProgressData {
  average_progress: number;
  start_date: string;
  end_date: string;
  progress_reports: ProgressReport[];
}

const DashboardBarChart = ({
  scope,
  reportType,
  startDate,
  endDate,
  setChildData,
  selectedRecordLabel,
  onFetchSuccess,
}: {
  scope: string | undefined;
  reportType: string | undefined;
  startDate: string;
  endDate: string;
  setChildData: Dispatch<SetStateAction<ChildDataType>>;
  selectedRecordLabel: string;
  onFetchSuccess?: () => void;
}) => {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['DashboardProgress', reportType, scope, startDate, endDate],

    queryFn: async () => {
      const resProgress = await API.ProgressTable.GetListProgressTable({
        report_type: reportType,
        scope: scope,
        start_date: startDate,
        end_date: endDate,
      });

      if (resProgress.status_code === 200) {
        onFetchSuccess?.();
        return resProgress.data[0] as ProgressData; // Return the data on success
      }

      showMessage(resProgress.message, 'error');
      throw new Error('Failed to fetch progress data');
    },

    enabled: !!scope,
  });
  // --- END TANSTACK QUERY IMPLEMENTATION ---

  // useMemo is used to derive the chart data from the fetched progressData.
  // This calculation only re-runs when progressData changes, not on every render.
  const { label, barData } = useMemo(() => {
    if (!progressData) {
      return { label: [], barData: [] };
    }
    const labels = progressData.progress_reports.map((report) => report.scope);
    const data = progressData.progress_reports.map((report) => report.progress);
    return { label: labels, barData: data };
  }, [progressData]);

  // This useEffect is now only for handling the "side effect" of updating the parent's state.
  // It runs only when the data has successfully been fetched and changed.
  useEffect(() => {
    if (progressData) {
      setChildData((prev) => ({
        ...prev,
        DashboardBarChartTemplateData: {
          title: 'รายงานความก้าวหน้าแบ่งตามเขตตรวจ',
          chartID: CHART_ID_PREFIX,
        },
        DashboardBarChartTemplateImg: undefined,
      }));
    }
  }, [progressData, setChildData]);

  // REMOVED: The original useEffect for fetching data is no longer needed.
  // REMOVED: The original useEffect for processing data is replaced by useMemo.

  return (
    <CWWhiteBox className="relative mb-3">
      {/* The `isLoading` state from useQuery directly controls the loading overlay. */}
      <CWALoadingOverlay visible={isLoading} />
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">สังกัดการศึกษา: {selectedRecordLabel}</h2>
        <BarChartTemplate
          data={barData}
          categories={label}
          height={300}
          id={CHART_ID_PREFIX}
        />
      </div>
    </CWWhiteBox>
  );
};

export default DashboardBarChart;
