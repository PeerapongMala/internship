package g03d09reportbugv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1/service"
	reportBugStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d09-report-bug-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	reportBugStorage := reportBugStorage.StorageNew(resource)
	reportBugService := service.ServiceNew(reportBugStorage)

	route(app, authMiddleware, reportBugService, path)
	return reportBugService
}
