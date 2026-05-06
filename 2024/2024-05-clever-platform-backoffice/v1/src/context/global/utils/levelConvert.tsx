import {
  AcademicLevelDifficulty,
  AcademicLevelType,
  QuestionType,
} from '@domain/g02/g02-d05/local/type';

const getLevelType = (levelType?: keyof typeof AcademicLevelType) => {
  if (!levelType) return '-';
  const label = AcademicLevelType[levelType] || levelType;
  return label;
};

const getQuestionType = (questionType?: keyof typeof QuestionType) => {
  if (!questionType) return '-';
  const label = QuestionType[questionType] || questionType;
  return label;
};

const getDifficulty = (difficulty: keyof typeof AcademicLevelDifficulty) => {
  const difficultyColors: {
    [key in keyof typeof AcademicLevelDifficulty]: string;
  } = {
    easy: 'badge-outline-success',
    medium: 'badge-outline-warning',
    hard: 'badge-outline-danger',
  };
  const label = AcademicLevelDifficulty[difficulty] || difficulty;
  const colorClass = difficultyColors[difficulty] || 'badge-outline-info';
  return <span className={`badge ${colorClass}`}>{label}</span>;
};

export { getLevelType, getQuestionType, getDifficulty };
