package g04D07GamemasterProfileV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	gamemasterProfileService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/service"
	gamemasterProfileStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) gamemasterProfileService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	gamemasterProfileStorageInstance := gamemasterProfileStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)

	gamemasterProfileServiceInstance := gamemasterProfileService.ServiceNew(gamemasterProfileStorageInstance, cloudStorageInstance)

	route(app, authMiddleware, gamemasterProfileServiceInstance, path)
	
	return gamemasterProfileServiceInstance
}
