import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
// import { bangkokGeo } from './BangkokGeo';
import { FeatureCollection, Feature } from 'geojson';
import { ProvincesWithGeometry } from './ProvincesWithGeometry';
import { codes } from './Codes';

interface GeoJSONFeatureProperties {
  polygonId: unknown;
  divID: number | unknown;
  name: string | unknown;
}

interface ProvincesWithGeometry {
  features: Feature[];
  pro_code: string;
  pro_th: string;
}

interface MapBangkokProps {
  selectDistrict: Dispatch<SetStateAction<string>>;
  province: string;
}

const MapBangkok: FC<MapBangkokProps> = ({ selectDistrict, province }) => {
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const provinceList: ProvincesWithGeometry[] =
    ProvincesWithGeometry as ProvincesWithGeometry[];
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [activePolygons, setActivePolygons] = useState<Set<number>>(new Set());
  const rankScore: {
    color: string;
    title: string;
    range: string;
  }[] = [
    {
      color: 'bg-[#33baf8]',
      title: 'ดีมาก',
      range: '80%-100%',
    },
    {
      color: 'bg-[#2bf57f]',
      title: 'ดี',
      range: '60%-79%',
    },
    {
      color: 'bg-[#f9f900]',
      title: 'ปานกลาง',
      range: '40%-59%',
    },
    {
      color: 'bg-[#f9a300]',
      title: 'พอใช้',
      range: '20%-39%',
    },
    {
      color: 'bg-[#f54444]',
      title: 'ไม่ดี',
      range: '0%-19%',
    },
  ];
  useEffect(() => {
    const index = codes.indexOf(province);
    if (index !== -1) {
      setGeoData({
        type: 'FeatureCollection',
        features: provinceList[index].features as Feature[],
      });
    } else {
      setGeoData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [provinceList, province]);

  useLayoutEffect(() => {
    if (!geoData || !chartDivRef.current) return; // เช็คว่า chartDivRef.current มีค่า

    const root = am5.Root.new(chartDivRef.current); // ใช้ ref ในการสร้าง Root
    if (root._logo) {
      root._logo.dispose();
    }

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: 'none',
        panY: 'none',
        layout: root.horizontalLayout,
        wheelY: 'none',
      }),
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geoData,
        calculateAggregates: true,
        valueField: 'value',
      }),
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color('#e5e5e5'),
      interactive: false,
      stroke: am5.color('#ffffff'),
      strokeWidth: 1,
      strokeOpacity: 1,
      cursorOverStyle: 'pointer',
    });

    polygonSeries.mapPolygons.template.events.on('click', function (ev) {
      const polygon = ev.target;
      const dataItem = polygon.dataItem;
      const index = polygonSeries.mapPolygons.indexOf(polygon);
      if (!dataItem) return;
      const polygonName = (dataItem.dataContext as { name: string })?.name;

      polygonSeries.mapPolygons.each((otherPolygon) => {
        otherPolygon.set('fill', am5.color('#e5e5e5'));
      });
      polygon.set('fill', am5.color('#4B4DDD'));

      for (let i = 1; i <= polygonSeries.mapPolygons.values.length; i++) {
        const elementOld = document.getElementById(`${i}`);
        if (elementOld) {
          elementOld.style.color = '#000000';
        }
      }

      const element = document.getElementById(`${index + 1}`);
      if (element) {
        element.style.color = '#ffffff';
      }

      selectDistrict(polygonName);
    });

    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        polygonIdField: 'polygonId',
      }),
    );

    pointSeries.bullets.push(function (root) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          fontSize: 12,
          centerX: am5.p50,
          centerY: am5.p50,
          html: `<div id="{divID}">{name}</div>`,
          populateText: true,
        }),
      });
    });

    polygonSeries.events.on('datavalidated', function (ev) {
      const series = ev.target;
      let ids = 0;
      const labelData: GeoJSONFeatureProperties[] = [];
      series.mapPolygons.each(function (polygon) {
        const dataItem = polygon.dataItem;
        if (dataItem) {
          const id = (dataItem.dataContext as { id: string })?.id;
          const name = (dataItem.dataContext as { name: string })?.name;
          ids += 1;
          labelData.push({
            polygonId: id,
            divID: ids,
            name: name,
          });
        }
      });
      pointSeries.data.setAll(labelData);
    });

    return () => root.dispose();
  }, [geoData]);

  return (
    <div
      className="relative rounded-md bg-white pt-12"
      style={{ width: '100%', height: '840px' }}
    >
      <div ref={chartDivRef} style={{ width: '100%', height: '700px' }} />
      <div className="absolute bottom-0 left-0 pl-3">
        <div className="mb-4 text-base font-semibold text-gray-800">ลำดับคะแนนเฉลี่ย</div>
        {rankScore.map((item, index) => (
          <div className="mb-2 flex items-center" key={index}>
            <div className={`mr-3 h-4 w-[1.3rem] rounded-md ${item.color}`}></div>
            <div className="mr-4 w-14 text-xs font-normal">{item.title}</div>
            <div className="text-xs font-normal">{item.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapBangkok;
