import LayoutDefault from '@core/design-system/library/component/layout/default';
import { useEffect } from 'react';
import PP6Layout from '../local/component/web/organism/BreadcrumbPhorpor6';
import Phorpor6CertDocument from './component/web/organism/Phorpor6CertificateDocument';
import { useForm } from 'react-hook-form';
import { useParams } from '@tanstack/react-router';
import useStore from '../local/stores';
import { studentDetailSelectors } from '../local/stores/student-detail';

const DomainJSX = () => {
  const form = useForm();
  const params = useParams({ strict: false });
  const fetchStudentDetail = useStore.studentDetail((state) => state.fetchStudentDetail);
  const initialFormValues = useStore.studentDetail(
    studentDetailSelectors.getPhorpor6CertificateForm,
  );

  useEffect(() => {
    if (params && params?.evaluationFormId && params?.id) {
      fetchStudentDetail(params.evaluationFormId, params.id);
    }
  }, [params]);

  useEffect(() => {
    if (initialFormValues) {
      form.reset(initialFormValues);
    }
  }, [initialFormValues]);

  return (
    <PP6Layout>
      <Phorpor6CertDocument form={form} />
    </PP6Layout>
  );
};

export default DomainJSX;
