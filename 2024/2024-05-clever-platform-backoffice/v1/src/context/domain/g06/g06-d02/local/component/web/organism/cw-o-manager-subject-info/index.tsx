import CWWhiteBox from '@component/web/cw-white-box';
import SelectTemplate from '../../molecule/cw-m-select-template';
import SelectClass from '../../molecule/cw-m-select-class';
import SelectYear from '../../molecule/cw-m-select-year';
import {
  TEvaluationFormCreate,
  TEvaluationFormEdit,
} from '@domain/g06/g06-d02/local/types/grade';
import { TEvaluationFormOnChange } from '@domain/g06/g06-d02/local/types/props';
import SelectAcademicYear from '@domain/g06/local/components/web/molecule/cw-m-select-academic-year';
import { getUserData } from '@global/utils/store/getUserData';

type ManagerSubjectInfoPanelProps = {
  isSubmitStep?: boolean;
  evaluationForm: TEvaluationFormCreate | TEvaluationFormEdit;
  onChange?: TEvaluationFormOnChange;
  disabledEdit?: boolean;
};

const ManagerSubjectInfoPanel = ({
  evaluationForm,
  onChange,
  isSubmitStep,
  disabledEdit,
}: ManagerSubjectInfoPanelProps) => {
  const userData = getUserData();
  const { school_id } = userData;

  return (
    <CWWhiteBox className="flex w-full flex-col gap-4 p-4">
      <span className="text-lg font-bold">ข้อมูลวิชา</span>

      <div className="flex w-full justify-between gap-5">
        <SelectAcademicYear
          value={evaluationForm.academic_year ? Number(evaluationForm.academic_year) : 0}
          name="academic_year"
          label="ปีการศึกษา"
          required={isSubmitStep}
          displayRequired
          disabled={disabledEdit}
          onChange={(v) => {
            onChange?.('academic_year', String(v));
            onChange?.('year', undefined);
            onChange?.('school_room', undefined);
            onChange?.('template_id', undefined);
          }}
        />

        <SelectYear
          // for some reason academic is "0"
          // and for some reason first time is undefined
          disabledEdit={
            disabledEdit ||
            !evaluationForm.academic_year ||
            evaluationForm.academic_year == '0'
          }
          value={evaluationForm.year}
          name="year"
          isSubmitStep={isSubmitStep}
          onChange={(v) => {
            onChange?.('year', v);
            onChange?.('school_room', undefined);
            onChange?.('template_id', undefined);
          }}
        />
        <SelectClass
          disabledEdit={
            disabledEdit || !evaluationForm.academic_year || !evaluationForm.year
          }
          schoolID={school_id}
          selectedAcademicYear={evaluationForm.academic_year ?? ''}
          selectedYear={evaluationForm.year ?? ''}
          value={evaluationForm.school_room}
          name="school_room"
          isSubmitStep={isSubmitStep}
          onChange={(v) => {
            onChange?.('school_room', v);
            onChange?.('template_id', undefined);
          }}
        />

        <SelectTemplate
          disabledEdit={
            disabledEdit || !evaluationForm.academic_year || !evaluationForm.school_room
          }
          isSubmitStep
          schoolID={school_id}
          year={evaluationForm.year}
          value={evaluationForm.template_id}
          name="template_id"
          onChange={(v) => {
            onChange?.('template_id', v);
          }}
        />
      </div>
    </CWWhiteBox>
  );
};

export default ManagerSubjectInfoPanel;
