package g06D07GradeSettingV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, settingService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: settingService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	route.Post("/student-information/upload/csv", api.StudentInformationUploadCsv).Name("G06D07A01Case")
	route.Get("/student-information/download/csv", api.StudentInformationDownloadCsv).Name("G06D07A02Case")
	route.Get("/student-information", api.StudentInformationList).Name("G06D07A03List")
	route.Get("/student-information/:studentId", api.StudentInformationGet).Name("G06D07A10Get")
	route.Post("/student-information/:studentId", api.StudentInformationUpdate).Name("G06D07A04Update")
	route.Get("/student-address", api.StudentAddressList).Name("G06D07A07List")
	route.Patch("/document_template/:id", api.DocumentTemplateUpdate).Name("G06D07A08Update")
	route.Get("/document_template", api.DocumentTemplateList).Name("G06D07A09Get")
	route.Post("/document_template", api.DocumentTemplateCreate).Name("G06D07A10POST")
}
