package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolCaseListBySchoolAffiliationResponse struct {
	StatusCode int                                  `json:"status_code"`
	Pagination *helper.Pagination                   `json:"_pagination"`
	Data       []constant2.ContractSchoolDataEntity `json:"data"`
	Message    string                               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SchoolCaseListBySchoolAffiliation(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	searchText := context.Query("search_text")

	schoolCaseListBySchoolAffiliationOutput, err := api.Service.SchoolCaseListBySchoolAffiliation(&SchoolCaseListBySchoolAffiliationInput{
		Pagination:          pagination,
		SearchText:          searchText,
		SchoolAffiliationId: schoolAffiliationId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolCaseListBySchoolAffiliationResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolCaseListBySchoolAffiliationOutput.Schools,
		Message:    "Data retrieved",
	})

}

// ==================== Service ==========================

type SchoolCaseListBySchoolAffiliationInput struct {
	Pagination          *helper.Pagination
	SearchText          string
	SchoolAffiliationId int
}

type SchoolCaseListBySchoolAffiliationOutput struct {
	Schools []constant2.ContractSchoolDataEntity
}

func (service *serviceStruct) SchoolCaseListBySchoolAffiliation(in *SchoolCaseListBySchoolAffiliationInput) (*SchoolCaseListBySchoolAffiliationOutput, error) {
	schools, err := service.schoolAffiliationStorage.SchoolCaseListBySchoolAffiliation(in.Pagination, in.SearchText, in.SchoolAffiliationId)
	if err != nil {
		return nil, err
	}

	return &SchoolCaseListBySchoolAffiliationOutput{
		Schools: schools,
	}, nil
}
