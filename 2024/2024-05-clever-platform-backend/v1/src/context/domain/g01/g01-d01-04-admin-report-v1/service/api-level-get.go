package service

import "github.com/gofiber/fiber/v2"

func (api *APIStruct) LevelGet(context *fiber.Ctx) error {
	context.Path("/academic-level/v1/levels/" + context.Params("levelId") + context.Query(context.OriginalURL()[len(context.Path()):]))
	return context.RestartRouting()
}
