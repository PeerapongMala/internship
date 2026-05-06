// components/FatherMotherPdfTable.tsx
import { ParentInfo } from '@domain/g06/g06-d05/local/api/type';
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
  subTitle: {
    fontSize: 14,
    marginBottom: 15,
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
    width: '14.28%',
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
    width: '14.28%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
});

interface FatherMotherPdfTableProps {
  fatherMotherData: ParentInfo[];
  evaluationForm: {
    year: string;
    academic_year: string;
  };
  schoolName?: string;
}

const FatherMotherPdfTable = ({
  fatherMotherData,
  evaluationForm,
  schoolName,
}: FatherMotherPdfTableProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>ข้อมูลบิดามารดาของนักเรียน</Text>
          {schoolName && (
            <View style={styles.schoolName}>
              <Text>{schoolName}</Text>
            </View>
          )}
          <Text style={styles.subTitle}>
            {`ชั้นปี ${evaluationForm?.year} ปีการศึกษา ${evaluationForm?.academic_year}`}
          </Text>
        </View>

        <View style={styles.table}>
          {/* หัวตาราง */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>ที่</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>ชื่อ-สกุลนักเรียน</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>เลขที่</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>ชื่อสกุล บิดา</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>อาชีพบิดา</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>ชื่อสกุล มารดา</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>อาชีพมารดา</Text>
            </View>
          </View>

          {/* ข้อมูลบิดามารดา */}
          {fatherMotherData.map((parent, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{`${parent.title}${parent.first_name} ${parent.last_name}`}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{parent.no}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{`${parent.father_title}${parent.father_first_name} ${parent.father_last_name}`}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{parent.father_occupation}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{`${parent.mother_title}${parent.mother_first_name} ${parent.mother_last_name}`}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{parent.mother_occupation}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* 
                <View style={styles.footer}>
                    <Text>เอกสารนี้ถูกสร้างขึ้นโดยระบบอัตโนมัติ วันที่ {new Date().toLocaleDateString('th-TH')}</Text>
                </View> */}
      </Page>
    </Document>
  );
};

export default FatherMotherPdfTable;
