package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LessonMonsterCreateRequest struct {
	LessonID int                          `params:"lesson_id" validate:"required"`
	Monsters []constant.MonsterCreateItem `json:"monster_lists" validate:"dive"`
}

func (api *APIStruct) CreateLessonMonsterBulkByLessonID(c *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(c, &LessonMonsterCreateRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	err = api.Service.CreateLessonMonsterBulkByLessonID(*request)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status_code": fiber.StatusCreated,
		"message":     "created_success",
	},
	)
}

func (service serviceStruct) CreateLessonMonsterBulkByLessonID(request LessonMonsterCreateRequest) error {
	return service.academicLessonStorage.LessonMonsterCreate(request.LessonID, request.Monsters)
}
