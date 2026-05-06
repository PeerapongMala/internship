package g04d06bugreportv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}
	route := app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.GameMaster, constant.Teacher, constant.Student, constant.Parent))

	route.Get("/bugs", api.BugList)
	route.Get("/bug/:bug_id", api.BugGet)
	route.Get("/bug/:bug_id/logs", api.BugLogList)
	route.Get("/bug/download/csv", api.BugReportDownloadCSV)

	route = app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.GameMaster))
	route.Post("/bug/status", api.UpdateBugStatus)
}
