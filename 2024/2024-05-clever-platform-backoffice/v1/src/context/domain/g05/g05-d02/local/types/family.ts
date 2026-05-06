import { EFamilyTaskType, EFamilyType } from '../enums/family';

export type TFamily = {
  id: number;
  family_id: number;
  members: TFamilyMember[];
};

export type TFamilyMember = {
  user_id: string;
  role: EFamilyType;
  title: string;
  first_name: string;
  last_name: string;
  is_owner: boolean;
  img_url?: string;
};

export type TFamilyMemberUpdateTask = {
  user_id: string;
  task: EFamilyTaskType;
};
