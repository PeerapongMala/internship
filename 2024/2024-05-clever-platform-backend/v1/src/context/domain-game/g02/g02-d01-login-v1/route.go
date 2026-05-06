package g02D01LoginV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, rateLimitMiddleware *middleware.RateLimiterManager, authMiddleware *middleware.AuthMiddleware, loginService service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: loginService}

	app.Post(path+"/login/pin", rateLimitMiddleware.RateLimit(middleware.Auth), api.AuthCaseLoginWithPin)
	app.Get(path+"/oauth/:provider/redirect", api.AuthCaseOAuthRedirect)
	app.Post(path+"/oauth/:provider/login", api.AuthCaseLoginWithOauth)
	app.Post(path+"/oauth/:provider/login/user", api.AuthCaseUserLoginWithOauth)
	app.Get(path+"/oauth/:provider/profile", api.AuthCaseGetOauthProfile)
	app.Post(path+"/oauth/:provider/bind", api.AuthCaseBindWithOauth)
	app.Post(path+"/oauth/:provider/bind/user", api.AuthCaseBindUserWithOauth)
	app.Get(path+"/schools/existence", api.SchoolCaseCheckExistence)
	app.Post(path+"/login/admin-login-as", api.AuthCaseAdminLoginAs)
	app.Get(path+"/students", api.StudentGet)
	app.Post(path+"/parent/register", api.ParentCaseRegister)
	app.Get(path+"/game-assets", authMiddleware.CheckRoles(constant.Student), api.AssetPreSignedUrlList)
	app.Get(path+"/game-assets/zip", authMiddleware.CheckRoles(constant.Student), api.AssetZipPreSignedUrlList)
	app.Post(path+"/admins/existence", api.AuthCaseCheckAdmin)
}
