export type AnnounceMenuState = {
  selectedAnnounce: number;
  selectedTab: number;
};

export interface ReportBugAPIResponse {
  status_code: number;
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: BugReportItem[];
  Message: string;
}

export interface BugReportItem {
  bug_id: number | string;
  created_at: string;
  type: string;
  description: string;
  created_by: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed' | (string & {});
}
export interface AnnounceData {
  LastModified: number;
  Sections: AnnounceSection[];
}
export interface AnnounceSection {
  id: number;
  title?: string;
  LastModified?: number;
  announcements: AnnounceDialog[];
  type?: string;
  description?: string;
  created_at?: string;
  status?: string;
  bug_id?: string | number;
}
export interface AnnounceDialog {
  id: string | number;
  shortTitle?: string;
  header: string;
  announceDate?: string;
  showDate?: boolean;
  announceContent?: { Report: string } | string;
  status?: number | string;
  translatedHeader?: string;
  type?: string;
  description?: string;
  created_at?: string;
  content?: string;
  createdAt?: string;
}
