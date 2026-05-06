import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface LevelAverageProp {
  data?: number[];
  totol: number;
}

const CWLevelAverage = ({ data = [0, 0], totol }: LevelAverageProp) => {
  const total = data.reduce((acc, val) => acc + val, 0);

  const chartOptions: ApexOptions = {
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
            filename: 'จำนวนด่านที่ผ่านโดยเฉลี่ย / ด่านทั้งหมด',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: {
            filename: 'จำนวนด่านที่ผ่านโดยเฉลี่ย / ด่านทั้งหมด',
          },
          png: {
            filename: 'จำนวนด่านที่ผ่านโดยเฉลี่ย / ด่านทั้งหมด',
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
    tooltip: {
      y: {
        formatter: (val) => (total > 0 ? `${((val / total) * 100).toFixed(2)}%` : '0%'),
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
      },
    },
    colors: ['#6DB6E9', '#EF4444'],
    labels: ['ผ่านแล้ว', 'ยังไม่ผ่าน'],
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
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
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
    <ReactApexChart options={chartOptions} series={data} type="donut" height={350} />
  );
};

export default CWLevelAverage;
