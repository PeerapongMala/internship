package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) InitMessage(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.Message{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	validateReq := &constant.ValidateRequest{
		RoomType: "private",
		Role:     roles,
		SchoolID: request.SchoolID,
		UserID:   subjectId,
	}

	exists, err := api.Service.ValidatePrivilege(validateReq)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	} else if !exists {
		errMsg := "Unauthorized"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	content := "_init_"
	request.SenderID = subjectId
	request.RoomID = hashUUIDs(subjectId, *request.ReceiverID)
	request.Content = &content
	request.CreatedAt = time.Now().UTC()
	request.RoomType = "private"

	message, err := api.Service.InitMessage(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    *message,
	})
}

func (service *serviceStruct) InitMessage(filter *constant.Message) (*string, error) {
	message, err := service.teacherChatStorage.InitMessage(filter)
	if err != nil {
		return nil, err
	}
	return message, nil
}
