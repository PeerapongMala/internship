// Get Header
export interface HeaderData {
    id: number;
    display_order: number;
    cover_image_url: string;
    created_at: string;
    created_by: number;
    updated_at: string;
    updated_by: number;
  }
  
  export const GetHeader = async (): Promise<HeaderData[]> => {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
    const url = `${BACKEND_URL}/cover/v1/images`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
  
    const data: HeaderData[] = await response.json();
  
    return data.map(item => ({
      ...item,
    }));
  };
  