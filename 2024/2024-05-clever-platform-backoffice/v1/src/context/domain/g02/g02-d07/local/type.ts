export enum ManageYearStatus {
  IN_USE = 'ใช้งาน',
  DRAFT = 'แบบร่าง',
  NOT_IN_USE = 'ไม่ใช้งาน',
}

export interface IManageYear {
  id: number;
  manageyearId: string;
  manageyearName: string;
  name: string;
  manageyearShortName: string;
  manageyearInspectionArea: string;
  manageyearArea: string;
  mangeyearType: string;
  courseCount: number;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
  status: ManageYearStatus;
  filterCode: string;
}
