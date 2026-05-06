import { Fragment } from 'react/jsx-runtime';
import CWMTab from '@component/web/molecule/cw-m-tab';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';

interface BreadcrumbProps {
  evaluationFormID: number;
  evaluationForm?: TEvaluationForm;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ evaluationFormID, evaluationForm }) => {
  return (
    <Fragment>
      <div className="">
        <CWMTab
          tabs={[
            {
              name: 'สถานะ',
              to: `/grade-system/evaluation/report/${evaluationFormID}`,
              checkActiveUrl: `/grade-system/evaluation/report/${evaluationFormID}`,
            },
            {
              name: 'ปพ 5',
              to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor5/create`,
              checkActiveUrl: `/grade-system/evaluation/report/${evaluationFormID}/phorpor5/*`,
            },
            {
              name: 'ปพ 6',
              to: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records`,
              checkActiveUrl: `/grade-system/evaluation/report/${evaluationFormID}/phorpor6/student-records`,
              state: evaluationForm,
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default Breadcrumb;
