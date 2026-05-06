import SelectLesson from '../../molecule/cw-m-select-lesson';
import SelectSubLesson from '../../molecule/cw-select-sub-lesson';
import CWAccordionManager from '@component/web/molecule/cw-m-accordion-manager';
import ItemSelectLevelSetting from '../cw-o-item-select-level-setting';
import {
  TContentIndicator,
  TContentIndicatorSetting,
} from '@domain/g06/local/types/content';
import { useEffect, useMemo, useState } from 'react';
import { TSubLesson } from '@domain/g06/local/types/academic';
import API from '@domain/g06/local/api';
import G06D03API from '@domain/g06/g06-d03/local/api';
import { LevelTypeMapEN, LevelTypeMapTH } from '@domain/g06/local/constant/level';
import SelectorLevel from '../../molecule/cw-m-item-selector-level';
import SelectAllLevelAction from '../../molecule/cw-m-select-all-level-action';
import SubLessonStandardInfo from '../../molecule/cw-m-sub-lesson-standard-info';
import { isSelectedAtLeastOneLevel } from '@domain/g06/local/utils/level';
import { TEvaluationFormSettingGetScoreRes } from '@domain/g06/g06-d03/local/api/helpers/sheet';

type PanelCriteriaAcademicProps = {
  subjectID: number;
  indicatorID?: number;
  lessonID?: number | null;
  subLessonID?: number | null;
  indicatorSettings: TContentIndicatorSetting[];
  onIndicatorSettingsChange?: (
    settings: TContentIndicatorSetting[],
    indicatorName?: string,
  ) => void;
  onIndicatorChange?: (indicator: Partial<TContentIndicator>) => void;
  disabledEdit?: boolean;

  // advancedMode
  enabledAdvMode?: boolean;
  studentID?: number;
  schoolID?: number;
  sheetID?: number;
  sheetIndicatorID?: number;
};

const PanelCriteriaAcademic = ({
  subjectID,
  indicatorID,
  lessonID,
  subLessonID,
  indicatorSettings,
  onIndicatorSettingsChange,
  onIndicatorChange,
  disabledEdit,
  enabledAdvMode,
  schoolID,
  sheetID,
  sheetIndicatorID,
  studentID,
}: PanelCriteriaAcademicProps) => {
  const [isFirstTime, setIsFirstTime] = useState(false);

  const [selectedLessonID, setSelectedLessonID] = useState<number | undefined>(
    lessonID ?? undefined,
  );
  const [selectedSubLesson, setSelectedSubLesson] = useState<
    TSubLesson | Partial<TSubLesson>
  >({ id: subLessonID ?? undefined });
  const [indicatorOptions, setIndicatorOptions] = useState<Record<string, number[]>>({});
  const [scoreLists, setScoreLists] = useState<TEvaluationFormSettingGetScoreRes[]>([]);

  const sumOfWeight = useMemo(
    () => indicatorSettings.reduce((total, setting) => total + setting.weight, 0),
    [indicatorSettings],
  );

  const isRequiredSelectAtLeastOneLevel = useMemo(
    () => !isSelectedAtLeastOneLevel(indicatorSettings),
    [indicatorSettings],
  );

  const handleSettingChange = (updatedSetting: TContentIndicatorSetting) => {
    const settings = indicatorSettings.map((st) => {
      if (updatedSetting.evaluation_topic === st.evaluation_topic) {
        return updatedSetting;
      }
      return st;
    });

    onIndicatorSettingsChange?.(settings);
  };

  useEffect(() => {
    if (selectedSubLesson?.indicator_id) {
      handleFetchLevelLists(selectedSubLesson?.indicator_id);
    }

    onIndicatorChange?.({
      name: selectedSubLesson.indicator_name,
      clever_sub_lesson_id: selectedSubLesson.id,
      clever_lesson_id: selectedLessonID,
    });
  }, [selectedSubLesson]);
  const handleFetchLevelLists = async (indicatorID: number) => {
    const response = await API.Academic.GetLevelListByIndicatorID(indicatorID);

    const levelLists = response.data.data;

    setIndicatorOptions(levelLists);
    correctIndicatorSettingAfterFetch(indicatorID);
  };

  const correctIndicatorSettingAfterFetch = (indicatorID: number) => {
    const updatedIndicatorSettings = indicatorSettings;
    const settingLevelLists = indicatorSettings.map(
      (setting) => setting.evaluation_topic,
    );

    Object.keys(LevelTypeMapTH).forEach((levelTypeTH) => {
      const key = levelTypeTH as keyof typeof LevelTypeMapTH;

      if (!settingLevelLists.includes(LevelTypeMapTH[key])) {
        updatedIndicatorSettings.push({
          weight: 1,
          value: '[]',
          evaluation_topic: LevelTypeMapTH[key],
          evaluation_form_indicator_id: indicatorID,
          evaluation_key: 'STAGE_LIST',
          level_count: 0,
        });
      }
    });

    onIndicatorSettingsChange?.(updatedIndicatorSettings);
  };
  const handleIndicatorChange = (indicatorID: number) => {
    onIndicatorSettingsChange?.(
      indicatorSettings.map((setting) => ({
        ...setting,
        evaluation_form_indicator_id: indicatorID,
        value: '[]',
      })),
    );
  };

  const handleSelectAllLevels = () => {
    const updatedSettings = indicatorSettings.map((setting) => {
      const levelTypeKey =
        LevelTypeMapEN[setting.evaluation_topic as keyof typeof LevelTypeMapTH];
      const levelOptions = indicatorOptions[levelTypeKey] ?? [];

      return {
        ...setting,
        value: JSON.stringify(levelOptions),
      };
    });

    onIndicatorSettingsChange?.(updatedSettings);
  };

  const handleDeselectAllLevels = () => {
    const updatedSettings = indicatorSettings.map((setting) => ({
      ...setting,
      value: '[]',
    }));

    onIndicatorSettingsChange?.(updatedSettings);
  };

  useEffect(() => {
    fetchScore();
  }, []);
  const fetchScore = async () => {
    if (!sheetID || !studentID || !sheetIndicatorID || !schoolID) return;

    const settings = indicatorSettings.map((st) => ({ id: st.id, weight: st.weight }));

    const payload = {
      sheet_id: sheetID,
      student_id: studentID,
      indicator_id: sheetIndicatorID,
      school_id: schoolID,
      setting: settings,
    };

    const res = await G06D03API.sheet.PostEvaluationFormSettingGetScore(payload);

    if (res.status_code == 200) {
      setScoreLists(res.data ?? []);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* <SelectAllLevelAction
        disabled={disabledEdit}
        handleDeselectAllLevels={handleDeselectAllLevels}
        handleSelectAllLevels={handleSelectAllLevels}
      /> */}

      <span className="border-b-[1px] border-slate-200 p-1 text-lg font-bold">
        เลือกบทเรียนที่จะนำมาเป็นคะแนน
      </span>

      <div className="flex justify-between gap-6">
        <SelectLesson
          disabled={disabledEdit}
          value={selectedLessonID ?? undefined}
          subjectID={subjectID}
          onChange={(value) => {
            setSelectedLessonID(value);
            setSelectedSubLesson({});
            setIndicatorOptions({});
            onIndicatorSettingsChange?.(
              indicatorSettings.map((st) => ({
                ...st,
                weight: 1,
                level_count: 0,
                value: '[]',
              })),
            );
          }}
        />

        <SelectSubLesson
          disabled={!selectedLessonID || disabledEdit}
          lessonID={selectedLessonID ?? lessonID ?? undefined}
          selectedSubLesson={selectedSubLesson}
          onSelectSubLesson={(subLesson) => {
            if (!subLesson) return;
            setSelectedSubLesson(subLesson);

            // this for handle case when open when first time.
            // will cause refetch indicator and replace selected data
            if (!isFirstTime) {
              setIsFirstTime(true);
              return;
            }
            handleIndicatorChange(subLesson?.indicator_id);
            onIndicatorSettingsChange?.(
              indicatorSettings.map((st) => ({ ...st, weight: 1 })),
            );
          }}
        />
      </div>

      <SubLessonStandardInfo subLessonID={selectedSubLesson?.id} />

      <CWAccordionManager
        accordionLists={indicatorSettings.map((setting) => {
          let scoreData: TEvaluationFormSettingGetScoreRes | undefined;

          if (enabledAdvMode && scoreLists.length > 0) {
            scoreData = scoreLists.find(
              (score) => score.level_type == setting.evaluation_topic,
            );
          }

          return {
            className: 'py-2',
            hideToggleOpenButton: true,
            title: (
              <ItemSelectLevelSetting
                disabledEdit={disabledEdit}
                required={isRequiredSelectAtLeastOneLevel}
                options={
                  indicatorOptions[
                    LevelTypeMapEN[
                      setting.evaluation_topic as keyof typeof LevelTypeMapTH
                    ]
                  ]
                }
                setting={setting}
                onChange={handleSettingChange}
                score={
                  scoreData ? (
                    <div>
                      <span className="text-nowrap text-sm font-normal">คะแนน: </span>
                      <span className="text-base font-bold">
                        {scoreData.score}/{scoreData.max_score}{' '}
                      </span>
                    </div>
                  ) : null
                }
              />
            ),
            render: (
              <div className="flex flex-col">
                {
                  <SelectorLevel
                    disabled={disabledEdit}
                    value={setting.value}
                    options={
                      indicatorOptions[
                        LevelTypeMapEN[
                          setting.evaluation_topic as keyof typeof LevelTypeMapTH
                        ]
                      ]
                    }
                    onChange={(value) => {
                      handleSettingChange({ ...setting, value: value });
                    }}
                  />
                }
              </div>
            ),
          };
        })}
      />
      <div className="flex justify-between rounded-md bg-neutral-200 px-5 py-3 text-lg font-bold">
        <span>ผลรวมน้ำหนัก (Weight)</span>
        <span> {sumOfWeight} </span>
      </div>
    </div>
  );
};

export default PanelCriteriaAcademic;
