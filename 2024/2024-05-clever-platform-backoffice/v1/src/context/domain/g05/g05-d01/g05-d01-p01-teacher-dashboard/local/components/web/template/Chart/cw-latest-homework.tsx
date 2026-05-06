import { LatestHomework } from '@domain/g03/g03-d01/local/type';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
interface LatestHomeworkProps {
  data: number[];
  totol: number;
}
const CWLatestHomework = ({ data, totol }: LatestHomeworkProps) => {
  // const data = [10, 40, 35, 50,];
  const LatestHomework: ApexOptions = {
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
            filename: 'การบ้านล่าสุด',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: {
            filename: 'การบ้านล่าสุด',
          },
          png: {
            filename: 'การบ้านล่าสุด',
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
            return `${seriesName} ${value} ด่าน (0%)`;
          }

          const percentage = ((value / total) * 100).toFixed(1);
          return `${seriesName} ${value} ด่าน (${percentage}%)`;
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
              formatter: () => totol.toString(),
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
  return (
    <ReactApexChart options={LatestHomework} series={data} type="donut" height={350} />
  );
};

export default CWLatestHomework;
