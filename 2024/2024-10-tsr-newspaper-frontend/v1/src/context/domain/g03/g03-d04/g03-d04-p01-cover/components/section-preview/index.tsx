import { CreateCoverForm } from '../../../local/api/restapi/cover-newspaper';
import { EditFormType } from '../edit-form';
import PageContent from '../page-content';
import PageHeader from '../page-header';
import TemplateRenderer from '../template-renderer';

interface PreviewSectionProps {
  onBack: () => void;
  currentTemplate?: number;
  stateForm?: EditFormType;
  onSave: (formData: CreateCoverForm) => Promise<void>;
  onCancel: () => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  onBack,
  currentTemplate,
  stateForm,
  onSave,
  onCancel,
}) => {
  return (
    <PageContent description="ตรวจสอบข้อมูลของปกหนังสือพิมพ์ได้ในหน้านี้ สามารถเลือกที่จะบันทึกหรือแก้ไขได้">
      <PageHeader title="แสดงตัวอย่าง" onBack={onBack} />
      <TemplateRenderer
        templateId={currentTemplate}
        stateForm={stateForm}
        onSave={onSave}
        onCancel={onCancel}
      />
    </PageContent>
  );
};

export default PreviewSection;
