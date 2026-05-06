package g06D01GradeTemplateV1

import (
	authStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/storage"
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	gradeTemplateStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/storage"
	gradeFormStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/storage"
	domainService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/service"
	gradeDataEntryStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) domainService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	gradeTemplateInstance := gradeTemplateStorage.StorageNew(resource)
	gradeFormInstance := gradeFormStorage.StorageNew(resource)
	gradeDataEntryInstance := gradeDataEntryStorage.StorageNew(resource)
	authStorageInstance := authStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)

	serviceInstance := domainService.ServiceNew(gradeTemplateInstance, gradeFormInstance, gradeDataEntryInstance, authStorageInstance, cloudStorageInstance)
	route(app, authMiddleware, serviceInstance, path)
	return serviceInstance
}
