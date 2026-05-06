package g03D07TeacherRewardV1

import (
	authStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/service"
	RewardStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	rewardStorage := RewardStorage.StorageNew(resource)
	authStorageInstance := authStorage.StorageNew(resource)
	rewardServiceInstance := service.ServiceNew(rewardStorage, authStorageInstance, cloudStorageInstance)
	route(app, authMiddleware, rewardServiceInstance, path)
	return rewardServiceInstance

}
