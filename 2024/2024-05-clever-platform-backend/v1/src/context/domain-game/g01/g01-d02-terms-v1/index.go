package g01D02TermsV1

import (
	termsService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/storage"
	AuthMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) termsService.ServiceInterface {
	authMiddlewareStorageInstance := AuthMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	termsStorageInstance := termsStorage.StorageNew(resource)

	termsServiceInstance := termsService.ServiceNew(termsStorageInstance)

	route(app, authMiddleware, termsServiceInstance, path)

	return termsServiceInstance
}
