package global

import (
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"

	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource) {
	route(app, resource)
}
