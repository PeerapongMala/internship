package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type SubjectListRequest struct {
	constant.SubjectFilter
}

// ==================== Response ==========================

type SubjectListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	subjectListOutput, err := api.Service.SubjectList(&SubjectListInput{
		Pagination:         pagination,
		SubjectListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectListInput struct {
	Pagination *helper.Pagination
	*SubjectListRequest
}

type SubjectListOutput struct {
	Subjects []constant.SubjectEntity
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	subjects, err := service.gamificationStorage.SubjectList(&in.SubjectFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SubjectListOutput{subjects}, nil
}
