package g00D01AuthV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	UserService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, authService service.ServiceInterface, userService UserService.ServiceInterface, path string) {
	api := &service.APIStruct{Service: authService}

	app.Post(path+"/login/pin", api.AuthCaseLoginWithPin)

	app.Patch(path+"/password", authMiddleware.CheckRoles(constant.AllRoles...), api.AuthCaseUpdatePassword)
	app.Patch(path+"/pin", authMiddleware.CheckRoles(constant.Admin), api.AuthCaseUpdatePin)

	app.Get(path+"/oauth/:provider/redirect", api.AuthCaseOAuthRedirect)
	app.Get(path+"/oauth/:provider/profile", api.AuthCaseGetOAuthProfile)
	app.Post(path+"/oauth/login", api.AuthCaseLoginWithOAuth)
	app.Post(path+"/oauth/bind", api.AuthCaseBindStudentWithOAuth)
	app.Post(path+"/oauth/unbind", authMiddleware.CheckRoles(constant.Admin), api.AuthCaseUnbindOAuth)

	//simulating oauth callback on frontend
	app.Get(path+"/oauth/:provider/callback", api.AuthCaseOAuthCallback)

	app.Post(path+"/observer-access", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessCreate)
	app.Get(path+"/observer-access", authMiddleware.CheckRoles(constant.Admin), api.ObserverAccessList)
}
