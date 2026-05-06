import { APITypeAPIResponse } from '../../../../../../../../core/helper/api-type';
import { LessonDetail, SubjectLessons } from '../../../../../type';
import MockJson from './index.json';

const LessonDetailGet = (
  subjectId: string,
  lessonId: string,
): APITypeAPIResponse<LessonDetail | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => {
        const subject = (MockJson as SubjectLessons[]).find((obj) => {
          return obj.id === subjectId;
        });

        if (subject) return subject.lessons.find((obj) => obj.id === lessonId);
      },
    });
  });
};

export default LessonDetailGet;
