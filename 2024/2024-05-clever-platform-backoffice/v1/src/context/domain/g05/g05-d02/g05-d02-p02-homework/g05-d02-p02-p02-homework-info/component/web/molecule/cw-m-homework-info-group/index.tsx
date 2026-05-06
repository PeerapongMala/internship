import CWTitleGroup from '@context/global/component/web/cw-title-group/index';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface HomeworkInfoProps {
  subject: string;
  assignTo: string;
  unit: string;
  assignmentDate: string;
  dueDate: string;
}

const HomeworkInfoGroup = ({
  subject,
  assignTo,
  unit,
  assignmentDate,
  dueDate,
}: HomeworkInfoProps) => {
  const formattedAssignmentDate = dayjs(assignmentDate)
    .locale('th')
    .format(`DD MMM ${dayjs(assignmentDate).year()}`);
  const formattedDueDate = dayjs(dueDate)
    .locale('th')
    .format(`DD MMM ${dayjs(dueDate).year()}`);

  return (
    <div className="w-full">
      <CWTitleGroup listText={[subject, assignTo, unit]} className="bg-neutral-100" />
      <div className="rounded-b-md bg-neutral-100 px-3 pb-3 text-sm text-neutral-700">
        <p>วันที่สั่งการบ้าน: {formattedAssignmentDate}</p>
        <p>กำหนดส่ง: {formattedDueDate}</p>
      </div>
    </div>
  );
};

export default HomeworkInfoGroup;
