export type Language = 'en' | 'th' | 'zh';

export interface SpeechToTextRequest {
  audio_file: File;
  language: string;
}

export interface SpeechToTextDataResponse {
  transcript: string;
}

export interface QuestionsDataResponse extends QuestionDetails { }

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
  id?: number;
  index: number;
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

export interface TextChoice {
  id: number;
  index: number;
  text: string;
  is_correct: boolean;
}

export interface AnswerPlaceholderProps {
  id: number;
  index: number;
  answerText: string;
  type?: string;
  text: { index: number; choice_index: number; text?: string }[];
}

export interface QuestionDescriptions {
  id: number;
  index: number;
  text: string;
  speech_url: string;
  answers: AnswerPlaceholderProps[];
  language?: Language;
}

export type HintType = 'none' | 'count' | 'pre-post-count' | 'prepost';

export interface QuestionDetails {
  id: number;
  index: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input' | 'learn';
  level_type?: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
  timer_type: 'warn' | 'end' | 'no';
  timer_time: number;
  layout: string;
  choice_position: '1' | '2';
  left_box_columns: string; // Answer
  bottom_box_columns: string; // Group
  command_text: TextTranslation;
  choice_type: 'text-speech' | 'image' | 'speech';
  correct_choice_amount: string;
  max_point: number;
  description_text: TextTranslation;
  hint_text: TextTranslation;
  text_choices: TranslationChoice[] | TextChoice[];
  correct_text: TextTranslation;
  wrong_text: TextTranslation;
  enforce_choice_language: boolean;
  enforce_description_language: boolean;
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

  // input
  input_type?: 'text' | 'speech';

  isCorrect?: boolean;

  text?: string; // learn
  url?: string; // learn
  topic?: string; // learn
}

export interface LanguageDetails {
  subject_language_type: string;
  language: string;
  translations: string[];
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

export interface TagGroup {
  id: number;
  index: number;
  name: string;
  tags: string[];
}

export interface Standard {
  learning_area_name: string;
  criteria_name: string;
  criteria_short_name: string;
  indicator_name: string;
  indicator_short_name: string;
}

export interface LevelDetails {
  id: number;
  sub_lesson_id: number;
  index: number;
  bloom_type: 1 | 2 | 3 | 4 | 5;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  level_type: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
  difficulty: 'easy' | 'medium' | 'hard';
  lock_next_level: boolean;
  timer_type: 'warn' | 'end' | 'no';
  timer_time: number;
  status: 'setting' | 'question' | 'translation' | 'speech' | 'enabled' | 'disabled';
  wizard_index: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string | null;
  question_count: number;
  language: LanguageDetails;
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
  questionList?: QuestionDetails[];
}

export interface QueryId {
  lessonId: string;
  sublessonId: string;
  levelId: string;
  questionId: string;
}

export type fontFamily = 'Noto Sans Thai' | 'San' | 'latin';
export type fontSize = '14pt' | '16pt' | '20pt' | '24pt' | '40pt';


export type TSublessonMeta = {
  lesson_id?: number;
  sub_lesson_id?: number;
  lesson_name?: string;
  sub_lesson_name?: string;
  subject_id?: number;
  subject_name?: string;
  subject_group_id?: number;
  subject_group_name?: string;
  year_id?: number;
  year_name?: string;
  platform_id?: number;
  platform_name?: string;
  curriculum_group_id?: number;
  curriculum_group_name?: string;
};