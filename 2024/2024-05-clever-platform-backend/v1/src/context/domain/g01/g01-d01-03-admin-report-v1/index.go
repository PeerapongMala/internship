package g04D05RedeemV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	observerMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/storage"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	observerMiddlewareStorageInstance := observerMiddlewareStorage.StorageNew(resource)
	observerMiddleware := middleware.ObserverMiddlewareNew(observerMiddlewareStorageInstance)

	adminReportStorageInstance := storage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	adminReportServiceInstance := service.ServiceNew(adminReportStorageInstance, cloudStorageInstance)

	route(app, authMiddleware, observerMiddleware, adminReportServiceInstance, path)
	return adminReportServiceInstance
}
