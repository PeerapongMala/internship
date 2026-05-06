package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetPrePostTestLevelsParams(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetPrePostTestLevelsParams{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	result, err := api.Service.GetPrePostTestLevelsParams(in.SubLessonId)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return ctx.Status(http.StatusOK).JSON(constant.Response{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service serviceStruct) GetPrePostTestLevelsParams(subLessonId int) ([]constant.LevelParamsEntity, error) {

	ents, err := service.storage.GetLevelsBySubLessonId(subLessonId)
	if err != nil {
		return nil, err
	}

	return ents, nil
}
