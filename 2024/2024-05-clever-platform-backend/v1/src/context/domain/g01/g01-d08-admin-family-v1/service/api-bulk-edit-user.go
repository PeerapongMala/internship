package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type UserBulkEditRequest struct {
	FamilyID int      `params:"family_id"`
	Users    []string `json:"users"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UserBulkEditRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.UserBulkEdit(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) UserBulkEdit(in *UserBulkEditRequest) error {
	tx, err := service.adminFamilyStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, userID := range in.Users {
		err = service.adminFamilyStorage.DeleteMember(tx, in.FamilyID, userID)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
