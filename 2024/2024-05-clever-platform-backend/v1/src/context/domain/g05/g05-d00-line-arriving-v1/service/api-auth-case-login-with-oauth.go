package service

import (
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) AuthCaseLoginWithOauth(context *fiber.Ctx) error {
	context.Path("/game-arriving/v1/oauth/" + context.Params("provider") + "/login/user" + context.OriginalURL()[len(context.Path()):])
	return context.RestartRouting()
}
