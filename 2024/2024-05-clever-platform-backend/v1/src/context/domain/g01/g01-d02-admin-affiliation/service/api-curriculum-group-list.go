package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type CurriculumGroupListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	curriculumGroupFilter, err := helper.ParseAndValidateRequest(context, &constant.CurriculumGroupFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
	}

	curriculumGroupListOutput, err := api.Service.CurriculumGroupList(&CurriculumGroupListInput{
		Filter:     curriculumGroupFilter,
		Pagination: pagination,
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
	Filter     *constant.CurriculumGroupFilter
	Pagination *helper.Pagination
}

type CurriculumGroupListOutput struct {
	CurriculumGroups []constant.CurriculumGroupEntity
}

func (service *serviceStruct) CurriculumGroupList(in *CurriculumGroupListInput) (*CurriculumGroupListOutput, error) {
	curriculumGroups, err := service.schoolAffiliationStorage.CurriculumGroupList(in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupListOutput{
		CurriculumGroups: curriculumGroups,
	}, nil
}
