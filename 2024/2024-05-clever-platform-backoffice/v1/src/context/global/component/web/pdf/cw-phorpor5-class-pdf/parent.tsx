// components/ParentPdfTable.tsx
import { GuardianInfo } from '@domain/g06/g06-d05/local/api/type';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'THSarabun',
    fontSize: 14,
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
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
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
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  smallCol: {
    width: '10%',
  },
  mediumCol: {
    width: '15%',
  },
  largeCol: {
    width: '25%',
  },
});

interface ParentPdfTableProps {
  parentInfo: GuardianInfo[];
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  schoolName?: string;
}

const ParentPdfTable = ({
  parentInfo,
  evaluationForm,
  schoolName = 'โรงเรียนไม่ระบุชื่อ',
}: ParentPdfTableProps) => {
  const formattedParents = parentInfo.map((guardian) => ({
    student_name: `${guardian.title}${guardian.first_name} ${guardian.last_name}`,
    no: guardian.no,
    parent: {
      name: `${guardian.guardian_title}${guardian.guardian_first_name} ${guardian.guardian_last_name}`,
      relationship: guardian.guardian_relation,
      profession: guardian.guardian_occupation,
      address: `${guardian.address_no} หมู่ ${guardian.address_moo} ${guardian.address_sub_district} ${guardian.address_district} ${guardian.address_province} ${guardian.address_postal_code}`,
    },
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>รายชื่อผู้ปกครองนักเรียน</Text>
          {schoolName && <Text style={styles.schoolName}>{schoolName}</Text>}
          <Text
            style={styles.schoolName}
          >{`ชั้นปี ${evaluationForm.year} ปีการศึกษา ${evaluationForm.academic_year}`}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
            <View style={[styles.tableColHeader, styles.smallCol]}>
              <Text>ลำดับ</Text>
            </View>
            <View style={[styles.tableColHeader, styles.largeCol]}>
              <Text>ชื่อ - สกุลนักเรียน</Text>
            </View>
            <View style={[styles.tableColHeader, styles.largeCol]}>
              <Text>ชื่อผู้ปกครอง</Text>
            </View>
            <View style={[styles.tableColHeader, styles.mediumCol]}>
              <Text>ความเกี่ยวข้อง</Text>
            </View>
            <View style={[styles.tableColHeader, styles.mediumCol]}>
              <Text>อาชีพ</Text>
            </View>
            <View style={[styles.tableColHeader, styles.largeCol]}>
              <Text>ที่อยู่</Text>
            </View>
          </View>

          {formattedParents.map((data, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, styles.smallCol]}>
                <Text>{data.no}</Text>
              </View>
              <View style={[styles.tableCol, styles.largeCol]}>
                <Text>{data.student_name}</Text>
              </View>
              <View style={[styles.tableCol, styles.largeCol]}>
                <Text>{data.parent.name}</Text>
              </View>
              <View style={[styles.tableCol, styles.mediumCol]}>
                <Text>{data.parent.relationship}</Text>
              </View>
              <View style={[styles.tableCol, styles.mediumCol]}>
                <Text>{data.parent.profession}</Text>
              </View>
              <View style={[styles.tableCol, styles.largeCol]}>
                <Text>{data.parent.address}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ParentPdfTable;
