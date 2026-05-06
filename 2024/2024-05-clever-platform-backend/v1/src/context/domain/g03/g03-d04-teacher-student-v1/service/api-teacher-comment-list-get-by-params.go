package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type TeacherCommnetResponse struct {
	StatusCode int                             `json:"status_code"`
	Message    string                          `json:"message"`
	Data       []constant.TeacherCommentEntity `json:"data"`
}

func (api *APIStruct) TeacherCommentListGetByParams(context *fiber.Ctx) error {
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

	in := constant.TeacherCommentFilter{
		Student: constant.StudentParam{
			StudentId: studentId,
		},
		AcademicYear: academicYear,
	}
	if err := context.QueryParser(&in); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	in.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT)

	data, err := api.Service.TeacherCommentListGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(TeacherCommnetResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) TeacherCommentListGetByParams(in constant.TeacherCommentFilter) ([]constant.TeacherCommentEntity, error) {
	in.Student.UserId = in.Student.StudentId
	data, err := service.repositoryTeacherStudent.TeacherCommentListGetByParams(in)
	if err != nil {
		return nil, err
	}

	for i, comment := range data {
		if comment.ImageUrl != "" {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(comment.ImageUrl)
			if err != nil {
				return nil, err
			}
			data[i].ImageUrl = *url
		}
	}

	return data, nil
}
