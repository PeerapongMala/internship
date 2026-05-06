import { EStatusTemplate } from '../type';

export type TPatchUpdateTemplateReq = {
  template: {
    school_id?: number;
    year?: string;
    template_name?: string;
    active_flag?: boolean;
    version?: string | null;
    status?: EStatusTemplate;
  };
};
