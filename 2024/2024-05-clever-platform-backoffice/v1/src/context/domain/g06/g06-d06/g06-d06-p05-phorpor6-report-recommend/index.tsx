import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@store/global';
import { useEffect } from 'react';
import PP6Layout from '../local/component/web/organism/BreadcrumbPhorpor6';
import { Center, Flex, Grid, Space, Text } from '@mantine/core';
import Box from '@component/web/atom/Box';
import ScoreTable from './component/web/molecule/ScoreTable';
import useStore from '../local/stores';

const firstTableColumns = [
  { header: 'คะแนน', accessor: 'score' },
  { header: 'ผลการเรียน', accessor: 'grade' },
  { header: 'ความหมาย', accessor: 'meaning' },
];

const firstTableData = [
  { score: '80-100', grade: '4', meaning: 'ดีเยี่ยม' },
  { score: '75-79', grade: '3.5', meaning: 'ดีมาก' },
  { score: '70-74', grade: '3', meaning: 'ดี' },
  { score: '65-69', grade: '2.5', meaning: 'ค่อนข้างดี' },
];

const secondTableColumns = [
  { header: 'คะแนน', accessor: 'score' },
  { header: 'ผลการเรียน', accessor: 'grade' },
  { header: 'ความหมาย', accessor: 'meaning' },
];

const secondTableData = [
  { score: '60-64', grade: '2', meaning: 'ปานกลาง' },
  { score: '55-59', grade: '1.5', meaning: 'พอใช้' },
  { score: '50-54', grade: '1', meaning: 'ผ่านเกณฑ์ขั้นต่ำ' },
  { score: '0-49', grade: '0', meaning: 'ต่ำกว่าเกณฑ์' },
];

const thirdTableColumns = [
  { header: 'ผลการเรียน', accessor: 'grade' },
  { header: 'ความหมาย', accessor: 'meaning' },
];

const thirdTableData = [
  { grade: 'ร', meaning: 'รอการตัดสิน' },
  { grade: 'มส', meaning: 'ไม่มีสิทธิ์สอบ' },
  { grade: 'ผ', meaning: 'ผ่าน' },
  { grade: 'มผ', meaning: 'ไม่ผ่าน' },
];

const DomainJSX = () => {
  const { studentDetail } = useStore.studentDetail();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <PP6Layout>
      <Box>
        <div className="max-w-4xl">
          {/* Header Section */}
          <Center>
            <Text fw={400} size="sm">
              คำแนะนำสำหรับผู้ปกครอง
            </Text>
          </Center>
          <Space h="xl" />
          <Center>
            <Text fw={400} size="sm" className="text-wrap break-words text-center">
              ถ้ามีผลผิดปกติ เช่น น้ำหนักน้อยกว่าเกณฑ์ เตี้ย อ้วน เริ่มอ้วน หรือ ผอม
              ควรหาทางช่วยเหลือหรือปรึกษาแพทย์ ในกรณีที่บุตรหลานของท่านมีโรคประจำตัว
              หรือมีสิ่งผิดปกติโปรดแจ้งครูประจำชั้นทราบด้วยเด็กหยุดเรียนโดยไม่ได้รับอนุญาตทั้งนี้เพื่อป้องกันไม่ให้เกิดปัญหาพฤติกรรมหรือขาดเรียนนานอันพึงประสงค์
              ผลการประเมินการอ่านคิดวิเคราะห์และเขียน ผลการประเมินค่านิยม 12
              ประการและผลการประเมินสมรรถนะสำคัญของผู้เรียนโดยตรวจสอบว่า
              นักเรียนมีผลการประเมินด้านใดอยู่ในระดับใด ผ่านเกณฑ์การประเมินการศึกษาของสถานศึกษาหรือไม่
              และควรได้รับการช่วยเหลือด้านใด 
            </Text>
          </Center>
          <Space h="md" />

          {/* List  */}
          <div className="m-auto block max-w-fit">
            <Text fw={400} size="sm">
              เมื่อท่านได้รับแบบรายงานประจำตัวนักเรียนนี้แล้ว โปรดสละเวลาพิจารณาข้อมูลต่าง
              ๆ ดังนี้
            </Text>
            <Text fw={400} size="sm">
              1. โปรดตรวจสอบความถูกต้องของข้อมูลนักเรียน
              และบันทึกหากมีการเปลี่ยนแปลงแก้ไขข้อมูล
            </Text>
            <Text fw={400} size="sm">
              2. โปรดตรวจสอบผลการประเมินภาวะโภชนาการ จากน้ำหนัก - ส่วนสูง ตามเกณฑ์มาตรฐาน
            </Text>
            <Text fw={400} size="sm">
              3. โปรดตรวจสอบผลการไปโรงเรียนของเด็กอย่างสม่ำเสมอ
              ติดต่อกับโรงเรียนทันทีเมื่อทราบว่า
            </Text>
            <Text fw={400} size="sm">
              4. โปรดตรวจสอบผลการเรียนรายวิชา ผลการประเมินกิจกรรมพัฒนาผู้เรียน
              ผลการประเมินคุณลักษณะ
            </Text>
            <Text fw={400} size="sm">
              5. เกณฑ์การประเมิน  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.1 นักเรียนต้องมีผลการประเมินรายวิชาตั้งแต่ระดับ 1 ขึ้นไปทุกวิชา  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.2 นักเรียนมีผลการประเมินการอ่าน คิดวิเคราะห์ และเขียน ผ่านเกณฑ์การประเมิน
              ในระดับดีเยี่ยม/ดี/ผ่าน  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.3 นักเรียนมีผลการประเมินคุณลักษณะอันพึงประสงค์ ผ่านเกณฑ์การประเมินในระดับ
              ดีเยี่ยม/ดี/ผ่าน  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.4 นักเรียนเข้าร่วมกิจกรรมพัฒนาผู้เรียน และได้ผลการประเมิน "ผ"
              ทุกกิจกรรม  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.5 นักเรียนมีผลการประเมินค่านิยม 12 ประการ ผ่านเกณฑ์การประเมินในระดับ
              ดีเยี่ยม/ดี/ผ่าน  {' '}
            </Text>
            <Text fw={400} size="sm">
              5.6 นักเรียนมีผลการประเมินสมรรถนะสำคัญของผู้เรียน ผ่านเกณฑ์การประเมินในระดับ
              ดีเยี่ยม/ดี/ผ่าน{' '}
            </Text>
            <Text fw={400} size="sm">
              6. โปรดตรวจสอบความคิดเห็นและข้อเสนอแนะของครูประจำชั้นต่อนักเรียน
            </Text>
            <Text fw={400} size="sm">
              7. โปรดสละเวลาให้ความคิดเห็นและเสนอแนะเกี่ยวกับตัวนักเรียน
              ความเห็นของท่านจะเป็นประโยชน์
            </Text>
          </div>
          <Space h="xl" />
        </div>

        {/* Table Section */}
        <Grid>
          <Grid.Col span={4}>
            <ScoreTable data={firstTableData} columns={firstTableColumns} />
          </Grid.Col>
          <Grid.Col span={4}>
            <ScoreTable data={secondTableData} columns={secondTableColumns} />
          </Grid.Col>
          <Grid.Col span={4}>
            <ScoreTable data={thirdTableData} columns={thirdTableColumns} />
          </Grid.Col>
        </Grid>
        <Space h="xl" />
        <Text fw={400} size="sm" className="w-full text-right">
          ขอขอบพระคุณ
        </Text>
      </Box>
    </PP6Layout>
  );
};

export default DomainJSX;
