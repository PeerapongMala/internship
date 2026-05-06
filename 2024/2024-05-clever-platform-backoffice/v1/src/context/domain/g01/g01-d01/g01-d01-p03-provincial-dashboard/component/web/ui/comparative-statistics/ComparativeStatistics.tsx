import { FC, useEffect, useRef, useState } from 'react';
import { RxDownload } from 'react-icons/rx';
import ChartBar from './ChartBar';
import AccordionList from './AccordionList';
import DonutChart from './DonutChart';
import CWSelect from '@component/web/cw-select';
import {
  StatUsage,
  TreeDistrict,
} from '@domain/g01/g01-d01/local/api/group/provincial-dashboard/type';
import API from '@domain/g01/g01-d01/local/api';
import DocumentPDF from './DocumentPDF';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import CWButton from '@component/web/cw-button';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import { TSubjectType } from '@domain/g06/g06-d06/local/types/student-report-form';

interface ComparativeStatisticsProps {
  province: string;
  startDate: string;
  endDate: string;
}

const ComparativeStatistics: FC<ComparativeStatisticsProps> = ({
  province,
  startDate,
  endDate,
}) => {
  const statisticsReportRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState(true);
  const [sortType, setSortType] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [highestAreaScore, setHighestAreaScore] = useState<number>(0);
  const [averageAreaScore, setAverageAreaScore] = useState<number>(0);
  const [lowestScore, setLowestScore] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [treeDistrict, setTreeDistrict] = useState<TreeDistrict[]>([]);
  const [chartData, setChartData] = useState<StatUsage[]>([]);
  const [imageBarUrl, setImageBarUrl] = useState<string>('');
  const [imageDonutUrl, setImageDonutUrl] = useState<string>('');

  const [isShowPDF, setIsShowPDF] = useState(false);

  const handleChange = (e: { target: { checked: boolean } }) => {
    setIsChecked(e.target.checked);
  };

  const sortStatUsage = (data: StatUsage[], isChecked: boolean): StatUsage[] => {
    return [...data].sort((a, b) => (isChecked ? b.value - a.value : a.value - b.value));
  };

  const fetchDataOverview = async (
    province: string,
    startDate: string,
    endDate: string,
    sortType: string,
    district: string,
  ) => {
    if (province && startDate && endDate) {
      API.provincialDashboard
        .GetCompareStatistics(startDate, endDate, province, sortType, district)
        .then((res) => {
          if (res.status_code == 200) {
            setPercentage(res.data.over_all_province.percentage_star);
            setHighestAreaScore(res.data.over_all_province.max_country_star_count);
            setAverageAreaScore(res.data.over_all_province.avg_country_star_count);
            setLowestScore(res.data.over_all_province.min_star_count);
            setAverageScore(res.data.over_all_province.avg_star_count);
            setHighestScore(res.data.over_all_province.max_star_count);
            setTreeDistrict(res.data.tree_district);
            setChartData(sortStatUsage(res.data.stat_usage, isChecked));
          }
        });
    }
  };

  useEffect(() => {
    fetchDataOverview(province, startDate, endDate, sortType, district);
  }, [sortType, province, startDate, endDate, district]);

  useEffect(() => {
    setChartData((prevData) => sortStatUsage(prevData, isChecked));
  }, [isChecked]);

  const students: StudentDetailDto = {
    id: 2,
    formId: 5,
    order: 1,
    studentId: 3,
    createdAt: '2025-03-03T10:24:44.515041Z',
    studentIdNo: 'STU003',
    title: 'เด็กชาย',
    thaiFirstName: 'สมปอง',
    thaiLastName: 'รักเรียน',
    engFirstName: 'Sompong',
    engLastName: 'Rukrian',
    academicYear: '2567',
    year: 'ป.1',
    schoolRoom: 'ห้อง 4',
    school_address: 'ท่าทราย เมืองนนบุรี',
    age_year: 1,
    age_month: 2,
    normal_credits: 11, // พื้นฐาน
    extra_credits: 12, // เพิ่มเติม
    total_credits: 23, // รวม
    province: 'กรุงเทพมหานคร',
    dataJson: {
      school_name: 'โรงเรียนสาธิตมัธยม',
      school_area: 'สำนักงานเขตการศึกษาเขต 1',
      evaluationStudentId: 3,
      title: 'เด็กชาย',
      thaiFirstName: 'สมปอง',
      thaiLastName: 'รักเรียน',
      engFirstName: 'Sompong',
      engLastName: 'Rukrian',
      number: 2,
      studentId: 'STU003',
      birthDate: '2005-01-01',
      citizenNo: '1234567890123',
      nationality: 'Thai',
      religion: 'Buddhism',
      parentMaritalStatus: 'married',
      gender: 'ช',
      ethnicity: 'Thai',
      scorePercentage: 66,
      totalScoreRank: 2,
      averageLearningScore: 2.5,
      averageLearningRank: 2,

      subject: [
        {
          subjectCode: 'คณิตศาสตร์',
          subjectName: 'คณิตศาสตร์',
          hours: '1',
          totalScore: 100,
          avgScore: 73.33333333333333,
          score: 66,
          grade: '2.5',
          note: '',
          sheetId: 0,
          credits: 3,
          type: TSubjectType.PRIMARY,
        },
      ],
      general: [
        {
          subjectName: null,
          generalType: 'กิจกรรมพัฒนาผู้เรียน',
          generalName: 'กิจกรรมพัฒนาผู้เรียน ประถม',
          evaluationStudentId: 2,
          maxAttendance: {},
          studentIndicatorData: [
            {
              indicatorId: null,
              indicatorGeneralName: 'แนะแนว',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ลูกเสือ-เนตรนารี',
              value: 2,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ชุมนุม',
              value: 2,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'กิจกรรมเพื่อสังคม และสาธารณประโยชน์',
              value: 0,
            },
          ],
          nutrition: [[{ date: '2024-06-01' }, { date: '2024-06-15' }]],
        },
        {
          subjectName: null,
          generalType: 'สมรรถนะ',
          generalName: 'สมรรถนะ ประถม',
          evaluationStudentId: 2,
          maxAttendance: {},
          studentIndicatorData: [
            {
              indicatorId: null,
              indicatorGeneralName: 'สมรรถนะสำคัญของผู้เรียน',
              value: 3,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ผลการประเมินสมรรถนะสำคัญของผู้เรียน',
              value: 0,
            },
          ],
          nutrition: [[{ date: '2024-06-01' }, { date: '2024-06-15' }]],
        },
        {
          subjectName: null,
          generalType: 'คุณลักษณะอันพึงประสงค์',
          generalName: 'คุณลักษณะอันพึงประสงค์ ประถม',
          evaluationStudentId: 2,
          maxAttendance: {},
          studentIndicatorData: [
            {
              indicatorId: null,
              indicatorGeneralName: 'รักชาติ',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ซื่อสัตย์',
              value: 3,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'มีวินัย',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ใฝ่เรียนรู้',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'พอเพียง',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'มุ่งมั่น',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'เป็นไทย',
              value: 10,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'สาธารณะ',
              value: 0,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ผลประเมินคุณลักษณะอันพึงประสงค์',
              value: 3,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'อ่าน คิดวิเคราะห์ และเขียนสื่อความ',
              value: 1,
            },
            {
              indicatorId: null,
              indicatorGeneralName: 'ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ',
              value: 4,
            },
          ],
          nutrition: [[{ date: '2024-06-01' }, { date: '2024-06-15' }]],
        },
      ],
      subjectTeacher: '-',
      headOfSubject: '-',
      principal: '-',
      registrar: '-',
      signDate: '2025-03-03 10:24',
      issueDate: '2025-03-03 10:24',
      fatherTitle: 'Mr.',
      fatherFirstName: 'สมพงษ์',
      fatherLastName: 'รักเรียน',
      fatherOccupation: '-',
      motherTitle: 'Mrs.',
      motherFirstName: 'สมศรี',
      motherLastName: 'รักเรียน',
      motherOccupation: '-',
      guardianTitle: 'Mr.',
      guardianFirstName: 'สมพงษ์',
      guardianLastName: 'รักเรียน',
      guardianRelation: 'Father',
      guardianOccupation: '-',
      addressNo: '99/1',
      addressMoo: '5',
      addressSubDistrict: 'ตำบลทดสอบ',
      addressDistrict: 'อำเภอทดสอบ',
      addressProvince: 'จังหวัดทดสอบ',
      addressPostalCode: '10110',
      additionalField: null,
    },
  };

  return (
    <div className="w-full">
      <div className="h-14 w-[200px] pt-4">
        <PDFDownloadLink
          document={
            <DocumentPDF
              student={students}
              overview={{
                province,
                highestAreaScore,
                averageAreaScore,
                lowestScore,
                averageScore,
                highestScore,
              }}
              imageBarUrl={imageBarUrl}
              imageDonutUrl={imageDonutUrl}
              data={treeDistrict}
            />
          }
          fileName="provincial-dashboard-document.pdf"
        >
          {({ blob, url, loading, error }) => {
            return (
              <CWButton
                variant={'primary'}
                title={'Download'}
                disabled={false}
                className="shadow-lg shadow-[#4361EE]"
                icon={<RxDownload size={20} />}
              />
            );
          }}
        </PDFDownloadLink>
      </div>
      <div className="mt-6 grid w-full grid-cols-2 gap-6">
        <div className="rounded-md bg-white p-5">
          <div className="mb-3 font-semibold">รายงานสถิติการใช้งาน</div>
          <div className="my-2 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <label className="relative m-0 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={handleChange}
                />
                <div
                  className="relative flex h-5 w-10 items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out"
                  style={{
                    backgroundColor: isChecked ? '#22c55e' : '#e5e7eb',
                  }}
                >
                  <div
                    className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'} `}
                  />
                </div>
              </label>
              <div className="font-medium">จัดลำดับตามคะแนนสูงสุด</div>
            </div>
          </div>
          <div className="">
            <div className="my-5 font-semibold">รายงานสถิติการใช้งาน</div>
            <ChartBar
              data={chartData}
              setImage={setImageBarUrl}
              setDistrict={setDistrict}
            />
          </div>
        </div>
        <div className="rounded-md bg-white">
          <div
            className="flex h-full flex-col justify-between rounded-md bg-white px-5 py-6"
            ref={statisticsReportRef}
          >
            {/* Title */}
            <h2 className="mb-4 text-lg font-semibold">ภาพรวม{province}</h2>

            {/* Score Range */}
            <div className="grid grid-cols-3 gap-4">
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

            <h2 className="mb-4 text-lg font-semibold">ภาพรวมพื้นที่ {district}</h2>

            {/* Donut Chart */}
            <div className="mb-8 flex items-center justify-center">
              {/* <div className="mb-8 text-center text-base font-medium">ภาพรวม{province}</div> */}
              <DonutChart percentage={percentage} setImage={setImageDonutUrl} />

              {/* Legend */}
              <div className="space-y-4 text-lg font-semibold">
                <div className="flex flex-col items-start justify-start">
                  <div className="flex items-center">
                    <span className="mr-2 h-3 w-3 rounded-full bg-indigo-600"></span>
                    <span className="flex-1">คะแนนสูงสุดของนักเรียนในพื้นที่:</span>
                  </div>
                  <div className="flex-1 pl-5">{highestAreaScore} คะแนน</div>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <div className="flex items-center">
                    <span className="mr-2 h-3 w-3 rounded-full bg-gray-200"></span>
                    <span className="flex-1">คะแนนเฉลี่ยจากนักเรียนในพื้นที่:</span>
                  </div>
                  <div className="flex-1 pl-5">{averageAreaScore} คะแนน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 w-1/5">
        <CWSelect
          options={[
            { label: 'จัดลำดับตามคะแนนสูงสุด', value: 'avg_star_count' },
            { label: 'จัดลำดับตามคะแนนเฉลี่ย', value: 'avg_pass_level' },
            { label: 'จัดลำดับตามด่านที่ผ่านเฉลี่ย', value: 'max_star_count' },
          ]}
          value={sortType}
          onChange={(e) => setSortType(e.target.value)} //avg_star_count, avg_pass_level, max_star_count
          required
        />
      </div>
      <div className="mt-4 rounded-md bg-white p-5">
        <AccordionList data={treeDistrict} />
      </div>
    </div>
  );
};

export default ComparativeStatistics;
