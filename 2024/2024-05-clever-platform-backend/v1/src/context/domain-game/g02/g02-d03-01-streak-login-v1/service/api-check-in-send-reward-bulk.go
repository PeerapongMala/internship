package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type CheckInBulkRequest struct {
	BulkEditList []CheckInRequest `json:"bulk_edit_list" validate:"required,dive"`
}

// ==================== Response ==========================
type CheckInBulkResponse struct {
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) CheckInBulkSendReward(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &CheckInBulkRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	for _, request := range request.BulkEditList {
		request.UserId = userId
		err = api.Service.CheckInSendReward(&CheckInSendRewardInput{
			CheckInRequest: &request,
		})

		if err != nil && err.Error() != "success with checkin date is before than last checkin" {
			return context.Status(http.StatusInternalServerError).JSON(constant.StatusResponse{
				StatusCode: http.StatusInternalServerError,
				Message:    err.Error(),
			},
			)
		}
	}

	return context.Status(http.StatusOK).JSON(CheckInBulkResponse{
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "success",
		},
	})
}
