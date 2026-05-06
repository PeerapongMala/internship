import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { TSchoolData } from '../../types';

export type TGetSchoolDetailByClassIDRes = TBaseResponse<TSchoolData[]>;
