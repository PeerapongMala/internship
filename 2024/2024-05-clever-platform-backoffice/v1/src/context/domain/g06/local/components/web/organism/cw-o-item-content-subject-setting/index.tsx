import CWAccordionBox from '@component/web/atom/cw-a-accordion-box';
import { useState } from 'react';
import TableLearningScore from '../../atom/cw-a-table-learning-score';
import PanelIndicator from '../cw-o-panel-indicator';
import { TContentIndicator, TContentSubject } from '@domain/g06/local/types/content';
import SelectSubjectTemplate from '../../molecule/cw-m-select-subject-template';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import { LevelTypeMapTH } from '@domain/g06/local/constant/level';
import config from '@core/config';

type ItemContentSubjectSettingProps = {
  isAcademicContext?: boolean;
  disabledEdit?: boolean;
  contentSubject: TContentSubject;
  onContentSubjectChange?: (subject: TContentSubject) => void;
};

const ItemContentSubjectSetting = ({
  isAcademicContext,
  disabledEdit,
  contentSubject,
  onContentSubjectChange,
}: ItemContentSubjectSettingProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Example Table */}
      {/* <CWAccordionBox title="ตัวอย่างตัวชี้วัด" isOpen={isOpen} onToggleOpen={setIsOpen}>
        <TableLearningScore
          rows={contentSubject.indicator.map((indicator, i) => ({
            content: indicator.name,
          }))}
        />
      </CWAccordionBox> */}

      {/* show if have subject_id and not use in academic context */}
      {contentSubject.clever_subject_id && !isAcademicContext && (
        <SelectSubjectTemplate
          value={contentSubject.clever_subject_template_id}
          subjectID={contentSubject.clever_subject_id}
          onSelectTemplate={(template) => {
            // case not select any dropdown
            if (!template) {
              onContentSubjectChange?.({
                ...contentSubject,
                clever_subject_template_id: null,
                indicator: contentSubject.indicator.filter(
                  (indicator) => !indicator.clever_subject_template_indicator_id,
                ),
              });

              return;
            }

            if (!template.indicators) return;

            const newIndicator: TContentIndicator[] = [
              ...template.indicators.map(
                (indicator, index) =>
                  ({
                    id: -(index + 1),
                    name: indicator.name,
                    score_evaluation_type: EScoreEvaluationType.ACADEMIC_CRITERIA,
                    clever_subject_template_indicator_id: indicator.id,
                    clever_lesson_id: indicator.lesson_id,
                    clever_sub_lesson_id: indicator.sub_lesson_id,
                    max_value: indicator.value,
                    sort: index,
                    setting: indicator.levels.map((lv) => ({
                      weight: lv.weight,
                      evaluation_key: 'STAGE_LIST',
                      evaluation_topic: LevelTypeMapTH[lv.level_type],
                      value: `[${lv.levels.join(',')}]`,
                    })),
                  }) as TContentIndicator,
              ),
            ];

            onContentSubjectChange?.({
              ...contentSubject,
              clever_subject_template_id: template.id,
              indicator: newIndicator,
            });
          }}
        />
      )}

      {/* ตัวชี้วัด */}
      <span className="text-lg font-bold">ตัวชี้วัด</span>
      <PanelIndicator
        isAcademicContext={isAcademicContext}
        disabledEdit={disabledEdit}
        required
        subject={contentSubject}
        onSubjectChange={onContentSubjectChange}
      />
    </div>
  );
};

export default ItemContentSubjectSetting;
