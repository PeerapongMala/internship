import Box from '@component/web/atom/Box';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import { Center, Divider, Flex, Grid, Space, Text } from '@mantine/core';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface Phorpor6ReportInfoDocumentProps {
  form: UseFormReturn<FieldValues, any, undefined>;
}

const Phorpor6ReportInfoDocument: React.FC<Phorpor6ReportInfoDocumentProps> = (props) => {
  const { form } = props;
  return (
    <Box>
      <div className="max-w-4xl bg-[#FFCCFF] p-6">
        {/* Header */}
        <div>
          <Center>
            <Text fw={700} size="lg">
              ข้อมูลนักเรียน
            </Text>
          </Center>
        </div>
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
            <HorizonTextInput label="อายุ" name="age" control={form.control} unit="ปี" />
          </Grid.Col>

          <Grid.Col span={4}>
            <HorizonTextInput name="ageMonth" control={form.control} unit="เดือน" />
          </Grid.Col>

          <Grid.Col span={3}>
            <HorizonTextInput label="เพศ" name="gender" control={form.control} />
          </Grid.Col>
          <Grid.Col span={3}>
            <HorizonTextInput label="เชื้อชาติ" name="ethnicity" control={form.control} />
          </Grid.Col>
          <Grid.Col span={3}>
            <HorizonTextInput label="สัญชาติ" name="nationality" control={form.control} />
          </Grid.Col>
          <Grid.Col span={3}>
            <HorizonTextInput label="ศาสนา" name="religion" control={form.control} />
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

          <Grid.Col span={12}>
            <HorizonTextInput
              label="ที่อยู่ปัจจุบัน"
              name="address"
              control={form.control}
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
            <HorizonTextInput label="อาชีพ" name="fatherJob" control={form.control} />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput
              label="ชื่อ-สกุลมารดา"
              name="motherFullname"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="อาชีพ" name="motherJob" control={form.control} />
          </Grid.Col>

          <Grid.Col span={12}>
            <HorizonTextInput
              label="สถานภาพสมรสของบิดา-มารดา"
              name="parentStatus"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput
              label="ชื่อสกุลผู้ปกครอง"
              name="guardianFullname"
              control={form.control}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <HorizonTextInput label="อาชีพ" name="guardianJob" control={form.control} />
          </Grid.Col>
        </Grid>

        <Divider my="xl" className="border border-[#525252]" />

        {/* Footer  */}
        <Space h="xl" />

        <Center>
          <Text fw={700} size="lg">
            บันทึกการเปลี่ยนแปลงหรือแก้ไขข้อมูล
          </Text>
          <Space h="xl" />
        </Center>
        <Space h="xl" />

        <Flex direction={'column'} gap="md">
          {[...Array(4)].map((_, index) => (
            <Text
              key={index}
              fw={400}
              size="md"
              style={{
                borderBottom: '2px dotted #000',
                width: '100%',
                height: 30,
              }}
            >
            </Text>
          ))}
        </Flex>
      </div>
    </Box>
  );
};

export default Phorpor6ReportInfoDocument;
