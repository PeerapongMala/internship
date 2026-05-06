import OtherRestAPI from './group/other/restapi';
import StudentGroupRestAPI from './group/student-group/restapi';
import StudentGroupInfoRestAPI from './group/student-group-info/restapi';
import StudentGroupMemberRestAPI from './group/student-group-member/restapi';
import { StudentGroupPlayLogRestAPI } from './group/student-group-play-log/restapi';
import StudentGroupLessonRestAPI from './group/student-group-lesson/restapi';
import StudentGroupScoreRestAPI from './group/student-score/restapi';
import StudentGroupResearchRestAPI from './group/student-group-research/restapi';
import { OtherRepository } from './repository/other';
import { StudentGroupRepository } from './repository/student-group';
import { StudentGroupInfoRepository } from './repository/student-group-info';
import { StudentGroupMemberRepository } from './repository/student-group-member';
import { StudentGroupPlayLogRepository } from './repository/student-group-play-log';
import { StudentGroupLessonRepository } from './repository/student-group-lesson';
import { StudentGroupScoreRepository } from './repository/student-group-score';
import { StudentGroupResearchRepository } from './repository/student-group-research';
import { StudentGroupOverviewRepository } from './repository/student-overview';
import StudentGroupOverviewRestAPI from './group/student-overview/restapi';

// ======================= Environment Import ================================
const studentGroupAPI: StudentGroupRepository = StudentGroupRestAPI;
const otherAPI: OtherRepository = OtherRestAPI;
const studentGroupInfoAPI: StudentGroupInfoRepository = StudentGroupInfoRestAPI;
const studentGroupMemberAPI: StudentGroupMemberRepository = StudentGroupMemberRestAPI;
const studentGroupPlayLogAPI: StudentGroupPlayLogRepository = StudentGroupPlayLogRestAPI;
const studentGroupLessonAPI: StudentGroupLessonRepository = StudentGroupLessonRestAPI;
const studentGroupScoreAPI: StudentGroupScoreRepository = StudentGroupScoreRestAPI;
const studentGroupResearchAPI: StudentGroupResearchRepository =
  StudentGroupResearchRestAPI;
const studentOverviewRestAPI: StudentGroupOverviewRepository =
  StudentGroupOverviewRestAPI;

const mockIs = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

// classroomAPI = await import('./infrastructure/restapi').then(
//   (module) => module.default,
// );

// ======================= Export API ================================

// ===========================================================================
const API = {
  studentGroup: studentGroupAPI,
  other: otherAPI,
  studentGroupInfo: studentGroupInfoAPI,
  studentGroupMember: studentGroupMemberAPI,
  studentGroupPlayLog: studentGroupPlayLogAPI,
  studentGroupLesson: studentGroupLessonAPI,
  studentGroupScore: studentGroupScoreAPI,
  studentGroupResearch: studentGroupResearchAPI,
  studentOverviewRestAPI: studentOverviewRestAPI,
};
export default API;
