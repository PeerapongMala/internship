import { data } from './data';

export const inspectionAreaList = data.map((record) => record.inspectionArea);
export const areaOfficeList = data.reduce<string[]>(
  (prev, record) => [...prev, ...record.areaOffice],
  [],
);

export const getAreaOfficeByInspectionArea = (inspectionArea: string) => {
  return data.find((record) => record.inspectionArea.value === inspectionArea)
    ?.areaOffice;
};
