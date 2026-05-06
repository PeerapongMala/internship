import { APITypeAPIResponse } from "../../../../../../../../core/helper/api-type";
import { SubjectLessons } from "../../../../../type";
import MockJson from './index.json'

const LessonAllGet = (
    subjectId: string,
  ): APITypeAPIResponse<SubjectLessons | undefined> => {
    return new Promise((resolve, reject) => {
      resolve({
        json: () => (MockJson as SubjectLessons[]).find((obj) => obj.id === subjectId),
      });
    });
  };
  
  export default LessonAllGet;