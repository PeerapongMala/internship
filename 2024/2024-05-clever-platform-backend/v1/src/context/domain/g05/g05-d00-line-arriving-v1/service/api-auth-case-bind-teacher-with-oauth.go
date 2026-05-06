package service

import "github.com/gofiber/fiber/v2"

func (api *APIStruct) AuthCaseBindTeacherWithOauth(context *fiber.Ctx) error {
	context.Path("/game-arriving/v1/oauth/" + context.Params("provider") + "/bind/user" + context.OriginalURL()[len(context.Path()):])
	return context.RestartRouting()
}
