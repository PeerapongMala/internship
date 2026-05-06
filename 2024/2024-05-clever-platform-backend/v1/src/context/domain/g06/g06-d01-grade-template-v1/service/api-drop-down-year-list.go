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

type YearListResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.YearEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) YearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	yearListOutput, err := api.Service.YearList(&YearListInput{
		Pagination: pagination,
		SchoolId:   schoolId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(YearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       yearListOutput.Years,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type YearListInput struct {
	Pagination *helper.Pagination
	SchoolId   int
}

type YearListOutput struct {
	Years []constant.YearEntity
}

func (service *serviceStruct) YearList(in *YearListInput) (*YearListOutput, error) {
	years, err := service.gradeTemplateStorage.YearList(in.Pagination, in.SchoolId)
	if err != nil {
		return nil, err
	}

	return &YearListOutput{
		Years: years,
	}, nil
}
