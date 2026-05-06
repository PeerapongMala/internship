import getSchoolDetailByClassID from '../group/local/get-school-detail-by-class-id/restapi';
import { TGetSchoolDetailByClassIDRes } from '../helper/local';

export interface ILocalRepository {
  GetSchoolDetailByClassID: (classId: string) => Promise<TGetSchoolDetailByClassIDRes>;
}

export const LocalRepository: ILocalRepository = {
  GetSchoolDetailByClassID: getSchoolDetailByClassID,
};
