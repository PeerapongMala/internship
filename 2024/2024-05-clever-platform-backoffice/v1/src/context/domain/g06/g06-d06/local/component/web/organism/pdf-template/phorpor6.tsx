import { StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import { DateFormat } from '@domain/g06/g06-d06/local/utils/date-format';
import { roundNumber } from '@global/utils/number';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { defaultTo } from 'lodash';

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

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFCCFF',
    padding: 24,
    flexDirection: 'column',
    fontFamily: 'THSarabun',
    textOverflow: 'ellipsis',
    fontSize: 16,
  },

  container: {
    width: '100%',
    padding: 0,
    marginBottom: 10,
  },

  borderBottom: {
    borderBottom: '1px solid black',
  },

  textCenter: {
    textAlign: 'center',
    fontSize: 16,
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },

  textBold: {
    fontWeight: 700,
  },
  textLeft: {
    textAlign: 'left',
  },

  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRowHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    flexGrow: 1,
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
});

const tableStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 16,
    fontFamily: 'THSarabun',
    fontSize: 12,
    background: 'white',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    position: 'relative',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 24,
    alignItems: 'center',
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 35,
    alignItems: 'center',
  },
  tableCellHeader: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    textAlign: 'center',
    height: '100%',
    fontWeight: 700,
  },
  tableCell: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    height: '100%',
  },
  tableCellCenter: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    textAlign: 'center',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  // Width for each column
  colVertical: { width: '5%' }, // New column for vertical text
  colCode: { width: '10%' },
  colName: { width: '30%' }, // Reduced to accommodate vertical column
  colHours: { width: '10%' },
  colTotalScore: { width: '10%' },
  colAvgScore: { width: '10%' },
  colScore: { width: '10%' },
  colGrade: { width: '10%' },
  colNote: { width: '10%' },
  // Vertical text styling
  verticalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '5%',
    zIndex: 10,
    border: '1px solid black',
    borderLeft: 0,
    borderTop: 0,
  },
  verticalText: {
    transform: 'rotate(-90deg)',
    textAlign: 'center',
    width: '100%',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 12,
  },
  headerTextBold: {
    fontWeight: 700,
    textAlign: 'center',
  },
  totalRowText: {
    fontWeight: 700,
    textAlign: 'center',
  },
  normalText: {},
  centerText: {
    textAlign: 'center',
  },
  modifiedTableRow: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 24,
    alignItems: 'center',
    marginLeft: '5%', // Added margin to accommodate vertical column
  },
  modifiedTableRowHeader: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 24,
    alignItems: 'center',
    marginLeft: '5%', // Added margin to accommodate vertical column
  },
  modifiedTotalRow: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    minHeight: 24,
    alignItems: 'center',
    marginLeft: '5%', // Added margin to accommodate vertical column
  },
  extendTable: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    position: 'relative',
  },
  extendVerticalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '5%',
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
  },

  extendTableRowHeader: {
    flexDirection: 'row',
    minHeight: 24,
    alignItems: 'center',
    marginLeft: '5%',
  },

  extendTableCellCenter: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    textAlign: 'center',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    width: '40%',
  },

  extentChildTableLeftCenter: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    textAlign: 'left',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    width: '40%',
    borderBottom: '1px solid black',
  },

  extentChildTableLeftw50Center: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 4,
    textAlign: 'left',
    height: '100%',
    alignItems: 'flex-start',
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'center',
    width: '55%',
    borderBottom: '1px solid black',
    marginLeft: '-5%',
  },
});

type Props = {
  student: StudentDetailDto | null;
  generals: StudentDetailDto['dataJson']['general'];
  grades: {
    scorePercentage: number;
    totalScoreRank: number;
    avgLearnScore: number;
    avgLearnRank: number;
    normal_credits: number;
    extra_credits: number;
    total_credits: number;
  } | null

};

const formatDecimal = (value: string | number) => {
  if (value === undefined || value === null) return '';
  return Number(value).toFixed(2);
};

const Phorpor6Template = ({ student, generals, grades }: Props) => {
  if (!student) return null;
  const capacityData = generals?.filter(d => d.generalType === 'สมรรถนะ')
  // กิจกรรมพัฒนาผู้เรียน
  const activityData = generals?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
  // คุณลักษณะอันพึงประสงค์
  const characteristicData = generals?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

  const summary = defaultTo(student?.dataJson.subject, []).reduce(
    (acc, current) => {
      acc.hours += Number(current.hours);
      acc.totalScore += Number(current.totalScore);
      acc.avgScore += Number(current.avgScore);
      acc.score += Number(current.score);
      return acc;
    },
    {
      hours: 0,
      totalScore: 0,
      avgScore: 0,
      score: 0,
    },
  );

  return (
    <Document>
      <Page size="A4" style={tableStyles.page} wrap>
        <Text style={[styles.textCenter, styles.textBold]}>
          แบบรายงานประจำตัวนักเรียน : ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6)
        </Text>
        <Text style={[styles.textCenter, styles.textBold]}>
          {student.dataJson.school_name}
          {student.dataJson.school_area}
        </Text>
        <Text style={[styles.textCenter, styles.textBold]}>
          ชั้นประถมศึกษาปีที่ {student.year} ปีการศึกษา {student.academicYear}
        </Text>

        <View style={[tableStyles.table, { borderTop: 0, borderLeft: 0 }]}>
          {/* Vertical Column */}
          <View
            style={[tableStyles.verticalContainer, { borderRight: 0, borderBottom: 0 }]}
          >
            <Text style={tableStyles.verticalText}></Text>
          </View>

          {/* Table Header */}
          <View
            style={[
              tableStyles.modifiedTableRowHeader,
              { borderBottom: 0, minHeight: 0, margin: 12 },
            ]}
          >
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '15%',
                  borderRight: 0,
                  padding: 0,
                  marginLeft: '-5%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                },
              ]}
            >
              <Text style={[tableStyles.headerText, { fontSize: 16 }]}>ชื่อสกุล</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '30%',
                  borderRight: 0,
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px dashed black',
                },
              ]}
            >
              <Text style={[tableStyles.headerText, { fontSize: 16 }]}>
                {`${student.thaiFirstName} ${student.thaiLastName}`}
              </Text>
            </View>
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '20%',
                  borderRight: 0,

                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: 16,
                },
              ]}
            >
              <Text style={[tableStyles.headerText, { fontSize: 16 }]}>เลขประจำตัว</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '20%',
                  borderRight: 0,
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px dashed black',
                  fontSize: 16,
                },
              ]}
            >
              <Text style={tableStyles.headerText}>{student.studentIdNo}</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '10%',
                  borderRight: 0,
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: 16,
                },
              ]}
            >
              <Text style={[tableStyles.headerText, { fontSize: 16 }]}>เลขที่</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellHeader,
                {
                  width: '10%',
                  borderRight: 0,
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px dashed black',
                  fontSize: 16,
                },
              ]}
            >
              <Text style={[tableStyles.headerText, { fontSize: 16 }]}>
                {student.studentId}
              </Text>
            </View>
          </View>
        </View>

        <View style={[tableStyles.table, { borderBottomWidth: 0, position: 'relative' }]}>
          {/* Vertical Column */}
          <View
            style={{
              display: 'flex',
              position: 'absolute',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              width: '5%',
              border: '1px solid black',
              borderLeft: 0,
              borderTop: 0,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                transform: 'rotate(-90deg)',
                width: '100%',
                minWidth: 120,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              ผลการเรียนรายวิชาพื้นฐาน
            </Text>
          </View>

          {/* Table Header */}
          <View style={tableStyles.modifiedTableRowHeader}>
            <View style={[tableStyles.tableCellHeader, tableStyles.colCode]}>
              <Text style={tableStyles.headerText}>รหัสวิชา</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colName]}>
              <Text style={tableStyles.headerText}>รายวิชา</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colHours]}>
              <Text style={tableStyles.headerText}>เวลาเรียน</Text>
              <Text style={tableStyles.headerText}>(ชั่วโมง/ปี)</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colTotalScore]}>
              <Text style={tableStyles.headerText}>คะแนน</Text>
              <Text style={tableStyles.headerText}>เต็ม</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colAvgScore]}>
              <Text style={tableStyles.headerText}>เฉลี่ย</Text>
              <Text style={tableStyles.headerText}>ในชั้นเรียน</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colScore]}>
              <Text style={tableStyles.headerText}>คะแนน</Text>
              <Text style={tableStyles.headerText}>ที่ได้</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colGrade]}>
              <Text style={tableStyles.headerText}>ผล</Text>
              <Text style={tableStyles.headerText}>การเรียน</Text>
            </View>
            <View style={[tableStyles.tableCellHeader, tableStyles.colNote]}>
              <Text style={tableStyles.headerText}>หมายเหตุ</Text>
            </View>
          </View>

          {/* Subject Rows */}
          {student.dataJson.subject.map((subject, index) => (
            <View key={index} style={tableStyles.modifiedTableRow} wrap={true}>
              <View style={[tableStyles.tableCell, tableStyles.colCode]}>
                <Text style={tableStyles.normalText}>{subject.subjectCode}</Text>
              </View>
              <View style={[tableStyles.tableCell, tableStyles.colName]}>
                <Text style={tableStyles.normalText}>{subject.subjectName}</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colHours]}>
                <Text style={tableStyles.normalText}>{subject.hours}</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colTotalScore]}>
                <Text style={tableStyles.normalText}>{subject.totalScore}</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colAvgScore]}>
                <Text style={tableStyles.normalText}>
                  {formatDecimal(subject.avgScore)}
                </Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colScore]}>
                <Text style={tableStyles.normalText}>{subject.score}</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colGrade]}>
                <Text style={tableStyles.normalText}>{formatDecimal(subject.grade)}</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colNote]}>
                <Text style={tableStyles.normalText}>{subject.note}</Text>
              </View>
            </View>
          ))}

          {/* Empty Rows */}
          {[1, 2, 3].map((_, index) => (
            <View key={`empty-${index}`} style={tableStyles.modifiedTableRow}>
              <View style={[tableStyles.tableCell, tableStyles.colCode]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCell, tableStyles.colName]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colHours]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colTotalScore]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colAvgScore]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colScore]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colGrade]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[tableStyles.tableCellCenter, tableStyles.colNote]}>
                <Text>&nbsp;</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={tableStyles.extendTable}>
          <View style={[tableStyles.extendVerticalContainer]}>
            <Text style={tableStyles.verticalText}> </Text>
          </View>

          <View
            style={[
              tableStyles.modifiedTableRowHeader,
              { borderBottomWidth: 0, position: 'relative' },
            ]}
          >
            <View style={[tableStyles.extendTableCellCenter]}>
              <View
                style={{
                  position: 'absolute',
                  borderBottom: '1px solid black',
                  width: '115%',
                  left: '-27px',
                  bottom: '0',
                }}
              />
              <Text style={[tableStyles.totalRowText, styles.textBold]}>รวม</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colHours,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>{summary.hours}</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colTotalScore,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>{summary.totalScore}</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colAvgScore,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>
                {formatDecimal(summary.avgScore)}
              </Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colScore,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>{summary.score}</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colGrade,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>-</Text>
            </View>
            <View
              style={[
                tableStyles.tableCellCenter,
                tableStyles.colNote,
                { borderBottom: '1px solid black' },
              ]}
            >
              <Text style={tableStyles.totalRowText}>-</Text>
            </View>
          </View>
        </View>



        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10
          }}
        >

          {/* ซ้าย: ตารางผลประเมิน */}
          <View style={{ flex: 2 }}>
            <View style={{ border: "1px solid black", flexDirection: "column", marginBottom: 10 }} wrap={false}>
              {/* คะแนนคิดเป็นร้อยละ */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  คะแนนคิดเป็นร้อยละ
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {roundNumber(Number(grades?.scorePercentage))}
                </Text>
              </View>

              {/* คะแนนรวมได้ลำดับที่ */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  คะแนนรวมได้ลำดับที่
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.totalScoreRank}
                </Text>
              </View>

              {/* ผลการเรียนเฉลี่ย */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  ผลการเรียนเฉลี่ย
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.avgLearnScore}
                </Text>
              </View>

              {/* ผลการเรียนเฉลี่ยได้ลำดับที่ */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  ผลการเรียนเฉลี่ยได้ลำดับที่
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.avgLearnRank}
                </Text>
              </View>

              {/* จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.normal_credits}
                </Text>
              </View>

              {/* จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม */}
              <View style={{ flexDirection: "row", borderBottom: "1px solid black" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.extra_credits}
                </Text>
              </View>

              {/* รวมหน่วยกิต/น้ำหนัก */}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 3, padding: 4, borderRight: "1px solid black" }}>
                  รวมหน่วยกิต/น้ำหนัก
                </Text>
                <Text style={{ flex: 1, textAlign: "center", padding: 4 }}>
                  {grades?.total_credits}
                </Text>
              </View>
            </View>


            {defaultTo(activityData, []).map((g) => (
              <View key={g.evaluationStudentId} style={{ marginBottom: 10 }} wrap={false}>
                <View
                  style={{
                    border: "1px solid black",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ flex: 1, padding: 4, fontWeight: "bold" }}>
                    ผลการประเมินกิจกรรมพัฒนาผู้เรียน
                  </Text>
                </View>

                {g.studentIndicatorData.map((d, i) => (
                  <View
                    key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                    style={{
                      flexDirection: "row",
                      borderLeft: "1px solid black",
                      borderRight: "1px solid black",
                      borderBottom: "1px solid black",
                    }}
                  >
                    <Text style={{ flex: 3, padding: 4 }}>{d.indicatorGeneralName}</Text>
                    <Text
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: 4,
                        fontWeight: "bold",
                      }}
                    >
                      {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* คุณลักษณะอันพึงประสงค์ */}
            {defaultTo(characteristicData, []).map((g) => (
              <View key={g.evaluationStudentId} wrap={false}>
                {g.studentIndicatorData
                  .filter(
                    (d) =>
                      d.indicatorGeneralName === "ผลประเมินคุณลักษณะอันพึงประสงค์"
                  )
                  .map((d, i) => (
                    <View
                      key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                      style={{
                        flexDirection: "row",
                        border: "1px solid black",
                      }}
                    >
                      <Text style={{ flex: 3, padding: 4 }}>{d.indicatorGeneralName}</Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: 4,
                          fontWeight: "bold",
                        }}
                      >
                        {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                      </Text>
                    </View>
                  ))}

                {g.studentIndicatorData
                  .filter(
                    (d) => d.indicatorGeneralName === "อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5"
                  )
                  .map((d, i) => (
                    <View
                      key={`${g.evaluationStudentId}.${d.indicatorGeneralName}.${i}`}
                      style={{
                        flexDirection: "row",
                        border: "1px solid black",
                      }}
                    >
                      <Text style={{ flex: 3, padding: 4 }}>
                        ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: 4,
                          fontWeight: "bold",
                        }}
                      >
                        {d.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                      </Text>
                    </View>
                  ))}

                {defaultTo(capacityData, []).map((g2) => {
                  const competency6 = g2.studentIndicatorData.find(
                    (d) => d.indicatorGeneralName === "competency-6"
                  );

                  return competency6 ? (
                    <View
                      key={`${g.evaluationStudentId}.${competency6.indicatorGeneralName}`}
                      style={{
                        flexDirection: "row",
                        border: "1px solid black",
                      }}
                    >
                      <Text style={{ flex: 3, padding: 4 }}>
                        ผลการประเมินสมรรถนะสำคัญของผู้เรียน
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: 4,
                          fontWeight: "bold",
                        }}
                      >
                        {competency6.value === 1 ? "ผ่าน" : "ไม่ผ่าน"}
                      </Text>
                    </View>
                  ) : null;
                })}
              </View>
            ))}
          </View>

          {/* ขวา: ช่องเซ็นชื่อ */}
          <View style={{ flex: 2, }}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <Text>ลงชื่อ...................................................</Text>
              <Text>{`(${student.dataJson.subjectTeacher})`}</Text>
              <Text> ครูประจำชั้น/ครูที่ปรึกษา</Text>
              <Text>{DateFormat.thaiDate(student.dataJson.signDate)}</Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <Text>ลงชื่อ...................................................</Text>
              <Text>{`(${student.dataJson.headOfSubject})`}</Text>
              <Text> หัวหน้างานวิชาการโรงเรียน</Text>
              <Text>{DateFormat.thaiDate(student.dataJson.signDate)}</Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <Text>ลงชื่อ...................................................</Text>
              <Text>{`(${student.dataJson.principal})`}</Text>
              <Text> ผู้อำนวยการโรงเรียน</Text>
              <Text>{DateFormat.thaiDate(student.dataJson.signDate)}</Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <Text>ลงชื่อ...................................................</Text>
              <Text>(.........................................................)</Text>
              <Text> ผู้ปกครองนักเรียน</Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default Phorpor6Template;
