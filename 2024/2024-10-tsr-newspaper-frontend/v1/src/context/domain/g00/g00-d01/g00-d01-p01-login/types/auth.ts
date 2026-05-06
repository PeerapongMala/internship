export interface LoginCredentials {
  email_or_username: string;
  password: string;
}

export interface LoginSuccessResponse {
  status_code: number;
  data: {
    access_token: string;
    role: number;
  };
  message: string;
}
