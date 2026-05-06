import StoreGlobal from '@global/store/global';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from '@tanstack/react-router';

import ConfigJson from './config/index.json';

import LayoutDefault from '@core/design-system/library/component/layout/default';

import WizardBar from '../local/components/organism/WizardBar';
import { tabs } from '../local/components/template/Tab';
import {
  optionAffiliation as optionAffiliationDefault,
  optionYear as optionYearDefault,
  optionGroup as optionGroupDefault,
  optionSubject as optionSubjectDefault,
  optionLesson as optionLessonDefault,
  optionSubLesson as optionSubLessonDefault,
  optionBloom,
  optionSubStandard1 as optionSubStandard1Default,
  optionLevelType,
  optionDifficulty,
} from './options';
import {
  AcademicLevelStatusType,
  optionQuestionType,
  optionTimerBetweenPlay,
  optionTimerBetweenPlaySecond,
  SubCriteriaTopic,
} from '../local/type';
import Box from '../local/components/atom/Box';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import BaseInformation from '../local/components/template/BaseInformation';
import FooterForm from '../local/components/organism/FooterForm';
import API from '../local/api';
import { convertDataToOptions, convertIdToThreeDigit } from '../local/util';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import HeaderBreadcrumbs from '../local/components/template/header-breadcrumbs';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import showMessage from '@global/utils/showMessage';
import SubCriteria from './component/web/molecule/SubCriteria';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { academicLevelId, subLessonId } = useParams({ from: '' });
  const navigate = useNavigate();
  const refForm = useRef<HTMLFormElement>(null);

  // const curriculumId = 1;
  // const yearId = 1;
  // const subjectGroupId = 1;
  // const subjectId = 1;

  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );

  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const curriculumId = curriculumData?.id;
  const [lessonId, setLessonId] = useState<string>();
  const [yearId, setYearId] = useState<number>();
  const [subjectGroupId, setSubjectGroupId] = useState<number>();
  const [subjectId, setSubjectId] = useState<number>();
  const [platformId, setPlatformId] = useState<number>(1);

  const [academicLevel, setAcademicLevel] = useState<any>({});

  const [optionCurriculumGroup, setOptionCurriculumGroup] = useState<any[]>(
    optionAffiliationDefault,
  );
  const [optionYear, setOptionYear] = useState<any[]>(optionYearDefault);
  const [optionSubjectGroup, setOptionSubjectGroup] = useState<any[]>(optionGroupDefault);
  const [optionSubject, setOptionSubject] = useState<any[]>(optionSubjectDefault);
  const [optionLesson, setOptionLesson] = useState<any[]>();
  const [optionSubLesson, setOptionSubLesson] = useState<any[]>();
  const [optionSubCriteria1, setOptionSubCriteria1] = useState<SubCriteriaTopic[]>();
  const [optionSubCriteria2, setOptionSubCriteria2] = useState<SubCriteriaTopic[]>();
  const [optionSubCriteria3, setOptionSubCriteria3] = useState<SubCriteriaTopic[]>();
  const [nameSubCriteria1, setNameSubCriteria1] = useState<string>();
  const [nameSubCriteria2, setNameSubCriteria2] = useState<string>();
  const [nameSubCriteria3, setNameSubCriteria3] = useState<string>();
  const [optionTagBySubject1, setOptionTagBySubject1] = useState<any[]>();
  const [optionTagBySubject2, setOptionTagBySubject2] = useState<any[]>();
  const [optionTagBySubject3, setOptionTagBySubject3] = useState<any[]>();
  const [nameTagBySubject1, setNameTagBySubject1] = useState<string>();
  const [nameTagBySubject2, setNameTagBySubject2] = useState<string>();
  const [nameTagBySubject3, setNameTagBySubject3] = useState<string>();

  const [curriculumGroup, setCurriculumGroup] = useState<any>({});
  const [year, setYear] = useState<any>({});
  const [subjectGroup, setSubjectGroup] = useState<any>({});
  const [subject, setSubject] = useState<any>({});
  const [bloomType, setBloomType] = useState<any>(optionBloom[0]);
  const [lesson, setLesson] = useState<any>();
  const [subLesson, setSubLesson] = useState<any>();
  const [standard, setStandard] = useState<any>();
  const [subCriteria1, setSubCriteria1] = useState<SubCriteriaTopic>();
  const [subCriteria2, setSubCriteria2] = useState<SubCriteriaTopic>();
  const [subCriteria3, setSubCriteria3] = useState<SubCriteriaTopic>();
  const [tagBySubject1, setTagBySubject1] = useState<any>();
  const [tagBySubject2, setTagBySubject2] = useState<any>();
  const [tagBySubject3, setTagBySubject3] = useState<any>();
  const [questionType, setQuestionType] = useState<any>(optionQuestionType[0]);
  const [levelType, setLevelType] = useState<{ value: string; label: string }>(
    optionLevelType[0],
  );
  const [difficulty, setDifficulty] = useState<any>(optionDifficulty[0]);
  const [lockNextLevel, setLockNextLevel] = useState<boolean>(true);
  const [timerType, setTimerType] = useState<any>(optionTimerBetweenPlay[0]);
  const [timerTime, setTimerTime] = useState<number>();
  const [wizardIndex, setWizardIndex] = useState<number>(0);

  const getFilteredOptions = (currentOptions: any[], excludedValues: string[]) => {
    return currentOptions.filter((option) => !excludedValues.includes(option.value));
  };
  const handleChangeOptions = (key: string, value: string) => {
    console.log('handleChangeOptions', key, value);
    // const selectedSubCriteriaValues = [
    //   subCriteria1?.value,
    //   subCriteria2?.value,
    //   subCriteria3?.value,
    // ].filter(Boolean);
    switch (key) {
      case 'bloomType':
        setBloomType(optionBloom.find((option) => option.value === value));
        break;
      case 'lesson':
        setLesson(optionLesson?.find((option) => option.value === value));
        break;
      case 'subLesson':
        setSubLesson(optionSubLesson?.find((option) => option.value === value));
        break;
      case 'subCriteria1':
        // กรองไม่ให้เลือกค่าที่ถูกเลือกแล้ว
        // if (selectedSubCriteriaValues.includes(value) && value !== subCriteria1?.value) {
        //   showMessage('ไม่สามารถเลือกตัวเลือกที่ซ้ำกันได้', 'warning');
        //   return;
        // }
        setSubCriteria1(
          optionSubCriteria1?.find((option) => option.id === Number(value)),
        );
        break;
      case 'subCriteria2':
        // กรองไม่ให้เลือกค่าที่ถูกเลือกแล้ว
        // if (selectedSubCriteriaValues.includes(value) && value !== subCriteria2?.value) {
        //   showMessage('ไม่สามารถเลือกตัวเลือกที่ซ้ำกันได้', 'warning');
        //   return;
        // }
        setSubCriteria2(
          optionSubCriteria2?.find((option) => option.id === Number(value)),
        );
        break;
      case 'subCriteria3':
        // กรองไม่ให้เลือกค่าที่ถูกเลือกแล้ว
        // if (selectedSubCriteriaValues.includes(value) && value !== subCriteria3?.value) {
        //   showMessage('ไม่สามารถเลือกตัวเลือกที่ซ้ำกันได้', 'warning');
        //   return;
        // }
        setSubCriteria3(
          optionSubCriteria3?.find((option) => option.id === Number(value)),
        );
        break;
      case 'tagBySubject1':
        setTagBySubject1(optionTagBySubject1?.find((option) => option.value === value));
        break;
      case 'tagBySubject2':
        setTagBySubject2(optionTagBySubject2?.find((option) => option.value === value));
        break;
      case 'tagBySubject3':
        setTagBySubject3(optionTagBySubject3?.find((option) => option.value === value));
        break;
      case 'questionType':
        setQuestionType(optionQuestionType.find((option) => option.value === value));
        break;
      case 'levelType':
        setLevelType(
          optionLevelType.find((option) => option.value === value) || optionLevelType[0],
        );
        break;
      case 'difficulty':
        setDifficulty(optionDifficulty.find((option) => option.value === value));
        break;
      case 'timerType':
        setTimerType(optionTimerBetweenPlay.find((option) => option.value === value));
        if (value === 'no') {
          setTimerTime(undefined);
        }
        break;
      case 'timerTime':
        setTimerTime(parseInt(value));
        break;
      default:
        break;
    }
  };

  // const handleChangeOptionsMulti = (key: string, value: object[]) => {
  //   console.log("handleChangeOptionsMulti", key, value);

  //   switch (key) {
  //     case 'tagBySubject1':
  //       setTagBySubject1(value);
  //       break;
  //     case 'tagBySubject2':
  //       setTagBySubject2(value);
  //       break;
  //     case 'tagBySubject3':
  //       setTagBySubject3(value);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const handleSave = async () => {
    console.log('handleSave');
    if (refForm.current) {
      const validate = refForm.current.reportValidity();
      if (validate) {
        const result = await SubmitOn();
        if (result) {
          if (academicLevel.id) {
            // navigate({
            //   to: `/content-creator/level/${subLessonId}/create-setting/${academicLevel.id}`,
            // });
          } else if (result && typeof result !== 'boolean' && result.id) {
            navigate({
              to: `/content-creator/level/${subLessonId}/create-setting/${result.id}`,
              replace: true,
            });
          }
        }
      }
    }
  };

  const handleNext = async () => {
    console.log('handleNext');
    if (refForm.current) {
      const validate = refForm.current.reportValidity();
      if (validate) {
        const result = await SubmitOn();
        if (result) {
          if (academicLevel.id) {
            navigate({
              to: `/content-creator/level/${subLessonId}/create-question/${academicLevel.id}`,
            });
          } else if (result && typeof result !== 'boolean' && result.id) {
            navigate({
              to: `/content-creator/level/${subLessonId}/create-question/${result.id}`,
              replace: true,
            });
          }
        }
      }
    }
  };

  const handlePublish = async () => {
    const dataLevel = {
      // wizard_index: 5,
      status: 'enabled' as keyof typeof AcademicLevelStatusType,
    };

    // if (academicLevel?.wizard_index > dataLevel.wizard_index) {
    //   dataLevel.wizard_index = academicLevel.wizard_index;
    // }

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

  const SubmitOn = async () => {
    console.log('SubmitOn');

    const data = {
      sub_lesson_id: parseInt(subLesson?.value),
      bloom_type: parseInt(bloomType?.value),
      tag_ids: [
        tagBySubject1?.value ? parseInt(tagBySubject1?.value) : null,
        tagBySubject2?.value ? parseInt(tagBySubject2?.value) : null,
        tagBySubject3?.value ? parseInt(tagBySubject3?.value) : null,
      ],
      sub_criteria_topic_ids: [
        subCriteria1?.id ? subCriteria1?.id : null,
        subCriteria2?.id ? subCriteria2?.id : null,
        subCriteria3?.id ? subCriteria3?.id : null,
      ],
      question_type: questionType?.value,
      level_type: levelType?.value,
      difficulty: difficulty?.value,
      lock_next_level: lockNextLevel,
      timer_type: timerType?.value,
      timer_time: timerTime,
      status: 'setting',
      wizard_index: 1,
      // "admin_login_as": "1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10"
    };

    if (academicLevelId) {
      // delete data.question_type;
      data.status = academicLevel.status;

      if (academicLevel?.wizard_index) {
        data.wizard_index = academicLevel.wizard_index;
      }

      console.log('Update', data);

      return API.academicLevel.Update(academicLevelId, data).then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
          setAcademicLevel(res.data?.[0]);
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
    } else {
      console.log('Create', data);

      return API.academicLevel.Create(data).then((res) => {
        if (res.status_code === 201) {
          showMessage('สร้างสำเร็จ', 'success');
          setAcademicLevel(res.data?.[0]);
          return res.data?.[0];
        } else {
          showMessage(res.message, 'error');
          return {};
        }
      });
    }
  };

  useEffect(() => {
    if (academicLevelId) {
      API.academicLevel.GetById(academicLevelId).then((res) => {
        if (res.status_code === 200) {
          setAcademicLevel(res.data?.[0]);
        } else {
          showMessage(`academicLevel.GetById: ${res.message}`, 'error');
        }
      });
    }
  }, [academicLevelId]);

  useEffect(() => {
    if (academicLevel?.subject_id) {
      API.academicLevel
        .GetG02D05A32LessonCaseListBySubject(academicLevel?.subject_id)
        .then((res) => {
          if (res.status_code === 200) {
            const options = convertDataToOptions(res.data);
            setOptionLesson(options);
            if (academicLevel.lesson_id) {
              setLesson(
                options.find((option) => option.value === academicLevel.lesson_id),
              );
            }
          } else {
            showMessage(`GetG02D05A32LessonCaseListBySubject: ${res.message}`, 'error');
          }
        });

      API.academicLevel.GetG02D05A34(academicLevel?.subject_id).then((res) => {
        if (res.status_code === 200) {
          if (res.data?.[0] && 'tags' in res.data[0]) {
            const options1: any[] = Array.isArray(res.data?.[0]?.tags)
              ? convertDataToOptions(res.data[0].tags)
              : [];
            setOptionTagBySubject1(options1);
            setNameTagBySubject1(res.data?.[0]?.name);

            if (academicLevel.tag_groups?.[0].tags?.[0]) {
              const tag1 = options1.find(
                (option) => option.value === academicLevel.tag_groups?.[0].tags?.[0].id,
              );
              setTagBySubject1(tag1);
            }
          }

          if (res.data?.[1] && 'tags' in res.data[1]) {
            const options2: any[] = Array.isArray(res.data?.[1]?.tags)
              ? convertDataToOptions(res.data[1].tags)
              : [];
            setOptionTagBySubject2(options2);
            setNameTagBySubject2(res.data?.[1]?.name);

            if (academicLevel.tag_groups?.[1].tags?.[0]) {
              const tag2 = options2.find(
                (option) => option.value === academicLevel.tag_groups?.[1].tags?.[0].id,
              );
              setTagBySubject2(tag2);
            }
          }

          if (res.data?.[2] && 'tags' in res.data[2]) {
            const options3: any[] = Array.isArray(res.data?.[2]?.tags)
              ? convertDataToOptions(res.data[2].tags)
              : [];
            setOptionTagBySubject3(options3);
            setNameTagBySubject3(res.data?.[2]?.name);

            if (academicLevel.tag_groups?.[2].tags?.[0]) {
              const tag3 = options3.find(
                (option) => option.value === academicLevel.tag_groups?.[2].tags?.[0].id,
              );
              setTagBySubject3(tag3);
            }
          }
        } else {
          showMessage(`GetG02D05A34: ${res.message}`, 'error');
        }
      });

      // if (academicLevel.curriculum_group_id) {
      //   const curriculum = optionCurriculumGroup.find(
      //     (option) => option.value === academicLevel.curriculum_group_id,
      //   );
      //   if (curriculum) {
      //     setCurriculumGroup(curriculum);
      //   } else {
      //     setCurriculumGroup({
      //       value: academicLevel.curriculum_group_id,
      //       label: academicLevel.curriculum_group_name,
      //     });
      //   }
      // }

      if (academicLevel.year_id) {
        const year = optionYear.find((option) => option.value === academicLevel.year_id);
        if (year) {
          setYear(year);
        } else {
          setYear({
            value: academicLevel.year_id,
            label: academicLevel.year_name,
          });
        }
      }

      if (academicLevel.subject_group_id) {
        const group = optionSubjectGroup.find(
          (option) => option.value === academicLevel.subject_group_id,
        );
        if (group) {
          setSubjectGroup(group);
        } else {
          setSubjectGroup({
            value: academicLevel.subject_group_id,
            label: academicLevel.subject_group_name,
          });
        }
      }

      if (academicLevel.subject_id) {
        const subject = optionSubject.find(
          (option) => option.value === academicLevel.subject_id,
        );
        if (subject) {
          setSubject(subject);
        } else {
          setSubject({
            value: academicLevel.subject_id,
            label: academicLevel.subject_name,
          });
        }
      }

      if (academicLevel.bloom_type) {
        const bloom = optionBloom.find(
          (option) => option.value === String(academicLevel.bloom_type),
        );
        if (bloom) {
          setBloomType(bloom);
        }
      }

      if (academicLevel.question_type) {
        const question = optionQuestionType.find(
          (option) => option.value === academicLevel.question_type,
        );
        if (question) {
          setQuestionType(question);
        }
      }

      if (academicLevel.level_type) {
        const level = optionLevelType.find(
          (option) => option.value === academicLevel.level_type,
        );
        if (level) {
          setLevelType(level);
        }
      }

      if (academicLevel.difficulty) {
        const difficulty = optionDifficulty.find(
          (option) => option.value === academicLevel.difficulty,
        );
        if (difficulty) {
          setDifficulty(difficulty);
        }
      }

      setLockNextLevel(academicLevel.lock_next_level);

      if (academicLevel.timer_type) {
        const timer = optionTimerBetweenPlay.find(
          (option) => option.value === academicLevel.timer_type,
        );
        if (timer) {
          setTimerType(timer);
        }
      }

      if (academicLevel.timer_time) {
        const timer = parseInt(academicLevel.timer_time || '');
        if (timer) {
          setTimerTime(timer);
        }
      }

      if (academicLevel.wizard_index) {
        console.log('wizard_index', academicLevel.wizard_index);

        setWizardIndex(academicLevel.wizard_index);
      }
    }
  }, [academicLevel]);

  useEffect(() => {
    if (lesson?.value) {
      API.academicLevel.GetG02D05A33(lesson?.value).then((res) => {
        if (res.status_code === 200) {
          const options = convertDataToOptions(res.data);
          setOptionSubLesson(options);
          if (academicLevel.sub_lesson_id) {
            setSubLesson(
              options.find((option) => option.value === academicLevel.sub_lesson_id),
            );
          }
        } else {
          showMessage(`GetG02D05A33: ${res.message}`, 'error');
        }
      });
    }
  }, [lesson]);

  useEffect(() => {
    if (!subLesson?.value) return;

    const fetchSubCriteria = async () => {
      const res =
        await API.academicLevel.GetG02D05A35SubCriteriaCaseListByCurriculumGroup(
          curriculumData?.id.toString(),
        );
      if (res.status_code !== 200) {
        showMessage(
          `GetG02D05A35SubCriteriaCaseListByCurriculumGroup: ${res.message}`,
          'error',
        );
        return;
      }

      const levelSubCriteria = academicLevel.sub_criteria as {
        id: number;
        index: number;
        sub_criteria_topics: SubCriteriaTopic[];
      }[];

      const criteriaData = res.data as {
        id: number;
        index: number;
        name: string;
        sub_criteria_topics: SubCriteriaTopic[];
      }[];

      const processSubCriteria = (
        index: number,
        setOption: Function,
        setName: Function,
        setCriteria: Function,
      ) => {
        const subCriteria = criteriaData
          .sort((a, b) => a.id - b.id)
          .find((item) => item.index === index);
        setOption(subCriteria?.sub_criteria_topics);
        setName(subCriteria?.name);

        const findLevelSubCriteria = levelSubCriteria
          ?.sort((a, b) => a.id - b.id)
          ?.find((item) => item.index === index);

        if (findLevelSubCriteria?.sub_criteria_topics?.[0] && subCriteria) {
          const selectedCriteria = subCriteria?.sub_criteria_topics?.find(
            (item) => item.id === findLevelSubCriteria?.sub_criteria_topics?.[0]?.id,
          );
          setCriteria(selectedCriteria);
        }
      };

      processSubCriteria(1, setOptionSubCriteria1, setNameSubCriteria1, setSubCriteria1);
      processSubCriteria(2, setOptionSubCriteria2, setNameSubCriteria2, setSubCriteria2);
      processSubCriteria(3, setOptionSubCriteria3, setNameSubCriteria3, setSubCriteria3);
    };

    const fetchStandard = async () => {
      const res = await API.academicLevel.GetG02D05A41(subLesson.value);
      if (res.status_code === 200) {
        setStandard(res.data?.[0]);
      } else {
        showMessage(`GetG02D05A41: ${res.message}`, 'error');
      }
    };

    fetchSubCriteria();
    fetchStandard();
  }, [subLesson, academicLevel, curriculumData]);

  useEffect(() => {
    if (curriculumId) {
      setCurriculumGroup({
        value: curriculumData?.id,
        label: curriculumData?.name,
      });
    }
  }, [curriculumId, curriculumData]);

  useEffect(() => {
    if (platformId && yearId) {
      API.academicLevel.GetYearList(String(platformId)).then((res) => {
        if (res.status_code === 200) {
          const options = convertDataToOptions(res.data, 'seed_year_short_name');
          setOptionYear(options);

          const year = options.find((option) => option.value === yearId);

          if (year) {
            setYear(year);
          }
        } else {
          showMessage(`GetYearList: ${res.message}`, 'error');
        }
      });
    }
  }, [platformId, yearId]);

  useEffect(() => {
    if (yearId && subjectGroupId) {
      API.academicLevel.GetSubjectGroupList(String(yearId)).then((res) => {
        if (res.status_code === 200) {
          const options = convertDataToOptions(res.data, 'seed_subject_group_name');
          setOptionSubjectGroup(options);

          const subjectGroup = options.find((option) => option.value === subjectGroupId);

          if (subjectGroup) {
            setSubjectGroup(subjectGroup);
          }
        } else {
          showMessage(`GetSubjectGroupList: ${res.message}`, 'error');
        }
      });
    }
  }, [yearId, subjectGroupId]);

  useEffect(() => {
    if (curriculumId && subjectId) {
      API.academicLevel.GetSubjectList(String(curriculumId)).then((res) => {
        if (res.status_code === 200) {
          const options = convertDataToOptions(res.data);
          setOptionSubjectGroup(options);

          const subject = options.find((option) => option.value === subjectId);

          if (subject) {
            setSubject(subject);
          }
        } else {
          showMessage(`GetSubjectList: ${res.message}`, 'error');
        }
      });
    }
  }, [curriculumId, subjectId]);

  useEffect(() => {
    if (subjectId) {
      API.academicLevel
        .GetG02D05A32LessonCaseListBySubject(String(subjectId))
        .then((res) => {
          if (res.status_code === 200) {
            const options = convertDataToOptions(res.data);
            setOptionLesson(options);
          } else {
            showMessage(`GetG02D05A32LessonCaseListBySubject: ${res.message}`, 'error');
          }
        });

      API.academicLevel.GetG02D05A34(String(subjectId)).then((res) => {
        if (res.status_code === 200) {
          if (res.data?.[0] && 'tags' in res.data[0]) {
            const options1: any[] = Array.isArray(res.data?.[0]?.tags)
              ? convertDataToOptions(res.data[0].tags)
              : [];
            setOptionTagBySubject1(options1);
            setNameTagBySubject1(res.data?.[0]?.name);
          }

          if (res.data?.[1] && 'tags' in res.data[1]) {
            const options2: any[] = Array.isArray(res.data?.[1]?.tags)
              ? convertDataToOptions(res.data[1].tags)
              : [];
            setOptionTagBySubject2(options2);
            setNameTagBySubject2(res.data?.[1]?.name);
          }

          if (res.data?.[2] && 'tags' in res.data[2]) {
            const options3: any[] = Array.isArray(res.data?.[2]?.tags)
              ? convertDataToOptions(res.data[2].tags)
              : [];
            setOptionTagBySubject3(options3);
            setNameTagBySubject3(res.data?.[2]?.name);
          }
        } else {
          showMessage(`GetG02D05A34: ${res.message}`, 'error');
        }
      });

      API.academicLevel.GetG02D02A26(String(subjectId)).then((res) => {
        if (res.status_code === 200) {
          setSubjectGroupId(res.data?.[0]?.subject_group_id);
        } else {
          showMessage(`GetG02D02A26: ${res.message}`, 'error');
        }
      });
    }
  }, [subjectId]);

  useEffect(() => {
    if (lessonId && optionLesson && !lesson && !academicLevelId) {
      const lesson = optionLesson.find((option) => option.value === lessonId);
      if (lesson) {
        setLesson(lesson);
      }
    }
  }, [lessonId, optionLesson]);

  useEffect(() => {
    if (subLessonId && optionSubLesson && !subLesson && !academicLevelId) {
      const subLesson = optionSubLesson.find(
        (option) => option.value.toString() === subLessonId,
      );
      if (subLesson) {
        setSubLesson(subLesson);
      }
    }
  }, [subLessonId, optionSubLesson]);

  useEffect(() => {
    if (subLessonId) {
      API.academicLevel.GetG02D04A07SubLessonById(subLessonId).then((res) => {
        if (res.status_code === 200) {
          setYearId(res.data?.[0]?.year_id);
          setSubjectId(res.data?.[0]?.subject_id);
          setLessonId(res.data?.[0]?.lesson_id);
          setPlatformId(res.data?.[0]?.platform_id);
        } else {
          showMessage(`GetG02D04A07SubLessonById: ${res.message}`, 'error');
        }
      });
    }
  }, [subLessonId]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

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
      />
      {/* <ModalSelect open={true} title="เลือกมาตรฐานย่อย 1" /> */}
      <form
        className="mt-5 w-full font-noto-sans-thai"
        ref={refForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} />
        </Box>

        <div className="flex gap-4 pt-5">
          <div className="flex w-2/3 flex-col gap-6">
            <Box>
              <div className="flex w-full justify-between">
                <h1 className="text-xl font-bold">ด่านที่ 1</h1>
                {/* <Button
                 className="btn btn-outline-primary w-44">
                  เรียงลำดับด่าน
                </Button
                > */}
              </div>
              <Divider />
              <div className="grid grid-cols-4 gap-4">
                <Select
                  label="สังกัดวิชา"
                  value={curriculumGroup}
                  // options={optionCurriculumGroup}
                  required
                  disabled
                />
                <Select
                  label="ชั้นปี"
                  value={year}
                  options={optionYear}
                  required
                  disabled
                />
                <Select
                  label="กลุ่มวิชา"
                  value={subjectGroup}
                  options={optionSubjectGroup}
                  required
                  disabled
                />
                <Select
                  label="วิชา"
                  value={subject}
                  options={optionSubject}
                  required
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="บทเรียน"
                  value={lesson}
                  options={optionLesson}
                  onChange={(option) => handleChangeOptions('lesson', option.value)}
                  required
                  disabled
                />
                <Select
                  label="บทเรียนย่อย"
                  value={subLesson}
                  options={optionSubLesson}
                  onChange={(option) => handleChangeOptions('subLesson', option.value)}
                  required
                  disabled
                />
              </div>

              <div className="my-4 grid w-full grid-cols-2 gap-2 rounded-md bg-gray-100 p-5 text-base">
                <div>สาระการเรียนรู้:</div>
                <div>{standard?.criteria_name}</div>
                <div>มาตรฐานหลัก:</div>
                <div>{standard?.learning_content_name}</div>
                <div>ตัวชี้วัด:</div>
                <div>{standard?.indicator_name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="ทฤษฎีการวัดพฤติกรรม (Bloom)"
                  value={bloomType}
                  options={optionBloom}
                  onChange={(option) => handleChangeOptions('bloomType', option.value)}
                  // required
                />
                <SubCriteria
                  label={nameSubCriteria1}
                  value={subCriteria1?.id}
                  onChange={handleChangeOptions}
                  optionsSubCriteriaTopic={optionSubCriteria1}
                  keyName="subCriteria1"
                />
                <SubCriteria
                  label={nameSubCriteria2}
                  value={subCriteria2?.id}
                  onChange={handleChangeOptions}
                  optionsSubCriteriaTopic={optionSubCriteria2}
                  keyName="subCriteria2"
                />
                <SubCriteria
                  label={nameSubCriteria3}
                  value={subCriteria3?.id}
                  onChange={handleChangeOptions}
                  optionsSubCriteriaTopic={optionSubCriteria3}
                  keyName="subCriteria3"
                />
                <Select
                  label={nameTagBySubject1}
                  value={tagBySubject1}
                  options={optionTagBySubject1}
                  onChange={(option) =>
                    handleChangeOptions('tagBySubject1', option.value)
                  }
                  // required
                  // isMulti
                />
                <Select
                  label={nameTagBySubject2}
                  value={tagBySubject2}
                  options={optionTagBySubject2}
                  onChange={(option) =>
                    handleChangeOptions('tagBySubject2', option.value)
                  }
                  // required
                />
                <Select
                  label={nameTagBySubject3}
                  value={tagBySubject3}
                  options={optionTagBySubject3}
                  onChange={(option) =>
                    handleChangeOptions('tagBySubject3', option.value)
                  }
                  // required
                />
              </div>
            </Box>

            <Box className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">ตั้งค่าคำถาม (ค่าเริ่มต้น)</h1>
                <p className="text-sm text-white-dark">
                  <span className="text-red-500">*</span>
                  กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว
                  คุณจะไม่สามารถแก้ไขการตั้งค่านี้ได้
                </p>
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-4">
                <div>รูปแบบคำถาม (ค่าเริ่มต้น):</div>
                <Select
                  className="w-full"
                  // label="รูปแบบคำถาม"
                  // defaultValue={optionQuestionType[0]}
                  options={optionQuestionType}
                  value={questionType}
                  onChange={(option) => handleChangeOptions('questionType', option.value)}
                  required
                  disabled={wizardIndex > 0 ? true : false}
                />
              </div>
              <Divider />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="ประเภทแบบฝึกหัด"
                  // defaultValue={optionLevelType[0]}
                  value={levelType}
                  options={optionLevelType}
                  onChange={(option) => handleChangeOptions('levelType', option.value)}
                  required
                  disabled={wizardIndex > 1 ? true : false}
                />
                <Select
                  label="ระดับความยาก"
                  // defaultValue={optionDifficulty[0]}
                  value={difficulty}
                  options={optionDifficulty}
                  onChange={(option) => handleChangeOptions('difficulty', option.value)}
                  required
                />
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <div>จำนวนคำถามที่แสดงในเกม:</div>
                <div>
                  {levelType.value === 'test'
                    ? 'สุ่มเลือก 3 คำถาม'
                    : levelType.value === 'sub-lesson-post-test'
                      ? 'สุ่มเลือก 15 คำถาม'
                      : 'ทุกคำถาม'}
                </div>
              </div>
            </Box>

            <Box className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">ตั้งค่าการการเล่นเกม</h1>
                <p className="text-sm text-white-dark">
                  <span className="text-red-500">*</span>
                  กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว
                  คุณจะไม่สามารถแก้ไขการตั้งค่านี้ได้
                </p>
              </div>
              <Divider />

              <div className="flex items-center gap-4">
                <label className="relative h-6 w-12">
                  <input
                    type="checkbox"
                    className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                    id="custom_switch_checkbox1"
                    checked={lockNextLevel}
                    onChange={(e) => setLockNextLevel(e.target.checked)}
                  />
                  <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-success peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                </label>
                <div>ล็อกด่าน: ไม่สามารถเล่นด่านต่อไปได้ ถ้าหากไม่ผ่านด่านนี้</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="การจับเวลาระหว่างเล่น (ค่าเริ่มต้น)"
                  value={timerType}
                  options={optionTimerBetweenPlay}
                  onChange={(option) => handleChangeOptions('timerType', option.value)}
                  required
                />
                <Input
                  type="number"
                  className="h-[38px]"
                  label="เวลา (วินาที)"
                  value={timerTime}
                  onInput={(e) => handleChangeOptions('timerTime', e.target.value)}
                  required
                  disabled={timerType?.value === 'no' ? true : false}
                />
              </div>
              <div className="mt-2">
                หากต้องการแก้ไขรูปแบบตัวอักษร ฉาก หรือตัวละครบอส กรุณาแก้ไขที่การตั้งค่า
                <a href="" className="text-primary underline">
                  ค่าเริ่มต้นการแสดงผลด่าน
                </a>
              </div>
            </Box>
            <Box className="flex w-full justify-between rounded-lg bg-[#F5F5F5] p-5 shadow-md">
              <FooterForm
                onSave={handleSave}
                onNext={handleNext}
                academicLevel={academicLevel}
              />
            </Box>
          </div>
          <div className="flex h-fit w-1/3 flex-col gap-6">
            <Box>
              <BaseInformation academicLevel={academicLevel} onOkPublic={handlePublish} />
            </Box>
          </div>
        </div>
      </form>
    </LayoutDefault>
  );
};

export default DomainJSX;
