import StoreGlobal from '@global/store/global';
import React, { useEffect, useMemo, useState } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWTextArea from '@component/web/cw-textarea';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import CWButton from '@component/web/cw-button';
import {
  useLocation,
  useNavigate,
  useParams,
  useRouterState,
} from '@tanstack/react-router';
import API from '../local/api';
import {
  IGetNote,
  IGetSheetDetail,
  IIndicator,
  IJsonStudentScoreDaum,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
  TJsonStudentAdditionalFields,
  TOnInputScoreChange,
  TStudentIndicatorAdditionalField,
} from '../local/type';
import showMessage from '@global/utils/showMessage';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import DataEntryEditTemplate from './component/web/template/cw-t-data-entry-edit';
import { formatToDate } from '@global/utils/format/date';
import CompetenciesTable from './component/web/organism/cw-o-table-competencies';
import DesirableCharacteristicsTable from './component/web/organism/cw-o-table-designable-characteristic';
import StudentDevelopmentActivitiesTable from './component/web/organism/cw-o-table-student-development-activity';
import SubjectDataTable from '../local/component/web/organism/cw-o-table-subject-data';
import dayjs from '@global/utils/dayjs';
import { getMonthDayCounts } from '@domain/g06/local/utils/date';
import TableNutrition from './component/web/organism/cw-o-table-nutrition';
import CWWhiteBox from '@component/web/cw-white-box';
import SelectNutritionAdditionalData from '@domain/g06/local/components/web/molecule/cw-m-select-nutrition-additional-data';
import CWInput from '@component/web/cw-input';
import { isNutritionDataValid } from '../local/utils/sheet';
import CWImg from '@component/web/atom/wc-a-img';
import TemplateAttendanceTable from './component/web/template/cw-t-attendance';
import { areFloatsEqual, mapToAttendanceScore } from '@domain/g06/local/utils/score';
import { rankStudents, updateScoresForIndicator } from '../local/utils/score';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import { processSubjectScoreData } from '../local/utils/sheet-score/subject-data';
import { EEvaluationSheetStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
type RouterLocation = {
  state?: string;
};

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const location = useLocation();
  const { fromTab } = (location.state as { fromTab?: string }) || {};
  const navigator = useNavigate();

  const [showModalAddNote, setShowModalAddNote] = useState(false);
  const { sheetId } = useParams({ strict: false });

  const [noteList, setNoteList] = useState<IGetNote[]>([]);
  const [academicYearList, setAcademicYearList] = useState<number[]>([]);
  const [noteDetail, setNoteDetail] = useState<string>('');
  const [advanceMode, setAdvanceMode] = useState(false);

  const [sheetDetail, setSheetDetail] = useState<IGetSheetDetail>();

  const { updatedAt, updatedBy } = useMemo(() => {
    return {
      updatedAt: sheetDetail?.updated_at ? formatToDate(sheetDetail.updated_at) : '-',
      updatedBy: sheetDetail?.updated_by ?? '-',
    };
  }, [sheetDetail?.updated_at, sheetDetail?.updated_by]);

  const [scoreDataRequest, setScoreDataRequest] = useState<IUpdateSheetRequest>({
    start_edit_at: new Date().toISOString(),
    json_student_score_data: [],
    id: 0,
  });

  const [editMode, setEditMode] = useState(false);

  // due function logic. when replaced score include. the value not change
  const onInputScoreChange: TOnInputScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData,
  ) => {
    const value = Number(e.target.value);

    if (isNaN(value) || value === Infinity) return;

    indicatorData.value = value;

    if (sheetDetail?.subject_data) {
      const additionalFields = indicatorData.additional_fields ?? {};

      // if not in advanced mode. input value count as replaced score
      // if indicator type is no criteria. will not have replaced state
      if (
        !advanceMode &&
        sheetDetail.subject_data.indicator.find(
          (indicator) => indicator.id == indicatorData.indicator_id,
        )?.score_evaluation_type !== EScoreEvaluationType.NO_CRITERIA
      ) {
        additionalFields.replaced_score = value;
        additionalFields.is_replace_score = true;
      }

      if (additionalFields.is_replace_score === true) {
        if (additionalFields.replaced_score)
          indicatorData.value = additionalFields.replaced_score;
      } else if (additionalFields.is_replace_score === false) {
        if (additionalFields.game_score)
          indicatorData.value = additionalFields.game_score;
      }

      indicatorData.additional_fields = additionalFields;
    }

    setScoreDataRequest((prev) => {
      const tmp = {
        ...prev,
        json_student_score_data: [
          ...prev.json_student_score_data.slice(0, indexJsonStudentScoreData),
          {
            ...prev.json_student_score_data[indexJsonStudentScoreData],
            student_indicator_data: [
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(0, indexStudentIndicator),
              indicatorData,
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(indexStudentIndicator + 1),
            ],
          },
          ...prev.json_student_score_data.slice(indexJsonStudentScoreData + 1),
        ],
      };

      const finalTmp = rankStudents(tmp.json_student_score_data);

      return {
        ...tmp,
        json_student_score_data: finalTmp,
      };
    });
  };

  /**
   * Updates a specific field within the `additional_fields` object for a single student.
   * This is a generic function that ensures the value's type matches the key's type.
   * @param studentIndex The index of the student.
   * @param key The key of the field to update ('remark' or 'grade_status').
   * @param value The new value, which must be the correct type for the given key.
   */
  const onAdditionalFieldChange = <K extends keyof TJsonStudentAdditionalFields>(
    studentIndex: number,
    key: K,
    value: TJsonStudentAdditionalFields[K],
  ) => {
    setScoreDataRequest((prev) => {
      const updatedStudentData = [...prev.json_student_score_data];

      updatedStudentData[studentIndex] = {
        ...updatedStudentData[studentIndex],
        additional_fields: {
          ...updatedStudentData[studentIndex].additional_fields,
          [key]: value,
        },
      };

      return {
        ...prev,
        json_student_score_data: updatedStudentData,
      };
    });
  };

  const handleAttendanceChange = (
    value: string,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => {
    const status = mapToAttendanceScore(value);

    indicatorData.value = status;

    setScoreDataRequest((prev) => {
      const tmp = {
        ...prev,
        json_student_score_data: [
          ...prev.json_student_score_data.slice(0, indexJsonStudentScoreData),
          {
            ...prev.json_student_score_data[indexJsonStudentScoreData],
            student_indicator_data: [
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(0, indexStudentIndicator),
              indicatorData,
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(indexStudentIndicator + 1),
            ],
          },
          ...prev.json_student_score_data.slice(indexJsonStudentScoreData + 1),
        ],
      };

      const finalTmp = rankStudents(tmp.json_student_score_data);

      return {
        ...tmp,
        json_student_score_data: finalTmp,
      };
    });
  };

  const onInputAdditionalFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => {
    indicatorData.additional_fields = {
      ...indicatorData.additional_fields,
      [fieldName]: e.target.value,
    };

    setScoreDataRequest((prev) => {
      const tmp = {
        ...prev,
        json_student_score_data: [
          ...prev.json_student_score_data.slice(0, indexJsonStudentScoreData),
          {
            ...prev.json_student_score_data[indexJsonStudentScoreData],
            student_indicator_data: [
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(0, indexStudentIndicator),
              indicatorData,
              ...prev.json_student_score_data[
                indexJsonStudentScoreData
              ].student_indicator_data.slice(indexStudentIndicator + 1),
            ],
          },
          ...prev.json_student_score_data.slice(indexJsonStudentScoreData + 1),
        ],
      };

      const finalTmp = rankStudents(tmp.json_student_score_data);

      return {
        ...tmp,
        json_student_score_data: finalTmp,
      };
    });
  };

  useEffect(() => {
    fetchSheet();

    API.note.GetNote(sheetId).then((res) => {
      if (res.status_code === 200 && Array.isArray(res.data)) {
        setNoteList(res.data);
      }
    });

    API.dropdown.GetSeedAcaDemicYearList().then((res) => {
      if (res.status_code === 200 && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          res.data.unshift(res.data[0] - 1);
          res.data.push(res.data[res.data.length - 1] + 1);
        }
        setAcademicYearList(res.data);
      }
    });
  }, []);

  const fetchSheet = () => {
    API.sheet.GetSheet(sheetId).then((res) => {
      if (res.status_code !== 200) return;

      // need remove next refactor. seem condition this called twice
      setSheetDetail(res.data);

      if (res.data.subject_data) {
        const processedData = processSubjectScoreData(res.data);

        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: processedData,
        });
      } else if (
        res.data.sheet_data?.general_type === 'คุณลักษณะอันพึงประสงค์' &&
        res.data.sheet_data
      ) {
        const requiredIndicators = [
          'รักชาติ',
          'ซื่อสัตย์',
          'มีวินัย',
          'ใฝ่เรียนรู้',
          'พอเพียง',
          'มุ่งมั่น',
          'เป็นไทย',
          'สาธารณะ',
          'ผลประเมินคุณลักษณะอันพึงประสงค์',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-1',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-2',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-3',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-4',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5',
          'ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ',
        ];
        const tmpScoreDataList: IJsonStudentScoreDaum[] = [];
        for (
          let indexStudent = 0;
          indexStudent < res.data.student_list.length;
          indexStudent++
        ) {
          const student = res.data.student_list[indexStudent];
          const tmpStudent: IJsonStudentScoreDaum = {
            student_detail: student,
            evaluation_student_id: student.id,
            student_indicator_data: requiredIndicators.map((indicator) => ({
              indicator_general_name: indicator,
              value: 0,
            })),
            order: 0,
          };
          for (
            let indexScore = 0;
            indexScore < res.data.json_student_score_data.length;
            indexScore++
          ) {
            const scoreData = res.data.json_student_score_data[indexScore];
            if (scoreData.evaluation_student_id === student.id) {
              tmpStudent.student_indicator_data.forEach((indicator) => {
                const foundIndicator = scoreData.student_indicator_data.find(
                  (data: IStudentIndicatorDaum) =>
                    data.indicator_general_name === indicator.indicator_general_name,
                );
                if (foundIndicator) {
                  indicator.value = foundIndicator.value;
                }
              });
            }
          }
          tmpScoreDataList.push(tmpStudent);
        }
        const tmpScoreDataListFinal = rankStudents(tmpScoreDataList);
        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tmpScoreDataListFinal,
        });
      } else if (res.data.sheet_data?.general_type === 'สมรรถนะ') {
        const requiredIndicators = Array.from({ length: 6 }).map(
          (_, i) => `competency-${i + 1}`,
        );
        const tmpScoreDataList: IJsonStudentScoreDaum[] = [];
        for (
          let indexStudent = 0;
          indexStudent < res.data.student_list.length;
          indexStudent++
        ) {
          const student = res.data.student_list[indexStudent];
          const tmpStudent: IJsonStudentScoreDaum = {
            student_detail: student,
            evaluation_student_id: student.id,
            student_indicator_data: requiredIndicators.map((indicator) => ({
              indicator_general_name: indicator,
              value: 0,
            })),
            order: 0,
          };
          for (
            let indexScore = 0;
            indexScore < res.data.json_student_score_data.length;
            indexScore++
          ) {
            const scoreData = res.data.json_student_score_data[indexScore];
            if (scoreData.evaluation_student_id === student.id) {
              tmpStudent.student_indicator_data.forEach((indicator) => {
                const foundIndicator = scoreData.student_indicator_data.find(
                  (data: IStudentIndicatorDaum) =>
                    data.indicator_general_name === indicator.indicator_general_name,
                );
                if (foundIndicator) {
                  indicator.value = foundIndicator.value;
                }
              });
            }
          }
          tmpScoreDataList.push(tmpStudent);
        }
        const tmpScoreDataListFinal = rankStudents(tmpScoreDataList);
        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tmpScoreDataListFinal,
        });
      } else if (res.data.sheet_data?.general_type === 'กิจกรรมพัฒนาผู้เรียน') {
        const requiredIndicators = [
          'แนะแนว',
          'ลูกเสือ-เนตรนารี',
          'ชุมนุม',
          'กิจกรรมเพื่อสังคม และสาธารณประโยชน์',
        ];
        const tmpScoreDataList: IJsonStudentScoreDaum[] = [];
        for (
          let indexStudent = 0;
          indexStudent < res.data.student_list.length;
          indexStudent++
        ) {
          const student = res.data.student_list[indexStudent];
          const tmpStudent: IJsonStudentScoreDaum = {
            student_detail: student,
            evaluation_student_id: student.id,
            student_indicator_data: requiredIndicators.map((indicator) => ({
              indicator_general_name: indicator,
              value: 0,
            })),
            order: 0,
          };
          for (
            let indexScore = 0;
            indexScore < res.data.json_student_score_data.length;
            indexScore++
          ) {
            const scoreData = res.data.json_student_score_data[indexScore];
            if (scoreData.evaluation_student_id === student.id) {
              tmpStudent.student_indicator_data.forEach((indicator) => {
                const foundIndicator = scoreData.student_indicator_data.find(
                  (data: IStudentIndicatorDaum) =>
                    data.indicator_general_name === indicator.indicator_general_name,
                );
                if (foundIndicator) {
                  indicator.value = foundIndicator.value;
                  indicator.additional_fields = foundIndicator.additional_fields;
                }
              });
            }
          }
          tmpScoreDataList.push(tmpStudent);
        }
        const tmpScoreDataListFinal = rankStudents(tmpScoreDataList);
        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tmpScoreDataListFinal,
        });
      } else if (res.data.sheet_data?.general_type === 'เวลาเรียน') {
        const data = res.data;

        if (
          data.additional_data?.start_date != data.academic_year_start_date ||
          data.additional_data?.end_date != data.academic_year_end_date
        ) {
          if (!data.additional_data) data.additional_data = {};

          if (!data.additional_data) data.additional_data = {};
          data.additional_data.start_date = dayjs(data.academic_year_start_date).format(
            'YYYY-MM-DD',
          );
          data.additional_data.end_date = dayjs(data.academic_year_end_date).format(
            'YYYY-MM-DD',
          );
        }

        if (res.data.json_student_score_data.length > 0) {
          setSheetDetail(data);
          setScoreDataRequest({
            id: Number(sheetId),
            start_edit_at: new Date().toISOString(),
            json_student_score_data: res.data.json_student_score_data.map((data, i) => ({
              ...data,
              student_detail: res.data.student_list[i],
            })),
          });
          return;
        }

        const [startDate, endDate] = [
          dayjs(data.academic_year_start_date),
          dayjs(data.academic_year_end_date),
        ];

        const monthLists = getMonthDayCounts(startDate, endDate);

        const tempSheetDetail: IGetSheetDetail = {
          ...data,
          json_student_score_data: data.student_list.map((student, i) => ({
            evaluation_student_id: student.id,
            student_detail: {
              ...student,
              student_id: String(student.student_id),
            },
            order: i,
            student_indicator_data: monthLists
              .map((month) => {
                const monthStart = dayjs(month.dateIso).startOf('month');
                const monthEnd = dayjs(month.dateIso).endOf('month');

                const start = monthStart.isSame(startDate, 'month')
                  ? startDate
                  : monthStart;
                const end = monthEnd.isSame(endDate, 'month') ? endDate : monthEnd;

                const days = end.diff(start, 'day') + 1;

                return Array.from({ length: days }, (_, index) => {
                  const date = start.add(index, 'day');
                  return {
                    value: 0,
                    indicator_general_name: date.format('YYYY-MM-DD'),
                  } as IStudentIndicatorDaum;
                });
              })
              .flat(),
          })),
        };

        setSheetDetail(tempSheetDetail);
        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tempSheetDetail.json_student_score_data,
        });
      } else if (res.data.sheet_data?.general_type === 'ภาวะโภชนาการ') {
        const sheetData = res.data.sheet_data;

        if (res.data.json_student_score_data.length > 0) {
          setSheetDetail(res.data);
          setScoreDataRequest({
            id: Number(sheetId),
            start_edit_at: new Date().toISOString(),
            json_student_score_data: res.data.json_student_score_data.map((data, i) => ({
              ...data,
              student_detail: res.data.student_list[i],
            })),
          });
          return;
        }

        const tempSheetDetail: IGetSheetDetail = {
          ...res.data,
          json_student_score_data: res.data.student_list.map((student, i) => ({
            evaluation_student_id: student.id,
            student_detail: {
              ...student,
              student_id: String(student.student_id),
            },
            order: i,
            student_indicator_data: Array.from({ length: 20 }, (_, idx) => ({
              indicator_general_name: `รอบที่ ${idx + 1}`,
              value: 0,
            })),
          })),
        };

        setSheetDetail(tempSheetDetail);
        setScoreDataRequest({
          id: Number(sheetId),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tempSheetDetail.json_student_score_data,
        });
      }
    });
  };

  const validateBeforeUpdate = (sheetDetail?: IGetSheetDetail): boolean => {
    const additionalData = sheetDetail?.additional_data;

    if (sheetDetail?.sheet_data?.general_type === 'เวลาเรียน' && !additionalData?.hours) {
      showMessage('กรุณากรอกเวลาเรียนให้ถูกต้อง', 'warning');
      return false;
    }
    if (
      sheetDetail?.sheet_data?.general_type === 'ภาวะโภชนาการ' &&
      !isNutritionDataValid(additionalData?.nutrition)
    ) {
      showMessage('กรุณาเลือกช่วงวันที่ของภาวะโภชนาการทั้งหมด', 'warning');
      return false;
    }

    return true;
  };
  const onUpdateScoreData = (submit?: boolean) => {
    if (!validateBeforeUpdate(sheetDetail)) return;

    setEditMode(false);
    setAdvanceMode(false);
    API.sheet
      .UpdateSheet({
        ...scoreDataRequest,
        status: submit ? EEvaluationSheetStatus.SENT : EEvaluationSheetStatus.ENABLED,
        additional_data: sheetDetail?.additional_data,
      })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ');
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  const onSaveNote = () => {
    setShowModalAddNote(false);
    API.note
      .AddNote({ evaluation_sheet_id: Number(sheetId), note_value: noteDetail })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ');
          setNoteDetail('');
          API.note.GetNote(sheetId).then((res) => {
            if (res.status_code === 200) {
              setNoteList(res.data);
            }
          });
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  const labelTitleBack = useMemo(() => {
    let label = 'กรอกข้อมูล';
    if (sheetDetail?.subject_data) label += 'ใบตัดเกรด';
    else if (sheetDetail?.sheet_data?.general_type == 'คุณลักษณะอันพึงประสงค์') {
      label += 'คุณลักษณะอันพึงประสงค์';
    } else if (sheetDetail?.sheet_data?.general_type == 'สมรรถนะ') {
      label += 'สมรรถนะ';
    } else if (sheetDetail?.sheet_data?.general_type == 'กิจกรรมพัฒนาผู้เรียน') {
      label += 'กิจกรรมพัฒนาผู้เรียน';
    } else if (sheetDetail?.sheet_data?.general_type == 'เวลาเรียน') {
      label += 'เวลาเรียน';
    } else if (sheetDetail?.sheet_data?.general_type == 'ภาวะโภชนาการ') {
      label += 'ภาวะโภชนาการ';
    }

    return label;
  }, [sheetDetail?.subject_data, sheetDetail?.sheet_data?.general_type, sheetId]);
  return (
    <LayoutDefault>
      <CWBreadcrumbs
        links={[
          { href: '/', label: 'การเรียนการสอน', disabled: true },
          { href: '/', label: 'ระบบตัดเกรด (ปพ.)', disabled: true },
          { href: '/grade-system/data-entry', label: 'ใบตัดเกรดของฉัน' },
          { href: '/', label: 'กรอกข้อมูลใบตัดเกรด' },
        ]}
      />
      <CWSchoolCard className="mb-5 mt-5" />
      <CWTitleBack
        href={`/grade-system/data-entry?tab=${fromTab}`}
        label={labelTitleBack}
      />

      {sheetDetail?.subject_data && (
        <DataEntryEditTemplate
          isAdvanceMode={advanceMode}
          sheet={sheetDetail}
          isEditMode={editMode}
          onAdvancedModeToggle={setAdvanceMode}
        />
      )}

      <div className="my-5 flex h-fit flex-col gap-5 p-5">
        {sheetDetail?.subject_data && (
          <SubjectDataTable
            viewOnly={!editMode}
            sheetDetail={sheetDetail}
            studentScoreData={scoreDataRequest}
            editMode={editMode}
            advanceMode={advanceMode}
            onInputScoreChange={(e, indexStudent, indexIndicator, indicatorData) => {
              onInputScoreChange(e, indexStudent, indexIndicator, indicatorData);
            }}
            onAdditionalFieldChange={onAdditionalFieldChange}
            onIndicatorChange={async (indicator) => {
              setSheetDetail((prev) => {
                if (!prev) return prev;

                // replace edited indicator
                const updatedIndicators = prev.subject_data?.indicator.map((item) => {
                  if (item.id != indicator.id) return item;
                  return indicator;
                });

                return {
                  ...prev,
                  subject_data: prev.subject_data
                    ? {
                        ...prev.subject_data,
                        indicator: updatedIndicators ?? [],
                      }
                    : null,
                };
              });

              // only re-calculate score from game when have level criteria
              if (indicator.score_evaluation_type === EScoreEvaluationType.NO_CRITERIA)
                return;

              try {
                const newRankedData = await updateScoresForIndicator(
                  sheetId,
                  indicator,
                  scoreDataRequest.json_student_score_data,
                );

                // Update the state with the data returned from the utility
                setScoreDataRequest((prev) => ({
                  ...prev,
                  json_student_score_data: newRankedData,
                }));

                showMessage('อัปเดตตัวชี้วัดและคำนวณคะแนนใหม่สำเร็จ', 'success');
              } catch (error: any) {
                showMessage(error.message || 'พับปัญหาในการอัปเดทคะแนน', 'error');
              }
            }}
          />
        )}
        {sheetDetail?.sheet_data?.general_type === 'คุณลักษณะอันพึงประสงค์' && (
          <div className="overflow-x-scroll">
            <DesirableCharacteristicsTable
              sheetDetail={sheetDetail}
              studentScoreData={scoreDataRequest}
              editMode={editMode}
              onInputScoreChange={(updatedData: IUpdateSheetRequest) => {
                setScoreDataRequest(updatedData);
              }}
            />
          </div>
        )}
        {sheetDetail?.sheet_data?.general_type === 'สมรรถนะ' && (
          <div className="overflow-x-scroll">
            <CompetenciesTable
              sheetDetail={sheetDetail}
              studentScoreData={scoreDataRequest}
              editMode={editMode}
              onInputScoreChange={(updatedData: IUpdateSheetRequest) => {
                setScoreDataRequest(updatedData);
              }}
            />
          </div>
        )}
        {sheetDetail?.sheet_data?.general_type === 'กิจกรรมพัฒนาผู้เรียน' && (
          <div className="overflow-x-scroll">
            <StudentDevelopmentActivitiesTable
              sheetDetail={sheetDetail}
              studentScoreData={scoreDataRequest}
              editMode={editMode}
              onInputScoreChange={onInputScoreChange}
              onInputAdditionalFieldChange={onInputAdditionalFieldChange}
            />
          </div>
        )}
        {sheetDetail?.sheet_data?.general_type === 'เวลาเรียน' && (
          <>
            <TemplateAttendanceTable
              isEdit={!editMode}
              sheetDetail={sheetDetail}
              studentScoreData={scoreDataRequest}
              onInputScoreChange={handleAttendanceChange}
              editMode={editMode}
              onHourChange={(hour) => {
                setSheetDetail((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    additional_data: {
                      ...prev.additional_data,
                      hours: hour > 0 ? hour : 0,
                    },
                  };
                });
              }}
            />
          </>
        )}

        {sheetDetail?.sheet_data?.general_type === 'ภาวะโภชนาการ' && (
          <CWWhiteBox className="flex flex-col gap-5">
            <SelectNutritionAdditionalData
              className="grid-cols-4"
              required={editMode}
              disabled={!editMode}
              additionalData={sheetDetail.additional_data}
              onChange={(data) =>
                setSheetDetail((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    additional_data: { ...prev?.additional_data, ...data },
                  };
                })
              }
            />

            <div className="overflow-x-scroll">
              <TableNutrition
                sheetDetail={sheetDetail}
                editMode={editMode}
                studentScoreData={scoreDataRequest}
                onInputScoreChange={onInputScoreChange}
              />
            </div>
          </CWWhiteBox>
        )}
      </div>

      {!editMode ? (
        <div className="flex items-center justify-between rounded bg-gray-200 p-5">
          <span>
            แก้ไขล่าสุด: {updatedAt}, {updatedBy}
          </span>
          <CWButton onClick={() => setEditMode(true)} title="แก้ไข" />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded bg-gray-200 p-5">
          <div className="flex items-center gap-2">
            <CWButton title="บันทึก" onClick={() => onUpdateScoreData(false)} />
            <CWButton outline title="รีเซทคะแนน" onClick={() => fetchSheet()} />
            <CWButton
              outline
              title="ยกเลิก"
              onClick={() => {
                fetchSheet();
                setSheetDetail(undefined);
                setEditMode(false);
                setAdvanceMode(false);
              }}
            />
            <span>
              แก้ไขล่าสุด: {updatedAt}, {updatedBy}
            </span>
          </div>
          <button onClick={() => onUpdateScoreData(true)} className="btn btn-primary">
            ส่งข้อมูล <IconCaretDown className="-rotate-90" />
          </button>
        </div>
      )}

      <div className="my-5 flex justify-between">
        <h3 className="text-xl font-bold">หมายเหตุ</h3>
        <button onClick={() => setShowModalAddNote(true)} className="btn btn-primary">
          เพิ่มโน้ต
        </button>
      </div>

      {noteList?.map((note, index) => (
        <div key={index} className="my-5 w-full rounded bg-white p-5 shadow">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <CWImg
                className="h-8 w-8 rounded-full object-cover"
                alt="note-user-image"
                src={note.image_url ?? undefined}
              />

              <div>
                <h4 className="mb-2 font-bold">{note.first_name}</h4>
                <p className="text-slate-500">
                  {formatToDate(note.created_at, { withTime: true })}
                </p>
              </div>
            </div>
          </div>
          <p className="my-3">{note.note_value}</p>
        </div>
      ))}

      <CWModalCustom
        open={showModalAddNote}
        onClose={() => setShowModalAddNote(false)}
        onOk={onSaveNote}
        title="เพิ่มโน้ต"
        buttonName="เพิ่มโน้ต"
        cancelButtonName="ยกเลิก"
      >
        <CWTextArea
          value={noteDetail}
          onChange={(e) => setNoteDetail(e.target.value)}
        ></CWTextArea>
      </CWModalCustom>
    </LayoutDefault>
  );
};

export default DomainJSX;
