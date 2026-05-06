package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type SubjectGroupListRequest struct {
	PlatformId int `params:"platformId" validate:"required"`
	SeedYearId int `query:"seed_year_id"`
}

// ==================== Response ==========================

type SubjectGroupListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.SubjectGroupEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SubjectGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SubjectGroupListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectGroupListOutput, err := api.Service.SubjectGroupList(&SubjectGroupListInput{
		Pagination:              pagination,
		SubjectGroupListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectGroupListOutput.SubjectGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectGroupListInput struct {
	Pagination *helper.Pagination
	*SubjectGroupListRequest
}

type SubjectGroupListOutput struct {
	SubjectGroups []constant.SubjectGroupEntity
}

func (service *serviceStruct) SubjectGroupList(in *SubjectGroupListInput) (*SubjectGroupListOutput, error) {
	subjectGroups, err := service.schoolAffiliationStorage.SubjectGroupList(in.Pagination, in.SeedYearId, in.PlatformId)
	if err != nil {
		return nil, err
	}

	return &SubjectGroupListOutput{
		SubjectGroups: subjectGroups,
	}, nil
}
