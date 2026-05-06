import { AxiosError, AxiosResponse } from 'axios';
import { getFamily } from '../group/family/get-family-member/restapi';
import { TGetFamilyReq, TPostUpdateDataReq, TPostUpdateDataRes } from '../helper/family';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { TFamily } from '../../types/family';
import { postUpdateData } from '../group/family/post-update/restapi';

export interface IFamilyRepository {
  GetFamily: (req: TGetFamilyReq) => Promise<AxiosResponse<TBaseResponse<TFamily>, any>>;

  PostUpdateData: (
    req: TPostUpdateDataReq,
    onError?: (error: AxiosError) => void,
  ) => Promise<TPostUpdateDataRes>;
}

export const FamilyRepository: IFamilyRepository = {
  GetFamily: getFamily,
  PostUpdateData: postUpdateData,
};
