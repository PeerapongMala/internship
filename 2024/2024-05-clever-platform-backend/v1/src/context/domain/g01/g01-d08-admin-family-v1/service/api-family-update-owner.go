package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
type ChangeOwner struct {
	FamilyID int    `json:"family_id" params:"family_id"`
	UserID   string `json:"user_id"`
}

func (api *APIStruct) UpdateFamilyOwner(context *fiber.Ctx) error {
	owner, err := helper.ParseAndValidateRequest(context, &ChangeOwner{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, owner)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.UpdateFamilyOwner(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Update Success",
	})
}

func (service *serviceStruct) UpdateFamilyOwner(req *ChangeOwner) error {
	err := service.adminFamilyStorage.UpdateFamilyOwner(nil, req.UserID, req.FamilyID)
	if err != nil {
		return err
	}
	return nil
}
