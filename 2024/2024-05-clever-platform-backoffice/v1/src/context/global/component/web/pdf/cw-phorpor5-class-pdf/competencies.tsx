import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Svg,
  Path,
} from '@react-pdf/renderer';
import {
  IGetPhorpor5Detail,
  NutritionResponse,
} from '@domain/g06/g06-d05/local/api/type';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'THSarabun',
    fontSize: 14,
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  schoolName: {
    fontSize: 14,
    marginBottom: 5,
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
  },
  tableColHeader: {
    width: '100%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameCol: {
    width: '20%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  numberCol: {
    width: '8%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    textAlign: 'center',
  },
  competencyCol: {
    width: '8%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    textAlign: 'center',
  },
  evaluationCol: {
    width: '8%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    textAlign: 'center',
  },
  criteriaContainer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
  },
  criteriaRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  criteriaLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  signatureSpace: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginHorizontal: 10,
  },
});

interface CompetenciesPdfProps {
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  detailData: IGetPhorpor5Detail[];
  schoolName: string;
}

const CheckIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#000" />
  </Svg>
);

const CompetenciesPdf: React.FC<CompetenciesPdfProps> = ({
  evaluationForm,
  detailData,
  schoolName,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            สรุปประเมินสมรรถนะสำคัญของผู้เรียน - การอ่าน คิดวิเคราะห์ และเขียนสื่อความ
          </Text>
          <Text style={styles.schoolName}>{schoolName}</Text>
          <Text>
            ชั้น {evaluationForm.year} ปีการศึกษา {evaluationForm.academic_year}
          </Text>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View
              style={{
                ...styles.tableColHeader,
                width: '20%',
                borderBottomWidth: 0,
                paddingTop: 60,
              }}
            >
              <Text>ชื่อสกุล</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: '8%',
                borderBottomWidth: 0,
                paddingTop: 60,
              }}
            >
              <Text>เลขที่</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '72%', paddingTop: 30 }}>
              <Text>สมรรถนะสำคัญของผู้เรียน</Text>
            </View>
          </View>

          {/* Second Header Row */}
          <View style={styles.tableRow}>
            <View
              style={{ ...styles.tableColHeader, width: '20%', borderBottomWidth: 0 }}
            >
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text>1</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text>2</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text>3</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text>4</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%', borderBottomWidth: 0 }}>
              <Text>5</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '32%' }}>
              <Text>ผลการประเมิน</Text>
            </View>
          </View>

          {/* Third Header Row */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: '20%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text></Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text>ไม่ผ่าน</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text>ผ่าน</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text>ดี</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: '8%' }}>
              <Text>ดีเยี่ยม</Text>
            </View>
          </View>

          {/* Table Body */}
          {(detailData?.[0]?.data_json as Array<any>)?.map((studentData, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.nameCol}>
                <Text>
                  {studentData.additional_fields?.title ?? '-'}{' '}
                  {studentData.additional_fields?.thai_first_name ?? '-'}{' '}
                  {studentData.additional_fields?.thai_last_name ?? '-'}
                </Text>
              </View>
              <View style={styles.numberCol}>
                <Text>{index + 1}</Text>
              </View>

              {studentData.student_indicator_data
                ?.slice(0, 5)
                .map((indicator: any, idx: any) => (
                  <View key={`comp-${idx}`} style={styles.competencyCol}>
                    <Text>{String(indicator.value ?? '-')}</Text>
                  </View>
                ))}

              {[0, 1, 2, 3].map((val) => (
                <View
                  key={`eval-${val}`}
                  style={[
                    styles.evaluationCol,
                    { flexDirection: 'row', justifyContent: 'center' },
                  ]}
                >
                  {studentData.student_indicator_data?.[5]?.value === val ? (
                    <CheckIcon />
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Evaluation Criteria */}
        <View style={styles.criteriaContainer}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
            เกณฑ์การประเมินสมรรถนะสำคัญของผู้เรียน
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            <View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>คะแนน 0</Text>
                <Text>ระดับคุณภาพ ไม่ผ่าน</Text>
              </View>

              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>คะแนน 2</Text>
                <Text>ระดับคุณภาพ ดี</Text>
              </View>
            </View>

            <View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>คะแนน 1</Text>
                <Text>ระดับคุณภาพ ผ่าน</Text>
              </View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaLabel}>คะแนน 3</Text>
                <Text>ระดับคุณภาพ ดีเยี่ยม</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.signatureRow,
              { flexDirection: 'row', justifyContent: 'center', gap: 10 },
            ]}
          >
            <Text>ลงชื่อ</Text>
            <View style={styles.signatureSpace} />
            <Text>ครูประจำชั้น/ครูประจำวิชา</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CompetenciesPdf;
