// components/StudentPdfTable.tsx
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { StudentInfo } from '@domain/g06/g06-d05/local/api/type';
import { formatToDate } from '@global/utils/format/date';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'THSarabun',
    fontSize: 10,
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
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
});

interface StudentPdfTableProps {
  studentInfo: StudentInfo[];
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  schoolName?: string;
}

const StudentPdfTable = ({
  studentInfo,
  evaluationForm,
  schoolName,
}: StudentPdfTableProps) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>รายงานข้อมูลนักเรียน</Text>
        {schoolName && <Text style={styles.schoolName}>{schoolName}</Text>}
        <Text style={styles.schoolName}>
          {`ชั้นปี ${evaluationForm?.year} ปีการศึกษา ${evaluationForm?.academic_year}`}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
          <Text style={styles.tableColHeader}>เลขที่</Text>
          <Text style={styles.tableColHeader}>รหัสนักเรียน</Text>
          <Text style={styles.tableColHeader}>ชื่อ-สกุล</Text>
          <Text style={styles.tableColHeader}>เลขประจำตัวประชาชน</Text>
          <Text style={styles.tableColHeader}>วันเกิด</Text>
        </View>

        {studentInfo?.map((student, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol}>{student.no}</Text>
            <Text style={styles.tableCol}>{student.student_id}</Text>
            <Text style={styles.tableCol}>
              {`${student.title}${student.first_name} ${student.last_name}`}
            </Text>
            <Text style={styles.tableCol}>{student.citizen_no}</Text>
            <Text style={styles.tableCol}>
              {formatToDate(student.birth_date, {
                locale: 'th',
                format: 'DD MMMM BBBB',
              })}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  );
};

export default StudentPdfTable;
