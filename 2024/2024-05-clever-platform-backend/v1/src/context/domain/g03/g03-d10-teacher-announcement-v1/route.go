package g01D0001globalannounceV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/global/announcement", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.AddTeacherAnnouncement)
	app.Patch(path+"/global/announcement/:announceId", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.TeacherAnnounceUpdate)
	app.Get(path+"/global/announcement/:announceId", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.GetAnnouncementByid)
	app.Get(path+"/global/announcement", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.AnnouncementList)
	app.Get(path+"/global/announcement/csv/download", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.TeacherAnnouncementCsvDownload)
	app.Post(path+"/global/announcement/csv/upload", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.TeacherAnnouncementCsvUplod)
	app.Post(path+"/global/announcement/bulk-edit", authMiddleware.CheckRoles(constant.Admin, constant.Teacher, constant.Announcer), api.AnnouncementBulkEdit)

}
