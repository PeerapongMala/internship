package g01D0102AdminReportV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, observerMiddleware *middleware.ObserverMiddleware, adminReportService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: adminReportService}

	app.Get(path+"/progress", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.AdminReportList)
	app.Get(path+"/progress/csv", authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess(), api.AdminReportCaseDownloadCsv)
}
