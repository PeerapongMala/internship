package g02D08SubjectTemplateV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, subjectTemplateService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: subjectTemplateService,
	}

	app.Post(path+"/templates", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectTemplateCreate)
	app.Get(path+"/templates", authMiddleware.CheckRoles(constant.ContentCreator, constant.Teacher), api.SubjectTemplateList)
	app.Patch(path+"/templates/:templateId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectTemplateUpdate)
	app.Post(path+"/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SubjectTemplateCaseBulkEdit)
	app.Get(path+"/indicators/:indicatorId", authMiddleware.CheckRoles(constant.ContentCreator, constant.Teacher), api.SubjectTemplateIndicatorGet)
}
