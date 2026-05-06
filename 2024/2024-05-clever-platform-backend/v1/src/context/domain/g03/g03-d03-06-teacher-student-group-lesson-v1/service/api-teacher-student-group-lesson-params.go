package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
	"strconv"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetLessonParams(ctx *fiber.Ctx) (err error) {

	studyGroupStr := ctx.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studyGroupId, err := strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	result, err := api.Service.GetLessonParams(studyGroupId)
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

func (service serviceStruct) GetLessonParams(studyGroupId int) ([]constant.LessonParamsEntity, error) {

	ents, err := service.storage.GetLessonByStudyGroupId(studyGroupId)
	if err != nil {
		return nil, err
	}

	return ents, nil
}
