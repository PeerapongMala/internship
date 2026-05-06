package g03d0306teacherstudentgrouplesson

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := service.NewAPIStruct(serviceInstance)

	groupRoute := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	mainRoute := groupRoute.Group("/study-group/:studyGroupId")

	statRoute := mainRoute.Group("/lesson-stat")
	statRoute.Get("/list", api.GetLessonLevelStatList)
	statRoute.Get("/csv", api.GetLessonLevelStatCsv)

	paramRoute := mainRoute.Group("/params")
	paramRoute.Get("/lesson", api.GetLessonParams)
	paramRoute.Get("/sub-lesson", api.GetSubLessonParams)

}
