package g01D04AdminSchoolV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	adminSchoolService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/service"
	adminSchoolStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) adminSchoolService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	adminSchoolStorageInstance := adminSchoolStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)

	adminSchoolServiceInstance := adminSchoolService.ServiceNew(adminSchoolStorageInstance, cloudStorageInstance)

	route(app, authMiddleware, adminSchoolServiceInstance, path)

	return adminSchoolServiceInstance
}
