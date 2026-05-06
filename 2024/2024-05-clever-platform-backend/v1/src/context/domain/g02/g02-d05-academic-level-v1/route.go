package g02D05AcademicLevelV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, rateLimitMiddleware *middleware.RateLimiterManager, authMiddleware *middleware.AuthMiddleware, academicLevelService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: academicLevelService}

	app.Post(path+"/sub-lessons/:subLessonId/levels/sort", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LevelCaseSort)

	app.Post(path+"/levels", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LevelCreate)
	app.Get(path+"/levels/:levelId", authMiddleware.CheckRoles(constant.Observer, constant.Admin, constant.ContentCreator, constant.Teacher, constant.Student, constant.Parent), api.LevelGet)
	app.Patch(path+"/levels/:levelId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LevelUpdate)
	app.Get(path+"/levels/:levelId/questions", authMiddleware.CheckRoles(constant.Observer, constant.Admin, constant.ContentCreator, constant.Student, constant.Teacher), api.LevelCaseListQuestion)
	app.Get(path+"/:subLessonId/levels", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator, constant.Student), api.LevelList)
	app.Post(path+"/levels/:levelId/questions/sort", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseSort)
	app.Post(path+"/:subLessonId/levels/upload/csv", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LevelCaseUploadCsv)
	app.Post(path+"/:lessonId/cm-levels/upload/csv", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.CleverMathLevelCaseUploadCsv)
	app.Post(path+"/levels/bulk-edit", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LevelCaseBulkEdit)

	app.Post(path+"/:curriculumGroupId/saved-text", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextCreate)
	app.Get(path+"/saved-text/:groupId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextGet)
	app.Patch(path+"/saved-text/:groupId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextUpdate)
	app.Get(path+"/:curriculumGroupId/saved-text", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextList)
	app.Patch(path+"/saved-text/:groupId/speech", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextCaseUpdateSpeech)
	app.Delete(path+"/saved-text/:groupId/speech", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextCaseDeleteSpeech)
	app.Post(path+"/saved-text/translate", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SavedTextCaseTranslate)

	app.Get(path+"/questions/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionGet)
	app.Delete(path+"/questions/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionDelete)
	app.Patch(path+"/questions/:questionId/image", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseDeleteImage)

	app.Post(path+"/questions/multiple-choice", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionMultipleChoiceCreate)
	app.Patch(path+"/questions/multiple-choice/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionMultipleChoiceUpdate)

	app.Post(path+"/questions/sort", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionSortCreate)
	app.Patch(path+"/questions/sort/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionSortUpdate)

	app.Post(path+"/questions/group", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionGroupCreate)
	app.Patch(path+"/questions/group/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionGroupUpdate)

	app.Post(path+"/questions/input", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionInputCreate)
	app.Patch(path+"/questions/input/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionInputUpdate)

	app.Post(path+"/questions/placeholder", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionPlaceholderCreate)
	app.Patch(path+"/questions/placeholder/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionPlaceholderUpdate)

	app.Get(path+"/:subjectId/lessons", authMiddleware.CheckRoles(constant.ContentCreator), api.LessonCaseListBySubject)
	app.Get(path+"/:lessonId/sub-lessons", authMiddleware.CheckRoles(constant.ContentCreator), api.SubLessonCaseListByLesson)
	app.Get(path+"/:subjectId/tags", authMiddleware.CheckRoles(constant.ContentCreator), api.TagCaseListBySubject)
	app.Get(path+"/:curriculumGroupId/sub-criteria", authMiddleware.CheckRoles(constant.ContentCreator), api.SubCriteriaCaseListByCurriculumGroup)
	app.Get(path+"/:subLessonId/standard", authMiddleware.CheckRoles(constant.Observer, constant.ContentCreator, constant.Teacher, constant.Student, constant.Admin), api.SubLessonCaseGetStandard)

	app.Post(path+"/questions/:questionId/translate", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseTranslate)
	app.Post(path+"/questions/:questionId/text-save", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseTextSave)
	app.Post(path+"/questions/:questionId/speech", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseCreateSpeech)
	app.Post(path+"/questions/:questionId/text-to-ai-save", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionCaseTextToAiSave)

	app.Get(path+"/level-play-logs/:levelPlayLogId/answers", authMiddleware.CheckRoles(constant.Observer, constant.Admin, constant.Teacher, constant.Student, constant.Parent), api.LevelCaseListStudentAnswer)
	app.Post(path+"/indicators/:indicatorId/levels", authMiddleware.CheckRoles(constant.Teacher, constant.ContentCreator), api.LevelListByIndicatorId)
	app.Get(path+"/:subLessonId/levels/zip", authMiddleware.CheckRoles(constant.Student, constant.Teacher), api.LevelCaseDownloadZip)

	app.Get(path+"/:lessonId/sub-lesson-urls", authMiddleware.CheckRoles(constant.Student), api.SubLessonUrlList)
	app.Post(path+"/:lessonId/sub-lesson-urls", authMiddleware.CheckRoles(constant.Student), api.SubLessonUrlCaseCheck)
	app.Post(path+"/sub-lessons/file", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SubLessonFileStatusUpdate)
	app.Post(path+"/lesson-levels/bulk-edit", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.LessonLevelCaseBulkEdit)
	app.Post(path+"/sub-lesson-files/bulk-edit", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.SubLessonFileStatusBulkEdit)
	app.Get(path+"/sub-lessons/:subLessonId/download/json", authMiddleware.CheckRoles(constant.Admin), api.LessonCaseDownloadJson)

	app.Post(path+"/questions/learn", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionLearnCreate)
	app.Patch(path+"/questions/learn/:questionId", authMiddleware.CheckRoles(constant.Admin, constant.ContentCreator), api.QuestionLearnUpdate)
}
