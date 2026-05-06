import {
  AcademicLevelDifficulty,
  AcademicLevelStatusType,
  AcademicLevelType,
  LanguageType,
  TextChoice,
  Translation,
  TranslationChoice,
  Translations,
} from '../type';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import Swal from 'sweetalert2';

dayjs.extend(buddhistEra);

const statusColors: { [key in keyof typeof AcademicLevelStatusType]: string } = {
  setting: 'badge-outline-warning',
  question: 'badge-outline-secondary',
  translation: 'badge-outline-primary',
  speech: 'badge-outline-info',
  enabled: 'badge-outline-success',
  disabled: 'badge-outline-danger',
};

const convertDataToOptions = (data: any[], labelKey?: string) => {
  return data.map((item) => {
    return {
      label: labelKey ? item[labelKey] : item.name,
      value: item.id,
    };
  });
};

const convertRowsColumns = (text: string) => {
  if (!text) return '-';

  const isColumns = text.includes('columns') || text.includes('col');
  const isRows = text.includes('rows') || text.includes('row');

  if (isColumns) {
    if (text.includes('columns')) {
      const columns = text.split(' ')[0];
      return `${columns}-col`;
    } else {
      const columns = text.split('-')[0];
      return `${columns} columns`;
    }
  }

  if (isRows) {
    if (text.includes('rows')) {
      const rows = text.split(' ')[0];
      return `${rows}-row`;
    } else {
      const rows = text.split('-')[0];
      return `${rows} rows`;
    }
  }

  return '-';
};

const convertIdToThreeDigit = (id: number) => {
  if (!id) return '-';
  return id?.toString().padStart(3, '0');
};

const convertTime = (time: string) => {
  if (!time) return '-';

  const date = dayjs(time).locale('th');
  return date.format('DD MMM BBBB HH:mm');
};

const getStatus = (status: keyof typeof AcademicLevelStatusType) => {
  const label = AcademicLevelStatusType[status] || status;
  const colorClass = statusColors[status] || 'badge-outline-info';
  return <span className={`badge ${colorClass}`}>{label || 'แบบร่าง'}</span>;
};

const showToast = (title: string, isSuccess: boolean) => {
  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
    customClass: {
      popup: isSuccess ? 'color-success' : 'color-danger',
    },
  });

  toast.fire({
    title,
  });
};

const getFileDataUrl = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };

    reader.readAsDataURL(file);
  });
};

const mapAnswers = (
  answers: TranslationChoice[],
  mainLanguage: LanguageType,
  questionType?: string,
) => {
  const newAnswers = answers.map((item) => {
    const answer = item?.translations
      ? Object.entries(item.translations).reduce((acc, [key, value]) => {
          acc[key] = { text: value.text } as Translation;
          return acc;
        }, {} as Translations)
      : {};

    const answerObject: {
      index: number;
      id: string;
      value?: string;
      point?: number | null;
      group_indexes?: number[];
      answer_indexes?: number[];
      image_url?: string;
      image_key?: string;
    } = {
      index: item.index,
      id: item.saved_text_group_id,
      // value: answer?.[mainLanguage],
      value: getTranslation(answer, mainLanguage, 'text'),
      point: item.point,
      group_indexes: item.group_indexes,
      answer_indexes: item.answer_indexes,
      image_url: item?.image_url,
      image_key: item?.image_key,
    };

    if (!answerObject.image_url) {
      delete answerObject.image_url;
    }
    if (!answerObject.image_key) {
      delete answerObject.image_key;
    }
    return answerObject;
  });

  return newAnswers;
};

const isTranslationChoiceArray = (choices: any[]): choices is TranslationChoice[] => {
  return choices.every(
    (choice) => 'saved_text_group_id' in choice && 'translations' in choice,
  );
};

const isTextChoiceArray = (choices: any[]): choices is TextChoice[] => {
  return choices.every(
    (choice) => 'text' in choice && !('saved_text_group_id' in choice),
  );
};

const getTranslation = (
  translations: Translations | undefined,
  mainLanguage: LanguageType,
  key: keyof Translation,
): string => {
  if (!translations) return '';

  const fallbackLanguages = ['th', 'en', 'zh'];
  const languages = [mainLanguage, ...fallbackLanguages];

  for (const lang of languages) {
    if (lang && translations[lang] && key) {
      return translations[lang][key] || '';
    }
  }

  return '';
};

export {
  convertDataToOptions,
  convertRowsColumns,
  convertIdToThreeDigit,
  convertTime,
  getStatus,
  showToast,
  getFileDataUrl,
  mapAnswers,
  isTranslationChoiceArray,
  isTextChoiceArray,
  getTranslation,
};
