type Subject = { 
  id: string, 
  name: string, 
  max?: number
}
type Student = { 
  name: string, 
  no: number, 
  subject: {
    [x: string]: number
  },
  sum?: number
  classNo: number
}

export default function Phorpor6Table({ students, subjects }: { students: Student[], subjects: Subject[]}) {

  const maxSubjectPart1 = 13
  // plus 4 = 11 for summary
  const maxSubjectPart2 = 7

  const maxRowScore = 24
  const page = 1

  const subjectPart1s: (Subject|undefined)[] = Array(maxSubjectPart1).fill(undefined).map((_, index) => subjects[index])
  const subjectPart2s: (Subject|undefined)[] = Array(maxSubjectPart2).fill(undefined).map((_, index) => subjects[maxSubjectPart1 + index] ?? undefined)
  students = students.map((student) => ({
    ...student,
    sum: Object.keys(student.subject).reduce((prev, subName) => prev + student.subject[subName], 0)
  }))

  return (
    <div className="overflow-y-hidden">
      <div className="inline-block ring-[1px] ring-gray-200 rounded-md overflow-y-hidden">
        <table className="table-phorpor-6 w-[800px] table-fixed overflow-hidden border-2">
          <thead>
            <tr className="*:text-center">
              <th rowSpan={3} className="w-24">เลขที่</th>
              <th rowSpan={3} className="w-[350px]">ชื่อสกุล</th>
              <th colSpan={maxSubjectPart1} className="w-96">คะแนนผลการเรียน</th>
              <th colSpan={maxSubjectPart2 + 4} className="w-[325px]">คะแนนผลการเรียน</th>
              <th rowSpan={3} className="w-24">ร้อยละ</th>
              <th rowSpan={3} className="w-36">ลำดับที่คะแนนรวม</th>
            </tr>
            <tr>
              {[subjectPart1s, subjectPart2s].map((subjects) => (
                subjects.map((subject, index) => (
                  <th key={(subject?.id ?? "subject-") + index} className="h-36 w-4 -rotate-90">
                    <div className="w-32 whitespace-nowrap translate-x-[-50%] text-ellipsis overflow-hidden">{subject ? subject.name : ""}</div>
                  </th>
                ))
              ))}
              <th colSpan={4} className="w-4 text-center">รวม</th>
            </tr>
            <tr>
              {[subjectPart1s, subjectPart2s].map((subjects, pIndex) => (
                subjects.map((subject, index) => (
                  <th key={"score-" + (subject?.id ?? "") + pIndex + index} className="text-primary !p-0 text-center"><div>{subject ? subject.max ?? "##" : ""}</div></th>
                ))
              ))}
              <th colSpan={4} className="text-center !py-1">100</th>
            </tr>
          </thead>
          <tbody>
              {Array(maxRowScore).fill(undefined).map((_, index) => {
                const student = students[maxRowScore * (page - 1) + index]
                return (
                  <tr key={(student?.name ?? "student-") + index} className="*:text-center h-8">
                    <td className="!p-0">{student?.no}</td>
                    <td className="!text-start overflow-hidden !px-1 !py-1 whitespace-nowrap text-ellipsis">{student?.name}</td>
                    {[...subjectPart1s, ...subjectPart2s].map((subject, index) => 
                      <td key={"" + student?.no + (subject?.id ?? "") + index} className="!p-0 text-center">{student && subject ? student.subject[subject.id] ?? 0 : ""}</td>
                    )}
                    <td colSpan={4} className="text-primary !px-1 !py-1">{student?.sum}</td>
                    <td className="text-primary !px-1 !py-1">{student ? ((student.sum ?? 0) / 100).toFixed(2) : ""}</td>
                    <td className="text-primary !px-1 !py-1">{student ? (student.classNo) : ""}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}