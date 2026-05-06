import React, { useMemo } from 'react';
import {
  IGetSheetDetail,
  IJsonStudentScoreDaum,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';

interface StudentDevelopmentActivitiesTableProps {
  sheetDetail: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  editMode: boolean;
  onInputScoreChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => void;
  onInputAdditionalFieldChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => void;
}

const StudentDevelopmentActivitiesTable: React.FC<
  StudentDevelopmentActivitiesTableProps
> = ({
  sheetDetail,
  studentScoreData,
  editMode,
  onInputScoreChange,
  onInputAdditionalFieldChange,
}) => {
  const year = useMemo(() => {
    return sheetDetail.sheet_data?.year ?? '-';
  }, [sheetDetail.sheet_data?.year]);

  const academicYear = useMemo(() => {
    return sheetDetail.sheet_data?.academic_year ?? '-';
  }, [sheetDetail.sheet_data?.academic_year]);

  return (
    <table className="data-entry-table w-full table-fixed border-collapse border bg-white">
      <thead>
        <tr>
          <th colSpan={12} className="border text-center">
            สรุปการประเมินกิจกรรมพัฒนาผู้เรียน ชั้น{year} ปีการศึกษา {academicYear}
          </th>
        </tr>
        <tr>
          <th rowSpan={3} className="th-fullname border text-center">
            ชื่อสกุล
          </th>
          <th rowSpan={3} className="border text-center">
            เลขที่
          </th>
          <th colSpan={2} className="border text-center">
            แนะแนว
          </th>
          <th colSpan={2} className="border text-center">
            ลูกเสือ-เนตรนารี
          </th>
          <th colSpan={4} className="border text-center">
            ชุมนุม
          </th>
          <th colSpan={2} className="text-nowrap border text-center">
            กิจกรรมเพื่อสังคม <br />
            และสาธารณประโยชน์
          </th>
        </tr>
        <tr>
          <th className="w-16 border">ผ่าน</th>
          <th className="w-16 border">ไม่ผ่าน</th>
          <th className="w-16 border">ผ่าน</th>
          <th className="w-16 border">ไม่ผ่าน</th>
          <th colSpan={2} className="w-60 border">
            ชื่อชุมนุม
          </th>
          <th className="w-16 border">ผ่าน</th>
          <th className="w-16 border">ไม่ผ่าน</th>
          <th className="w-16 border">ผ่าน</th>
          <th className="w-16 border">ไม่ผ่าน</th>
        </tr>
      </thead>
      <tbody>
        {studentScoreData.json_student_score_data?.map(
          (studentData, indexJsonStudentScoreData) => (
            <tr key={indexJsonStudentScoreData}>
              <td className="border">
                {studentData.student_detail?.title}{' '}
                {studentData.student_detail?.thai_first_name}{' '}
                {studentData.student_detail?.thai_last_name}
              </td>
              <td className="border text-center">{studentData.student_detail?.no}</td>
              {studentData.student_indicator_data.map(
                (indicatorData, indexStudentIndicator) => {
                  if (
                    indexStudentIndicator === 0 ||
                    indexStudentIndicator === 1 ||
                    indexStudentIndicator === 3
                  ) {
                    return (
                      <React.Fragment key={'f' + indexStudentIndicator}>
                        <td
                          key={'checkbox1' + indexStudentIndicator}
                          className="td-fixed cursor-pointer border py-0"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox !m-0 block h-full w-full text-center focus:outline-none"
                            disabled={!editMode}
                            onChange={(e) => {
                              onInputScoreChange(
                                e,
                                indexJsonStudentScoreData,
                                indexStudentIndicator,
                                indicatorData,
                              );
                            }}
                            value={1}
                            checked={indicatorData.value === 1 ? true : false}
                          />
                        </td>
                        <td
                          key={'checkbox2' + indexStudentIndicator}
                          className="td-fixed cursor-pointer border py-0"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox !m-0 block h-full w-full text-center focus:outline-none"
                            disabled={!editMode}
                            value={2}
                            onChange={(e) => {
                              onInputScoreChange(
                                e,
                                indexJsonStudentScoreData,
                                indexStudentIndicator,
                                indicatorData,
                              );
                            }}
                            checked={indicatorData.value === 2 ? true : false}
                          />
                        </td>
                      </React.Fragment>
                    );
                  }
                  if (indexStudentIndicator === 2) {
                    return (
                      <React.Fragment key={'f' + indexStudentIndicator}>
                        <td
                          colSpan={2}
                          key={'input' + indexStudentIndicator}
                          className="td-fixed cursor-pointer border py-0"
                        >
                          <input
                            type="text"
                            className="block h-full !w-full focus:outline-none"
                            disabled={!editMode}
                            onChange={(e) => {
                              onInputAdditionalFieldChange(
                                e,
                                'ชื่อชุมนุม',
                                indexJsonStudentScoreData,
                                indexStudentIndicator,
                                indicatorData,
                              );
                            }}
                            value={indicatorData.additional_fields?.['ชื่อชุมนุม']}
                          />
                        </td>
                        <td
                          key={'checkbox1' + indexStudentIndicator}
                          className="td-fixed cursor-pointer border py-0"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox !m-0 block h-full text-center focus:outline-none"
                            disabled={!editMode}
                            onChange={(e) => {
                              onInputScoreChange(
                                e,
                                indexJsonStudentScoreData,
                                indexStudentIndicator,
                                indicatorData,
                              );
                            }}
                            value={1}
                            checked={indicatorData.value === 1 ? true : false}
                          />
                        </td>
                        <td
                          key={'checkbox2' + indexStudentIndicator}
                          className="td-fixed cursor-pointer border py-0"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox !m-0 block h-full w-full text-center focus:outline-none"
                            disabled={!editMode}
                            onChange={(e) => {
                              onInputScoreChange(
                                e,
                                indexJsonStudentScoreData,
                                indexStudentIndicator,
                                indicatorData,
                              );
                            }}
                            value={2}
                            checked={indicatorData.value === 2 ? true : false}
                          />
                        </td>
                      </React.Fragment>
                    );
                  }
                },
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};

export default StudentDevelopmentActivitiesTable;
