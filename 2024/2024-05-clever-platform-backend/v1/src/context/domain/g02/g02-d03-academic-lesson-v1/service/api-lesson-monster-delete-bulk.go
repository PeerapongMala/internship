package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type DeleteLessonMonsterBulkByIDRequest struct {
	MonsterIDs []int `json:"monster_ids" `
}

func (api *APIStruct) DeleteLessonMonsterBulkByID(c *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(c, &DeleteLessonMonsterBulkByIDRequest{}, helper.ParseOptions{
		Body: true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	err = api.Service.DeleteLessonMonsterBulkByID(request.MonsterIDs)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status_code": fiber.StatusOK,
		"message":     "delete_success",
	},
	)
}

func (service serviceStruct) DeleteLessonMonsterBulkByID(monsterIDs []int) error {
	return service.academicLessonStorage.LessonMonsterDeleteByIDs(monsterIDs)
}
