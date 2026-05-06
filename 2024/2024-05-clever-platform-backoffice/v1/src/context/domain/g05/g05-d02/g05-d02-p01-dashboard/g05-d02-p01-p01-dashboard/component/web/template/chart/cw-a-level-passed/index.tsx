import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

type LevelChartProps = {
  passed: number;
  notPassed: number;
  label?: string;
};
const LevelChart = ({ notPassed, passed, label }: LevelChartProps) => {
  const data = [passed, notPassed];
  const total = passed + notPassed;

  const LevelPassed: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
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
    colors: ['#6DB6E9', '#EF4444'],
    labels: ['ผ่านแล้ว', 'ไม่ผ่าน'],
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
              formatter: () => total.toString(),
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
  return <ReactApexChart options={LevelPassed} series={data} type="donut" height={350} />;
};

export default LevelChart;
