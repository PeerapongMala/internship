package service

import (
	"fmt"
	"log"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) AnnouncementBulkEdit(context *fiber.Ctx) error {
	req := []constant.AnnouncementBulkEdit{}
	err := context.BodyParser(&req)
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
	err = api.Service.AnnouncementBulkEdit(req, RolesCheck)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement Updated",
	})
}
func (serivce *serviceStruct) AnnouncementBulkEdit(req []constant.AnnouncementBulkEdit, Role constant.CheckRoleRequest) error {
	var Admin *string
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			Admin = &Role.SubjectId
			break
		}
	}

	for _, v := range req {
		request := constant.AnnouncementBulkEdit{
			Id:           v.Id,
			Status:       v.Status,
			UpdatedBy:    Role.SubjectId,
			AdminLoginAs: Admin,
		}
		err := serivce.TeacherannounceStorage.AnnouncementBulkEdit(request)
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
