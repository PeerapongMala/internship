import { responseFailed } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';
import { CheckinRequest, CheckinResponse } from '../../../../../type';

const CheckinPost = (body: CheckinRequest): Promise<DataAPIResponse<CheckinResponse>> => {
  if (!body.bulk_edit_list || !body.bulk_edit_list) {
    return Promise.resolve(
      responseFailed({
        statusCode: 400,
        message: 'Missing required fields',
      }),
    );
  }

  return Promise.resolve({
    status_code: 200,
    message: 'success with checkin date is before than last checkin',
    data: {
      statusCode: 200,
      message: 'success with checkin date is before than last checkin',
    },
  });
};

export default CheckinPost;
