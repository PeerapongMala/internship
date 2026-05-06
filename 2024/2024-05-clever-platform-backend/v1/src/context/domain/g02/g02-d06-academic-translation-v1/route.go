package g02D06AcademicTranslationV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, rateLimitMiddleware *middleware.RateLimiterManager, authMiddleware *middleware.AuthMiddleware, academicTranslationService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: academicTranslationService}

	app.Post(path+"/:curriculumGroupId/saved-text", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCreate)
	app.Get(path+"/saved-text/:groupId", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextGet)
	app.Patch(path+"/saved-text/:groupId", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextUpdate)
	app.Post(path+"/saved-text/translate", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseTranslate)
	app.Get(path+"/:curriculumGroupId/saved-text", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextList)
	app.Patch(path+"/saved-text/:groupId/speech", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseUpdateSpeech)
	app.Patch(path+"/saved-text/:groupId/status", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseUpdateStatus)
	app.Patch(path+"/saved-text/:groupId/speech/toggle", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseToggleSpeech)
	app.Post(path+"/saved-text/bulk-edit", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseBulkEdit)

	app.Get(path+"/:curriculumGroupId/saved-text/download/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseDownloadCsv)
	app.Post(path+"/:curriculumGroupId/saved-text/upload/csv", authMiddleware.CheckRoles(constant.ContentCreator), api.SavedTextCaseUploadCsv)
}
