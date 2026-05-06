import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
} from '@react-pdf/renderer';
import { EvaluationStudent } from '@domain/g06/g06-d05/g06-d05-p08-nutritional-summary/type';

Font.register({
  family: 'THSarabunWithFallback',
  fonts: [
    {
      src: '/font/THSarabun/SarabunRegular.ttf',
      fontWeight: 400,
    },
    {
      src: '/font/THSarabun/SarabunBold.ttf',
      fontWeight: 700,
    },
    {
      src: '/font/NotoSansSymbols2-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/font/NotoSansSymbols2/NotoSansSymbols2-Regular.ttf',
      fontWeight: 'normal',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'THSarabunWithFallback',
    fontSize: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
    textAlign: 'center',
  },
  nameCell: {
    textAlign: 'left',
    paddingLeft: 4,
  },
  verticalText: {
    writingMode: 'vertical-rl',
    transform: 'rotate(90deg)',
    textAlign: 'center',
    fontSize: 8,
    padding: 2,
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 6,
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const indicatorLabels = [
  'รักชาติ',
  'ซื่อสัตย์',
  'มีวินัย',
  'ใฝ่เรียนรู้',
  'พอเพียง',
  'มุ่งมั่น',
  'เป็นไทย',
  'สาธารณะ',
];

const evaluationResultLabels = ['ผ่าน', 'ไม่ผ่าน', 'ดี', 'ดีเยี่ยม'];

interface Props {
  data: EvaluationStudent[];
  title: string;
  year: string;
  academicYear: string;
}

const DesiredAttributesPdf = ({ data, title, year, academicYear }: Props) => {
  const CheckIcon = () => (
    <Svg width="10" height="10" viewBox="0 0 24 24">
      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#000" />
    </Svg>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            สรุปประเมิน {title} ชั้น {year} ปีการศึกษา {academicYear}
          </Text>
          <Text style={styles.subHeader}>
            การอ่าน คิดวิเคราะห์ และเขียนสื่อความ ชั้น {year} ปีการศึกษา {academicYear}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Header Row 1 */}
          <View style={styles.row}>
            <View
              style={[styles.cell, styles.headerCell, { width: '20%', borderBottom: 0 }]}
            >
              <Text></Text>
            </View>
            <View
              style={[styles.cell, styles.headerCell, { width: '5%', borderBottom: 0 }]}
            >
              <Text></Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: '42.84%' }]}>
              <Text>คุณลักษณะอันพึงประสงค์</Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: '32.13%' }]}>
              <Text>อ่าน คิดวิเคราะห์ และเขียนสื่อความ</Text>
            </View>
          </View>

          {/* Header Row 2 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cell,
                styles.headerCell,
                { width: '20%', borderBottom: 0, justifyContent: 'center' },
              ]}
            >
              <Text>ชื่อ-สกุล</Text>
            </View>
            <View
              style={[
                styles.cell,
                styles.headerCell,
                { width: '5%', borderBottom: 0, justifyContent: 'center' },
              ]}
            >
              <Text>เลขที่</Text>
            </View>

            {indicatorLabels.map((label, index) => (
              <View
                key={index}
                style={[
                  styles.cell,
                  styles.headerCell,
                  { width: '3.57%', borderBottom: 0 },
                ]}
              >
                <Text style={styles.verticalText}>{label}</Text>
              </View>
            ))}

            <View
              style={[
                styles.cell,
                styles.headerCell,
                { width: '14.28%', justifyContent: 'center' },
              ]}
            >
              <Text>ผลการประเมิน</Text>
            </View>

            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.cell,
                  styles.headerCell,
                  { width: '3.57%', borderBottom: 0 },
                ]}
              >
                <Text>{index + 1}</Text>
              </View>
            ))}

            <View
              style={[
                styles.cell,
                styles.headerCell,
                { width: '14.28%', justifyContent: 'center' },
              ]}
            >
              <Text>ผลการประเมิน</Text>
            </View>
          </View>

          {/* Header Row 3 */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.headerCell, { width: '20%' }]}></View>
            <View style={[styles.cell, styles.headerCell, { width: '5%' }]}></View>

            {indicatorLabels.map((_, index) => (
              <View
                key={index}
                style={[styles.cell, styles.headerCell, { width: '3.57%' }]}
              ></View>
            ))}

            {evaluationResultLabels.map((label, index) => (
              <View
                key={index}
                style={[styles.cell, styles.headerCell, { width: '3.57%' }]}
              >
                <Text style={{ fontSize: 8 }}>{label}</Text>
              </View>
            ))}

            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                style={[styles.cell, styles.headerCell, { width: '3.57%' }]}
              ></View>
            ))}

            {evaluationResultLabels.map((label, index) => (
              <View
                key={index}
                style={[styles.cell, styles.headerCell, { width: '3.57%' }]}
              >
                <Text style={{ fontSize: 8 }}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {data.map((student, index) => {
            const detail = student.additional_fields;
            return (
              <View key={student.evaluation_student_id} style={styles.row}>
                <View style={[{
                  width: '20%',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  padding: 2,
                }]}>
                  <Text>
                    {detail
                      ? `${detail.title || ''} ${detail.thai_first_name || ''} ${detail.thai_last_name || ''}`.trim()
                      : '-'}
                  </Text>
                </View>
                <View style={[styles.cell, { width: '5%' }]}>
                  <Text>{index + 1}</Text>
                </View>

                {student.student_indicator_data.map((data, i) => {
                  if (i === 8 || i === 14) {
                    return Array.from({ length: 4 }).map((_, resultIndex) => (
                      <View
                        key={`indicator-data-${index}-${i}-${resultIndex}`}
                        style={[styles.cell, { width: '3.57%' }]}
                      >
                        <View style={styles.iconContainer}>
                          {resultIndex + 1 === data?.value && <CheckIcon />}
                        </View>
                      </View>
                    ));
                  }

                  return (
                    <View
                      key={`indicator-data-${index}-${i}`}
                      style={[styles.cell, { width: '3.57%' }]}
                    >
                      <Text>{data?.value ?? ''}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default DesiredAttributesPdf;
