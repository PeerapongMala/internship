package g04D02ItemV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	// item.item
	app.Get(path+"/item/:itemId", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemGet)
	app.Get(path+"/item", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemList)
	app.Post(path+"/item", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemCreate)
	app.Patch(path+"/item", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemUpdate)

	// item.badge
	app.Post(path+"/item/badge", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemBadgeCreate)
	app.Patch(path+"/item/badge", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemBadgeUpdate)
	app.Get(path+"/item/badge/lists", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ListItemBadges)
	app.Get(path+"/item/badge/:itemId", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemBadgeGet)

	app.Post(path+"/item/bulk-edit", authMiddleware.CheckRoles(constant.Admin, constant.GameMaster), api.ItemCaseBulkEdit)
}
