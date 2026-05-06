import { APITypeAPIResponse } from '../../../../../../../../core/helper/api-type';
import { Subject } from '../../../../../type';
import MockJson from './index.json'


const SubjectAllGet = (): Promise<{ json: () => Subject[] }> => {
    return new Promise((resolve, reject) => {
        resolve({ json: () => MockJson });
    });
};

export default SubjectAllGet;
