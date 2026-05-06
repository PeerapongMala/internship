package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetAnnouncementByid(context *fiber.Ctx) error {
	Id, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	response, err := api.Service.GetAnnouncementByid(Id, RolesCheck)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Data retrived",
	})
}
func (service *serviceStruct) GetAnnouncementByid(announceId int, Role constant.CheckRoleRequest) (*constant.TeacherAnnounceResponse, error) {
	response, err := service.TeacherannounceStorage.GetAnnouncementByid(announceId)
	if err != nil {
		if err.Error() == "not found" {
			msg := fmt.Sprintf("not found announcement id %d", announceId)
			return nil, helper.NewHttpError(http.StatusNotFound, &msg)
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if response.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*response.ImageUrl)
		response.ImageUrl = url
		if err != nil {
			return nil, err
		}

	}
	return response, err
}
