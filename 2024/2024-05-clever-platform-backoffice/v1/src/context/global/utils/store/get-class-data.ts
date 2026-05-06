import StoreGlobalPersist from '@store/global/persist';

export function getClassData(): TStoreClassData | undefined {
  const { classData }: { classData: TStoreClassData | undefined } =
    StoreGlobalPersist.StateGet(['classData']);

  return classData;
}
