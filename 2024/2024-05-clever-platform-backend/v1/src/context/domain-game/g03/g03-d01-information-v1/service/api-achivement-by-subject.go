package service

import "github.com/gofiber/fiber/v2"

func (api *APIStruct) ForwardToLevelAchivement(c *fiber.Ctx) error {
	c.Path("/level/v1/achivement/subject/" + c.Params("id") + c.OriginalURL()[len(c.Path()):])
	return c.RestartRouting()
}
