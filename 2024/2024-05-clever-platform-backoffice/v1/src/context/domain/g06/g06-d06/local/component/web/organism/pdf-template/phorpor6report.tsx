import { studentTransformFunc } from '@domain/g06/g06-d06/local/stores/student-detail';
import { StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { AssessmentTemplate } from './phorpor6report-assessment';
import FeedbackTemplate from './phorpor6report-feedback';
import { DateFormat } from '@domain/g06/g06-d06/local/utils/date-format';

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
    backgroundColor: 'white',
    padding: 24,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'THSarabun',
  },

  textLg: {
    fontSize: 18,
    fontWeight: 700,
  },

  center: {
    textAlign: 'center',
  },

  left: {
    textAlign: 'left',
  },

  row: {
    flexDirection: 'row',
    marginVertical: 12,
    width: '100%',
  },

  label: {
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
    borderBottom: '1px dashed black',
    textAlign: 'center',
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

type Props = {
  student: StudentDetailDto;
};

const Phorpor6ReportTemplate = (props: Props) => {
  const student = studentTransformFunc.phorpor6reportDto(props.student);
  const school = studentTransformFunc.school(props.student);
  const studentInfo = studentTransformFunc.phorpor6InforDto(props.student);
  const allsign = studentTransformFunc.allSign(props.student);
  const assessment = studentTransformFunc.phorpor6AssessmentDto(props.student);

  const CoverPage = () => (
    <Page size="A4" style={styles.page} wrap>
      <Text style={[styles.center, styles.textLg]}>แบบรายงานประจำตัวนักเรียน</Text>
      <Text style={[styles.center, styles.textLg]}>
        ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)
      </Text>
      <Text style={[styles.center, styles.textLg]}>{school?.name}</Text>
      <Text style={[styles.center]}>{school?.area}</Text>

      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={[styles.label, { width: '5%', textAlign: 'left' }]}>ชื่อ</Text>
        <Text style={[styles.input, { width: '40%' }]}>{student?.firstName}</Text>
        <Text style={[styles.label, { width: '10%' }]}>นามสกุล</Text>
        <Text style={[styles.input, { width: '45%' }]}>{student?.lastName}</Text>
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={[styles.label, { width: '7%', textAlign: 'left' }]}>วันเกิด</Text>
        <Text style={[styles.input, { width: '38%' }]}>{student?.dob}</Text>
        <Text style={[styles.label, { width: '5%' }]}>อายุ</Text>
        <Text style={[styles.input, { width: '20%' }]}>{student?.age}</Text>
        <Text style={[styles.label, { width: '5%' }]}>ปี</Text>
        <Text style={[styles.input, { width: '20%' }]}>{student?.ageMonth}</Text>
        <Text style={[styles.label, { width: '5%' }]}>เดือน</Text>
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={[styles.label, { width: '20%', textAlign: 'left' }]}>
          เลขประจำตัวนักเรียนน
        </Text>
        <Text style={[styles.input, { width: '20%' }]}>{student?.idNo}</Text>
        <Text style={[styles.label, { width: '25%' }]}>เลขประจำตัวประชาชนน</Text>
        <Text style={[styles.input, { width: '35%' }]}>{student?.citizenNo}</Text>
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={[styles.label, { width: '4%', textAlign: 'left' }]}>ชั้น</Text>
        <Text style={[styles.input, { width: '46%' }]}>{student?.grade}</Text>
        <Text style={[styles.label, { width: '6%' }]}>เลขที่</Text>
        <Text style={[styles.input, { width: '44%' }]}>{student?.studentNo}</Text>
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <Text style={[styles.label, { width: '10%', textAlign: 'left' }]}>
          ปีการศึกษา
        </Text>
        <Text style={[styles.input, { width: '90%' }]}>{student?.academicYear}</Text>
      </View>

      <View style={[styles.row, { marginTop: 32, marginBottom: 0 }]}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: '5%' }]}>ลงชื่อ</Text>
          <Text style={[styles.input, { width: '30%', paddingTop: 16, marginLeft: 4 }]} />
        </View>
      </View>
      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>
            {`(${allsign.subjectTeacher})`}
          </Text>
        </View>
      </View>

      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>
            ครูประจำชั้น/ครูที่ปรึกษาา
          </Text>
        </View>
      </View>

      <View style={[styles.row, { marginTop: 28, marginBottom: 0 }]}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: '5%' }]}>ลงชื่อ</Text>
          <Text style={[styles.input, { width: '30%', paddingTop: 16, marginLeft: 4 }]} />
        </View>
      </View>
      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>
            {`(${allsign.headOfSubject})`}
          </Text>
        </View>
      </View>

      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>หัวหน้างานวิชาการโรงเรียน</Text>
        </View>
      </View>

      <View style={[styles.row, { marginTop: 28, marginBottom: 0 }]}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: '5%' }]}>ลงชื่อ</Text>
          <Text style={[styles.input, { width: '30%', paddingTop: 16, marginLeft: 4 }]} />
        </View>
      </View>
      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>
            {`(${allsign.principal})`}
          </Text>
        </View>
      </View>

      <View style={(styles.row, { margin: 8 })}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: 'auto' }]}>ผู้อำนวยการโรงเรียน</Text>
        </View>
      </View>

      <View style={[styles.row, { marginTop: 28, marginBottom: 0 }]}>
        <View style={styles.flexCenter}>
          <Text style={[styles.label, { width: '5%' }]}>วันที่</Text>
          <Text style={[styles.input, { width: '30%' }]}>
            {DateFormat.thaiDate(allsign.signDate)}
          </Text>
        </View>
      </View>
    </Page>
  );

  const InformationPage = () => (
    <Page size="A4" style={styles.page} wrap>
      <Text style={[styles.center, styles.textLg]}>ข้อมูลนักเรียน</Text>
      <View style={[{ marginTop: 12 }]}>
        <View style={styles.row}>
          <Text style={[styles.label, styles.left, { width: '5%' }]}>ชื่อ</Text>
          <Text style={[styles.input, { width: '45%' }]}>{studentInfo?.firstName}</Text>
          <Text style={[styles.label, { width: '5%' }]}>สกุล</Text>
          <Text style={[styles.input, { width: '45%' }]}>{studentInfo?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, styles.left, { width: '7%' }]}>วันเกิด</Text>
          <Text style={[styles.input, { width: '40%' }]}>{studentInfo?.dob}</Text>
          <Text style={[styles.label, { width: '5%' }]}>อายุ</Text>
          <Text style={[styles.input, { width: '19%' }]}>{studentInfo?.age}</Text>
          <Text style={[styles.label, { width: '5%' }]}>ปี</Text>
          <Text style={[styles.input, { width: '19%' }]}>{studentInfo?.ageMonth}</Text>
          <Text style={[styles.label, { width: '5%' }]}>เดือน</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '5%' }]}>เพศ</Text>
          <Text style={[styles.input, { width: '10%' }]}>{studentInfo?.gender}</Text>
          <Text style={[styles.label, { width: '10%' }]}>เชื้ิอชาติ</Text>
          <Text style={[styles.input, { width: '12%' }]}>{studentInfo?.ethnicity}</Text>
          <Text style={[styles.label, { width: '10%' }]}>สัญชาติ</Text>
          <Text style={[styles.input, { width: '20%' }]}>{studentInfo?.nationality}</Text>
          <Text style={[styles.label, { width: '8%' }]}>ศาสนา</Text>
          <Text style={[styles.input, { width: '25%' }]}>{studentInfo?.religion}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '20%' }]}>
            เลขประจำตัวนักเรียนน
          </Text>
          <Text style={[styles.input, { width: '25%' }]}>{studentInfo?.idNo}</Text>
          <Text style={[styles.label, { width: '23%' }]}>เลขประจำตัวประชาชนน</Text>
          <Text style={[styles.input, { width: '32%' }]}>{studentInfo?.citizenNo}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '13%' }]}>
            เลขอยู่ปัจจุบัน
          </Text>
          <Text style={[styles.input, { width: '87%' }]}>{studentInfo?.address}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '13%' }]}>ชื่อ-สกุลบิดา</Text>
          <Text style={[styles.input, { width: '45%' }]}>
            {studentInfo?.fatherFullname}
          </Text>
          <Text style={[styles.label, { width: '7%' }]}>อาชีพ</Text>
          <Text style={[styles.input, { width: '35%' }]}>{studentInfo?.fatherJob}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '13%' }]}>
            ชื่อ-สกุลมารดา
          </Text>
          <Text style={[styles.input, { width: '45%' }]}>
            {studentInfo?.motherFullname}
          </Text>
          <Text style={[styles.label, { width: '7%' }]}>อาชีพ</Text>
          <Text style={[styles.input, { width: '35%' }]}>{studentInfo?.motherJob}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '30%' }]}>
            สถานภาพสมรสของบิดา-มารดา
          </Text>
          <Text style={[styles.input, { width: '70%' }]}>
            {studentInfo?.parentStatus}
          </Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '17%' }]}>
            ชื่อ-สกุลผู้ปกครอง
          </Text>
          <Text style={[styles.input, { width: '45%' }]}>
            {studentInfo?.guardianFullname}
          </Text>
          <Text style={[styles.label, { width: '7%' }]}>อาชีพ</Text>
          <Text style={[styles.input, { width: '35%' }]}>{studentInfo?.guardianJob}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, styles.left, { width: '25%' }]}>
            ความเกี่ยวข้องกับนักเรียน
          </Text>
          <Text style={[styles.input, { width: '75%' }]}></Text>
        </View>

        <View style={{ marginTop: 32 }}>
          <Text style={[styles.textLg, styles.center]}>
            บันทึกการเปลี่ยนแปลงหรือแก้ไขข้อมูล
          </Text>
        </View>

        <View
          style={[
            styles.row,
            {
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.input, { width: '100%', marginTop: 16 }]} />
        </View>

        <View
          style={[
            styles.row,
            {
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.input, { width: '100%', marginTop: 16 }]} />
        </View>

        <View
          style={[
            styles.row,
            {
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.input, { width: '100%', marginTop: 16 }]} />
        </View>
      </View>
    </Page>
  );

  const AssessmentPage = () => (
    <AssessmentTemplate
      data={assessment?.data}
      attendanceData={assessment?.attenanceData}
    />
  );

  const FeedbackPage = () => <FeedbackTemplate />;

  return (
    <Document>
      <CoverPage />
      <InformationPage />
      <AssessmentPage />
      <FeedbackPage />
    </Document>
  );
};

export default Phorpor6ReportTemplate;
