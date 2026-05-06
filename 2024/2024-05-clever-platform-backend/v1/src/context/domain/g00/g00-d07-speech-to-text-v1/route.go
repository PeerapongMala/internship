package g00D07SpeechToTextV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d07-speech-to-text-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, speechToTextService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: speechToTextService}

	app.Post(path+"/transcribe", authMiddleware.CheckRoles(constant.Student), api.SpeechToTextCaseTranscribe)
}
