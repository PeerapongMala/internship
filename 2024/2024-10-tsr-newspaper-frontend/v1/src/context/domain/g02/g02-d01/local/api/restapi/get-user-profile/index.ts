import { ProfileFormData } from './type'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const getUserProfile = async (accessToken: string): Promise<ProfileFormData> => {
  const response = await fetch(`${BACKEND_URL}/profile/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching profile: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

export const updateUserProfile = async (
  formData: Record<string, string | File | null>,
  accessToken: string,
): Promise<void> => {
  const nativeFormData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === 'profile_image_url') {
      if (value instanceof File) {
        nativeFormData.append(key, value);
      }
    } else if (value !== null) {
      nativeFormData.append(key, value as string);
    }
  });

  const response = await fetch(`${BACKEND_URL}/profile/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: nativeFormData,
  });

  if (!response.ok) {
    throw new Error(`Error updating profile: ${response.status}`);
  }
};
