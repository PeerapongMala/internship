package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LessonMonsterGetListRequest struct {
	LessonID   int    `params:"lesson_id" validate:"required"`
	LevelType  string `query:"level_type" validate:"omitempty"`
	Pagination *helper.Pagination
}

func (api *APIStruct) GetLessonMonsterByLessonID(c *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(c, &LessonMonsterGetListRequest{}, helper.ParseOptions{
		Params: true,
		Query:  true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	pagination := helper.PaginationNew(c)

	monsters, count, err := api.Service.GetLessonMonsterByLessonID(*request, pagination)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(200).JSON(fiber.Map{
		"_pagination": fiber.Map{
			"limit":       pagination.LimitResponse,
			"page":        pagination.Page,
			"total_count": count,
		},
		"status_code": 200,
		"data":        monsters,
		"message":     "success",
	})
}

func (service serviceStruct) GetLessonMonsterByLessonID(request LessonMonsterGetListRequest, pagination *helper.Pagination) ([]constant.LessonMonsterImageEntity, int, error) {
	monsterCount, err := service.academicLessonStorage.LessonMonsterGetCount(request.LessonID, request.LevelType)
	if err != nil {
		return nil, 0, err
	}

	if monsterCount == 0 {
		return []constant.LessonMonsterImageEntity{}, 0, nil
	}

	monsters, err := service.academicLessonStorage.LessonMonsterGet(request.LessonID, request.LevelType, pagination)
	if err != nil {
		return nil, 0, err
	}

	return monsters, monsterCount, nil
}
