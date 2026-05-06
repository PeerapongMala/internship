package g00D00ArrivingV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, rateLimitMiddleware *middleware.RateLimiterManager, authMiddleware *middleware.AuthMiddleware, arrivingService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: arrivingService}

	app.Get(path+"/curriculum-groups", authMiddleware.CheckRoles(constant.ContentCreator), api.CurriculumGroupCaseListByContentCreator)
	app.Post(path+"/auth/login/email-password", rateLimitMiddleware.RateLimit(middleware.Auth), api.AuthCaseLoginWithEmailPassword)
}
