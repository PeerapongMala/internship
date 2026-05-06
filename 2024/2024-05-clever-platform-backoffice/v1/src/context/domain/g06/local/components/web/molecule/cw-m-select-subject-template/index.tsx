import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWSelect, { SelectOption, TCWSelectProps } from '@component/web/cw-select';
import API from '@domain/g06/local/api';
import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import { EStatus } from '@global/enums';
import showMessage from '@global/utils/showMessage';
import useModal from '@global/utils/useModal';
import { useEffect, useState } from 'react';

type SelectSubjectTemplateProps = Omit<TCWSelectProps, 'value'> & {
  value?: number | null;
  subjectID: number;
  /**
   * @param template undefined mean user not selected any dropdown menu
   */
  onSelectTemplate?: (template?: TSubjectTemplate) => void;
};

// million-ignore
const SelectSubjectTemplate = ({
  value,
  subjectID,
  onSelectTemplate,
  ...props
}: SelectSubjectTemplateProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [subjectTemplates, setSubjectTemplates] = useState<TSubjectTemplate[]>([]);

  const [pendingId, setPendingId] = useState<number | null>(null); // temporary id before confirm

  const modal = useModal();

  useEffect(() => {
    fetchData();
  }, [subjectID]);

  const fetchData = async () => {
    try {
      const result = await API.SubjectTemplate.GetSubjectTemplateLists({
        subject_id: subjectID,
        status: EStatus.ENABLED,
        limit: -1,
        include_indicators: true,
      });

      const templates = result.data.data;

      setSubjectTemplates(templates);

      setOptions(
        templates.map((template) => ({
          label: template.name,
          value: template.id,
        })),
      );
    } catch (error) {
      showMessage('พบปัญหาในการเรียกข้อมูล', 'error');
      throw error;
    }
  };

  return (
    <div>
      <CWSelect
        {...props}
        className="max-w-[480px]"
        label="เกณฑ์ของนักวิชาการ"
        value={value ?? ''}
        options={options}
        onChange={(e) => {
          const val = e.target.value;
          const id = val ? Number(val) : null;
          setPendingId(id);
          modal.open();
        }}
      />

      <CWModalCustom
        title="ยืนยันเปลี่ยน Template"
        open={modal.isOpen}
        buttonName="ตกลง"
        cancelButtonName="ยกเลิก"
        onClose={() => {
          setPendingId(null);
          modal.close();
        }}
        onOk={() => {
          const selectedTemplate = subjectTemplates.find((t) => t.id === pendingId);

          if (pendingId !== null && selectedTemplate) {
            onSelectTemplate?.(selectedTemplate);
          } else {
            onSelectTemplate?.(undefined);
          }

          setPendingId(null);
          modal.close();
        }}
      >
        คุณยืนยันที่จะเปลี่ยน Template ใช่หรือไม่
        <br />
        หากยืนยันข้อมูลตัวชี้วัดทั้งหมดจะถูกคืนค่า
      </CWModalCustom>
    </div>
  );
};

export default SelectSubjectTemplate;
