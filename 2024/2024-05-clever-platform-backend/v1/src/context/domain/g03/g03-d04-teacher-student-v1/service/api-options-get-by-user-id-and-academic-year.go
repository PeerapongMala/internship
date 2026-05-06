package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type GetOptionsResponse struct {
	StatusCode int                    `json:"status_code"`
	Message    string                 `json:"message"`
	Data       *constant.OptionObject `json:"data"`
}

func (api *APIStruct) OptionsGetByStudentIdAndAcademicYear(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYearStr := context.Params("academicYear")
	if academicYearStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in := constant.OptionFilter{
		Param: constant.OptionParam{
			Student: constant.StudentParam{
				StudentId: studentId,
			},
			TeacherId:    teacherId,
			AcademicYear: &academicYear,
		},
	}
	if err := context.QueryParser(&in); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if !constant.OptionTypeEnum(in.OptionType).IsValid() {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.OptionsGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(GetOptionsResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}
