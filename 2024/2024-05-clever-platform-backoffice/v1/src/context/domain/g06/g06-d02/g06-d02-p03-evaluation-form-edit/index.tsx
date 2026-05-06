import LayoutEvaluationForm from '@domain/g06/local/components/web/template/cw-t-layout-evaluation';
import WizardBar from '@domain/g06/g06-d02/local/component/web/organism/cw-o-wizard-bar';
import { FormEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import TemplateManagerFirstPage from '@domain/g06/g06-d02/local/component/web/template/cw-t-manager-1st-step';
import ManagerButtonActionPanel from '@domain/g06/g06-d02/local/component/web/organism/cw-o-manager-button-action-panel';
import { TPageStatus } from '@domain/g06/g06-d02/local/types';
import { evaluationTabs } from '@domain/g06/g06-d02/local/constant/evaluationTabs';
import showMessage from '@global/utils/showMessage';
import {
  TEvaluationFormEdit,
  TGradeResponsiblePerson,
} from '@domain/g06/g06-d02/local/types/grade';
import TemplateManagerSecondPage from '@domain/g06/g06-d02/local/component/web/template/cw-t-manager-2nd-step';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import API from '@domain/g06/g06-d02/local/api';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import TemplateManagerThirdPage from '@domain/g06/g06-d02/local/component/web/template/cw-t-manager-3rd-step';
import { TContentSubject } from '@domain/g06/local/types/content';
import TemplateManagerForthPage from '../local/component/web/template/cw-t-manager-4th';
import { getUserData } from '@global/utils/store/getUserData';
import { validateSubjectsIndicator } from '@domain/g06/local/utils/subject';
import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import useModalErrorInfos from '@global/hooks/useModalErrorInfos';

const DomainJSX = () => {
  const search: { step?: string } = useSearch({
    from: '/grade-system/evaluation/edit/$evaluation_form_id',
  });
  const navigate = useNavigate({
    from: '/grade-system/evaluation/edit/$evaluation_form_id',
  });
  const params = useParams({
    from: '/grade-system/evaluation/edit/$evaluation_form_id',
  });

  const modalErrorInfos = useModalErrorInfos();

  const evaluationID = Number(params.evaluation_form_id);

  const userData = getUserData();

  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState(Number(search.step) ?? 0);
  const [pageStatus, setPageStatus] = useState<TPageStatus>({
    isFirstPage: true,
    isLastPage: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isNextPageOnSuccess, setIsNextPageOnSuccess] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState<TEvaluationFormEdit>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevent negative indicator id.
    const subjects: TContentSubject[] = contentSubjects.map((subject) => ({
      ...subject,
      indicator: subject.indicator?.map((indicator) => ({
        ...indicator,
        id: (indicator?.id ?? 0) > 0 ? indicator.id : undefined,
      })),
    }));

    // validate before save
    const errors: TErrorInfos[] = [];
    validateSubjectsIndicator(subjects, errors);

    if (errors.length > 0) {
      modalErrorInfos.setErrorInfos(errors);
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }

    let wizardIndex = evaluationForm.wizard_index ?? 1;
    if (activeTab < wizardIndex) wizardIndex = activeTab;

    const request = [
      API.Grade.PatchEvaluationForm(evaluationID, {
        ...evaluationForm,
        wizard_index: wizardIndex + (isNextPageOnSuccess ? 1 : 0),
        updated_at: dayjs(),
        updated_by: userData.id,
      }),
      API.Grade.PutGradeResponsiblePerson(evaluationID, responsibleLists),
      API.Grade.PatchUpdateSubjectByEvaluationFormID(evaluationID, subjects),
    ];
    setIsSaving(true);
    try {
      await Promise.all(request);
    } catch (error) {
      showMessage('พบปัญหาในการบันทึกข้อมูล', 'error');
      throw error;
    } finally {
      setIsSaving(false);
      setIsNextPageOnSuccess(false);
    }
    await handleRefetchAllData();

    if (!pageStatus.isLastPage) {
      showMessage('บันทึกข้อมูลสำเร็จ');
      return;
    }

    await handleSubmitStep();
  };

  const handleFormInvalid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!evaluationForm.template_id) {
      showMessage('โปรดเลือกข้อมูล Template', 'error');
      return;
    }

    showMessage('โปรดกรอกข้อมูลให้ครบถ้วน', 'error');
  };

  const handleNavigateBack = () => {
    navigate({
      to: '../..',
      search: {
        step: undefined,
      },
    });
  };

  useEffect(() => {
    if (isNaN(evaluationID)) {
      handleNavigateBack();
      return;
    }

    fetchEvaluationForm(evaluationID);
  }, []);
  const fetchEvaluationForm = async (evaluationID: number) => {
    const response = await API.Grade.GetEvaluationFormByID(
      evaluationID,
      handleFetchEvaluationFormError,
    );
    const data = response.data.data;

    // set active tab by wizard index from api
    setActiveTab(data.wizard_index ?? evaluationTabs[0].id);

    setEvaluationForm(data);
  };
  const handleFetchEvaluationFormError = (error: AxiosError) => {
    if (error.response?.status === 404) {
      showMessage('ไม่พบใบตัดเกรด', 'error');
      handleNavigateBack();
      return;
    }
    showMessage('พบปัญหาในการนำเข้าใบตัดเกรด', 'error');
    console.error(error);
  };

  // step-2
  const [responsibleLists, setResponsibleLists] = useState<TGradeResponsiblePerson[]>([]);

  useEffect(() => {
    if (evaluationForm.id) {
      fetchResponsibleLists(evaluationForm.id);
    }
  }, [evaluationForm.id]);

  const fetchResponsibleLists = async (id: number) => {
    const res = await API.Grade.GetGradeResponsiblePersonByEvaluationID(
      id,
      onErrorFetchResponsibleLists,
    );

    setResponsibleLists(res.data.data);
  };
  const onErrorFetchResponsibleLists = (error: AxiosError) => {
    showMessage('พบปัญหาในการเรียกข้อมูลจากเซิร์ฟเวอร์', 'error');
  };
  // end-of-step2

  // step-3
  const [contentSubjects, setContentSubjects] = useState<TContentSubject[]>([]);

  useEffect(() => {
    if (evaluationForm.id) {
      fetchContentSubject(evaluationForm.id);
    }
  }, [evaluationForm.id]);
  const fetchContentSubject = async (evaluationFormID: number) => {
    const response =
      await API.Grade.GetSubjectListAndDetailByEvaluationFormID(evaluationFormID);

    setContentSubjects(response.data.data);
  };

  // end of step-3

  // step-4
  const handleSubmitStep = async () => {
    try {
      await API.Grade.PostEvaluationFormSubmit(evaluationID);
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเผยแพร่');
      throw error;
    }

    showMessage('เผยแพร่สำเร็จ');
    handleNavigateBack();
  };
  //end of step-4

  const handleRefetchAllData = async () => {
    if (!evaluationForm.id) return;

    const request = [
      fetchEvaluationForm(evaluationForm.id),
      fetchResponsibleLists(evaluationForm.id),
      fetchContentSubject(evaluationForm.id),
    ];

    await Promise.all(request);
  };

  // set initial active wizard tab
  useEffect(() => {
    let step: number = activeTab;
    if (isNaN(activeTab)) {
      step = evaluationTabs[0].id;
    }
    navigate({
      search: {
        step: step,
      },
    });
  }, [activeTab]);
  useEffect(() => {
    let step: number = Number(search.step);
    if (isNaN(step)) {
      step = evaluationTabs[0].id;
    }

    setActiveTab(step);
  }, [search.step]);

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
          onDataChange={(key, value) => {
            setEvaluationForm((prev) => ({
              ...prev,
              ...{ [key as string]: value },
            }));
          }}
        />

        <TemplateManagerSecondPage
          hidden={!(activeTab === evaluationTabs[1].id)}
          responsibleLists={responsibleLists}
          onResponsiblePersonChange={(lists) => setResponsibleLists(lists)}
        />

        <TemplateManagerThirdPage
          contentSubjects={contentSubjects}
          onContentSubjectsChange={setContentSubjects}
          hidden={!(activeTab === evaluationTabs[2].id)}
        />

        <TemplateManagerForthPage hidden={!(activeTab === evaluationTabs[3].id)} />

        <ManagerButtonActionPanel
          isNextButtonSubmit
          noActionButton={activeTab === evaluationTabs[3].id}
          isSaving={isSaving}
          pageStatus={pageStatus}
          evaluationForm={evaluationForm}
          onPreviousPage={() => {
            setActiveTab(activeTab - 1);
          }}
          onNextPage={() => {
            // need to set this due current use handleSubmit in form logic
            setIsNextPageOnSuccess(true);
          }}
        />
      </form>

      {modalErrorInfos.isOpen && modalErrorInfos.render()}
    </LayoutEvaluationForm>
  );
};

export default DomainJSX;
