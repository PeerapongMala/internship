import AnnouncementRestAPI from '@domain/g03/g03-d10/local/api/group/teacher-announcement/restapi';
import { AnnouncementRepository } from '@domain/g03/g03-d10/local/api/repository/teacher-announcement';

// ======================= Environment Import ================================
let announcementAPI: AnnouncementRepository = AnnouncementRestAPI;

// ===========================================================================
const API = {
  announcement: announcementAPI,
};

export default API;
