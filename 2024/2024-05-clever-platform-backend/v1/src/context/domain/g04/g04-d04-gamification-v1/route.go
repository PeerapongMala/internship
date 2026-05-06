package g04D04GamificationV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, gamificationService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: gamificationService,
	}

	app.Get(path+"/level-rewards", authMiddleware.CheckRoles(constant.GameMaster), api.LevelRewardList)
	app.Get(path+"/seed-subject-groups", authMiddleware.CheckRoles(constant.GameMaster), api.SeedSubjectGroupList)
	app.Get(path+"/levels", authMiddleware.CheckRoles(constant.GameMaster), api.LevelList)
	app.Get(path+"/subjects", authMiddleware.CheckRoles(constant.GameMaster), api.SubjectList)
	app.Get(path+"/lessons", authMiddleware.CheckRoles(constant.GameMaster), api.LessonList)
	app.Get(path+"/sub-lessons", authMiddleware.CheckRoles(constant.GameMaster), api.SubLessonList)
	app.Get(path+"/items", authMiddleware.CheckRoles(constant.GameMaster), api.ItemList)
	app.Post(path+"/levels/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster), api.LevelSpecialRewardCaseBulkEdit)
	app.Get(path+"/levels/:levelId/special-rewards", authMiddleware.CheckRoles(constant.GameMaster), api.LevelSpecialRewardItemList)
	app.Post(path+"/levels/:levelId/special-rewards/bulk-edit", authMiddleware.CheckRoles(constant.GameMaster), api.LevelSpecialRewardItemCaseBulkEdit)
	app.Patch(path+"/levels/:levelId/special-rewards/:levelSpecialRewardId", authMiddleware.CheckRoles(constant.GameMaster), api.LevelSpecialRewardItemUpdate)
	app.Get(path+"/levels/:levelId", authMiddleware.CheckRoles(constant.GameMaster), api.LevelDataGet)
}
