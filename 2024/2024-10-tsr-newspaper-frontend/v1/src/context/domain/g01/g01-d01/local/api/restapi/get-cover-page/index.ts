
import { useState, useEffect } from 'react';

export interface CoverPage {
  ID: number;
  PublicDate: string;
  Template: string;
  Param: string;
  FileURL: string;
  PreviewURL: string;
  CreatedAt: string;
  CreatedBy: number;
  UpdatedAt: string;
  UpdatedBy: number;
  NewspaperID: number;

}
export const getCoverPages = (params: { date?: string; start_date?: string; end_date?: string }) => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const [coverPages, setCoverPages] = useState<CoverPage[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildQueryString = (params: { [key: string]: string | undefined }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        query.append(key, value);
      }
    });
    return query.toString();
  };


  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const queryString = buildQueryString(params);
    console.log({queryString:queryString})
    const url = `${BACKEND_URL}/newspaper/cover_newspaper/list?${queryString}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log({response:response})
        return response.json();
      })

      .then((data) => {
        console.log({ rawData: data });
      
        // ตรวจสอบว่า data มีโครงสร้างตามที่คาดหวัง
        const transformedData = Array.isArray(data.data)
          ? data.data.map((item: CoverPage) => ({
              ID: item.ID,
              PublicDate: item.PublicDate,
              Template: item.Template,
              Param: item.Param,
              FileURL: item.FileURL,
              PreviewURL: item.PreviewURL,
              CreatedAt: item.CreatedAt,
              CreatedBy: item.CreatedBy,
              UpdatedAt: item.UpdatedAt,
              UpdatedBy: item.UpdatedBy,
              NewspaperID: item.NewspaperID,
            }))
          : [];
      
        console.log({ transformedCoverData: transformedData });
        setCoverPages(transformedData);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { coverPages, isLoading, error };
};
