package g02D03AcademicLessonV1

import (
	authStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/service"
	ItemStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	itemStorage := ItemStorage.StorageNew(resource)
	authStorageInstance := authStorage.StorageNew(resource)
	itemServiceInstance := service.ServiceNew(itemStorage, authStorageInstance)

	route(app, authMiddleware, itemServiceInstance, path)
	return itemServiceInstance

}
