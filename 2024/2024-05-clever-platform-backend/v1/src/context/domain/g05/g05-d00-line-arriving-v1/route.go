package g05D00LineArrivingV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d00-line-arriving-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/oauth/:provider/login/user", api.AuthCaseLoginWithOauth)
	app.Post(path+"/oauth/:provider/bind/student", api.AuthCaseBindStudentWithOauth)
	app.Post(path+"/oauth/:provider/bind/user", api.AuthCaseBindTeacherWithOauth)
	app.Post(path+"/parent/register", api.ParentCaseRegister)
}
