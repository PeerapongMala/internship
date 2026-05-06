package g03D12TeacherProfileV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, teacherProfileService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: teacherProfileService,
	}

	app.Get(path+"/teacher", authMiddleware.CheckRoles(constant.Teacher), api.TeacherGet)
	app.Patch(path+"/teacher/password", authMiddleware.CheckRoles(constant.Teacher), api.TeacherCaseUpdatePassword)
	app.Patch(path+"/teacher", authMiddleware.CheckRoles(constant.Teacher), api.TeacherUpdate)
	app.Patch(path+"/teacher/oauth", authMiddleware.CheckRoles(constant.Teacher), api.UserCaseDeleteOauth)
}
