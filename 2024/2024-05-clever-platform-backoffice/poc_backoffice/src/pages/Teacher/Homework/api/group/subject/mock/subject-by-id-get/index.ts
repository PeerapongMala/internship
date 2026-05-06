import { APITypeAPIResponse } from "../../../../../../../../core/helper/api-type";
import { Subject } from "../../../../../type";
import MockJson from './index.json'

const SubjectByIdGet = (subjectId:string): APITypeAPIResponse<Subject | undefined> =>{
    return new Promise((resolve, reject) => {
        resolve({
          json: () => {
            return (MockJson as Subject[]).find((obj) => obj.id === subjectId);
          },
        });
      });
}
export default SubjectByIdGet;