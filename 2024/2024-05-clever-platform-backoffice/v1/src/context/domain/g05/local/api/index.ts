import { BugReportRepository } from '@domain/g05/g05-d02/local/api/repository/bug-report';
import { StudentRepository } from './repository/student';
import { AnnouncementRepository } from '@domain/g05/g05-d02/local/api/repository/announcement';

export const API = {
  Student: StudentRepository,
  BugReport: BugReportRepository,
  Announcement: AnnouncementRepository,
};
