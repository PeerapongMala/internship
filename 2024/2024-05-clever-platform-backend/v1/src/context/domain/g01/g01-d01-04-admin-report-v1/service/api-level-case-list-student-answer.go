package service

import (
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) LevelCaseListStudentAnswer(context *fiber.Ctx) error {
	context.Path("/academic-level/v1/level-play-logs/" + context.Params("levelPlayLogId") + "/answers" + context.Query(context.OriginalURL()[len(context.Path()):]))
	return context.RestartRouting()
}
