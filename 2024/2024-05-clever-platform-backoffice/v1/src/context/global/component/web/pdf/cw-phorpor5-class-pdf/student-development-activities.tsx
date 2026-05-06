import { Page, Text, View, Document, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import { IJsonStudentScoreDaum } from '@domain/g06/g06-d03/local/type';
import { GetEvaluationForm } from '@domain/g06/g06-d05/local/api/type';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'THSarabun',
    fontSize: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableColHeader: {
    width: '100%',
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  centerText: {
    textAlign: 'center',
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'heavy',
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
  },
  schoolName: {
    fontSize: 14,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    writingMode: 'vertical-rl', // ตัวอักษรแนวตั้ง (จากบนลงล่าง)
    transform: 'rotate(180deg)', // หมุนให้อ่านจากซ้ายไปขวา
    textAlign: 'center',
    padding: 2,
  },
});

interface StudentActivitiesPdfTableProps {
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  scoreDataRequest: {
    json_student_score_data: IJsonStudentScoreDaum[];
  };
  schoolName: string;
}

const StudentActivitiesPdfTable = ({
  evaluationForm,
  scoreDataRequest,
  schoolName,
}: StudentActivitiesPdfTableProps) => {
  const CheckIcon = () => (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#000" />
    </Svg>
  );
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>สรุปการประเมินกิจกรรมพัฒนาผู้เรียน</Text>
          {schoolName && <Text style={styles.schoolName}>{schoolName}</Text>}
          <Text style={styles.schoolName}>
            ชั้น {evaluationForm.year} ปีการศึกษา {evaluationForm.academic_year}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableColHeader]}>
            <View
              style={[
                { width: '20%', textAlign: 'center', borderRight: 1, paddingTop: 15 },
              ]}
            >
              <Text>ชื่อสกุล</Text>
            </View>
            <View
              style={[
                { width: '5%', textAlign: 'center', borderRight: 1, paddingTop: 15 },
              ]}
            >
              <Text>เลขที่</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                { width: '10%', textAlign: 'center', paddingTop: 8 },
              ]}
            >
              <Text>แนะแนว</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                { width: '10%', textAlign: 'center', paddingTop: 8 },
              ]}
            >
              <Text>ลูกเสือ-เนตรนารี</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                { width: '35%', textAlign: 'center', paddingTop: 8 },
              ]}
            >
              <Text>ชุมนุม</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                {
                  width: '20%',
                  textAlign: 'center',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingTop: 8,
                },
              ]}
            >
              <Text>กิจกรรมเพื่อสังคมและสาธารณประโยชน์</Text>
            </View>
          </View>

          <View style={[styles.tableRow, styles.tableColHeader]}>
            <View style={[styles.tableCell, { width: '20%' }]}></View>
            <View style={[styles.tableCell, { width: '5%' }]}></View>

            {/* แนะแนว */}
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ผ่าน</Text>
            </View>
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ไม่ผ่าน</Text>
            </View>

            {/* ลูกเสือ-เนตรนารี */}
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ผ่าน</Text>
            </View>
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ไม่ผ่าน</Text>
            </View>

            {/* ชุมนุม */}
            <View style={[styles.tableCell, { width: '25%' }, styles.centerText]}>
              <Text>ชื่อชุมนุม</Text>
            </View>
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ผ่าน</Text>
            </View>
            <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
              <Text>ไม่ผ่าน</Text>
            </View>

            {/* กิจกรรมเพื่อสังคม */}
            <View style={[styles.tableCell, { width: '10%' }, styles.centerText]}>
              <Text>ผ่าน</Text>
            </View>
            <View style={[styles.tableCell, { width: '10%' }, styles.centerText]}>
              <Text>ไม่ผ่าน</Text>
            </View>
          </View>

          {/* Student Data */}
          {scoreDataRequest.json_student_score_data?.map((studentData, idx) => (
            <View style={styles.tableRow} key={idx}>
              {/* ชื่อสกุล */}
              <View style={[styles.tableCell, { width: '20%' }]}>
                <Text>
                  {studentData.student_detail?.title}{' '}
                  {studentData.student_detail?.thai_first_name}{' '}
                  {studentData.student_detail?.thai_last_name}
                </Text>
              </View>

              {/* เลขที่ */}
              <View style={[styles.tableCell, { width: '5%' }, styles.centerText]}>
                <Text>{studentData.student_detail?.no}</Text>
              </View>

              {studentData.student_indicator_data.map((indicatorData, idxIndicator) => {
                if ([0, 1].includes(idxIndicator)) {
                  return (
                    <React.Fragment key={idxIndicator}>
                      {/* ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '5%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 1 && <CheckIcon />}
                        </View>
                      </View>
                      {/* ไม่ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '5%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 0 && <CheckIcon />}
                        </View>
                      </View>
                    </React.Fragment>
                  );
                }

                if (idxIndicator === 2) {
                  return (
                    <React.Fragment key={idxIndicator}>
                      {/* ชื่อชุมนุม */}
                      <View
                        style={[styles.tableCell, { width: '25%' }, styles.centerText]}
                      >
                        <Text>
                          {indicatorData.additional_fields?.['ชื่อชุมนุม'] || ''}
                        </Text>
                      </View>
                      {/* ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '5%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 1 && <CheckIcon />}
                        </View>
                      </View>
                      {/* ไม่ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '5%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 0 && <CheckIcon />}
                        </View>
                      </View>
                    </React.Fragment>
                  );
                }
                if (idxIndicator === 3) {
                  return (
                    <React.Fragment key={idxIndicator}>
                      {/* ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '10%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 1 && <CheckIcon />}
                        </View>
                      </View>
                      {/* ไม่ผ่าน */}
                      <View
                        style={[styles.tableCell, { width: '10%' }, styles.centerText]}
                      >
                        <View style={styles.iconContainer}>
                          {indicatorData.value === 0 && <CheckIcon />}
                        </View>
                      </View>
                    </React.Fragment>
                  );
                }

                return null;
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default StudentActivitiesPdfTable;
