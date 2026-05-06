import CWTitleBack from '@component/web/cw-title-back';
import { Space } from '@mantine/core';
import { useMatch, useNavigate, useParams } from '@tanstack/react-router';
import Phorpor6Tab from '../molecule/Phorpor6Tab';
import StoreGlobalPersist from '@store/global/persist';
import API from '@domain/g06/g06-d02/local/api';
import { useState, useEffect } from 'react';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import LayoutEvaluationForm from '@domain/g06/local/components/web/template/cw-t-layout-evaluation';

interface BreadcrumbPhorpor6Props extends React.PropsWithChildren { }

const PP6Layout: React.FC<BreadcrumbPhorpor6Props> = (props) => {
  const { children } = props;
  const { userData } = StoreGlobalPersist.StateGet(['userData']) || {};
  const school_name = userData?.school_name;

  const params = useParams({
    strict: false,
  });
  const id = params.id;
  const evaluationFormID = Number(params.evaluationFormId);

  const [evaluationForm, setEvaluationForm] = useState<TEvaluationForm>();

  useEffect(() => {
    fetchEvaluationForm(evaluationFormID);
  }, []);

  const fetchEvaluationForm = async (evaluationFormID: number) => {
    const response = await API.Grade.GetEvaluationFormByID(evaluationFormID);

    setEvaluationForm(response.data.data);
  };

  const navigate = useNavigate();

  const whitelist: string[] = [
    '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report',
    '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/recommend',
    '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/information',
    '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/assessment',
    '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/feedback',
  ];

  const isPhorpor6IndexTab = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id',
    shouldThrow: false,
  });

  const isPhorpor6ResultTab = whitelist.some((pattern) =>
    useMatch({
      from: pattern,
      shouldThrow: false,
    }),
  );

  const isPhorpor6CertTab = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/certificate',
    shouldThrow: false,
  });
  const isPhorpor6IdentityTab = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/report-form/$id',
    shouldThrow: false,
  });

  const isPhorpor6ResultHomepage = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report',
    shouldThrow: false,
  });

  const isPhorpor6ResultRecommend = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/recommend',
    shouldThrow: false,
  });

  const isPhorpor6ResultInformation = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/information',
    shouldThrow: false,
  });

  const isPhorpor6ResultAssessment = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/assessment',
    shouldThrow: false,
  });

  const isPhorpor6ResultFeedback = !!useMatch({
    from: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records/$id/report/feedback',
    shouldThrow: false,
  });

  return (
    <LayoutEvaluationForm
      breadCrumbs={[
        {
          label: 'สมุดบันทึกการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)',
          href: '/grade-system/evaluation/report/$evaluationFormId/phorpor6/student-records',
        },
        {
          label: 'ผลการพัฒนาคุณภาพผู้เรียนรายบุคคล(ปพ.6) ',
        },
      ]}
    >
      <CWTitleBack
        label={`ใบเกรด ${[evaluationForm?.year, evaluationForm?.academic_year, `${evaluationForm?.year}/${evaluationForm?.school_room}`].join(' / ')}`}
        href="../"
      />

      <Phorpor6Tab
        tabs={[
          {
            name: 'สถานะ',
            active: false,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}`,
              });
            },
          },
          {
            name: 'ปพ 5',
            active: false,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor5/0`,
              });
            },
          },
          {
            name: 'ปพ 6',
            active: location.pathname.includes('/phorpor6/student-records'),
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}`,
              });
            },
          },

        ]}
      />

      <Phorpor6Tab
        tabs={[
          {
            name: 'ปพ.6',
            active: isPhorpor6IndexTab,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}`,
              });
            },
          },
          {
            name: 'เล่มปพ.6',
            active: isPhorpor6ResultTab,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report`,
              });
            },
          },
          {
            name: 'ใบรับรอง',
            active: isPhorpor6CertTab,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/certificate`,
              });
            },
          },
          {
            name: 'แบบรายงานประจำตัวนักเรียน',
            active: isPhorpor6IdentityTab,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/report-form/${id}`,
              });
            },
          },
        ]}
      />

      {isPhorpor6ResultTab && (
        <Phorpor6Tab
          tabs={[{
            name: 'หน้าแรก',
            active: isPhorpor6ResultHomepage,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report`,
              });
            },
          },
          {
            name: 'คำแนะนำ',
            active: isPhorpor6ResultRecommend,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report/recommend`,
              });
            },
          },
          {
            name: 'ข้อมูลนักเรียน',
            active: isPhorpor6ResultInformation,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report/information`,
              });
            },
          },
          {
            name: 'ผลการประเมิน',
            active: isPhorpor6ResultAssessment,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report/assessment`,
              });
            },
          },
          {
            name: 'ความคิดเห็นและข้อเสนอแนะ',
            active: isPhorpor6ResultFeedback,
            onClick() {
              navigate({
                to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records/${id}/report/feedback`,
              });
            },
          },
          ]}
        />
      )}

      {children}
    </LayoutEvaluationForm>
  );
};

export default PP6Layout;
