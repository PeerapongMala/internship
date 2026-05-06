package g04D05RedeemV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d05-redeem-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, sv service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: sv,
	}

	route := app.Group(path)
	route.Post("/coupon/create", authMiddleware.CheckRoles(constant.GameMaster), api.CouponCreate)
	route.Get("/coupon/list", authMiddleware.CheckRoles(constant.GameMaster), api.CouponList)
	route.Patch("/coupon/:id", authMiddleware.CheckRoles(constant.GameMaster), api.CouponUpdate)
	route.Post("/coupon/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster), api.CouponBulkEdit)
	route.Get("/coupon/:id", authMiddleware.CheckRoles(constant.GameMaster), api.CouponGet)
	route.Get("/coupon/transaction/list/:couponId", authMiddleware.CheckRoles(constant.GameMaster), api.CouponTransactionList)

	route.Get("/coupon/csv/download", authMiddleware.CheckRoles(constant.GameMaster), api.CouponDownloadCSV)
	route.Post("/coupon/csv/upload", authMiddleware.CheckRoles(constant.GameMaster), api.CouponUploadCSV)
	route.Get("/drop-down/:type", authMiddleware.CheckRoles(constant.GameMaster), api.DropDownList)
}
