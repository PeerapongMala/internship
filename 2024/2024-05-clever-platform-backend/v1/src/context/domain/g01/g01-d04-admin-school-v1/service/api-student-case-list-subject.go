package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListSubjectResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListSubject(context *fiber.Ctx) error {
	userId := context.Params("userId")

	filter, err := helper.ParseAndValidateRequest(context, &constant.SubjectFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studentCaseListSubjectOutput, err := api.Service.StudentCaseListSubject(&StudentCaseListSubjectInput{
		UserId: userId,
		Filter: filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListSubjectResponse{
		StatusCode: http.StatusOK,
		Data:       studentCaseListSubjectOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListSubjectInput struct {
	UserId string
	Filter *constant.SubjectFilter
}

type StudentCaseListSubjectOutput struct {
	Subjects []constant.SubjectEntity
}

func (service *serviceStruct) StudentCaseListSubject(in *StudentCaseListSubjectInput) (*StudentCaseListSubjectOutput, error) {
	subjects, err := service.adminSchoolStorage.StudentCaseListSubject(in.UserId, in.Filter)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListSubjectOutput{
		Subjects: subjects,
	}, nil
}
