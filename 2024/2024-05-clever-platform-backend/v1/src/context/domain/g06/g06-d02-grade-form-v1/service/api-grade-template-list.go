package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeTemplateListRequest struct {
	SchoolId int    `params:"schoolId" validate:"required"`
	Year     string `query:"year"`
}

type GradeTemplateListResponse struct {
	Pagination *helper.Pagination                 `json:"_pagination"`
	StatusCode int                                `json:"status_code"`
	Data       []constant.GradeTemplateListEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	gradeTemplateListOutput, err := api.Service.GradeTemplateList(&GradeTemplateListInput{
		Request:    *request,
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
	Request    GradeTemplateListRequest
	Pagination *helper.Pagination
}

type GradeTemplateListOutput struct {
	GradeTemplates []constant.GradeTemplateListEntity
}

func (service *serviceStruct) GradeTemplateList(in *GradeTemplateListInput) (*GradeTemplateListOutput, error) {
	gradeTemplates, err := service.gradeTemplateStorage.GradeTemplateList(in.Request.SchoolId, in.Request.Year, helper.ToPtr(true), []string{"enabled"}, in.Pagination, nil)
	if err != nil {
		return nil, err
	}

	template := []constant.GradeTemplateListEntity{}
	for _, v := range gradeTemplates {
		template = append(template, constant.GradeTemplateListEntity{
			Id:           v.Id,
			Year:         v.Year,
			TemplateName: v.TemplateName,
			Version:      v.Version,
			ActiveFlag:   v.ActiveFlag,
			Status:       v.Status,
			SubjectCount: v.SubjectCount,
		})
	}

	return &GradeTemplateListOutput{
		GradeTemplates: template,
	}, nil
}
