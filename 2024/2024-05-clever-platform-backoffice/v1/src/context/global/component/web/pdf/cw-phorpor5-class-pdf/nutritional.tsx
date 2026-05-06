import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { EvaluationStudent } from '@domain/g06/g06-d05/g06-d05-p08-nutritional-summary/type';
import dayjs from 'dayjs';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'THSarabun',
    fontSize: 12,
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
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
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol2: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  nameCol: {
    width: '20%',
    textAlign: 'left',
  },
  indicatorCol: {
    width: '8%',
  },
  dateGroupCol: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 2,
  },

  headerCol: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  verticalText: {
    writingMode: 'vertical-rl',
    transform: 'rotate(90deg)',
    height: 80,
    padding: 2,
    transformOriginX: 8,
    transformOriginY: 5,
  },
});

const indicatorLabels = [
  'น้ำหนัก',
  'ส่วนสูง',
  'น้ำหนักตามเกณฑ์อายุ',
  'ส่วนสูงตามเกณฑ์อายุ',
  'น้ำหนักตามเกณฑ์ส่วนสูง',
];

interface NutritionalPdfTableProps {
  data: EvaluationStudent[];
  dates: string[];
  schoolName?: string;
  year: string;
  academicYear: string;
}

const NutritionalPdfTable = ({
  data,
  dates,
  schoolName = 'โรงเรียนไม่ระบุชื่อ',
  year,
  academicYear,
}: NutritionalPdfTableProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ผลการประเมินภาวะโภชนาการ</Text>
          <Text>{schoolName}</Text>
          <Text>{`ชั้นปี ${year} ปีการศึกษา ${academicYear}`}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.nameCol,
                styles.headerCol,
                {
                  width: '20%',
                  borderRight: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ textAlign: 'center', paddingTop: '100' }}>ชื่อ - สกุล</Text>
            </View>

            <View
              style={[
                styles.tableCol,
                styles.nameCol,
                styles.headerCol,
                { width: '40%' },
              ]}
            >
              <Text> ภาคเรียนที่ 1</Text>
            </View>

            <View
              style={[
                styles.tableCol,
                styles.nameCol,
                styles.headerCol,
                { width: '40%' },
              ]}
            >
              <Text>ภาคเรียนที่ 2</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.nameCol, styles.headerCol, { width: '22.25%' }]}></View>

            {dates.map((date, dIdx) => (
              <View
                key={`date-${dIdx}`}
                style={[
                  styles.dateGroupCol,
                  styles.headerCol,
                  {
                    width: indicatorLabels.length * 25,
                    minHeight: 32,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderLeftWidth: dIdx === 0 ? 1 : 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text style={{ textAlign: 'center' }} wrap>
                  {dayjs(date).format('D MMMM YYYY')}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            <View
              style={[
                styles.tableCol,
                styles.nameCol,
                styles.headerCol,
                { width: '40%' },
              ]}
            ></View>

            {dates.map((date, dIdx) => (
              <React.Fragment key={dIdx}>
                {indicatorLabels.map((label, iIdx) => (
                  <View
                    key={`${dIdx}-${iIdx}`}
                    style={[
                      styles.tableCol2,
                      styles.indicatorCol,
                      styles.headerCol,
                      { minHeight: 90 },
                    ]}
                  >
                    <Text style={[styles.verticalText]}>{label}</Text>
                  </View>
                ))}
              </React.Fragment>
            ))}
          </View>

          {/* Body Rows */}
          {data.map((student, sIdx) => (
            <View key={sIdx} style={styles.tableRow}>
              <View
                style={[
                  styles.tableCol2,
                  styles.nameCol,
                  { width: '40%', alignItems: 'flex-start', justifyContent: 'center' },
                ]}
              >
                <Text style={{ textAlign: 'left' }}>
                  {`${student.additional_fields.title}${student.additional_fields.thai_first_name} ${student.additional_fields.thai_last_name}`}
                </Text>
              </View>

              {student.student_indicator_data.map((indicator, iIdx) => (
                <View key={iIdx} style={[styles.tableCol, styles.indicatorCol]}>
                  <Text>{indicator.value ?? '-'}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default NutritionalPdfTable;
