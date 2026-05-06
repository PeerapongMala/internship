import StoreGlobalPersist from '@store/global/persist';
import { redirect } from '@tanstack/react-router';

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface IAnnouncement {
  id: number;
  no: string;
  public_date: string;
  title: string;
  image_url_list: string[];
  status: string;
  newspaper_id: number | null;
  newspaper_display_order: number | null;
  payment_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_email: string;
  net_amount: number;
}

export interface AnnouncementListResponse {
  data: {
    data: IAnnouncement[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  message: string;
}

export interface AnnouncementListParams {
  search?: string;
  start_created_date?: string;
  end_created_date?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceDetail {
  id: number;
  order_date: string;
  payment_number: string;
  order_number: string | null;
  receipt_number: string | null;
  invoice_number: string;
  price: number;
  base_price: number;
  ad_tax: number;
  vat_tax: number;
  invoice_document_url: string;
  receipt_document_url: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  announcement_no: string;
  public_date: string;
  image_url_list: string[];
  first_name: string;
  last_name: string;
  company: string;
  branch: string;
  tax_id: string;
  phone: string;
  address: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

export const getAnnouncementList = async (
  params: AnnouncementListParams = {},
): Promise<AnnouncementListResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.start_created_date)
      queryParams.append('start_created_date', params.start_created_date);
    if (params.end_created_date)
      queryParams.append('end_created_date', params.end_created_date);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    const response = await fetch(
      `${BACKEND_URL}/newspaper/announcement/list?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await response.json();
    if(response.status  === 401) {
      redirect({to: '/sign-in'})
    }
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch announcements');
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch announcements',
    );
  }
};

export const getPaymentInvoiceData = async (
  invoiceNumber: string,
): Promise<ApiResponse<InvoiceDetail>> => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const response = await fetch(
      `${BACKEND_URL}/newspaper/announcement/invoice/${invoiceNumber}`,
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
      throw new Error(error.message || 'Failed to getPaymentInvoiceData');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to getPaymentInvoiceData',
    );
  }
};

export const getPaymentReceiptData = async (receiptNumber: string) => {
  try {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

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
