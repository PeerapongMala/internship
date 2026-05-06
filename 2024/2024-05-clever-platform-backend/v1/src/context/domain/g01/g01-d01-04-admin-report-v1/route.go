package g01D0104AdminReportV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, observerMiddleware *middleware.ObserverMiddleware, adminReportService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: adminReportService}

	app.Get(path+"/school-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SchoolReportList)
	app.Get(path+"/schools/:schoolId/class-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.ClassReportList)
	app.Get(path+"/classes/:classId/student-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.StudentReportList)
	app.Get(path+"/users/:userId/lesson-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.LessonReportList)
	app.Get(path+"/users/:userId/lessons/:lessonId/sub-lesson-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SubLessonReportList)
	app.Get(path+"/users/:userId/sub-lessons/:subLessonId/level-reports", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.LevelReportList)
	app.Get(path+"/users/:userId/level/:levelId/level-play-logs", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LevelPlayLogList)

	app.Get(path+"/users/:userId/curriculum-groups", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.CurriculumGroupList)
	app.Get(path+"/users/:userId/subjects", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SubjectList)
	app.Get(path+"/users/:userId/lessons", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.LessonList)
	app.Get(path+"/users/:userId/lessons/:lessonId", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SubLessonList)
	app.Get(path+"/users/:userId/academic-years", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.StudentAcademicYearList)

	app.Get(path+"/level-play-logs/:levelPlayLogId", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LevelCaseListStudentAnswer)
	app.Get(path+"/levels/:levelId", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LevelGet)

	app.Get(path+"/school-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.SchoolReportCaseDownloadCsv)
	app.Get(path+"/:schoolId/class-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.ClassReportCaseDownloadCsv)
	app.Get(path+"/:classId/student-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.StudentReportCaseDownloadCsv)
	app.Get(path+"/:userId/lesson-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LessonReportCaseDownloadCsv)
	app.Get(path+"/users/:userId/lessons/:lessonId/sub-lesson-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.SubLessonReportCaseDownloadCsv)
	app.Get(path+"/users/:userId/sub-lessons/:subLessonId/level-reports/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LevelReportCaseDownloadCsv)
	app.Get(path+"/users/:userId/level/:levelId/level-play-logs/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), api.LevelPlayLogCaseDownloadCsv)
}
