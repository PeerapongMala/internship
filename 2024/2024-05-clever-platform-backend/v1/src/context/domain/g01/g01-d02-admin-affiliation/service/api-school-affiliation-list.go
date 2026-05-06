package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolAffiliationListResponse struct {
	StatusCode int                                 `json:"status_code"`
	Pagination *helper.Pagination                  `json:"_pagination"`
	Data       []constant2.SchoolAffiliationEntity `json:"data"`
	Message    string                              `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationList
// @Tags School Affiliations
// @Summary List school affiliation
// @Description list สังกัดโรงเรียน
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อสังกัด"
// @Param school_affiliation_group query string false "ประเภทของกลุ่มสังกัด (สช / สนศ. กทม. / สพฐ / อปท / อื่นๆ)"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} SchoolAffiliationListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/ [get]
func (api *APiStruct) SchoolAffiliationList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolAffiliationFilter := constant2.SchoolAffiliationFilter{}
	err := context.QueryParser(&schoolAffiliationFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationListOutput, err := api.Service.SchoolAffiliationList(&SchoolAffiliationListInput{
		Pagination: pagination,
		Filter:     &schoolAffiliationFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationListOutput.SchoolAffiliations,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolAffiliationListInput struct {
	Pagination *helper.Pagination
	Filter     *constant2.SchoolAffiliationFilter
}

type SchoolAffiliationListOutput struct {
	SchoolAffiliations []constant2.SchoolAffiliationEntity
}

func (service *serviceStruct) SchoolAffiliationList(in *SchoolAffiliationListInput) (*SchoolAffiliationListOutput, error) {
	schoolAffiliations, err := service.schoolAffiliationStorage.SchoolAffiliationList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationListOutput{
		SchoolAffiliations: schoolAffiliations,
	}, nil
}
