package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (api *APIStruct) SchoolBulkEdit(context *fiber.Ctx) error {
	request := []constant.SchoolBulkEdit{}
	err := context.BodyParser(&request)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.SchoolBulkEdit(request, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "School status updated",
	})
}
func (service *serviceStruct) SchoolBulkEdit(req []constant.SchoolBulkEdit, SubjectId string) error {
	for _, v := range req {
		request := constant.SchoolBulkEdit{
			Id:     v.Id,
			Status: v.Status,
		}
		err := service.adminSchoolStorage.SchoolBulkEdit(request, SubjectId)
		if err != nil {
			if err.Error() == "row not update" {
				msg := fmt.Sprintf("Id %d is not exist ", v.Id)
				return helper.NewHttpError(http.StatusNotFound, &msg)
			}
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
