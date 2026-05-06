package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================

func (api *APIStruct) ChatListStudent(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	filter, err := helper.ParseAndValidateRequest(context, &constant.ChatFilter{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter.UserID = subjectId

	chatList, err := api.Service.ChatListStudent(filter, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       chatList,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) ChatListStudent(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListStudent, error) {
	chatList, err := service.teacherChatStorage.ChatListStudent(filter, pagination)

	for i, chat := range chatList {
		if chat.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*chat.ImageUrl)
			if err != nil {
				return nil, err
			}
			chatList[i].ImageUrl = url
		}
	}
	if err != nil {
		return nil, err
	}
	return chatList, nil
}
