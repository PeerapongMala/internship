package g02d01SchoolAffiliationV1

import (
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	service "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/service"
	storage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	classroomStorage := storage.StorageNew(resource)
	classroomService := service.ServiceNew(classroomStorage)
	route(app, authMiddleware, classroomService, path)
}
