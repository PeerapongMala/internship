import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
interface HomeworkProps {
  data: number[];
  totol: number;
}
const CWHomework = ({ data, totol }: HomeworkProps) => {
  // const data = [10, 40, 35, 50,];
  const Homework: ApexOptions = {
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
            filename: 'ภาพรวมการบ้านทั้งหมด',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: {
            filename: 'ภาพรวมการบ้านทั้งหมด',
          },
          png: {
            filename: 'ภาพรวมการบ้านทั้งหมด',
          },
        },
      },
    },

    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: (seriesName: string, opts) => {
        try {
          const total = data.reduce((sum, current) => sum + current, 0);
          const value = data[opts.seriesIndex] ?? 0;

          if (total <= 0 || !Number.isFinite(total) || !Number.isFinite(value)) {
            return `${seriesName} ${value} ด่าน (0%)`;
          }

          const percentage = ((value / total) * 100).toFixed(1);
          return `${seriesName} (${percentage}%)`;
        } catch {
          return `${seriesName} - ด่าน (0%)`;
        }
      },
    },
    colors: ['#EF4444', '#FACC15', '#6DB6E9'],
    labels: ['ยังไม่ได้ทำ', 'กำลังทำ', 'ส่งแล้ว'],
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
              formatter: () => `${totol}`,
            },
          },
        },
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
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
  return <ReactApexChart options={Homework} series={data} type="donut" height={350} />;
};

export default CWHomework;
