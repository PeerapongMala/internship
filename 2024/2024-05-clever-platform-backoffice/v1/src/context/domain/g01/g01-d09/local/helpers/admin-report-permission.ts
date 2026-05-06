import { EAdminReportPermissionStatus } from '../enums/admin-permission';

export const ADMINISTRATIVE_ROLES = {
  schoolExecutives: 'schoolExecutives',
  ministryExecutives: 'ministryExecutives',
  primaryEdServiceAreaExecutives: 'primaryEdServiceAreaExecutives',
  regionalGroupExecutives: 'regionalGroupExecutives',
  areaExecutives: 'areaExecutives',
  privateEdCommissionExecutives: 'privateEdCommissionExecutives',
  municipalExecutives: 'municipalExecutives',
} as const;

export type AdministrativeRoleKey = keyof typeof ADMINISTRATIVE_ROLES;
export function getAdministrativeRole(key: AdministrativeRoleKey) {
  return ADMINISTRATIVE_ROLES[key];
}

// TH
export const ADMINISTRATIVE_ROLES_TH_TO_EN = {
  ผู้บริหารโรงเรียน: 'schoolExecutives',
  ผู้บริหารกระทรวง: 'ministryExecutives',
  'ผู้บริหาร สพป.': 'primaryEdServiceAreaExecutives',
  'ผู้บริหาร กลุ่มเขต': 'regionalGroupExecutives',
  'ผู้บริหาร เขตพื้นที่': 'areaExecutives',
  'ผู้บริหารเครือโรงเรียนประเภท (สช)': 'privateEdCommissionExecutives',
  'ผู้บริหาร เทศบาล': 'municipalExecutives',
} as const;

export type AdministrativeRoleThaiKey = keyof typeof ADMINISTRATIVE_ROLES_TH_TO_EN;
export function getAdministrativeRoleFromThai(key: AdministrativeRoleThaiKey) {
  return ADMINISTRATIVE_ROLES_TH_TO_EN[key];
}

// EN ➔ TH
export const ADMINISTRATIVE_ROLES_EN_TO_TH = Object.fromEntries(
  Object.entries(ADMINISTRATIVE_ROLES_TH_TO_EN).map(([th, en]) => [en, th]),
) as {
  [K in (typeof ADMINISTRATIVE_ROLES)[keyof typeof ADMINISTRATIVE_ROLES]]: keyof typeof ADMINISTRATIVE_ROLES_TH_TO_EN;
};
export function getAdministrativeRoleInThai(
  key: keyof typeof ADMINISTRATIVE_ROLES_EN_TO_TH,
) {
  return ADMINISTRATIVE_ROLES_EN_TO_TH[key];
}

export function isAdministrativeKey(
  inputKey: string | undefined | null,
  targetLabel: string,
): boolean {
  const targetKey = (Object.keys(ADMINISTRATIVE_ROLES) as AdministrativeRoleKey[]).find(
    (key) => ADMINISTRATIVE_ROLES[key] === targetLabel,
  );
  if (!targetKey) return false;
  return inputKey === ADMINISTRATIVE_ROLES[targetKey];
}

export const getAdministrativeRoleOptions = (key: AdministrativeRoleKey) => {
  return key as string;
};

export type TObserverAccesses = {
  id?: number;
  name: string;
  accessName: string;
  districtZone?: string;
  areaOffice?: string;
  districtGroup?: string;
  district?: string;
  schoolAffiliationType?: string;
  schoolAffiliationId?: number | null;
  status: EAdminReportPermissionStatus;
  updatedAt?: Date | null;
  updatedBy?: string | null;
};
