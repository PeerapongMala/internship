package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetSchoolAffiliation(context *fiber.Ctx) error {
	id, err := context.ParamsInt("schoolAffiliationId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	response, err := api.Service.GetSchoolAffiliation(id)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Data retrived",
	})
}
func (service *serviceStruct) GetSchoolAffiliation(SchoolAffiliationId int) (constant.SchoolAffilation, error) {
	response, err := service.adminSchoolStorage.GetSchoolAffiliation(SchoolAffiliationId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return response, err
	}
	return response, nil
}
