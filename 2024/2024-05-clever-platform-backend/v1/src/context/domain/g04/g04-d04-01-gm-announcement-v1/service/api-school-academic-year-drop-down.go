package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SchoolAcademicYear(context *fiber.Ctx) error {
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	pagination := helper.PaginationNew(context)

	response, err := api.Service.SchoolAcademicYear(schoolId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)

	}
	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
		Data:       response,
		Message:    "data received",
	})
}
func (service *serviceStruct) SchoolAcademicYear(schoolId int, pagination *helper.Pagination) ([]constant.AcademicYearResponse, error) {
	response, err := service.GmannounceStorage.SchoolAcademicYear(schoolId, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err

	}
	return response, nil
}
