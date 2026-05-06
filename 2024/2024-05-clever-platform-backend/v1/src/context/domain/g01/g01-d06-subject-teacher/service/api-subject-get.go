package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectGetRequest struct {
	SubjectId int `params:"subjectId" validate:"required"`
}

// ==================== Response ==========================

type SubjectGetResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectGetOutput, err := api.Service.SubjectGet(&SubjectGetInput{
		SubjectGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectEntity{subjectGetOutput.Subject},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectGetInput struct {
	*SubjectGetRequest
}

type SubjectGetOutput struct {
	Subject constant.SubjectEntity
}

func (service *serviceStruct) SubjectGet(in *SubjectGetInput) (*SubjectGetOutput, error) {
	subject, err := service.subjectTeacherStorage.SubjectGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &SubjectGetOutput{*subject}, nil
}
