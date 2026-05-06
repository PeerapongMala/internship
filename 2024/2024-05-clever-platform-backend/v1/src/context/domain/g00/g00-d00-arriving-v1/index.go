package g00D00ArrivingV1

import (
	arrivingService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/service"
	arrivingStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/storage"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"

	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"

	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) arrivingService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	cloudStorageInstance := cloudStorage.StorageNew(resource)
	arrivingStorageInstance := arrivingStorage.StorageNew(resource)
	arrivingServiceInstance := arrivingService.ServiceNew(arrivingStorageInstance, cloudStorageInstance)

	route(app, resource.RateLimiterManager, authMiddleware, arrivingServiceInstance, path)
	return arrivingServiceInstance
}
