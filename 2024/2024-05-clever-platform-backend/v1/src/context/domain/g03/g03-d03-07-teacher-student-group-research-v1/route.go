package g03d0307teacherstudentgroupresearch

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := service.NewAPIStruct(serviceInstance)

	groupRoute := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	mainRoute := groupRoute.Group("/study-group/:studyGroupId")

	researchStatRoute := mainRoute.Group("/research-t-test-pair-model-stat")
	researchStatRoute.Get("/list", api.GetTTestPairModelStatList)
	researchStatRoute.Get("/csv", api.GetTTestPairModelStatCsv)
	researchStatRoute.Get("/result", api.GetTTestPairResult)

	researchDDRStatRoute := mainRoute.Group("/ddr")
	researchDDRStatRoute.Get("/score", api.GetDDRScoreResult)
	researchDDRStatRoute.Get("/summary", api.GetDDRSummaryResult)
	researchDDRStatRoute.Get("/score/csv", api.GetDDRScoreResultCsv)
	researchDDRStatRoute.Get("/summary/csv", api.GetDDRSummaryResultCsv)

	paramRoute := mainRoute.Group("/params")
	paramRoute.Get("/level", api.GetPrePostTestLevelsParams)
}
