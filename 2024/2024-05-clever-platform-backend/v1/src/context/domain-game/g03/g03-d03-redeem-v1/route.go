package g03d06MailBoxV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, serviceInstance service.ServiceInterface, authMiddleware *middleware.AuthMiddleware, path string) {
	
	api := &service.APIStruct{Service: serviceInstance}
	route := app.Group(path, authMiddleware.CheckRoles(constant.Student))

	route.Post("/redeem/coupon/:couponCode", api.RedeemCoupon)

}
