import IconImport from "@/components/Icon/IconImport"
import Breadcrumb from "./components/Breadcrumb"
import Phorpor6Table from "./components/Phorpor6Table"
import SchoolCard from "./components/SchoolCard"
import Tabs from "./components/Tabs"
import IconExport from "@/components/Icon/IconExport"
import IconMagnifer from "@/components/Icon/IconMagnifer"
import IconDoubleAltArrowRight from "@/components/Icon/IconDoubleAltArrowRight"
import IconAltArrowRight from "@/components/Icon/IconAltArrowRight"
import { InputDateRange } from "./components/InputDateRange"

export default function Phorpor6() {
  const school = {
    logoURL: "",
    name: "โรงเรียนสาธิตมัธยม",
    id: "00000000001",
    shortId: "AA109"
  }

  const studentOrigins = [
    {
      name: "ด.ช. สมหมาย ชายสิงห์",
      no: 1,
      subject: {
        thai: 80,
        english: 80,
        math: 80,
        science: 80,
        social: 80,
      },
      classNo: 2
    },
    {
      name: "ด.ญ. พรประภัสลวดี ประเสริญสงการณ์เจริญพรรุ่งเรืองกิจการเติบโตมโหลาฬวาฬเกยตื้น",
      no: 2,
      subject: {
        thai: 50,
        english: 50,
        math: 50,
        science: 50,
        social: 50,
      },
      classNo: 1
    },
  ]

  const students = Array(12).fill(studentOrigins).flat().map((student, index) => ({
    ...student,
    no: index + 1
  }))

  const paginates = [1, 2]
  const pageSelectedNo = 1

  const subjects = [
    { id: "thai", name: "ภาษาไทย" },
    { id: "math", name: "คณิตศาสตร์" },
    { id: "science", name: "วิทยาศาสตร์และเทคโนโลยี" },
    { id: "social", name: "สังคมศึกษา ศาสนา และวัฒนธรรม" },
    { id: "english", name: "ภาษาอังกฤษ" },
    { id: "history", name: "ประวัติศาสตร์" },
    { id: "pe", name: "สุขศึกษาและพลศึกษา" },
    { id: "art", name: "ศิลปะ" },
    { id: "job", name: "การงานอาชีพ" },
    { id: "englishForCommu", name: "ภาษาอังกฤษเพื่อการสื่อสาร" },
  ]

  const schoolYears = ["ปีการศึกษา 2567", "ปีการศึกษา 2566", "ปีการศึกษา 2565"]
  const classes = ["ประถมศึกษาปีที่ 1", "ประถมศึกษาปีที่ 2", "ประถมศึกษาปีที่ 3"]
  const rooms = ["ห้อง 1", "ห้อง 2", "ห้อง 3"]

  return (
    <div className="flex flex-col gap-4 px-4">
      <Breadcrumb breadcrumbs={["โรงเรียนสาธิตมัธยม", "การเรียนการสอน", "ระบบตัดเกรด (ปพ.)"]} />
      <SchoolCard school={school} />
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold">ระบบตัดเกรด (ปพ.6)</div>
        <Tabs tabs={[
          { name: "ปพ.6", id: "" }, 
          { name: "เล่มปพ. 6", id: ""},
          { name: "ใบรับรอง", id: ""},
          { name: "คะแนนรายชั้น", id: "scores"},
          { name: "เกรดรายชั้น", id: ""},
          { name: "เกรดร้อยละ", id: ""},
        ]} />

        <div className="flex flex-col gap-4 p-4 shadow-sm bg-white">
          <div className="flex justify-between">
            <div className="flex gap-2 *:flex">
              <button className="btn shadow-md bg-primary text-white gap-2 px-4 items-center"><IconImport className="*:fill-white size-5" /> CSV</button>
              <button className="btn shadow-md bg-primary text-white gap-2 px-4 items-center"><IconExport className="*:fill-white size-5" /> CSV</button>
            </div>
            <div className="flex gap-2 border-2 rounded-md">
              <input placeholder="ค้นหา" className="px-3" type="search" />
              <div className="flex justify-center items-center pr-2"><IconMagnifer className="*:fill-black size-5" /></div>
            </div>
          </div>

          <div className="flex gap-2 *:w-64 *:border-2 *:rounded-md w-full overflow-auto">
            <InputDateRange />
            {[
              schoolYears,
              classes,
              rooms,
            ].map((options, index) => (
              <select className="px-2" key={`select-${index + 1}`}>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ))}
          </div>

          <Phorpor6Table students={students} subjects={subjects} />
          
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div>แสดงจาก 1 จาก 12 หน้า</div>
              <select className="px-2 border-2 p-1 rounded-md w-16">
                {[10, 25, 50, 100].map((option) => (
                    <option key={`page-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 *:flex *:justify-center *:items-center *:size-9 *:rounded-full">
              <button className="bg-black-light">
                <div>
                  <IconDoubleAltArrowRight className="-rotate-180 size-5 *:fill-black" />
                </div>
              </button>
              {paginates.map((page) => (
                <button key={`paginate-${page}`} className={`bg-black-light ${page == pageSelectedNo ? "!bg-primary text-white" : ""}`}>{page}</button>
              ))}
              {pageSelectedNo < paginates.length && <button className="bg-black-light">
                <IconAltArrowRight className="size-5 *:fill-black" />
              </button>}
              <button className="bg-black-light"><IconDoubleAltArrowRight className="size-5 *:fill-black" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}