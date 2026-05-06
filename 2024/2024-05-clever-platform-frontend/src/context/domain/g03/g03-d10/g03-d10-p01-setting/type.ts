export enum StateFlow {
  Setting = 0,
  Download = 2,
  Account = 1,
  AboutUs = 3,
}

export type Account = {
  uuid: string;
  avatar?: string;
  fullname: string;
  schoolName: string;
  schoolId: string;
  role: 'Student' | 'Teacher';
  studentId?: string;
  teacherId?: string;
  family?: {
    uuid: string;
    fullname: string;
  };
};

export interface DownloadConfig {
  /** จำนวน sublesson ที่ดาวน์โหลดพร้อมกัน (1-5) */
  sublessonConcurrency: number;
  /** หน่วงเวลาระหว่าง sublesson (ms) */
  sublessonDelay: number;
  /** หน่วงเวลาระหว่าง level (ms) */
  levelDelay: number;
  /** หน่วงเวลาระหว่าง question (ms) */
  questionDelay: number;
  /** จำนวน assets ที่ดาวน์โหลดพร้อมกัน ต่อ question (1-10) */
  assetConcurrency: number;
}

export interface SettingsData {
  enableBackgroundMusic: boolean;
  backgroundMusicVolumn: number;
  enableSFXMusic: boolean;
  SFXVolumn: number;
  enableSoundMusic: boolean;
  soundVolumn: number;
  textLanguage: string;
  soundLanguage: string;
  fontSize: number;
  enableGameplayModelRenderer: boolean;
  enableParticle: boolean;
  /** การตั้งค่าความเร็วในการดาวน์โหลด lesson */
  downloadConfig: DownloadConfig;
}
