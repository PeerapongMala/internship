package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type TosCaseAcceptRequest struct {
	TosId int `json:"tos_id" validate:"required"`
}

// ==================== Response ==========================

type TosCaseAcceptResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TosCaseAccept(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TosCaseAcceptRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		msg := "Failed to retrieve subjectId from context"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &msg))
	}

	err = api.Service.TosCaseAccept(&TosCaseAcceptInput{
		SubjectId:            subjectId,
		TosCaseAcceptRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TosCaseAcceptResponse{
		StatusCode: http.StatusOK,
		Message:    "Accepted",
	})
}

// ==================== Service ==========================

type TosCaseAcceptInput struct {
	SubjectId string
	*TosCaseAcceptRequest
}

func (service *serviceStruct) TosCaseAccept(in *TosCaseAcceptInput) error {
	now := time.Now().UTC()
	err := service.termsStorage.TosAcceptanceCreate(&constant.TosAcceptanceEntity{
		UserId:     in.SubjectId,
		TosId:      in.TosId,
		AcceptedAt: &now,
	})
	if err != nil {
		return err
	}

	return nil
}
