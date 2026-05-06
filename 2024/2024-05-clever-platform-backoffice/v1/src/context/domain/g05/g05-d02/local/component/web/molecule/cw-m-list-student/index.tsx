import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TStudent } from '@domain/g05/local/types/student';
import { API } from '@domain/g05/local/api';
import CWAvatar from '@component/web/atom/cw-a-avatar';

const StudentList = () => {
  const [students, setStudents] = useState<TStudent[]>([]);
  const [loading] = useState(false);
  const [error] = useState<null | string>(null);
  const navigate = useNavigate();

  const handleSelect = (studentId: string) => {
    console.log({ studentId: studentId });
    const context = localStorage.getItem('studentListContext') ?? 'announcement';

    let basePath = '/line/parent/clever';

    switch (context) {
      case 'dashboard':
        basePath = '/line/parent/clever/dashboard';
        break;
      case 'homework':
        basePath = '/line/parent/clever/homework/student';
        break;
      case 'lesson':
        basePath = '/line/parent/choose';
        break;
      case 'announcement':
        basePath = '/line/parent/clever/announcement/student';
        break;
    }

    localStorage.setItem('selectedStudentId', studentId);

    navigate({
      to: `${basePath}/${studentId}`,
    });
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    const response = await API.Student.GetStudentInFamily({ page: 1, limit: -1 });

    setStudents(response.data.data);
  };

  if (loading) return <div className="flex justify-center p-6">กำลังโหลด...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-20">
      <div className="flex items-center justify-between p-4">
        <p className="text-[14px] font-medium">นักเรียน</p>
      </div>

      <ul className="divide-y">
        {students.map((student) => (
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
              <h3 className="text-[14px]">{`${student.first_name} ${student.last_name}`}</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
