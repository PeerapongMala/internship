package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudyGroupListResponse struct {
	StatusCode int                   `json:"status_code"`
	Message    string                `json:"message"`
	Data       []constant.StudyGroup `json:"data"`
}

func (api *APIStruct) StudyGroupListGetByParams(context *fiber.Ctx) error {

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

	filter := constant.StudyGroupFilter{
		Student: constant.StudentParam{
			StudentId: studentId,
		},
		AcademicYear: academicYear,
	}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.StudyGroupListGetByParams(filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudyGroupListResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) StudyGroupListGetByParams(in constant.StudyGroupFilter) ([]constant.StudyGroup, error) {
	ents, err := service.repositoryTeacherStudent.StudyGroupListGetByParams(in)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.StudyGroup, len(ents))
	for i, ent := range ents {
		resp[i] = constant.StudyGroup(ent)
	}
	return resp, nil
}
