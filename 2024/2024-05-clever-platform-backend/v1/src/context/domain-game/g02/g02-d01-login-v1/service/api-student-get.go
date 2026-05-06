package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type StudentGetRequest struct {
	SchoolCode string `query:"school_code"`
	StudentId  string `query:"student_id"`
}

// ==================== Response ==========================

type StudentGetResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.PreLoginStudentEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentGetRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	studentGetOutput, err := api.Service.StudentGet(&StudentGetInput{
		StudentGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.PreLoginStudentEntity{*studentGetOutput.Student},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentGetInput struct {
	*StudentGetRequest
}

type StudentGetOutput struct {
	Student *constant.PreLoginStudentEntity
}

func (service *serviceStruct) StudentGet(in *StudentGetInput) (*StudentGetOutput, error) {
	student, err := service.loginStorage.StudentCaseGetBySchoolCodeStudentId(in.SchoolCode, in.StudentId)
	if err != nil {
		return nil, err
	}

	preLoginStudentEntity := &constant.PreLoginStudentEntity{
		Title:     student.Title,
		FirstName: student.FirstName,
		LastName:  student.LastName,
		ImagePath: student.ImagePath,
	}

	return &StudentGetOutput{preLoginStudentEntity}, nil
}
