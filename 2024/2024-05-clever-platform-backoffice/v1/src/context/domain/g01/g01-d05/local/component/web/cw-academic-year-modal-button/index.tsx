import CWButton from '@component/web/cw-button';
import ModalAcademicYear from '@domain/g03/g03-d04/g03-d04-p01-game-statistic/component/organism/ModalAcademicYear';
import { useState } from 'react';
import { GetAcademicYearRangesResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import CWModalAcademicYearRange from '@component/web/cw-modal/cw-modal-academicyear-range';

interface CWAcademicYearModalButtonProps {
  schoolId?: number;
  onDataChange?: (academic_year: GetAcademicYearRangesResponse | undefined) => void;
  academicYear?: string | number;
  className?: string;
  displaySelectedValue?: boolean;
  placeholder?: string;
  type?: 'button' | 'input';
  deleteMode?: boolean;
  createMode?: boolean;
  onClear?: (e: React.MouseEvent) => void;
}

const CWAcademicYearModalButton = function ({
  schoolId,
  onDataChange,
  academicYear,
  className,
  displaySelectedValue = true,
  placeholder = 'เลือกปีการศึกษา',
  type = 'button',
  deleteMode = true,
  createMode = true,
}: CWAcademicYearModalButtonProps) {
  const [showAcademicYearsModal, setShowAcademicYearsModal] = useState(false);
  const [_academicYear, setAcademicYears] = useState<number | string | undefined>(
    academicYear,
  );

  const handleClearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAcademicYears(undefined);
    onDataChange?.(undefined);
  };

  return (
    <div>
      <CWButton
        type="button"
        title={
          displaySelectedValue
            ? _academicYear
              ? _academicYear.toString()
              : academicYear
                ? academicYear.toString()
                : placeholder
            : placeholder
        }
        outline={type == 'input'}
        variant={type == 'input' ? 'white' : undefined}
        className={`${type == 'button' ? '' : `min-w-48 !justify-start !shadow-none`} ${className || ''}`}
        onClick={() => {
          setShowAcademicYearsModal(true);
        }}
        clearable={true}
        showClear={!!_academicYear}
        onClear={handleClearValue}
      />

      {showAcademicYearsModal && (
        <CWModalAcademicYearRange
          schoolId={schoolId}
          open={showAcademicYearsModal}
          onClose={() => {
            setShowAcademicYearsModal(false);
          }}
          setSelectedValueDateRange={(value) => {
            if (value) {
              onDataChange?.(value);
              setAcademicYears(value?.name);
            }
          }}
          deleteMode={deleteMode}
          createMode={createMode}
        />
      )}
    </div>
  );
};

export default CWAcademicYearModalButton;
