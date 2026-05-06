import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import router from '../router-global';

export const authInterceptor = (statusCode: number) => {
  if (statusCode == 401) {
    router.navigate({ to: '/' });
    (StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']).clearAll();
  }
};
