package g02D0301StreakLoginV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.Student))

	//deprecated
	route.Patch("/subject-checkin", api.SubjectCheckinUpdate)
	route.Patch("/subject-reward", api.SubjectRewardUpdate)
	route.Get("/inventory/:studentId", api.InventoryGetByStudentId)
	route.Patch("/inventory", api.InventoryUpdateByStudentId)
	route.Post("/subject-reward", api.SubjectRewardCreate)

	// reward
	route.Get("/subject-reward/:subjectId", api.SubjectRewardGetBySubjectId)
	route.Get("/user-stat/:subjectId", api.GetStreakLoginStat)
	route.Post("/check-in", api.CheckInSendReward)
	route.Post("/check-in/bulk-edit", api.CheckInBulkSendReward)
	route.Post("/use-item", api.UseItem)
	route.Get("/subject-reward-status/:subjectId", api.SubjectRewardStatusGetBySubjectId)
	
}
