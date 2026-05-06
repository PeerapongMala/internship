import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWSwitchTabButton from '@component/web/molecule/cw-m-switch-tab-button';
import { useEffect, useMemo, useRef, useState } from 'react';
import PanelCriteriaAcademic from '../cw-o-panel-criteria-academic';
import CWInput from '@component/web/cw-input';
import {
  TContentIndicator,
  TContentIndicatorSetting,
} from '@domain/g06/local/types/content';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g06/local/api';
import { LevelTypeMapTH } from '@domain/g06/local/constant/level';
import PanelNoCriteria from './components/PanelNoCriteria';
import { validateModalConfigIndicator } from '@domain/g06/local/utils/validate-modal-config-indicator';
import { TStudentIndicatorAdditionalField } from '@domain/g06/g06-d03/local/type';
import PanelCriteriaScoreAdvMode from '../../molecule/cw-m-panel-criteria-score-adv-mode';
import { areFloatsEqual } from '@domain/g06/local/utils/score';
import PanelNoCriteriaScoreAdvMode from '../../molecule/cw-m-panel-no-criteria-score-adv-mode';

export type ModalConfigIndicatorEvaluationCriteriaProps = {
  title?: string;
  viewOnly?: boolean;
  isAcademicContext?: boolean;
  isOpen: boolean;
  subjectID?: number | null;
  evaluationFormSubjectID?: number;
  onClose: () => void;
  onSave?: (
    indicator: TContentIndicator,
    additionalField?: TStudentIndicatorAdditionalField & { value: number },
  ) => void;
  indicator?: TContentIndicator | null;
  disabledEdit?: boolean;

  // feature for advancedMode
  enabledAdvMode?: boolean;
  currentScore?: number;
  maxScore?: number;
  additionalFields?: TStudentIndicatorAdditionalField;
  studentID?: number;
  schoolID?: number;
  sheetID?: number;
  sheetIndicatorID?: number;
};

type TAdditionalField = TStudentIndicatorAdditionalField & { current_score: number };

const ModalConfigIndicatorEvaluationCriteria = ({
  viewOnly,
  title = 'ตั้งค่าการประเมินคะแนน',
  isAcademicContext,
  subjectID,
  evaluationFormSubjectID,
  indicator,
  isOpen,
  onClose,
  onSave,
  disabledEdit,
  enabledAdvMode,
  currentScore,
  maxScore,
  additionalFields,
  studentID,
  schoolID,
  sheetID,
  sheetIndicatorID,
}: ModalConfigIndicatorEvaluationCriteriaProps) => {
  const isFirstRender = useRef(true);

  const [editedIndicator, setEditedIndicator] = useState<TContentIndicator>(
    indicator ?? {
      max_value: 0,
      evaluation_form_subject_id: evaluationFormSubjectID ?? 0,
      name: '',
      sort: -1,
      score_evaluation_type: isAcademicContext
        ? EScoreEvaluationType.ACADEMIC_CRITERIA
        : EScoreEvaluationType.NO_CRITERIA,
    },
  );
  const [editedAdditionalField, setEditedAdditionalField] = useState<TAdditionalField>(
    additionalFields
      ? { ...additionalFields, current_score: currentScore ?? 0 }
      : {
          game_score: 0,
          is_replace_score: false,
          replaced_score: 0,
          current_score: 0,
        },
  );

  const showIndicatorInfo = useMemo(
    () => !enabledAdvMode || !editedAdditionalField.is_replace_score,
    [enabledAdvMode, editedAdditionalField.is_replace_score],
  );

  const tabs = [
    {
      id: EScoreEvaluationType.ACADEMIC_CRITERIA,
      label: 'ใช้เกณฑ์ของนักวิชาการ',
      activeClassName: enabledAdvMode ? 'bg-neutral-500' : undefined,
    },
    {
      id: EScoreEvaluationType.TEACHER_CRITERIA,
      label: 'ใช้เกณฑ์ของครู',
      activeClassName: enabledAdvMode ? 'bg-neutral-500' : 'bg-orange-500',
    },
    {
      id: EScoreEvaluationType.NO_CRITERIA,
      label: 'กรอกคะแนนไม่ใช้เกณฑ์',
      activeClassName: enabledAdvMode ? 'bg-neutral-500' : undefined,
    },
  ]
    .filter(
      (tab) =>
        // only have academic criteria option when created from academic
        !(
          tab.id === EScoreEvaluationType.ACADEMIC_CRITERIA &&
          !indicator?.clever_subject_template_indicator_id
        ),
    )
    .map((tab) => ({
      ...tab,
      onClick: () => handleTabChange(tab.id),
      // disable when edit เกณฑ์การประเมิน
      disabled:
        disabledEdit ||
        enabledAdvMode ||
        // if no subjectID include. can only choose no "กรอกคะแนนไม่ใช้เกณฑ์"
        (!subjectID && tab.id !== EScoreEvaluationType.NO_CRITERIA),
    }));

  const [selectedTab, setSelectedTab] = useState<EScoreEvaluationType | undefined>(
    editedIndicator?.score_evaluation_type
      ? editedIndicator.score_evaluation_type
      : subjectID // if no subjectID include. tab will initial with "กรอกคะแนนไม่ใช้เกณฑ์"
        ? undefined
        : EScoreEvaluationType.NO_CRITERIA,
  );

  const handleTabChange = (id: EScoreEvaluationType) => {
    setSelectedTab(id);
    setEditedIndicator((prev) => ({ ...prev, score_evaluation_type: id }));
  };

  const handleSave = () => {
    if (!selectedTab) {
      showMessage(
        'โปรดเลือกหลักการประเมินคะแนนและกรอกข้อมูลให้ครบถ้วนก่อนบันทึก',
        'warning',
      );
      return;
    }

    // validate before save
    if (!validateModalConfigIndicator(editedIndicator)) return;

    onSave?.(editedIndicator, {
      ...editedAdditionalField,
      value: editedAdditionalField.current_score ?? 0,
    });
  };

  useEffect(() => {
    // not run on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (
      selectedTab === EScoreEvaluationType.ACADEMIC_CRITERIA &&
      indicator?.clever_subject_template_indicator_id
    ) {
      fetchIndicator(indicator?.clever_subject_template_indicator_id);
    }
  }, [selectedTab]);

  const fetchIndicator = async (id: number) => {
    try {
      const res = await API.SubjectTemplate.GetSubjectTemplateIndicatorByID(id);

      if (res.data.data.length == 0) return;
      const data = res.data.data[0];
      setEditedIndicator((prev) => ({
        ...prev,
        name: data.name,
        clever_lesson_id: data.lesson_id,
        clever_sub_lesson_id: data.sub_lesson_id,
        max_value: data.value,
        setting: data.levels.map(
          (lv): TContentIndicatorSetting => ({
            evaluation_key: 'STAGE_LIST',
            evaluation_topic: LevelTypeMapTH[lv.level_type],
            value: `[${lv.levels.join(',')}]`,
            weight: lv.weight,
            level_count: 0,
          }),
        ),
      }));
    } catch (error) {
      showMessage('พบปัญหาในการเรียกค่าตัวชี้วัดจากเซิร์ฟเวอร์', 'error');
      throw error;
    }
  };

  return (
    <CWModalCustom
      title={title}
      className="w-[1024px] gap-5"
      open={isOpen}
      onClose={onClose}
      onOk={handleSave}
      buttonName={viewOnly ? undefined : 'บันทึก'}
      cancelButtonName={viewOnly ? undefined : 'ยกเลิก'}
    >
      <div className="flex items-center justify-between rounded-md border-[3px] border-primary px-5 py-4 text-lg">
        <span className="font-bold">หลักการประเมินคะแนน</span>

        {!isAcademicContext && (
          <CWSwitchTabButton
            selectedTab={tabs.findIndex((item) => item.id === selectedTab)}
            tabs={tabs}
          />
        )}
      </div>

      {enabledAdvMode && selectedTab !== EScoreEvaluationType.NO_CRITERIA && (
        <PanelCriteriaScoreAdvMode
          disabled={disabledEdit}
          gameScore={additionalFields?.game_score ?? 0}
          replacedScore={editedAdditionalField?.replaced_score ?? 0}
          checked={editedAdditionalField.is_replace_score}
          score={editedAdditionalField.current_score}
          maxScore={maxScore}
          onCheckedChange={(checked) =>
            setEditedAdditionalField((prev) => ({ ...prev, is_replace_score: checked }))
          }
          onScoreChange={(score, isReplaced) => {
            const payload: TAdditionalField = { current_score: score };
            payload.current_score = score;

            if (isReplaced) {
              payload.replaced_score = score;
              payload.is_replace_score = true;
            } else {
              payload.is_replace_score = false;
            }

            setEditedAdditionalField((prev) => ({ ...prev, ...payload }));
          }}
        />
      )}

      {enabledAdvMode && maxScore && selectedTab === EScoreEvaluationType.NO_CRITERIA && (
        <PanelNoCriteriaScoreAdvMode
          score={editedAdditionalField.current_score}
          maxScore={maxScore}
          onScoreChange={(score) => {
            setEditedAdditionalField?.((prev) => ({ ...prev, current_score: score }));
          }}
        />
      )}

      {/* {indicator?.setting?.map?.((setting) => setting.evaluation_topic)} */}
      {selectedTab === EScoreEvaluationType.ACADEMIC_CRITERIA &&
        subjectID &&
        showIndicatorInfo && (
          <PanelCriteriaAcademic
            enabledAdvMode={enabledAdvMode}
            disabledEdit={!isAcademicContext || disabledEdit || enabledAdvMode}
            subjectID={subjectID}
            lessonID={indicator?.clever_lesson_id}
            subLessonID={indicator?.clever_sub_lesson_id}
            indicatorSettings={editedIndicator?.setting ?? []}
            onIndicatorChange={(indicator) =>
              setEditedIndicator((prev) => ({ ...prev, ...indicator }))
            }
            onIndicatorSettingsChange={(settings) =>
              setEditedIndicator((prev) => ({ ...prev, setting: settings }))
            }
            studentID={studentID}
            schoolID={schoolID}
            sheetID={sheetID}
            sheetIndicatorID={sheetIndicatorID}
          />
        )}

      {selectedTab === EScoreEvaluationType.TEACHER_CRITERIA &&
        subjectID &&
        showIndicatorInfo && (
          // การตั้งค่าประเมินคะแนน
          <PanelCriteriaAcademic
            enabledAdvMode={enabledAdvMode}
            disabledEdit={disabledEdit || enabledAdvMode}
            subjectID={subjectID}
            lessonID={indicator?.clever_lesson_id}
            subLessonID={indicator?.clever_sub_lesson_id}
            onIndicatorSettingsChange={(settings) =>
              setEditedIndicator((prev) => ({ ...prev, setting: settings }))
            }
            indicatorSettings={editedIndicator?.setting ?? []}
            // This for when selected new sub lesson. the indicator name will update
            onIndicatorChange={(indicator) =>
              setEditedIndicator((prev) => ({ ...prev, ...indicator }))
            }
            studentID={studentID}
            schoolID={schoolID}
            sheetID={sheetID}
            sheetIndicatorID={sheetIndicatorID}
          />
        )}

      {selectedTab === EScoreEvaluationType.NO_CRITERIA && !enabledAdvMode && (
        <PanelNoCriteria
          disabledEdit={disabledEdit || enabledAdvMode}
          indicatorName={editedIndicator?.name}
          onIndicatorNameChange={(name) =>
            setEditedIndicator((prev) => ({
              ...prev,
              name: name,
            }))
          }
        />
      )}

      {!enabledAdvMode && (
        <div className="flex items-center justify-between rounded-md border-4 border-neutral-200 bg-neutral-100 p-5">
          <span className="text-lg font-bold">
            <span className="text-red-500">*</span>
            คะแนนเต็ม
          </span>
          <CWInput
            className="w-full max-w-36"
            type="number"
            inputClassName="text-right"
            value={editedIndicator?.max_value}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (isNaN(value)) return;

              setEditedIndicator((prev) => ({
                ...prev,
                max_value: value,
              }));
            }}
            disabled={disabledEdit || enabledAdvMode}
            placeholder="0"
            min="0"
          />
        </div>
      )}
    </CWModalCustom>
  );
};

export default ModalConfigIndicatorEvaluationCriteria;
