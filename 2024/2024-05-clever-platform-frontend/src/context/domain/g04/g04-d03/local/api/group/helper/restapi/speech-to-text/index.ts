import {
  convertToDataResponse,
  convertTOFormData,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import {
  SpeechToTextDataResponse,
  SpeechToTextRequest,
} from '@domain/g04/g04-d03/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const SpeechToText = (
  body: SpeechToTextRequest,
): Promise<DataAPIResponse<SpeechToTextDataResponse>> => {
  const url = `${backendURL}/speech-to-text/v1/transcribe`;
  const formData = convertTOFormData(body);
  console.log('formData', formData);

  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<SpeechToTextDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default SpeechToText;
