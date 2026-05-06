package g06d06GradePorphor6V1

import (
	authStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	domainService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/service"
	domainStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) domainService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	gradePorphor6Storage := domainStorage.StorageNew(resource)
	authStorageInstance := authStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)

	serviceInstance := domainService.ServiceNew(gradePorphor6Storage, authStorageInstance, cloudStorageInstance)
	route(app, authMiddleware, serviceInstance, path)
	return serviceInstance
}
