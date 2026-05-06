package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
type DeleteMember struct {
	FamilyID int    `params:"family_id"`
	UserID   string `query:"user_id"`
}

func (api *APIStruct) DeleteMember(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &DeleteMember{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.DeleteMember(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Delete Success",
	})
}

func (service *serviceStruct) DeleteMember(req *DeleteMember) error {
	err := service.adminFamilyStorage.DeleteMember(nil, req.FamilyID, req.UserID)
	if err != nil {
		return err
	}

	return nil
}
