import { data } from './data';

export const districtZonesList = data.map((record) => record.districtGroup);
export const districtsList = data.reduce<string[]>(
  (prev, record) => [...prev, ...record.districts],
  [],
);
export const getDistrictsByDistrictZone = (districtZone: string) => {
  return data.find((record) => record.districtGroup === districtZone)?.districts;
};
