// Get FAQ
export const GetFaq =  async (page: number = 1, limit: number = 3): Promise<any> => {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
    const url = `${BACKEND_URL}/faqs/v1/faqs?page=${page}&limit=${limit}`;
  
    try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'appication/json'
      },
    });
    const responseData = await res.json();
    return responseData;
  } catch (err) {
    console.error('Fag not get', err);
  }
  }
  
  