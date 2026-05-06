package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) RewardDeleteAll(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.RewardDeleteAll(SubjectId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward message deleted",
	})
}
func (service *serviceStruct) RewardDeleteAll(subjectId int, studentId string) error {
	pagination := helper.PaginationDefault()
	Rewardreq := constant.TeacherRewardRequest{
		SubjectId: subjectId,
		StudentId: studentId,
	}
	response, err := service.mailBoxStorage.TeacherRewardList(Rewardreq, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	for _, v := range response {
		received, err := service.mailBoxStorage.CheckTeacherRewardReceived(v.RewardId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if !received {
			msg := fmt.Sprintf("Cannot delete reward id %d user must received before delete message", v.RewardId)
			return helper.NewHttpError(http.StatusConflict, &msg)
		} else {
			service.mailBoxStorage.RewardDelete(v.RewardId)
		}
	}
	return nil
}
