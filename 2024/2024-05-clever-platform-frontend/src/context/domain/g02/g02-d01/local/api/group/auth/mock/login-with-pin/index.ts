import { responseFailed, responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';
import {
  LoginWithPinDataResponse,
  LoginWithPinRequest,
} from '@domain/g02/g02-d01/local/type';
import data from './data.json';

const LoginWithPin = (
  body: LoginWithPinRequest,
): Promise<DataAPIResponse<LoginWithPinDataResponse>> => {
  const targetUser = data.find(
    (user) =>
      user.student_id === body.student_id && user.school_code === body.school_code,
  );
  if (!targetUser)
    Promise.resolve(responseFailed({ statusCode: 404, message: 'User not found' }));

  if (targetUser && body.pin === '1234') {
    return Promise.resolve(
      responseOk({
        data: targetUser as LoginWithPinDataResponse,
        message: 'Login Successfully',
      }),
    );
  }
  return Promise.resolve(responseFailed({ statusCode: 401, message: 'Wrong password' }));
};

export default LoginWithPin;
