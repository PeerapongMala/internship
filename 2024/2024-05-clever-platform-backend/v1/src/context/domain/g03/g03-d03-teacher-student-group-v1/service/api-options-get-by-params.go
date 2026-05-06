package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type GetOptionsResponse struct {
	constant.StatusResponse
	Data *constant.OptionObject `json:"data"`
}

func (api *APIStruct) StudyGroupStatOptionsGetByParams(context *fiber.Ctx) error {
	studyGroupStr := context.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studyGroupId, err := strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in := constant.OptionFilter{
		OptionParam: constant.OptionParam{
			StudyGroupId: studyGroupId,
		},
	}
	if err := context.QueryParser(&in); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	var ok bool
	in.TeacherId, ok = context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if !constant.OptionTypeEnum(in.OptionType).IsValid() {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if in.OptionType == string(constant.OptionTypeEnum_SubLesson) && in.LessonId == nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.OptionListGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(GetOptionsResponse{
		StatusResponse: constant.NewSuccessReponse(),
		Data:           data,
	})
}
