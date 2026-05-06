import {
  Page,
  View,
  Image,
  Document,
  StyleSheet,
  Text,
  Font,
  Svg,
  Path,
} from '@react-pdf/renderer';
import { ExportProgressDataType } from '../template/cw-t-progress';
import { ChildDataType } from '../../..';
import { ExportSchoolDataType } from '../template/cw-t-school';

Font.register({
  family: 'HXFont',
  fonts: [
    {
      src: '/public/font/hx-55-r.ttf',
      fontWeight: 400,
    },
    {
      src: '/public/font/hx-75-b.ttf',
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 14,
    flexDirection: 'column',
    fontFamily: 'HXFont',
    textOverflow: 'ellipsis',
    fontSize: 16,
  },
  headline: {
    marginTop: '8pt',
    marginBottom: '14pt',
    fontWeight: 'bold',
  },
  subhead: {
    marginTop: '2pt',
    marginBottom: '4pt',
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
  },
  progresswrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '5px',
    display: 'flex',
  },
  progresschild: {
    padding: '8px',
    border: '1px soild black',
    borderRadius: '15px',
  },
  progressbarwrapper: {
    backgroundColor: '#ebedf2',
    width: '100%',
    height: '8px',
    borderRadius: '15px',
    overflow: 'hidden',
  },
  progressbar: {
    backgroundColor: 'rgb(0,171,85)',
    height: '100%',
  },
  tablewrapper: {
    width: '100%',
    flexDirection: 'column',
  },
  tablerow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  teacherheadline: {
    marginTop: '4pt',
    marginBottom: '4pt',
    fontWeight: 'bold',
  },
  teacherrow: {
    border: '1px soild black',
    borderRadius: '15px',
    padding: '8pt',
    marginTop: '4pt',
    marginBottom: '4pt',
    width: '100%',
  },
  tablecell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4pt',
  },
  celltext: {
    marginLeft: '8pt',
    display: 'flex',
    flexDirection: 'column',
  },
  classwrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4pt',
  },
});

const DocumentPDF = ({ childData }: { childData: ChildDataType }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        <Text key="mainViewT1" style={styles.headline}>
          รายงานความก้าวหน้าแบ่งตามเขตตรวจ
        </Text>
        {childData.DashboardBarChartTemplateImg && (
          <Image key="mainViewI1" src={childData.DashboardBarChartTemplateImg} />
        )}
        <Text key="mainViewT2" style={styles.headline}>
          ข้อมูลความคืบหน้าทั้งหมด
        </Text>
        <View style={styles.progresswrapper}>
          {childData.ProgressTemplateData?.map(
            (ptd: ExportProgressDataType, i: number) => (
              <View key={`progressbar1-${i}`} style={styles.progresschild}>
                <Text style={styles.subhead}>{ptd.title}</Text>
                <Text>ความก้าวหน้าเฉลี่ย:{ptd.progress}%</Text>
                <View style={styles.progressbarwrapper}>
                  <View style={{ ...styles.progressbar, width: `${ptd.progress}%` }} />
                </View>
              </View>
            ),
          )}
        </View>
        <View>
          {childData.ProgressTemplateData?.map(
            (ptd: ExportProgressDataType, i: number) => (
              <View key={`chart-${i}`} wrap={false}>
                <Text style={styles.headline}>{ptd.title}</Text>
                {childData.ProgressTemplateImg?.at(i) && (
                  <Image src={childData.ProgressTemplateImg?.at(i)} />
                )}
              </View>
            ),
          )}
        </View>
      </Page>
      {/* Page2 */}
      <Page size="A4" style={styles.page} wrap={true}>
        <Text key="mainViewT3" style={styles.headline}>
          ข้อมูลโรงเรียน
        </Text>
        <View style={styles.progresswrapper}>
          {childData.SchoolTemplateData?.map((sd: ExportSchoolDataType, i: number) => (
            <View key={`progressbar2-${i}`} style={styles.progresschild}>
              <Text style={styles.subhead}>{sd.title}</Text>
              <Text>ความก้าวหน้าเฉลี่ย:{sd.progress}%</Text>
              <View style={styles.progressbarwrapper}>
                <View style={{ ...styles.progressbar, width: `${sd.progress}%` }} />
              </View>
            </View>
          ))}
        </View>
        <Text key="mainViewT4" style={styles.headline}>
          ข้อมูลครู
        </Text>
        <View style={styles.tablewrapper}>
          {childData.TeacherData?.map((td: any, i: number) => (
            <View key={`teacher-row-${i}`} style={styles.teacherrow}>
              <Text style={styles.teacherheadline}>{td.teacher_name}</Text>
              <View style={styles.tablerow}>
                <View style={styles.tablecell}>
                  <IconGroup />
                  <View style={styles.celltext}>
                    <Text>จำนวนการบ้านที่ส่ง</Text>
                    <Text>{td.homework_count} ห้อง</Text>
                  </View>
                </View>
                <View style={styles.tablecell}>
                  <IconActivity />
                  <View style={styles.celltext}>
                    <Text>ความก้าวหน้า</Text>
                    <Text>{td.progress}%</Text>
                  </View>
                </View>
                <View style={styles.tablecell}>
                  <IconBook />
                  <View style={styles.celltext}>
                    <Text>จำนวนห้องเรียนที่ดูแล</Text>
                    <Text>{td.class_room_count} ห้อง</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Page>
      {/* Page3 */}
      <Page size="A4" style={styles.page} wrap={true}>
        <Text key="mainViewT5" style={styles.headline}>
          ข้อมูลห้องเรียน
        </Text>
        <View style={styles.classwrapper}>
          <Text>ปีการศึกษา {childData.StudentData.year}</Text>
          <Text>ระดับชั้น {childData.StudentData.selectedClass}</Text>
        </View>
        {childData.StudentChartImg && (
          <Image key="mainViewI5" src={childData.StudentChartImg} />
        )}
      </Page>
    </Document>
  );
};

const IconGroup = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20">
    <Path
      d="M14.1668 17.5V15.8333C14.1668 14.9493 13.8156 14.1014 13.1905 13.4763C12.5654 12.8512 11.7176 12.5 10.8335 12.5H4.16683C3.28277 12.5 2.43493 12.8512 1.80981 13.4763C1.18469 14.1014 0.833496 14.9493 0.833496 15.8333V17.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.49984 9.16667C9.34079 9.16667 10.8332 7.67428 10.8332 5.83333C10.8332 3.99238 9.34079 2.5 7.49984 2.5C5.65889 2.5 4.1665 3.99238 4.1665 5.83333C4.1665 7.67428 5.65889 9.16667 7.49984 9.16667Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.1665 17.5001V15.8334C19.166 15.0948 18.9201 14.3774 18.4676 13.7937C18.0152 13.2099 17.3816 12.793 16.6665 12.6084"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.3335 2.6084C14.0505 2.79198 14.686 3.20898 15.1399 3.79366C15.5937 4.37833 15.84 5.09742 15.84 5.83757C15.84 6.57771 15.5937 7.2968 15.1399 7.88147C14.686 8.46615 14.0505 8.88315 13.3335 9.06673"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconActivity = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20">
    <Path
      d="M18.3332 10H14.9998L12.4998 17.5L7.49984 2.5L4.99984 10H1.6665"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconBook = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20">
    <Path
      d="M3.33203 16.2503C3.33203 15.6978 3.55152 15.1679 3.94223 14.7772C4.33293 14.3865 4.86283 14.167 5.41536 14.167H16.6654"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.41536 1.66699H16.6654V18.3337H5.41536C4.86283 18.3337 4.33293 18.1142 3.94223 17.7235C3.55152 17.3328 3.33203 16.8029 3.33203 16.2503V3.75033C3.33203 3.19779 3.55152 2.66789 3.94223 2.27719C4.33293 1.88649 4.86283 1.66699 5.41536 1.66699V1.66699Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DocumentPDF;
