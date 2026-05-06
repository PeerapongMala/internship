package g04d03shopv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	group := app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.GameMaster))
	// shop
	group.Get("/shop", api.GetShopItemLists)
	group.Get("/shop/store_item_id/:storeItemId", api.GetShopItem)
	group.Post("/shop", api.AddShopItem)
	group.Patch("/shop/store_item_id/:storeItemId", api.UpdateShopItem)
	group.Patch("/shop/store_item_id/:storeItemId/status", api.UpdateShopItemStatus)
	group.Patch("/shop/status/bulk_edit", api.UpdateShopItemStatusBulkEdit)
	group.Get("/shop/store_item_id/:storeItemId/transaction", api.GetShopItemTransactionList)
	group.Patch("/shop/store_transaction_id/:transactionId/transaction/status", api.UpdateShopItemTransactionStatus)
	group.Patch("/shop/transaction/status/bulk_edit", api.UpdateShopItemTransactionStatusBulkEdit)
}
