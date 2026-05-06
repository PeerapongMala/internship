import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

const CWLevelPassed = () => {
  const data = [10, 40];
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
  return <ReactApexChart options={LevelPassed} series={data} type="donut" height={350} />;
};

export default CWLevelPassed;
