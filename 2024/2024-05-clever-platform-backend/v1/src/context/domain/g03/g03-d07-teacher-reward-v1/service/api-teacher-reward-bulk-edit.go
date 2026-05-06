package service

import (
	"fmt"
	"log"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherRewardBulkEdit(context *fiber.Ctx) error {
	body := []constant.TeacherRewardBulkEdit{}
	err := context.BodyParser(&body)
	if err != nil {
		msg := "body bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.TeacherRewardBulkEdit(body, subjectId, roles)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward callback",
	})
}
func (service *serviceStruct) TeacherRewardBulkEdit(req []constant.TeacherRewardBulkEdit, subjectId string, Roles []int) error {
	var Admin *string
	for _, role := range Roles {
		if role == int(userConstant.Admin) {
			Admin = &subjectId
			break
		}
	}
	for _, v := range req {
		received, err := service.teacherRewardStorage.CheckReceived(v.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if received {
			msg := fmt.Sprintf(`Reward id %d cannot callback , student already received`, v.Id)
			return helper.NewHttpError(http.StatusConflict, &msg)
		}
		err = service.teacherRewardStorage.TeacherRewardCallBack(v.Id, subjectId, Admin)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
