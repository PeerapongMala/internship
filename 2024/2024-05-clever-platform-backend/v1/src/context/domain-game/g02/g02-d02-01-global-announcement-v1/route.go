package g03d06MailBoxV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Get(path+"/announcement/system", authMiddleware.CheckRoles(constant.AllRoles...), api.SystemAnnouncementList)
	app.Get(path+"/announcement/teacher", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherAnnouncementList)
	app.Patch(path+"/announcement/:announceId", authMiddleware.CheckRoles(constant.AllRoles...), api.ReadByAnnouncementId)
	app.Post(path+"/announcement/system", authMiddleware.CheckRoles(constant.AllRoles...), api.SystemReadAll)
	app.Post(path+"/announcement/teacher", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherReadAll)

}
