import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Using the font registration you provided
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
    padding: 30,
    fontFamily: 'THSarabun',
    fontSize: 14,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  lastRow: {
    flexDirection: 'row',
  },
  tableColLeft: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    padding: 8,
  },
  tableColRight: {
    width: '70%',
    padding: 8,
  },
  boldText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    width: '30%',
    marginTop: 5,
  },
  signatureText: {
    textAlign: 'center',
    marginTop: 5,
  },
});

// Create Document Component
const FeedbackTemplate = () => {
  const TeacherReport = () => (
    <>
      <Text style={styles.header}>ความคิดเห็นและข้อเสนอแนะของครูประจำชั้น</Text>

      <View style={styles.table}>
        {/* Row 1 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>
              ด้านหน้าที่รับผิดชอบ{'\n'}ความสะอาดเก็บกวาดห้อง
            </Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 2 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านการใช้จ่ายเงิน</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 3 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านความสัมพันธ์กับบุคคล{'\n'}ครอบครัว</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 4 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านอุปนิสัย บุคลิกภาพ</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 5 - Last row without bottom border */}
        <View style={styles.lastRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านสุขภาพ</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>
      </View>

      {/* Signature line */}
      <View style={styles.signatureRow}>
        <Text>ลงชื่อ</Text>
        <View style={styles.signatureLine}></View>
        <Text>ครูประจำชั้น/ครูที่ปรึกษา</Text>
      </View>
    </>
  );

  const GuardianReport = () => (
    <>
      <Text style={[styles.header, { marginTop: 24 }]}>
        ความคิดเห็นและข้อเสนอแนะของผู้ปกครอง
      </Text>

      <View style={styles.table}>
        {/* Row 1 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>
              ด้านหน้าที่รับผิดชอบ{'\n'}ความเอาใจใส่ในการเรียน
            </Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 2 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านการใช้เวลาว่าง</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 3 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านความสัมพันธ์กับบุคคล{'\n'}รอบข้าง</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 4 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านอุปนิสัย บุคลิกภาพ</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>

        {/* Row 5 - Last row without bottom border */}
        <View style={styles.lastRow}>
          <View style={styles.tableColLeft}>
            <Text style={styles.boldText}>ด้านสุขภาพ</Text>
          </View>
          <View style={styles.tableColRight}>{/* Empty for user input */}</View>
        </View>
      </View>

      {/* Signature line */}
      <View style={[styles.signatureRow]}>
        <Text style={{ width: '5%', textAlign: 'right', marginRight: 1 }}>ลงชื่อ</Text>
        <View style={styles.signatureLine}></View>
        <Text style={{ width: '10%', marginLeft: 1 }}>ผู้ปกครอง</Text>
      </View>
      <View style={[styles.signatureRow, { marginTop: 8 }]}>
        <Text style={{ width: '5%', textAlign: 'right', marginRight: 1 }}>{`(`}</Text>
        <View style={styles.signatureLine}></View>
        <Text style={{ width: '10%', marginLeft: 1 }}>{`)`}</Text>
      </View>
    </>
  );

  return (
    <Page size="A4" style={styles.page}>
      <TeacherReport />
      <GuardianReport />
    </Page>
  );
};

export default FeedbackTemplate;
