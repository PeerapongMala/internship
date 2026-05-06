export interface LessonItemList {
  id: string;
  subject_id: string;
  name: string;
  font_name: string;
  font_size: string;
  background_image_path: string;
  index: number;
  status: string;
  created_at: string; // ISO string format for dates
  created_by: string;
  updated_at?: string | null; // ISO string format, nullable
  updated_by?: string | null;
  admin_login_as?: string | null;
  wizard_index: number;
  monsters: {
    'pre-post-test': string[];
    'sub-lesson-post-test': string[];
    test: string[];
  };
}

export interface LessonEntity {
  id: number;
  subject_id: string;
  subject_name: string;
  year_id: string;
  year_name: string;
  sub_lesson_count: number;
  index: number;
  name: string;
  font_name: string;
  font_size: string;
  background_image_path: string;
  status: string;
  wizard_index: number;
  created_at: string; // ISO string format for dates
  created_by: string;
  updated_at?: string | null; // ISO string format, nullable
  updated_by?: string | null;
  admin_login_as?: string | null;
}

export interface SublessonItemList {
  id: string;
  lesson_id: string;
  indicator_id: string;
  index: number;
  name?: string | null;
  status: string;
  created_at: string; // ISO string format for dates
  created_by: string;
  updated_at?: string | null; // ISO string format, nullable
  updated_by?: string | null;
  admin_login_as?: string | null;
  indicator_name?: string | null;
}

export interface SublessonEntity {
  id: string;
  subject_id: string;
  subject_name: string;
  year_id: string;
  year_name: string;
  level_count: number;
  lesson_id: string;
  index: number;
  indicator_id: string;
  name?: string | null;
  status: string;
  sub_lesson_id?: number;
  sub_lesson_name?: string;
  created_at: string; // ISO string format for dates
  created_by: string;
  updated_at?: string | null; // ISO string format, nullable
  updated_by?: string | null;
  admin_login_as?: string | null;
  levels?: LevelList[];
  levels_by_student?: {
    [key: string]: LevelList[];
  };
  languages?: SublessonLanguageSoundPack;
}

export type SublessonLanguageSoundType = 'th' | 'en' | 'zh';

export type SublessonLanguageSoundPack = {
  [language in SublessonLanguageSoundType]?:
    | 'DOWNLOADED'
    | 'PARTIAL' // Some assets failed to download but level is still playable
    | 'PENDING'
    | 'UNDOWNLOADED'
    | 'DISABLED'
    | (string & {});
};

export interface Subject {
  id: string;
  name: string;
  year: string;
}

export interface LevelList {
  id: number;
  level: number;
  difficulty: string;
  question_count: number;
  star: number | null;
  time_used: string | null;
  status: 'lock' | 'unlock';
  game_reward?: GameRewardList[] | null;
  gold_coin?: string | null;
  arcade_coin?: string | null;
}

export interface GameRewardList {
  id: number;
  type: string;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: string;
}

// level & questions
export type Language = 'en' | 'th' | 'zh';

export interface SpeechToTextRequest {
  audio_file: File;
  language: string;
}

export interface SpeechToTextDataResponse {
  transcript: string;
}

export interface QuestionsDataResponse extends QuestionDetails {}

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
}

export type HintType = 'none' | 'count' | 'pre-post-count' | 'prepost';

export interface QuestionDetails {
  id: number;
  index: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  timer_type: 'warn' | 'end' | 'no';
  timer_time: number;
  layout: string;
  choice_position: 'right' | 'bottom';
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
  questions?: QuestionDetails[];
}

export interface MonsterItemList {
  id: number;
  image_path: string;
  lesson_id: number;
  level_type: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
}

export interface SubLessonCheck {
  sub_lesson_id: number;
  updated_at: string;
}
