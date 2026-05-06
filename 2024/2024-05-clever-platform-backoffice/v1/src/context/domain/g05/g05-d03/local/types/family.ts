import { EFamilyType } from '../enums/family';

export type TFamily = {
  id: string;
  familyId: string;
  ownerId: string;
  members: TFamilyMember[];
};

export type TFamilyMember = {
  id: string;
  type: EFamilyType;
  name: string;
  img_url?: string;
};
