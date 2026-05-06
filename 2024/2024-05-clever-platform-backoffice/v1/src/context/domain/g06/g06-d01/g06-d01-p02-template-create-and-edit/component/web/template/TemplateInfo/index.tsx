import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import {
  GeneralTemplate,
  Template,
} from '@domain/g06/g06-d01/g06-d01-p02-template-create-and-edit';
import API from '@domain/g06/g06-d01/local/api';
import {
  EStatusTemplate,
  GeneralTemplateDropdown,
  GeneralTemplateDropdownItem,
} from '@domain/g06/g06-d01/local/api/type';
import { useEffect, useState } from 'react';
import SubjectsSetting from '../../organism/SubjectSetting';
import { getUserData } from '@global/utils/store/getUserData';
import SelectYear from '../../molecule/cw-m-select-year';

interface SubjectsProps {
  template: Template;
  onTemplateChange?: (template: Template) => void;
  disabledEdit?: boolean;
}

const TemplateInfo = ({ template, onTemplateChange, disabledEdit }: SubjectsProps) => {
  const userData = getUserData();

  const [generalTemplateList, setGeneralTemplateList] = useState<
    GeneralTemplateDropdown[]
  >([]);

  const displayOrder = [
    'เวลาเรียน',
    'คุณลักษณะอันพึงประสงค์',
    'สมรรถนะ',
    'กิจกรรมพัฒนาผู้เรียน',
    'ภาวะโภชนาการ',
  ];

  const generalTemplateMap = new Map(
    generalTemplateList?.map((item) => [item.template_type, item]),
  );

  useEffect(() => {
    // getCleverPlatformList();
    getGeneralTemplateDropdown();
  }, []);

  useEffect(() => {
    onTemplateChange?.(template as Template);
  }, [template]);

  const getGeneralTemplateDropdown = async () => {
    const response = await API.GeneralTemplateDropdown.Gets(Number(userData?.school_id), {
      page: 1,
      limit: 100,
    });

    if (response.status_code === 200) {
      const templates = response.data?.map((template) => ({
        ...template,
        template: template?.template?.filter(
          (template) =>
            template.status === EStatusTemplate.published && template.active_flag,
        ),
      }));

      const dropDownTemplate = displayOrder.map((type) => {
        const template = templates.find((template) => template.template_type == type);
        if (template) return template;

        return { template: [] as GeneralTemplateDropdownItem[], template_type: type };
      });

      setGeneralTemplateList(dropDownTemplate);
    }
  };

  const handleSelectChange = (key: string, value: number) => {
    // Build the new entry we'll definitely be inserting
    const newEntry: GeneralTemplate = {
      template_id: template.id ?? undefined,
      template_type: key,
      template_name:
        generalTemplateList
          .find((list) => list.template_type === key)
          ?.template.find((t) => t.id === value)?.name ?? '',
      general_template_id: value,
    };

    // Filter out any old entries with the same template_type
    const deduped = (template?.general_templates ?? []).filter(
      (t) => t.template_type !== key,
    );

    // Append newEntry; now there’s guaranteed to be exactly one of that type
    const updatedTemplates = [...deduped, newEntry];

    onTemplateChange?.({
      ...template,
      general_templates: updatedTemplates,
    });
  };

  const handleYearChange = (year: string) => {
    onTemplateChange?.({
      ...template,
      year: year,

      // clear selected subject when year change
      subjects: template.subjects.map((s) => ({
        ...s,
        clever_subject_id: undefined,
      })),
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CWWhiteBox className="my-4">
        <h1 className="text-[24px] font-bold">ข้อมูล Template</h1>
        <div className="grid grid-cols-3 gap-5 pt-3">
          <div className="grid grid-rows-1 gap-1">
            <CWInput
              disabled={disabledEdit}
              label={'ชื่อ Template:'}
              placeholder={'ใบเกรด...'}
              value={template.template_name}
              onChange={(e) => {
                onTemplateChange?.({ ...template, template_name: e.target.value });
              }}
              required={true}
            />
          </div>
          <div className="grid grid-rows-1 gap-1">
            <SelectYear
              disabled={disabledEdit}
              value={template.year}
              schoolID={userData.school_id}
              required={true}
              onChange={(e) => {
                const value = e.currentTarget.value;
                handleYearChange(value);
              }}
            />
          </div>
        </div>
      </CWWhiteBox>
      <CWWhiteBox className="my-4">
        <h1 className="mb-4 text-[24px] font-bold">Template แบบประเมินทั่วไป</h1>
        <div className="flex flex-col gap-5">
          {displayOrder.map((type) => {
            const doc = generalTemplateMap.get(type);
            if (!doc) return null;

            return (
              <div
                key={doc.template_type}
                className="grid grid-cols-12 items-center gap-5"
              >
                <h1 className="col-span-4 flex items-center whitespace-pre-line">
                  <span className="text-red-500">*</span>
                  {doc.template_type} :
                </h1>

                <CWSelect
                  disabled={disabledEdit}
                  className="col-span-8"
                  value={
                    template.general_templates.find((v) => v.template_type === type)
                      ?.general_template_id
                  }
                  options={doc.template.map((template) => ({
                    label: template.name,
                    value: template.id,
                  }))}
                  required
                  onChange={(e) =>
                    handleSelectChange(doc.template_type, Number(e.currentTarget.value))
                  }
                />
              </div>
            );
          })}
        </div>
      </CWWhiteBox>

      <CWWhiteBox className="my-4">
        <SubjectsSetting
          subjects={template.subjects}
          templateYear={template.year}
          disabledEdit={disabledEdit}
          onChange={(updatedSubjects) =>
            onTemplateChange?.({ ...template, subjects: updatedSubjects })
          }
        />
      </CWWhiteBox>
    </form>
  );
};

export default TemplateInfo;
