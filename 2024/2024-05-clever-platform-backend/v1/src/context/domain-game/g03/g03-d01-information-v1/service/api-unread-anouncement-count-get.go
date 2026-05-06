package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================
type UnreadAnouncementCountResponse struct {
	Data *constant.CountResponse `json:"data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) UnreadAnouncementCountGet(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.UnreadAnouncementCountCountGet(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(resp)
}

// ==================== Service ==========================
func (service *serviceStruct) UnreadAnouncementCountCountGet(userId string) (*UnreadAnouncementCountResponse, error) {
	count, err := service.informationStorage.GetUnreadAnnouncementCountByUserId(userId)
	if err != nil {
		return nil, err
	}

	return &UnreadAnouncementCountResponse{
		Data: &constant.CountResponse{
			Name:  "anouncement",
			Count: count,
		},
	}, nil
}
