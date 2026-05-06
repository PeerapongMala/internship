package g05D00LineArrivingV1

import (
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/service"
	lineArrivingStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	lineArrivingStorageInstance := lineArrivingStorage.Repository(resource)
	serviceInstance := service.ServiceNew(lineArrivingStorageInstance)

	route(app, authMiddleware, serviceInstance, path)
	return serviceInstance
}
