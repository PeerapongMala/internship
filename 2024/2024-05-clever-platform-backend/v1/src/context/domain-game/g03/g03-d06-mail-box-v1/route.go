package g03d06MailBoxV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Get(path+"/announcement/:subjectId/event", authMiddleware.CheckRoles(constant.AllRoles...), api.EventAnnounceList)
	app.Get(path+"/announcement/:subjectId/reward", authMiddleware.CheckRoles(constant.AllRoles...), api.RewardAnnounceList)
	app.Get(path+"/announcement/:subjectId/system", authMiddleware.CheckRoles(constant.AllRoles...), api.SystemAnnounceList)
	app.Post(path+"/announcement/:announceId", authMiddleware.CheckRoles(constant.AllRoles...), api.UserAnnouncementCreate)
	app.Patch(path+"/announcement/:announceId", authMiddleware.CheckRoles(constant.AllRoles...), api.UserAnnouncementDelete)
	app.Patch(path+"/announcement/:subjectId/reward/:announceId", authMiddleware.CheckRoles(constant.AllRoles...), api.ItemReceived)
	app.Patch(path+"/announcement/:subjectId/reward", authMiddleware.CheckRoles(constant.AllRoles...), api.RewardAnnouncementBulkEdit)
	app.Patch(path+"/announcement/:subjectId/system", authMiddleware.CheckRoles(constant.AllRoles...), api.SystemAnnouncementBulkEdit)
	app.Post(path+"/announcement/:subjectId/event", authMiddleware.CheckRoles(constant.AllRoles...), api.EventReadAll)
	app.Post(path+"/announcement/:subjectId/system", authMiddleware.CheckRoles(constant.AllRoles...), api.SystemReadAll)
	app.Post(path+"/announcement/:subjectId/reward", authMiddleware.CheckRoles(constant.AllRoles...), api.RewardReadReceivedAll)
	app.Get(path+"/announcement/:subjectId/teacher-reward", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherRewardList)
	app.Patch(path+"/announcement/:subjectId/teacher-reward/:rewardId", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherRewardReceivedById)
	app.Post(path+"/announcement/:subjectId/teacher-reward/:rewardId", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherRewardDeleteById)
	app.Patch(path+"/announcement/:subjectId/teacher-reward", authMiddleware.CheckRoles(constant.AllRoles...), api.TeacherRewardReceivedAll)
	app.Post(path+"/announcement/:subjectId/teacher-reward", authMiddleware.CheckRoles(constant.AllRoles...), api.RewardDeleteAll)

}
