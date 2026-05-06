package g03D03TeacherStudentGroupV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(
	app *fiber.App, authMiddleware *middleware.AuthMiddleware,
	teacherStudentGroupService service.ServiceInterface,
	path string,
) {
	api := &service.APIStruct{
		Service: teacherStudentGroupService,
	}
	groupRoute := app.Group(path, authMiddleware.CheckRoles(constant.Teacher))

	groupRoute.Get("/study-groups", api.StudyGroupLists).Name("G03D03A01GetStudyGroupLists")

	statRoute := groupRoute.Group("/study-group/:studyGroupId/stat")
	statRoute.Get("/options", api.StudyGroupStatOptionsGetByParams).Name("G03D03A04GetStatOptions")
	statRoute.Get("/list", api.LessonStatListGetByParams).Name("G03D03A04GetLessonStatList")
	statRoute.Get("/csv", api.LessonStatCsvGetByParams).Name("G03D03A04GetLessonStatCsv")
	statRoute.Get("/lessonId/:lessonId/list", api.SubLessonStatListGetByParams).Name("G03D03A04GetSubLessonStatList")
	statRoute.Get("/lessonId/:lessonId/csv", api.SubLessonStatCsvGetByParams).Name("G03D03A04GetSubLessonStatCsv")
	statRoute.Get("/subLessonId/:subLessonId/list", api.LevelStatListGetByParams).Name("G03D03A04GetLevelStatList")
	statRoute.Get("/subLessonId/:subLessonId/csv", api.LevelStatCsvGetByParams).Name("G03D03A04GetLevelStatCsv")

	playStatRoute := groupRoute.Group("/study-group/:studyGroupId/play-stat")
	playStatRoute.Get("/list", api.PlayLogStatListGetByParams).Name("G03D03A05GetPlayStatList")
	playStatRoute.Get("/csv", api.PlayLogStatCsvGetByParams).Name("G03D03A05GetPlayStatCsv")
}
