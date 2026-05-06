package g04D05RedeemV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, observerMiddleware *middleware.ObserverMiddleware, sv service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: sv,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.Observer), observerMiddleware.GetReportAccess())

	route.Get("/report/province-district", api.ReportProvinceDistrict)
	route.Get("/report/compare-province-district", api.ReportCompareProvinceDistrict)
}
