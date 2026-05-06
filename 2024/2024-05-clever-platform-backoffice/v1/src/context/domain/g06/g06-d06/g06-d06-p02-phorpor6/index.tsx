import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Suspense, useEffect } from 'react';
import PP6Layout from '../local/component/web/organism/BreadcrumbPhorpor6';
import Phorpor6Document from './component/web/organism/Phorpor6Document';
import { useForm } from 'react-hook-form';
import { useParams, useRouterState } from '@tanstack/react-router';
import { studentDetailSelectors } from '../local/stores/student-detail';
import useStore from '../local/stores';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';

const DomainJSX = () => {
  const form = useForm();
  const params = useParams({ strict: false });
  const fetchStudentDetail = useStore.studentDetail((state) => state.fetchStudentDetail);
  const initialFormValues = useStore.studentDetail(
    studentDetailSelectors.getPhorpor6Form,
  );
  const { location } = useRouterState();
  const { state } = location as any;
  const evaluationForm = state as TEvaluationForm;
  const setBreadcrumInfo = useStore.breadcrum((state) => state.setEvaluationForm);

  useEffect(() => {
    if (!evaluationForm) return;
    if (evaluationForm?.id) {
      setBreadcrumInfo(evaluationForm);
    }
  }, [evaluationForm]);

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
      <Suspense fallback="Loading...">
        <Phorpor6Document form={form} />
      </Suspense>
    </PP6Layout>
  );
};

export default DomainJSX;
