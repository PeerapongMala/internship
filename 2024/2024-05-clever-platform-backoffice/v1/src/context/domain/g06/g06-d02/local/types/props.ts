import { TEvaluationForm, TEvaluationFormCreate, TEvaluationFormEdit } from './grade';

export type TEvaluationSelectProps = {
  disabledEdit?: boolean;
  value?: string | number | readonly string[];
  isSubmitStep?: boolean;
  name?: keyof TEvaluationForm;
  defaultValue?: string | number | readonly string[];
  onChange?: (value: string | number | readonly string[]) => void;
};
export type TEvaluationFormOnChange = (
  key: keyof TEvaluationFormCreate | TEvaluationFormEdit,
  value: string | number | readonly string[] | undefined,
) => void;
