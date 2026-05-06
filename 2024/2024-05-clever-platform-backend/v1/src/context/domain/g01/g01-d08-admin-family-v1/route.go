package g01D08AdminFamilyV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Admin))

	route.Get("/info/families", api.FamilyList)
	route.Get("/info/family/:family_id", api.FamilyGetInfo)
	route.Patch("/info/family/:family_id/owner", api.UpdateFamilyOwner)
	route.Get("/info/family/:family_id/members", api.FamilyMember)

	route.Get("/family/:family_id/download/csv", api.FamilyDownloadCSV)
	route.Post("/family", api.AddFamily)
	route.Patch("/family/:id/:status", api.FamilyUpdateStatus)
	route.Post("/family/:family_id/member", api.AddMember)
	route.Delete("/:family_id/member", api.DeleteMember)
	route.Delete("/family", api.FamilyDelete)

	route.Delete("/bulk-edit", api.FamilyBulkEdit)
	route.Delete("/bulk-edit/user/:family_id", api.UserBulkEdit)
	route.Get("/family/:family_id/:role", api.MemberList)
	route.Get("/parents", api.ParentList)
	route.Get("/students", api.StudentList)

	route.Get("/dropdown/school", api.SchoolList)
	route.Get("/dropdown/academic-year", api.AcademicYearList)
	route.Get("/dropdown/year", api.YearList)
	route.Get("/dropdown/class", api.ClassList)
}
