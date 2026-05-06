import { TQrCodeData } from './qrcode';

export type TFamily = {
  family_id: string;
  member: [
    {
      user_id: string;
      title: string;
      first_name: string;
      last_name: string;
      role: string;
      is_owner: boolean;
      image_url: string | null;
    },
  ];
};

export type TFamilyQrCodeData = TQrCodeData<{ user_id: string; family_id?: string }>;
