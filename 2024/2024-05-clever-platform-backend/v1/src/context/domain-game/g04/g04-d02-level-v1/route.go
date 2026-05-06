package g04d02LevelV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, levelService service.ServiceInterface, path string) {
	api := &service.APIStruct{
		Service: levelService,
	}

	route := app.Group(path, authMiddleware.CheckRoles(constant.Student))

	route.Get("/level-detail/:subLessonId", api.GetLevelDetail)
	route.Get("/gold-coin", api.GetGoldCoin)

	route.Get("/homework/subject/:id", api.GetHomeWork)
	route.Get("/achivement/:type/:id", api.GetAchivement) // type: sub-lesson, subject

	route.Get("/leaderboard/level/:id", api.GetLeaderBoardByLevelId)
	route.Get("/leaderboard/sub-lesson/:id", api.GetLeaderBoardBySubLessonId)
	route.Get("/leaderboard/subject/:id", api.GetLeaderBoardBySubjectId)
	route.Get("/last-play", api.LevelCaseGetLastPlay)
}
