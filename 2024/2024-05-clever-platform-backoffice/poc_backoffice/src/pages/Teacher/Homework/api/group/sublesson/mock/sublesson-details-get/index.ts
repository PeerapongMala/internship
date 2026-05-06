import { APITypeAPIResponse } from '../../../../../../../../core/helper/api-type';
import { LessonDetail, SubjectLessons } from '../../../../../type';
import MockJson from './index.json';

const SublessonDetailGet = (
  subjectId: string,
  lessonId: string,
  sublessonId: string,
): APITypeAPIResponse<LessonDetail | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => {
        const subject = (MockJson as SubjectLessons[]).find((obj) => {
          return obj.id === subjectId;
        });
        if (!subject) return;

        const lesson = subject.lessons.find((obj) => obj.id === lessonId);
        if (!lesson) return;

        return lesson.sublessons?.find((obj) => obj.id === sublessonId);
      },
    });
  });
};

export default SublessonDetailGet;