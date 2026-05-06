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

func (api *APIStruct) TeacherRewardCallBack(context *fiber.Ctx) error {
	rewardId, err := context.ParamsInt("rewardId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.CallbackUpdate{
		Id:        rewardId,
		SubjectId: subjectId,
		Roles:     roles,
	}
	err = api.Service.TeacherRewardCallBack(req)
	if err != nil {

		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward callback",
	})
}
func (service *serviceStruct) TeacherRewardCallBack(req constant.CallbackUpdate) error {
	var Admin *string
	for _, role := range req.Roles {
		if role == int(userConstant.Admin) {
			Admin = &req.SubjectId
			break
		}
	}
	received, err := service.teacherRewardStorage.CheckReceived(req.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if received {
		msg := fmt.Sprintf(`Reward id %d cannot callback , student already received`, req.Id)
		return helper.NewHttpError(http.StatusConflict, &msg)
	}
	err = service.teacherRewardStorage.TeacherRewardCallBack(req.Id, req.SubjectId, Admin)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
