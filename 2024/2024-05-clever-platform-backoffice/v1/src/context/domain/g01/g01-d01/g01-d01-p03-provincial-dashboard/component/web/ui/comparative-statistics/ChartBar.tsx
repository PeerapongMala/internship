import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
// import * as am5 from '@amcharts/amcharts5';
// import * as am5xy from '@amcharts/amcharts5/xy';
// import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { StatUsage } from '@domain/g01/g01-d01/local/api/group/provincial-dashboard/type';
// import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';

interface DonutChartProps {
  data: StatUsage[];
  setImage: Dispatch<SetStateAction<string>>;
  setDistrict: Dispatch<SetStateAction<string>>;
}

import ReactApexChart from 'react-apexcharts';

const ChartBar: FC<DonutChartProps> = ({ data, setImage, setDistrict }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const baseColor = '#E5E5E5';
  const activeColor = '#B6DBF4';

  const categories = data.map((item) => item.label);
  const seriesData = data.map((item) => item.value);

  // const categories = ["Q1", "Q2", "Q3", "Q4"];

  const colors = categories.map((_, index) =>
    index === selectedIndex ? activeColor : baseColor,
  );

  const series = [
    {
      name: 'Values',
      data: seriesData,
    },
  ];

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false,
      },
      events: {
        dataPointMouseEnter: (event: any, chartContext: any, config: any) => {
          event.target.style.cursor = 'pointer';
        },
        dataPointSelection: (_event: any, _chartContext: any, config: any) => {
          setSelectedIndex(config.dataPointIndex);
          const label = data[config.dataPointIndex]?.label;
          setDistrict(label);
        },
      },
    },
    colors,
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none', // ไม่ใช้ filter แต่เราจะ override ด้วยสีด้านล่าง
        },
      },
    },
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        distributed: true, // Optional: gives each bar a unique color
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 10, // ทำให้ปลายเป็นหัวมน
        borderRadiusApplication: 'end' as const, // ให้ปลายมนเฉพาะด้านบน
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  return <ReactApexChart options={options} series={series} type="bar" height={350} />;
};

export default ChartBar;

// const ChartBar: FC<DonutChartProps> = ({ data, setImage }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const [selectLabel, setSelectLabel] = useState<string>('');

//   useEffect(() => {
//     if (!chartRef.current) return;

//     // Create root element
//     let root = am5.Root.new(chartRef.current);
//     if (root._logo) {
//       root._logo.dispose();
//     }
//     // Set themes
//     root.setThemes([am5themes_Animated.new(root)]);

//     // สร้าง Chart
//     let chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: true,
//         panY: false,
//         wheelX: 'panX',
//         wheelY: 'none',
//         paddingLeft: 50, // เพิ่ม padding ซ้าย
//       }),
//     );

//     // แกน X (หมวดหมู่)
//     let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
//     xRenderer.labels.template.setAll({
//       textAlign: 'center',
//       oversizedBehavior: 'wrap',
//       maxWidth: 120,
//     });

//     let xAxis = chart.xAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: 'label',
//         renderer: xRenderer,
//       }),
//     );

//     // แกน Y (ค่า)
//     let yRenderer = am5xy.AxisRendererY.new(root, { inside: false });
//     yRenderer.grid.template.setAll({
//       forceHidden: false, // ให้เส้นแสดง
//       strokeOpacity: 0.2,
//     });

//     let yAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         renderer: yRenderer,
//       }),
//     );

//     // เพิ่มข้อมูลให้ X Axis
//     xAxis.data.setAll(data);
//     xAxis.get('renderer').labels.template.adapters.add('text', (text, target) => {
//       const label = (target.dataItem?.dataContext as { label: string })?.label;
//       const name = (target.dataItem?.dataContext as { name: string })?.name;
//       return label ? `${label}` : text;
//     });
//     xAxis.get('renderer').grid.template.set('visible', false);

//     xAxis.get('renderer').labels.template.setAll({
//       fontWeight: 'lighter', // Use a higher weight for a bolder effect
//       paddingTop: 20, // Adds margin at the top
//       fontSize: 12,
//     });

//     // สร้าง Bar Series
//     let series = chart.series.push(
//       am5xy.ColumnSeries.new(root, {
//         name: 'value',
//         xAxis: xAxis,
//         yAxis: yAxis,
//         valueYField: 'value',
//         categoryXField: 'label',
//         tooltip: am5.Tooltip.new(root, {
//           labelText: '{name}: {valueY}',
//         }),
//       }),
//     );

//     series.columns.template.states.create("hover", {
//       fill: am5.color('#FFD700'),
//       cursorOverStyle: "pointer",
//     });

//     // ปรับแต่งสี bar ตาม label ที่เลือก
//     series.columns.template.adapters.add("fill", (fill, target) => {
//       const dataItem = target.dataItem;
//       if (dataItem) {
//         const label = (dataItem.dataContext as { label: string }).label;
//         if (label === selectLabel) {
//           return am5.color('#B6DBF4'); // สีของ bar ที่ถูกเลือก
//         }
//       }
//       return am5.color('#E5E5E5'); // สีปกติ
//     });

//     series.columns.template.events.on("click", (ev) => {
//       const dataItem = ev.target.dataItem;
//       if (dataItem) {
//         const { label, value } = dataItem.dataContext as { label: string; value: number };
//         console.log("Clicked:", label, value);
//         setSelectLabel(label);
//         // ตัวอย่าง: setLabel(label); หรือเปิด modal
//       }
//     });

//     // ปรับแต่งแท่ง Bar
//     series.columns.template.setAll({
//       cornerRadiusTL: 10, // มุมโค้งด้านบนซ้าย
//       cornerRadiusTR: 10, // มุมโค้งด้านบนขวา
//       strokeOpacity: 0,
//       width: am5.percent(20),
//     });

//     series.data.setAll(data);
//     series.appear(1000, 100);
//     var exporting = am5plugins_exporting.Exporting.new(root, {});

//     setTimeout(() => {
//       if (exporting) {
//         exporting.export("png").then((imgData) => {
//           setImage(imgData);
//         });
//       }
//     }, 300);

//     return () => {
//       root.dispose();
//     };
//   }, [data,selectLabel]);

//   return <>{data.length ? <div ref={chartRef} style={{ width: '100%', height: '500px' }} /> : <div className='w-full text-center'>ไม่พบข้อมูล</div>}</>;
// };

// export default ChartBar;
