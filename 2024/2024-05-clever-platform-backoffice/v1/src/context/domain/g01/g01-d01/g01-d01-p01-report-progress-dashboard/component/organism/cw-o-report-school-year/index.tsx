import { useCallback, useEffect, useState } from 'react';
import { CHART_ID_PREFIX, ProgressData } from '../../web/template/cw-t-progress';
import BarChartTemplate from '../cw-o-bar-chart';
import API from '@domain/g01/g01-d01/local/api';

type ReportSchoolYearProps = {
  selectedSchool?: string;
  startDate: string;
  endDate: string;
};

const ReportSchoolYear = ({
  selectedSchool,
  startDate,
  endDate,
}: ReportSchoolYearProps) => {
  const [data, setData] = useState<ProgressData>({
    averageProgress: 0,
    barData: [],
    filterOptions: [],
    labels: [],
  });
  const fetchData = useCallback(async () => {
    const queryParams: Record<string, string> = {
      scope: 'year',
      start_date: startDate,
      end_date: endDate,
    };

    if (selectedSchool) {
      queryParams.parent_scope = selectedSchool;
    }

    try {
      const res = await API.ProgressTable.GetListProgressTable(queryParams);
      if (res?.status_code === 200 && res.data?.[0]) {
        const { average_progress, progress_reports } = res.data[0];
        const newOptions = progress_reports.map((r: any) => ({
          id: r.scope,
          name: r.scope,
        }));

        setData({
          labels: progress_reports.map((r: any) => r.scope),
          barData: progress_reports.map((r: any) => r.progress),
          averageProgress: average_progress,
          filterOptions: newOptions,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [startDate, endDate, selectedSchool]);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedSchool]);

  return (
    <BarChartTemplate
      data={data.barData}
      categories={data.labels}
      height={300}
      id={`${CHART_ID_PREFIX}-${2}`}
    />
  );
};

export default ReportSchoolYear;
