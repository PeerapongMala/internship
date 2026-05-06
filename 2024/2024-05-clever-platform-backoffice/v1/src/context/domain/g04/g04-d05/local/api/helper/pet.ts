import { Pet } from '../../type';

export type TBaseResponse = {
  status_code: number;
  message: string;
};

export type TGetListPetReq = {
  Query: {
    search?: string;
    status?: string;
    started_at_start?: Date;
    started_at_end?: Date;
    ended_at_start?: Date;
    ended_at_end?: Date;
  };
};

export type TGetListPetRes = TBaseResponse & {
  data: Pet[];
};
