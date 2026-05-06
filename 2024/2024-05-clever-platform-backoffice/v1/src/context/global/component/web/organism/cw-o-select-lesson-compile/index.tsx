import { useEffect, useState } from 'react';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import { Lesson } from '@domain/g03/g03-d01/local/type';
import CWModalSelectLesson from '@component/web/cw-modal/cw-modal-select-lesson';
import { getLesson } from '@global/utils/store/get-lesson-data';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type Props = {
  lesson?: Lesson | null;
  onSelected?: (value: Lesson | null) => void;
  class_id: number[];
  subject_id: number[];
  mode?: 'single' | 'multiple';
  clearData?: () => void;
  buttonParentClassName?: string;
  buttonClassName?: string;
  inputClassName?: string;
};

const CWSelectedLessonCompile = ({
  lesson,
  onSelected,
  class_id,
  subject_id,
  mode = 'multiple',
  clearData,
  buttonClassName,
  buttonParentClassName,
  inputClassName,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const lessonData = getLesson();

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [displayLesson, setDisplayLesson] = useState<string>('');

  useEffect(() => {
    if (!selectedLesson && lessonData && lessonData.length > 0) {
      const initialLesson = lesson || lessonData[0];
      setSelectedLesson(initialLesson);
      onSelected?.(initialLesson);
    }
  }, [lessonData, clearData]);

  useEffect(() => {
    setDisplayLesson(selectedLesson ? `${selectedLesson.name}` : '');
  }, [selectedLesson]);

  useEffect(() => {
    if (clearData) {
      setSelectedLesson(null);
      onSelected?.(null);
      (
        StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
      ).setLessonData();
    }
  }, [clearData]);

  const handleSelectLesson = (lessons: Lesson[]) => {
    if (lessons.length > 0) {
      const selected = lessons[0];
      setSelectedLesson(selected);
      onSelected?.(selected);
      setOpenModal(false);
    }
  };
  const handleClear = () => {
    setSelectedLesson(null);
    onSelected?.(null);
    (
      StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
    ).setLessonData();
  };

  return (
    <div className="flex w-full gap-2">
      <CWButton
        title="เลือกบทเรียน"
        className={cn('shrink-0', buttonClassName)}
        parentClassname={cn(buttonParentClassName)}
        onClick={() => setOpenModal(true)}
      />
      <CWInput
        className="w-1/2"
        value={displayLesson}
        onClear={handleClear}
        disabled
        disabledWhiteBg
      />
      <CWModalSelectLesson
        className={inputClassName}
        open={openModal}
        initialSelected={selectedLesson ? [selectedLesson] : []}
        onClose={() => setOpenModal(false)}
        onSelect={handleSelectLesson}
        class_id={class_id}
        subject_id={subject_id}
        mode={mode}
        clearData={clearData}
      />
    </div>
  );
};

export default CWSelectedLessonCompile;
