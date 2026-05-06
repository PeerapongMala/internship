export type UploadHistoryData = {
  status: 'Waiting' | 'Complete';
  username: string;
  avatarImage?: string;
  tempImage?: string;
  lastLogin: Date | string;
  school_code?: string;
  student_id?: string;
  pin?: string;
};

export enum StateTab {
  WaitingTab = 0,
  HistoryTab = 1,
}
