import StoreGlobal from '@global/store/global';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  answerPosition,
  layoutPosition,
  optionsColumn,
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  // optionQuestionType,
  // optionTimerSeconds,
  optionGroupCount,
  optionAnswerCount,
} from './options';
import FormLayout from './components/template/FormLayout';
import FormAnswerSelect from './components/template/FormAnswerSelect';
import Box from '../local/components/atom/Box';
import BaseInformation from '../local/components/template/BaseInformation';
import DemoRender from './components/template/DemoRender';
import WizardBar from '../local/components/organism/WizardBar';
import { tabs } from '../local/components/template/Tab';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import IconTrashLines from '@core/design-system/library/vristo/source/components/Icon/IconTrashLines';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import FormQuiz from './components/template/FormQuiz';
import FormAnswer from './components/template/FormAnswer';
import FooterForm from '../local/components/organism/FooterForm';
import HeaderForm from '../local/components/organism/HeaderForm';
import ModalConfirmDelete from './components/molecule/ModalConfirmDelete';
import ModalTranslate from './components/organism/ModalTranslate';
import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { useNavigate, useParams } from '@tanstack/react-router';
import API from '@domain/g02/g02-d05/local/api';
import APILesson from '@domain/g02/g02-d03/local/api';
import {
  optionQuestionType as optionQuestionTypeDefault,
  optionTimerBetweenPlaySecond,
  optionTimerBetweenPlay,
  TranslationText,
  Image,
  QuestionListProps,
  AnswerProps,
  Question,
  AcademicLevelStatusType,
  AcademicLevel,
  TranslationTextGroup,
  TranslationChoice,
  TranslationTextQuestion,
  AnswerPlaceholderProps,
  HintType,
  TextChoice,
  QuestionInputType,
  HintTypeOptions,
  AcademicLevelLanguage,
  optionTimerBetweenPlayWithDefault,
  SelectOption,
  Translation,
  Translations,
} from '@domain/g02/g02-d05/local/type';
import { Monster } from '@domain/g02/g02-d03/local/Type';
import {
  convertIdToThreeDigit,
  convertRowsColumns,
  getFileDataUrl,
  isTextChoiceArray,
  isTranslationChoiceArray,
  mapAnswers,
  getTranslation,
} from '../local/util';
import {
  SubmitOnMultipleChoices,
  SubmitOnPairing,
  SubmitOnSorting,
  SubmitOnPlaceholder,
  SubmitOnFormInput,
} from './functions';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import HeaderBreadcrumbs from '../local/components/template/header-breadcrumbs';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import showMessage from '@global/utils/showMessage';
import { TLesson } from '@domain/g06/local/types/academic';
import { SubLessonData } from '@domain/g02/g02-d04/local/api/type';
import { getJsonSize } from '@global/utils/fileSize';

const DomainJSX = () => {
  const navigate = useNavigate();

  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const curriculumId = curriculumData?.id;
  // const curriculumId = 1;

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { academicLevelId, subLessonId } = useParams({ from: '' });
  const refForm = useRef<HTMLFormElement>(null);

  const [lessonData, setLessonData] = useState<TLesson>();
  const [subLessonData, setSubLessonData] = useState<SubLessonData>();
  const [monsterData, setMonsterData] = useState<Monster[]>([]);
  const [academicLevel, setAcademicLevel] = useState<any>({});
  const [mainLanguage, setMainLanguage] =
    useState<AcademicLevelLanguage['language']>('en');
  const [language, setLanguage] = useState<AcademicLevelLanguage>();
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [timerType, setTimerType] = useState<SelectOption>(
    optionTimerBetweenPlayWithDefault[0],
  );
  const [timerTime, setTimerTime] = useState<number>();
  const [timerTypeLevel, setTimerTypeLevel] = useState<SelectOption>();
  const [timerTimeLevel, setTimerTimeLevel] = useState<number>();

  const [levelType, setLevelType] = useState<
    'test' | 'sub-lesson-post-test' | 'pre-post-test'
  >();

  const [optionQuestionType, setOptionQuestionType] = useState(optionQuestionTypeDefault);
  const [selectedQuestionType, setSelectedQuestionType] = useState({
    value: '',
    label: '',
  });
  const [selectedLayoutRatio, setSelectedLayoutRatio] = useState('1:1');
  const [selectedLayoutPattern, setSelectedLayoutPattern] = useState('1');
  const [selectedPatternAnswer, setSelectedPatternAnswer] = useState('2-col');
  const [selectedPatternGroup, setSelectedPatternGroup] = useState('2-col');
  const [selectedAnswerType, setSelectedAnswerType] = useState('text-speech');
  const [selectedAnswerOptionCount, setSelectedAnswerOptionCount] = useState(5);
  const [selectedAnswerOptionFakeCount, setSelectedAnswerOptionFakeCount] = useState(2);
  const [selectedAnswerCount, setSelectedAnswerCount] = useState('one');
  const [selectedAnswerCorrect, setSelectedAnswerCorrect] = useState('1');
  const [selectedAnswerScore, setSelectedAnswerScore] = useState<number>();
  const [selectedCanReuseChoice, setSelectedCanReuseChoice] = useState(true);
  const [selectedHintType, setSelectedHintType] = useState<HintType>('none');
  const [selectedQuestionInputType, setSelectedQuestionInputType] =
    useState<QuestionInputType>('text');
  const [inputTopic, setInputTopic] = useState<TranslationText>();
  const [inputQustionImage, setInputQustionImage] = useState<Image[]>([]);
  const [inputQustion, setInputQustion] = useState<TranslationText>();
  const [inputQustionList, setInputQustionList] = useState<TranslationTextQuestion[]>([
    {
      index: 1,
      value: '',
      answerList: [],
    },
  ]);
  const [inputHint, setInputHint] = useState<TranslationText>();
  const [inputHintImage, setInputHintImage] = useState<Image[]>([]);
  const [inputAnswerGroupList, setInputAnswerGroupList] = useState<TranslationText[]>([]);
  const [inputAnswerList, setInputAnswerList] = useState<TranslationText[]>([]);
  const [inputAnswerListFake, setInputAnswerListFake] = useState<TranslationText[]>([]);
  const [inputAnswerScoreList, setInputAnswerScoreList] = useState<
    { value: string; label: string }[]
  >([]);
  const [inputCorrectText, setInputCorrectText] = useState<TranslationText>();
  const [inputWrongText, setInputWrongText] = useState<TranslationText>();
  const [inputAnswerListSortByAnswerIndexes, setInputAnswerListSortByAnswerIndexes] =
    useState<{ inputAnswerIndex: number; answerIndex: number }[]>([]);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);
  const [enforceChoiceLanguage, setEnforceChoiceLanguage] = useState(true);
  const [enforceDescriptionLanguage, setEnforceDescriptionLanguage] = useState(true);
  const [useSoundDescriptionOnly, setUseSoundDescriptionOnly] = useState(false);
  const [passwordDelete, setPasswordDelete] = useState('');

  const [modalTranslateConfig, setModalTranslateConfig] = useState<
    { show: boolean; callback: (id: string, value: string) => void } | undefined
  >(undefined);

  const resetState = () => {
    // setSelectedTimerBetweenPlay(optionTimerSeconds[0]);
    // setSelectedQuestionType(optionQuestionType[0]);
    setSelectedLayoutRatio('1:1');
    setSelectedLayoutPattern('1');
    setSelectedPatternAnswer('2-col');
    setSelectedPatternGroup('2-col');
    setSelectedAnswerType('text-speech');
    setSelectedAnswerOptionCount(2);
    setSelectedAnswerOptionFakeCount(2);
    setSelectedAnswerCount('one');
    setSelectedAnswerCorrect('1');
    setSelectedAnswerScore(undefined);
    setInputTopic(undefined);
    setInputQustionImage([]);
    setInputQustion(undefined);
    setInputQustionList([{ index: 1, value: '', answerList: [] }]);
    setInputHint(undefined);
    setInputHintImage([]);
    setInputAnswerGroupList([]);
    setInputAnswerList([]);
    setInputAnswerListFake([]);
    setInputAnswerScoreList([]);
    setInputCorrectText(undefined);
    setInputWrongText(undefined);
    setIsOpenModalConfirmDelete(false);
    setEnforceChoiceLanguage(true);
    setEnforceDescriptionLanguage(true);
    setUseSoundDescriptionOnly(false);
  };

  const updateValueFromKeyIndex = (
    index: number,
    list: TranslationText[],
    value: any,
    questionType?: string,
  ): TranslationText[] => {
    const newValues = [...list];
    for (let i = 0; i < newValues.length; i++) {
      if (newValues[i].index === index) {
        newValues[i] = { ...newValues[i], ...value };
        newValues[i].index = index;

        if (questionType === 'sorting') {
          newValues[i] = {
            ...newValues[i],
            answer_indexes: value.answer_indexes || [index],
          };
        }
        break;
      }
    }
    return newValues;
  };

  const updateInputAnswerListToFirstIndex = () => {
    setInputAnswerList((prev) => {
      const newList = [...prev];
      // group_indexes
      for (let i = 0; i < newList.length; i++) {
        newList[i] = {
          ...newList[i],
          group_indexes: newList[i].group_indexes
            ? [newList[i].group_indexes?.[0]].filter(
              (index): index is number => index !== undefined,
            )
            : [],
        };
      }

      // answer_indexes
      for (let i = 0; i < newList.length; i++) {
        newList[i] = {
          ...newList[i],
          answer_indexes: newList[i].answer_indexes
            ? [newList[i].answer_indexes?.[0]].filter(
              (index): index is number => index !== undefined,
            )
            : [],
        };
      }
      return newList;
    });
  };

  const updateInputQuestionListToChoiceIndexUnique = (
    inputQustionList: TranslationTextQuestion[],
    key?: string,
    value?: string,
  ) => {
    if (value && key) {
      const parts = key.split('_');
      const questionIndex = parseInt(parts[1]);
      const answerIndex = parseInt(parts[3]);
      const textIndex = parseInt(parts[5]);

      inputQustionList.map((question) => {
        question.answerList.map((answer) => {
          answer.text.map((text) => {
            const thisKey = `questionSelectAnswer_${question.index}_answer_${answer.index}_text_${text.index}`;
            if (text.choice_index === parseInt(value) && thisKey !== key) {
              text.choice_index = -1;
            }
          });
        });
      });
    } else {
      inputQustionList.map((question) => {
        question.answerList.map((answer) => {
          answer.text.map((text) => {
            text.choice_index = -1;
          });
        });
      });
    }
    return inputQustionList;
  };

  const handleChangeOptions = async (
    key: string,
    value: string,
    translations?: TranslationText,
    file?: File,
  ) => {
    console.log('handleChangeOptions', { key, value, translations, file });
    const fileData = file
      ? {
        file: file,
        dataURL: await getFileDataUrl(file),
      }
      : undefined;
    if (/^question_\d+$/.test(key) && fileData) {
      setInputQustionImage([]); // เคลียร์รูปภาพ
    }

    if (/^hint_\d+$/.test(key) && fileData) {
      setInputHintImage([]); // เคลียร์รูปภาพ
    }
    if (/^answer_\d+$/.test(key) && (translations || fileData || value)) {
      const index = parseInt(key.split('_')[1]);
      // if (!inputQustionList.some(q => q.index === index)) {
      //   return;
      // }
      if (translations || fileData) {
        setInputAnswerList((prev) => {
          let newList = updateValueFromKeyIndex(
            index,
            prev,
            translations || { file: fileData, id: '' },
            selectedQuestionType.value,
          );
          console.log('newList', newList);

          // newList = updateValueFromKeyIndex(index, newList, { point: 1 });
          return newList;
        });
      } else if (value) {
        setInputAnswerList((prev) => updateValueFromKeyIndex(index, prev, { value }));
      }
    } else if (/^answer_fake_\d+$/.test(key) && (translations || file || value)) {
      const index = parseInt(key.split('_')[2]);
      if (translations || fileData) {
        setInputAnswerListFake((prev) => {
          let newList = updateValueFromKeyIndex(
            index,
            prev,
            translations || { file: fileData, id: '' },
          );
          // newList = updateValueFromKeyIndex(index, newList, { point: 0 });
          return newList;
        });
      } else if (value) {
        setInputAnswerListFake((prev) => updateValueFromKeyIndex(index, prev, { value }));
      }
    } else if (/^answer_group_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[2]);
      setInputAnswerGroupList((prev) => {
        let newList = updateValueFromKeyIndex(
          index,
          prev,
          translations || { file: fileData, id: '' },
        );
        return newList;
      });
    } else if (/^question_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[1]);
      const pattern = /{Ans\d+}/g;
      const answerList = value?.match(pattern) || [];

      const defaultText = [{ index: 1, choice_index: -1, text: '' }];
      const answerListMap: AnswerPlaceholderProps[] = answerList.map((item, index) => {
        return {
          index: index + 1,
          answerText: item,
          type: 'normal',
          text: defaultText,
        };
      });

      if (value) {
        setInputQustionList((prev) => {
          const newList = [...prev];
          for (let i = 0; i < newList.length; i++) {
            if (newList[i].index === index) {
              newList[i] = {
                ...newList[i],
                value,
                answerList: answerListMap.map((item) => {
                  const currentAnswer = newList[i].answerList.find(
                    (answer) => answer.index === item.index,
                  );
                  if (currentAnswer) {
                    return { ...item, ...currentAnswer };
                  }
                  return item;
                }),
              };
              break;
            }
          }
          return newList;
        });
      }
    } else if (/^questionAddAnswer_\d+_answer_\d+$/.test(key)) {
      const parts = key.split('_');
      const questionIndex = parseInt(parts[1]);
      const answerIndex = parseInt(parts[3]);

      const currentQuestion = {
        ...inputQustionList.find((item) => item.index === questionIndex),
      };

      if (currentQuestion) {
        const currentAnswer = {
          ...(currentQuestion.answerList || []).find(
            (item) => item.index === answerIndex,
          ),
        };

        if (currentAnswer.text) {
          const newQuestionList = [...inputQustionList].map((question) => {
            if (question.index === questionIndex) {
              return {
                ...question,
                answerList: question.answerList.map((answer) => {
                  if (answer.index === answerIndex) {
                    return {
                      ...answer,
                      text: [
                        ...answer.text,
                        {
                          index: answer.text.length + 1,
                          choice_index: -1,
                          text: '',
                        },
                      ],
                    };
                  }
                  return answer;
                }),
              };
            }
            return question;
          });

          setInputQustionList(newQuestionList);
        }
      }
    } else if (/^questionRemoveAnswer_\d+_answer_\d+$/.test(key)) {
      const parts = key.split('_');
      const questionIndex = parseInt(parts[1]);
      const answerIndex = parseInt(parts[3]);
      const textIndices = value.split(',').map((v) => parseInt(v.trim()));

      const currentQuestion = {
        ...inputQustionList.find((item) => item.index === questionIndex),
      };

      if (currentQuestion) {
        const currentAnswer = {
          ...(currentQuestion.answerList || []).find(
            (item) => item.index === answerIndex,
          ),
        };

        if (currentAnswer.text) {
          const newQuestionList = [...inputQustionList].map((question) => {
            if (question.index === questionIndex) {
              return {
                ...question,
                answerList: question.answerList.map((answer) => {
                  if (answer.index === answerIndex) {
                    return {
                      ...answer,
                      text: answer.text.filter(
                        (item) => !textIndices.includes(item.index),
                      ),
                    };
                  }
                  return answer;
                }),
              };
            }
            return question;
          });

          setInputQustionList(newQuestionList);
        }
      }
    } else if (/^questionTypeAnswer_\d+_answer_\d+$/.test(key)) {
      const parts = key.split('_');
      const questionIndex = parseInt(parts[1]);
      const answerIndex = parseInt(parts[3]);
      const textType = value;

      const currentQuestion = {
        ...inputQustionList.find((item) => item.index === questionIndex),
      };

      if (currentQuestion) {
        const currentAnswer = {
          ...(currentQuestion.answerList || []).find(
            (item) => item.index === answerIndex,
          ),
        };

        if (currentAnswer.text) {
          const newQuestionList = [...inputQustionList].map((question) => {
            if (question.index === questionIndex) {
              return {
                ...question,
                answerList: question.answerList.map((answer) => {
                  if (answer.index === answerIndex) {
                    return {
                      ...answer,
                      type: textType,
                    };
                  }
                  return answer;
                }),
              };
            }
            return question;
          });

          setInputQustionList(newQuestionList);
        }
      }
    } else if (/^questionSelectAnswer_\d+_answer_\d+_text_\d+$/.test(key)) {
      const parts = key.split('_');
      const questionIndex = parseInt(parts[1]);
      const answerIndex = parseInt(parts[3]);
      const textIndex = parseInt(parts[5]);
      const translationId = parseInt(value);

      const choiceIndex = translationId;

      const currentQuestion = {
        ...inputQustionList.find((item) => item.index === questionIndex),
      };

      if (currentQuestion) {
        const currentAnswer = {
          ...(currentQuestion.answerList || []).find(
            (item) => item.index === answerIndex,
          ),
        };

        if (currentAnswer.text) {
          let newQuestionList = [...inputQustionList].map((question) => {
            if (question.index === questionIndex) {
              return {
                ...question,
                answerList: question.answerList.map((answer) => {
                  if (answer.index === answerIndex) {
                    return {
                      ...answer,
                      text: answer.text.map((item) => {
                        if (
                          item.index === textIndex &&
                          selectedQuestionType.value === 'placeholder'
                        ) {
                          return {
                            ...item,
                            choice_index: choiceIndex,
                            text: '',
                          };
                        } else if (
                          item.index === textIndex &&
                          selectedQuestionType.value === 'input'
                        ) {
                          return {
                            ...item,
                            choice_index: -1,
                            text: value,
                          };
                        }
                        return item;
                      }),
                    };
                  }
                  return answer;
                }),
              };
            }
            return question;
          });

          if (!selectedCanReuseChoice) {
            newQuestionList = updateInputQuestionListToChoiceIndexUnique(
              newQuestionList,
              key,
              value,
            );
          }
          setInputQustionList(newQuestionList);
        }
      }
    } else if (/^answer_score_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[2]);
      setInputAnswerList((prev) =>
        updateValueFromKeyIndex(index, prev, { point: parseInt(value) }),
      );
    } else if (/^answer_score_fake_\d+$/.test(key)) {
      const index = parseInt(key.split('_')[3]);
      setInputAnswerListFake((prev) =>
        updateValueFromKeyIndex(index, prev, { point: parseInt(value) }),
      );
    } else if (/^answer_group_answer_\d+_\d+$/.test(key)) {
      const parts = key.split('_');
      const groupIndex = parseInt(parts[3]);
      const answerIndex = parseInt(parts[4]);

      setInputAnswerList((prev) => {
        const newList = [...prev];
        for (let i = 0; i < newList.length; i++) {
          const answer = newList[i];
          const groupIndexes = answer.group_indexes || [];
          if (answer.index === answerIndex) {
            if (value === 'true') {
              groupIndexes.push(groupIndex);
            } else {
              const index = groupIndexes.indexOf(groupIndex);
              if (index > -1) {
                groupIndexes.splice(index, 1);
              }
            }
          }
          newList[i] = { ...answer, group_indexes: groupIndexes };
        }
        return newList;
      });
    } else {
      switch (key) {
        case 'timerType':
          const findTimer = optionTimerBetweenPlayWithDefault.find(
            (item) => item.value === value,
          );
          if (findTimer) setTimerType(findTimer);
          if (value === 'no') setTimerTime(undefined);
          break;
        case 'timerTime':
          setTimerTime(parseInt(value));
          break;
        case 'position':
          setSelectedLayoutPattern(value);
          break;
        case 'layout':
          setSelectedLayoutRatio(value);
          break;
        case 'answerColumn':
          setSelectedPatternAnswer(value);
          break;
        case 'groupColumn':
          setSelectedPatternGroup(value);
          break;
        case 'answerType':
          setSelectedAnswerType(value);
          break;
        case 'answerSelectCount':
          const count = parseInt(value);
          setSelectedAnswerOptionCount(count);
          const initialAnswers = Array.from({ length: count }, (_, index) => {
            return (
              inputAnswerList[index] || {
                index: index + 1,
                id: '',
                value: '',
                point: 1,
              }
            );
          });
          setInputAnswerList(initialAnswers);
          break;
        case 'answerSelectFakeCount':
          const countFake = parseInt(value);
          setSelectedAnswerOptionFakeCount(countFake);
          const initialAnswersFake = Array.from({ length: countFake }, (_, index) => {
            return (
              inputAnswerListFake[index] || {
                index: index + 1,
                id: '',
                value: '',
                point: 0,
              }
            );
          });
          setInputAnswerListFake(initialAnswersFake);
          break;
        case 'groupCount':
          const groupCount = parseInt(value);
          const initialGroups = Array.from({ length: groupCount }, (_, index) => {
            return (
              inputAnswerGroupList[index] || {
                index: index + 1,
                id: '',
                value: '',
              }
            );
          });
          setInputAnswerGroupList(initialGroups);
          break;
        case 'questionAdd':
          const lastItem = inputQustionList[inputQustionList.length - 1];
          const newIndex = (lastItem?.index || 0) + 1;

          setInputQustionList((prev) => [
            ...prev,
            { index: newIndex, id: '', value: '', answerList: [] },
          ]);
          break;
        case 'questionRemove':
          const removeIndex = parseInt(value);
          setInputQustionList((prev) =>
            prev.filter((item) => item.index !== removeIndex),
          );
          break;
        case 'max_score':
          setSelectedAnswerScore(parseInt(value));
          break;
        case 'inputCorrectText':
          setInputCorrectText(translations);
          break;
        case 'inputWrongText':
          setInputWrongText(translations);
          break;
        case 'enforceChoiceLanguage':
          setEnforceChoiceLanguage(value === 'true');
          break;
        case 'enforceDescriptionLanguage':
          setEnforceDescriptionLanguage(value === 'true');
          break;
        case 'useSoundDescriptionOnly':
          setUseSoundDescriptionOnly(value === 'true');
          break;
        case 'canReuseChoice':
          setSelectedCanReuseChoice(value === 'true');
          if (value === 'false') {
            updateInputAnswerListToFirstIndex();
            if (selectedQuestionType.value === 'placeholder') {
              setInputQustionList((prev) =>
                updateInputQuestionListToChoiceIndexUnique(prev),
              );
            }
          }
          break;
        case 'hintType':
          setSelectedHintType(value as HintType);
          break;
        case 'inputType':
          setSelectedQuestionInputType(value as QuestionInputType);
          break;
        default:
          break;
      }
    }
  };
  useEffect(() => {
    if (inputQustion?.value) {
      const gameConfig = JSON.parse(localStorage.getItem('game-config') || '{}');
      localStorage.setItem(
        'game-config',
        JSON.stringify({
          ...gameConfig,
          question: inputQustion.value,
        }),
      );
      sendLocalStorageToIframe();
    }
  }, [inputQustion]);
  const handleShowModalTranslate = (config: {
    show: boolean;
    callback: (id: string, value: string) => void;
    selected?: string | undefined;
  }) => {
    setModalTranslateConfig(config);
  };

  const handleCloseModalTranslate = () => {
    setModalTranslateConfig(undefined);
  };

  const handleClickQuestion = (action: string) => {
    if (!selectedQuestion) return;

    const currentIndex = selectedQuestion.index;
    const maxIndex = questionsList.length;

    switch (action) {
      case 'next':
        if (currentIndex < maxIndex) {
          const nextQuestion = questionsList.find(
            (item) => item.index === currentIndex + 1,
          );
          console.log('nextQuestion', nextQuestion);

          if (nextQuestion) {
            setSelectedQuestion(nextQuestion);
          }
        }
        break;
      case 'prev':
        if (currentIndex > 1) {
          const prevQuestion = questionsList.find(
            (item) => item.index === currentIndex - 1,
          );
          if (prevQuestion) {
            setSelectedQuestion(prevQuestion);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleClickAddQuestion = () => {
    const newIndex = questionsList.length + 1;
    const newQuestion = { index: newIndex } as Question;
    setSelectedQuestion(newQuestion);
    resetState();
    setDefaultQuestionType();
  };

  const handleSubmitSortQuestion = (questionsListState: any[]) => {
    const newQuestionsList = questionsListState.reduce(
      (acc, item, index) => {
        acc[String(item.id)] = index + 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    API.academicLevel
      .UpdateG02D05A39(academicLevelId, { questions: newQuestionsList })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
          getQuestions();
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  const handleClickDeleteQuestion = () => {
    if (selectedQuestion) {
      const data = {
        password: passwordDelete,
      };
      API.academicLevel
        .DeleteG02D05A28(selectedQuestion.id.toString(), data)
        .then((res) => {
          if (res.status_code === 200) {
            showMessage('ลบคำถามสำเร็จ', 'success');
            getQuestions();
            setSelectedQuestion(null);
          } else {
            showMessage(res.message, 'error');
          }
        });
      setIsOpenModalConfirmDelete(false);
    }
  };

  const SubmitOn = async () => {
    const dataLevel = {
      wizard_index: 2,
      status: 'question' as keyof typeof AcademicLevelStatusType,
    };

    if (academicLevel?.wizard_index > dataLevel.wizard_index) {
      dataLevel.wizard_index = academicLevel.wizard_index;
      dataLevel.status = academicLevel.status;
    }

    API.academicLevel.Update(academicLevelId, dataLevel).then((res) => {
      if (res.status_code === 200) {
        // showMessage('บันทึกสำเร็จ', true);
        setAcademicLevel(res.data?.[0]);
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });

    const timerTypeValue =
      timerType.value === 'default' ? timerTypeLevel?.value : timerType.value;
    const timerTimeValue = timerType.value === 'default' ? timerTimeLevel : timerTime;

    if (selectedQuestionType.value === 'multiple-choices') {
      return await SubmitOnMultipleChoices({
        academicLevelId,
        academicLevel,
        timerType: timerTypeValue || 'no',
        timerTime: timerTimeValue || 0,
        selectedLayoutPattern,
        selectedLayoutRatio,
        selectedPatternAnswer,
        selectedPatternGroup,
        enforceDescriptionLanguage,
        enforceChoiceLanguage,
        useSoundDescriptionOnly,
        inputTopic,
        inputQustion,
        inputHint,
        selectedAnswerType,
        inputAnswerList,
        inputAnswerListFake,
        inputCorrectText,
        inputWrongText,
        inputHintImage,
        inputQustionImage,
        selectedQuestion,
        selectedQuestionType,
      });
    } else if (selectedQuestionType.value === 'pairing') {
      return await SubmitOnPairing({
        academicLevelId,
        academicLevel,
        timerType: timerTypeValue || 'no',
        timerTime: timerTimeValue || 0,
        selectedLayoutPattern,
        selectedLayoutRatio,
        selectedPatternAnswer,
        selectedPatternGroup,
        enforceDescriptionLanguage,
        enforceChoiceLanguage,
        useSoundDescriptionOnly,
        inputTopic,
        inputQustion,
        inputHint,
        selectedAnswerType,
        selectedCanReuseChoice,
        inputAnswerList,
        inputAnswerListFake,
        inputAnswerGroupList,
        inputCorrectText,
        inputWrongText,
        inputHintImage,
        inputQustionImage,
        selectedQuestion,
        selectedQuestionType,
      });
    } else if (selectedQuestionType.value === 'sorting') {
      return await SubmitOnSorting({
        academicLevelId,
        academicLevel,
        timerType: timerTypeValue || 'no',
        timerTime: timerTimeValue || 0,
        selectedLayoutPattern,
        selectedLayoutRatio,
        selectedPatternAnswer,
        selectedPatternGroup,
        enforceDescriptionLanguage,
        enforceChoiceLanguage,
        useSoundDescriptionOnly,
        inputTopic,
        inputQustion,
        inputHint,
        selectedAnswerType,
        inputAnswerList,
        inputAnswerListFake,
        inputCorrectText,
        inputWrongText,
        inputHintImage,
        inputQustionImage,
        inputAnswerListSortByAnswerIndexes,
        selectedQuestion,
        selectedQuestionType,
        selectedCanReuseChoice,
      });
    } else if (selectedQuestionType.value === 'placeholder') {
      return await SubmitOnPlaceholder({
        academicLevelId,
        academicLevel,
        timerType: timerTypeValue || 'no',
        timerTime: timerTimeValue || 0,
        selectedLayoutPattern,
        selectedLayoutRatio,
        selectedPatternAnswer,
        selectedPatternGroup,
        enforceDescriptionLanguage,
        enforceChoiceLanguage,
        useSoundDescriptionOnly,
        inputTopic,
        inputQustion,
        inputQustionList,
        inputHint,
        selectedAnswerType,
        inputAnswerList,
        inputAnswerListFake,
        inputAnswerGroupList,
        inputCorrectText,
        inputWrongText,
        inputHintImage,
        inputQustionImage,
        selectedQuestion,
        selectedQuestionType,
        selectedCanReuseChoice,
        selectedHintType,
      });
    } else if (selectedQuestionType.value === 'input') {
      return await SubmitOnFormInput({
        academicLevelId,
        academicLevel,
        timerType: timerTypeValue || 'no',
        timerTime: timerTimeValue || 0,
        selectedLayoutPattern,
        selectedLayoutRatio,
        selectedPatternAnswer,
        selectedPatternGroup,
        enforceDescriptionLanguage,
        enforceChoiceLanguage,
        useSoundDescriptionOnly,
        inputTopic,
        inputQustion,
        inputQustionList,
        inputHint,
        selectedAnswerType,
        // inputAnswerList,
        // inputAnswerListFake,
        inputAnswerGroupList,
        inputCorrectText,
        inputWrongText,
        inputHintImage,
        inputQustionImage,
        selectedQuestion,
        selectedQuestionType,
        selectedCanReuseChoice,
        selectedHintType,
        selectedQuestionInputType,
      });
    }
    return false;
  };

  // clear images
  useEffect(() => {
    setInputQustionImage([]);
    setInputHintImage([]);
  }, [selectedQuestion, mainLanguage]);

  const handleSave = async () => {
    setLoading(true);
    if (refForm.current) {
      const validate = refForm.current.reportValidity();
      if (validate) {
        const result = await SubmitOn();
        if (result) {
          getQuestions();
        }
      }
    }
    setLoading(false);
  };

  const handleNext = async () => {
    setLoading(true);
    if (refForm.current) {
      const validate = refForm.current.reportValidity();
      if (validate) {
        const result = await SubmitOn();
        if (result) {
          navigate({
            to: `/content-creator/level/${subLessonId}/create-translate/${academicLevel.id}`,
          });
        }
      }
    }
    setLoading(false);
  };

  const handlePrevious = async () => {
    setLoading(true);
    if (refForm.current) {
      const validate = refForm.current.reportValidity();
      if (validate) {
        const result = await SubmitOn();
        if (result) {
          navigate({
            to: `/content-creator/level/${subLessonId}/create-setting/${academicLevel.id}`,
          });
        }
      }
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    const dataLevel = {
      status: 'enabled' as keyof typeof AcademicLevelStatusType,
    };

    API.academicLevel.Update(academicLevelId, dataLevel).then((res) => {
      if (res.status_code === 200) {
        showMessage('เผยแพร่ด่านเรียบร้อย', 'success');
        setAcademicLevel(res.data?.[0]);
        navigate({ to: `/content-creator/level/${subLessonId}` });
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });
  };

  const getQuestions = async () => {
    setLoadingQuestions(true);
    API.academicLevel.GetG02D05A29(academicLevelId, { limit: -1 }).then((res) => {
      if (res.status_code === 200) {
        const dataSort = res.data?.sort((a, b) => a.index - b.index);
        setQuestionsList(dataSort as Question[]);
        if (res.data?.[0] && 'index' in res.data[0]) {
          if (typeof res.data[0].index === 'number' && selectedQuestion === null) {
            const dataindex1 = res.data.find((item) => item.index === 1);
            setSelectedQuestion(dataindex1 as Question);
          } else if (selectedQuestion) {
            const dataindex = res.data.find(
              (item) => item.index === selectedQuestion.index,
            );
            setSelectedQuestion(dataindex as Question);
          }
        }
        setLoadingQuestions(false);
      }
    });
  };

  const setDefaultQuestionType = () => {
    const newOptionQuestionType = optionQuestionTypeDefault.map((item) => {
      if (item.value === academicLevel.question_type) {
        const newItem = { ...item, label: `ค่าเริ่มต้น - ${item.label}` };
        setSelectedQuestionType(newItem);
        return newItem;
      }
      return item;
    });
    setOptionQuestionType(newOptionQuestionType);
  };
  /* 
  API Zone 
  Start
  ------------------------------------------------- 
  */
  useEffect(() => {
    // console.log("academicLevelId", academicLevelId);
    if (academicLevelId) {
      API.academicLevel.GetById(academicLevelId).then((res) => {
        if (res.status_code === 200) {
          setAcademicLevel(res.data?.[0]);
        }
      });

      getQuestions();
    }
  }, [academicLevelId]);

  useEffect(() => {
    if (academicLevel) {
      if (academicLevel?.language?.language) {
        setMainLanguage(academicLevel.language.language);
        setLanguage(academicLevel.language);
        const findTimerType = optionTimerBetweenPlayWithDefault.find(
          (item) => item.value === academicLevel.timer_type,
        );
        if (findTimerType) {
          setTimerTypeLevel(findTimerType);
        }
        setTimerTimeLevel(academicLevel.timer_time);

        if (selectedQuestionType) {
          setDefaultQuestionType();
        }

        if (
          ['test', 'sub-lesson-post-test', 'pre-post-test'].includes(
            academicLevel.level_type,
          )
        ) {
          setLevelType(academicLevel.level_type);
        }
      }
    }
  }, [academicLevel]);

  useEffect(() => {
    console.log('selectedQuestion', selectedQuestion);

    const questionType = optionQuestionType.find(
      (item) => item.value === selectedQuestion?.question_type,
    );
    const timerType = selectedQuestion?.timer_type;
    const timerTime = selectedQuestion?.timer_time;
    const layoutRatio = selectedQuestion?.layout;
    const position = selectedQuestion?.choice_position;
    const patternAnswer = selectedQuestion?.left_box_columns;
    const patternGroup = selectedQuestion?.bottom_box_columns;
    const answerType = selectedQuestion?.choice_type;
    const answerCount = selectedQuestion?.correct_choice_amount;
    const maxScore = selectedQuestion?.max_point;
    const commandText = selectedQuestion?.command_text;
    const descriptionText = selectedQuestion?.description_text;
    const hintText = selectedQuestion?.hint_text;
    const textChoices = selectedQuestion?.text_choices;
    const correctText = selectedQuestion?.correct_text;
    const wrongText = selectedQuestion?.wrong_text;
    const enforceChoiceLanguage = selectedQuestion?.enforce_choice_language;
    const enforceDescriptionLanguage = selectedQuestion?.enforce_description_language;
    const imageChoices = selectedQuestion?.image_choices;
    const imageHintUrl = selectedQuestion?.image_hint_url;
    const imageDescriptionUrl = selectedQuestion?.image_description_url;
    const canReuseChoice = selectedQuestion?.can_reuse_choice;
    const useSoundDescriptionOnly = selectedQuestion?.use_sound_description_only;

    // pairing
    const groups = selectedQuestion?.groups;

    // Placeholder
    const descriptions = selectedQuestion?.descriptions;
    const hintType = selectedQuestion?.hint_type;
    //Input
    const inputType = selectedQuestion?.input_type;

    if (questionType) {
      setSelectedQuestionType(questionType);
    }

    if (timerType === timerTypeLevel?.value && timerTime === timerTimeLevel) {
      setTimerType(optionTimerBetweenPlayWithDefault[0]);
      setTimerTime(timerTimeLevel);
    } else {
      const findTimerType = optionTimerBetweenPlayWithDefault.find(
        (item) => item.value === timerType,
      );
      if (findTimerType) setTimerType(findTimerType);
      setTimerTime(timerTime);
    }

    if (layoutRatio) {
      setSelectedLayoutRatio(layoutRatio);
    }
    if (position) {
      setSelectedLayoutPattern(position);
    }
    if (patternAnswer) {
      setSelectedPatternAnswer(convertRowsColumns(patternAnswer));
    }
    if (patternGroup) {
      setSelectedPatternGroup(convertRowsColumns(patternGroup));
    }
    if (answerType) {
      setSelectedAnswerType(answerType);
    }
    if (answerCount) {
      setSelectedAnswerCount(answerCount);
    }
    if (maxScore) {
      setSelectedAnswerScore(maxScore);
    }
    if (getTranslation(commandText?.translations, mainLanguage, 'text')) {
      setInputTopic({
        id: commandText?.saved_text_group_id ?? '',
        value: getTranslation(commandText?.translations, mainLanguage, 'text'),
      });
    } else {
      setInputTopic(undefined);
    }
    if (getTranslation(descriptionText?.translations, mainLanguage, 'text')) {
      setInputQustion({
        id: descriptionText?.saved_text_group_id ?? '',
        value: getTranslation(descriptionText?.translations, mainLanguage, 'text'),
      });
    } else {
      setInputQustion(undefined);
    }
    if (getTranslation(hintText?.translations, mainLanguage, 'text')) {
      setInputHint({
        id: hintText?.saved_text_group_id ?? '',
        value: getTranslation(hintText?.translations, mainLanguage, 'text'),
      });
    } else {
      setInputHint(undefined);
    }

    if (
      textChoices &&
      isTranslationChoiceArray(textChoices) &&
      (answerType === 'text-speech' || answerType === 'speech')
    ) {
      const correctAnswers = (textChoices as TranslationChoice[]).filter(
        (item) => item.is_correct,
      );
      const fakeAnswers = (textChoices as TranslationChoice[]).filter(
        (item) => !item.is_correct,
      );

      const answerList = mapAnswers(correctAnswers, mainLanguage, questionType?.value);
      const fakeAnswerList = mapAnswers(fakeAnswers, mainLanguage, questionType?.value);

      setInputAnswerList(answerList);
      setInputAnswerListFake(fakeAnswerList);
      setSelectedAnswerOptionCount(answerList.length);
      setSelectedAnswerOptionFakeCount(fakeAnswerList.length);
    }

    if (imageChoices && answerType === 'image') {
      const correctAnswers = imageChoices.filter((item) => item.is_correct);
      const fakeAnswers = imageChoices.filter((item) => !item.is_correct);

      const answerList = mapAnswers(correctAnswers, mainLanguage, questionType?.value);

      const fakeAnswerList = mapAnswers(fakeAnswers, mainLanguage, questionType?.value);

      setInputAnswerList(answerList);
      setInputAnswerListFake(fakeAnswerList);
      setSelectedAnswerOptionCount(answerList.length);
      setSelectedAnswerOptionFakeCount(fakeAnswerList.length);
    }

    if (textChoices && isTextChoiceArray(textChoices) && answerType === 'text-speech') {
      const correctAnswers = (textChoices as TextChoice[]).filter(
        (item) => item.is_correct,
      );
      const fakeAnswers = (textChoices as TextChoice[]).filter(
        (item) => !item.is_correct,
      );

      const answerList = correctAnswers.map((item, index) => {
        return {
          index: item.index,
          id: '',
          value: item.text,
        };
      });

      const fakeAnswerList = fakeAnswers.map((item, index) => {
        return {
          index: item.index,
          id: '',
          value: item.text,
        };
      });

      setInputAnswerList(answerList);
      setInputAnswerListFake(fakeAnswerList);
      setSelectedAnswerOptionCount(answerList.length);
      setSelectedAnswerOptionFakeCount(fakeAnswerList.length);
    }

    if (getTranslation(correctText?.translations, mainLanguage, 'text')) {
      setInputCorrectText({
        id: correctText?.saved_text_group_id ?? '',
        value: getTranslation(correctText?.translations, mainLanguage, 'text'),
      });
    } else {
      setInputCorrectText(undefined);
    }
    if (getTranslation(wrongText?.translations, mainLanguage, 'text')) {
      setInputWrongText({
        id: wrongText?.saved_text_group_id ?? '',
        value: getTranslation(wrongText?.translations, mainLanguage, 'text'),
      });
    } else {
      setInputWrongText(undefined);
    }

    if (enforceChoiceLanguage !== undefined) {
      setEnforceChoiceLanguage(enforceChoiceLanguage);
    }

    if (enforceDescriptionLanguage !== undefined) {
      setEnforceDescriptionLanguage(enforceDescriptionLanguage);
    }

    if (useSoundDescriptionOnly !== undefined) {
      setUseSoundDescriptionOnly(useSoundDescriptionOnly);
    }

    if (imageDescriptionUrl !== undefined) {
      if (imageDescriptionUrl === null) {
        setInputQustionImage([]);
      } else {
        setInputQustionImage([{ dataURL: imageDescriptionUrl, file: undefined }]);
      }
    }

    if (imageHintUrl !== undefined) {
      if (imageHintUrl === null) {
        setInputHintImage([]);
      } else {
        setInputHintImage([{ dataURL: imageHintUrl, file: undefined }]);
      }
    }

    if (canReuseChoice !== undefined) {
      setSelectedCanReuseChoice(canReuseChoice);
    }

    // pairing
    if (groups) {
      const groupList = groups.map((item) => {
        const group = Object.entries(item.translations).reduce((acc, [key, value]) => {
          acc[key] = { text: value.text } as Translation;
          return acc;
        }, {} as Translations);

        return {
          index: item.index,
          id: item.saved_text_group_id,
          value: getTranslation(group, mainLanguage, 'text'),
        };
      });
      setInputAnswerGroupList(groupList);
      // setSelectedAnswerOptionCount(groups.length);
    }

    // Placeholder
    if (descriptions) {
      setInputQustionList(
        descriptions.map((description) => {
          const pattern = /{Ans\d+}/g;
          const answerList = description.text?.match(pattern) || [];
          const mergedAnswerList = description.answers?.map((item) => {
            const answer = answerList.find((ans, index) => index === item.index - 1);
            if (answer) {
              return {
                ...item,
                answerText: answer,
              };
            }
            return item;
          });

          return {
            ...description,
            value: description.text || '',
            answerList: mergedAnswerList || [],
          };
        }),
      );
    }

    if (hintType) {
      setSelectedHintType(hintType);
    }
    if (inputType) {
      setSelectedQuestionInputType(inputType);
    }
  }, [selectedQuestion, mainLanguage]);

  useEffect(() => {
    if (lessonData?.id) {
      APILesson.Lesson.MonsterList.Get(String(lessonData.id), {
        limit: -1,
      })
        .then((res) => {
          if (res.status_code === 200) {
            console.log('Monster data:', res.data);

            setMonsterData(res?.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [lessonData]);

  /* 
  API Zone 
  End
  ------------------------------------------------- 
  */

  useEffect(() => {
    sendLocalStorageToIframe();
  }, [
    inputAnswerList,
    inputAnswerListFake,
    inputAnswerGroupList,
    inputQustionList,
    HintTypeOptions,
    selectedQuestion,
    selectedQuestionInputType,
    timerTime,
    selectedLayoutRatio,
    selectedLayoutPattern,
    selectedPatternAnswer,
    selectedPatternGroup,
    selectedAnswerType,
    selectedCanReuseChoice,
    inputQustion,
    inputQustionImage,
    inputTopic,
    inputHint,
    selectedHintType,
    inputHintImage,
    inputCorrectText,
    inputWrongText,
    questionsList,
    lessonData,
    monsterData,
    subLessonData,
    useSoundDescriptionOnly
  ]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const sendLocalStorageToIframe = () => {
    console.log('sendLocalStorageToIframe');

    let lastIndex = 0;
    const answerList = inputAnswerList
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((item, index) => {
        lastIndex = index;
        console.log({ item: item });

        // หา speechUrl จากข้อมูลใน selectedQuestion 
        let speechUrl = item.speechUrl;
        if (!speechUrl && selectedQuestion?.text_choices) {
          const textChoice = selectedQuestion.text_choices.find(
            (choice: any) => choice.index === item.index
          );
          if (
            textChoice &&
            'translations' in textChoice &&
            textChoice.translations &&
            textChoice.translations[mainLanguage]
          ) {
            speechUrl = textChoice.translations[mainLanguage].speech_url ?? undefined;
          }
        }

        return {
          id: index + 1,
          index: item.index,
          answer: item.value,
          imageUrl: item.file?.dataURL || item.image_url,
          isCorrect: true,
          group_indexes: item.group_indexes,
          answer_indexes: item.answer_indexes,
          speechUrl: speechUrl
        };
      });

    answerList.push(
      ...inputAnswerListFake
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((item, index) => {
          let speechUrl = item.speechUrl;
          if (!speechUrl && selectedQuestion?.text_choices) {
            const textChoice = selectedQuestion.text_choices.find(
              (choice: any) => choice.index === item.index
            );
            if (
              textChoice &&
              'translations' in textChoice &&
              textChoice.translations &&
              textChoice.translations[mainLanguage]
            ) {
              speechUrl = textChoice.translations[mainLanguage].speech_url ?? undefined;
            }
          }

          return {
            id: 1000 + index + 1,
            index: 1000 + (item.index ?? 0) + 1,
            answer: item.value,
            imageUrl: item.file?.dataURL || item.image_url,
            isCorrect: false,
            group_indexes: [],
            answer_indexes: [],
            speechUrl: speechUrl
          };
        }),
    );

    const groupList = inputAnswerGroupList.map((item, index) => {
      return {
        index: item.index,
        groupName: item.value,
      };
    });

    const questionList = inputQustionList.map((item) => {
      return {
        index: item.index,
        text: item.value,
        answers: item.answerList,
      };
    });

    const hintType = HintTypeOptions.find(
      (item) => item.value === selectedHintType,
    )?.value;

    const inputType = selectedQuestionInputType;
    const timerTypeValue =
      timerType.value === 'default' ? timerTypeLevel?.value : timerType?.value;

    // เสียงคำถาม description text
    let questionSpeechUrl = null;
    if (selectedQuestion?.description_text?.translations?.[mainLanguage]?.speech_url) {
      questionSpeechUrl = selectedQuestion.description_text.translations[mainLanguage].speech_url;
    }
    console.log('inputQustionImage', inputQustionImage);

    const gameConfigObject = {
      questionId: selectedQuestion?.id,
      levelType: levelType,
      questionType: selectedQuestionType.value,
      questionList: questionList,
      timerType: timerTypeValue,
      timerTime: timerTime,
      layout: selectedLayoutRatio,
      position: selectedLayoutPattern,
      patternAnswer: selectedPatternAnswer,
      patternGroup: selectedPatternGroup,
      answerType: selectedAnswerType,
      canReuseChoice: selectedCanReuseChoice,
      inputType: inputType,
      question: inputQustion?.value,
      questionImage: inputQustionImage[0]?.dataURL,
      questionSound: questionSpeechUrl,
      topic: inputTopic?.value,
      hint: inputHint?.value,
      hintType: hintType,
      hintImage: inputHintImage[0]?.dataURL,
      answerList: answerList,
      groupList: groupList,
      answerCorrectText: inputCorrectText?.value,
      answerWrongText: inputWrongText?.value,
      useSoundDescriptionOnly: useSoundDescriptionOnly,
    };

    const gameConfig = JSON.stringify(gameConfigObject);

    const questionsListJson = JSON.stringify(questionsList);
    const lessonDataJson = JSON.stringify(lessonData);
    const monsterDataJson = JSON.stringify(monsterData);
    const subLessonDataJson = JSON.stringify(subLessonData);

    const gameConfigSize = getJsonSize(gameConfigObject);
    if (parseFloat(gameConfigSize.mb) > 5) {
      showMessage(
        `ขนาดข้อมูลเกมเกิน 5MB ไม่สามารถแสดงตัวอย่างในเกมได้
        รูปภาพที่ใช้ในคำถามอาจมีขนาดใหญ่เกินไป
        `,
        'warning',
      );
      return;
    }

    localStorage.setItem('game-config', gameConfig);

    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      const localStorageData = JSON.stringify({
        'game-config': gameConfig,
        'questions-list': questionsListJson,
        'lesson-data': lessonDataJson,
        'monsters-data': monsterDataJson,
        'sublesson-data': subLessonDataJson,
      });
      iframe.contentWindow.postMessage(localStorageData, '*');
    }
  };

  return (
    <LayoutDefault>
      <HeaderBreadcrumbs
        links={[
          {
            label: 'เกี่ยวกับหลักสูตร',
            href: `/content-creator/sublesson/${subjectData.id}`,
          },
          { label: 'จัดการด่าน', href: `/content-creator/level/${subLessonId}` },
          { label: academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก', href: '' },
        ]}
        headerTitle={academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก'}
        headerDescription={<div>ID: {convertIdToThreeDigit(academicLevelId)}</div>}
        sublessonId={subLessonId}
        backLink={`/content-creator/level/${subLessonId}`}
        setLessonStateData={setLessonData}
        setSubLessonStateData={setSubLessonData}
      />
      <form
        className="mt-5 w-full font-noto-sans-thai"
        ref={refForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <ModalTranslate
          openWithCallback={modalTranslateConfig}
          onClose={handleCloseModalTranslate}
          mainLanguage={mainLanguage}
          curriculumGroupId={curriculumId}
        />
        <ModalConfirmDelete
          isOpen={isOpenModalConfirmDelete}
          onClose={() => setIsOpenModalConfirmDelete(false)}
          onOk={handleClickDeleteQuestion}
          passwordDelete={passwordDelete}
          setPasswordDelete={setPasswordDelete}
        />
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} activeId={2} />
        </Box>
        <div className="flex gap-4 pt-5">
          <div className="flex w-2/3 flex-col gap-6">
            <Box className="flex gap-4">
              <HeaderForm
                onClickAddQuestion={handleClickAddQuestion}
                disabledAddQuestion={
                  selectedQuestion?.index !== undefined &&
                  selectedQuestion.index > questionsList.length
                }
                questionsList={questionsList}
                mainLanguage={mainLanguage}
                onOkSortQuestion={handleSubmitSortQuestion}
                loading={loadingQuestions}
              />
            </Box>
            <Box>
              <div className="flex items-center justify-center gap-4 rounded-md bg-gray-100 py-4 text-lg font-bold">
                <div>คำถามข้อที่</div>
                <button
                  className="btn btn-primary h-11 w-11 !p-0"
                  onClick={() => handleClickQuestion('prev')}
                  type="button"
                >
                  <IconCaretDown className="h-6 w-6 rotate-90" />
                </button>
                <div className="flex items-center gap-4">
                  <div>
                    {loadingQuestions ? (
                      <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-black border-l-transparent align-middle" />
                    ) : (
                      selectedQuestion?.index
                    )}
                  </div>
                  /
                  <div>
                    {loadingQuestions ? (
                      <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-black border-l-transparent align-middle" />
                    ) : (
                      questionsList.length
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary h-11 w-11 !p-0"
                  onClick={() => handleClickQuestion('next')}
                  type="button"
                >
                  <IconCaretDown className="h-6 w-6 -rotate-90" />
                </button>
              </div>
              <Divider />
              <div className="my-4 flex items-center justify-between font-bold">
                <div>
                  <div className="text-xl">ตั้งค่าคำถาม</div>
                  <div className="text-sm opacity-50">ID: {selectedQuestion?.id}</div>
                </div>
                <button
                  className="btn btn-outline-danger flex gap-2"
                  onClick={() => setIsOpenModalConfirmDelete(true)}
                  type="button"
                  disabled={loadingQuestions || !selectedQuestion?.id}
                >
                  {loadingQuestions ? (
                    <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-danger border-l-transparent align-middle" />
                  ) : (
                    <IconTrashLines />
                  )}
                  ลบคำถาม
                </button>
              </div>
              <Divider />
              <div className="flex w-full flex-col gap-4">
                <div className="flex gap-4">
                  <Select
                    className="w-full"
                    label="รูปแบบคำถาม"
                    // defaultValue={optionQuestionType[0]}
                    options={optionQuestionType}
                    value={selectedQuestionType}
                    onChange={(e) => setSelectedQuestionType(e)}
                    required
                    disabled={
                      !(
                        selectedQuestion?.index !== undefined &&
                        selectedQuestion.index > questionsList.length
                      ) || levelType === 'test'
                    }
                  />
                  <div className="mb-2 flex w-full items-end text-transparent">
                    {/* {selectedQuestionType.label} */}-
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <Select
                    className="w-full"
                    label="การจับเวลาระหว่างเล่น (ค่าเริ่มต้น)"
                    value={timerType}
                    options={optionTimerBetweenPlayWithDefault}
                    onChange={(option) => handleChangeOptions('timerType', option.value)}
                    required
                  />
                  {timerType.value === 'default' ? (
                    <div className="mb-2 flex w-full items-end">
                      {timerTypeLevel?.label} {timerTimeLevel} วินาที
                    </div>
                  ) : (
                    <Input
                      type="number"
                      className="h-[38px] w-full"
                      label="เวลา (วินาที)"
                      value={timerTime}
                      onInput={(e) => handleChangeOptions('timerTime', e.target.value)}
                      required
                      disabled={timerType?.value === 'no' ? true : false}
                    />
                  )}
                </div>
              </div>
            </Box>
            <Box className={cn(!selectedQuestion && 'hidden')}>
              <FormLayout
                selectedLayoutRatio={selectedLayoutRatio}
                selectedLayoutPattern={selectedLayoutPattern}
                answerPosition={answerPosition}
                layoutPosition={layoutPosition}
                optionsColumn={optionsColumn}
                handleChangeOptions={handleChangeOptions}
                questionType={selectedQuestionType.value}
              />
            </Box>
            <Box className={cn(!selectedQuestion && 'hidden')}>
              <FormQuiz
                setInputQustion={setInputQustion}
                setInputTopic={setInputTopic}
                setInputHint={setInputHint}
                setInputQustionImage={setInputQustionImage}
                setInputHintImage={setInputHintImage}
                questionType={selectedQuestionType.value}
                inputQustion={inputQustion}
                inputQustionImage={inputQustionImage}
                inputHint={inputHint}
                inputHintImage={inputHintImage}
                inputTopic={inputTopic}
                inputQustionList={inputQustionList}
                inputAnswerList={inputAnswerList}
                handleShowModalTranslate={handleShowModalTranslate}
                handleChangeOptions={handleChangeOptions}
                useSoundDescriptionOnly={useSoundDescriptionOnly}
                enforceDescriptionLanguage={enforceDescriptionLanguage}
                selectedHintType={selectedHintType}
                selectedQuestionInputType={selectedQuestionInputType}
                language={language}
              />
            </Box>
            {selectedQuestionType.value !== 'input' && (
              <Box className={cn(!selectedQuestion && 'hidden')}>
                <FormAnswerSelect
                  inputAnswerList={inputAnswerList}
                  inputAnswerListFake={inputAnswerListFake}
                  inputAnswerGroupList={inputAnswerGroupList}
                  optionsAnswerSelect={optionsAnswerSelect}
                  optionsAnswerSelectCount={optionsAnswerSelectCount}
                  optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
                  optionGroupCount={optionGroupCount}
                  handleChangeOptions={handleChangeOptions}
                  selectedAnswerOptionCount={selectedAnswerOptionCount}
                  selectedAnswerOptionFakeCount={selectedAnswerOptionFakeCount}
                  questionType={selectedQuestionType.value}
                  answerType={selectedAnswerType}
                  handleShowModalTranslate={handleShowModalTranslate}
                  enforceChoiceLanguage={enforceChoiceLanguage}
                  selectedCanReuseChoice={selectedCanReuseChoice}
                  language={language}
                />
              </Box>
            )}
            <Box className={cn(!selectedQuestion && 'hidden')}>
              <FormAnswer
                inputAnswerList={inputAnswerList}
                inputAnswerListFake={inputAnswerListFake}
                selectedAnswerCorrect={selectedAnswerCorrect}
                selectedAnswerCount={selectedAnswerCount}
                setSelectedAnswerCount={setSelectedAnswerCount}
                setSelectedAnswerCorrect={setSelectedAnswerCorrect}
                questionType={selectedQuestionType.value}
                optionAnswerCount={optionAnswerCount}
                inputAnswerGroupList={inputAnswerGroupList}
                handleChangeOptions={handleChangeOptions}
                inputAnswerScoreList={inputAnswerScoreList}
                selectedAnswerScore={selectedAnswerScore}
                handleShowModalTranslate={handleShowModalTranslate}
                inputCorrectText={inputCorrectText}
                inputWrongText={inputWrongText}
                inputQustionList={inputQustionList}
                inputAnswerListSortByAnswerIndexes={inputAnswerListSortByAnswerIndexes}
                setInputAnswerListSortByAnswerIndexes={
                  setInputAnswerListSortByAnswerIndexes
                }
                selectedCanReuseChoice={selectedCanReuseChoice}
                answerType={selectedAnswerType}
              />
            </Box>
            <Box
              className={cn(
                !selectedQuestion && '!hidden',
                'flex w-full justify-between rounded-lg bg-[#F5F5F5] p-5 shadow-md',
              )}
            >
              <FooterForm
                academicLevel={academicLevel}
                onNext={handleNext}
                onSave={handleSave}
                onPrevious={handlePrevious}
                loading={loading}
              />
            </Box>
          </div>
          <div className="flex h-fit w-1/3 flex-col gap-6">
            <Box>
              <BaseInformation academicLevel={academicLevel} onOkPublic={handlePublish} />
            </Box>
            <Box className={cn(!selectedQuestion && 'hidden')}>
              {selectedQuestion && <DemoRender forceUpdate={sendLocalStorageToIframe} />}
            </Box>
          </div>
        </div>
      </form>
    </LayoutDefault>
  );
};

export default DomainJSX;
