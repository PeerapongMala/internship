import { RepositoryPatternInterface } from '../../../repository-pattern';
import GlobalAnnouncementReadAllSchoolPost from './read-all-school-post';
import GlobalAnnouncementReadAllSystemPost from './read-all-system-post';
import GlobalAnnouncementReadByIdPatch from './read-by-id-patch';
import GlobalAnnouncementSchoolGet from './school-get';
import GlobalAnnouncementSystemGet from './system-get';

const Global: RepositoryPatternInterface['Global'] = {
  Announcement: {
    School: { Get: GlobalAnnouncementSchoolGet },
    System: { Get: GlobalAnnouncementSystemGet },
    ReadAllSchool: { Post: GlobalAnnouncementReadAllSchoolPost },
    ReadAllSystem: { Post: GlobalAnnouncementReadAllSystemPost },
    ReadById: { Patch: GlobalAnnouncementReadByIdPatch },
  },
};

export default Global;
