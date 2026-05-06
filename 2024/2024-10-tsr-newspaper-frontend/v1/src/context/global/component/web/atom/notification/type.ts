export type NotificationType = 'success' | 'error';

export interface NotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}