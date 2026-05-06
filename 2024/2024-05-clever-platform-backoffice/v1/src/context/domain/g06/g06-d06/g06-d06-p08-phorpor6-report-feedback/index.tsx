import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@store/global';
import { useEffect } from 'react';
import PP6Layout from '../local/component/web/organism/BreadcrumbPhorpor6';
import { Center, Space, Text } from '@mantine/core';
import FeedbackTable from './component/web/molecule/FeedbackTable';
import Box from '@component/web/atom/Box';

const feedback1Sections = [
  {
    title: 'ด้านหน้าที่รับผิดชอบ\nความเอาใจใส่การเรียน',
  },
  {
    title: 'ด้านการใช้เวลาว่าง',
  },
  {
    title: 'ด้านความสัมพันธ์กับ\nบุคคลอื่นข้าง',
  },
  {
    title: 'ด้านสุขภาพ',
  },
];

const feedback2Sections = [
  {
    title: 'ด้านหน้าที่รับผิดชอบ\nความเอาใจใส่การเรียน',
  },
  {
    title: 'ด้านการใช้เวลาว่าง',
  },
  {
    title: 'ด้านความสัมพันธ์กับ\nบุคคลอื่นข้าง',
  },
  {
    title: 'ด้านสุขภาพ',
  },
];

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <PP6Layout>
      <Box>
        <div className="max-w-4xl">
          {/* Feedback #1 */}
          <Center>
            <Text fw={400} size="sm">
              ความคิดเห็นและข้อเสนอแนะของครูประจำชั้น
            </Text>
            <Space h="sm" />
          </Center>
          <Space h="lg" />
          <FeedbackTable
            sections={feedback1Sections}
            rolename="ครูประจำชั้น/ครูที่ปรึกษา"
          />

          <Space h="xl" />

          {/* Feedback #2 */}
          <Center>
            <Text fw={400} size="sm">
              ความคิดเห็นและข้อเสนอแนะของผู้ปกครอง
            </Text>
            <Space h="sm" />
          </Center>
          <Space h="lg" />
          <FeedbackTable sections={feedback2Sections} rolename="ผู้ปกครอง" />
        </div>
      </Box>
    </PP6Layout>
  );
};

export default DomainJSX;
