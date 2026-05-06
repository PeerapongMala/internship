import { authInterceptor } from './auth';

const fetchResponseInterceptor = async (originalResponse: Response) => {
  const response = originalResponse.clone();

  authInterceptor(response.status);
};

export default fetchResponseInterceptor;
