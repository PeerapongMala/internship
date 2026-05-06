package g01D09AdminReportPermissionV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/observer-accesses", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCreate)
	app.Put(path+"/observer-accesses/:observerAccessId", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessUpdate)
	app.Get(path+"/observer-accesses/:observerAccessId", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessGet)
	app.Get(path+"/observer-accesses", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessList)
	app.Put(path+"/observer-accesses/:observerAccessId/schools", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCaseUpdateSchool)
	app.Post(path+"/observer-accesses/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCaseBulkEdit)
	app.Delete(path+"/observer-accesses/:observerAccessId/schools/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCaseDeleteSchool)
	app.Get(path+"/observer-accesses/:observerAccessId/schools", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCaseListSchool)
	app.Get(path+"/schools", authMiddleware.CheckRoles(constant.Admin), api.SchoolList)
	app.Get(path+"/school-affiliations", authMiddleware.CheckRoles(constant.Admin), api.SchoolAffiliationList)
	app.Patch(path+"/observer-accesses/:observerAccessId/schools", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCasePatchSchool)
}
