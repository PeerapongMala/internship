import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import CWButton from '@component/web/cw-button';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import IconOpenBook from '@core/design-system/library/vristo/source/components/Icon/IconOpenBook';
import IconTxtFile from '@core/design-system/library/vristo/source/components/Icon/IconTxtFile';
import showMessage from '@global/utils/showMessage';
import API from '../local/api';
import CustomWizardBar from './component/web/organism/CustomWizzardBar';
import SettingTemplate from './component/web/template/cw-t-setting-template';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate, useParams } from '@tanstack/react-router';
import { EStatusTemplate, Settings, Subjects } from '../local/api/type';
import {
  TContentIndicator,
  TContentIndicatorSetting,
  TContentSubject,
} from '@domain/g06/local/types/content';
import { getUserData } from '@global/utils/store/getUserData';
import { validateTemplate } from '../local/utils/validate-template';
import useModalErrorInfos from '@global/hooks/useModalErrorInfos';
import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import { validateSubjects } from '../local/utils/validate-subject';
import { validateGeneralTemplate } from '../local/utils/validate-general-template';
import { validateSubjectsIndicator } from '@domain/g06/local/utils/subject';
import { templateTabs } from '../g06-d01-p01-setting-template/component/web/option';

export interface GeneralTemplate {
  template_id?: number;
  template_type: string;
  template_name: string;
  general_template_id?: number | null;
}

export interface Template {
  general_templates: GeneralTemplate[];
  template_name: string;
  year: string;
  subjects: Subjects[];
  id?: number;
  school_id: number;
  active_flag: boolean;
  version?: string | null;
  status: EStatusTemplate;
}

const wizardTabs = [
  {
    id: 1,
    label: '1. ข้อมูล Template',
    icon: <IconTxtFile duotone={false} />,
  },
  {
    id: 2,
    label: '2. ตั้งค่าตัวชี้วัด',
    icon: <IconOpenBook duotone={false} />,
  },
  {
    id: 3,
    label: '3. เผยแพร่',
    icon: <IconEye duotone={false} />,
  },
];

const DomainJSX = () => {
  // const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const modalErrorInfos = useModalErrorInfos();
  const params: { template_id?: string } = useParams({ strict: false });
  const userData = getUserData();

  const [currentStep, setCurrentStep] = useState(1); // ขั้นตอนปัจจุบัน
  const [template, setTemplate] = useState<Template>({
    school_id: Number(userData?.school_id),
    subjects: [],
    template_name: '',
    general_templates: [],
    year: '',
    active_flag: false,
    status: EStatusTemplate.draft,
  }); // ข้อมูล template
  const [isSubmitting, setIsSubmitting] = useState(false); // สถานะกำลังบันทึก

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);

    if (params.template_id) {
      const templateID = Number(params.template_id);
      if (isNaN(templateID)) {
        showMessage('Invalid template id', 'error');
        navigate({ to: '../..', search: { tab: templateTabs[1].id } });
        return;
      }

      fetchData(templateID);
    }
  }, [params.template_id]);
  const fetchData = async (templateID: number) => {
    await fetchTemplate(templateID);
    await fetchSubjects(templateID);
  };

  useEffect(() => {
    console.log(template);
  }, [template]);

  const fetchTemplate = async (templateID: number) => {
    setIsLoading(true);
    try {
      const res = await API.Templates.GetById(templateID);

      if (res.status_code === 200) {
        const data = res.data[0];

        if (data.template.status === EStatusTemplate.published) {
          throw new Error('already publish');
        }

        setTemplate({
          ...data.template,
          general_templates: data.general_templates,
          subjects: data.subjects.map((subject) => ({
            ...subject,
            indicator: subject.indicator ?? [],
          })),
        });
      } else {
        showMessage(res.message, 'error');
        throw new Error(res.message);
      }
    } catch (error) {
      const err = error as Error;
      if (err.message === 'already publish') {
        showMessage('ไม่สามารถแก้ไขได้หลังจากเผยแพร่แล้ว', 'info');
        navigate({ to: '../..', search: { tab: templateTabs[1].id } });
        throw error;
      }

      showMessage(err.message, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (params.template_id && !template.id) {
      showMessage('ไม่พบ template id', 'error');
      return;
    }

    const errors: TErrorInfos[] = [];

    validateTemplate(template, errors);
    validateGeneralTemplate(template.general_templates, errors);
    validateSubjects(template.subjects, errors);
    validateSubjectsIndicator(template.subjects, errors);

    if (errors.length > 0) {
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      modalErrorInfos.setErrorInfos(errors);
      throw new Error('form validated failed');
    }

    setIsSubmitting(true);

    // create
    if (!template.id) {
      try {
        const response = await API.Templates.Create({
          template: { ...template },
          subjects: template.subjects,
          general_templates: template.general_templates,
        });
        if (response.status_code === 201 || response.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');

          navigate({ to: `../edit/${response.data[0].template.id}` });
        } else {
          showMessage(response.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
      } catch (error: any) {
        showMessage(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    // edit
    try {
      const response = await API.Templates.UpdateDetail(template.id, {
        template: { ...template, id: template.id as number },
        subjects: template.subjects,
        general_templates: template.general_templates,
      });
      if (response.status_code === 201 || response.status_code === 200) {
        showMessage('บันทึกสำเร็จ', 'success');
      } else {
        throw new Error(response.message);
      }

      await handleSaveSubjects(template.id, template);
    } catch (error: any) {
      showMessage(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsSubmitting(false);
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

    setTemplate((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sj) => ({
        ...sj,
        ...subjects.find((subject) => subject.id === sj.id),
      })),
    }));
  };

  const handleSaveSubjects = async (templateID: number, template: Template) => {
    const req = API.Subjects.Update(
      templateID,
      template.subjects.map((subject) => ({
        ...subject,
        subject_id: (subject?.id ?? 0) > 0 ? subject.id : undefined,
        subject_name: subject.subject_name,
        indicator: subject.indicator.map((indicator) => ({
          ...indicator,
          id: (indicator.id ?? 0) > 0 ? indicator.id : undefined, // for create if id not > 0
          template_subject_id: indicator.evaluation_form_subject_id,
          indicator_name: indicator.name,
          setting: indicator?.setting?.map(
            (setting): Settings => ({
              ...setting,
              id: (setting.id ?? 0) > 0 ? setting.id : undefined, // for create if id not > 0
              indicator_id: indicator.id ? indicator.id : undefined,
            }),
          ),
        })),
      })),
    );

    try {
      const response = await req;
      if (response.status_code === 201 || response.status_code === 200) {
        showMessage('บันทึกสำเร็จ', 'success');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName
        links={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'ระบบตัดเกรด (ปพ.)', href: '/', disabled: true },
          { label: 'จัดการ Template', href: `/grade-system/template?tab=${templateTabs[1].id}` },
          { label: 'สร้าง Template ใบตัดเกรด', href: '/grade-system/template/create' },
        ]}
      />
      <div className="w-full">
        <div className="my-7">
          <CWTitleBack
            label="สร้าง Template ใบตัดเกรด"
            href={`/grade-system/template?tab=${templateTabs[1].id}`}
          />
        </div>
      </div>
      <CWWhiteBox className="my-4">
        <CustomWizardBar
          tabs={wizardTabs}
          currentTab={currentStep}
          onTabChange={(index) => {
            setCurrentStep(index);
          }}
        />
      </CWWhiteBox>

      <SettingTemplate
        currentStep={currentStep}
        template={template}
        setTemplate={setTemplate}
      />

      <CWNeutralBox className="flex justify-between">
        <div className="flex gap-5">
          <CWButton
            variant={'primary'}
            title={'บันทึก'}
            disabled={isSubmitting}
            onClick={handleSave}
          />
          <CWButton
            variant={'primary'}
            title={'ยกเลิก'}
            disabled={isSubmitting}
            outline={true}
            onClick={() => {
              navigate({ to: '../..', search: { tab: templateTabs[1].id } });
            }}
          />
        </div>
        <div className="flex gap-5">
          <CWButton
            icon={<IconArrowLeft />}
            variant={'primary'}
            title={'ย้อนกลับ'}
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep(currentStep - 1)}
          />
          <CWButton
            variant={'primary'}
            title={'ต่อไป'}
            disabled={currentStep === 3 || isSubmitting}
            onClick={async () => {
              await handleSave();
              setCurrentStep(currentStep + 1);
            }}
            suffix={<IconArrowRight />}
          />
        </div>
      </CWNeutralBox>

      {modalErrorInfos.isOpen && modalErrorInfos.render()}
    </LayoutDefault>
  );
};

export default DomainJSX;
