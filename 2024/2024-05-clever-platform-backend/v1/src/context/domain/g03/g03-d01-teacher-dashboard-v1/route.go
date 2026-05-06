package g03d01teacherdashboardv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := service.NewAPIStruct(serviceInstance)

	app.Get(path+"/academic-year-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListAcademicYearsFilter)
	app.Get(path+"/year-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListYearFilters)
	app.Get(path+"/class-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListClassFilters)
	app.Get(path+"/total-students", authMiddleware.CheckRoles(constant.Teacher), api.GetTotalStudents)
	app.Get(path+"/latest-homework-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetLatestHomeworkOverview)
	app.Get(path+"/level-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetLevelOverview)
	app.Get(path+"/score-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetScoreOverview)
	app.Get(path+"/question-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetQuestionOverview)
	app.Get(path+"/subject-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListSubjectFilters)
	app.Get(path+"/lesson-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListLessonFilters)
	app.Get(path+"/top-students", authMiddleware.CheckRoles(constant.Teacher), api.GetTopStudents)
	app.Get(path+"/bottom-students", authMiddleware.CheckRoles(constant.Teacher), api.GetBottomStudents)
	app.Get(path+"/lesson-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetLessonOverview)
	app.Get(path+"/sub-lesson-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetSubLessonOverview)
	app.Get(path+"/homework-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetHomeworkOverview)
	app.Get(path+"/teacher-subjects", authMiddleware.CheckRoles(constant.Teacher), api.TeacherSubjectList)
}
