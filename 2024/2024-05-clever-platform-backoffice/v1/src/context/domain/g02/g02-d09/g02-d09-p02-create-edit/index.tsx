import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWInput from '@component/web/cw-input';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import IconOpenBook from '@core/design-system/library/vristo/source/components/Icon/IconOpenBook';
import IconTxtFile from '@core/design-system/library/vristo/source/components/Icon/IconTxtFile';
import CustomWizardBar from '@domain/g06/g06-d01/g06-d01-p02-template-create-and-edit/component/web/organism/CustomWizzardBar';
import TemplateContentSubjectSetting from '@domain/g06/local/components/web/template/cw-t-template-content-subject-setting';
import { useEffect, useMemo, useState } from 'react';
import ActionPanel from './components/web/organism/cw-o-action-panel';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import { LevelTypeMapEN, LevelTypeMapTH } from '@domain/g06/local/constant/level';
import { EStatus } from '@global/enums';
import API from '@domain/g06/local/api';
import PublishPanel from './components/web/organism/cw-o-publish';

const wizardTabs = [
  {
    id: 1,
    label: '1. ข้อมูล Template',
    icon: <IconTxtFile duotone={false} />,
  },
  {
    id: 2,
    label: '2. ตัวชี้วัด',
    icon: <IconOpenBook duotone={false} />,
  },
  {
    id: 3,
    label: '3. เผยแพร่',
    icon: <IconEye duotone={false} />,
  },
];

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const { template_id }: { template_id: string } = useParams({ strict: false });

  const search: { step: string } = useSearch({ strict: false });
  const navigate = useNavigate();

  const setStep = (step: number) => {
    navigate({
      to: './',
      search: {
        step: step,
      },
      replace: false,
    });
  };

  const templateID = useMemo(() => {
    let id: string | number = template_id;
    if (!id) return;

    id = Number(id);

    if (isNaN(id)) {
      showMessage('invalid template_id', 'error');
      navigate({ to: '../..' });
    }

    return id;
  }, [template_id]);

  const currentStep = useMemo(() => {
    const step = Number(search.step);

    return step;
  }, [search.step]);

  useEffect(() => {
    if (search.step === undefined || isNaN(Number(search.step))) {
      setStep(1);
    }
  }, [search.step]);

  const [template, setTemplate] = useState<Partial<TSubjectTemplate>>({
    seed_year_id: subjectData.seed_year_id,
    status: EStatus.DRAFT,
  });
  const [isIndicatorUpdate, setIsIndicatorUpdate] = useState(false);

  const fetchTemplate = async () => {
    if (!templateID) return;

    try {
      const res = await API.SubjectTemplate.GetSubjectTemplateLists({
        id: templateID,
        include_indicators: true,
      });

      if (res.data._pagination.total_count == 0) {
        navigate({ to: '../..' });
        showMessage('ไม่พบไอดี', 'info');
        return;
      }

      if (
        res.data.data[0].status == EStatus.ENABLED ||
        res.data.data[0].status == EStatus.DISABLED
      ) {
        showMessage('ไม่สามารถแก้ไข Template ที่เผยแพร่แล้วได้', 'warning');
        navigate({ to: '../..' });
        return;
      }

      setTemplate(res.data.data[0]);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!templateID) {
    }

    fetchTemplate();
  }, [templateID]);

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        showSchoolName
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการเกณฑ์ใบตัดเกรด', href: '/' },
        ]}
      />

      <div className="w-full">
        <CWTitleBack
          label="สร้าง Template ใบตัดเกรด"
          href="/content-creator/grade-template"
        />
      </div>

      <CWWhiteBox className="my-4">
        <CustomWizardBar
          tabs={wizardTabs}
          currentTab={currentStep}
          onTabChange={(id) => {
            setStep(id);
          }}
        />
      </CWWhiteBox>

      {currentStep == 1 && (
        <CWWhiteBox className="flex flex-col gap-5">
          <span className="text-lg font-bold">ข้อมูล Template</span>

          <CWInput
            required
            label="ชื่อ Template:"
            value={template.name}
            onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
          />
        </CWWhiteBox>
      )}

      {currentStep == 2 && templateID && (
        // when in. we map evaluation_topic as th. then when update. we map from TH back to end
        <TemplateContentSubjectSetting
          isAcademicContext
          contentSubjects={[
            {
              id: templateID,
              indicator:
                template.indicators?.map((indicator) => ({
                  ...indicator,
                  clever_lesson_id: indicator.lesson_id,
                  clever_sub_lesson_id: indicator.sub_lesson_id,
                  max_value: indicator.value,
                  sort: -1,
                  score_evaluation_type: EScoreEvaluationType.ACADEMIC_CRITERIA,
                  evaluation_form_subject_id: -1,
                  setting: indicator.levels.map((lv) => ({
                    evaluation_key: 'STAGE_LIST',
                    evaluation_topic: LevelTypeMapTH[lv.level_type],
                    value: `[${lv.levels.join(',')}]`,
                    weight: lv.weight,
                    level_count: lv.level_count,
                  })),
                })) ?? [],
              is_clever: true,
              subject_name: subjectData.name,
              clever_subject_id: subjectData.id,
            },
          ]}
          onContentSubjectsChange={(subjects) => {
            const subject = subjects[0];

            setTemplate((prev) => {
              const data: Partial<TSubjectTemplate> = {
                ...prev,
                id: subject.id,
                indicators: subject.indicator.map((indicator, index) => ({
                  id: -(index + 1),
                  subject_template_id: indicator.clever_lesson_id ?? 1,
                  lesson_id: indicator.clever_lesson_id ?? 0,
                  sub_lesson_id: indicator.clever_sub_lesson_id ?? 0,
                  index: index,
                  type: indicator.score_evaluation_type,
                  name: indicator.name,
                  value: indicator.max_value,
                  levels: indicator.setting
                    ? indicator.setting.map((st) => ({
                        subject_template_indicator_id: -1,
                        level_type: LevelTypeMapEN[
                          st.evaluation_topic
                        ] as keyof typeof LevelTypeMapTH,
                        weight: st.weight,
                        levels: st.value
                          .replace('[', '')
                          .replace(']', '')
                          .split(',')
                          .filter(Boolean)
                          .map(Number),
                        level_count: st.level_count,
                      }))
                    : [],
                })),
              };

              return data;
            });

            setIsIndicatorUpdate(true);
          }}
        />
      )}

      {currentStep == 3 && templateID && <PublishPanel id={templateID} />}

      <ActionPanel
        isIndicatorUpdate={isIndicatorUpdate}
        template={template}
        lastEditAt={template.updated_at ?? template.created_at}
        lastEditBy={template.updated_by ?? template.created_by}
        currentStep={currentStep}
        onNextPage={() => {
          setStep(currentStep + 1);
        }}
        onSaveSuccess={() => {
          setIsIndicatorUpdate(false);
          fetchTemplate();
        }}
        onPreviousPage={() => {
          if (currentStep == 1) return;
          setStep(currentStep - 1);
        }}
      />
    </div>
  );
};

export default DomainJSX;
