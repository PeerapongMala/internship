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

type SchoolAffiliationLaoResponse struct {
	StatusCode int                                        `json:"status_code"`
	Pagination *helper.Pagination                         `json:"_pagination"`
	Data       []constant2.SchoolAffiliationLaoDataEntity `json:"data"`
	Message    string                                     `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationLaoList
// @Tags School Affiliations
// @Summary List school affiliation lao
// @Description list สังกัดประเภท อปท
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อสังกัด"
// @Param type query string false "รัฐ / เอกชน"
// @Param lao_type query string false "ประเภท อปท (อบจ / อบต / เทศบาลนคร / เทศบาลตำบล / เทศบาลอำเภอ)"
// @Param province query string false "จังหวัด"
// @Param district query string false "อำเภอ"
// @Param sub_district query string false "ตำบล"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} SchoolAffiliationLaoResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/lao [get]
func (api *APiStruct) SchoolAffiliationLaoList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolAffiliationFilter := constant2.SchoolAffiliationLaoFilter{}
	err := context.QueryParser(&schoolAffiliationFilter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationLaoListOutput, err := api.Service.SchoolAffiliationLaoList(&SchoolAffiliationLaoListInput{
		Pagination: pagination,
		Filter:     &schoolAffiliationFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationLaoResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationLaoListOutput.SchoolAffiliations,
		Message:    "Data retrieved",
	})
}

// ==================== Endpoint ==========================

type SchoolAffiliationLaoListInput struct {
	Pagination *helper.Pagination
	Filter     *constant2.SchoolAffiliationLaoFilter
}

type SchoolAffiliationLaoListOutput struct {
	SchoolAffiliations []constant2.SchoolAffiliationLaoDataEntity
}

func (service *serviceStruct) SchoolAffiliationLaoList(in *SchoolAffiliationLaoListInput) (*SchoolAffiliationLaoListOutput, error) {
	schoolAffiliations, err := service.schoolAffiliationStorage.SchoolAffiliationLaoList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationLaoListOutput{
		SchoolAffiliations: schoolAffiliations,
	}, nil
}
