import StoreGlobalPersist from '@store/global/persist';

export function getAcademicYearRange(): TStoreAcademicYearRangeData | null {
  const {
    academicYearRangeData,
  }: { academicYearRangeData: TStoreAcademicYearRangeData | null } =
    StoreGlobalPersist.StateGet(['academicYearRangeData']);

  return academicYearRangeData;
}

export function getDefaultAcademicYearRange(): TStoreAcademicYearRangeData | null {
  const {
    defaultAcademicYearRangeData,
  }: { defaultAcademicYearRangeData: TStoreAcademicYearRangeData | null } =
    StoreGlobalPersist.StateGet(['defaultAcademicYearRangeData']);

  return defaultAcademicYearRangeData;
}
