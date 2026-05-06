package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AddMemberRequest struct {
	FamilyID int    `json:"family_id"`
	UserID   string `json:"user_id"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) AddMember(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AddMemberRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AddMember(request.FamilyID, request.UserID)
	if err != nil {
		//errMsg := err.Error()
		//return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Add member success",
	})
}

func (service *serviceStruct) AddMember(familyID int, userID string) error {
	err := service.lineParentStorage.AddMember(familyID, userID)
	if err != nil {
		return err
	}
	return nil
}
