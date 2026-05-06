package g06d06GradePorphor6V1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gradePorphor6Service service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gradePorphor6Service,
	}

	// grade-system-porphor6/v1
	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))
	route.Get("/porphor6/v1/:evaluationFormId/:studentId/detail", api.GradePorphor6GetById)
}
