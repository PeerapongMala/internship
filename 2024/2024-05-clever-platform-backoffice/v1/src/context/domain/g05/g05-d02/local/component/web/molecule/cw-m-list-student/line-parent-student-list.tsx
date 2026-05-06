import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import API from '@domain/g05/g05-d02/g05-d02-p03-lesson/local/api/group/lesson/restapi';
import {
  StudentUnlockResponse,
  StudentUnlock,
} from '../../../../../g05-d02-p03-lesson/local/type';

const StudentList = () => {
  const [students, setStudents] = useState<StudentUnlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res: StudentUnlockResponse = await API.GetAllStudents(
          '1', // classId
          1, // page
          10, // limit
          'name',
          '',
        );

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

  const handleSelect = (studentId: string) => {
    const context = localStorage.getItem('studentListContext');
    let basePath = '/line/parent/clever';

    switch (context) {
      case 'dashboard':
        basePath = '/line/parent/clever/dashboard';
        break;
      case 'homework':
        basePath = '/line/parent/clever/homework/student';
        break;
      case 'announcement':
        basePath = '/line/parent/clever/announcement/student';
        break;
    }

    localStorage.setItem('selectedStudentId', studentId);
    navigate({ to: `${basePath}/${studentId}` });
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
          <li
            key={student.id}
            className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
            onClick={() => handleSelect(student.id)}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <IconUser className="h-6 w-6 text-gray-400" />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="text-[14px]">
                {student.title} {student.first_name} {student.last_name}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
