import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CWOverviewStudent = () => {
  const data = [50, 60, 70, 10, 30];
  const SplineAreaChart: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {},
    },
    colors: ['#26D93B', '#E5E5E5'],
    labels: ['ส่งแล้ว', 'ยังไม่ได้ส่ง'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
    stroke: {
      width: 5,
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
    tooltip: {
      enabled: true,
      y: {
        title: {
          formatter: function (seriesName: string) {
            return `ค่า: ${seriesName}`;
          },
        },
      },
      x: {
        show: true,
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },

    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    xaxis: {
      categories: [
        'บทที่ 1 จำนวนนับ',
        'บทที่ 2 ชื่อบทเรียน',
        'บทที่ 3 ชื่อบทเรียน',
        'บทที่ 4 ชื่อบทเรียน ',
        'บทที่ 5 ชื่อบทเรียน ',
      ],
      labels: {
        show: true,
        style: {
          fontSize: '14px',
          colors: ['#333'],
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
    },
  };
  return (
    <ReactApexChart
      options={SplineAreaChart}
      series={[{ data: data }]}
      type="bar"
      height={350}
    />
  );
};

export default CWOverviewStudent;
