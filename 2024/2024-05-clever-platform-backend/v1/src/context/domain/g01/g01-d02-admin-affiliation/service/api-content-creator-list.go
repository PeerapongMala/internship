package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ContentCreatorListResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ContentCreatorList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	userFilter, err := helper.ParseAndValidateRequest(context, &constant.UserFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
	}

	contentCreatorListOutput, err := api.Service.ContentCreatorList(&ContentCreatorListInput{
		Filter:     userFilter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContentCreatorListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       contentCreatorListOutput.ContentCreators,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ContentCreatorListInput struct {
	Filter     *constant.UserFilter
	Pagination *helper.Pagination
}

type ContentCreatorListOutput struct {
	ContentCreators []constant.UserEntity
}

func (service *serviceStruct) ContentCreatorList(in *ContentCreatorListInput) (*ContentCreatorListOutput, error) {
	contentCreators, err := service.schoolAffiliationStorage.ContentCreatorList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ContentCreatorListOutput{ContentCreators: contentCreators}, nil
}
