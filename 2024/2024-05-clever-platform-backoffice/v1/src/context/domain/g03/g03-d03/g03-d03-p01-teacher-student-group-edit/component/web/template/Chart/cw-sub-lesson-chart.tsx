import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import CWPagination from '../../organism/cw-pagination';
import { SubLessonProgress } from '@domain/g03/g03-d03/local/api/group/student-overview/types';
interface SubLessonProp {
  record?: SubLessonProgress[];
}
const CWSubLessonChart = ({ record = [] }: SubLessonProp) => {
  const categories = record?.map((item) => item.scope);
  const seriesData = record?.map((item) => item.progress);
  const calculateMaxValue = () => {
    if (!seriesData || seriesData.length === 0) return 100;
    const maxDataValue = Math.max(...seriesData);

    return Math.max(Math.ceil(maxDataValue * 1.1), 100);
  };

  const SplineAreaChart: ApexOptions = {
    chart: {
      type: 'bar',
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
            filename: 'ข้อมูลความคืบหน้าบทเรียนย่อย',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: {
            filename: 'กราฟความคืบหน้า',
          },
          png: {
            filename: 'กราฟความคืบหน้า',
          },
        },
      },
    },
    colors: ['#26D93B'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(2)}`,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          total: {
            enabled: true,
            style: {
              color: '#E5E5E5',
            },
          },
        },
        horizontal: true,
        columnWidth: '30%',
        barHeight: '50%',
        colors: {
          backgroundBarColors: ['#E5E5E5'],
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '14px',
          colors: ['#333'],
        },
        offsetX: -10,
      },
    },
    yaxis: {
      min: 0,
      max: calculateMaxValue(),
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          dataLabels: {
            style: {
              fontSize: '10px',
            },
          },
        },
      },
    ],
    noData: {
      text: 'ไม่มีข้อมูลแสดง',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '16px',
        fontFamily: 'sans-serif',
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={SplineAreaChart}
        series={[
          {
            name: 'ส่งแล้ว',
            data: seriesData,
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default CWSubLessonChart;
