import { ObjectSchema, object, string, number, mixed } from 'yup';
import {
  CreatedAffiliationContract,
  UpdatedAffiliationContract,
  UseStatus,
} from './type';

export const CreatedAffiliationContractSchema: ObjectSchema<CreatedAffiliationContract> =
  object({
    school_affiliation_id: string().required(), // required, id ของสังกัดโรงเรียน
    name: string().required(), // required, ชื่อสัญญา
    start_date: string().datetime().required(), // required, วันที่เริ่มต้นสัญญา
    end_date: string().datetime().required(), // required, วันที่สิ้นสุดสัญญา
    wizard_index: number().integer().min(1).max(4).required(), // required, index ของ wizard (1-4)
  });

export const UpdatedAffiliationContractSchema: ObjectSchema<UpdatedAffiliationContract> =
  object({
    name: string().optional(), // optional, ชื่อสัญญา
    start_date: string().datetime().optional(), // optional, วันที่เริ่มต้นสัญญา
    end_date: string().datetime().optional(), // optional, วันที่สิ้นสุดสัญญา
    status: mixed<UseStatus>().oneOf(Object.values(UseStatus)), // optional, สถานะ (enabled / disabled / draft)
    wizard_index: number().integer().min(1).max(4).optional(), // optional, index ของ wizard (1-4)
  });
