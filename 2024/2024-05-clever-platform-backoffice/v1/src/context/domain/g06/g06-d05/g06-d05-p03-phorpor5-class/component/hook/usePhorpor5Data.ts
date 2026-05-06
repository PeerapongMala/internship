import API from '@domain/g06/g06-d05/local/api';
import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import { useState, useEffect } from 'react';

export const usePhorpor5Data = (evaluationFormId: number, tabId: number) => {
  const [data, setData] = useState<IGetPhorpor5Detail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (evaluationFormId && tabId) {
      setLoading(true);
      API.GetDetailPhorpor5(evaluationFormId, tabId, {})
        .then((res) => {
          if (res?.status_code === 200) {
            setData(res.data);
          }
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [evaluationFormId, tabId]);

  return { data, loading, error, setData };
};
