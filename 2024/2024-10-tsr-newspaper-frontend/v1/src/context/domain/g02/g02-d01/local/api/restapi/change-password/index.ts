export interface ChangePassword {
    password: string;
    new_password: string;
    confirm_new_password: string;
  }
  
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  
  export const changeUserPassword = async (
    accessToken: string,
    payload: ChangePassword
  ): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/profile/password`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  
    // Optional: handle response if needed
    await response.json();
  };
  