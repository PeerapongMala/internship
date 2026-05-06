import React, { Dispatch, SetStateAction, useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';

interface DonutChartProps {
  percentage: number;
  setImage?: Dispatch<SetStateAction<string>>;
}

const DonutChart: React.FC<DonutChartProps> = ({ percentage, setImage }) => {
  useEffect(() => {
    let root = am5.Root.new('chartdiv');
    if (root._logo) {
      root._logo.dispose();
    }
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(40),
      }),
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        innerRadius: am5.percent(40),
      }),
    );

    // // กำหนดชุดสีแบบกำหนดเอง
    // const customColors = [
    //   am5.color(0x73556E),
    //   am5.color(0x9FA1A6),
    //   am5.color(0xF2AA6B),
    //   am5.color(0xF28F6B),
    //   am5.color(0xA95A52),
    //   am5.color(0xE35B5D),
    //   am5.color(0xFFA446),
    //   am5.color(0x4f46e5), // สีหลัก
    //   am5.color(0x000000), // สีรอง
    // ];

    // series.set("colors", am5.ColorSet.new(root, { colors: customColors }));

    // เพิ่มมุมโค้งให้แต่ละ Slice
    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });
    series.appear(1000, 100);
    // อแดปเตอร์กำหนดสีของ Slice ตามค่าใน data
    series.slices.template.adapters.add('fill', (fill, target) => {
      return (target.dataItem?.dataContext as { color?: am5.Color })?.color || fill;
    });

    // กำหนด cornerRadius ตามข้อมูล
    series.slices.template.adapters.add('cornerRadius', (radius, target) => {
      return (
        (target.dataItem?.dataContext as { cornerRadius?: number })?.cornerRadius || 0
      );
    });
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);
    series.data.setAll([
      {
        category: 'Current',
        value: percentage,
        color: am5.color('#4F46E5'),
        cornerRadius: 8,
      }, // สีหลัก
      {
        category: 'Remaining',
        value: 100 - percentage,
        color: am5.color('#E5E5E5'),
        cornerRadius: 0,
      }, // สีรอง
    ]);

    let centerCircle = chart.seriesContainer.children.push(
      am5.Circle.new(root, {
        radius: 65, // ขนาดวงกลม
        fill: am5.color(0xe0e6ed), // สีพื้นหลัง
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      }),
    );
    // เพิ่ม Label ตรงกลาง
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        // html: `<div style="text-align:center; line-height:1.2;">
        //     <span style="font-size:14px; color:#595858;font-weight:300;">ปัจจุบัน</span><br>
        //     <span style="font-size:22px; font-weight:400; color:#000;">${percentage.toFixed(2)}%</span>
        // </div>`,
        text: `ปัจจุบัน`,
        fontSize: 14,
        fontWeight: '300',
        dy: -14,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        fill: am5.color('#595858'),
      }),
    );
    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: `${percentage.toFixed(2)}%`,
        fontSize: 22,
        fontWeight: '500',
        dy: 14,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        fill: am5.color(0x000000),
      }),
    );
    var exporting = am5plugins_exporting.Exporting.new(root, {});

    if (setImage) {
      // setTimeout(function () {
      //   exporting.export("png").then(function (imgData) {
      //     setImage(imgData);
      //   });
      // }, 1000);
      setTimeout(() => {
        if (exporting) {
          exporting.export('png').then((imgData) => {
            setImage(imgData);
          });
        }
      }, 300);
    }

    return () => {
      root.dispose();
    };
  }, [percentage]);

  return <div id="chartdiv" style={{ width: '40%', height: '300px' }}></div>;
};

export default DonutChart;
