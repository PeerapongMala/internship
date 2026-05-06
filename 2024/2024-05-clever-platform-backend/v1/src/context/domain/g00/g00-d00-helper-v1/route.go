package g00D00HelperV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/service"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, helperService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: helperService}

	app.Post(path+"/re-init", api.HelperCaseReInitializeDatabase)
	app.Post(path+"/inc-version-id", api.HelperCaseIncrementModelVersionId)
	app.Get(path+"/health-check", api.HelperCaseHealthCheck)
}
