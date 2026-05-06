package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.SubjectListDataEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SubjectList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.SubjectFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectListOutput, err := api.Service.SubjectList(&SubjectListInput{
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectListInput struct {
	Pagination *helper.Pagination
	Filter     *constant.SubjectFilter
}

type SubjectListOutput struct {
	Subjects []constant.SubjectListDataEntity
}

func (service *serviceStruct) SubjectList(in *SubjectListInput) (*SubjectListOutput, error) {
	subjects, err := service.schoolAffiliationStorage.SubjectList(in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	return &SubjectListOutput{Subjects: subjects}, nil
}
