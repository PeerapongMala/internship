package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AcademicYearListRequest struct {
	SchoolId int `query:"school_id"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) AcademicYearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &AcademicYearListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	data, err := api.Service.AcademicYearList(pagination, request.SchoolId)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) AcademicYearList(pagination *helper.Pagination, schoolId int) ([]*int, error) {
	academicYear, err := service.adminFamilyStorage.AcademicYearList(pagination, schoolId)
	if err != nil {
		return nil, err
	}
	return academicYear, nil
}
