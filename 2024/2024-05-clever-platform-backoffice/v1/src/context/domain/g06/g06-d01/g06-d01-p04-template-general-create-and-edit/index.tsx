import CWInput from '@component/web/cw-input';
import CWTitleBack from '@component/web/cw-title-back';
import CWWhiteBox from '@component/web/cw-white-box';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@global/store/global';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import SelectTemplateType from './component/web/atom/cw-a-select-template-type';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { EStatus } from '@domain/g06/g06-d02/local/enums';
import ActionPanel from './component/web/organism/cw-o-action-panel';
import { GeneralTemplates } from '../local/api/type';
import showMessage from '@global/utils/showMessage';
import API from '../local/api';
import { useNavigate, useParams } from '@tanstack/react-router';
import ExampleTemplate from './component/web/template/cw-t-example-template';
import dayjs from 'dayjs';
import { getUserData } from '@global/utils/store/getUserData';
import SelectNutritionAdditionalData from '@domain/g06/local/components/web/molecule/cw-m-select-nutrition-additional-data';
import { templateTabs } from '../g06-d01-p01-setting-template/component/web/option';

const DomainJSX = () => {
  const userData = getUserData();

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  const [template, setTemplate] = useState<Partial<GeneralTemplates>>({
    school_id: Number(userData?.school_id),
  });

  const isStudyHoursType = template.template_type === EGradeTemplateType.STUDY_TIME;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);

    if (params.id) {
      fetchGetGeneralTemplate();
    }
  }, []);
  const fetchGetGeneralTemplate = async () => {
    const id = Number(params.id);

    API.GeneralTemplates.GetById(id).then((response) => {
      if (response.status_code == 200) {

        setTemplate(response.data[0]);
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (template.id) {
        const response = await API.GeneralTemplates.Update(
          Number(template.id),
          template as GeneralTemplates,
        );
        if (response.status_code != 200) throw new Error(response.message);

        navigate({ to: `../../../`, search: { tab: templateTabs[0].id } });
      } else {
        const response = await API.GeneralTemplates.Create(template as GeneralTemplates);
        if (response.status_code != 200) throw new Error(response.message);

        navigate({ to: `../../`, search: { tab: templateTabs[0].id } });
      }
    } catch (error) {
      const err = error as Error;
      showMessage(err.message, 'error');
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
          { label: 'จัดการ Template', href: `/grade-system/template?tab=${templateTabs[0].id}` },
          {
            label: params.id
              ? 'แก้ไข Template แบบประเมินทั่วไป'
              : 'เพิ่ม Template แบบประเมินทัวไป',
          },
        ]}
      />
      <div className="my-7">
        <CWTitleBack
          label={
            params.id
              ? 'แก้ไข Template แบบประเมินทั่วไป'
              : 'เพิ่ม Template แบบประเมินทั่วไป'
          }
          onClick={() => {
            const path = params.id ? '../../..' : '../..';
            navigate({ to: path, search: { tab: templateTabs[0].id } });
          }}
        />
      </div>

      <form className="flex w-full flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex min-w-0 max-w-[70%] flex-1 flex-col">
          <CWWhiteBox className="flex w-full flex-col gap-6">
            <h1 className="text-[18px] font-bold">ข้อมูล Template</h1>

            <div className="flex w-full gap-6">
              <SelectTemplateType
                className="flex-1"
                value={template.template_type}
                onChange={(v) => setTemplate((prev) => ({ ...prev, template_type: v }))}
              />
              <CWInput
                value={template.template_name}
                onChange={(e) =>
                  setTemplate((prev) => ({ ...prev, template_name: e.target.value }))
                }
                className="flex-1"
                label={'ชื่อ Template'}
                placeholder={template.template_type ?? 'เลือกประเภท Template'}
                required
              />
            </div>

            {/* {isStudyHoursType && (
              <>
                <div className="flex w-full gap-6">
                  <WCAInputDateFlat
                    className="flex-1"
                    label="วันเริ่มต้น"
                    required
                    value={template.additional_data?.start_date}
                    onChange={(dates) =>
                      setTemplate((prev) => ({
                        ...prev,
                        additional_data: {
                          ...prev.additional_data,
                          start_date: dayjs(dates[0]).format('YYYY-MM-DD'),
                        },
                      }))
                    }
                  />
                  <WCAInputDateFlat
                    className="flex-1"
                    label="วันสิ้นสุด"
                    required
                    value={template.additional_data?.end_date}
                    onChange={(dates) =>
                      setTemplate((prev) => ({
                        ...prev,
                        additional_data: {
                          ...prev.additional_data,
                          end_date: dayjs(dates[0]).format('YYYY-MM-DD'),
                        },
                      }))
                    }
                  />
                  <CWInput
                    className="flex-1 hide-arrow"
                    label="เวลาเรียน (ชั่วโมง/ปี)"
                    placeholder="0"
                    required
                    min={0}
                    type="number"
                    value={template.additional_data?.hours}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        additional_data: {
                          ...prev.additional_data,
                          hours: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </>
            )}

            {template.template_type === EGradeTemplateType.NUTRITIONAL_STATUS && (
              <SelectNutritionAdditionalData
                additionalData={template.additional_data}
                onChange={(additionalData) =>
                  setTemplate((prev) => ({
                    ...prev,
                    additional_data: additionalData,
                  }))
                }
              />
            )} */}
          </CWWhiteBox>

          {/* <ExampleTemplate
            templateName={template.template_name}
            templateType={template.template_type}
          /> */}
        </div>

        <ActionPanel
          className="w-[437px] flex-none"
          template={template}
          onStatusChange={(status) => setTemplate((prev) => ({ ...prev, status }))}
        />
      </form>
    </LayoutDefault>
  );
};

export interface ITemplate {
  id: string;
  template_name: string;
  template_type: EGradeTemplateType;
  study_hours: number;
  active_flag: boolean;
  school_id: string;
  end_date: Date;
  start_date: Date;
  status: EStatus;
  created_at: Date;
  created_by: string;
  updated_at?: Date;
  updated_by?: string;
}

export default DomainJSX;
