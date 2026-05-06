package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type CurriculumGroupListRequest struct {
	UserId string `params:"userId" validate:"required"`
}

// ==================== Response ==========================

type CurriculumGroupListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

func (api *APIStruct) CurriculumGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	curriculumGroupListOutput, err := api.Service.CurriculumGroupList(&CurriculumGroupListInput{
		Pagination:                 pagination,
		CurriculumGroupListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       curriculumGroupListOutput.CurriculumGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type CurriculumGroupListInput struct {
	Pagination *helper.Pagination
	*CurriculumGroupListRequest
}

type CurriculumGroupListOutput struct {
	CurriculumGroups []constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupList(in *CurriculumGroupListInput) (*CurriculumGroupListOutput, error) {
	curriculumGroups, err := service.adminReportStorage.CurriculumGroupList(in.Pagination, in.UserId)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupListOutput{
		curriculumGroups,
	}, nil
}
