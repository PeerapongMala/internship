package g01D02TermsV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, termsService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: termsService}

	app.Get(path+"/tos/:tosId", authMiddleware.CheckRoles(constant.Student, constant.Admin), api.TosGet)
	app.Post(path+"/accept", authMiddleware.CheckRoles(constant.Student, constant.Admin), api.TosCaseAccept)
	app.Get(path+"/:tosId/acceptance", authMiddleware.CheckRoles(constant.Student, constant.Admin), api.TosCaseCheckAcceptance)
}
