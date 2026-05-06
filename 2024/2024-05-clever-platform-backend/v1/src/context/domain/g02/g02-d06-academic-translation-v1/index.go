package g02D06AcademicTranslationV1

import (
	cloudStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/storage"
	textToSpeechStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d04-text-to-speech-v1/storage"
	translateStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d05-translate-v1/storage"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	academicLevelStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/storage"
	academicTranslationService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/service"
	academicTranslationStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) academicTranslationService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	academicTranslationStorageInstance := academicTranslationStorage.StorageNew(resource)
	cloudStorageInstance := cloudStorage.StorageNew(resource)
	textToSpeechStorageInstance := textToSpeechStorage.StorageNew(resource)
	translateStorageInstance := translateStorage.StorageNew(resource)
	academicLevelStorageInstance := academicLevelStorage.StorageNew(resource)

	//academicTranslationServiceInstance := academicTranslationService.ServiceNew(academicTranslationStorageInstance, cloudStorageInstance, textToSpeechStorageInstance, translateStorageInstance)
	//route(app, resource.RateLimiterManager, authMiddleware, academicTranslationServiceInstance, path)
	academicTranslationServiceInstance := academicTranslationService.ServiceNew(academicTranslationStorageInstance, academicLevelStorageInstance, cloudStorageInstance, textToSpeechStorageInstance, translateStorageInstance)
	route(app, resource.RateLimiterManager, authMiddleware, academicTranslationServiceInstance, path)

	return academicTranslationServiceInstance
}
