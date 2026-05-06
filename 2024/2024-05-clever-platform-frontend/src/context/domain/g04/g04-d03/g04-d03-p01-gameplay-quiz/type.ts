import { UserWithPinDataResponse } from '@domain/g02/g02-d01/local/type';
import { HintType } from '../local/type';

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

export interface answerProps {
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

export interface ItemType extends answerProps {
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
  questionType?:
    | 'multiple-choices'
    | 'pairing'
    | 'sorting'
    | 'placeholder'
    | 'input'
    | 'learn';
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
  answerList?: answerProps[];
  inputType?: 'text' | 'speech';
  groupList?: GroupType[];
  canReuseChoice?: boolean;
  answerCorrectText?: string;
  answerWrongText?: string;
  useSoundDescriptionOnly?: boolean;
  questionSound?: string | null;

  // sort
  itemsInDrop?: ItemType[];

  text?: string;
  url?: string;
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
  gameConfig?: GameConfig;
}

export interface AnswerContainerProps {
  questionType?:
    | 'multiple-choices'
    | 'pairing'
    | 'sorting'
    | 'placeholder'
    | 'input'
    | 'learn';
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
  handleZoom?: (img: string) => void;
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
  question_type:
    | 'input'
    | 'multiple-choices'
    | 'sorting'
    | 'pairing'
    | 'placeholder'
    | 'learn';
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
