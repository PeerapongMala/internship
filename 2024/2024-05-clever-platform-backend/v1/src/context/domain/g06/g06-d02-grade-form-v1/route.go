package g06D01GradeTemplateV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gradeFormService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gradeFormService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher, constant.Admin))

	//ข้อมูลวิชา step-1
	route.Get("/:schoolId/evaluation-form", api.GradeEvaluationFormList).Name("G06D02A04List")
	route.Post("/evaluation-form", api.GradeEvaluationFormCreate).Name("G06D02A01Create")
	route.Get("/evaluation-form/:evaluationFormId", api.GradeEvaluationFormGet).Name("G06D02A03Get")
	route.Patch("/evaluation-form/bulk-edit", api.GradeEvaluationFormBulkUpdate).Name("G06D02A12Case")
	route.Post("/evaluation-form/:evaluationFormId/submit", api.GradeEvaluationFormSubmit).Name("G06D02A11Create")
	route.Patch("/evaluation-form/:evaluationFormId", api.GradeEvaluationFormUpdate).Name("G06D02A02Update")
	route.Get("/:schoolId/evaluation-form/download/csv", api.GradeEvaluationFormDownloadCsv).Name("G06D02A14Get")
	route.Post("/:schoolId/evaluation-form/upload/csv", api.GradeEvaluationFormUploadCsv).Name("G06D02A15Update")
	route.Get("/drop-down/:schoolId/template-list", api.GradeTemplateList).Name("G06D02A13Get")

	//เพิ่มผู้รับผิดชอบ step-2
	route.Get("/responsible-person/:evaluationFormId", api.AdditionalPersonGet).Name("G06D02A07List")
	route.Put("/responsible-person/:evaluationFormId", api.AdditionalPersonPut).Name("G06D02A05Update")

	//ใบประเมิน step-2-3
	route.Patch("/subject/:evaluationFormId", api.GradeSubjectUpsert).Name("G06D02A09Update")
	route.Patch("/indicator/:indicatorId", api.GradeSubjectIndicatorUpdate).Name("G06D02A18Update")
	route.Get("/subject/:evaluationFormId", api.GradeSubjectGet).Name("G06D02A10List")

	route.Get("/evaluation-sheet", api.EvaluationSheetList).Name("G06D02A16List")
	route.Patch("/evaluation-sheet/:evaluationSheetId", api.EvaluationSheetUpdate).Name("G06D02A17Update")
	route.Post("/:formId/clone", api.GradeEvaluationFormCloneTemplate)
	route.Post("/public-clone", api.GradeTemplateClone)
}
