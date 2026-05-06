package g03d01InformationV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Student))
	route.Get("/inventory-information", api.MainManuAccountInventoryGet)
	route.Get("/count-checkin/:subjectId", api.SubjectCheckinCountGet)
	route.Get("/count-unread-announcement", api.UnreadAnouncementCountGet)
	route.Get("/inventory-profile", api.GetInventoryProfile)
	route.Get("/announcement/school/:school_id", api.AnouncementList)
	route.Get("/account", api.GetAccount)

	// forward to level
	route.Get("/leaderboard/subject/:id", api.ForwardToLevelLeaderBoard)
	route.Get("/achivement/subject/:id", api.ForwardToLevelAchivement)
	route.Get("/homework/subject/:id", api.ForwardToLevelHomework)
}
