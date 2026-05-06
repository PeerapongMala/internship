package g01D07AdminUserAccountV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	// admin, content creator,
	app.Post(path+"/users", authMiddleware.CheckRoles(constant.Admin), api.UserCreate)
	app.Get(path+"/users/:userId", authMiddleware.CheckRoles(constant.Admin), api.UserGet)
	app.Patch(path+"/users/:userId", authMiddleware.CheckRoles(constant.Admin), api.UserUpdate)
	app.Get(path+"/users", authMiddleware.CheckRoles(constant.Admin), api.UserList)
	app.Patch(path+"/users/:userId/roles", authMiddleware.CheckRoles(constant.Admin), api.UserCaseUpdateRoles)
	app.Post(path+"/bulk-edit", authMiddleware.CheckRoles(constant.Admin), api.UserCaseBulkEdit)

	// app.Post(path+"/student", authMiddleware.CheckRoles(constant.Admin), api.StudentCreate)
	// app.Get(path+"/student/:userId", authMiddleware.CheckRoles(constant.Admin), api.StudentGet)
	// app.Patch(path+"/student/:userId", authMiddleware.CheckRoles(constant.Admin), api.StudentUpdate)
	// app.Get(path+"/student", authMiddleware.CheckRoles(constant.Admin), api.StudentList)

	// app.Post(path+"/announcer", authMiddleware.CheckRoles(constant.Admin), api.AnnouncerCreate)
	// app.Get(path+"/announcer", authMiddleware.CheckRoles(constant.Admin), api.AnnouncerList)

	// app.Post(path+"/parents", api.ParentCreate)
	app.Get(path+"/parents/:userId", api.ParentGet)
	app.Get(path+"/parents", authMiddleware.CheckRoles(constant.Admin), api.ParentList)

	app.Post(path+"/observers", authMiddleware.CheckRoles(constant.Admin), api.ObserverCreate)
	app.Get(path+"/observers/:userId", authMiddleware.CheckRoles(constant.Admin), api.ObserverGet)
	app.Get(path+"/observers", authMiddleware.CheckRoles(constant.Admin), api.ObserverList)
	app.Patch(path+"/observers/:userId/observer-accesses", authMiddleware.CheckRoles(constant.Admin), api.ObserverCaseUpdateObserverAccesses)
	app.Get(path+"/observer-accesses", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessList)

	app.Patch(path+"/auth/email-password", authMiddleware.CheckRoles(constant.Admin), api.AuthEmailPasswordUpdate)

	app.Post(path+"/upload/csv/admin", authMiddleware.CheckRoles(constant.Admin), api.AdminUploadCSV)
	app.Post(path+"/upload/csv/parent", authMiddleware.CheckRoles(constant.Admin), api.ParentUploadCSV)
	app.Post(path+"/upload/csv/observer", authMiddleware.CheckRoles(constant.Admin), api.ObserverUploadCSV)
	app.Post(path+"/upload/csv/content-creator", authMiddleware.CheckRoles(constant.Admin), api.ContentCreatorUploadCSV)

	app.Get(path+"/download/csv/admin", authMiddleware.CheckRoles(constant.Admin), api.AdminDownloadCSV)
	app.Get(path+"/download/csv/parent", authMiddleware.CheckRoles(constant.Admin), api.ParentDownloadCSV)
	app.Get(path+"/download/csv/observer", authMiddleware.CheckRoles(constant.Admin), api.ObserverDownloadCSV)
	app.Get(path+"/download/csv/content-creator", authMiddleware.CheckRoles(constant.Admin), api.ContentCreatorDownloadCSV)
}
