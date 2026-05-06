import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWSchoolCard from '@component/web/cw-school-card';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import InfoPanel from './component/web/organism/cw-o-info-panel';
import { useEffect, useState } from 'react';
import { TTemplate } from '../local/type/template';
import {
  TContentIndicator,
  TContentIndicatorSetting,
  TContentSubject,
} from '@domain/g06/local/types/content';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import TemplateInfo from './component/web/template/cw-t-template-info';
import CWTitleBack from '@component/web/cw-title-back';
import StoreGlobal from '@store/global';
import IndicatorInfo from './component/web/template/cw-t-indicator-info';
import { templateTabs } from '../g06-d01-p01-setting-template/component/web/option';

const DomainJSX = () => {
  const navigate = useNavigate();
  const params: { template_id: string } = useParams({ strict: false });

  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [template, setTemplate] = useState<TTemplate>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    const templateID = Number(params.template_id);
    if (isNaN(templateID)) {
      showMessage('Invalid template ID', 'info');
      navigate({ to: '../..', search: { tab: templateTabs[1].id } });

      return;
    }

    fetchData(templateID);
  }, [params.template_id]);
  const fetchData = async (templateID: number) => {
    await fetchTemplate(templateID);
    await fetchSubjects(templateID);
  };

  const fetchTemplate = async (templateID: number) => {
    setIsLoading(true);
    try {
      const res = await API.Templates.GetById(templateID);

      if (res.status_code === 200) {
        const data = res.data[0];

        setTemplate({
          ...data.template,
          general_templates: data.general_templates,
          subjects: data.subjects.map((subject) => ({
            ...subject,
            indicator: subject.indicator ?? [],
          })),
        });
      } else if (res.status_code === 404) {
        throw new Error('ไม่พบข้อมูล');
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      const err = error as Error;

      if (err.message === 'ไม่พบข้อมูล') {
        showMessage('ไม่พบ Template', 'info');
        navigate({ to: '../..', search: { tab: templateTabs[1].id } });
        throw error;
      }

      showMessage(err.message, 'error');
      console.error('Error fetching data:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSubjects = async (template_id: number) => {
    const response = await API.Subjects.Gets(template_id);

    if (response.status_code != 200) return;

    const data = response.data;

    const subjects = data.map((data) => {
      const indicator: TContentIndicator[] =
        data.indicator?.map((indicator) => {
          const setting: TContentIndicatorSetting[] | undefined = indicator?.setting?.map(
            (st): TContentIndicatorSetting => ({
              ...st,
              evaluation_form_indicator_id: st.indicator_id,
            }),
          );

          const contentIndicator: TContentIndicator = {
            ...indicator,
            evaluation_form_subject_id: indicator.template_subject_id,
            name: indicator.indicator_name,
            setting: setting,
          };
          return contentIndicator;
        }) ?? [];

      const subject = {
        ...data,
        id: data.subject_id,
        indicator: indicator,
      };

      return subject;
    });

    setTemplate((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        subjects: prev.subjects.map((sj) => ({
          ...sj,
          ...subjects.find((subject) => subject.id === sj.id),
        })),
      };
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        showSchoolName
        links={[
          { label: 'การเรียนการสอน' },
          { label: 'ระบบตัดเกรด (ปพ.)' },
          { label: 'จัดการ Template', href: `/grade-system/template?tab=${templateTabs[1].id}` },
          { label: 'Template ใบตัดเกรด' },
        ]}
      />

      <CWTitleBack
        label="Template ใบตัดเกรด"
        onClick={() => {
          navigate({ to: '../..', search: { tab: templateTabs[1].id } });
        }}
      />

      <CWSchoolCard />

      <div className="flex gap-6">
        <CWSwitchTabs
          className="w-full flex-1"
          tabs={[
            {
              id: '1',
              label: 'ข้อมูล Template',
              content: template && <TemplateInfo template={template} />,
            },
            {
              id: '2',
              label: 'ตัวชี้วัด',
              content: template?.subjects && (
                <IndicatorInfo subjects={template.subjects} />
              ),
            },
          ]}
        />

        <InfoPanel template={template} />
      </div>
    </div>
  );
};

export default DomainJSX;
