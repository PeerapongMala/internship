import { AxiosError, AxiosResponse } from 'axios';
import { authInterceptor } from './auth';

const onFullFilled = (response: AxiosResponse<any, any>) => {
  return response;
};

const onRejected = (error: unknown) => {
  const err = error as AxiosError;

  if (err?.response?.status) {
    const statusCode = err.response.status;
    authInterceptor(statusCode);
  }

  return Promise.reject(error);
};

const axiosResponseInterceptor = {
  onFullFilled,
  onRejected,
};

export default axiosResponseInterceptor;
