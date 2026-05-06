import { Dispatch, SetStateAction } from 'react';
import { navCover } from '../cover'; 
import EditForm, { EditFormType } from '../edit-form';
import PageContent from '../page-content';
import PageHeader from '../page-header';interface EditSectionProps {
  onBack: () => void;
  currentTemplate?: number;
  setStateForm: Dispatch<SetStateAction<EditFormType | undefined>>;
  setCurrentPage: (value: SetStateAction<navCover>) => void;
  stateForm?: EditFormType;
}

const EditSection: React.FC<EditSectionProps> = ({
  onBack,
  currentTemplate,
  setStateForm,
  setCurrentPage,
  stateForm,
}) => (
  <div>
    <PageContent description="สามารถกรอกข้อมูลปกหนังสือพิมพ์ได้ในหน้านี้">
      <PageHeader title="กรอกข้อมูล" onBack={onBack} />
      <EditForm
        currentTemplate={currentTemplate}
        setStateForm={setStateForm}
        setCurrentPage={setCurrentPage}
        initialFormData={stateForm}
      />
    </PageContent>
  </div>
);

export default EditSection;
