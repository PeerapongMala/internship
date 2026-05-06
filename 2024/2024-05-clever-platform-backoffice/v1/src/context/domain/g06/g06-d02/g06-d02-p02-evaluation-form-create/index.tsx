import LayoutEvaluationForm from '@domain/g06/local/components/web/template/cw-t-layout-evaluation';
import WizardBar from '@domain/g06/g06-d02/local/component/web/organism/cw-o-wizard-bar';
import { FormEvent, useRef, useState } from 'react';
import TemplateManagerFirstPage from '@domain/g06/g06-d02/local/component/web/template/cw-t-manager-1st-step';
import ManagerButtonActionPanel from '@domain/g06/g06-d02/local/component/web/organism/cw-o-manager-button-action-panel';
import { TPageStatus } from '../local/types';
import { evaluationTabs } from '../local/constant/evaluationTabs';
import showMessage from '@global/utils/showMessage';
import { TEvaluationFormCreate } from '../local/types/grade';
import { EEvaluationFormStatus } from '../local/enums/evaluation';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import { AxiosError } from 'axios';
import { TPostEvaluationFormReq } from '../local/api/helper/grade';
import { getUserData } from '@global/utils/store/getUserData';

const DomainJSX = () => {
  const userData = getUserData();
  const schoolID = userData?.school_id;

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [pageStatus, setPageStatus] = useState<TPageStatus>({
    isFirstPage: true,
    isLastPage: false,
  });
  const [evaluationForm, setEvaluationForm] = useState<TEvaluationFormCreate>({
    school_id: Number(schoolID),
    status: EEvaluationFormStatus.DRAFT,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await API.Grade.PostEvaluationForm(
      {
        ...(evaluationForm as TPostEvaluationFormReq),
        wizard_index: evaluationForm.wizard_index ?? 1,
      },
      handleSubmitError,
    );

    const data = response.data.data;

    showMessage('บันทึกแบบร่างสำเร็จ');

    if (!data?.id || !data?.wizard_index) {
      handleNavigateBack();
      return;
    }

    navigate({ to: `../edit/${data.id}` });
  };
  const handleSubmitError = (err: AxiosError) => {
    if (err.response?.status === 400) {
      showMessage('ห้องเรียนไม่สามารถซ้ำกันได้', 'error');
    } else if (err.response?.status === 500) {
      showMessage('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', 'error');
    } else {
      showMessage('พบปัญหาในการบันทึกฟอร์ม', 'error');
    }
  };

  const handleFormInvalid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const templateID = formData.get('template_id');

    if (templateID) {
      showMessage('โปรดกรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    showMessage('โปรดเลือก Template', 'error');
  };

  const handleNavigateBack = () => {
    navigate({
      to: '..',
      search: {
        step: undefined,
      },
    });
  };

  return (
    <LayoutEvaluationForm
      subPageTitle="สร้างใบตัดเกรด"
      breadCrumbs={[{ label: 'สร้างใบตัดเกรด' }]}
    >
      <WizardBar
        tabs={evaluationTabs}
        selectedTab={activeTab}
        handleSetActiveTab={setActiveTab}
        onTabChange={(isFirstPage, isLastPage) => {
          setPageStatus({ isFirstPage: isFirstPage, isLastPage: isLastPage });
        }}
      />

      <form
        ref={formRef}
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
        onInvalid={handleFormInvalid}
      >
        <TemplateManagerFirstPage
          evaluationForm={evaluationForm}
          hidden={!(activeTab === evaluationTabs[0].id)}
          isSubmitStep={pageStatus.isLastPage}
          onDataChange={(key, value) =>
            setEvaluationForm((prev) => ({
              ...prev,
              ...{ [key as string]: value ? value : undefined },
            }))
          }
        />

        <ManagerButtonActionPanel
          isNextButtonSubmit
          pageStatus={pageStatus}
          onPreviousPage={() => setActiveTab((prev) => prev - 1)}
          onNextPage={() => {
            setEvaluationForm((prev) => ({ ...prev, wizard_index: activeTab + 1 }));
          }}
          onCancel={handleNavigateBack}
        />
      </form>
    </LayoutEvaluationForm>
  );
};

export default DomainJSX;
