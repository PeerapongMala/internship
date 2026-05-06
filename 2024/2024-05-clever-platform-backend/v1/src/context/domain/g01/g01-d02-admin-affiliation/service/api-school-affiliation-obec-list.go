package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolAffiliationObecListResponse struct {
	StatusCode int                                         `json:"status_code"`
	Pagination *helper.Pagination                          `json:"_pagination"`
	Data       []constant2.SchoolAffiliationObecDataEntity `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationObecList
// @Tags School Affiliations
// @Summary List school affiliation obec
// @Description list สังกัดโรงเรียนประเภท สพฐ
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อสังกัด"
// @Param inspection_area query string false "เขตตรวจราชการ"
// @Param area_office query string false "สำนักงานเขตพื้นที่"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} SchoolAffiliationObecListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/obec [get]
func (api *APiStruct) SchoolAffiliationObecList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolAffiliationFilter := constant2.SchoolAffiliationObecFilter{}
	err := context.QueryParser(&schoolAffiliationFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationObecListOutput, err := api.Service.SchoolAffiliationObecList(&SchoolAffiliationObecListInput{
		Pagination: pagination,
		Filter:     &schoolAffiliationFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationObecListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationObecListOutput.SchoolAffiliations,
		Message:    "Data received",
	})
}

// ==================== Service ==========================

type SchoolAffiliationObecListInput struct {
	Pagination *helper.Pagination
	Filter     *constant2.SchoolAffiliationObecFilter
}

type SchoolAffiliationObecListOutput struct {
	SchoolAffiliations []constant2.SchoolAffiliationObecDataEntity
}

func (service *serviceStruct) SchoolAffiliationObecList(in *SchoolAffiliationObecListInput) (*SchoolAffiliationObecListOutput, error) {
	schoolAffiliations, err := service.schoolAffiliationStorage.SchoolAffiliationObecList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &SchoolAffiliationObecListOutput{
		SchoolAffiliations: schoolAffiliations,
	}, nil
}
