// Enums
export enum AcademicLevelStatus {
  'setting' = 'ตั้งค่าด่าน',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export enum AcademicLevelStatusType {
  'setting' = 'ตั้งค่าด่าน',
  'question' = 'จัดการคำถาม',
  'translation' = 'แปลภาษา',
  'speech' = 'สร้างเสียง',
  'enabled' = 'เผยแพร่',
  'disabled' = 'ไม่ใช้งาน',
}

export enum AcademicLevelDifficulty {
  'easy' = 'ง่าย',
  'medium' = 'ปานกลาง',
  'hard' = 'ยาก',
}

export enum AcademicLevelType {
  'test' = 'แบบฝึกหัด',
  'sub-lesson-post-test' = 'แบบฝึกหัดท้ายบทเรียนย่อย',
  'pre-post-test' = 'แบบฝึกหัดก่อนเรียน',
}

export enum QuestionType {
  'multiple-choices' = 'คำถามปรนัย (Multiple Choices)',
  'pairing' = 'คำถามแบบจับคู่ (Pairing)',
  'sorting' = 'คำถามแบบเรียงลำดับ (Sorting)',
  'placeholder' = 'คำถามแบบมีตัวเลือก (Placeholder)',
  'input' = 'คำถามแบบเติมคำ (Input)',
  'boss' = 'คำถามแบบผสม (Boss)',
}

// Interfaces
export interface AcademicLevel {
  [key: string]: any;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_name?: string;
  indicator_name?: string;
  indicator_short_name?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface AcademicLevelLanguage {
  subject_language_type: string;
  language: LanguageType;
  translations: string[];
}

export interface AnswerProps {
  choice?: string;
  value?: string;
  id?: string;
}

export interface AnswerPlaceholderProps {
  index: number;
  answerText: string;
  type?: string;
  text: { index: number; choice_index: number; text?: string }[];
}

export interface QuestionListProps {
  text: string;
  answerList: { [key: string]: AnswerProps[] };
}

export interface Image {
  dataURL: string;
  file?: File;
  image_key?: string;
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

export interface TextTranslationIndex extends TextTranslation {
  index: number;
}

export interface TextChoice {
  id: number;
  index: number;
  text: string;
  is_correct: boolean;
}

export interface ImageChoices {
  index: number;
  image_url: string;
  is_correct: boolean;
  point: number | null;
}

export interface TranslationChoice {
  id: number;
  index: number;
  is_correct: boolean;
  point: number | null;
  saved_text_group_id: string;
  translations: Translations;
  image_url: string;
  image_key: string;
  group_indexes?: number[];
  answer_indexes?: number[];
}

export interface Question {
  id: number;
  index: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  timer_type: 'warn' | 'end' | 'no';
  timer_time: number;
  layout: string;
  choice_position: string;
  left_box_columns: string; // Answer
  bottom_box_columns: string; // Group
  command_text: TextTranslation;
  choice_type: string;
  correct_choice_amount: string;
  max_point: number;
  description_text: TextTranslation;
  hint_text: TextTranslation;
  text_choices: TranslationChoice[] | TextChoice[];
  correct_text: TextTranslation;
  wrong_text: TextTranslation;
  enforce_choice_language: boolean;
  enforce_description_language: boolean;
  questionSound: string;
  use_sound_description_only: boolean;
  image_choices: TranslationChoice[];
  image_description_url: string;
  image_hint_url: string;
  can_reuse_choice?: boolean;

  // pairing
  group_amount?: number;
  choice_amount?: number;
  dummy_amount?: number;
  groups?: TextTranslationIndex[];

  // placeholder
  descriptions?: QuestionDescriptions[];
  hint_type?: HintType;

  input_type?: QuestionInputType;
}

export interface TranslationText {
  index?: number;
  id: string;
  value?: string;
  image_url?: string;
  image_key?: string;
  file?: Image;
  point?: number | null;
  group_indexes?: number[];
  answer_indexes?: number[];
  speechUrl?: string;
}

export interface TranslationTextQuestion {
  index: number;
  value: string;
  answerList: AnswerPlaceholderProps[];
}

export interface TranslationTextGroup extends TranslationText {
  choices?: number[];
}

export type ModalTranslate = (params: {
  show: boolean;
  callback: (id: string, value: string) => void;
  selected?: string | undefined;
}) => void;

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface TranslateObject {
  group_id: string;
  saved_text_group_id?: string;
  translations: {
    [key: string]: {
      language: string;
      text: string;
      text_to_ai: string;
      speech_url: string;
    };
  };
}

// "none" | "count" | "pre-post-count" | "prepost"
export type HintType = 'none' | 'count' | 'pre-post-count' | 'prepost';

export type QuestionInputType = 'text' | 'speech';

export type LanguageType = 'th' | 'en' | 'zh';

export type QuestionStringType =
  | 'multiple-choices'
  | 'pairing'
  | 'sorting'
  | 'placeholder'
  | 'input';

export interface QuestionDescriptions {
  index: number;
  text: string;
  speech_url: string;
  saved_text_group_id?: string;
  language?: LanguageType;
  answers: AnswerPlaceholderProps[];
}

export interface AcademicTranslation {
  [key: string]: any;
}

export interface RowData {
  id: number;
  key: string;
  saved_text_group_id: string;
  answer?: string;
  topic?: string;
  speech_url_th?: string;
  speech_url_en?: string;
  speech_url_zh?: string;
  language_th: string;
  language_en: string;
  language_zh: string;
  text_to_ai_th?: string;
  text_to_ai_en?: string;
  text_to_ai_zh?: string;
  [key: string]: unknown;
}

export interface TextDataTranslation {
  saved_text_group_id: string;
  src_text: string;
  src_language: string;
  dest_languages: string[];
}

export interface TextSaveDataTranslation {
  saved_text_group_id: string;
  thai_text?: string;
  english_text?: string;
  chinese_text?: string;
  admin_login_as?: string;
}

export interface TextDataTranslationSound {
  saved_text_group_id: string;
  language: string;
  text_to_ai: string;
  admin_login_as?: string;
}

// Constants
export const optionTimerBetweenPlay = [
  { value: 'warn', label: 'จับเวลา สามารถเล่นต่อได้ถ้าหมดเวลา' },
  { value: 'end', label: 'จับเวลา ไม่สามารถเล่นต่อได้ถ้าหมดเวลา' },
  { value: 'no', label: 'ไม่นับเวลา' },
];

export const optionTimerBetweenPlaySecond = [
  { value: '30', label: '30' },
  { value: '60', label: '60' },
  { value: '90', label: '90' },
];

export const optionTimerBetweenPlayWithDefault = [
  { value: 'default', label: 'ค่าเริ่มต้น' },
  ...optionTimerBetweenPlay,
];

export const optionQuestionType = [
  { value: 'multiple-choices', label: 'คำถามปรนัย (Multiple Choices)' },
  { value: 'pairing', label: 'คำถามแบบจับคู่ (Pairing)' },
  { value: 'sorting', label: 'คำถามแบบเรียงลำดับ (Sorting)' },
  { value: 'placeholder', label: 'คำถามแบบมีตัวเลือก (Placeholder)' },
  { value: 'input', label: 'คำถามแบบเติมคำ (Input)' },
];

export const HintTypeOptions = [
  {
    value: 'none',
    label: 'ไม่แสดงคำใบ้เลย เช่น Ann: Good Morning, ______ do you do?',
  },
  {
    value: 'count',
    label: 'แสดงจำนวนตัวอักษรของคำตอบ เช่น Ann: Good Morning, ___(3)___ do you do?',
  },
  {
    value: 'pre-post-count',
    label:
      'แสดงจำนวนตัวอักษรของคำตอบ และตัวอักษรหัวท้าย เช่น Ann: Good Morning, H__(1)_w do you do?',
  },
  {
    value: 'prepost',
    label: 'แสดงตัวอักษรหัวท้ายของคำตอบ เช่น Ann: Good Morning, H____w do you do?',
  },
];

export interface Language {
  subject_language_type: string;
  language: LanguageType;
  translations: LanguageType[];
}

export interface SubCriteriaTopic {
  id: number;
  name: string;
  short_name: string;
}

export interface SubCriteria {
  id: number;
  index: number;
  name: string;
  sub_criteria_topics: SubCriteriaTopic[];
}

export interface Tag {
  // Define the structure of tags if needed
}

export interface TagGroup {
  id: number;
  index: number;
  name: string;
  tags: Tag[];
}

export interface Standard {
  learning_area_name: string;
  criteria_name: string;
  criteria_short_name: string;
  learning_content_name?: string; // New field
  indicator_name: string;
  indicator_short_name: string;
}

export interface LevelItem {
  id: number;
  sub_lesson_id: number;
  index: number;
  bloom_type: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  level_type: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
  difficulty: 'easy' | 'medium' | 'hard';
  lock_next_level: boolean;
  timer_type: string;
  timer_time: number;
  status: 'setting' | 'question' | 'translation' | 'speech' | 'enabled' | 'disabled';
  wizard_index: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string | null;
  question_count: number;
  language: Language;
  sub_criteria: SubCriteria[];
  tag_groups: TagGroup[];
  standard: Standard;
  curriculum_group_id: number;
  curriculum_group_name: string;
  year_id: number;
  year_name: string;
  subject_group_id: number;
  subject_group_name: string;
  subject_id: number;
  subject_name: string;
  lesson_id: number;
  lesson_name: string;
  sub_lesson_name: string;
  questions: any; // Define the structure of questions if needed
}
