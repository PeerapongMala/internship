import { studentTransformFunc } from '@domain/g06/g06-d06/local/stores/student-detail';
import { StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

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
  title: {
    fontSize: 18,
  },
  textBold: {
    fontWeight: 700,
  },
  center: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  signLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: '20%',
  },
  signRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: '20%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    padding: 2,
  },
});

type Props = {
  student: StudentDetailDto;
};

const Phorpor6CertTemplate = (props: Props) => {
  const student = studentTransformFunc.phorpor6CertificateDto(props.student);
  const school = studentTransformFunc.school(props.student);
  const allsign = studentTransformFunc.allSign(props.student);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { position: 'relative' }]} wrap>
        <View style={styles.center}>
          <Image
            style={{ width: 120, height: 134 }}
            src={'/public/assets/images/payakud.png'}
          />
        </View>
        <Text style={[styles.center, styles.textBold, { marginTop: 8 }]}>
          ใบรับรองผลการศึกษา
        </Text>
        <View style={[styles.right, { marginTop: 6 }]}>
          <Text style={[styles.label, { width: '5%', textAlign: 'left' }]}>เลขที่</Text>
          <Text style={[styles.input, { width: '30%' }]}>0 0000 00000 00 0</Text>
        </View>
        <Text style={[styles.center, styles.textBold, { marginTop: 12 }]}>
          {school?.name}
        </Text>
        <Text style={[styles.center, styles.textBold]}>{school?.area}</Text>

        <View
          style={[
            styles.row,
            {
              marginTop: 24,
            },
          ]}
        >
          <Text style={[styles.label, { marginLeft: 24, width: '15%' }]}>
            ขอรับรองว่าชื่อ
          </Text>
          <Text style={[styles.input, { width: '40%' }]}>{student?.firstName}</Text>
          <Text style={[styles.label, { width: '10%' }]}>ชื่อสกุล</Text>
          <Text style={[styles.input, { width: '40%' }]}>{student?.lastName}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, { width: '20%' }]}>เลขประจำตัวนักเรียนน</Text>
          <Text style={[styles.input, { width: '25%' }]}>{student?.idNo}</Text>
          <Text style={[styles.label, { width: '25%' }]}>เลขประจำตัวประชาชนน</Text>
          <Text style={[styles.input, { width: '30%' }]}>{student?.citizenNo}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, { width: '10%' }]}>เกิดวันที่</Text>
          <Text style={[styles.input, { width: '18%' }]}>{student?.dob}</Text>
          <Text style={[styles.label, { width: '5%' }]}>เพศ</Text>
          <Text style={[styles.input, { width: '10%' }]}>{student?.gender}</Text>
          <Text style={[styles.label, { width: '10%' }]}>สัญชาติ</Text>
          <Text style={[styles.input, { width: '15%' }]}>{student?.nationality}</Text>
          <Text style={[styles.label, { width: '7%' }]}>ศาสนา</Text>
          <Text style={[styles.input, { width: '25%' }]}>{student?.religion}</Text>
        </View>

        <View style={[styles.row]}>
          <Text style={[styles.label, { width: '17%' }]}>ชื่อ-ชื่อสกุลบิดา</Text>
          <Text style={[styles.input, { width: '33%' }]}>{student?.fatherFullname}</Text>
          <Text style={[styles.label, { width: '17%' }]}>ชื่อ-ชื่อสกุลมารดา</Text>
          <Text style={[styles.input, { width: '33%' }]}>{student?.motherFullname}</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.input, { width: '100%', marginTop: 20, marginLeft: 5 }]} />
        </View>

        <View
          style={[
            styles.row,
            {
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.input, { width: '100%', marginTop: 20, marginLeft: 5 }]} />
        </View>

        <View
          style={[
            styles.row,
            {
              marginTop: 24,
            },
          ]}
        >
          <Text style={[styles.label, { marginLeft: 24, width: '15%' }]}>
            ออกให้ ณ วันที่
          </Text>
          <Text style={[styles.input, { width: '20%' }]}>{student?.issuedDate}</Text>
          <Text style={[styles.label, { width: '8%' }]}>เดือน</Text>
          <Text style={[styles.input, { width: '25%' }]}>{student?.issuedMonth}</Text>
          <Text style={[styles.label, { width: '7%' }]}>พ.ศ.</Text>
          <Text style={[styles.input, { width: '25%' }]}>{student?.issuedYear}</Text>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: '15%',
            width: '100%',
            left: 40,
          }}
        >
          <View style={{ border: '1px dashed black', height: '162px', width: '111px' }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text>ติดรูป</Text>
              <Text>3 x 4 ซม.</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: '22%',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: '100%',
            right: 80,
          }}
        >
          <View>
            <View style={[styles.row]}>
              <View style={styles.right}>
                <Text
                  style={[styles.input, { width: '30%', paddingTop: 16, marginLeft: 4 }]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.right}>
                <Text>{'('}</Text>
                <Text style={[styles.input, { width: '30%' }]}>{allsign.principal}</Text>
                <Text>{')'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.right}>
                <Text style={[styles.label, { width: '30%', textAlign: 'center' }]}>
                  ผู้อำนวยการโรงเรียนน
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: '2%',
            width: '100%',
            left: 90,
          }}
        >
          <View>
            <View style={[styles.row]}>
              <View style={styles.left}>
                <Text
                  style={[styles.input, { width: '30%', paddingTop: 16, marginLeft: 4 }]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text>{'('}</Text>
                <Text style={[styles.input, { width: '30%' }]}>{allsign.registrar}</Text>
                <Text>{')'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={[styles.label, { width: '30%', textAlign: 'center' }]}>
                  นายทะเบียน
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Phorpor6CertTemplate;
