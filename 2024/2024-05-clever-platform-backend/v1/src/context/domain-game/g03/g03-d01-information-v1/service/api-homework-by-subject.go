package service

import "github.com/gofiber/fiber/v2"

func (api *APIStruct) ForwardToLevelHomework(c *fiber.Ctx) error {
	c.Path("/level/v1/homework/subject/" + c.Params("id") + c.OriginalURL()[len(c.Path()):])
	return c.RestartRouting()
}
