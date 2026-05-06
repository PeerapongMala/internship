package g04D07GamemasterProfileV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gamemasterProfileService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: gamemasterProfileService}

	app.Get(path+"/gamemaster", authMiddleware.CheckRoles(constant.GameMaster), api.GamemasterGet)
	app.Patch(path+"/gamemaster", authMiddleware.CheckRoles(constant.GameMaster), api.GamemasterUpdate)
	app.Patch(path+"/gamemaster/password", authMiddleware.CheckRoles(constant.GameMaster), api.GamemasterCaseUpdatePassword)
}
