import { FC, useEffect, useState } from 'react';
import { FiBook, FiHome, FiUsers } from 'react-icons/fi';
import MapBangkok from './MapBangkok';
import DonutChart from '../comparative-statistics/DonutChart';
import API from '@domain/g01/g01-d01/local/api';

export const renderTotalOverview = (
  name: string,
  value: number,
  unit: string,
  icon: JSX.Element,
) => {
  return (
    <div className="flex items-center justify-between" key={name}>
      <div className="flex items-center">
        <div className="mr-2 h-5 w-5">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-600">{name}</p>
          <p className="font-light">
            {value} {unit}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ScoreOverviewProps {
  province: string;
  startDate: string;
  endDate: string;
  provinceCode: string;
}

const ScoreOverview: FC<ScoreOverviewProps> = ({
  province,
  provinceCode,
  startDate,
  endDate,
}) => {
  const [loadings, setLoadings] = useState<boolean>(false);
  const [notData, setNotData] = useState<boolean>(false);
  const [overviewTotal, setOverviewTotal] = useState([
    {
      name: 'โรงเรียนทั้งหมด',
      value: 14,
      unit: 'เขต',
      icon: <FiHome size={20} />,
    },
    {
      name: 'ส่งเสริมทั้งหมด',
      value: 32,
      unit: 'ครั้ง',
      icon: <FiBook size={20} />,
    },
    {
      name: 'นักเรียนทั้งหมด',
      value: 884,
      unit: 'คน',
      icon: <FiUsers size={20} />,
    },
  ]);
  const [selectDistrict, setSelectDistrict] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(81.98);
  const [highestAreaScore, setHighestAreaScore] = useState<number>(1230.75);
  const [averageAreaScore, setAverageAreaScore] = useState<number>(110.53);
  const [lowestScore, setLowestScore] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);

  const fetchDataOverview = async (
    province: string,
    startDate: string,
    endDate: string,
    district: string,
  ) => {
    setLoadings(true);
    if (province && startDate && endDate && district) {
      API.provincialDashboard
        .GetScoreOverview(startDate, endDate, province, district)
        .then((res) => {
          if (res.status_code == 200) {
            setPercentage(res.data.percentage_star);
            setHighestAreaScore(res.data.country_maximum_star_count);
            setAverageAreaScore(res.data.avg_star_count);
            setLowestScore(res.data.minimum_star_count);
            setAverageScore(res.data.avg_star_count);
            setHighestScore(res.data.maximum_star_count);
            setOverviewTotal([
              {
                name: 'โรงเรียนทั้งหมด',
                value: res.data.total_school_count,
                unit: 'เขต',
                icon: <FiHome size={20} />,
              },
              {
                name: 'ส่งเสริมทั้งหมด',
                value: res.data.total_class_room_count,
                unit: 'ครั้ง',
                icon: <FiBook size={20} />,
              },
              {
                name: 'นักเรียนทั้งหมด',
                value: res.data.total_student_count,
                unit: 'คน',
                icon: <FiUsers size={20} />,
              },
            ]);
            setNotData(false);
            setTimeout(() => {
              setLoadings(false);
            }, 1500);
          } else {
            setSelectDistrict('');
            setLoadings(false);
          }
        });
    } else {
      setLoadings(false);
    }
  };

  useEffect(() => {
    setNotData(true);
    fetchDataOverview(province, startDate, endDate, selectDistrict);
  }, [selectDistrict, province, startDate, endDate]);

  // ✅ ฟังก์ชันเลือกข้อความ error
  const getErrorMessage = () => {
    if (!startDate || !endDate) return 'กรุณาเลือกวันที่เริ่มต้น-สิ้นสุด';
    if (!selectDistrict) return 'กรุณาเลือกอำเภอ';
    return '';
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="h-full">
        {loadings ? (
          <div className="h-full rounded-md bg-white pt-10 text-center">
            <div role="status">
              <svg
                className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        ) : notData ? (
          <div className="h-full rounded-md bg-white pt-10 text-center">
            {getErrorMessage()}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between rounded-md bg-white px-5 py-16">
            <div className="mx-auto mb-8 flex w-[95%] justify-between">
              {overviewTotal.map((item) =>
                renderTotalOverview(item.name, item.value, item.unit, item.icon),
              )}
            </div>

            <h2 className="mb-4 text-base font-medium">ภาพรวมโครงการ</h2>

            <div className="mb-8 flex flex-col items-center">
              <div className="mb-8 text-center text-base font-medium">
                ภาพรวม{selectDistrict}
              </div>
              <DonutChart percentage={percentage} />
            </div>

            <div className="space-y-4 font-semibold">
              <div className="flex items-center">
                <span className="mr-2 h-3 w-3 rounded-full bg-indigo-600"></span>
                <span className="flex-1">
                  คะแนนที่สูงสุดจากทุกเขตพื้นที่ {highestAreaScore}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 h-3 w-3 rounded-full bg-gray-200"></span>
                <span className="flex-1">
                  คะแนนเฉลี่ยของพื้นที่ทั้งหมด {averageAreaScore}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600">คะแนนที่ต่ำที่สุด</p>
                <p className="font-light">{lowestScore} คะแนน</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600">คะแนนเฉลี่ย</p>
                <p className="font-light">{averageScore} คะแนน</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600">คะแนนที่สูงที่สุด</p>
                <p className="font-light">{highestScore} คะแนน</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <MapBangkok province={provinceCode} selectDistrict={setSelectDistrict} />
      </div>
    </div>
  );
};

export default ScoreOverview;
