package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectTemplateListRequest struct {
	constant.SubjectTemplateFilter
}

// ==================== Response ==========================

type SubjectTemplateListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.SubjectTemplateEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTemplateList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTemplateListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectTemplateListOutput, err := api.Service.SubjectTemplateList(&SubjectTemplateListInput{
		UserId:                     subjectId,
		SubjectTemplateListRequest: request,
		Pagination:                 pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTemplateListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectTemplateListOutput.Templates,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectTemplateListInput struct {
	UserId string
	*SubjectTemplateListRequest
	Pagination *helper.Pagination
}

type SubjectTemplateListOutput struct {
	Templates []constant.SubjectTemplateEntity
}

func (service *serviceStruct) SubjectTemplateList(in *SubjectTemplateListInput) (*SubjectTemplateListOutput, error) {
	subjectTemplates, err := service.subjectTemplateStorage.SubjectTemplateList(&in.SubjectTemplateFilter, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &SubjectTemplateListOutput{
		Templates: subjectTemplates,
	}, nil
}
