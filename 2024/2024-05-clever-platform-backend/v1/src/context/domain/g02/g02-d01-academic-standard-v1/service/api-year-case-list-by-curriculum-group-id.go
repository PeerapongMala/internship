package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type YearCaseListByCurriculumGroupIdResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.YearEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) YearCaseListByCurriculumGroupId(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	YearCaseListByCurriculumGroupIdOutput, err := api.Service.YearCaseListByCurriculumGroup(&YearCaseListByCurriculumGroupIdInput{
		Pagination:        pagination,
		CurriculumGroupId: curriculumGroupId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearCaseListByCurriculumGroupIdResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       YearCaseListByCurriculumGroupIdOutput.Years,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type YearCaseListByCurriculumGroupIdInput struct {
	Pagination        *helper.Pagination
	CurriculumGroupId int
}

type YearCaseListByCurriculumGroupIdOutput struct {
	Years []constant.YearEntity
}

func (service *serviceStruct) YearCaseListByCurriculumGroup(in *YearCaseListByCurriculumGroupIdInput) (*YearCaseListByCurriculumGroupIdOutput, error) {
	years, err := service.repositoryStorage.YearCaseListByCurriculumGroupId(in.Pagination, in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}

	return &YearCaseListByCurriculumGroupIdOutput{
		years,
	}, nil
}
