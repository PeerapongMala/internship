package g05d02lineparentv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	route := app.Group(path)
	// Announcement
	route.Get("/announcements/:user_id", authMiddleware.CheckRoles(constant.Parent), api.AnnouncementList)
	route.Get("/announcement/:announcement_id", authMiddleware.CheckRoles(constant.Parent), api.AnnouncementGet)

	// Homework
	route.Get("/homework/status/:user_id/:class_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.OverViewHomeworkStatus)
	route.Get("/homeworks/:user_id/:class_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.HomeworkList)
	route.Get("/homework/students", authMiddleware.CheckRoles(constant.AllRoles...), api.GetStudentInFamily)
	route.Get("/homework/student/:user_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.GetStudentInfo)

	// Family
	route.Get("/family/members", authMiddleware.CheckRoles(constant.Parent), api.MemberInFamily)
	route.Post("/family/update-data", authMiddleware.CheckRoles(constant.Parent), api.ManageFamily)
	route.Get("/family/check-member/:user_id", authMiddleware.CheckRoles(constant.Parent), api.CheckMemberNotExist)
	route.Post("/family/add-member", authMiddleware.CheckRoles(constant.Parent), api.AddMember)

	// Report Bug
	route.Post("/report-bug/create", authMiddleware.CheckRoles(constant.Teacher, constant.Parent, constant.Student), api.CreateReportBug)
	route.Get("/report-bug/:bug_id", authMiddleware.CheckRoles(constant.Teacher, constant.Parent, constant.Student), api.GetReportBug)
	route.Get("/report-bug", authMiddleware.CheckRoles(constant.Teacher, constant.Parent, constant.Student), api.ListReportBug)

	// Dashboard
	route.Get("/dashboard/subjects/:user_id/:class_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.SubjectList)
	route.Get("/dashboard/lessons/:user_id/:subject_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.LessonList)
	route.Get("/dashboard/overview-stat/:user_id/:class_id/:subject_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.GetOverviewStats)
	route.Get("/dashboard/lesson-progress/:user_id/:class_id/:subject_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.LessonProgress)
	route.Get("/dashboard/sub-lesson-progress/:user_id/:class_id/:subject_id/:lesson_id", authMiddleware.CheckRoles(constant.Parent, constant.Student), api.SubLessonProgress)

	route.Get("/school-details/:classId", authMiddleware.CheckRoles(constant.Teacher, constant.Parent, constant.Student), api.GetSchoolDetailsByClassId)
}
