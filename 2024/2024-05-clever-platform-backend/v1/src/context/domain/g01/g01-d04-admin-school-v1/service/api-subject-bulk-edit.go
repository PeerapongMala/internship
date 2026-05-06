package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SubjectBulkEdit(context *fiber.Ctx) error {
	SchoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	request := []constant.SubjectBulkEdit{}
	err = context.BodyParser(&request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	err = api.Service.SubjectBulkEdit(SchoolId, request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Subject status update",
	})
}
func (service *serviceStruct) SubjectBulkEdit(SchoolId int, req []constant.SubjectBulkEdit) error {

	for _, v := range req {

		request := constant.SubjectBulkEdit{
			SubjectId: v.SubjectId,
			IsEnabled: v.IsEnabled,
		}
		err := service.adminSchoolStorage.SubjectBulkEdit(SchoolId, request)
		if err != nil {
			if err.Error() == "row not update" {
				msg := fmt.Sprintf("Subject Id %d is not exist", v.SubjectId)
				return helper.NewHttpError(http.StatusNotFound, &msg)
			}
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
