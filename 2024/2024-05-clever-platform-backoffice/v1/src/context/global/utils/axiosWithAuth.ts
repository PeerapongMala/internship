import StoreGlobalPersist from '@store/global/persist';
import axios, { CreateAxiosDefaults } from 'axios';
import axiosResponseInterceptor from './interceptor/index-axios';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
const accessToken: string = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

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
