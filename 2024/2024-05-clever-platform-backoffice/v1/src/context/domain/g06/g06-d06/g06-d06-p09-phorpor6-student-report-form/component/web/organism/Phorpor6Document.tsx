import Box from '@component/web/atom/Box';
import CWButton from '@component/web/cw-button';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

import { Center, Flex, Grid, Group, Space, Text } from '@mantine/core';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import useStore from '@domain/g06/g06-d06/local/stores';
import { defaultTo, set } from 'lodash';
import { NumeralFormat } from '@domain/g06/g06-d06/local/utils/numeral-format';
import { studentDetailSelectors } from '@domain/g06/g06-d06/local/stores/student-detail';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Phorpor6Template from '@domain/g06/g06-d06/local/component/web/organism/pdf-template/phorpor6';
import { roundNumber } from '@global/utils/number';
import { useDocumentTemplateList } from '@domain/g06/g06-d07/local/hook/getlist/useTemplatelist';
import { useEffect, useState } from 'react';
import { TTemplateFilter } from '@domain/g06/g06-d07/local/types/template';
import WhiteBox from '@core/design-system/library/component/web/Whitebox';
import CWWhiteBox from '@component/web/cw-white-box';
import CWTemplatePreview from '../template/cw-template-preview';
import { TSubjectType } from '@domain/g06/g06-d06/local/types/student-report-form';

interface Phorpor6DocumentProps {
  form: UseFormReturn<FieldValues>;
}

const Phorpor6Document: React.FC<Phorpor6DocumentProps> = (props) => {
  const { studentDetail } = useStore.studentDetail();
  const grades = useStore.studentDetail(studentDetailSelectors.getGrade);
  const gradespr6 = useStore.studentDetail(studentDetailSelectors.getGeneralPhorpor6);
  // สมรถถนะ
  const capacityData = gradespr6?.filter(d => d.generalType === 'สมรรถนะ')
  // กิจกรรมพัฒนาผู้เรียน
  const activityData = gradespr6?.filter(d => d.generalType === 'กิจกรรมพัฒนาผู้เรียน');
  // คุณลักษณะอันพึงประสงค์
  const characteristicData = gradespr6?.filter(d => d.generalType === 'คุณลักษณะอันพึงประสงค์');

  const school = useStore.studentDetail(studentDetailSelectors.getSchool);
  const generals =
    useStore.studentDetail(studentDetailSelectors.getGeneralPhorpor6) || [];
  const allsign = useStore.studentDetail(studentDetailSelectors.getAllSign);

  const student = useStore.studentDetail(studentDetailSelectors.getPhorpor6Form)

  const [filter, setFilter] = useState<TTemplateFilter>({
    is_default: true
  });

  const {
    template,
  } = useDocumentTemplateList(filter);

  const summary = defaultTo(studentDetail?.dataJson.subject, []).reduce(
    (acc, current) => {
      acc.hours += Number(current.hours);
      acc.totalScore += Number(current.totalScore);
      acc.avgScore += Number(current.avgScore);
      acc.score += Number(current.score);
      acc.credits += Number(current.credits);
      acc.type = current.type as TSubjectType;
      return acc;
    },
    {
      hours: 0,
      totalScore: 0,
      avgScore: 0,
      score: 0,
      credits: 0,
      type: TSubjectType.PRIMARY,
    },
  );
  return (
    <CWWhiteBox>
      <CWTemplatePreview
        templateData={template[0]}
        studentDetail={studentDetail}
        studentData={student}
        grades={grades}
        generals={generals}
        school={school}
        allsign={allsign}
        summary={summary}
      />
    </CWWhiteBox>
  );
};

export default Phorpor6Document;
