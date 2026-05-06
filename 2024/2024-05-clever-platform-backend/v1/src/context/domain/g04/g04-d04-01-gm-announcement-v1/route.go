package g01D0001globalannounceV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	/// List
	app.Get(path+"/global/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetGlobalAnnounce)
	app.Get(path+"/event/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetEventAnnounce)
	app.Get(path+"/reward/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetRewardAnnounce)
	app.Get(path+"/news/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetNewsAnnounce)
	//
	//
	///Create
	app.Post(path+"/global/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.AddGlobalAnnounce)
	app.Post(path+"/event/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.AddEventAnnounce)
	app.Post(path+"/reward/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.AddRewardAnnounce)
	app.Post(path+"/news/announcement", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.AddNewsAnnounce)
	//Update Announcement
	app.Patch(path+"/global/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.UpdateGlobalAnnounce)
	app.Patch(path+"/event/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.UpdateEventAnnounce)
	app.Patch(path+"/reward/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.UpdateRewardAnnounce)
	app.Patch(path+"/news/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.UpdateNewsAnnounce)

	//DELETE announcemnt
	app.Delete(path+"/reward/announcement/:announceId/item/:itemId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.DeleteAnnouncementItem)
	app.Patch(path+"/reward/announcement/:announceId/coin", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.UpdateCoinAmount)
	///GET BY ID
	app.Get(path+"/global/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetGlobalAnnounceById)
	app.Get(path+"/event/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetEventAnnounceById)
	app.Get(path+"/news/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetNewsAnnounceById)
	app.Get(path+"/reward/announcement/:announceId", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GetRewardAnnounceById)

	//CSV Download
	app.Get(path+"/global/announcement/download/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GlobalAnnounceCsvDownload)
	app.Get(path+"/event/announcement/download/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.EventAnnounceCsvDownload)
	app.Get(path+"/reward/announcement/download/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.RewardAnnounceCsvDownload)
	app.Get(path+"/news/announcement/download/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.NewsAnnounceCsvDownload)

	//CSV Upload
	app.Post(path+"/global/announcement/upload/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GlobalAnnounceCSVUpload)
	app.Post(path+"/event/announcement/upload/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.EventAnnounceCSVUpload)
	app.Post(path+"/reward/announcement/upload/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.RewardAnnounceCSVUpload)
	app.Post(path+"/news/announcement/upload/csv", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.NewsAnnounceCSVUpload)

	//Bulk-Edit
	app.Post(path+"/global/announcement/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.GlobalAnnounceBulkEdit)
	app.Post(path+"/event/announcement/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.EventAnnounceBulkEdit)
	app.Post(path+"/reward/announcement/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.RewardAnnounceBulkEdit)
	app.Post(path+"/news/announcement/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.NewsAnnounceBulkEdit)

	//Drop-Down
	app.Get(path+"/announcement/drop-down/year", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.YearList)
	app.Get(path+"/announcement/drop-down/school", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.SchoolList)
	app.Get(path+"/announcement/drop-down/subject", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.SubjectList)
	app.Get(path+"/announcement/drop-down/academic-year", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.AcademicYearList)
	app.Get(path+"/announcement/drop-down/arcade-game", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.ArcadeGameList)
	app.Get(path+"/announcement/drop-down/items", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.ItemDropDown)
	app.Get(path+"/announcement/drop-down/:schoolId/academic-year", authMiddleware.CheckRoles(constant.GameMaster, constant.Admin), api.SchoolAcademicYear)
}
