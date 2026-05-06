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

type SchoolAffiliationCaseListContractResponse struct {
	StatusCode int                                       `json:"status_code"`
	Pagination *helper.Pagination                        `json:"_pagination"`
	Data       []constant2.ContractWithSchoolCountEntity `json:"data"`
	Message    string                                    `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationCaseListContract
// @Tags School Affiliations
// @Summary List school affiliation's contracts
// @Description list สัญญาของสังกัดโรงเรียน
// @Security BearerAuth
// @Produce json
// @Param schoolAffiliationId path int true "schoolAffiliationId"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อสัญญา"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} SchoolAffiliationCaseListContractResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/{schoolAffiliationId}/contracts [get]
func (api *APiStruct) SchoolAffiliationCaseListContract(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant2.ContractFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationId, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	schoolAffiliationCaseListContractOutput, err := api.Service.SchoolAffiliationCaseListContract(&SchoolAffiliationCaseListContractInput{
		SchoolAffiliationId: schoolAffiliationId,
		Filter:              &filter,
		Pagination:          pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationCaseListContractResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationCaseListContractOutput.Contracts,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolAffiliationCaseListContractInput struct {
	SchoolAffiliationId int
	Filter              *constant2.ContractFilter
	Pagination          *helper.Pagination
}

type SchoolAffiliationCaseListContractOutput struct {
	Contracts []constant2.ContractWithSchoolCountEntity
}

func (service *serviceStruct) SchoolAffiliationCaseListContract(in *SchoolAffiliationCaseListContractInput) (*SchoolAffiliationCaseListContractOutput, error) {
	contracts, err := service.schoolAffiliationStorage.SchoolAffiliationCaseListContract(in.SchoolAffiliationId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationCaseListContractOutput{
		Contracts: contracts,
	}, nil
}
