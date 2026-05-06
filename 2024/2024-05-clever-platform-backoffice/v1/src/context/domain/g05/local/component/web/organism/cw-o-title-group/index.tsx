import CWTitleGroup from '@component/web/cw-title-group';
import { API } from '@domain/g05/local/api';
import { TStudent } from '@domain/g05/local/types/student';
import { ReactNode, useEffect, useState } from 'react';

type TitleGroupProps = {
  studentID: string;
  class_ids?: (id: number) => void;
  onStudentLoaded?: (student: TStudent) => void;
  className?: string;
};

const TitleGroup = ({
  studentID,
  class_ids,
  onStudentLoaded,
  className,
}: TitleGroupProps) => {
  const [student, setStudent] = useState<TStudent>();

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    const response = await API.Student.GetStudentInfo({ userId: studentID });

    setStudent(response.data.data);
    if (class_ids && response.data.data?.class_id) {
      class_ids(response.data.data.class_id);
    }
    if (onStudentLoaded && response.data.data) {
      onStudentLoaded(response.data.data);
    }
  };

  const titleText: ReactNode = `${student?.title ?? '-'} ${student?.first_name ?? '-'} ${student?.last_name ?? '-'}`;

  const subTitleText: { totalNumber?: number; title: string }[] = [
    {
      title: `รหัสนักเรียน: ${student?.student_id ?? '-'}`,
    },
    {
      title: `รหัสโรงเรียน: ${student?.school_id ?? '-'} (ตัวย่อ: ${student?.school_code ?? '-'})`,
    },
  ];

  return (
    <div className={`'w-full text-left' ${className}`}>
      <div className="flex flex-col gap-2 rounded-md bg-neutral-100 p-4 text-neutral-900 md:gap-3 md:p-5">
        {/* Title Section */}
        <div className="flex items-center text-base font-bold md:text-lg lg:text-xl">
          {[titleText].map((text, index) => (
            <p key={`listText-${index}`} className="whitespace-nowrap">
              {text}
            </p>
          ))}
        </div>

        {/* Subtitle Section */}
        {subTitleText && subTitleText.length > 0 && (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-1 md:gap-4">
            {subTitleText.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="flex items-center gap-1 text-sm"
              >
                {item.totalNumber && <span>{item.totalNumber}</span>}
                <span className="text-neutral-700">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleGroup;
