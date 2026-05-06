package service

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) UpdateSubjectStatus(context *fiber.Ctx) error {
	SchoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	req := constant.UpdatedSubjectRequest{}
	err = context.BodyParser(&req)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	req.SchoolId = SchoolId
	req.SubjectId = SubjectId
	err = api.Service.UpdateSubjectStatus(req)
	if err != nil {
		if err.Error() == "no row update" {
			msg := "School id or Subject id is not exist"
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusNotFound, &msg))
		}

		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Status Updated",
	})
}
func (service *serviceStruct) UpdateSubjectStatus(req constant.UpdatedSubjectRequest) error {
	err := service.adminSchoolStorage.UpdateSubjectStatus(req)
	if err != nil {
		if err.Error() == "no row update" {
			return fmt.Errorf("no row update")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
