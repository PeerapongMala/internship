import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface BarChartProps {
  id?: string;
  data: number[];
  categories: string[];
  height?: number;
}

const BarChartTemplate = ({ id, data, categories, height }: BarChartProps) => {
  const columnChart: any = {
    series: [
      {
        name: 'Net Profit',
        data: data,
      },
    ],
    options: {
      chart: {
        id,
        height: 100,
        type: 'bar',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        background: '#fafafa',
      },
      states: {
        active: {
          filter: {
            type: 'none' /* none, lighten, darken */,
          },
        },
      },

      colors: ['#fddea9'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 10,
          borderRadiusApplication: 'end',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          gradientToColors: ['#ffbb45'],
          inverseColors: true,
          stops: [50, 100],
        },
      },
      grid: {
        borderColor: '#e0e6ed',
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        categories: categories,
        axisBorder: {
          color: '#e0e6ed',
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 8,
        forceNiceScale: false,
        labels: {
          formatter: function (value: number) {
            return value;
          },
          offsetY: -4,
        },
        opposite: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
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
    },
  };

  return (
    <ReactApexChart
      series={columnChart.series}
      options={columnChart.options}
      className="overflow-hidden rounded-lg bg-white dark:bg-black"
      type="bar"
      height={height}
    />
  );
};

export default BarChartTemplate;
