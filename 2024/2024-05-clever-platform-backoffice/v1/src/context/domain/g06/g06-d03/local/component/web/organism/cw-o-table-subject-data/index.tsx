import React, { useCallback, useMemo, useState } from 'react';
import {
  IGetSheetDetail,
  IIndicator,
  IJsonStudentScoreDaum,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
  TJsonStudentAdditionalFields,
  TOnInputScoreChange,
} from '@domain/g06/g06-d03/local/type';
import useModal from '@global/utils/useModal';
import ScorePercentage from './components/ScorePercentage';
import CWWhiteBox from '@component/web/cw-white-box';
import ModalTeacherConfigIndicator from './components/ModalTeacherConfigIndicator';
import { TContentIndicator } from '@domain/g06/local/types/content';
import TDScore from './components/InputScore';
import ScoreSum from './components/ScoreSum';
import ScoreRankCell from './components/ScoreRankCell';
import ModalConfigIndicatorEvaluationCriteria from '@domain/g06/local/components/web/organism/cw-o-modal-config-indicator-evaluation-criteria';
import ModalAdvMode from './components/ModalAdvMode';
import Remark from './components/Remark';
import GradeStatus from './components/GradeStatus';
import { EGradeStatus } from '@domain/g06/local/enums/grade';
import { getUserData } from '@global/utils/store/getUserData';

type SubjectDataTableProps = {
  sheetDetail: IGetSheetDetail | undefined;
  compareData?: IJsonStudentScoreDaum[];
  studentScoreData: IUpdateSheetRequest;
  viewOnly?: boolean;
  editMode: boolean;
  advanceMode: boolean;
  onInputScoreChange: TOnInputScoreChange;
  onIndicatorChange: (indicator: Omit<TContentIndicator, 'id'> & { id: number }) => void;
  onAdditionalFieldChange?: <K extends keyof TJsonStudentAdditionalFields>(
    studentIndex: number,
    key: K,
    value: TJsonStudentAdditionalFields[K],
  ) => void;
};

const MAX_INDICATOR_COLUMNS = 11;

// million-ignore
const SubjectDataTable: React.FC<SubjectDataTableProps> = ({
  compareData,
  sheetDetail,
  studentScoreData,
  editMode,
  advanceMode,
  viewOnly,
  onInputScoreChange,
  onIndicatorChange,
  onAdditionalFieldChange,
}) => {
  const { school_id } = getUserData();

  const subjectData = useMemo(
    () => sheetDetail?.subject_data,
    [sheetDetail?.subject_data],
  );

  if (!subjectData) {
    return null;
  }

  const sumMaxScore = useMemo(() => {
    const sum = sheetDetail?.subject_data?.indicator?.reduce((prev, indicator) => {
      return prev + indicator.max_value;
    }, 0);

    return sum ?? 0;
  }, [sheetDetail?.subject_data?.indicator]);

  const modalIndicator = useModal();
  const [selectIndicator, setSelectIndicator] = useState<IIndicator | null>(null);

  const modalAdvancedMode = useModal();
  const [selectedScoreIndex, setSelectedScoreIndex] = useState<
    [row: number, col: number] | null
  >(null);

  const handleScoreChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      indexJsonStudentScoreData: number,
      indexStudentIndicator: number,
      indicatorData: IStudentIndicatorDaum,
    ) => {
      let event = { ...e };
      let score = parseFloat(e.target.value);
      const indicator = subjectData.indicator[indexStudentIndicator];

      if (score > indicator.max_value) {
        event.target.value = String(indicator.max_value);
      }

      onInputScoreChange(
        event,
        indexJsonStudentScoreData,
        indexStudentIndicator,
        indicatorData,
      );
    },
    [subjectData, onInputScoreChange],
  );

  return (
    <CWWhiteBox
      className={`overflow-x-scroll p-5 ${advanceMode ? 'bg-[#FFA62820]' : ''}`}
    >
      <table className="data-entry-table mx-auto border-collapse border bg-white">
        <thead>
          <tr>
            <th rowSpan={3} className="w-[100px] border text-center">
              เลขที่
            </th>
            <th rowSpan={3} className="th-fullname border text-center">
              ชื่อสกุล
            </th>
            {/* +1 to include sumOfMaxScore header */}
            <th colSpan={MAX_INDICATOR_COLUMNS + 1} className="border text-center">
              คะแนนผลการเรียน
            </th>
            <th rowSpan={3} className="w-[100px] border">
              ร้อยละ
            </th>
            <th rowSpan={3} className="w-[181px] border">
              ลำดับที่คะแนนรวม
            </th>
            <th rowSpan={3} className="border">
              ผลการเรียน
            </th>
            <th rowSpan={3} className="w-[132px] border">
              หมายเหตุ
            </th>
          </tr>
          <tr>
            {sheetDetail?.subject_data != null && (
              <>
                {/* ชื่อตัวชี้วัด */}
                {sheetDetail?.subject_data.indicator?.map((indicator, index) => (
                  <th
                    key={`indicator-name-${index}`}
                    className="indicator-name w-8 border !p-0"
                  >
                    <button
                      onClick={() => {
                        modalIndicator.open();
                        setSelectIndicator(indicator);
                      }}
                      className="inline-flex min-h-[110px] rotate-180 cursor-pointer items-center text-primary underline decoration-primary underline-offset-2 [writing-mode:vertical-rl]"
                    >
                      {indicator.name}
                    </button>
                  </th>
                ))}
                {Array.from({
                  length: subjectData.indicator?.length
                    ? MAX_INDICATOR_COLUMNS - subjectData.indicator.length
                    : MAX_INDICATOR_COLUMNS,
                }).map((_, i) => (
                  <th
                    key={`indicator-name-${i + (sheetDetail?.subject_data?.indicator?.length ?? 0)}`}
                    className="w-8 border"
                  ></th>
                ))}
              </>
            )}
            <th className="w-28 max-w-28 table-fixed border">รวม</th>
          </tr>
          <tr>
            {sheetDetail?.subject_data != null && (
              <>
                {sheetDetail?.subject_data.indicator?.map((indicator, index) => {
                  return (
                    <th key={`indicator-score-${index}`} className="border text-blue-600">
                      {indicator.max_value ?? '-'}
                    </th>
                  );
                })}
                {Array.from({
                  length: subjectData.indicator?.length
                    ? MAX_INDICATOR_COLUMNS - subjectData.indicator.length
                    : MAX_INDICATOR_COLUMNS,
                }).map((_, i) => (
                  <th
                    key={`indicator-score-${i + (sheetDetail?.subject_data?.indicator?.length ?? 0)}`}
                    className="border"
                  ></th>
                ))}
              </>
            )}
            <th className="indicator-sum-max-score">{sumMaxScore}</th>
          </tr>
        </thead>
        <tbody>
          {studentScoreData.json_student_score_data?.map(
            (studentData, indexJsonStudentScoreData) => (
              <tr key={indexJsonStudentScoreData}>
                <td className="border text-center">{studentData.student_detail?.no}</td>
                <td className="td-fullname border">
                  {studentData.student_detail?.title}{' '}
                  {studentData.student_detail?.thai_first_name}{' '}
                  {studentData.student_detail?.thai_last_name}
                </td>
                {studentData.student_indicator_data.map(
                  (indicatorData, indexStudentIndicator) => (
                    <TDScore
                      key={`indicator-data-${indexStudentIndicator}`}
                      className="td-fixed cursor-pointer border py-0"
                      disabled={!editMode && !advanceMode}
                      isAdvancedMode={advanceMode}
                      onChange={(e) => {
                        handleScoreChange(
                          e,
                          indexJsonStudentScoreData,
                          indexStudentIndicator,
                          indicatorData,
                        );
                      }}
                      onClickAdvMode={() => {
                        modalAdvancedMode.open();

                        setSelectedScoreIndex([
                          indexJsonStudentScoreData,
                          indexStudentIndicator,
                        ]);
                      }}
                      additionalField={indicatorData.additional_fields}
                      value={indicatorData.value}
                      comparedValue={
                        compareData?.[indexJsonStudentScoreData]
                          ?.student_indicator_data?.[indexStudentIndicator].value
                      }
                      studentID={studentData.student_detail?.id}
                      indicatorID={indicatorData.indicator_id}
                      studentLessonScore={sheetDetail?.student_lesson_score}
                    />
                  ),
                )}

                {/* empty space. must have min 10 */}
                {Array.from({
                  length: subjectData.indicator?.length
                    ? MAX_INDICATOR_COLUMNS - subjectData.indicator.length
                    : MAX_INDICATOR_COLUMNS,
                }).map((_, i) => (
                  <td
                    key={`indicator-data-${i + studentData?.student_indicator_data?.length}`}
                    className="td-fixed border"
                  ></td>
                ))}
                <ScoreSum
                  studentIndicatorData={studentData.student_indicator_data}
                  comparedData={
                    compareData?.[indexJsonStudentScoreData]?.student_indicator_data
                  }
                />

                <ScorePercentage
                  indicatorData={studentData.student_indicator_data}
                  maxScore={sumMaxScore}
                  comparedData={
                    compareData?.[indexJsonStudentScoreData]?.student_indicator_data
                  }
                />

                <ScoreRankCell
                  rank={studentData.order}
                  comparedRank={compareData?.[indexJsonStudentScoreData]?.order}
                />

                <GradeStatus
                  disabled={!editMode && !advanceMode}
                  value={studentData.additional_fields?.grade_status}
                  onChange={(value: EGradeStatus) => {
                    onAdditionalFieldChange?.(
                      indexJsonStudentScoreData,
                      'grade_status',
                      value,
                    );
                  }}
                />

                <Remark
                  disabled={!editMode && !advanceMode}
                  value={studentData.additional_fields?.remark}
                  onChange={(value: string) => {
                    onAdditionalFieldChange?.(indexJsonStudentScoreData, 'remark', value);
                  }}
                />
              </tr>
            ),
          )}
        </tbody>
      </table>

      {selectIndicator && sheetDetail?.sheet_data?.form_id && (
        <ModalTeacherConfigIndicator
          viewOnly={viewOnly}
          disabledEdit={!editMode}
          isOpen={modalIndicator.isOpen}
          onSave={(data) => {
            if (!data.id) return;
            onIndicatorChange({ ...data, id: data.id });
            modalIndicator.close();
            setSelectIndicator(null);
          }}
          onClose={() => {
            modalIndicator.close();
            setSelectIndicator(null);
          }}
          subjectID={subjectData?.clever_subject_id}
          indicator={{
            ...selectIndicator,
          }}
        />
      )}

      {selectedScoreIndex && (
        <ModalAdvMode
          isOpen={modalAdvancedMode.isOpen}
          onClose={() => {
            modalAdvancedMode.close();
            setSelectedScoreIndex(null);
          }}
          selectedScoreIndex={selectedScoreIndex}
          sheetDetail={sheetDetail}
          studentScoreData={studentScoreData}
          onHandleScoreChange={handleScoreChange}
          schoolID={Number(school_id)}
          sheetID={sheetDetail?.sheet_id}
        />
      )}
    </CWWhiteBox>
  );
};

export default SubjectDataTable;
