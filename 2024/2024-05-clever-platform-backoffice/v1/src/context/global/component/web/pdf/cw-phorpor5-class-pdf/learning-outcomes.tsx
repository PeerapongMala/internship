import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';
import type {
  SubjectData,
  AcademicInfo,
} from '@domain/g06/g06-d05/g06-d05-p09-learning-outcomes/component/web/template/TablePage1/type';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'THSarabun',
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
  },
  tableColHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  subjectCell: {
    width: '10%',
    textAlign: 'left',
  },
  numberCell: {
    width: '4%',
  },
  percentCell: {
    width: '4%',
  },
});

const SCORE_LEVELS = ['มส', 'ร', '0', '1', '1.5', '2', '2.5', '3', '3.5', '4'];

type Props = {
  subjects: SubjectData[];
  academicInfo: AcademicInfo;
};

const LearningSummaryPdf = ({ subjects, academicInfo }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>สรุปผลการประเมินผลสัมฤทธิ์ทางการเรียน</Text>
          <Text>{`ชั้น ${academicInfo?.year} ปีการศึกษา ${academicInfo?.academic_year}`}</Text>
          <Text>
            {academicInfo?.school_name} สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row 1 */}
          <View style={[styles.tableRow, styles.tableColHeader]}>
            <Text style={[styles.cell, styles.subjectCell]}>รายวิชา</Text>
            <Text style={[styles.cell, styles.numberCell]}>ช</Text>
            <Text style={[styles.cell, styles.numberCell]}>ญ</Text>
            <Text style={[styles.cell, styles.numberCell]}>รวม</Text>
            {SCORE_LEVELS.map((level) => (
              <React.Fragment key={level}>
                <Text style={[styles.cell, styles.numberCell]}>{level}</Text>
                <Text style={[styles.cell, styles.percentCell]}>%</Text>
              </React.Fragment>
            ))}
          </View>

          {/* Body Rows */}
          {subjects.map((subject) => {
            const scores = subject.scores || {};
            const total = Object.values(scores).reduce((sum, val) => sum + val, 0);

            return (
              <View key={subject.id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.subjectCell]}>{subject.name}</Text>
                <Text style={[styles.cell, styles.numberCell]}>
                  {academicInfo.male_count}
                </Text>
                <Text style={[styles.cell, styles.numberCell]}>
                  {academicInfo.female_count}
                </Text>
                <Text style={[styles.cell, styles.numberCell]}>
                  {academicInfo.total_count}
                </Text>
                {SCORE_LEVELS.flatMap((level) => {
                  const count = scores[level] ?? 0;
                  const percent = total > 0 ? ((count / total) * 100).toFixed(1) : '-';
                  return [
                    <Text
                      key={`${subject.id}-${level}-count`}
                      style={[styles.cell, styles.numberCell]}
                    >
                      {count}
                    </Text>,
                    <Text
                      key={`${subject.id}-${level}-percent`}
                      style={[styles.cell, styles.percentCell]}
                    >
                      {percent}
                    </Text>,
                  ];
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default LearningSummaryPdf;
