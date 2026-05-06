package g02D04AcademicSubLessonV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/sub-lessons", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.ContentCreator, constant.GameMaster), api.SubjectSubLessonCreate)
	app.Patch(path+"/sub-lessons/:subLessonId", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.ContentCreator, constant.GameMaster), api.SubjectSubLessonUpdate)
	app.Get(path+"/:lessonId/sub-lessons", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.GameMaster, constant.ContentCreator), api.SubjectSubLessonList)

	app.Get(path+"/sub-lessons/:subLessonId", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonGet)
	app.Patch(path+"/:lessonId/sub-lessons/sort", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonCaseSort)
	app.Get(path+"/:lessonId/sub-lessons/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonCaseDownloadCsv)
	app.Post(path+"/:lessonId/sub-lessons/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonCaseUploadCsv)
	app.Post(path+"/sub-lessons/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonCaseBulkEdit)
}
