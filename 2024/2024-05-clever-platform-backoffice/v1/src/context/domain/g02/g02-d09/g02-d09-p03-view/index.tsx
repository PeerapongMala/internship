import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWInput from '@component/web/cw-input';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import TemplateContentSubjectSetting from '@domain/g06/local/components/web/template/cw-t-template-content-subject-setting';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import { LevelTypeMapTH } from '@domain/g06/local/constant/level';
import { EStatus } from '@global/enums';
import API from '@domain/g06/local/api';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const { template_id }: { template_id: string } = useParams({ strict: false });

  const navigate = useNavigate();

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

  const [template, setTemplate] = useState<Partial<TSubjectTemplate>>({
    seed_year_id: subjectData.seed_year_id,
    status: EStatus.DRAFT,
  });

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

      setTemplate(res.data.data[0]);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!templateID) {
      return;
    }

    fetchTemplate();
  }, [templateID]);

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        showSchoolName
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'เกณฑ์ใบตัดเกรด', href: '/' },
        ]}
      />

      <div className="w-full">
        <CWTitleBack label="Template ใบตัดเกรด" href="/content-creator/grade-template" />
      </div>

      <CWWhiteBox className="flex flex-col gap-5">
        <span className="text-lg font-bold">ข้อมูล Template</span>

        <CWInput
          className="w-full max-w-[554px]"
          disabled
          label="ชื่อ Template:"
          value={template.name}
        />
      </CWWhiteBox>

      <TemplateContentSubjectSetting
        isAcademicContext
        disabledEdit
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
                  ...lv,
                  evaluation_key: 'STAGE_LIST',
                  evaluation_topic: LevelTypeMapTH[lv.level_type],
                  value: `[${lv.levels.join(',')}]`,
                  weight: lv.weight,
                })),
              })) ?? [],
            is_clever: true,
            subject_name: subjectData.name,
            clever_subject_id: subjectData.id,
            credits: 0,
            is_extra: false,
          },
        ]}
      />
    </div>
  );
};

export default DomainJSX;
