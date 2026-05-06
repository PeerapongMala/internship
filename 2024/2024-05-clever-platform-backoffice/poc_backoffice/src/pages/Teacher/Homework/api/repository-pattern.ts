import { APITypeAPIResponse } from '../../../../core/helper/api-type';
import { LessonDetail, Subject, SubjectLessons, SublessonDetail } from '../type';

export interface RepositoryPatternInterface {
    Lesson: {
        LessonAll: {
            Get(subjectId: string): APITypeAPIResponse<SubjectLessons | undefined>;
        };
        LessonDetail: {
            Get(subjectId: string, lessonId: string): APITypeAPIResponse<LessonDetail | undefined>;
        };
    };
    Sublesson: {
        SublessonAll: {
            Get(subjectId: string, lessonId: string): APITypeAPIResponse<LessonDetail | undefined>;
        };
        SublessonDetail: {
            Get(subjectId: string, lessonId: string, sublessonId: string): APITypeAPIResponse<SublessonDetail | undefined>;
        };
        SublessonById: {
            Get(subjectId: string): APITypeAPIResponse<SublessonDetail | undefined>;
        };
    };
    Subject: {
        SubjectAll: { Get(): APITypeAPIResponse<Subject[]> };
        SubjectById: {
            Get(subjectId: string): APITypeAPIResponse<Subject | undefined>;
        };
    };  
}
