package service

import (
	"fmt"
	"log"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GlobalAnnounceBulkEdit(context *fiber.Ctx) error {
	request := []constant.AnnounceBulkEdit{}
	err := context.BodyParser(&request)
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
	err = api.Service.GlobalAnnounceBulkEdit(request, RolesCheck)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement Updated",
	})
}

func (service *serviceStruct) GlobalAnnounceBulkEdit(req []constant.AnnounceBulkEdit, Role constant.CheckRoleRequest) error {
	var Admin *string
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			Admin = &Role.SubjectId
			break
		}
	}

	for _, v := range req {

		request := constant.AnnounceBulkEdit{
			Id:     v.Id,
			Status: v.Status,
		}
		user := constant.User{
			UpdatedBy:    Role.SubjectId,
			AdminLoginAs: Admin,
		}
		err := service.GmannounceStorage.GlobalAnnounceBulkEdit(request, user)
		if err != nil {
			if err.Error() == "no result" {
				msg := fmt.Sprintf("Id %d is not exist ", v.Id)
				return helper.NewHttpError(http.StatusNotFound, &msg)
			}
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

	}
	return nil
}
