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
  const passedPercentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.00';

  const LevelPassed: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: (seriesName: string, opts) => {
        const value = data[opts.seriesIndex];
        return `${seriesName} (${value}%)`;
      },
    },
    colors: ['#26D93B', '#E5E5E5'],
    labels: ['ผ่านแล้ว', 'ไม่ผ่าน'],
    dataLabels: {
      enabled: false,
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
      pie: {
        donut: {
          size: '60%',
          background: '#f3f4f6',
          labels: {
            show: true,
            total: {
              show: true,
              label: label ?? 'ปัจจุบัน',
              formatter: () => `${passedPercentage}%`,
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
