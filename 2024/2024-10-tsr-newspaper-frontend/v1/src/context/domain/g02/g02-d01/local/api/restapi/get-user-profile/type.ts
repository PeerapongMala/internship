export interface ProfileFormData {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    branch?: string;
    tax_id?: string;
    phone?: string;
    address?: string;
    district?: string;
    sub_district?: string;
    province?: string;
    postal_code?: string;
    profile_image_url?: File | null | string;
  }