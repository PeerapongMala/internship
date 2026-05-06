package service

import (
	"log"
	"net/http"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ContractCaseListSchoolResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       []interface{}      `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

// @Id ContractCaseListSchool
// @Tags School Affiliations
// @Summary List contract's schools
// @Description list รายชื่อโรงเรียนของสัญญา
// @Security BearerAuth
// @Produce json
// @Param contractId path int false "contractId"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "รหัสย่อโรงเรียน / ชื่อโรงเรียน"
// @Success 200 {object} ContractCaseListSchoolResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/contract/{contractId}/schools [get]
func (api *APiStruct) ContractCaseListSchool(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant2.ContractSchoolFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractCaseListSchool, err := api.Service.ContractCaseListSchool(&ContractCaseListSchoolInput{
		ContractId: contractId,
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseListSchoolResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       contractCaseListSchool.Schools,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ContractCaseListSchoolInput struct {
	ContractId int
	Pagination *helper.Pagination
	Filter     *constant2.ContractSchoolFilter
}

type ContractCaseListSchoolOutput struct {
	Schools []interface{}
}

func (service *serviceStruct) ContractCaseListSchool(in *ContractCaseListSchoolInput) (*ContractCaseListSchoolOutput, error) {
	schools, err := service.schoolAffiliationStorage.ContractCaseListSchool(in.ContractId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ContractCaseListSchoolOutput{
		Schools: schools,
	}, nil
}
