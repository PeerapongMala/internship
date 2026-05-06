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
  CoverPageData,
  AchievementData,
  Subject,
} from '@domain/g06/g06-d05/local/api/type';

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
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'THSarabun',
    backgroundColor: '#FFCCFF',
    fontSize: 10,
  },
  header: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'heavy',
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: 'heavy',
  },
  section: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 2,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: '30%',
    fontSize: 12,
  },
  value: {
    width: '70%',
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted',
    paddingBottom: 1,
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
    minHeight: 14,
  },
  tableHeader: {
    backgroundColor: '#FFCCFF',
    fontWeight: 'bold',
  },
  tableCell: {
    paddingHorizontal: 2,
    fontSize: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    justifyContent: 'center',
  },
  smallCell: {
    width: '8%',
  },
  mediumCell: {
    width: '8%',
  },
  largeCell: {
    width: '30%',
  },
  approvalSection: {
    borderTopColor: '#000',
  },
  approvalRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-end',
  },
  approvalLabel: {
    width: 80,
    fontSize: 12,
    textAlign: 'right',
    marginRight: 10,
  },
  approvalValue: {
    minWidth: 200,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dotted',
    paddingBottom: 1,
    paddingLeft: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  checkboxLabel: {
    fontSize: 12,
    marginLeft: 3,
  },
  customCheckbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#000',
  },
  signatureLine: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: '#000',
    marginVertical: 5,
    alignSelf: 'center',
  },
  signatureLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  statContainer: {
    marginBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center',
  },
  statLabel: {
    width: '25%',
    fontSize: 10,
  },
  statValueContainer: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '24%',
  },
  statValue: {
    width: 20,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: '#000',
    textAlign: 'center',
    marginRight: 3,
  },
  statUnit: {
    fontSize: 10,
  },
  tableContainer: {
    marginBottom: 5,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

interface Phorpor5PdfSubjectTemplateProps {
  phorpor5CourseData: IGetPhorpor5Detail[];
  selectedSubject?: Subject;
}


const Phorpor5PdfSubjectTemplate = ({
  phorpor5CourseData,
  selectedSubject,
}: Phorpor5PdfSubjectTemplateProps) => {
  const CheckboxIcon = ({ checked }: { checked: boolean }) => (
    <Svg width="10" height="10" viewBox="0 0 10 10">
      <Path d="M1,1 L9,1 L9,9 L1,9 Z" fill="none" stroke="#000" strokeWidth="1" />
      {checked && <Path d="M2 5 L4 7 L8 1" stroke="#000" strokeWidth="2" fill="none" />}
    </Svg>
  );

  if (!phorpor5CourseData || !phorpor5CourseData[0]) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>กำลังโหลดข้อมูล...</Text>
        </Page>
      </Document>
    );
  }

  const data = phorpor5CourseData[0].data_json;

  const isCoverPageData = (data: any): data is CoverPageData => {
    return 'school_name' in data && 'subject' in data && 'student_status' in data;
  };

  const isAchievementData = (data: any): data is AchievementData => {
    return 'school_name' in data && 'subject' in data;
  };

  const isSubjectData = (data: any): data is { subjects: Subject[] } => {
    return 'subjects' in data;
  };

  let schoolName = 'โรงเรียนไม่ระบุชื่อ';
  let schoolArea = 'โรงเรียนไม่ระบุชื่อ';
  let subjects: Subject[] = [];
  let yearLevel = 'ไม่ระบุชั้นปี';
  let academicYear = 'ไม่ระบุปีการศึกษา';
  let subjectName: string = 'ไม่ระบุรายวิชา';
  let subjectCode: string = 'ไม่ระบุรหัสวิชา';
  let subjectHours: string = '0';
  let learning_group: string = 'ไม่ระบุกลุ่มสาระเรียน้รียนรู้';
  let teacher: string = 'ไม่ระบุครูประจำวิชา';
  let advisor = 'ไม่ระบุครูที่ปรึกษา';
  let status = {
    start_male: 0,
    start_female: 0,
    start_total: 0,
    transfer_out_male: 0,
    transfer_out_female: 0,
    transfer_out_total: 0,
    transfer_in_male: 0,
    transfer_in_female: 0,
    transfer_in_total: 0,
    end_male: 0,
    end_female: 0,
    end_total: 0,
  };
  let approvalData = {
    subject_teacher: '',
    head_of_subject: '',
    deputy_director: '',
    principal: '',
    approved: false,
    date: '',
  };
  let subjectScores: { [key: string]: number | string | undefined } = {};
  if (isCoverPageData(data)) {
    schoolName = data.school_name;
    schoolArea = data.school_area || schoolArea;

    subjects = (data.subject || []).filter((s) => s.is_subject === true);
    const currentSubject = data.subject.find((s) => s.id === selectedSubject?.id);
    subjectScores = currentSubject?.scores || {};
    yearLevel = data.year || yearLevel;
    academicYear = data.academic_year || academicYear;

    const firstSubject = data.subject.find((s: Subject) =>
      s.id === selectedSubject?.id
    ) || selectedSubject;
    subjectName = firstSubject?.name || firstSubject?.subject_name || subjectName;
    subjectCode = firstSubject?.code || subjectCode;
    subjectHours = firstSubject?.hours?.toString() || subjectHours;
    learning_group = firstSubject?.learning_group || learning_group;
    teacher = Array.isArray(firstSubject?.teacher)
      ? firstSubject.teacher.join(' / ')
      : firstSubject?.teacher || teacher;
    advisor = firstSubject?.teacher_advisor || advisor;
    status = data.student_status;
    approvalData = data.approval;
  } else if (isAchievementData(data)) {
    schoolName = data.school_name;
    schoolArea = data.school_area || schoolArea;
    subjects = data.subject || [];
    yearLevel = data.year || yearLevel;
    academicYear = data.academic_year || academicYear;
  } else if (isSubjectData(data)) {
    subjects = data.subjects || [];
  }

  // Process subjects data
  const academicSubjects = subjects.filter((subject) => subject.is_subject);
  const nonAcademicScores = subjects.reduce(
    (
      acc: {
        characteristics?: Record<string, number>;
        competencies?: Record<string, number>;
      },
      subject,
    ) => {
      if (!subject.is_subject) {
        if (subject.learning_group === 'คุณลักษณะอันพึงประสงค์') {
          acc.characteristics = subject.scores || {};
        } else if (subject.learning_group === 'สมรรถนะ') {
          acc.competencies = subject.scores || {};
        }
      }
      return acc;
    },
    {},
  );

  const chunkSize = 18;
  const subjectChunks: any = [];
  for (let i = 0; i < academicSubjects.length; i += chunkSize) {
    subjectChunks.push(academicSubjects.slice(i, i + chunkSize));
  }

  if (subjectChunks.length === 0) {
    subjectChunks.push([]);
  }

  const renderSubjectTable = (
    subjects: Subject[],
    chunkIndex: number,
    totalChunks: number,
  ) => (
    <View style={styles.tableContainer} key={`subject-table-${chunkIndex}`}>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCell, styles.smallCell, { flex: 2 }]}>
            <Text>ระดับ</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>มส</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>ร</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>0</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>1</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>1.5</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>2</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>2.5</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>3</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>3.5</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>4</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.smallCell, { flex: 2 }]}>
            <Text>จำนวนนักเรียน</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['มส'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['ร'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['0'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['1'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['1.5'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['2'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['2.5'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['3'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['3.5'] || 0}</Text>
          </View>
          <View style={[styles.tableCell, styles.smallCell]}>
            <Text>{subjectScores['4'] || 0}</Text>
          </View>
        </View>
      </View>
      {totalChunks > 1 && (
        <Text style={styles.pageNumber}>
          ตารางที่ {chunkIndex + 1} จาก {totalChunks}
        </Text>
      )}
    </View>
  );

  const renderMainContent = (pageIndex: number) => (
    <>
      {pageIndex === 0 && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)</Text>
            <Text style={styles.schoolName}>{schoolName}</Text>
            <Text style={styles.schoolName}>{schoolArea}</Text>
          </View>

          {/* Form Detail Section */}
          <View style={styles.section}>
            <View style={styles.formRow}>
              <View style={[styles.label, { width: '15%' }]}>
                <Text>ชั้นปี</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '35%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{yearLevel}</Text>
              </View>
              <View style={[styles.label, { width: '15%', marginLeft: 10 }]}>
                <Text>ปีการศึกษา</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '35%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{academicYear}</Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.label, { width: '15%' }]}>
                <Text>รายวิชา</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '35%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{subjectName}</Text>
              </View>
              <View style={[styles.label, { width: '15%', marginLeft: 10 }]}>
                <Text>รหัสวิชา</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '35%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{subjectCode}</Text>
              </View>
              <View style={[styles.label, { width: '15%', marginLeft: 10 }]}>
                <Text>มาเรียน</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '20%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{subjectHours} </Text>
              </View>
              <View style={[styles.label, { width: '15%', marginLeft: 10 }]}>
                <Text> ชั่วโมง/ปี</Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.label, { width: '11%' }]}>
                <Text>กลุ่มสาระการเรียนรู้</Text>
              </View>
              <View
                style={[
                  styles.value,
                  { width: '70%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{learning_group}</Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <View
                style={[
                  styles.value,
                  { width: '70%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{teacher}</Text>
              </View>
              <View style={[styles.label, { width: '30%' }]}>
                <Text>ครูประจำวิชา</Text>
              </View>
            </View>
            <View style={styles.formRow}>
              <View
                style={[
                  styles.value,
                  { width: '70%', alignSelf: 'center', textAlign: 'center' },
                ]}
              >
                <Text>{advisor}</Text>
              </View>
              <View style={[styles.label, { width: '30%' }]}>
                <Text>ครูประจำชั้น/ครูที่ปรึกษา</Text>
              </View>
            </View>
          </View>

          {/* Student Status Section */}
          <View style={styles.statContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>นักเรียนต้นปีการศึกษา</Text>
              <View style={styles.statValueContainer}>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>ชาย</Text>
                  <Text style={styles.statValue}>{status.start_male || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>หญิง</Text>
                  <Text style={styles.statValue}>{status.start_female || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>รวม</Text>
                  <Text style={styles.statValue}>{status.start_total || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
              </View>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>ออกระหว่างปีการศึกษา</Text>
              <View style={styles.statValueContainer}>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>ชาย</Text>
                  <Text style={styles.statValue}>{status.transfer_out_male || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>หญิง</Text>
                  <Text style={styles.statValue}>{status.transfer_out_female || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>รวม</Text>
                  <Text style={styles.statValue}>{status.transfer_out_total || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
              </View>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>เข้าระหว่างปีการศึกษา</Text>
              <View style={styles.statValueContainer}>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>ชาย</Text>
                  <Text style={styles.statValue}>{status.transfer_in_male || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>หญิง</Text>
                  <Text style={styles.statValue}>{status.transfer_in_female || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>รวม</Text>
                  <Text style={styles.statValue}>{status.transfer_in_total || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
              </View>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>รวมสิ้นปีการศึกษา</Text>
              <View style={styles.statValueContainer}>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>ชาย</Text>
                  <Text style={styles.statValue}>{status.end_male || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>หญิง</Text>
                  <Text style={styles.statValue}>{status.end_female || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
                <View style={styles.statValueGroup}>
                  <Text style={styles.statLabel}>รวม</Text>
                  <Text style={styles.statValue}>{status.end_total || 0}</Text>
                  <Text style={styles.statUnit}>คน</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Learner Competencies Section */}
      <View style={styles.section}>
        {pageIndex === 0 && (
          <Text style={styles.sectionTitle}>สรุปผลสัมฤทธิ์ทางการเรียนรู้</Text>
        )}

        {/* Academic Subjects Table */}
        {renderSubjectTable(subjectChunks[pageIndex], pageIndex, subjectChunks.length)}

        {pageIndex === 0 && (
          <>
            <View style={styles.table}>
              <View
                style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 0 }]}
              >
                <View style={[styles.tableCell, { width: '25%', paddingTop: 20 }]}>
                  <Text>สรุปการประเมิน</Text>
                </View>
                <View
                  style={[styles.tableCell, { width: '37.5%', borderBottomWidth: 1 }]}
                >
                  <Text>คุณลักษณะอันพึงประสงค์</Text>
                </View>
                <View
                  style={[styles.tableCell, { width: '37.5%', borderBottomWidth: 1 }]}
                >
                  <Text>อ่าน คิด วิเคราะห์ และ เขียน</Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { width: '25%' }]}></View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ไม่ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ดี</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ดีเยี่ยม</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ไม่ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ดี</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>ดีเยี่ยม</Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '25%' }]}>
                  <Text>จำนวนนักเรียน</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['มผ'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ผ'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ด'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ดย'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['มผ2'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ผ2'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ด2'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '9.375%' }]}>
                  <Text>{nonAcademicScores.characteristics?.['ดย2'] || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Competencies Table */}
            <View style={styles.table}>
              <View
                style={[styles.tableRow, styles.tableHeader, { borderBottomWidth: 0 }]}
              >
                <View style={[styles.tableCell, { width: '25%', paddingTop: 20 }]}>
                  <Text>สรุปการประเมิน</Text>
                </View>
                <View style={[styles.tableCell, { width: '75%', borderBottomWidth: 1 }]}>
                  <Text>สมรรถนะสำคัญของผู้เรียน</Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { width: '25%' }]}></View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>ไม่ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>ผ่าน</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>ดี</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>ดีเยี่ยม</Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '25%' }]}>
                  <Text>จำนวนนักเรียน</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>{nonAcademicScores.competencies?.['มผ'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>{nonAcademicScores.competencies?.['ผ'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>{nonAcademicScores.competencies?.['ด'] || '-'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '18.75%' }]}>
                  <Text>{nonAcademicScores.competencies?.['ดย'] || '-'}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {pageIndex === subjectChunks.length - 1 && (
        <View style={[styles.approvalSection]}>
          <Text style={[styles.sectionTitle, { marginTop: -5 }]}>
            การอนุมัติผลการเรียน
          </Text>

          <View style={{ marginLeft: 80 }}>
            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>ลงชื่อ</Text>
              <Text style={[styles.approvalValue]}>
                {approvalData.subject_teacher ||
                  '.......................................'}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 12 }}>
                ครูประจำวิชา/ครูที่ปรึกษา
              </Text>
            </View>

            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>ลงชื่อ</Text>
              <Text style={styles.approvalValue}>
                {approvalData.head_of_subject ||
                  '.......................................'}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 12 }}>
                หัวหน้างานวิชาการโรงเรียน
              </Text>
            </View>

            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>ลงชื่อ</Text>
              <Text style={styles.approvalValue}>
                {approvalData.principal || '.......................................'}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 12 }}>ผู้อำนวยการโรงเรียน</Text>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <CheckboxIcon checked={approvalData.approved} />
              <Text style={styles.checkboxLabel}>อนุมัติ</Text>
            </View>
            <View style={styles.checkbox}>
              <CheckboxIcon checked={!approvalData.approved} />
              <Text style={styles.checkboxLabel}>ไม่อนุมัติ</Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: -5,
            }}
          >
            <View
              style={[
                styles.approvalRow,
                {
                  width: 300,
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginLeft: -100,
                },
              ]}
            >
              <Text style={styles.approvalLabel}>ลงชื่อ</Text>
              <Text style={styles.approvalValue}>
                {approvalData.principal || '.......................................'}
              </Text>
            </View>
            <Text style={[styles.signatureLabel]}>
              (
              {approvalData.principal ||
                '................................................'}
              )
            </Text>
            <Text style={styles.signatureLabel}>ผู้อำนวยการโรงเรียน</Text>
            <Text style={{ marginTop: 5, fontSize: 14 }}>
              วันที่{' '}
              {approvalData.date
                ? new Date(approvalData.date).toLocaleDateString('th-TH')
                : '...../...../.....'}
            </Text>
          </View>
        </View>
      )}
    </>
  );

  return (
    <Document>
      {subjectChunks.map((_: any, index: any) => (
        <Page key={`page-${index}`} size="A4" style={styles.page}>
          {renderMainContent(index)}
        </Page>
      ))}
    </Document>
  );
};

export default Phorpor5PdfSubjectTemplate;
