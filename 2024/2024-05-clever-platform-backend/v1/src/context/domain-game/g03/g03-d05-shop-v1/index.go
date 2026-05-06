package g03d05ShopV1

import (
	shopService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/service"
	shopStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/storage"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/storage/storage-repository"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) (storageRepository.Repository, shopService.ServiceInterface) {
	storageInstance := shopStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	serviceInstance := shopService.ServiceNew(storageInstance, cloudStorageInstance)
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)
	route(app, serviceInstance, authMiddleware, path)
	return storageInstance, serviceInstance
}
