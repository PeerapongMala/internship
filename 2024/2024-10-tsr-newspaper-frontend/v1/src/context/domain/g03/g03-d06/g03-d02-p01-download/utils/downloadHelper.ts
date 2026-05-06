import StoreGlobalPersist from '@store/global/persist';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const downloadFile = async (url: string, filename: string) => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(`${BACKEND_URL}/${url}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });


    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
