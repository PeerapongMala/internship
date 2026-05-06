import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import router from './router-global';

export const handleLogout = () => {
  StoreGlobalPersist.MethodGet().clearFields(
    'accessToken',
    'userData',
    'adminId',
    'adminFullname',
    'userAvatar',
    'userPet',
  );
  StoreSubjects.MethodGet().clearAll();

  const { userDatas } = StoreGlobalPersist.StateGetAllWithUnsubscribe();
  router?.navigate({ to: userDatas.length > 0 ? '/pin' : '/login-id', replace: true });
};
