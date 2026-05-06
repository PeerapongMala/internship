package g00D00HelperV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) service.ServiceInterface {
	helperStorageInstance := storage.StorageNew(resource)
	helperServiceInstance := service.ServiceNew(helperStorageInstance)

	route(app, helperServiceInstance, path)
	return helperServiceInstance
}
