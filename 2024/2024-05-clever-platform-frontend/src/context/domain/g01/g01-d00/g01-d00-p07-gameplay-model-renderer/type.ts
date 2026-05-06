import { UserWithPinDataResponse } from '@domain/g02/g02-d01/local/type';

export enum StateFlow {
  Gameplay = 0,
  Answer = 1,
  Reason = 2,
  Finish = 3,
}

export enum Alignment {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface AnswerProps {
  id: number;
  index: number;
  choice?: string;
  answer: string;
  disabled?: boolean;
  selected?: boolean;
  isCorrect?: boolean;
  imageUrl?: string;
  speechUrl?: string | null;
  group_indexes?: number[];
  answer_indexes?: number[];
}

export interface ItemType extends AnswerProps {
  id: number;
}

export interface GroupType {
  id: number;
  index: number;
  groupName: string;
  groupDetails: string[];
}

export interface QuestionListProps {
  id: number;
  index: number;
  text: string;
  answerInput?: string;
  speechUrl?: string;
  answers: AnswerPlaceholderProps[];
}

export interface GameConfig {
  questionId: number;
  questionType?: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  position?: '1' | '2';
  levelType?:
    | 'test'
    | 'sub-lesson-post-test'
    | 'pre-post-test'
    | 'pre-test'
    | 'post-test';
  timerType?: 'warn' | 'end' | 'no';
  timerTime?: number;
  layout?: string;
  columnRight?: number;
  columnBottom?: number;
  topic?: string;
  question?: string;
  questionList?: QuestionListProps[];
  questionImage?: string;
  hint?: string;
  hintSound?: string | null;
  hintType?: HintType;
  hintImage?: string;
  patternAnswer?: string;
  patternGroup?: string;
  answerType?: 'text-speech' | 'image' | 'speech';
  answerList?: AnswerProps[];
  inputType?: 'text' | 'speech';
  groupList?: GroupType[];
  canReuseChoice?: boolean;
  answerCorrectText?: string;
  answerWrongText?: string;
  useSoundDescriptionOnly?: boolean;
  questionSound?: string | null;

  // sort
  itemsInDrop?: ItemType[];
}

export interface AnswerPlaceholderProps {
  id: number;
  index: number;
  type?: string;
  answerInput?: string;
  text: { index: number; choice_index: number; text?: string }[];
}

export interface GameplayStatusBarProps {
  totalTime: number;
  timeLeft: number;
}

export interface QuestionProps {
  title: string;
  onHintClick: () => void;
  children: React.ReactNode;
  text?: string;
  disableHint?: boolean;
  useSoundDescriptionOnly?: boolean;
  descriptionSoundUrl?: string;
}

export interface AnswerContainerProps {
  questionType?: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  dataList?: Array<{
    id: number;
    index: number;
    choice?: string;
    answer: string;
    disabled?: boolean;
    image?: string;
  }>;
  colPerRow?: number;
  pattern?: string;
  answerType?: 'text-speech' | 'image' | 'speech';
  handleChange?: HandleChange;
  isDragging?: boolean;
  handleTouchEnd?: (position: { x: number; y: number }) => void;
  currentElementDraging?: HTMLElement | null;
  draggable?: boolean;
}

export interface LayoutContainerProps {
  alignment: Alignment;
  flex: number[];
  className?: string;
  children: React.ReactNode;
}

export interface QuestionAndAnswerProps {
  gameConfig: GameConfig;
  handleHint: (question: string) => void;
  handleZoom: (img: string) => void;
  handleChange?: HandleChange;
}

export interface HandleChange {
  (key: string, value: string): void;
}

export interface QuestionSubmitData {
  question_id: number;
  question_type: 'input' | 'multiple-choices' | 'sorting' | 'pairing' | 'placeholder';
  is_correct: boolean;
  time_used: number;
  data: QuestionSubmitDataDetail[];
}

export type QuestionSubmitDataDetail =
  | InputAnswerSubmitData
  | MultipleChoiceSubmitData
  | SortSubmitData
  | GroupSubmitData
  | PlaceholderSubmitData;

export interface InputAnswerSubmitData {
  question_input_answer_id: number;
  answer_index: number;
  answer: string;
}

export interface MultipleChoiceSubmitData {
  question_multiple_choice_text_choice_id?: number;
  question_multiple_choice_image_choice_id?: number;
}

export interface SortSubmitData {
  question_sort_text_choice_id: number;
  index: number;
}

export interface GroupSubmitData {
  question_group_choice_id: number;
  question_group_group_id: number;
}

export interface PlaceholderSubmitData {
  question_placeholder_answer_id: number;
  question_placeholder_text_choice_id: number;
}

export interface LevelSubmitData {
  homework_id?: number;
  star: number;
  time_used: number;
  played_at: string;
  admin_login_as?: string;
  questions: QuestionSubmitData[];
  level_id: number;
  uniqueId: string;
  admin_id?: string;

  status?: {
    status_code: number;
    message: string;
  };
}

export interface LevelSubmitDataWithLevelId {
  [uuid: string]: {
    results: LevelSubmitData[] | undefined;
    user: UserWithPinDataResponse;
    lastestLogin: string;
    isUpload: boolean;
  };
}

export interface LevelSubmitDataResponse {
  [uuid: string]: {
    result: {
      uniqueId: string;
      levelId: number;
      status_code: number;
      message: string;
    }[];
  };
}

// export enum Language {
//   en = 'en',
//   zh = 'zh',
//   th = 'th',
// }

export enum LevelTypeEnum {
  'test' = 'level_type.test',
  'sub-lesson-post-test' = 'level_type.sub-lesson-post-test',
  'pre-post-test' = 'level_type.pre-post-test',
  'pre-test' = 'level_type.pre-test',
  'post-test' = 'level_type.post-test',
}

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
  language?: Language;
}

export type HintType = 'none' | 'count' | 'pre-post-count' | 'prepost';

export interface QuestionDetails {
  id: number;
  index: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
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
