package g06D01GradeTemplateV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gradeFormService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gradeFormService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	route.Post("/:evaluationFormId/create", api.Porphor5Create).Name("G06D05A01Create")

	route.Get("/:evaluationFormId/list", api.Porphor5List).Name("GDA02List")
	route.Get("/:evaluationFormId/detail", api.Porphor5Get).Name("GDA03Get")
	route.Patch("/:evaluationFormId/detail", api.Porphor5Update).Name("GDA06Update")

	route.Get("/porphor6/:evaluationFormId/list", api.Porphor6List).Name("GDA04List")
	route.Get("/porphor6/:evaluationFormId/detail", api.Porphor6Get).Name("GDA05Get")
	route.Patch("/porphor6/:evaluationFormId/detail", api.Porphor6Update).Name("GDA07Update")

}
