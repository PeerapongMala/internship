package service

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetSchool(context *fiber.Ctx) error {
	SchoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	response, err := api.Service.GetSchoolById(SchoolId)
	if err != nil {
		if err.Error() == "school id is not exist" {
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusNotFound, nil))
		}
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Data retrived",
	})
}
func (service *serviceStruct) GetSchoolById(SchoolId int) (constant.SchoolResponse, error) {
	response, err := service.adminSchoolStorage.GetSchoolById(SchoolId)
	if err != nil {
		if err == sql.ErrNoRows {
			return constant.SchoolResponse{}, fmt.Errorf("school id is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return constant.SchoolResponse{}, err
	}
	if response.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*response.ImageUrl)
		response.ImageUrl = url
		if err != nil {
			return constant.SchoolResponse{}, err
		}
	}
	return response, nil
}
