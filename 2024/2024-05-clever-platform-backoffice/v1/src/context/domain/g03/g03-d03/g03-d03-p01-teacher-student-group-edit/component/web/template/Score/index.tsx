import { useEffect, useMemo, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import CWNeutralBox from '@component/web/cw-neutral-box';
import API from '@domain/g03/g03-d03/local/api';
import CwScore from './wc-t-score';
import CwLesson from './wc-t-lesson';
import CwLevel from './wc-t-level';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
dayjs.extend(buddhistEra);

const TeacherStudentGroupScore = () => {
  const { studentGroupId } = useParams({ strict: false });
  const [subTabScore, setSubTabScore] = useState<number>(0);
  const [titleLesson, setTitleLesson] = useState<{
    curriculum_group_short_name?: string;
    subject_name?: string;
    lesson_name?: string;
    lesson_id?: string;
    sub_lesson_name?: string;
    sub_lesson_id?: string;
  }>({
    curriculum_group_short_name: '',
    subject_name: '',
    lesson_name: '',
    lesson_id: '',
    sub_lesson_name: '',
    sub_lesson_id: '',
  });
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();
  useEffect(() => {
    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code == 200) {
        let data: StudentGroupInfo = res.data;
        if (Array.isArray(data)) {
          data = data[0];
        }
        setStudentGroup(data);
      }
    });
  }, []);

  const showSubTab = useMemo(() => {
    switch (subTabScore) {
      case 1:
        return (
          <CwLesson
            subTabScore={subTabScore}
            setSubTabScore={setSubTabScore}
            setTitleLesson={setTitleLesson}
            titleLesson={titleLesson}
          />
        );
      case 2:
        return (
          <CwLevel
            subTabScore={subTabScore}
            setSubTabScore={setSubTabScore}
            titleLesson={titleLesson}
          />
        );
      default:
        return (
          <CwScore setSubTabScore={setSubTabScore} setTitleLesson={setTitleLesson} />
        );
    }
  }, [subTabScore]);

  return (
    <div className="flex flex-col gap-5">
      <CWNeutralBox>
        <h1 className="text-2xl font-bold">
          <div>
            <h1 className="text-2xl font-bold">
              <div>
                <h1 className="text-2xl font-bold">{studentGroup?.name}</h1>
              </div>
            </h1>
          </div>
        </h1>
        <h2>
          {`ปีการศึกษา: ${studentGroup?.class_academic_year} / ${studentGroup?.subject_name} / ${studentGroup?.class_year} / ห้อง ${studentGroup?.class_name}`}
        </h2>
      </CWNeutralBox>
      {showSubTab}
    </div>
  );
};

export default TeacherStudentGroupScore;
