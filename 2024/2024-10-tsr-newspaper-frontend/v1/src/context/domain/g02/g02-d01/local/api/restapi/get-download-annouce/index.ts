import StoreGlobalPersist from '@global/store/global/persist';

export const getPaymentReceiptData = async (receiptNumber: string) => {
    try {
      const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
      const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
      console.log('getPaymentReceiptData ====>');
      const response = await fetch(
        `${BACKEND_URL}/newspaper/announcement/receipt/${receiptNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get PaymentReceiptData');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get PaymentReceiptData',
      );
    }
  };