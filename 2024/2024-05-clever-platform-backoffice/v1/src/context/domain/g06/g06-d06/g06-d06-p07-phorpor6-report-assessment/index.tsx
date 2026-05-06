import LayoutDefault from '@core/design-system/library/component/layout/default';
import { useEffect } from 'react';
import PP6Layout from '../local/component/web/organism/BreadcrumbPhorpor6';
import Box from '@component/web/atom/Box';
import { Center, Space, Text } from '@mantine/core';
import AssessmentTable from './component/web/molecule/AssessementTable';
import AttendanceTable from './component/web/molecule/AttendanceTable';
import useStore from '../local/stores';
import { useParams } from '@tanstack/react-router';
import { studentDetailSelectors } from '../local/stores/student-detail';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);
dayjs.locale('th');

const DomainJSX = () => {
  const params = useParams({ strict: false });
  const fetchStudentDetail = useStore.studentDetail((state) => state.fetchStudentDetail);
  const assessment = useStore.studentDetail(studentDetailSelectors.getAssessmentForPage);

  useEffect(() => {
    if (params && params?.evaluationFormId && params?.id) {
      fetchStudentDetail(params.evaluationFormId, params.id);
    }
  }, [params]);

  return (
    <PP6Layout>
      <Box>
        <div className="max-w-4xl">
          <Center>
            <Text fw={400} size="sm">
              ผลการประเมินภาวะโภชนาการ
            </Text>
          </Center>
          <Space h="sm" />
          <AssessmentTable sections={assessment?.tableData || []} />
          <Space h="xl" />
        </div>

        <div className="max-w-2xl">
          <Center>
            <Text fw={400} size="sm">
              สรุปเวลาเรียน
            </Text>
          </Center>
          <Space h="sm" />
          <AttendanceTable data={assessment?.attenanceData || []} />
        </div>
      </Box>
    </PP6Layout>
  );
};

export default DomainJSX;
