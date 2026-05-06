import { useMemo, useState } from 'react';
import CWModalSelectClass from '../cw-o-modal-select-class';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { getUserData } from '@global/utils/store/getUserData';
import { setUserSubjectDataByIndex } from '@global/utils/store/user-subject';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type Props = {
  classes?: {
    year?: string;
    class_name?: string;
    id?: number;
  };
  onClassSelect?: (value: {
    year?: string;
    class_name?: string;
    class_id: number;
  }) => void;
  onChange?: (classIds: number[]) => void;
  autoSelectFirstClass?: boolean;

  buttonClassName?: string;
  inputClassName?: string;
};

const CWClassSelector = ({
  classes,
  onClassSelect,
  autoSelectFirstClass,
  onChange,
  buttonClassName,
  inputClassName,
}: Props) => {
  const userData = getUserData();

  const [openModal, setOpenModal] = useState(false);

  const displayClass = useMemo(
    () =>
      classes?.year && classes?.class_name ? `${classes.year}/${classes.class_name}` : '',
    [classes],
  );

  const handleSelectClass = (val: {
    year?: string;
    class_name?: string;
    class_id: number;
  }) => {
    const oldYear = classes?.year;
    const isYearChanged = val.year !== oldYear;

    onClassSelect?.(val);
    onChange?.([val.class_id]);

    if (isYearChanged) {
      (
        StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
      ).setLessonData();
      onChange?.([]);
    }
    const subjectIndex = userData.subject.findIndex(
      (subject) => subject.year_name == val.year,
    );
    if (subjectIndex == -1) return;

    setUserSubjectDataByIndex(subjectIndex, userData);
  };

  const handleClear = () => {
    onClassSelect?.({ class_id: 0 });
    onChange?.([]);
    (
      StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
    ).setClassData();
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('shrink-0', buttonClassName)}>
        <CWButton
          title="เลือกห้องเรียน"
          className="shrink-0 text-nowrap"
          onClick={() => setOpenModal(true)}
        />
      </div>

      <CWInput
        className={inputClassName}
        value={displayClass}
        onClear={handleClear}
        disabled
        disabledWhiteBg
      />
      <CWModalSelectClass
        open={openModal}
        initialFilter={classes}
        onClose={() => setOpenModal(false)}
        onSelectClass={handleSelectClass}
        autoSelectFirstClass={autoSelectFirstClass}
      />
    </div>
  );
};

export default CWClassSelector;
