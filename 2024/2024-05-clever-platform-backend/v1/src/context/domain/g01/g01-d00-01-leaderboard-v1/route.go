package g01d0001leaderboardv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/service"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Get(path+"/leaderboard", api.LeaderboardGet)
	app.Post(path+"/leaderboard", api.LeaderboardCreate)
	app.Delete(path+"/leaderboard/:id", api.LeaderboardDelete)
	app.Put(path+"/leaderboard/:id", api.LeaderboardUpdate)

}
