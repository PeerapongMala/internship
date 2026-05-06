package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolAffiliationDoeListResponse struct {
	StatusCode int                                        `json:"status_code"`
	Pagination *helper.Pagination                         `json:"_pagination"`
	Data       []constant2.SchoolAffiliationDoeDataEntity `json:"data"`
	Message    string                                     `json:"message"`
}

// ==================== Endpoint ==========================

// @Id SchoolAffiliationDoeList
// @Tags School Affiliations
// @Summary List school affiliation doe
// @Description list สังกัดประเภท สนศ. กทม.
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param search_text query string false "ชื่อสังกัด"
// @Param type query string false "รัฐ / เอกชน"
// @Param district_zone query string false "กลุ่มเขต"
// @Param district query string false "เขต"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} SchoolAffiliationDoeListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /school-affiliations/v1/doe [get]
func (api *APiStruct) SchoolAffiliationDoeList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	schoolAffiliationDoeFilter := constant2.SchoolAffiliationDoeFilter{}
	err := context.QueryParser(&schoolAffiliationDoeFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolAffiliationDoeListOutput, err := api.Service.SchoolAffiliationDoeList(&SchoolAffiliationDoeListInput{
		Pagination: pagination,
		Filter:     &schoolAffiliationDoeFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationDoeListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationDoeListOutput.SchoolAffiliations,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolAffiliationDoeListInput struct {
	Pagination *helper.Pagination
	Filter     *constant2.SchoolAffiliationDoeFilter
}

type SchoolAffiliationDoeListOutput struct {
	SchoolAffiliations []constant2.SchoolAffiliationDoeDataEntity
}

func (service *serviceStruct) SchoolAffiliationDoeList(in *SchoolAffiliationDoeListInput) (*SchoolAffiliationDoeListOutput, error) {
	schoolAffiliations, err := service.schoolAffiliationStorage.SchoolAffiliationDoeList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationDoeListOutput{
		SchoolAffiliations: schoolAffiliations,
	}, nil
}
