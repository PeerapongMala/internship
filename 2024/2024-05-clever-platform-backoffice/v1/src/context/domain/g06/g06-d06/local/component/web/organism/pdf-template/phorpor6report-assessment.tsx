import { Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'THSarabun',
  fonts: [
    {
      src: '/font/THSarabun/SarabunRegular.ttf',
      fontWeight: 400,
    },
    {
      src: '/font/THSarabun/SarabunBold.ttf',
      fontWeight: 900,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 30,
    fontFamily: 'THSarabun',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 700,
  },
  table: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    width: 'auto',
  },
  childTable: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    minHeight: 24,
    alignItems: 'center',
  },
  tableRowDashed: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    minHeight: 24,
    alignItems: 'center',
  },
  tableCellHeader: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    padding: 4,
    fontWeight: 700,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    padding: 4,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellLeft: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    padding: 4,
    textAlign: 'left',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // Column widths
  colLabel: { width: '25%' },
  colSemester: { width: '37.5%' },
  colPeriod: { width: '18.75%' },
  // Section header
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 700,
  },
});

// Sample data
const sampleData = {
  dates: {
    semester1: {
      period1: 'Thursday, May 16, 2565',
      period2: 'Tuesday, October 1, 2565',
    },
    semester2: {
      period1: 'Friday, November 1, 2565',
      period2: 'Saturday, March 1, 2566',
    },
  },
  measurements: {
    weight: {
      semester1: { period1: '-', period2: '-' },
      semester2: { period1: '-', period2: '-' },
    },
    height: {
      semester1: { period1: '-', period2: '-' },
      semester2: { period1: '-', period2: '-' },
    },
    weightByAge: {
      semester1: { period1: '-', period2: '-' },
      semester2: { period1: '-', period2: '-' },
    },
    heightByAge: {
      semester1: { period1: '-', period2: '-' },
      semester2: { period1: '-', period2: '-' },
    },
    weightByHeight: {
      semester1: { period1: '-', period2: '-' },
      semester2: { period1: '-', period2: '-' },
    },
  },
};

const attenStyles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 24,
    fontFamily: 'THSarabun',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
  },
  tableFooterRow: {
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  tableCol1: {
    width: '30%',
    borderRight: '1px sold black',
    position: 'relative',
    borderBottom: '1px solid black',
  },
  tableCol2: {
    width: '13.33%',
    borderRight: '1px sold black',
    borderBottom: '1px solid black',
  },
  tableCol3: {
    width: '13.33%',
    borderRight: '1px sold black',
    borderBottom: '1px solid black',
  },
  tableCol4: {
    width: '13.33%',
    borderRight: '1px sold black',
    borderBottom: '1px solid black',
  },
  tableCol5: {
    width: '30%',
    position: 'relative',
    borderBottom: '1px solid black',
  },
  tableChildCol1: {
    width: '30%',
    position: 'relative',
    borderBottom: '1px dashed black',
    borderRight: '1px solid black',
    paddingVertical: 4,
  },
  tableChildCol2: {
    width: '13.33%',
    borderBottom: '1px dashed black',
    borderRight: '1px solid black',
    paddingVertical: 4,
  },
  tableChildCol3: {
    width: '13.33%',
    borderBottom: '1px dashed black',
    borderRight: '1px solid black',
    paddingVertical: 4,
  },
  tableChildCol4: {
    width: '13.33%',
    borderBottom: '1px dashed black',
    borderRight: '1px solid black',
    paddingVertical: 4,
  },
  tableChildCol5: {
    width: '30%',
    position: 'relative',
    borderBottom: '1px dashed black',
    paddingVertical: 4,
  },
  tableCellHeader: {
    textAlign: 'center',
    fontWeight: '700',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCell: {
    textAlign: 'center',
  },
  emptyRow: {
    textAlign: 'center',
  },
  dashedRowSeparator: {
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
  },
});

const mockAttendanceData = [
  { month: 'พฤษภาคม', scheduled: 8, attended: 7, percentage: 87.5, notes: '' },
  { month: 'มิถุนายน', scheduled: 13, attended: 13, percentage: 100.0, notes: '' },
  { month: 'กรกฎาคม', scheduled: 12, attended: 12, percentage: 100.0, notes: '' },
  { month: 'สิงหาคม', scheduled: 15, attended: 15, percentage: 100.0, notes: '' },
  { month: 'กันยายน', scheduled: 12, attended: 12, percentage: 100.0, notes: '' },
  { month: 'ตุลาคม', scheduled: 0, attended: 0, percentage: 0, notes: '' },
  { month: 'พฤศจิกายน', scheduled: 14, attended: 14, percentage: 100.0, notes: '' },
  { month: 'ธันวาคม', scheduled: 12, attended: 12, percentage: 100.0, notes: '' },
  { month: 'มกราคม', scheduled: 14, attended: 14, percentage: 100.0, notes: '' },
  { month: 'กุมภาพันธ์', scheduled: 13, attended: 13, percentage: 100.0, notes: '' },
  { month: 'มีนาคม', scheduled: 12, attended: 12, percentage: 100.0, notes: '' },
  { month: 'เมษายน', scheduled: 0, attended: 0, percentage: 0, notes: '' },
];

export const AssessmentTemplate = ({
  data = sampleData,
  attendanceData = mockAttendanceData,
}) => {
  const NutritionTemplate = () => (
    <>
      <Text style={styles.title}>ผลการประเมินภาวะโภชนาการ</Text>

      <View style={styles.table}>
        {/* Header Row - Main split between left column and semesters */}
        <View style={[styles.tableRow, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
          <View
            style={[
              styles.tableCellHeader,
              styles.colLabel,
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '25%',
                height: 60,
              },
            ]}
          >
            <Text>น้ำหนัก - ส่วนสูง</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colLabel]}>
            <Text>&nbsp;</Text>
          </View>
          <View
            style={[
              styles.tableCellHeader,
              styles.colSemester,
              { borderBottom: '1px solid black' },
            ]}
          >
            <Text>ภาคเรียนที่ 1</Text>
          </View>
          <View
            style={[
              styles.tableCellHeader,
              styles.colSemester,
              { borderBottom: '1px solid black' },
            ]}
          >
            <Text>ภาคเรียนที่ 2</Text>
          </View>
        </View>

        {/* Subheader Row - Dividing semesters into periods */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.colLabel]}>
            <Text>&nbsp;</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 1</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 2</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 1</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 2</Text>
          </View>
        </View>

        {/* Dates Row */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCellHeader, styles.colLabel]}>
            <Text>วันที่ชั่งน้ำหนัก/วัดส่วนสูง</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester2.period2}</Text>
          </View>
        </View>

        {/* Weight Row */}
        <View style={styles.tableRowDashed}>
          <View style={[styles.tableCellLeft, styles.colLabel]}>
            <Text>น้ำหนัก (กิโลกรัม)</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester2.period2}</Text>
          </View>
        </View>

        {/* Height Row */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCellLeft, styles.colLabel]}>
            <Text>ส่วนสูง (เซนติเมตร)</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester2.period2}</Text>
          </View>
        </View>
      </View>

      <View style={styles.childTable}>
        {/* Header Row - Main split between left column and semesters */}
        <View style={[styles.tableRow, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
          <View
            style={[
              styles.tableCellHeader,
              styles.colLabel,
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '25%',
                height: 48,
              },
            ]}
          >
            <Text>น้ำหนัก - ส่วนสูง</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colLabel]}>
            <Text>&nbsp;</Text>
          </View>
          <View
            style={[
              styles.tableCellHeader,
              styles.colSemester,
              { borderBottom: '1px solid black' },
            ]}
          >
            <Text>ภาคเรียนที่ 1</Text>
          </View>
          <View
            style={[
              styles.tableCellHeader,
              styles.colSemester,
              { borderBottom: '1px solid black' },
            ]}
          >
            <Text>ภาคเรียนที่ 2</Text>
          </View>
        </View>

        {/* Subheader Row - Dividing semesters into periods */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.colLabel]}>
            <Text>&nbsp;</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 1</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 2</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 1</Text>
          </View>
          <View style={[styles.tableCellHeader, styles.colPeriod]}>
            <Text>ครั้งที่ 2</Text>
          </View>
        </View>

        {/* Dates Row */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCellHeader, styles.colLabel]}>
            <Text>วันที่ชั่งน้ำหนัก/วัดส่วนสูง</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.dates.semester2.period2}</Text>
          </View>
        </View>

        {/* Weight Row */}
        <View style={styles.tableRowDashed}>
          <View style={[styles.tableCellLeft, styles.colLabel]}>
            <Text>น้ำหนัก (กิโลกรัม)</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.weight.semester2.period2}</Text>
          </View>
        </View>

        {/* Height Row */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCellLeft, styles.colLabel]}>
            <Text>ส่วนสูง (เซนติเมตร)</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester1.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester1.period2}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester2.period1}</Text>
          </View>
          <View style={[styles.tableCell, styles.colPeriod]}>
            <Text>{data.measurements.height.semester2.period2}</Text>
          </View>
        </View>
      </View>
    </>
  );

  const AttendanceTemplate = () => (
    <>
      <Text style={attenStyles.title}>สรุปเวลาเรียน</Text>

      <View style={attenStyles.table}>
        {/* Table Header */}
        <View style={attenStyles.tableHeaderRow}>
          <View style={[attenStyles.tableCol1, { paddingVertical: 8 }]}>
            <Text style={[attenStyles.tableCellHeader]}>เดือน</Text>
          </View>
          <View style={attenStyles.tableCol2}>
            <Text style={attenStyles.tableCellHeader}>เวลาเต็ม{'\n'}(วัน)</Text>
          </View>
          <View style={attenStyles.tableCol3}>
            <Text style={attenStyles.tableCellHeader}>เวลามา{'\n'}(วัน)</Text>
          </View>
          <View style={attenStyles.tableCol4}>
            <Text style={attenStyles.tableCellHeader}>คิดเป็น{'\n'}ร้อยละ</Text>
          </View>
          <View style={[attenStyles.tableCol5, { paddingVertical: 8 }]}>
            <Text style={attenStyles.tableCellHeader}>หมายเหตุ</Text>
          </View>
        </View>

        {attendanceData.map((row, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={[
                attenStyles.tableChildCol1,
                {
                  borderBottomStyle:
                    index + 1 === attendanceData.length ? 'solid' : 'dashed',
                },
              ]}
            >
              <Text style={attenStyles.tableCell}>{row.month}</Text>
            </View>
            <View
              style={[
                attenStyles.tableChildCol2,
                {
                  borderBottomStyle:
                    index + 1 === attendanceData.length ? 'solid' : 'dashed',
                },
              ]}
            >
              <Text style={attenStyles.tableCell}>{row.scheduled}</Text>
            </View>
            <View
              style={[
                attenStyles.tableChildCol3,
                {
                  borderBottomStyle:
                    index + 1 === attendanceData.length ? 'solid' : 'dashed',
                },
              ]}
            >
              <Text style={attenStyles.tableCell}>{row.attended}</Text>
            </View>
            <View
              style={[
                attenStyles.tableChildCol4,
                {
                  borderBottomStyle:
                    index + 1 === attendanceData.length ? 'solid' : 'dashed',
                },
              ]}
            >
              <Text style={attenStyles.tableCell}>{row.percentage}</Text>
            </View>
            <View
              style={[
                attenStyles.tableChildCol5,
                {
                  borderBottomStyle:
                    index + 1 === attendanceData.length ? 'solid' : 'dashed',
                },
              ]}
            >
              <Text style={attenStyles.tableCell}>{row.notes}</Text>
            </View>
          </View>
        ))}

        <View style={attenStyles.tableFooterRow}>
          <View style={[attenStyles.tableCol1, { paddingVertical: 12 }]}>
            <Text style={attenStyles.tableCellHeader}>รวมตลอดปีการศึกษา</Text>
          </View>
          <View style={[attenStyles.tableCol2, { paddingVertical: 12 }]}>
            <Text style={attenStyles.tableCellHeader}>
              {attendanceData.reduce((acc, cur) => {
                acc += Number(cur.scheduled);
                return acc;
              }, 0) || '-'}
            </Text>
          </View>
          <View style={[attenStyles.tableCol3, { paddingVertical: 12 }]}>
            <Text style={attenStyles.tableCellHeader}>
              {attendanceData.reduce((acc, cur) => {
                acc += Number(cur.attended);
                return acc;
              }, 0) || '-'}
            </Text>
          </View>
          <View style={[attenStyles.tableCol4, { paddingVertical: 12 }]}>
            <Text style={attenStyles.tableCellHeader}>
              {attendanceData.reduce((acc, cur) => {
                acc += Number(cur.percentage);
                return acc;
              }, 0) || '-'}
            </Text>
          </View>

          <View style={[attenStyles.tableCol5, { paddingVertical: 12 }]}>
            <Text style={attenStyles.tableCellHeader}></Text>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <Page size="A4" style={styles.page}>
      <NutritionTemplate />
      <AttendanceTemplate />
    </Page>
  );
};
