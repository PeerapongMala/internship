package g06D01GradeTemplateV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gradeTemplateService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gradeTemplateService,
	}

	// grade-system-template/v1
	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher, constant.Admin))

	// step 1 in figma (ข้อมูล template)
	route.Post("/grade-template", api.GradeTemplateCreate)
	route.Patch("/grade-template/:gradeTemplateId", api.GradeTemplateUpdate)
	route.Patch("/grade-template-detail/:gradeTemplateId", api.GradeTemplateUpdateDetail)
	route.Get("/grade-template/:gradeTemplateId", api.GradeTemplateGet)
	route.Get("/:schoolId/grade-template", api.GradeTemplateList)

	// step 2 in figma (ตั้งค่าวิช่)
	route.Patch("/subject/:gradeTemplateId", api.GradeSubjectUpdate)
	route.Get("/subject/:gradeTemplateId", api.GradeSubjectGet)
	route.Delete("/subject/:indicatorId", api.GradeSubjectDelete)
	route.Get("/indicator/:indicatorId", api.GradeIndicatorGet)
	route.Patch("/indicator/:indicatorId", api.GradeIndicatorUpdate)

	// general template
	route.Get("/:schoolId/general-template", api.GradeGeneralTemplateList)
	route.Get("/general-template/:id", api.GradeGeneralTemplateGet)
	route.Post("/general-template/", api.GradeGeneralTemplateCreate)
	route.Patch("/general-template/:id", api.GradeGeneralTemplateUpdate)

	//drop-down
	route.Get("/drop-down/:schoolId/year-list", api.YearList)
	route.Get("/drop-down/:schoolId/general-template", api.DropDownGeneralTemplateList)
	route.Get("/drop-down/:subjectId/indicators", api.IndicatorList)
}
