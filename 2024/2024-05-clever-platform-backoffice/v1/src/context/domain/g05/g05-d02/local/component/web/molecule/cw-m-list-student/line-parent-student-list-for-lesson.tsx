import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import API from '@domain/g05/g05-d02/g05-d02-p03-lesson/local/api/group/lesson/restapi';
import {
  StudentUnlockResponse,
  StudentUnlock,
  StudentResponseLesson,
} from '../../../../../g05-d02-p03-lesson/local/type';
import CWAvatar from '@component/web/atom/cw-a-avatar';

const StudentList = () => {
  const [students, setStudents] = useState<StudentResponseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res: StudentResponseLesson = await API.GetAllStudentsListForLesson(
          '1', // classId
          1, // page
          10, // limit
          'name',
          '',
        );

        //console.log('Res in new API: ', res.data);

        setStudents(res.data || []);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('ไม่สามารถโหลดรายชื่อนักเรียนได้');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Add click handler function
  const handleSelect = (studentId: string) => {
    navigate({ to: `/line/parent/clever/${studentId}` });
  };

  if (loading) return <div className="flex justify-center p-6">กำลังโหลด...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="mx-auto w-full max-w-md pb-20">
      <div className="flex items-center justify-between p-4">
        <p className="text-[14px] font-medium">นักเรียน</p>
      </div>

      <ul className="divide-y">
        {students.map((student) => (
          <>
            {console.log('Student Array: ', students)}
            {console.log('Student id: ', student.user_id)}
            <li
              key={student.user_id}
              className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
              onClick={() => handleSelect(student.user_id)}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <CWAvatar
                  src={student.image_url || ''}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="ml-4 flex-1">
                <h3 className="text-[14px]">
                  {student.title} {student.first_name} {student.last_name}
                </h3>
              </div>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
