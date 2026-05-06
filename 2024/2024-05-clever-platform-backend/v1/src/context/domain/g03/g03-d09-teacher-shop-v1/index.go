package g03d09teacherShopv1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/storage"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) (storageRepository.TeacherShopRepository, service.ServiceInterface) {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)
	storageInstance := storage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	serviceInstance := service.ServiceNew(storageInstance, cloudStorageInstance)

	route(app, authMiddleware, serviceInstance, path)
	return storageInstance, serviceInstance
}
