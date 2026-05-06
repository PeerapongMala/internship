package g03D12TeacherProfileV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, teacherHomeWorkService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: teacherHomeWorkService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Teacher, constant.Admin, constant.Parent))

	//List
	route.Get("/subject-list/:schoolId", api.SubjectList).Name("G03D06A01SubjectList")
	route.Get("/homework-template-list/:schoolId/:subjectId", api.HomeworkTemplateList).Name("G03D06A02HowmeworkTemplateList")
	route.Get("/homework-list/:schoolId/:subjectId", api.HomeworkList).Name("G03D06A03HomeworkList")

	//HomeworkTemplate
	route.Post("/homework-template", api.HomeworkTemplateCreate).Name("G03D06A04HomeworkTemplateCreate")
	route.Patch("/homework-template/:homeworkTemplateId", api.HomeworkTemplateUpdate).Name("G03D06A05HomeworkTemplateUpdate")
	route.Get("/homework-template/:homeworkTemplateId", api.HomeworkTemplateGet).Name("G03D06A06HomeworkTemplateGet")
	route.Get("/homework-template/sub-lesson-level/:lessonId", api.SubLessonLevelGet).Name("G03D06A07SubLessonLevelGet")
	route.Get("/drop-down/lesson-list/:subjectId", api.LessonList).Name("G03D06A08LessonList")
	route.Post("/homework-template/bulk-edit", api.HomeworkTemplateBulkEdit).Name("G03D06A09HomeworkTemplateBulkEdit")

	//Homework
	route.Post("/homework", api.HomeworkCreate).Name("G03D06A10HomeworkCreate")
	route.Patch("/homework/:homeworkId", api.HomeworkUpdate).Name("G03D06A11HomeworkUpdate")
	route.Get("/homework/:homeworkId", api.HomeworkGet).Name("G03D06A12HomeworkGet")
	route.Get("/assign-to-target-list/:schoolId", api.HomeworkAssignToTargetList).Name("G03D06A13AssignToTargetListGet")
	route.Post("/homework/bulk-edit", api.HomeworkBulkEdit).Name("G03D06A14HomeworkBulkEdit")

	//drop down
	route.Get("/drop-down/year-list", api.YearList).Name("G03D06A99HomeworkYearList")
	route.Get("/drop-down/class-list", api.ClassList).Name("G03D06A98HomeworkClassList")

	//homwork detail
	route.Get("/homework-detail-list/:homeworkId", api.HomeworkDetailList).Name("G03D06A15HomeworkDetailListGet")
	route.Get("/homework-submit-detail-list/:homeworkId", api.HomeworkSubmitDetailList).Name("G03D06A16HomeworkSubmitDetailListGet")
	route.Get("/homework-submit-student-list/:studentId/:homeworkId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin, constant.Parent), api.HomeworkStudentListList).Name("G03D06A17HomeworkSubmitStudentListGet")

	route.Get("/level-play-logs/:levelPlayLogId", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelCaseListStudentAnswer)
	route.Get("/levels/:levelId", authMiddleware.CheckRoles(constant.Teacher, constant.Parent), api.LevelGet)
}
