package service

import (
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) ForwardToLevelLeaderBoard(c *fiber.Ctx) error {
	//c.Path("/level/v1/leaderboard/subject/" + c.Params("id") + c.OriginalURL()[len(c.Path()):])
	//log.Println(c.Path())
	//return c.RestartRouting()
	id := c.Params("id")
	newPath := "/level/v1/leaderboard/subject/" + id
	c.Path(newPath)
	c.Context().URI().SetPath(string([]byte(newPath)))
	return c.RestartRouting()
}
