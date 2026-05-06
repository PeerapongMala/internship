package service

import "github.com/gofiber/fiber/v2"

func (api *APIStruct) ParentCaseRegister(context *fiber.Ctx) error {
	context.Path("/game-arriving/v1/parent/register")
	return context.RestartRouting()
}
