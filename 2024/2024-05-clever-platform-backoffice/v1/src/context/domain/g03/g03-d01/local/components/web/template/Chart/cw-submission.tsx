import { questionOverview } from '@domain/g03/g03-d01/local/type';
import { ApexOptions } from 'apexcharts';
import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface QuestionProp {
  record?: questionOverview[];
  onPointTotalChange?: (total: number) => void;
  onPointTotalPassChange?: (total: number) => void;
}
const CWSubmission = ({
  record,
  onPointTotalChange,
  onPointTotalPassChange,
}: QuestionProp) => {
  const aggregatedData = record?.reduce(
    (acc, record) => {
      return {
        total_question: acc.total_question + (record.total_question || 0),
        total_level: acc.total_level + (record.total_level || 0),
        level_submitted: acc.level_submitted + (record.level_submitted || 0),
      };
    },
    { total_question: 0, total_level: 0, level_submitted: 0 },
  ) || { total_question: 0, total_level: 0, level_submitted: 0 };

  const data = [
    // aggregatedData.total_level,
    aggregatedData.level_submitted,
    aggregatedData.total_level,
  ];
  useEffect(() => {
    if (onPointTotalChange && onPointTotalPassChange) {
      onPointTotalChange(aggregatedData.total_question);
      onPointTotalPassChange(aggregatedData.level_submitted);
    }
  }, [aggregatedData.total_question, aggregatedData.level_submitted]);

  // const data = [10, 90];
  const Submission: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        export: {
          csv: {
            filename: 'การส่งแบบฝึกหัด',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: {
            filename: 'การส่งแบบฝึกหัด',
          },
          png: {
            filename: 'การส่งแบบฝึกหัด',
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        size: 8,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (seriesName: string, opts) => {
        try {
          const total = data.reduce((sum, current) => sum + current, 0);
          const value = data[opts.seriesIndex] ?? 0;

          if (total <= 0 || !Number.isFinite(total) || !Number.isFinite(value)) {
            return `${seriesName} (0%)`;
          }

          const percentage = ((value / total) * 100).toFixed(1);
          return `${seriesName} (${percentage}%)`;
        } catch {
          return `${seriesName} (0%)`;
        }
      },
    },

    colors: ['#6DB6E9', '#EF4444'],
    labels: ['ส่งแล้ว', 'ยังไม่ได้ส่ง'],
    dataLabels: {
      enabled: false,
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
    stroke: {
      width: 10,
      lineCap: 'round',
    },
    grid: {
      padding: {
        top: 0,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          background: '#f3f4f6',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'ยอดรวม',
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'none', // หรือ 'lighten' ถ้าอยากให้สว่างขึ้น
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
  };
  return <ReactApexChart options={Submission} series={data} type="donut" height={350} />;
};

export default CWSubmission;
