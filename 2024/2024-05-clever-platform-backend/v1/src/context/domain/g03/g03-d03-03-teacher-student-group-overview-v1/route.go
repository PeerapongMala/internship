package g03d0303teacherstudentgroupoverview

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := service.NewAPIStruct(serviceInstance)

	app.Get(path+"/lesson-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListLessonFilters)
	app.Get(path+"/sub-lesson-filters", authMiddleware.CheckRoles(constant.Teacher), api.ListSubLessonFilters)
	app.Get(path+"/overview-stats", authMiddleware.CheckRoles(constant.Teacher), api.GetOverviewStats)
	app.Get(path+"/level-overview", authMiddleware.CheckRoles(constant.Teacher), api.GetLevelOverview)
	app.Get(path+"/top-students", authMiddleware.CheckRoles(constant.Teacher), api.GetTopStudents)
	app.Get(path+"/last-logged-in-students", authMiddleware.CheckRoles(constant.Teacher), api.GetLastLoggedInStudents)
	app.Get(path+"/not-participate-students", authMiddleware.CheckRoles(constant.Teacher), api.GetNotParticipateStudents)
	app.Get(path+"/lesson-progressions", authMiddleware.CheckRoles(constant.Teacher), api.GetLessonProgressions)
	app.Get(path+"/sub-lesson-progressions", authMiddleware.CheckRoles(constant.Teacher), api.GetSubLessonProgressions)
}
