package g03d05ShopV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, serviceInstance service.ServiceInterface, authMiddleware *middleware.AuthMiddleware, path string) {
	api := &service.APIStruct{Service: serviceInstance}
	group := app.Group(path, authMiddleware.CheckRoles(constant.Student))

	// item
	group.Get("/item", api.GetShopItemLists)
	group.Get("/item/type/:type/item_id/:itemId", api.GetShopItem)
	group.Post("/item/type/:type", api.AddShopItem)
	group.Patch("/item/type/:type", api.UpdateShopItem)

	// pet
	group.Get("/pet", api.GetShopPetLists)
	group.Get("/pet/pet_id/:petId", api.GetShopPet)

	// avatar
	group.Get("/avatar", api.GetShopAvatarLists)
	group.Get("/avatar/avatar_id/:avatarId", api.GetShopAvatar)
	group.Post("/avatar", api.AddShopAvatar)

	group.Post("/item/buy", api.ShopItemBuy)
	group.Post("/avatar/buy", api.AvatarBuy)
	group.Post("/pet/buy", api.PetBuy)

}
