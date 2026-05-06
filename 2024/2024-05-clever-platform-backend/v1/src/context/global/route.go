package global

import (
	g01D02TermsV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1"
	g02D01LoginV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1"
	g00D07SpeechToTextV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1"
	g01D0101AdminReportV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1"
	g01D0102AdminReportV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1"
	g01D0103AdminReportV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1"
	g01D0104AdminReportV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1"
	g01D09AdminReportPermissionV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1"
	g02D08SubjectTemplateV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template"
	g03D0300TeacherStudentGroupV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1"
	g03D0301TeacherStudentGroupV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1"
	g03D0302TeacherStudentGroupV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1"
	g03D0306TeacherStudentGroupLessonV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1"
	g03D0307TeacherStudentGroupResearchV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1"
	g03D05TeacherLessonV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1"
	g03D12TeacherProfileV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1"
	g04D04GamificationV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1"
	g04D05RedeemV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1"
	g04D07GamemasterProfileV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1"
	g05D00LineArrivingV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1"
	g05D02lineparentv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1"

	g02D0301StreakLoginV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1"
	g03D03RedeemV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1"
	g03D06MailBoxV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1"
	g04D01LearningLessonV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1"
	g04D03LearningGameplayV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1"
	g00D00ArrivingV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1"
	g00D00HelperV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1"
	g00D01AuthV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1"
	g01D0001globalannounceV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1"
	g01D02AdminAffiliationV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation"
	g01D04AdminSchoolV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1"
	g01D05AdminClassroomV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom"
	g01d06SubjectTeacherV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher"
	g01D08AdminFamilyV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1"
	g04D01GmAnnouncement "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"

	g01d0001leaderboardv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1"

	GAg00d00GlobalV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1"
	g02D0201GlobalAnnouncementV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1"
	g02D02GlobalZoneV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1"
	g03D01Information "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1"
	g03D04CustomAvatarV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1"
	g03d05ShopV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1"
	g03D08ArcadeGameV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1"
	g03D09reportbugv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1"
	g03D10settings "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1"
	g04D02levelV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1"
	g01D07AdminUserAccountV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1"
	g02D01AcademicStandardV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1"
	g02D02AcademicCourseV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1"
	g02D03AcademicLessonV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1"
	g02D04AcademicSubLessonV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1"
	g02D05AcademicLevelV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1"
	g02D06AcademicTranslationV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1"
	g02D07AcademicProfileV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1"
	g03D01TeacherDashboardV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1"
	g03D0303TeacherStudentGroupOverviewV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1"
	g03D03TeacherStudentGroupV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1"
	g03D04TeacherStudentV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1"
	g03D06TeacherHomeworkV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1"
	g03D07TeacherRewardv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1"
	g03D08TeacherItemV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1"
	g03d09teacherShopv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1"
	g03D10TeacherAnnouncementV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1"
	g03D11teacherchatv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1"
	g04D02ItemV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1"
	g04D03ShopV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1"
	g04d06bugreportv1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1"
	g04d08chatconfig "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1"
	g06D01GradeTemplateV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1"
	g06D02GradeFormV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1"
	g06D03DataEntryV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1"
	g06D05Porphor5V1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1"
	g06D06GradePorphor6V1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1"
	g06D07GradeSettingV1 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, resource coreInterface.Resource) {
	// g00
	g00D00HelperV1.Init(app, resource, "/helper/v1")
	g00D00ArrivingV1.Init(app, resource, "/arriving/v1")
	g00D01AuthV1.Init(app, resource, "/auth/v1")
	g00D07SpeechToTextV1.Init(app, resource, "/speech-to-text/v1")

	// g01
	g01D0101AdminReportV1.Init(app, resource, "/admin-report/v1")
	g01D0102AdminReportV1.Init(app, resource, "/admin-report/v1")
	g01D0103AdminReportV1.Init(app, resource, "/admin-report/v1")
	g01D0104AdminReportV1.Init(app, resource, "/admin-report/v1")
	g01D07AdminUserAccountV1.Init(app, resource, "/admin-user-account/v1")
	g01D0001globalannounceV1.Init(app, resource, "/announce")
	g01D02AdminAffiliationV1.Init(app, resource, "/school-affiliations/v1")
	g01D05AdminClassroomV1.Init(app, resource, "/admin-classroom/v1")
	g01D04AdminSchoolV1.Init(app, resource, "/admin-school/v1")
	g01d0001leaderboardv1.Init(app, resource, "/leaderboard/v1")
	g01d06SubjectTeacherV1.Init(app, resource, "/subject-teacher/v1")
	g01D08AdminFamilyV1.Init(app, resource, "/admin-family/v1")
	g01D09AdminReportPermissionV1.Init(app, resource, "/admin-report-permission/v1")

	// g02
	g02D01AcademicStandardV1.Init(app, resource, "academic-standard/v1")
	g02D02AcademicCourseV1.Init(app, resource, "/academic-courses/v1")
	g02D03AcademicLessonV1.Init(app, resource, "/academic-lesson/v1")
	g02D0301StreakLoginV1.Init(app, resource, "/streak-login/v1")
	g02D04AcademicSubLessonV1.Init(app, resource, "/academic-sub-lesson/v1")
	g02D05AcademicLevelV1.Init(app, resource, "/academic-level/v1")
	g02D06AcademicTranslationV1.Init(app, resource, "/academic-translation/v1")
	g02D07AcademicProfileV1.Init(app, resource, "/academic-profile/v1")
	g02D08SubjectTemplateV1.Init(app, resource, "/subject-template/v1")

	// g03
	g03D0300TeacherStudentGroupV1.Init(app, resource, "/teacher-student-group/v1")
	g03D0301TeacherStudentGroupV1.Init(app, resource, "/teacher-student-group/v1")
	g03D0302TeacherStudentGroupV1.Init(app, resource, "/teacher-student-group/v1")
	g03D01TeacherDashboardV1.Init(app, resource, "/teacher-dashboard/v1")
	g03D03TeacherStudentGroupV1.Init(app, resource, "/teacher-student-group/v1")
	g03D0303TeacherStudentGroupOverviewV1.Init(app, resource, "/teacher-student-group-overview/v1")
	g03D0306TeacherStudentGroupLessonV1.Init(app, resource, "/teacher-student-group/v1")
	g03D0307TeacherStudentGroupResearchV1.Init(app, resource, "/teacher-student-group/v1")
	g03D04TeacherStudentV1.Init(app, resource, "/teacher-student/v1")
	g03D05TeacherLessonV1.Init(app, resource, "teacher-lesson/v1")
	g03D06TeacherHomeworkV1.Init(app, resource, "/teacher-homework/v1")
	g03D11teacherchatv1.Init(app, resource, "/teacher-chat/v1")
	g03D12TeacherProfileV1.Init(app, resource, "/teacher-profile/v1")
	g03D08TeacherItemV1.Init(app, resource, "/teacher-item/v1")
	g03d09teacherShopv1.Init(app, resource, "/teacher-shop/v1")
	g03D10TeacherAnnouncementV1.Init(app, resource, "/teacher-announcement/v1")
	g03D07TeacherRewardv1.Init(app, resource, "/teacher-reward/v1")

	// g04
	g04D02ItemV1.Init(app, resource, "/items/v1")
	g04D03ShopV1.Init(app, resource, "/shop/v1")
	g04D01GmAnnouncement.Init(app, resource, "/gm-announcement/v1")
	g02D03AcademicLessonV1.Init(app, resource, "/academic-lesson/v1")
	g01d0001leaderboardv1.Init(app, resource, "/leaderboard/v1")
	g04D04GamificationV1.Init(app, resource, "/gamification/v1")
	g04D05RedeemV1.Init(app, resource, "/redeem/v1")
	g04d06bugreportv1.Init(app, resource, "/bug-report/v1")
	g04D03LearningGameplayV1.Init(app, resource, "/learning-gameplay/v1")
	g04D07GamemasterProfileV1.Init(app, resource, "/gamemaster-profile/v1")
	g04d08chatconfig.Init(app, resource, "/chat-config/v1")

	// g05
	g05D00LineArrivingV1.Init(app, resource, "/line-arriving/v1")
	g05D02lineparentv1.Init(app, resource, "/line-parent/v1")

	// g06
	g06D01GradeTemplateV1.Init(app, resource, "/grade-system-template/v1")
	g06D02GradeFormV1.Init(app, resource, "/grade-system-form/v1")
	g06D03DataEntryV1.Init(app, resource, "/data-entry/v1")
	g06D05Porphor5V1.Init(app, resource, "/porphor5/v1")
	g06D06GradePorphor6V1.Init(app, resource, "/grade-system-porphor6/v1")
	g06D07GradeSettingV1.Init(app, resource, "/grade-settings/v1")

	//GA
	GAg00d00GlobalV1.Init(app, resource, "/arcade-game/v1")

	// domain-game
	g01D02TermsV1.Init(app, resource, "terms/v1")

	g02D01LoginV1.Init(app, resource, "/game-arriving/v1")
	g02D02GlobalZoneV1.Init(app, resource, "/global-zone/v1")
	g04D01LearningLessonV1.Init(app, resource, "/learning-lesson/v1")

	g04D02levelV1.Init(app, resource, "/level/v1")
	g03D01Information.Init(app, resource, "/information/v1")
	g03D03RedeemV1.Init(app, resource, "/redeem-game/v1")
	g03D06MailBoxV1.Init(app, resource, "/mail-box/v1")
	g03D08ArcadeGameV1.Init(app, resource, "/arcade-game/v1")
	g03D09reportbugv1.Init(app, resource, "/report-bug/v1")
	g02D0201GlobalAnnouncementV1.Init(app, resource, "/global-announcement/v1")
	g03D04CustomAvatarV1.Init(app, resource, "/main-menu/custom-avatar/custom-avatar/v1")
	g03d05ShopV1.Init(app, resource, "/main-menu/shop/v1")
	g03D10settings.Init(app, resource, "/settings/v1")
}
