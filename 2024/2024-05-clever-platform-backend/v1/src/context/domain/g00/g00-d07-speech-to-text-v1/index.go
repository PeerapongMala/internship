package g00D07SpeechToTextV1

import (
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage"
	speechToTextService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/service"
	speechToTextStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/storage"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func Init(app *fiber.App, resource coreInterface.Resource, path string) speechToTextService.ServiceInterface {
	authMiddlewareStorageInstance := authMiddlewareStorage.StorageNew(resource)
	authMiddleware := middleware.AuthMiddlewareNew(authMiddlewareStorageInstance)

	speechToTextStorageInstance := speechToTextStorage.StorageNew(resource)
	speechToTextServiceInstance := speechToTextService.ServiceNew(speechToTextStorageInstance)

	route(app, authMiddleware, speechToTextServiceInstance, path)

	return speechToTextServiceInstance
}
