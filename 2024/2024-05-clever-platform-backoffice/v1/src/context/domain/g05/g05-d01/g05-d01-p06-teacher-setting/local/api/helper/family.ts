import { TBasePaginationResponse, TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { EFamilyType, EManageFamilyType } from '../../enums/family';
import { TFamilyMemberUpdateTask } from '../../types/family';

export type TGetFamilyReq = { family_id: number };
export type TGetFamilyRes = TBaseResponse<{
  family_id: number;
  member: {
    user_id: string;
    title: string;
    first_name: string;
    last_name: string;
    role: EFamilyType;
    is_owner: boolean;
    image_url: string | null;
  }[];
}>;

export type TPostUpdateDataReq = {
  Body: {
    users: TFamilyMemberUpdateTask[];
    manage_family: EManageFamilyType;
    family_id?: number;
  };
};
export type TPostUpdateDataRes = TBasePaginationResponse<{}>;
