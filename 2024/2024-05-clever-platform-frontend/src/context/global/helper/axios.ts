import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import axios, { CreateAxiosDefaults } from 'axios';
import axiosResponseInterceptor from './interceptor/index-axios';

const BACKEND_URL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const config: CreateAxiosDefaults = {
  baseURL: BACKEND_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};

const instance = axios.create(config);

const axiosWithAuth = instance;

axiosWithAuth.interceptors.response.use(
  axiosResponseInterceptor.onFullFilled,
  axiosResponseInterceptor.onRejected,
);

export default axiosWithAuth;
