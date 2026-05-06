import { useState } from 'react';
import { Template } from '../cover';

import PageContent from '../page-content';
import PageHeader from '../page-header';
import TemplatePicker from '../template-picker';
import { EditFormType } from '../edit-form'; 
import DateRangeSelector from '../date-range-selector';

interface AddSectionProps {
  templates: Template[];
  onBack: () => void;
  onSelectTemplate: (templateId: number) => void;
  setStateForm: (form: EditFormType) => void; // เพิ่ม prop สำหรับ set form
}

const AddSection: React.FC<AddSectionProps> = ({
  templates,
  onBack,
  onSelectTemplate,
  setStateForm,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date(tomorrow));


  const handleTemplateSelect = (templateId: number) => {
    if (currentDate) {
    
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(currentDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${dayStr}`;
      // Format date to 'YYYY-MM-DD'
      
      setStateForm({
        title: '',
        public_date: formattedDate,
        content: '',
        content2: '',
        images: [null, null, null],
      });

      onSelectTemplate(templateId);
    }
  };


  return (
    <div>
      <PageContent description="สามารถเลือกเทมเพลตเพื่อสร้างปกปกหนังสือพิมพ์ได้ในหน้านี้">
        <PageHeader title="สร้างปกหนังสือพิมพ์" onBack={onBack} />
        <div className="space-y-6">
          <DateRangeSelector
            label="วันที่ต้องการสร้าง"
            value={currentDate}
            onChange={setCurrentDate}
            minDate={tomorrow}
          />
          {currentDate && (
            <TemplatePicker templates={templates} onSelect={handleTemplateSelect} />
          )}
        </div>
      </PageContent>
    </div>
  );
};

export default AddSection;
