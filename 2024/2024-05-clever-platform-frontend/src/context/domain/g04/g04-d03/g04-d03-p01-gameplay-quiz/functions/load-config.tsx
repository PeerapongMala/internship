import {
  Language,
  QuestionDetails,
  TextChoice,
  Translation,
  TranslationChoice,
  Translations,
} from '../../local/type';
import { AnswerPlaceholderProps, GameConfig } from '../type';

const loadGameConfig = (
  question: QuestionDetails,
  textLanguage: Language,
  soundLanguage: Language,
  levelLanguage: Language,
) => {
  const questionType: GameConfig['questionType'] = question.question_type;
  const answerList: GameConfig['answerList'] = [];
  const answerType: GameConfig['answerType'] = question.choice_type;

  if (answerType === 'text-speech' || answerType === 'speech') {
    if (questionType === 'placeholder') {
      const textChoice: TextChoice[] = question.text_choices as TextChoice[];

      textChoice.forEach((choice) => {
        answerList.push({
          id: choice.id,
          index: choice.index,
          answer: choice.text,
          isCorrect: choice.is_correct,
          group_indexes: [],
          answer_indexes: [],
        });
      });
    } else {
      const textChoice: TranslationChoice[] =
        question.text_choices as TranslationChoice[];

      const textChoiceCorrect = textChoice
        .filter((choice) => choice.is_correct)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      const textChoiceWrong = textChoice.filter((choice) => !choice.is_correct);

      let lastAnswerIndex = 0;
      textChoiceCorrect.forEach((choice) => {
        lastAnswerIndex += choice.index + 1;
        answerList.push({
          id: choice.id,
          index: choice.index,
          answer: getTranslation(
            choice.translations,
            textLanguage,
            levelLanguage,
            'text',
          ),
          speechUrl: getTranslation(
            choice.translations,
            soundLanguage,
            levelLanguage,
            'speech_url',
          ),
          isCorrect: true,
          group_indexes: choice?.group_indexes || [],
          answer_indexes: choice?.answer_indexes || [],
        });
      });

      textChoiceWrong.forEach((choice, index) => {
        answerList.push({
          id: choice.id,
          index: lastAnswerIndex + index,
          answer: getTranslation(
            choice.translations,
            textLanguage,
            levelLanguage,
            'text',
          ),
          speechUrl: getTranslation(
            choice.translations,
            soundLanguage,
            levelLanguage,
            'speech_url',
          ),
          isCorrect: false,
          group_indexes: choice?.group_indexes || [],
          answer_indexes: choice?.answer_indexes || [],
        });
      });
    }
  } else if (answerType === 'image') {
    const imageChoice: TranslationChoice[] =
      question.image_choices as TranslationChoice[];

    const imageChoiceCorrect = imageChoice
      .filter((choice) => choice.is_correct)
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const imageChoiceWrong = imageChoice.filter((choice) => !choice.is_correct);

    let lastAnswerIndex = 0;
    imageChoiceCorrect.forEach((choice) => {
      lastAnswerIndex += choice.index + 1;
      answerList.push({
        id: choice.id,
        index: choice.index,
        answer: '',
        imageUrl: choice.image_url,
        isCorrect: true,
        group_indexes: choice?.group_indexes || [],
        answer_indexes: choice?.answer_indexes || [],
      });
    });

    imageChoiceWrong.forEach((choice, index) => {
      answerList.push({
        id: choice.id,
        index: lastAnswerIndex + index,
        answer: '',
        imageUrl: choice.image_url,
        isCorrect: false,
        group_indexes: choice?.group_indexes || [],
        answer_indexes: choice?.answer_indexes || [],
      });
    });
  }

  const groupList: GameConfig['groupList'] = [];
  if (question.groups) {
    question.groups.forEach((group) => {
      groupList.push({
        id: group?.id || -1,
        index: group.index,
        groupName: getTranslation(
          group.translations,
          textLanguage,
          levelLanguage,
          'text',
        ),
        groupDetails: [],
      });
    });
  }

  const questionList: GameConfig['questionList'] = [];
  if (question.descriptions) {
    question.descriptions.forEach((description) => {
      questionList.push({
        id: description.id,
        index: description.index,
        text: description.text,
        answers: cleansingAnswer(description.answers),
        // speechUrl:
        //   description.language === soundLanguage ? description.speech_url : undefined,
        speechUrl: description.speech_url,
      });
    });
  }

  const questionId: GameConfig['questionId'] = question.id;
  const inputType: GameConfig['inputType'] = question.input_type;
  const timerType: GameConfig['timerType'] = question.timer_type;
  const timerTime: GameConfig['timerTime'] = question.timer_time;
  const layout: GameConfig['layout'] = question.layout;
  const position: GameConfig['position'] = question.choice_position;
  const patternAnswer: GameConfig['patternAnswer'] = convertRowsColumns(
    question.left_box_columns,
  );
  const patternGroup: GameConfig['patternGroup'] = convertRowsColumns(
    question.bottom_box_columns,
  );
  const canReuseChoice: GameConfig['canReuseChoice'] = question.can_reuse_choice;
  const questionText: GameConfig['question'] = getTranslation(
    question.description_text?.translations,
    textLanguage,
    levelLanguage,
    'text',
  );
  const questionSound = getTranslation(
    question.description_text?.translations,
    soundLanguage,
    levelLanguage,
    'speech_url',
  );
  const questionImage: GameConfig['questionImage'] = question.image_description_url;
  const topic: GameConfig['topic'] = getTranslation(
    question.command_text?.translations,
    textLanguage,
    levelLanguage,
    'text',
  );
  const hint: GameConfig['hint'] = getTranslation(
    question.hint_text?.translations,
    textLanguage,
    levelLanguage,
    'text',
  );
  const hintSound: GameConfig['hintSound'] = getTranslation(
    question.hint_text?.translations,
    soundLanguage,
    levelLanguage,
    'speech_url',
  );
  const hintType: GameConfig['hintType'] = question.hint_type;
  const hintImage: GameConfig['hintImage'] = question.image_hint_url;
  const answerCorrectText: GameConfig['answerCorrectText'] = getTranslation(
    question.correct_text?.translations,
    textLanguage,
    levelLanguage,
    'text',
  );
  const answerWrongText: GameConfig['answerWrongText'] = getTranslation(
    question.wrong_text?.translations,
    textLanguage,
    levelLanguage,
    'text',
  );
  const useSoundDescriptionOnly = question.use_sound_description_only;

  const text = question.text
  const url = question.url

  const gameConfig: GameConfig = {
    questionId,
    answerList,
    answerType,
    groupList,
    questionList,
    questionType,
    inputType,
    timerType,
    timerTime,
    layout,
    position,
    patternAnswer,
    patternGroup,
    canReuseChoice,
    question: questionText,
    questionImage,
    topic,
    hint,
    hintSound,
    hintType,
    hintImage,
    answerCorrectText,
    answerWrongText,
    useSoundDescriptionOnly,
    questionSound,
    text,
    url
  };

  console.log('gameConfig', gameConfig);

  return gameConfig;
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

const cleansingAnswer = (answers: AnswerPlaceholderProps[]) => {
  return answers?.map((answer) => {
    const { answerInput, ...rest } = answer;
    return rest;
  });
};

const getTranslation = (
  translations: Translations | undefined,
  textOrSoundLanguage: string | undefined,
  levelLanguage: string | undefined,
  key: keyof Translation = 'text',
): string => {
  if (!translations) return '';

  const fallbackLanguages = ['th', 'en', 'zh'];
  const languages = [textOrSoundLanguage, levelLanguage, ...fallbackLanguages];

  for (const lang of languages) {
    if (lang && translations[lang]) {
      return translations[lang][key] || '';
    }
  }

  return '';
};

export default loadGameConfig;
