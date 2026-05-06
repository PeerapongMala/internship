package g02D08SubjectTemplateV1

import (
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	subjectTemplateStorageInstance := storage.StorageNew(resource)
	subjectTemplateServiceInstance := service.ServiceNew(subjectTemplateStorageInstance)

	route(app, authMiddleware, subjectTemplateServiceInstance, path)
	return subjectTemplateServiceInstance
}
