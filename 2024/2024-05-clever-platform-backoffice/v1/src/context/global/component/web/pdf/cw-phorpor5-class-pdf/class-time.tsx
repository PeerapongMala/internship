import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'THSarabun',
    fontSize: 12,
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
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 25,
  },
  tableColHeader: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCol: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
  },
  numberCol: {
    width: 80,
  },
  nameCol: {
    width: 180,
    textAlign: 'left',
  },
  monthCol: {
    width: 80,
    textAlign: 'center',
  },
  summaryCol: {
    width: 100,
  },
  percentageCol: {
    width: 80,
  },
  footerRow: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});

export interface StudentSummary {
  id: number;
  no: number;
  name: string;
  monthlyStats: {
    month: number;
    present: number;
    totalDays: number;
  }[];
  totalStats: {
    present: number;
    totalDays: number;
    percentage: number;
  };
}
export interface MonthData {
  month: number;
  monthName: string;
  year: number;
  days: number;
}
interface ClassTimePdfTableProps {
  students: StudentSummary[];
  monthLists: MonthData[];
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  schoolName?: string;
}

const ClassTimePdfTable = ({
  students,
  monthLists,
  evaluationForm,
  schoolName = 'โรงเรียนไม่ระบุชื่อ',
}: ClassTimePdfTableProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>สรุปสถิติการมาเรียน</Text>
          <Text style={styles.schoolName}>{schoolName}</Text>
          <Text
            style={styles.schoolName}
          >{`ชั้นปี ${evaluationForm.year} ปีการศึกษา ${evaluationForm.academic_year}`}</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {/* หัวตาราง */}
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, styles.numberCol]}>
                <Text>เลขที่</Text>
              </View>
              <View style={[styles.tableColHeader, styles.nameCol]}>
                <Text>ชื่อ - นามสกุล</Text>
              </View>
              {/* หัวตารางเดือน */}
              {monthLists.map((month) => (
                <View
                  key={`month-header-${month.month}`}
                  style={[styles.tableColHeader, styles.monthCol]}
                >
                  <Text>{`เดือน ${month.monthName}`}</Text>
                </View>
              ))}
              <View style={[styles.tableColHeader, styles.summaryCol]}>
                <Text>สรุปทั้งปี</Text>
              </View>
              <View style={[styles.tableColHeader, styles.percentageCol]}>
                <Text>ร้อยละ</Text>
              </View>
            </View>

            {/* ข้อมูลนักเรียน */}
            {students.map((student) => (
              <View key={`student-${student.id}`} style={styles.tableRow}>
                <View style={[styles.tableCol, styles.numberCol]}>
                  <Text>{student.no}</Text>
                </View>
                <View style={[styles.tableCol, styles.nameCol]}>
                  <Text>{student.name}</Text>
                </View>

                {/* สถิติรายเดือน */}
                {student.monthlyStats.map((monthStat) => (
                  <View
                    key={`month-${student.id}-${monthStat.month}`}
                    style={[styles.tableCol, styles.monthCol]}
                  >
                    <Text>{`${monthStat.present}`}</Text>
                  </View>
                ))}

                {/* สรุปตลอดปี */}
                <View style={[styles.tableCol, styles.summaryCol]}>
                  <Text>{`${student.totalStats.present}`}</Text>
                </View>

                {/* ร้อยละการมาเรียน */}
                <View style={[styles.tableCol, styles.percentageCol]}>
                  <Text>{`${student.totalStats.percentage.toFixed(2)}%`}</Text>
                </View>
              </View>
            ))}

            {/* สรุปทั้งหมด */}
            <View style={[styles.tableRow, styles.footerRow]}>
              <View style={[styles.tableCol, styles.numberCol]}>
                <Text>รวม</Text>
              </View>
              <View style={[styles.tableCol, styles.nameCol]}>
                <Text>ทั้งหมด</Text>
              </View>
              {/* สรุปแต่ละเดือน */}
              {monthLists.map((month) => {
                const totalPresent = students.reduce(
                  (sum, student) =>
                    sum +
                    (student.monthlyStats.find((m) => m.month === month.month)?.present ||
                      0),
                  0,
                );
                const totalDays = month.days * students.length;
                return (
                  <View
                    key={`month-total-${month.month}`}
                    style={[styles.tableCol, styles.monthCol]}
                  >
                    <Text>{`${totalPresent}`}</Text>
                  </View>
                );
              })}
              {/* สรุปทั้งหมด */}
              <View style={[styles.tableCol, styles.summaryCol]}>
                <Text>
                  {`${students.reduce((sum, s) => sum + s.totalStats.present, 0)}`}
                  {/* {`${students.reduce((sum, s) => sum + s.totalStats.totalDays, 0)}`} */}
                </Text>
              </View>
              {/* ร้อยละเฉลี่ย */}
              <View style={[styles.tableCol, styles.percentageCol]}>
                <Text>
                  {`${(
                    students.reduce((sum, s) => sum + s.totalStats.percentage, 0) /
                    students.length
                  ).toFixed(2)}%`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ClassTimePdfTable;
