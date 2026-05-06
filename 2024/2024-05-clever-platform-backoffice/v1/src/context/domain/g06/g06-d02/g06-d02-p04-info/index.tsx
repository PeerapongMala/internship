import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import TemplateManagerFirstPage from '../local/component/web/template/cw-t-manager-1st-step';
import { useNavigate, useParams } from '@tanstack/react-router';
import { TEvaluationForm, TGradeResponsiblePerson } from '../local/types/grade';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { AxiosError } from 'axios';
import EvaluationInfoPanel from './components/web/molecule/cw-m-evaluation-info-panel';
import TemplateManagerSecondPage from '../local/component/web/template/cw-t-manager-2nd-step';
import TemplateManagerThirdPage from '../local/component/web/template/cw-t-manager-3rd-step';
import { TContentSubject } from '@domain/g06/local/types/content';
import LayoutEvaluationForm from '../../local/components/web/template/cw-t-layout-evaluation';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const tabs = [
    { id: '1', label: 'ข้อมูลวิชา' },
    { id: '2', label: 'ผู้รับผิดชอบ' },
    { id: '3', label: 'สาระการเรียนรู้' },
  ];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].id);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [isDataChanged, setIsDataChanged] = useState(false);

  const navigate = useNavigate();
  const params = useParams({
    from: '/grade-system/evaluation/info/$evaluation_form_id',
  });
  const evaluationID = Number(params.evaluation_form_id);

  // page1
  const [evaluationForm, setEvaluationForm] = useState<TEvaluationForm>();
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

  // page2
  const [responsibleLists, setResponsibleLists] = useState<TGradeResponsiblePerson[]>([]);

  useEffect(() => {
    if (evaluationForm?.id) {
      fetchResponsibleLists(evaluationForm.id);
    }
  }, [evaluationForm?.id]);

  const fetchResponsibleLists = async (id: number) => {
    const res = await API.Grade.GetGradeResponsiblePersonByEvaluationID(
      id,
      onErrorFetchResponsibleLists,
    );

    setIsDataChanged(false);

    setResponsibleLists(res.data.data);
  };
  const onErrorFetchResponsibleLists = (error: AxiosError) => {
    showMessage('พบปัญหาในการเรียกข้อมูลจากเซิร์ฟเวอร์', 'error');
  };

  // page3
  const [contentSubjects, setContentSubjects] = useState<TContentSubject[]>([]);

  useEffect(() => {
    if (evaluationForm?.id) {
      fetchContentSubject(evaluationForm.id);
    }
  }, [evaluationForm?.id]);
  const fetchContentSubject = async (evaluationFormID: number) => {
    const response =
      await API.Grade.GetSubjectListAndDetailByEvaluationFormID(evaluationFormID);

    setContentSubjects(response.data.data);
  };

  const handleNavigateBack = () => {
    navigate({
      to: '../..',
      search: {
        step: undefined,
      },
    });
  };

  return (
    <LayoutEvaluationForm
      subPageTitle={`ใบประเมินรายวิชา ปีการศึกษา ${evaluationForm?.academic_year} ${evaluationForm?.year} ห้อง ${evaluationForm?.school_room}`}
      breadCrumbs={[{ label: 'แก้ไขใบตัดเกรด' }]}
    >
      <CWSwitchTabs
        tabs={tabs.map((tab) => ({ ...tab, onClick: () => setSelectedTab(tab.id) }))}
      />

      <div className="mt-5 flex w-full justify-between gap-6">
        <div className="w-full max-w-[75%] flex-1">
          {evaluationForm && (
            <TemplateManagerFirstPage
              disabledEdit
              hidden={selectedTab !== tabs[0].id}
              evaluationForm={evaluationForm}
            />
          )}

          <TemplateManagerSecondPage
            hidden={selectedTab !== tabs[1].id}
            responsibleLists={responsibleLists}
            onResponsiblePersonChange={(responsiblePersons) => {
              setResponsibleLists(responsiblePersons);
              setIsDataChanged(true);
            }}
          />

          <TemplateManagerThirdPage
            disabledEdit
            hidden={selectedTab !== tabs[2].id}
            contentSubjects={contentSubjects}
          />
        </div>

        <EvaluationInfoPanel
          onSaveSuccess={() => {
            fetchResponsibleLists(evaluationID);
          }}
          disableSave={!isDataChanged}
          evaluation={evaluationForm}
          evaluationID={evaluationID}
          responsibleLists={responsibleLists}
        />
      </div>
    </LayoutEvaluationForm>
  );
};

export default DomainJSX;
