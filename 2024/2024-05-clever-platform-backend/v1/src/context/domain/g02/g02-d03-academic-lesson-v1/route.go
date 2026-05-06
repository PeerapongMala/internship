package g02D03AcademicLessonV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/lessons", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator, constant.Teacher, constant.GameMaster), api.SubjectLessonCreate)
	app.Get(path+"/:subjectId/lessons", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.ContentCreator, constant.GameMaster), api.SubjectLessonList)
	app.Patch(path+"/lessons/:lessonId", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.GameMaster, constant.ContentCreator), api.SubjectLessonUpdate)

	app.Get(path+"/lessons/:lessonId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LessonGet)
	app.Patch(path+"/:subjectId/lessons/sort", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LessonCaseSort)
	app.Get(path+"/:subjectId/lessons/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LessonCaseDownloadCsv)
	app.Post(path+"/:subjectId/lessons/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.LessonCaseUploadCsv)
	app.Post(path+"/lessons/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.LessonCaseBulkEdit)

	app.Get(path+"/lessons/:lesson_id/monsters", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator, constant.Student), api.GetLessonMonsterByLessonID)
	app.Post(path+"/lessons/:lesson_id/monsters", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.CreateLessonMonsterBulkByLessonID)
	app.Delete(path+"/lessons/monsters", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.DeleteLessonMonsterBulkByID)
	app.Post(path+"/lessons/meta", api.LessonCaseGetMeta)
}
