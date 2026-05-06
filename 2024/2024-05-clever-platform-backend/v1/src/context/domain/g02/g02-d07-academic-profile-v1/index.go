package g02D07AcademicProfileV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	academicProfileService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/service"
	academicProfileStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) academicProfileService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	academicProfileStorageInstance := academicProfileStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	academicProfileServiceInstance := academicProfileService.ServiceNew(academicProfileStorageInstance, cloudStorageInstance)

	route(app, authMiddleware, academicProfileServiceInstance, path)
	return academicProfileServiceInstance
}
