package g02D07AcademicProfileV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, academicProfileService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: academicProfileService,
	}

	app.Get(path+"/content-creator", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentCreatorGet)
	app.Patch(path+"/content-creator", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentCreatorUpdate)
	app.Patch(path+"/content-creator/password", authMiddleware.CheckRoles(constant.ContentCreator), api.ContentCreatorCaseUpdatePassword)
}
