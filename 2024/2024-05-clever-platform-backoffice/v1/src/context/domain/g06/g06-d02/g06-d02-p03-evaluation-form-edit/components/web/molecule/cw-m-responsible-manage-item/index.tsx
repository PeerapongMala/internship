import CWSwitchTabs from '@component/web/cs-switch-taps';
import { useMemo, useState } from 'react';
import ResponsibleTable from '../../atom/cw-m-responsible-table';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import useModal from '@global/utils/useModal';

import ModalSelectTeacher from '../cw-modal-select-teacher';
import {
  TGradeResponsiblePerson,
  TResponsiblePersonData,
} from '@domain/g06/g06-d02/local/types/grade';
import {
  EEvaluationFormType,
  EResponsibleTeacherType,
} from '@domain/g06/g06-d02/local/enums/evaluation';

type ResponsibleManageItemProps = {
  item: TGradeResponsiblePerson;
  onUpdateResponsiblePerson?: (responsible: TGradeResponsiblePerson) => void;
};

const ResponsibleManageItem = ({
  item,
  onUpdateResponsiblePerson,
}: ResponsibleManageItemProps) => {
  const { open, close, isOpen } = useModal();

  const [activeTab, setActiveTab] = useState(1);

  const label = useMemo(() => {
    return item.type === EEvaluationFormType.SUBJECT ? 'ครูประจำวิชา' : 'ครูประจำชั้น';
  }, [item.type]);

  const personTeachers = useMemo(() => {
    return item.person_data.filter(
      (person) => person.user_type === EResponsibleTeacherType.TEACHER,
    );
  }, [item.person_data]);
  const personOthers = useMemo(() => {
    return item.person_data.filter(
      (person) => person.user_type === EResponsibleTeacherType.OTHER,
    );
  }, [item.person_data]);

  const tabs = [
    {
      id: '1',
      label: label,
      onClick: () => {
        setActiveTab(1);
      },
    },
    {
      id: '2',
      label: 'บัญชีเพิ่มเติม',
      onClick: () => {
        setActiveTab(2);
      },
    },
  ];

  const handleUpdateResponsiblePerson = (teachers: TResponsiblePersonData[]) => {
    onUpdateResponsiblePerson?.({
      ...item,
      person_data: [
        ...item.person_data.filter(
          (teacher) => teacher.user_type === EResponsibleTeacherType.TEACHER,
        ),
        ...teachers,
      ],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <CWSwitchTabs tabs={tabs} />

      {activeTab === 2 && (
        <CWButton
          className="w-fit"
          icon={<IconPlus />}
          outline
          type="button"
          title={'เพิ่มบัญชี'}
          onClick={activeTab === 2 ? open : undefined}
        />
      )}

      {activeTab === 1 ? (
        <ResponsibleTable persons={personTeachers} />
      ) : (
        <ResponsibleTable
          persons={personOthers}
          onRemove={(removedID: string) => {
            handleUpdateResponsiblePerson(
              item.person_data.filter((person) => person.user_id !== removedID),
            );
          }}
        />
      )}

      {isOpen && (
        <ModalSelectTeacher
          // can only edit other person.
          selectedTeacher={personOthers}
          isOpen={isOpen}
          onClose={close}
          onOpen={close}
          onUpdateSelectedTeacher={handleUpdateResponsiblePerson}
          grade_subject_id={item.clever_subject_id}
        />
      )}
    </div>
  );
};

export default ResponsibleManageItem;
