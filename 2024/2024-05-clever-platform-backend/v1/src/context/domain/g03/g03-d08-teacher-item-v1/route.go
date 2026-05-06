package g03D08TeacherItemV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Get(path+"/teacher-item-groups", authMiddleware.CheckRoles(constant.Teacher), api.TeacherItemGroupList)
	app.Get(path+"/subjects/:subjectId/items", authMiddleware.CheckRoles(constant.Teacher), api.TeacherItemList)
	app.Post(path+"/subjects/:subjectId/items", authMiddleware.CheckRoles(constant.Teacher), api.TeacherItemCreate)
	app.Get(path+"/items/:itemId", authMiddleware.CheckRoles(constant.Teacher), api.TeacherItemGet)
	app.Patch(path+"/items/:itemId", authMiddleware.CheckRoles(constant.Teacher), api.TeacherItemUpdate)
	app.Get(path+"/template-items", authMiddleware.CheckRoles(constant.Teacher), api.TemplateItemList)
	app.Post(path+"/items/bulk-edit", authMiddleware.CheckRoles(constant.Teacher), api.ItemCaseBulkEdit)
}
