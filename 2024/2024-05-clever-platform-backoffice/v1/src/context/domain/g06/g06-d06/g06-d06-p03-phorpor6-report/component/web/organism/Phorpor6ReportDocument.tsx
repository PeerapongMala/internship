import Box from '@component/web/atom/Box';
import CWButton from '@component/web/cw-button';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import Phorpor6ReportTemplate from '@domain/g06/g06-d06/local/component/web/organism/pdf-template/phorpor6report';
import useStore from '@domain/g06/g06-d06/local/stores';
import { studentDetailSelectors } from '@domain/g06/g06-d06/local/stores/student-detail';
import { Center, Divider, Flex, Grid, Space, Text } from '@mantine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface Phorpor6ReportDocumentProps {
  form: UseFormReturn<FieldValues>;
}

const Phorpor6ReportDocument: React.FC<Phorpor6ReportDocumentProps> = (props) => {
  const { form } = props;
  const student = useStore.studentDetail(studentDetailSelectors.getStudentDetail);
  const school = useStore.studentDetail(studentDetailSelectors.getSchool);
  const allsign = useStore.studentDetail(studentDetailSelectors.getAllSign);

  return (
    <Box>
      <PDFDownloadLink
        document={<Phorpor6ReportTemplate student={student!} />}
        fileName="เล่มปพ6.pdf"
      >
        {({ blob, url, loading, error }) => {
          return loading ? (
            'กำลังสร้างเอกสาร PDF...'
          ) : (
            <CWButton
              variant={'primary'}
              title={'PDF'}
              disabled={false}
              className={'w-[100px]'}
              icon={<IconUpload />}
            />
          );
        }}
      </PDFDownloadLink>

      <Space h="lg" />
      <div className="max-w-4xl bg-[#FFCCFF] p-6">
        {/* Header */}
        <Center>
          <Flex direction={'column'} align={'center'} justify={'center'} gap="xs">
            <Text fw={700} size="lg">
              แบบรายงานประจำตัวนักเรียน
            </Text>

            <Text fw={700} size="lg">
              ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)
            </Text>

            <Text fw={700} size="lg">
              {school?.name}
            </Text>

            <Text fw={700} size="sm">
              {school?.area}
            </Text>

            <Text fw={700} size="sm">
              {student?.school_address}
            </Text>
          </Flex>
        </Center>
        <Space h="xl" />
        {/* Student Info */}

        <Grid>
          <Grid.Col span={6}>
            <HorizonTextInput
              name="firstName"
              control={form.control}
              label="ขอรับรองว่าชื่อ"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="สกุล" name="lastName" control={form.control} />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput label="เกิดวันที่" name="dob" control={form.control} />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput
              label="อายุ"
              name="age"
              control={form.control}
              unit="ปี"
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput
              name="ageMonth"
              control={form.control}
              unit="เดือน"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="เลขประจำตัว" name="idNo" control={form.control} />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput
              label="เลขประจำตัวประชาชน"
              name="citizenNo"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="ชั้น" name="grade" control={form.control} />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="เลขที่" name="studentNo" control={form.control} />
          </Grid.Col>

          <Grid.Col span={12}>
            <HorizonTextInput
              label="ปีการศึกษา"
              name="academicYear"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider my="xl" className="border border-[#525252]" />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput
              label="ออกให้ ณ วันที่"
              name="issuedDate"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput label="เดือน" name="issuedMonth" control={form.control} />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput label="พ.ศ." name="issuedYear" control={form.control} />
          </Grid.Col>
        </Grid>

        {/* Footer  */}
        <Space h="xl" />

        <Flex direction={'column'} gap={'lg'}>
          {/* Footer Field row #1 */}
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap="xs"
            className="py-6"
          >
            <Text size="sm" fw={400}>
              ลงชื่อ...................................................
            </Text>
            <Text size="sm" fw={400}>
              {`(${allsign?.subjectTeacher})`}
            </Text>
            <Text size="sm" fw={400}>
              ครูประจำชั้น/ครูที่ปรึกษา
            </Text>
          </Flex>

          {/* Footer Field row #2 */}
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap="xs"
            className="py-6"
          >
            <Text size="sm" fw={400}>
              ลงชื่อ...................................................
            </Text>
            <Text size="sm" fw={400}>
              {`(${allsign?.headOfSubject})`}
            </Text>
            <Text size="sm" fw={400}>
              หัวหน้างานวิชาการโรงเรียน
            </Text>
          </Flex>

          {/* Footer Field row #3 */}
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap="xs"
            className="py-6"
          >
            <Text size="sm" fw={400}>
              ลงชื่อ...................................................
            </Text>
            <Text size="sm" fw={400}>
              {`(${allsign?.principal})`}
            </Text>
            <Text size="sm" fw={400}>
              ผู้อำนวยการโรงเรียน
            </Text>
          </Flex>
        </Flex>
      </div>
    </Box>
  );
};

export default Phorpor6ReportDocument;
