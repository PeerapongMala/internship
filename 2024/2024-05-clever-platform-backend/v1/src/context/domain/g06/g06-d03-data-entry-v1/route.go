package g06D01GradeTemplateV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gradeDataEntryService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gradeDataEntryService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	route.Get("/evaluation-sheet", api.EvaluationSheetList).Name("G06D03A01List")
	route.Get("/evaluation-sheet/:evaluationSheetId", api.EvaluationSheetGet).Name("G06D03A02Get")
	route.Patch("/evaluation-sheet/:evaluationSheetId", api.EvaluationSheetUpdate).Name("G06D03A03Update")
	route.Post("/evaluation-sheet/note", api.EvaluationNoteAdd).Name("G06D03A04Create")
	route.Get("/evaluation-sheet/note/:evaluationSheetId", api.EvaluationNoteGet).Name("G06D03A05Get")
	route.Get("/evaluation-sheet/edit-history/:evaluationSheetId", api.EvaluationSheetHistoryList).Name("G06D03A06List")
	route.Get("/evaluation-sheet/edit-history/compare/:evaluationSheetId", api.EvaluationSheetHistoryCompare).Name("G06D03A07Get")
	route.Post("/evaluation-sheet/:evaluationSheetId/retrieve-version", api.EvaluationSheetRetrieveVersion).Name("G06D03A08Case")

	route.Get("/seed-academic-years", api.SeedAcademicYearList)
	route.Get("/seed-years", api.SeedYearList)
	route.Get("/classes", api.ClassList)
	route.Get("/subjects", api.SubjectList)
	route.Get("/evaluation-sheet/:evaluationSheetId/subject", api.EvaluationSheetGetSubject)
	route.Post("/evaluation-form-setting/score", api.EvaluationFormSettingGetScore)
}
