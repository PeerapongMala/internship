import Box from '@component/web/atom/Box';
import CWButton from '@component/web/cw-button';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import Phorpor6CertTemplate from '@domain/g06/g06-d06/local/component/web/organism/pdf-template/phorpor6cert';
import useStore from '@domain/g06/g06-d06/local/stores';
import { studentDetailSelectors } from '@domain/g06/g06-d06/local/stores/student-detail';
import { Flex, Grid, Space, Text } from '@mantine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface Phorpor6CertDocumentProps {
  form: UseFormReturn<FieldValues>;
}

const Phorpor6CertDocument: React.FC<Phorpor6CertDocumentProps> = (props) => {
  const { form } = props;
  const student = useStore.studentDetail(studentDetailSelectors.getStudentDetail);
  const school = useStore.studentDetail(studentDetailSelectors.getSchool);
  const allsign = useStore.studentDetail(studentDetailSelectors.getAllSign);
  return (
    <Box>
      <PDFDownloadLink
        document={<Phorpor6CertTemplate student={student!} />}
        fileName="student-certificate-document.pdf"
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
        <div>
          <Flex direction={'column'} align={'center'} justify={'center'} gap="xs">
            <img width={150} height={164} src={'/public/assets/images/payakud.png'} />
            <Text fw={700} size="lg">
              ใบรับรองผลการศึกษา
            </Text>

            <Text fw={400} size="sm" className="ml-auto">
              เลขที่ 0 0000 00000 00 0
            </Text>

            <Text fw={700} size="sm">
              {school?.name}
            </Text>

            <Text fw={700} size="sm">
              {school?.area}
            </Text>

            <Text fw={400} size="xs">
              {student?.school_address}
            </Text>
          </Flex>
        </div>
        <Space h="xl" />

        {/* Fields */}
        <Grid>
          <Grid.Col span={6}>
            <HorizonTextInput
              label="ขอรับรองว่าชื่อ"
              name="firstName"
              control={form.control}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <HorizonTextInput label="สกุล" name="lastName" control={form.control} />
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

          <Grid.Col span={3}>
            <HorizonTextInput label="เกิดวันที่" name="dob" control={form.control} />
          </Grid.Col>

          <Grid.Col span={3}>
            <HorizonTextInput
              label="เพศ"
              name="gender"
              control={form.control}
              inputSize="md"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <HorizonTextInput
              label="สัญชาติ"
              name="nationality"
              control={form.control}
              inputSize="md"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <HorizonTextInput
              label="ศาสนา"
              name="religion"
              control={form.control}
              inputSize="md"
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput
              label="ชื่อ-สกุลบิดา"
              name="fatherFullname"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput
              label="ชื่อ-สกุลมารดา"
              name="motherFullname"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <div className="my-4 h-0.5 w-full bg-black" />
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
        <Space h="3.125rem" />

        <Grid>
          <Grid.Col span={6}>
            <div className="ml-16 mr-auto h-[162px] w-[111px] bg-white p-2">
              <div className="h-full border border-dashed border-black">
                <Flex
                  direction={'column'}
                  align="center"
                  justify={'center'}
                  className="h-full"
                  gap="xs"
                >
                  <Text size="xs">ติดรูป</Text>
                  <Text size="xs">3 x 4 ซม.</Text>
                </Flex>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex
              align={'center'}
              justify={'center'}
              direction={'column'}
              className="h-full"
            >
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                gap="xs"
                className="py-2"
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
          </Grid.Col>

          <Grid.Col span={4} className="mt-16">
            <Flex align={'center'} justify={'center'} direction={'column'}>
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                gap="xs"
                className="py-2"
              >
                <Text size="sm" fw={400}>
                  ลงชื่อ...................................................
                </Text>
                <Text size="sm" fw={400}>
                  {`(${allsign?.registrar})`}
                </Text>
                <Text size="sm" fw={400}>
                  นายทะเบียน
                </Text>
              </Flex>
            </Flex>
          </Grid.Col>
        </Grid>
      </div>
    </Box>
  );
};

export default Phorpor6CertDocument;
