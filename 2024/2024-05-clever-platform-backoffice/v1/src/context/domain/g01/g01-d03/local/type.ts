export interface TranslateTextRecord {
  id: number;
  saved_text_group_id: string;
  language: string;
  text: string;
  text_to_ai: string;
  speech_url: string;
  updated_at: string;
  updated_by: string;
  status: 'enabled' | 'disabled' | 'draft';
}

export interface TranslateTextAny {
  [key: string]: any;
}

export interface Translation {
  language: string;
  text: string;
  text_to_ai?: string | null;
  speech_url?: string | null;
}

export interface Translations {
  [key: string]: Translation;
}

export interface TextTranslation {
  saved_text_group_id: string;
  translations: Translations;
}

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface ICurriculum {
  id: number;
  name: string;
  short_name: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export enum TranslateTextStatusType {
  enabled = 'ใช้งาน',
  disabled = 'ไม่ใช้งาน',
  draft = 'แบบร่าง',
}
