package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type gradeGeneralTemplateListRequest struct {
	SchoolId int    `params:"schoolId"`
	Status   string `query:"status"`
}

type GradeGeneralTemplateListResponse struct {
	Pagination *helper.Pagination                    `json:"_pagination"`
	StatusCode int                                   `json:"status_code"`
	Data       []constant.GradeGeneralTemplateEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeGeneralTemplateList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &gradeGeneralTemplateListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	if request.SchoolId == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	GradeGeneralTemplateOutput, err := api.Service.GradeGeneralTemplateList(&GradeGeneralTemplateListInput{
		SchoolId:   request.SchoolId,
		Status:     request.Status,
		Pagination: pagination,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeGeneralTemplateListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       GradeGeneralTemplateOutput.GradeTemplates,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GradeGeneralTemplateListInput struct {
	SchoolId   int
	Pagination *helper.Pagination
	Status     string
}

type GradeGeneralTemplateListOutput struct {
	GradeTemplates []constant.GradeGeneralTemplateEntity
}

func (service *serviceStruct) GradeGeneralTemplateList(in *GradeGeneralTemplateListInput) (*GradeGeneralTemplateListOutput, error) {
	gradeTemplates, err := service.gradeTemplateStorage.GradeGeneralTemplateList(in.SchoolId, in.Status, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &GradeGeneralTemplateListOutput{
		GradeTemplates: gradeTemplates,
	}, nil
}
