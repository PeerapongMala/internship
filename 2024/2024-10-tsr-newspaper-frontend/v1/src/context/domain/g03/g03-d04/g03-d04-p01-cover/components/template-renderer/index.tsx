import { ComponentType } from 'react';
import { CreateCoverForm } from '@domain/g03/g03-d04/local/api/restapi/cover-newspaper';
import { EditFormType } from '../edit-form';
import Template1 from '../template1';
import Template2 from '../template2';

interface TemplateRendererProps {
  templateId?: number;
  stateForm?: EditFormType;
  onSave: (formData: CreateCoverForm) => Promise<void>;
  onCancel: () => void;
}

type TemplateConfig = {
  Component: ComponentType<{
    stateForm: EditFormType;
    onSave: (previewImage: string) => Promise<void>; // แก้ไข type ของ onSave
    onCancel: () => void;
  }>;
  getFormData: (stateForm: EditFormType) => CreateCoverForm;
};

type TemplatesType = {
  [key: number]: TemplateConfig;
};

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  stateForm,
  onSave,
  onCancel,
}) => {
  if (!stateForm || !templateId) {
  
    return null;
  }

  const templates: TemplatesType = {
    1: {
      Component: Template1,
      getFormData: (form: EditFormType): CreateCoverForm => ({
        public_date: form.public_date,
        param: 'template 1',
        template: 'template 1',
        preview_files: form.images[1]!,
      }),
    },
    2: {
      Component: Template2,
      getFormData: (form: EditFormType): CreateCoverForm => ({
        public_date: form.public_date,
        param: 'template 2',
        template: 'template 2',
        preview_files: form.images[1]!,
      }),
    },
  };

  const selectedTemplate = templates[templateId];
  if (!selectedTemplate) {
    console.log('Template not found:', templateId);
    return null;
  }

  const { Component, getFormData } = selectedTemplate;

  return (
    <Component
      stateForm={stateForm}
      onSave={async (previewImage: string) => {
        const formData = getFormData(stateForm);

        const base64ToFile = async (dataUrl: string) => {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          return new File([blob], `preview-${Date.now()}.png`, { type: 'image/png' });
        };

        const previewFile = await base64ToFile(previewImage);
        const updatedFormData = {
          ...formData,
          files: previewFile,
          preview_files: previewFile,
        };

        await onSave(updatedFormData);
      }}
      onCancel={onCancel}
    />
  );
};

export default TemplateRenderer;
