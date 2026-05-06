import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Thai font
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
    padding: 24,
    paddingVertical: 20,
    fontFamily: 'THSarabun',
    fontSize: 16,
    backgroundColor: 'white',
  },
  documentBorder: {
    height: '100%',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 15,
  },
  paragraph: {
    textIndent: 20,
    marginTop: 16,
  },
  listContainer: {
    marginLeft: 10,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  listNumber: {
    width: 15,
    marginRight: 5,
  },
  listText: {
    flex: 1,
  },
  subListItem: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 2,
  },
  tablesContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  table: {
    width: '32%',
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableLastRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    backgroundColor: 'white',
    flex: 1,
  },
  tableLastCell: {
    padding: 5,
    backgroundColor: 'white',
    flex: 1,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
  },
  tableContent: {
    textAlign: 'center',
  },
  footer: {
    marginTop: 10,
    textAlign: 'right',
    fontSize: 16,
  },
});

// Create Document Component
const RecommendTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.documentBorder}>
        <Text style={styles.title}>คำแนะนำสำหรับผู้ปกครอง</Text>

        <Text style={styles.paragraph}>
          ถ้ามีผลติดศูนย์ เช่น ฝึกหัดน้อยกว่าเกณฑ์ เชียว ช่วย เรียงร้อย หรือ ลอบ
          ตรวจการอ่วงร่วมเพื่อตรวจรับปรึกษาแพทย์
        </Text>
        <Text>
          ในกรณีที่นักรายนามองท่านมีโรคประจำตัวหรือมีสิ่งผิดปกติใบรดเจ็งครูทั้งตำเด็กศูนย์เรียนโดยไม่เรียนยาตามที่แพทย์ต้องคนไม่ให้
        </Text>

        <Text>
          เกิดปัญหาพฤติกรรมอรัวตกราเรียนนานอันพึงประสงค์
          ผลการประเมินการอ่านคิดวิเคราะห์และเขียน ผลการประเมินคุณ 12
          ประการและผลการประเมินสมรรถนะสำคัญของผู้เรียนโดยครูจะลงอิงว่า
          นักเรียนผ่านการประเมินผ่านได้หรือไม่ประเมินใด
          ฝ่าบเทคนิคการประเมินการศึกษาของสถานศึกษาครั้งนี้ และควรได้รับการช่วยเหลือด้านใด
        </Text>

        <Text style={styles.paragraph}>
          เพื่อกำให้เรียนเเนะระบบประจำตัวนักเรียนมีแล้ว โปรดสะอวลพิจารณาข้อมูลต่าง ๆ
          ต่อนี้
        </Text>

        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Text style={styles.listNumber}>1.</Text>
            <Text style={styles.listText}>
              โปรดตรวจสอบความถูกต้องของข้อมูลนักเรียน
              และข้อมูกทางการประเมินแทนเที่ใช้ข้อมูล
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>2.</Text>
            <Text style={styles.listText}>
              โปรดตรวจสอบผลการประเมินการะโดยมาการ อ่าน เขียน - คำนวญ ตามเกณฑ์เกตร่วม
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>3.</Text>
            <Text style={styles.listText}>
              โปรดตรวจสอบผลการไม่ผ่อเรียนแยกเทน่าผ่านใบเลขต
              ติดต่อกับโบรักษ์รียนที่นเกี่ยวยกษ์ว่า
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>4.</Text>
            <Text style={styles.listText}>
              โปรดตรวจสอบผลการเรียนรายวิชา ผลการประเมินคุณกรรมจริญบูรมิเรียน
              ผลการประเมินคุณลักษณะ
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>5.</Text>
            <Text style={styles.listText}>เกณฑ์การประเมิน</Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.1</Text>
            <Text style={styles.listText}>
              นักเรียนต้องมีผลการประเมินรายวิชาทั้งประจำพ 1 ขึ้นไปทุกวิชา
            </Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.2</Text>
            <Text style={styles.listText}>
              นักเรียนผ่านการประเมินการอ่าน คิดวิเคราะห์ และเขียน ฝ่านเทคนิคการประเมิน
              โประดับดีเยี่ยม/ดี/ผ่าน
            </Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.3</Text>
            <Text style={styles.listText}>
              นักเรียนผ่านการประเมิบคุณลักษระอันพึงประสงค์ ฝ่านเทคนิคการประเมินโประดับ
              ดีเยี่ยม/ดี/ผ่าน
            </Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.4</Text>
            <Text style={styles.listText}>
              นักเรียนต้องร่วมกิจกรรมพัฒนาผู้เรียน และได้ผลการประเมิน "ผ" ทุกกิจกรรม
            </Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.5</Text>
            <Text style={styles.listText}>
              นักเรียนผ่านการประเมินค่านิยม 12 ประการ ฝ่านเทคนิคการประเมินโประดับ
              ดีเยี่ยม/ดี/ผ่าน
            </Text>
          </View>

          <View style={styles.subListItem}>
            <Text style={styles.listNumber}>5.6</Text>
            <Text style={styles.listText}>
              นักเรียนผ่านการประเมินสมรรถนะสำคัญของผู้เรียน ฝ่านเทคนิคการประเมินโประดับ
              ดีเยี่ยม/ดี/ผ่าน
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>6.</Text>
            <Text style={styles.listText}>
              โปรดตรวจสอบความคิดเห็นและข้อเสนอแนะของครูประจำชั้น/ครูที่ปรึกษา
            </Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.listNumber}>7.</Text>
            <Text style={styles.listText}>
              โปรดสะอวลให้ความคิดเห็นและเสนอแนะเกี่ยวกับตัวนักเรียน
              ความเห็นของท่านจะเป็นประโยชน์
            </Text>
          </View>
        </View>

        {/* Grading Tables - 3 tables side by side */}
        <View style={styles.tablesContainer}>
          {/* Table 1 - Left */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeader}>คะแนน</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeader}>ผลการเรียน</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableHeader}>ความหมาย</Text>
              </View>
            </View>

            {/* Data Rows */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>80-100</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>4</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ดีเยี่ยม</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>75-79</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>3.5</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ดีมาก</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>70-74</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>3</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ดี</Text>
              </View>
            </View>

            <View style={styles.tableLastRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>65-69</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>2.5</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ค่อนข้างดี</Text>
              </View>
            </View>
          </View>

          {/* Table 2 - Middle */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeader}>คะแนน</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeader}>ผลการเรียน</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableHeader}>ความหมาย</Text>
              </View>
            </View>

            {/* Data Rows */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>60-64</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>2</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ปานกลาง</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>55-59</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>1.5</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>พอใช้</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>50-54</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>1</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ผ่านเกณฑ์ขั้นต่ำ</Text>
              </View>
            </View>

            <View style={styles.tableLastRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>0-49</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>0</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ต่ำกว่าเกณฑ์</Text>
              </View>
            </View>
          </View>

          {/* Table 3 - Right */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeader}>ผลการเรียน</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableHeader}>ความหมาย</Text>
              </View>
            </View>

            {/* Data Rows */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>ร</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>รอการติดสิน</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>มส</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ไม่มีสิทธิ์สอบ</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>ผ</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ผ่าน</Text>
              </View>
            </View>

            <View style={styles.tableLastRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableContent}>มผ</Text>
              </View>
              <View style={styles.tableLastCell}>
                <Text style={styles.tableContent}>ไม่ผ่าน</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>ขอขอบพระคุณ</Text>
      </View>
    </Page>
  </Document>
);

export default RecommendTemplate;
