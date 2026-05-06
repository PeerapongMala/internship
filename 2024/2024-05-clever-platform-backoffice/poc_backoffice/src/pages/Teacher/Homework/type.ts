

export interface Sublesson {
    id: string;
    index: number;
    title: string;
    description?: string;
    download_status?: 'DOWNLOADED' | 'DOWNLOADING' | 'UNDOWNLOADED';
    passing?: boolean;
  }
  
  export interface SublessonDetail extends Sublesson {
    file_size?: number;
    levels_amount?: number;
    language_download_status?: {
      lang: 'th' | 'en' | 'cn';
      status: 'DOWNLOADED' | 'DOWNLOADING' | 'PENDING' | 'UNDOWNLOADED';
    }[];
  }
  
  export interface Lesson {
    id: string;
    index: number;
    title: string;
    description?: string;
    download_status?: 'DOWNLOADED' | 'DOWNLOADING' | 'UNDOWNLOADED';
    passing?: boolean;
  }
  
  export interface LessonDetail extends Lesson {
    file_size?: number;
    sublessons_amount?: number;
    sublessons?: SublessonDetail[];
  }
  
  export interface Subject {
    id: string;
    title: string;
  }
  
  export interface SubjectLessons extends Subject {
    lessons: LessonDetail[];
  }
  