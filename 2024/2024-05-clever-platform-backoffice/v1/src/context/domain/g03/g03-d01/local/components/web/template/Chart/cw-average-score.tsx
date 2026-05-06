import { Score } from '@domain/g03/g03-d01/local/type';
import { ApexOptions } from 'apexcharts';
import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ScoreProps {
  record?: Score[];
  onScoreTotalChange?: (total: number) => void;
  onScoreTotalPassChange?: (total: number) => void;
}

const CWAverageScore = ({
  record,
  onScoreTotalChange,
  onScoreTotalPassChange,
}: ScoreProps) => {
  const aggregatedData = record?.reduce(
    (acc, record) => {
      return {
        total_score: acc.total_score + (record.total_score || 0),
        student_score: acc.student_score + (record.student_score || 0),
      };
    },
    { total_score: 0, student_score: 0 },
  ) || { total_score: 0, student_score: 0 };

  const score = aggregatedData.student_score;
  const total = aggregatedData.total_score;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : '0.00';

  const data = [score, total - score];

  useEffect(() => {
    if (onScoreTotalPassChange && onScoreTotalChange) {
      onScoreTotalChange(total);
      onScoreTotalPassChange(score);
    }
  }, [total, score, onScoreTotalPassChange, onScoreTotalChange]);

  const Averagescore: ApexOptions = {
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
            filename: 'คะแนนเฉลี่ย',
            columnDelimiter: ',',
            headerCategory: 'หัวข้อ',
            headerValue: 'ค่า',
          },
          svg: { filename: 'คะแนนเฉลี่ย' },
          png: { filename: 'คะแนนเฉลี่ย' },
        },
      },
    },
    labels: ['คะแนนเฉลี่ย', 'คะแนนที่เหลือ'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: (seriesName: string, opts) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.seriesTotals.reduce(
          (a: number, b: number) => a + b,
          0,
        );
        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
        return `${seriesName} ${value.toFixed(2)} (${percentage}%)`;
      },
    },

    colors: ['#6DB6E9', '#EF4444'],
    dataLabels: {
      enabled: false,
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
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          background: '#f3f4f6',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'คะแนนรวม',
              formatter: () => total.toString(),
            },
          },
        },
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
  };

  return (
    <ReactApexChart options={Averagescore} series={data} type="donut" height={350} />
  );
};

export default CWAverageScore;
