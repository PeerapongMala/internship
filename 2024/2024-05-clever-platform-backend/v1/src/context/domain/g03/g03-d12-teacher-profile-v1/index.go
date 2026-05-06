package g03D12TeacherProfileV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	teacherProfileService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/service"
	teacherProfileStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) teacherProfileService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	teacherProfileStorageInstance := teacherProfileStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	teacherProfileServiceInstance := teacherProfileService.ServiceNew(teacherProfileStorageInstance, cloudStorageInstance)

	route(app, authMiddleware, teacherProfileServiceInstance, path)
	return teacherProfileServiceInstance
}
