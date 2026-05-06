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

type ContractCaseListSubjectResponse struct {
	StatusCode int                                       `json:"status_code"`
	Pagination *helper.Pagination                        `json:"_pagination"`
	Data       []constant.ContractSubjectGroupDataEntity `json:"data"`
	Message    string                                    `json:"message"`
}

// ==================== Endpoint ==========================

// @Id ContractCaseListSubject
// @Tags School Affiliations
// @Summary List contract's subjects
// @Description list รายชื่อหลักสูตรของสัญญา
// @Security BearerAuth
// @Produce json
// @Param contractId path int false "contractId"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อหลักสูตร"
// @Param curriculum_group_id query int false "Id ของสังกัดวิชา"
// @Param year_id query int false "Id ของชั้นปี"
// @Param subject_group_id query int false "Id ของกลุ่มวิชา"
// @Success 200 {object} ContractCaseListSubjectResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/contract/{contractId}/subjects [get]
func (api *APiStruct) ContractCaseListSubjectGroup(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.ContractSubjectGroupFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractId, err := context.ParamsInt("contractId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contractCaseListSubjectOutput, err := api.Service.ContractCaseListSubjectGroup(&ContractCaseListSubjectGroupInput{
		ContractId: contractId,
		Filter:     &filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContractCaseListSubjectResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       contractCaseListSubjectOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ContractCaseListSubjectGroupInput struct {
	ContractId int
	Filter     *constant.ContractSubjectGroupFilter
	Pagination *helper.Pagination
}

type ContractCaseListSubjectGroupOutput struct {
	Subjects []constant.ContractSubjectGroupDataEntity
}

func (service *serviceStruct) ContractCaseListSubjectGroup(in *ContractCaseListSubjectGroupInput) (*ContractCaseListSubjectGroupOutput, error) {
	subjects, err := service.schoolAffiliationStorage.ContractCaseListSubjectGroup(in.ContractId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ContractCaseListSubjectGroupOutput{
		Subjects: subjects,
	}, nil
}
