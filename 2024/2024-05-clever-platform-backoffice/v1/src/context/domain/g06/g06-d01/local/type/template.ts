import { EStatusTemplate, Subjects } from '../api/type';

export type TGeneralTemplates = {
  template_id?: number;
  template_type: string;
  template_name: string;
  general_template_id?: number | null;
};

export type TTemplate = {
  general_templates: TGeneralTemplates[];
  template_name: string;
  year: string;
  subjects: Subjects[];
  id?: number;
  school_id: number;
  active_flag: boolean;
  version?: string | null;
  status: EStatusTemplate;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
  admin_login_as?: string | null;
};
