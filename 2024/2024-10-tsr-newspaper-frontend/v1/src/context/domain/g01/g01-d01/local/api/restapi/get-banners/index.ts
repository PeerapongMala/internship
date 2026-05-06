// Get Banner
export interface BannerProp {
    id: number;
    display_order: number;
    banner_image_url: string;
    link_url: string;
    position: string;
    status: string;
    created_at?: string;
    created_by?: number;
    updated_at?: string;
    updated_by?: number;
  }
  
  export const GetBanners = async (): Promise<BannerProp[]> => {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  
    const response = await fetch(`${BACKEND_URL}/banner/v1/images`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }
  
    const data = await response.json();
  
    // (optional) Clean/transform data
    return data.map((item: BannerProp) => ({
      ...item,
    }));
  };