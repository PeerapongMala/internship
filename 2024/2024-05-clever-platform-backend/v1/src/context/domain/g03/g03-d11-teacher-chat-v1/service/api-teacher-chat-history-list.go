package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
type ChatHistoryListInput struct {
	SchoolID   int    `params:"school_id"`
	RoomID     string `params:"room_id"`
	RoomType   string `params:"room_type"`
	Limit      int
	BeforeTime string `query:"before"`
}

func (api *APIStruct) ChatHistoryList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ChatHistoryListInput{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	var beforeTime time.Time
	if request.BeforeTime != "" {
		beforeTime, err = time.Parse(time.RFC3339, request.BeforeTime)
		if err != nil {
			errMsg := err.Error()
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
		}
	} else {
		beforeTime = time.Now().UTC()
	}

	if request.RoomType == "private" {
		request.RoomID = hashUUIDs(request.RoomID, subjectId)
	}

	messages, err := api.Service.ChatHistoryList(&constant.ListInput{
		SchoolID:   request.SchoolID,
		RoomID:     request.RoomID,
		RoomType:   context.Params("room_type"),
		Limit:      int(pagination.Limit.Int64),
		BeforeTime: beforeTime,
	})
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListOutput{
		StatusCode: http.StatusOK,
		Data:       messages,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) ChatHistoryList(in *constant.ListInput) ([]*constant.MessageList, error) {
	messages, err := service.teacherChatStorage.ChatHistoryList(in)
	if err != nil {
		return nil, err
	}

	for i, message := range messages {
		if message.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*message.ImageUrl)
			if err != nil {
				return nil, err
			}
			messages[i].ImageUrl = url
		}
	}

	return messages, nil
}
