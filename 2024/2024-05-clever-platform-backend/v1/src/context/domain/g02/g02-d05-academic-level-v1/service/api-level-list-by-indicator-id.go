package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type LevelListByIndicatorIdRequest struct {
	IndicatorId  *int  `params:"indicatorId" validate:"required"`
	SubLessonIds []int `json:"sub_lesson_ids"`
}

// ==================== Response ==========================

type LevelListByIndicatorIdResponse struct {
	StatusCode int              `json:"status_code"`
	Data       map[string][]int `json:"data"`
	Message    string           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelListByIndicatorId(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelListByIndicatorIdRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	levelListByIndicatorIdOutput, err := api.Service.LevelListByIndicatorId(&LevelListByIndicatorIdInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelListByIndicatorIdResponse{
		StatusCode: http.StatusOK,
		Data:       levelListByIndicatorIdOutput.Groups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelListByIndicatorIdInput struct {
	*LevelListByIndicatorIdRequest
}

type LevelListByIndicatorIdOutput struct {
	Groups map[string][]int
}

func (service *serviceStruct) LevelListByIndicatorId(in *LevelListByIndicatorIdInput) (*LevelListByIndicatorIdOutput, error) {
	groups := map[string][]int{
		constant.PrePostTest:       {},
		"test-easy":                {},
		"test-medium":              {},
		"test-hard":                {},
		"easy-medium-hard-test":    {},
		constant.SubLessonPostTest: {},
	}

	indicatorLevels, err := service.academicLevelStorage.LevelListByIndicatorId(*in.IndicatorId, in.SubLessonIds)
	if err != nil {
		return nil, err
	}

	for _, indicatorLevel := range indicatorLevels {
		switch indicatorLevel.Type {
		case constant.PrePostTest:
			groups[constant.PrePostTest] = append(groups[constant.PrePostTest], indicatorLevel.Id)
			continue
		case constant.SubLessonPostTest:
			groups[constant.SubLessonPostTest] = append(groups[constant.SubLessonPostTest], indicatorLevel.Id)
			continue
		}

		switch indicatorLevel.Difficulty {
		case constant.Easy:
			groups["test-easy"] = append(groups["test-easy"], indicatorLevel.Id)
		case constant.Medium:
			groups["test-medium"] = append(groups["test-medium"], indicatorLevel.Id)
		case constant.Hard:
			groups["test-hard"] = append(groups["test-hard"], indicatorLevel.Id)
		}
		groups["easy-medium-hard-test"] = append(groups["easy-medium-hard-test"], indicatorLevel.Id)
	}

	return &LevelListByIndicatorIdOutput{
		groups,
	}, nil
}
