import dayjs from 'dayjs';
import { Nutritional } from '../../type';
import { TBaseResponse } from '@global/types/api';

export type TGetNutritionalListReq = {
  Param: {
    id: number | string;
  };
  Query?: {
    form_id?: number;
    search?: string;
    created_at_start?: dayjs.ConfigType;
    created_at_end?: dayjs.ConfigType;
  };
};

export type TGetNutritionalListRes = TBaseResponse<Nutritional[]>;
