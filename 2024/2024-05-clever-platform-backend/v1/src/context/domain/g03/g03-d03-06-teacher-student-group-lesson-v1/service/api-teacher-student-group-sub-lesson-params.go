package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetSubLessonParams(ctx *fiber.Ctx) (err error) {

	in := constant.GetSubLessonParamsParams{}

	if err := ctx.QueryParser(&in); err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	result, err := api.Service.GetSubLessonParams(&in)
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

func (service serviceStruct) GetSubLessonParams(in *constant.GetSubLessonParamsParams) ([]constant.SubLessonParamsEntity, error) {

	ents, err := service.storage.GetSubLessonByLessonId(in.LessonId)
	if err != nil {
		return nil, err
	}

	return ents, nil
}
