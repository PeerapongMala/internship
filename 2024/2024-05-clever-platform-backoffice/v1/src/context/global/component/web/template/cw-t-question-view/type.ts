import { QuestionStringType } from '@domain/g02/g02-d05/local/type';

export interface LevelPlayLogMultipleChoicesAnswer {
  text_choice_id: number;
  text_choice_index: number;
}

export interface LevelPlayLogPairingAnswer {
  choice_id: number;
  choice_index: number;
  group_id: number;
  group_index: number;
}

export interface LevelPlayLogSortingAnswer {
  choice_id: number;
  choice_index: number;
  answer_index: number;
}

export interface LevelPlayLogPlaceholderAnswer {
  choice_id: number;
  choice_index: number;
  description_id: number;
  description_index: number;
  answer_id: number;
  answer_index: number;
}

export interface LevelPlayLogInputAnswer {
  description_id: number;
  description_index: number;
  answer_id: number;
  answer_index: number;
  answer: string;
}

export interface LevelPlayLogItem {
  question_id: number;
  question_index: number;
  question_type: QuestionStringType;
  is_correct: boolean;
  time_used: number;
  answer:
    | LevelPlayLogMultipleChoicesAnswer
    | LevelPlayLogPairingAnswer[]
    | LevelPlayLogSortingAnswer[]
    | LevelPlayLogPlaceholderAnswer[]
    | LevelPlayLogInputAnswer[];
}
