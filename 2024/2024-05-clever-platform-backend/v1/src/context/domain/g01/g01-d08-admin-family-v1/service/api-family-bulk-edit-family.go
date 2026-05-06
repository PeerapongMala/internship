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

type FamilyBulkEditRequest struct {
	// BulkEditList []constant.Family `json:"bulk_edit_list" validate:"required,dive"`
	FamilyIDs []int `json:"family_ids" validate:"required"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) FamilyBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &FamilyBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.FamilyBulkEdit(request.FamilyIDs)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) FamilyBulkEdit(familyIDs []int) error {
	tx, err := service.adminFamilyStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, familyID := range familyIDs {
		err := service.adminFamilyStorage.FamilyDelete(tx, familyID)
		if err != nil {
			msg := err.Error()
			return helper.NewHttpError(http.StatusInternalServerError, &msg)
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
