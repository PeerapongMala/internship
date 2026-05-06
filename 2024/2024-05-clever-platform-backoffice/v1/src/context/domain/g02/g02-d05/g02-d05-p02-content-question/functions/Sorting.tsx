import API from '@domain/g02/g02-d05/local/api';
import {
  AcademicLevel,
  Image,
  Question,
  TranslationText,
} from '@domain/g02/g02-d05/local/type';
import { convertRowsColumns } from '@domain/g02/g02-d05/local/util';
import { optionsAnswerSelect } from '../options';
import showMessage from '@global/utils/showMessage';

const SubmitOnSorting = async ({
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
  inputHint: TranslationText | undefined;
  selectedAnswerType: string;
  inputAnswerList: TranslationText[];
  inputAnswerListFake: TranslationText[];
  inputCorrectText: TranslationText | undefined;
  inputWrongText: TranslationText | undefined;
  inputHintImage: Image[];
  inputQustionImage: Image[];
  inputAnswerListSortByAnswerIndexes: {
    inputAnswerIndex: number;
    answerIndex: number;
  }[];
  selectedQuestion: Question | null;
  selectedQuestionType: { value: string; label: string };
  selectedCanReuseChoice: boolean;
}) => {
  if (!academicLevel) {
    showMessage('ไม่พบข้อมูลระดับชั้น', 'error');
    return false;
  }

  const formData = new FormData();
  const textOrImageChoices: {
    saved_text_group_id?: string;
    index: number;
    is_correct: boolean;
    point?: number | null | undefined;
    file?: File;
    image_key?: string;
    answer_indexes?: number[];
  }[] = [];

  inputAnswerList.map((item, index) => {
    if (item?.index) {
      const answer_indexes = inputAnswerListSortByAnswerIndexes
        .filter((_item) => _item.inputAnswerIndex === item.index)
        .map((_item) => _item.answerIndex);

      textOrImageChoices.push({
        saved_text_group_id: item.id,
        index: item.index,
        is_correct: true,
        point: item.point || 0,
        file: item.file?.file,
        image_key: item?.image_key,
        answer_indexes: answer_indexes,
      });
    }
  });

  inputAnswerListFake.map((item, index) => {
    if (item?.index) {
      textOrImageChoices.push({
        saved_text_group_id: item.id,
        index: item.index,
        is_correct: false,
        point: item.point || 0,
        file: item.file?.file,
        image_key: item?.image_key,
        answer_indexes: [],
      });
    }
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
  inputTopic?.id && formData.append('command_text_id', inputTopic?.id || '');
  inputQustion?.id && formData.append('description_text_id', inputQustion?.id || '');
  inputHint?.id && formData.append('hint_text_id', inputHint?.id || '');
  formData.append(
    'use_sound_description_only',
    useSoundDescriptionOnly ? 'true' : 'false',
  );
  formData.append('choice_type', selectedAnswerType);
  formData.append('can_reuse_choice', selectedCanReuseChoice ? 'true' : 'false');
  formData.append('choice_amount', inputAnswerList.length.toString());
  formData.append('dummy_amount', inputAnswerListFake.length.toString());
  if (inputHintImage.length === 0 && selectedQuestion?.image_hint_url) {
    formData.append('delete_hint_image', 'true');
  }

  if (inputQustionImage.length === 0 && selectedQuestion?.image_description_url) {
    formData.append('delete_description_image', 'true');
  }
  if (selectedAnswerType === 'text-speech') {
    const textChoices = textOrImageChoices.map((item) => {
      delete item.file;
      return item;
    });
    formData.append('text_choices', JSON.stringify(textChoices));
    formData.append('image_choices', '');
  } else if (selectedAnswerType === 'image') {
    let imageChoices = textOrImageChoices.map((item) => {
      delete item.saved_text_group_id;
      return item;
    });

    imageChoices.map((item, index) => {
      formData.append(`choice_images_${item.index}`, item.file || 'null');
    });

    imageChoices = imageChoices.map((item) => {
      delete item.file;
      return item;
    });

    formData.append('image_choices', JSON.stringify(imageChoices));
    formData.append('text_choices', '');
  }
  inputCorrectText?.id && formData.append('correct_text_id', inputCorrectText?.id);
  inputWrongText?.id && formData.append('wrong_text_id', inputWrongText?.id);
  formData.append('hint_image', inputHintImage[0]?.file || '');
  formData.append('description_image', inputQustionImage[0]?.file || '');

  if (selectedQuestion?.id) {
    console.log('Update', formData);

    return API.academicLevel
      .UpdateG02D05A17(selectedQuestion?.id.toString(), formData)
      .then((res) => {
        if (res.status_code === 200) {
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

    return API.academicLevel.CreateG02D05A16(formData).then((res) => {
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

export default SubmitOnSorting;
