import { Lesson } from '@domain/g05/g05-d02/local/types/overview';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
interface LessonProp {
  data?: Lesson[];
}
const LessonBarChart = ({ data = [] }: LessonProp) => {
  // const data = [50, 60, 70, 10, 30, 90, 76, 32, 34, 87];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = data?.map((item) => item.lesson_name);
  const seriesData = data?.map((item) => item.progress);
  const calculateMaxValue = () => {
    if (!seriesData || seriesData.length === 0) return 100;
    const maxDataValue = Math.max(...seriesData);

    return Math.max(Math.ceil(maxDataValue * 1.1), 100);
  };
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: isMobile ? 300 : 350,
      toolbar: {
        show: !isMobile,
      },
    },
    colors: ['#6DB6E9'],
    plotOptions: {
      bar: {
        horizontal: !isMobile,
        borderRadius: 4,
        columnWidth: isMobile ? '70%' : '30%',
        dataLabels: {
          position: isMobile ? 'top' : 'center',
        },
      },
    },
    dataLabels: {
      enabled: !isMobile || data.length < 10,
      formatter: (val: number) => `${Math.round(val)}%`,
      style: {
        fontSize: isMobile ? '10px' : '12px',
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        rotate: isMobile ? -45 : 0,
        style: {
          fontSize: isMobile ? '10px' : '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: calculateMaxValue(),
      labels: {
        style: {
          fontSize: isMobile ? '10px' : '12px',
        },
      },
    },
    tooltip: {
      enabled: true,
      fixed: {
        enabled: isMobile,
        position: 'topRight',
      },
    },
  };

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: isMobile ? '100%' : 'auto' }}>
        <ReactApexChart
          options={chartOptions}
          series={[{ data: seriesData }]}
          type="bar"
          height={isMobile ? 300 : 350}
        />
      </div>
    </div>
  );
};

export default LessonBarChart;
