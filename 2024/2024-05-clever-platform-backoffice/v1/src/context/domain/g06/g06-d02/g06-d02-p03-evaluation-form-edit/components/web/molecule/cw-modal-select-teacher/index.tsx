import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import TableSelectTeacher from '../../atom/cw-a-table-select-teacher';
import CWInputSearch from '@component/web/cw-input-search';
import { useState } from 'react';
import { TTeacherUser } from '@domain/g06/g06-d02/local/types/admin';

import { TResponsiblePersonData } from '@domain/g06/g06-d02/local/types/grade';
import { EResponsibleTeacherType } from '@domain/g06/g06-d02/local/enums/evaluation';
import { mapTeacherUserToResponsiblePersonData } from '@domain/g06/g06-d02/local/helpers/teacher';
import { getUserData } from '@global/utils/store/getUserData';
import useFetchTeacher from '@domain/g06/g06-d02/local/hooks/useFetchTeacher';

type ModalSelectTeacherProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onUpdateSelectedTeacher?: (teachers: TResponsiblePersonData[]) => void;
  selectedTeacher: TResponsiblePersonData[];
  grade_subject_id?: number;
};

const ModalSelectTeacher = ({
  isOpen,
  onClose,
  onOpen,
  onUpdateSelectedTeacher,
  selectedTeacher: personTeachers,
  grade_subject_id,
}: ModalSelectTeacherProps) => {
  const userData = getUserData();

  const { teachers, fetching, searchText, setSearchText, pagination, setPagination } =
    useFetchTeacher({ gradeSubjectID: grade_subject_id });

  const [selectedTeacher, setSelectedTeacher] = useState<TTeacherUser[]>(
    personTeachers.map((teacher) => ({
      ...teacher,
      id: teacher.user_id,
    })),
  );

  const handleOnOk = () => {
    const teachers = mapTeacherUserToResponsiblePersonData(
      selectedTeacher,
      EResponsibleTeacherType.OTHER,
    );

    onUpdateSelectedTeacher?.(teachers);
    onClose();
  };

  return (
    <CWModalCustom
      className="flex w-[1024px] flex-col gap-5"
      buttonName="เลือก"
      open={isOpen}
      title="เลือกครู"
      onOk={handleOnOk}
      onClose={onClose}
      cancelButtonName="ย้อนกลับ"
    >
      <CWInputSearch
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full"
        inputWidth="full"
        placeholder="ค้นหา"
      />

      <div className="h-[1px] bg-neutral-200"></div>

      <TableSelectTeacher
        fetching={fetching}
        pagination={pagination}
        onPaginationChange={setPagination}
        teachers={teachers}
        selectedTeacher={selectedTeacher}
        onSelectedTeacherChange={setSelectedTeacher}
      />
    </CWModalCustom>
  );
};

export default ModalSelectTeacher;
