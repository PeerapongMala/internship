package g03d04CustomAvatarV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, serviceInstance service.ServiceInterface, authMiddleware *middleware.AuthMiddleware, path string) {
	api := &service.APIStruct{Service: serviceInstance}
	route := app.Group(path, authMiddleware.CheckRoles(constant.Student))

	route.Get("/character", api.GetCustomAvatarCharacterById)
	route.Patch("/character", api.UpdateCustomAvatarCharacterEquipped)
	route.Get("/pet", api.GetCustomAvatarPetById)
	route.Patch("/pet", api.UpdateCustomAvatarPetEquipped)
	route.Get("/item-badge", api.GetCustomAvatarItemBadge)
	route.Patch("/item-badge", api.UpdateCustomAvatarItemBadgeEquipped)
	route.Get("/item-frame", api.GetCustomAvatarItemFrame)
	route.Patch("/item-frame", api.UpdateCustomAvatarItemFrameEquipped)
	route.Get("/item-coupon", api.GetCustomAvatarItemCoupon)
	route.Patch("/item-coupon", api.UpdateCustomAvatarItemCouponEquipped)
	route.Get("/reward-logs", api.RewardLogList)
	route.Post("/use-coupon", api.CouponUse)
}
