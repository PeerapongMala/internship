package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type GradeTemplateListRequest struct {
	SchoolId   *int     `params:"schoolId" validate:"required"`
	Year       string   `query:"year"`
	Status     []string `query:"status"`
	ActiveFlag *bool    `query:"active_flag" `
	Search     *string  `query:"search"`
}

// ==================== Response ==========================

type GradeTemplateListResponse struct {
	Pagination *helper.Pagination                 `json:"_pagination"`
	StatusCode int                                `json:"status_code"`
	Data       []constant.GradeTemplateListEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	gradeTemplateListOutput, err := api.Service.GradeTemplateList(&GradeTemplateListInput{
		SchoolId:   helper.Deref(request.SchoolId),
		Year:       request.Year,
		ActiveFlag: request.ActiveFlag,
		Status:     request.Status,
		Search:     request.Search,
		Pagination: pagination,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       gradeTemplateListOutput.GradeTemplates,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GradeTemplateListInput struct {
	SchoolId   int
	Year       string
	ActiveFlag *bool
	Status     []string
	Search     *string
	Pagination *helper.Pagination
}
type GradeTemplateListOutput struct {
	GradeTemplates []constant.GradeTemplateListEntity
}

func (service *serviceStruct) GradeTemplateList(in *GradeTemplateListInput) (*GradeTemplateListOutput, error) {
	gradeTemplates, err := service.gradeTemplateStorage.GradeTemplateList(in.SchoolId, in.Year, in.ActiveFlag, in.Status, in.Pagination, in.Search)
	if err != nil {
		return nil, err
	}

	return &GradeTemplateListOutput{
		GradeTemplates: gradeTemplates,
	}, nil
}
