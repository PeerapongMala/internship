package g03d06MailBoxV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	//platform-Clever
	app.Get(path+"/platform/arcade/:arcadeGameId/buy", authMiddleware.CheckRoles(constant.Student), api.GetToken)
	app.Get(path+"/platform/arcade/:arcadeGameId/check", authMiddleware.CheckRoles(constant.Student), api.GetSession)
	app.Patch(path+"/platform/arcade-coin", authMiddleware.CheckRoles(constant.Student), api.IncreaseCoin)

	//arcade-game
	app.Get(path+"/arcade-game/data", authMiddleware.CheckRolesArcade(constant.Student), api.GetGameData)
	app.Post(path+"/arcade-game/score", authMiddleware.CheckRolesArcade(constant.Student), api.PlayLogCreate)
	app.Get(path+"/arcade-game/asset", authMiddleware.CheckRolesArcade(constant.Student), api.GetAssetByModelId)

	//TEST//
	app.Post(path+"/arcade-game/asset/:modelId", authMiddleware.CheckRolesArcade(constant.Student), api.CreateModelAsset)
}
