import API from '@domain/g02/g02-d05/local/api';
import {
  AcademicLevel,
  HintType,
  QuestionInputType,
  Image,
  Question,
  TranslationText,
  TranslationTextGroup,
  TranslationTextQuestion,
} from '@domain/g02/g02-d05/local/type';
import { convertRowsColumns } from '@domain/g02/g02-d05/local/util';
import { optionsAnswerSelect } from '../options';
import showMessage from '@global/utils/showMessage';

const SubmitOnFormInput = async ({
  academicLevelId,
  academicLevel,
  timerType,
  timerTime,
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
}: {
  academicLevelId: string;
  academicLevel: AcademicLevel;
  timerType: string;
  timerTime: number;
  selectedLayoutPattern: string;
  selectedLayoutRatio: string;
  selectedPatternAnswer: string;
  selectedPatternGroup: string;
  enforceDescriptionLanguage: boolean;
  enforceChoiceLanguage: boolean;
  useSoundDescriptionOnly: boolean;
  inputTopic: TranslationText | undefined;
  inputQustion: TranslationText | undefined;
  inputQustionList: TranslationTextQuestion[];
  inputHint: TranslationText | undefined;
  selectedAnswerType: string;
  // inputAnswerList: TranslationText[];
  // inputAnswerListFake: TranslationText[];
  inputAnswerGroupList: TranslationTextGroup[];
  inputCorrectText: TranslationText | undefined;
  inputWrongText: TranslationText | undefined;
  inputHintImage: Image[];
  inputQustionImage: Image[];
  selectedQuestion: Question | null;
  selectedQuestionType: { value: string; label: string };
  selectedCanReuseChoice: boolean;
  // required, ประเภทคำใบ้คำตอบ (none = ไม่แสดงคำใบ้ / count = แสดงจำนวนตัวอักษร / pre-post-count = แสดงจำนวนตัวอักษร + หัวท้าย / prepost = แสดงหัวท้าย)
  selectedHintType: HintType;
  selectedQuestionInputType: QuestionInputType;
}) => {
  if (!academicLevel) {
    showMessage('ไม่พบข้อมูลระดับชั้น', 'error');
    return false;
  }

  const formData = new FormData();

  const descriptions = inputQustionList.map((item) => {
    return {
      index: item.index,
      text: item.value,
      answers: item.answerList.map((answer) => {
        return {
          index: answer.index,
          type: answer.type,
          text: answer.text.map((text) => {
            return {
              index: text.index,
              text: text.text,
            };
          }),
        };
      }),
    };
  });

  formData.append('timer_type', timerType);
  formData.append('timer_time', timerTime.toString());
  formData.append('choice_position', selectedLayoutPattern);
  formData.append('layout', selectedLayoutRatio);
  formData.append('left_box_columns', convertRowsColumns(selectedPatternAnswer));
  formData.append('bottom_box_columns', convertRowsColumns(selectedPatternGroup));
  formData.append(
    'enforce_description_language',
    enforceDescriptionLanguage ? 'true' : 'false',
  );
  formData.append('enforce_choice_language', enforceChoiceLanguage ? 'true' : 'false');
  formData.append('command_text_id', inputTopic?.id || '');
  formData.append('description_text_id', inputQustion?.id || '');
  formData.append('hint_text_id', inputHint?.id || '');
  formData.append(
    'use_sound_description_only',
    useSoundDescriptionOnly ? 'true' : 'false',
  );
  formData.append('group_amount', inputAnswerGroupList.length.toString());
  formData.append('choice_type', selectedAnswerType);
  // formData.append("choice_amount", inputAnswerList.length.toString());
  // formData.append("dummy_amount", inputAnswerListFake.length.toString());
  formData.append('can_reuse_choice', selectedCanReuseChoice ? 'true' : 'false');
  formData.append('descriptions', JSON.stringify(descriptions));

  inputCorrectText?.id && formData.append('correct_text_id', inputCorrectText?.id);
  inputWrongText?.id && formData.append('wrong_text_id', inputWrongText?.id);
  formData.append('hint_image', inputHintImage[0]?.file || '');
  formData.append('hint_type', selectedHintType);
  formData.append('input_type', selectedQuestionInputType);
  formData.append('description_image', inputQustionImage[0]?.file || '');
  if (inputHintImage.length === 0 && selectedQuestion?.image_hint_url) {
    formData.append('delete_hint_image', 'true');
  }

  if (inputQustionImage.length === 0 && selectedQuestion?.image_description_url) {
    formData.append('delete_description_image', 'true');
  }
  if (selectedQuestion?.id) {
    console.log('Update', formData);

    return API.academicLevel
      .UpdateG02D05A25(selectedQuestion?.id.toString(), formData)
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
  } else {
    formData.append('level_id', academicLevelId);
    formData.append('question_type', selectedQuestionType.value);
    formData.append('left_box_columns', '2 columns');
    formData.append('left_box_rows', 'auto');
    formData.append('bottom_box_rows', 'auto');
    formData.append('correct_choice_amount', 'one');

    console.log('Create', formData);

    return API.academicLevel.CreateG02D05A24(formData).then((res) => {
      if (res.status_code === 201) {
        showMessage('สร้างสำเร็จ', 'success');
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });
  }
};

export default SubmitOnFormInput;
